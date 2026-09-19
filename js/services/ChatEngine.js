/**
 * TECHPATH — REAL-TIME CHAT & SECURE MESSAGING ENGINE
 * Strict friendship-gated messaging, Supabase Realtime synchronization,
 * message persistence, delivery status, read receipts, and anti-abuse safeguards.
 */

import { dbStore } from '../db/store.js';
import { authContext } from '../context/AuthContext.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { ConnectEngine } from './ConnectEngine.js';
import { NotificationEngine } from './NotificationEngine.js';

export class ChatEngine {
  /**
   * Verify that a user is an authorized member of a conversation and that
   * friendship is active and not blocked.
   */
  static async assertAccess(conversationId, userId) {
    if (!conversationId || !userId) {
      throw new Error('Access Denied: Missing authentication or conversation parameters.');
    }

    // 1. Verify membership in conversation_members
    const allMembers = await dbStore.getAll('conversation_members');
    const conversationMembers = allMembers.filter(m => m.conversation_id === conversationId);
    
    const isMember = conversationMembers.some(m => m.user_id === userId);
    if (!isMember) {
      throw new Error('Access Denied: You are not an authorized member of this private conversation.');
    }

    // 2. Identify the peer user in the direct conversation
    const peerMember = conversationMembers.find(m => m.user_id !== userId);
    if (peerMember) {
      const peerId = peerMember.user_id;

      // Check for blocks
      const isBlocked = await ConnectEngine.isBlocked(userId, peerId);
      if (isBlocked) {
        throw new Error('Access Denied: Communication is restricted because one of the users has been blocked.');
      }

      // Check for accepted friendship
      const status = await ConnectEngine.getConnectionStatus(userId, peerId);
      if (status !== 'ACCEPTED') {
        throw new Error('Access Denied: You must be accepted friends to access private messaging.');
      }
    }

    return true;
  }

  /**
   * Get or create a direct conversation between two accepted friends
   */
  static async getOrCreateDirectConversation(user1Id, user2Id) {
    if (!user1Id || !user2Id) throw new Error('Invalid user credentials.');
    if (user1Id === user2Id) throw new Error('Cannot create a conversation with yourself.');

    // Enforce friendship requirement
    const status = await ConnectEngine.getConnectionStatus(user1Id, user2Id);
    if (status !== 'ACCEPTED') {
      throw new Error('Private messaging is only enabled between accepted friends. Please send a friend request first.');
    }

    // Enforce block check
    const isBlocked = await ConnectEngine.isBlocked(user1Id, user2Id);
    if (isBlocked) {
      throw new Error('Cannot initiate chat. One of the users is currently blocked.');
    }

    // Deterministic direct conversation ID
    const convId = `conv_${[user1Id, user2Id].sort().join('_')}`;

    let conv = await dbStore.getById('conversations', convId);
    if (!conv) {
      conv = {
        id: convId,
        type: 'direct',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await dbStore.insert('conversations', conv);

      // Add members
      await dbStore.insert('conversation_members', {
        id: `cm_${convId}_${user1Id}`,
        conversation_id: convId,
        user_id: user1Id,
        joined_at: new Date().toISOString()
      });
      await dbStore.insert('conversation_members', {
        id: `cm_${convId}_${user2Id}`,
        conversation_id: convId,
        user_id: user2Id,
        joined_at: new Date().toISOString()
      });
    }

    return conv;
  }

  /**
   * Get all active conversations for a user with unread counts and peer metadata
   */
  static async getUserConversations(userId) {
    if (!userId) return [];

    const allMembers = await dbStore.getAll('conversation_members');
    const userMemberships = allMembers.filter(m => m.user_id === userId);
    const convIds = userMemberships.map(m => m.conversation_id);

    const conversations = [];
    const allMessages = await dbStore.getAll('messages');

    for (const cid of convIds) {
      const conv = await dbStore.getById('conversations', cid);
      if (!conv) continue;

      // Find peer member
      const peerMember = allMembers.find(m => m.conversation_id === cid && m.user_id !== userId);
      if (!peerMember) continue;

      // Check if blocked
      const isBlocked = await ConnectEngine.isBlocked(userId, peerMember.user_id);
      if (isBlocked) continue;

      // Check if still friends
      const status = await ConnectEngine.getConnectionStatus(userId, peerMember.user_id);
      if (status !== 'ACCEPTED') continue;

      const peerProfile = await authContext.getPublicProfile(peerMember.user_id);

      // Calculate messages & unread count
      const msgs = allMessages.filter(m => m.conversation_id === cid);
      msgs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      const lastMessage = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      const unreadCount = msgs.filter(m => m.sender_id !== userId && !(m.read_by || []).includes(userId)).length;

      conversations.push({
        id: cid,
        peer: peerProfile,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          created_at: lastMessage.created_at,
          sender_id: lastMessage.sender_id
        } : null,
        unreadCount,
        updated_at: conv.updated_at || conv.created_at
      });
    }

    // Sort by recent activity descending
    conversations.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return conversations;
  }

  /**
   * Fetch message history for an authorized conversation
   */
  static async getMessages(conversationId, userId) {
    await this.assertAccess(conversationId, userId);

    let messages = await dbStore.filter('messages', m => m.conversation_id === conversationId);

    // If Supabase is connected, query messages to ensure full persistence
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          messages = data;
        }
      } catch { /* proceed with local store */ }
    }

    messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return messages;
  }

  /**
   * Send a message in a conversation
   */
  static async sendMessage({ conversationId, senderId, content }) {
    if (!content || !content.trim()) throw new Error('Message content cannot be empty.');
    if (content.length > 2000) throw new Error('Message exceeds maximum character limit of 2000.');

    await this.assertAccess(conversationId, senderId);

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 7)}`;
    const nowIso = new Date().toISOString();

    const message = {
      id: messageId,
      conversation_id: conversationId,
      sender_id: senderId,
      content: content.trim(),
      status: 'sent',
      read_by: [senderId],
      created_at: nowIso
    };

    // 1. Store in dbStore & Supabase
    await dbStore.insert('messages', message);
    await dbStore.update('conversations', conversationId, { updated_at: nowIso });

    // 2. Identify receiver for notification
    const members = await dbStore.filter('conversation_members', m => m.conversation_id === conversationId);
    const peer = members.find(m => m.user_id !== senderId);
    if (peer) {
      const sender = authContext.getUser();
      const senderName = sender?.name || 'A friend';
      try {
        await NotificationEngine.send(
          'social',
          `Message from ${senderName}`,
          content.length > 50 ? content.slice(0, 47) + '...' : content,
          `#/connect/chat?conversationId=${conversationId}`
        );
      } catch { /* proceed */ }
    }

    return message;
  }

  /**
   * Mark all messages in a conversation as read by the user
   */
  static async markConversationAsRead(conversationId, userId) {
    if (!conversationId || !userId) return;

    try {
      const msgs = await dbStore.filter('messages', m => m.conversation_id === conversationId);
      for (const m of msgs) {
        if (m.sender_id !== userId && !(m.read_by || []).includes(userId)) {
          const readBy = [...(m.read_by || []), userId];
          await dbStore.update('messages', m.id, { read_by: readBy });
        }
      }
    } catch { /* ignore */ }
  }

  /**
   * Delete a message (only sender or admin can delete)
   */
  static async deleteMessage(messageId, userId) {
    const msg = await dbStore.getById('messages', messageId);
    if (!msg) throw new Error('Message not found.');

    const isAdmin = authContext.isAdminUser();
    if (msg.sender_id !== userId && !isAdmin) {
      throw new Error('Unauthorized to delete this message.');
    }

    await dbStore.delete('messages', messageId);
    return { success: true };
  }

  /**
   * Real-time subscription helper with polling fallback
   * Ensures new messages arrive live without requiring a page refresh
   */
  static subscribeToConversation(conversationId, onMessage) {
    let active = true;
    let lastTimestamp = new Date().toISOString();

    // 1. Realtime socket channel if Supabase configured
    let channel = null;
    if (isSupabaseConfigured() && supabase?.channel) {
      try {
        channel = supabase.channel(`chat_${conversationId}`)
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          }, payload => {
            if (active && payload.new) {
              lastTimestamp = payload.new.created_at;
              onMessage(payload.new);
            }
          })
          .subscribe();
      } catch (e) {
        console.warn('[ChatEngine Realtime Notice]:', e.message);
      }
    }

    // 2. Reliable 2.5s Polling Fallback (ensures live updates even if WebSockets are closed)
    const intervalId = setInterval(async () => {
      if (!active) return;
      try {
        const msgs = await dbStore.filter('messages', m => 
          m.conversation_id === conversationId && new Date(m.created_at) > new Date(lastTimestamp)
        );
        if (msgs.length > 0) {
          msgs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          lastTimestamp = msgs[msgs.length - 1].created_at;
          for (const m of msgs) {
            onMessage(m);
          }
        }
      } catch { /* proceed */ }
    }, 2500);

    return () => {
      active = false;
      clearInterval(intervalId);
      if (channel && supabase?.removeChannel) {
        try { supabase.removeChannel(channel); } catch { /* ignore */ }
      }
    };
  }
}
