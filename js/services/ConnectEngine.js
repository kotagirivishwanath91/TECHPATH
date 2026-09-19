/**
 * TECHPATH — CONNECT & SOCIAL NETWORKING ENGINE
 * Database-backed peer discovery, TechPath ID search, normalized symmetric friendships,
 * Supabase-synchronized friend requests, blocking, reporting & strict chat gating.
 */

import { dbStore } from '../db/store.js';
import { authContext } from '../context/AuthContext.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { NotificationEngine } from './NotificationEngine.js';

export class ConnectEngine {
  /**
   * Helper: Canonical symmetric pair ordering (LEAST < GREATEST)
   */
  static getCanonicalPair(u1, u2) {
    if (u1 < u2) return { user_a_id: u1, user_b_id: u2 };
    return { user_a_id: u2, user_b_id: u1 };
  }

  /**
   * Resolve relationship status between two users
   * Returns: 'SELF' | 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED' | 'BLOCKED'
   */
  static async getConnectionStatus(currentUserId, targetUserId) {
    if (!currentUserId || !targetUserId) return 'NONE';
    if (currentUserId === targetUserId) return 'SELF';

    // 1. Check if blocked (IDB + Supabase)
    const isBlocked = await this.isBlocked(currentUserId, targetUserId);
    if (isBlocked) return 'BLOCKED';

    // 2. Check if accepted friends via normalized symmetric table (user_a_id < user_b_id)
    const { user_a_id, user_b_id } = this.getCanonicalPair(currentUserId, targetUserId);

    // Check Supabase friendships
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        const { data } = await supabase
          .from('friendships')
          .select('id')
          .eq('user_a_id', user_a_id)
          .eq('user_b_id', user_b_id)
          .maybeSingle();
        if (data) return 'ACCEPTED';
      } catch { /* proceed with local store */ }
    }

    // Check Local IDB friendships (support both normalized user_a_id/user_b_id and legacy user1_id/user2_id)
    try {
      const friendships = await dbStore.getAll('friendships');
      const isFriend = friendships.some(f =>
        (f.user_a_id === user_a_id && f.user_b_id === user_b_id) ||
        (f.user1_id === currentUserId && f.user2_id === targetUserId) ||
        (f.user1_id === targetUserId && f.user2_id === currentUserId)
      );
      if (isFriend) return 'ACCEPTED';
    } catch { /* proceed */ }

    // 3. Check pending requests
    // Check Supabase friend_requests
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        const { data: reqs } = await supabase
          .from('friend_requests')
          .select('*')
          .eq('status', 'pending')
          .or(`and(requester_user_id.eq.${currentUserId},receiver_user_id.eq.${targetUserId}),and(requester_user_id.eq.${targetUserId},receiver_user_id.eq.${currentUserId})`);
        
        if (reqs && reqs.length > 0) {
          const req = reqs[0];
          return req.requester_user_id === currentUserId ? 'PENDING_SENT' : 'PENDING_RECEIVED';
        }
      } catch { /* proceed */ }
    }

    // Check Local IDB friend_requests
    try {
      const requests = await dbStore.getAll('friend_requests');
      const pendingReq = requests.find(r => 
        r.status === 'pending' && (
          ((r.requester_user_id || r.sender_id) === currentUserId && (r.receiver_user_id || r.receiver_id) === targetUserId) ||
          ((r.requester_user_id || r.sender_id) === targetUserId && (r.receiver_user_id || r.receiver_id) === currentUserId)
        )
      );

      if (pendingReq) {
        const reqId = pendingReq.requester_user_id || pendingReq.sender_id;
        return reqId === currentUserId ? 'PENDING_SENT' : 'PENDING_RECEIVED';
      }
    } catch { /* proceed */ }

    return 'NONE';
  }

  /**
   * Search for a user strictly by their canonical unique TechPath ID (e.g. TP-XXXXXXXX)
   */
  static async searchByTechPathId(rawInput, currentUserId) {
    if (!rawInput) return { error: 'EMPTY_QUERY' };

    const cleanInput = String(rawInput).trim();
    // Validate format: must start with TP- and have valid alphanumeric characters
    const tpRegex = /^TP-[A-Za-z0-9_-]{3,20}$/i;
    if (!tpRegex.test(cleanInput)) {
      return { error: 'INVALID_FORMAT', message: 'Invalid TechPath ID format. Expected format: TP-XXXXXXXX' };
    }

    const cleanUpper = cleanInput.toUpperCase();

    // Check if user entered their own TechPath ID
    const currentUser = authContext.getUser();
    const ownTechpathId = currentUser?.profile?.techpath_id || currentUser?.techpath_id;
    if (ownTechpathId && ownTechpathId.toUpperCase() === cleanUpper) {
      const selfProfile = await authContext.getPublicProfile(currentUserId);
      return { isSelf: true, profile: selfProfile, connectionStatus: 'SELF' };
    }

    let targetProfile = null;

    // 1. Query Supabase profiles table directly by canonical techpath_id
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, techpath_id, department_id, department_name, branch_id, branch_name, specialization, semester_id, learning_level, bio, skills, career_goal, career_interests, github_url, linkedin_url, portfolio_url')
          .ilike('techpath_id', cleanUpper)
          .maybeSingle();

        if (data && data.id) {
          targetProfile = data;
        }
      } catch (err) {
        console.warn('Supabase TechPath ID query note:', err.message);
      }
    }

    // 2. Fallback to Local IDB & local memory
    if (!targetProfile) {
      targetProfile = await authContext.getPublicProfile(cleanUpper);
    }

    if (!targetProfile) {
      return { notFound: true, message: `No student registered with TechPath ID "${cleanInput}".` };
    }

    // Check if target is self
    if (targetProfile.id === currentUserId) {
      return { isSelf: true, profile: targetProfile, connectionStatus: 'SELF' };
    }

    // Resolve live connection status
    const connectionStatus = await this.getConnectionStatus(currentUserId, targetProfile.id);

    return {
      profile: targetProfile,
      connectionStatus
    };
  }

  /**
   * Discover peers with default branch isolation
   */
  static async getDiscoverableStudents({
    currentUserId,
    branchId = null,
    departmentId = null,
    semesterId = null,
    specialization = null,
    searchQuery = '',
    skillFilter = '',
    careerInterestFilter = ''
  } = {}) {
    let allProfiles = await dbStore.getAll('profiles');
    
    // Also fetch from Supabase if configured to guarantee fresh remote profiles
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        const { data } = await supabase.from('profiles').select('id, full_name, avatar_url, techpath_id, department_id, department_name, branch_id, branch_name, specialization, semester_id, learning_level, bio, skills, career_goal, career_interests, github_url, linkedin_url, portfolio_url');
        if (data && data.length > 0) {
          const map = new Map();
          allProfiles.forEach(p => map.set(p.id, p));
          data.forEach(p => map.set(p.id, { ...map.get(p.id), ...p }));
          allProfiles = Array.from(map.values());
        }
      } catch { /* proceed with local store */ }
    }

    // Filter out current user
    let list = allProfiles.filter(p => p.id !== currentUserId);

    // Filter out blocked users
    const blocks = await dbStore.getAll('user_blocks');
    const blockedUserIds = new Set();
    blocks.forEach(b => {
      if (b.blocker_id === currentUserId) blockedUserIds.add(b.blocked_id);
      if (b.blocked_id === currentUserId) blockedUserIds.add(b.blocker_id);
    });
    list = list.filter(p => !blockedUserIds.has(p.id));

    // Branch Filter (Default branch isolation)
    if (branchId && branchId !== 'all') {
      const bTarget = branchId.toLowerCase().trim();
      list = list.filter(p => (p.branch_id || '').toLowerCase().trim() === bTarget);
    }

    // Semester Filter
    if (semesterId && semesterId !== 'all') {
      list = list.filter(p => (p.semester_id || '').toLowerCase() === semesterId.toLowerCase());
    }

    // Specialization Filter
    if (specialization && specialization !== 'all') {
      const sTarget = specialization.toLowerCase();
      list = list.filter(p => (p.specialization || '').toLowerCase().includes(sTarget));
    }

    // Skill Filter
    if (skillFilter && skillFilter.trim().length > 0) {
      const sTerm = skillFilter.toLowerCase().trim();
      list = list.filter(p => {
        const skills = Array.isArray(p.skills) ? p.skills : (p.skills ? [p.skills] : []);
        return skills.some(s => s.toLowerCase().includes(sTerm));
      });
    }

    // Career Interest Filter
    if (careerInterestFilter && careerInterestFilter.trim().length > 0) {
      const cTerm = careerInterestFilter.toLowerCase().trim();
      list = list.filter(p => {
        const interests = Array.isArray(p.career_interests) ? p.career_interests : (p.career_interests ? [p.career_interests] : []);
        return interests.some(i => i.toLowerCase().includes(cTerm)) || (p.career_goal || '').toLowerCase().includes(cTerm);
      });
    }

    // Free-text Search
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        const name = (p.full_name || p.name || '').toLowerCase();
        const techId = (p.techpath_id || '').toLowerCase();
        const bio = (p.bio || p.description || '').toLowerCase();
        const skills = Array.isArray(p.skills) ? p.skills.join(' ').toLowerCase() : (p.skills || '').toLowerCase();
        return name.includes(q) || techId.includes(q) || bio.includes(q) || skills.includes(q);
      });
    }

    // Map each student to include public fields and connection status
    const results = await Promise.all(list.map(async p => {
      const status = await this.getConnectionStatus(currentUserId, p.id);
      return {
        id: p.id,
        techpath_id: p.techpath_id || `TP-00000000`,
        full_name: p.full_name || p.name || 'TechPath Engineer',
        avatar_url: p.avatar_url || null,
        department_id: p.department_id || 'eng',
        branch_id: p.branch_id || 'cse',
        specialization: p.specialization || 'Core Systems Engineering',
        semester_id: p.semester_id || 'sem_3',
        learning_level: p.learning_level || 'intermediate',
        skills: Array.isArray(p.skills) ? p.skills : (p.skills ? p.skills.split(',').map(s => s.trim()) : []),
        bio: p.bio || p.description || 'Passionate engineering student excited to collaborate on real-world projects.',
        career_goal: p.career_goal || 'Software Engineer',
        career_interests: Array.isArray(p.career_interests) ? p.career_interests : (p.career_interests ? p.career_interests.split(',').map(c => c.trim()) : ['Engineering']),
        github_url: p.github_url || null,
        linkedin_url: p.linkedin_url || null,
        portfolio_url: p.portfolio_url || null,
        connection_status: status
      };
    }));

    return results;
  }

  /**
   * Send a Friend Request (Dual Supabase & IDB with Duplicate Prevention)
   */
  static async sendFriendRequest(requesterId, receiverId) {
    if (!requesterId || !receiverId) throw new Error('Invalid friend request parameters.');
    if (requesterId === receiverId) throw new Error('You cannot send a friend request to yourself.');

    // 1. Verify blocking status
    const isBlocked = await this.isBlocked(requesterId, receiverId);
    if (isBlocked) throw new Error('Unable to send request. User interaction is restricted.');

    // 2. Check relationship status
    const status = await this.getConnectionStatus(requesterId, receiverId);
    if (status === 'ACCEPTED') throw new Error('You are already friends with this student.');
    if (status === 'PENDING_SENT') throw new Error('A friend request is already pending for this student.');
    
    // Requirement 4: "If User B already sent User A a pending request, handle this cleanly instead of creating a duplicate."
    if (status === 'PENDING_RECEIVED') {
      // Find the incoming request and accept it automatically
      const requests = await this.getFriendRequests(requesterId);
      const incoming = requests.received.find(r => (r.requester_user_id || r.sender_id) === receiverId);
      if (incoming) {
        return await this.acceptFriendRequest(incoming.id, requesterId);
      }
    }

    const requestId = `freq_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const requestItem = {
      id: requestId,
      requester_user_id: requesterId,
      receiver_user_id: receiverId,
      // Legacy compatibility fields
      sender_id: requesterId,
      receiver_id: receiverId,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save to local IDB
    await dbStore.insert('friend_requests', requestItem);

    // Save to Supabase
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        await supabase.from('friend_requests').upsert({
          id: requestId,
          requester_user_id: requesterId,
          receiver_user_id: receiverId,
          status: 'pending',
          created_at: requestItem.created_at,
          updated_at: requestItem.updated_at
        });
      } catch (err) {
        console.warn('Supabase friend request insert note:', err.message);
      }
    }

    // Send real in-app notification to receiver (Requirement 5)
    const sender = authContext.getUser();
    const senderName = sender?.profile?.full_name || sender?.name || 'A student';
    try {
      await NotificationEngine.send(
        'social',
        'New Friend Request',
        `${senderName} sent you a friend request.`,
        '#/connect/requests',
        receiverId,
        { relatedUserId: requesterId, relatedEntityId: requestId }
      );
    } catch { /* proceed */ }

    return requestItem;
  }

  /**
   * Cancel an outgoing friend request
   */
  static async cancelFriendRequest(requestId, senderId) {
    const req = await dbStore.getById('friend_requests', requestId);
    if (!req) throw new Error('Request not found.');
    const reqSender = req.requester_user_id || req.sender_id;
    if (reqSender !== senderId) throw new Error('Unauthorized to cancel this request.');

    await dbStore.delete('friend_requests', requestId);

    if (isSupabaseConfigured() && supabase?.from) {
      try {
        await supabase.from('friend_requests').delete().eq('id', requestId);
      } catch { /* proceed */ }
    }

    return { success: true };
  }

  /**
   * Accept an incoming friend request
   */
  static async acceptFriendRequest(requestId, receiverId) {
    let req = await dbStore.getById('friend_requests', requestId);

    if (!req && isSupabaseConfigured() && supabase?.from) {
      try {
        const { data } = await supabase.from('friend_requests').select('*').eq('id', requestId).maybeSingle();
        if (data) req = data;
      } catch { /* proceed */ }
    }

    if (!req) throw new Error('Friend request not found.');
    const reqReceiver = req.receiver_user_id || req.receiver_id;
    const reqSender = req.requester_user_id || req.sender_id;

    if (reqReceiver !== receiverId) throw new Error('Unauthorized to accept this request.');
    if (req.status === 'accepted') throw new Error('This friend request has already been accepted.');

    const now = new Date().toISOString();

    // 1. Update request status in IDB and Supabase
    await dbStore.update('friend_requests', requestId, { status: 'accepted', updated_at: now });
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        await supabase.from('friend_requests').update({ status: 'accepted', updated_at: now }).eq('id', requestId);
      } catch { /* proceed */ }
    }

    // 2. Create canonical symmetric friendship record (user_a_id < user_b_id)
    const { user_a_id, user_b_id } = this.getCanonicalPair(reqSender, receiverId);
    const friendshipId = `frnd_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const friendship = {
      id: friendshipId,
      user_a_id,
      user_b_id,
      // Legacy fields
      user1_id: user_a_id,
      user2_id: user_b_id,
      created_at: now
    };

    await dbStore.insert('friendships', friendship);
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        await supabase.from('friendships').upsert({
          id: friendshipId,
          user_a_id,
          user_b_id,
          created_at: now
        });
      } catch (err) {
        console.warn('Supabase friendship insert note:', err.message);
      }
    }

    // 3. Create or verify chat conversation thread
    const convId = `conv_${[reqSender, receiverId].sort().join('_')}`;
    const existingConv = await dbStore.getById('conversations', convId);
    if (!existingConv) {
      await dbStore.insert('conversations', {
        id: convId,
        type: 'direct',
        created_at: now,
        updated_at: now
      });
      await dbStore.insert('conversation_members', {
        id: `cm_${convId}_${reqSender}`,
        conversation_id: convId,
        user_id: reqSender,
        joined_at: now
      });
      await dbStore.insert('conversation_members', {
        id: `cm_${convId}_${receiverId}`,
        conversation_id: convId,
        user_id: receiverId,
        joined_at: now
      });
    }

    // 4. Notify the requester that their request was accepted
    const receiver = authContext.getUser();
    const receiverName = receiver?.profile?.full_name || receiver?.name || 'Your engineering peer';
    try {
      await NotificationEngine.send(
        'social',
        'Friend Request Accepted! 🎉',
        `${receiverName} accepted your friend request. You are now connected!`,
        `#/connect/chat?user=${receiverId}`,
        reqSender,
        { relatedUserId: receiverId, relatedEntityId: friendshipId }
      );
    } catch { /* proceed */ }

    return { success: true, friendshipId, conversationId: convId };
  }

  /**
   * Reject an incoming friend request
   */
  static async rejectFriendRequest(requestId, receiverId) {
    let req = await dbStore.getById('friend_requests', requestId);

    if (!req && isSupabaseConfigured() && supabase?.from) {
      try {
        const { data } = await supabase.from('friend_requests').select('*').eq('id', requestId).maybeSingle();
        if (data) req = data;
      } catch { /* proceed */ }
    }

    if (!req) throw new Error('Friend request not found.');
    const reqReceiver = req.receiver_user_id || req.receiver_id;
    if (reqReceiver !== receiverId) throw new Error('Unauthorized to reject this request.');

    const now = new Date().toISOString();
    await dbStore.update('friend_requests', requestId, { status: 'rejected', updated_at: now });

    if (isSupabaseConfigured() && supabase?.from) {
      try {
        await supabase.from('friend_requests').update({ status: 'rejected', updated_at: now }).eq('id', requestId);
      } catch { /* proceed */ }
    }

    return { success: true };
  }

  /**
   * Remove a friend
   */
  static async removeFriend(userId1, userId2) {
    const { user_a_id, user_b_id } = this.getCanonicalPair(userId1, userId2);

    // Delete from IDB
    const friendships = await dbStore.getAll('friendships');
    const target = friendships.find(f =>
      (f.user_a_id === user_a_id && f.user_b_id === user_b_id) ||
      (f.user1_id === userId1 && f.user2_id === userId2) ||
      (f.user1_id === userId2 && f.user2_id === userId1)
    );

    if (target) {
      await dbStore.delete('friendships', target.id);
    }

    // Delete from Supabase
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        await supabase.from('friendships')
          .delete()
          .eq('user_a_id', user_a_id)
          .eq('user_b_id', user_b_id);
      } catch { /* proceed */ }
    }

    // Clean up friend requests between the pair
    const requests = await dbStore.getAll('friend_requests');
    const relatedReq = requests.find(r =>
      ((r.requester_user_id || r.sender_id) === userId1 && (r.receiver_user_id || r.receiver_id) === userId2) ||
      ((r.requester_user_id || r.sender_id) === userId2 && (r.receiver_user_id || r.receiver_id) === userId1)
    );
    if (relatedReq) {
      await dbStore.delete('friend_requests', relatedReq.id);
      if (isSupabaseConfigured() && supabase?.from) {
        try {
          await supabase.from('friend_requests').delete().eq('id', relatedReq.id);
        } catch { /* proceed */ }
      }
    }

    return { success: true };
  }

  /**
   * Get all friends for a user with optional search/branch filter
   */
  static async getFriends(userId, { searchQuery = '', branchFilter = 'all' } = {}) {
    if (!userId) return [];

    let peerIds = [];

    // 1. Fetch from Supabase
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        const { data } = await supabase
          .from('friendships')
          .select('user_a_id, user_b_id')
          .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);
        if (data && data.length > 0) {
          peerIds = data.map(f => f.user_a_id === userId ? f.user_b_id : f.user_a_id);
        }
      } catch { /* proceed with IDB */ }
    }

    // 2. Fetch from IDB
    const friendships = await dbStore.getAll('friendships');
    const userFriendships = friendships.filter(f =>
      f.user_a_id === userId || f.user_b_id === userId ||
      f.user1_id === userId || f.user2_id === userId
    );

    userFriendships.forEach(f => {
      const pid = f.user_a_id === userId ? f.user_b_id :
                  f.user_b_id === userId ? f.user_a_id :
                  f.user1_id === userId ? f.user2_id : f.user1_id;
      if (pid && !peerIds.includes(pid)) peerIds.push(pid);
    });

    const friends = [];
    for (const pid of peerIds) {
      const publicProfile = await authContext.getPublicProfile(pid);
      if (publicProfile) {
        friends.push(publicProfile);
      }
    }

    let result = friends;

    if (branchFilter && branchFilter !== 'all') {
      result = result.filter(f => (f.branch_id || '').toLowerCase() === branchFilter.toLowerCase());
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(f =>
        (f.full_name || '').toLowerCase().includes(q) ||
        (f.techpath_id || '').toLowerCase().includes(q) ||
        (f.bio || '').toLowerCase().includes(q) ||
        (f.skills || []).some(s => s.toLowerCase().includes(q))
      );
    }

    return result;
  }

  /**
   * Get friend requests categorized by received and sent
   */
  static async getFriendRequests(userId) {
    if (!userId) return { received: [], sent: [] };

    let allReqs = [];

    // Supabase fetch
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        const { data } = await supabase
          .from('friend_requests')
          .select('*')
          .eq('status', 'pending')
          .or(`requester_user_id.eq.${userId},receiver_user_id.eq.${userId}`);
        if (data) allReqs = data;
      } catch { /* proceed */ }
    }

    // IDB fetch
    const idbReqs = await dbStore.getAll('friend_requests');
    const pendingIdb = idbReqs.filter(r => r.status === 'pending');

    const map = new Map();
    allReqs.forEach(r => map.set(r.id, r));
    pendingIdb.forEach(r => {
      if (!map.has(r.id)) map.set(r.id, r);
    });

    const pending = Array.from(map.values());
    const received = [];
    const sent = [];

    for (const r of pending) {
      const recId = r.receiver_user_id || r.receiver_id;
      const reqId = r.requester_user_id || r.sender_id;

      if (recId === userId) {
        const senderProfile = await authContext.getPublicProfile(reqId);
        if (senderProfile) {
          received.push({ ...r, peer: senderProfile });
        }
      } else if (reqId === userId) {
        const receiverProfile = await authContext.getPublicProfile(recId);
        if (receiverProfile) {
          sent.push({ ...r, peer: receiverProfile });
        }
      }
    }

    return { received, sent };
  }

  /**
   * Block a user
   */
  static async blockUser(blockerId, blockedId) {
    if (blockerId === blockedId) throw new Error('You cannot block yourself.');

    const blockId = `blk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    await dbStore.insert('user_blocks', {
      id: blockId,
      blocker_id: blockerId,
      blocked_id: blockedId,
      created_at: new Date().toISOString()
    });

    await this.removeFriend(blockerId, blockedId);
    return { success: true };
  }

  /**
   * Unblock a user
   */
  static async unblockUser(blockerId, blockedId) {
    const blocks = await dbStore.getAll('user_blocks');
    const target = blocks.find(b => b.blocker_id === blockerId && b.blocked_id === blockedId);
    if (target) {
      await dbStore.delete('user_blocks', target.id);
    }
    return { success: true };
  }

  /**
   * Check if a block exists between two users
   */
  static async isBlocked(userAId, userBId) {
    try {
      const blocks = await dbStore.getAll('user_blocks');
      return blocks.some(b =>
        (b.blocker_id === userAId && b.blocked_id === userBId) ||
        (b.blocker_id === userBId && b.blocked_id === userAId)
      );
    } catch {
      return false;
    }
  }

  /**
   * Strict Chat Permission Check (Requirement 7)
   */
  static async canChat(user1Id, user2Id) {
    if (!user1Id || !user2Id || user1Id === user2Id) return false;
    const status = await this.getConnectionStatus(user1Id, user2Id);
    return status === 'ACCEPTED';
  }
}
