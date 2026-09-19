/**
 * TECHPATH — STUDENT CHAT STUDIO
 * Private, friendship-gated messaging with real-time sync, delivery states,
 * read receipts, reporting, and mobile responsiveness.
 */

import { authContext } from '../context/AuthContext.js';
import { ChatEngine } from '../services/ChatEngine.js';
import { ConnectEngine } from '../services/ConnectEngine.js';
import { PublicProfileModal } from '../components/PublicProfileModal.js';
import { Toast } from '../components/Toast.js';

export class ChatPage {
  static activeConversationId = null;
  static activePeerId = null;
  static unsubscribeChat = null;

  static async render(container) {
    const user = authContext.getUser();
    if (!user) {
      window.location.hash = '#/signin';
      return;
    }

    // Parse URL params for ?user=... or ?conversationId=...
    const hash = window.location.hash || '';
    const queryIndex = hash.indexOf('?');
    let targetUserId = null;
    let targetConvId = null;

    if (queryIndex !== -1) {
      const params = new URLSearchParams(hash.slice(queryIndex));
      targetUserId = params.get('user');
      targetConvId = params.get('conversationId');
    }

    // Clean up any existing active subscription
    if (this.unsubscribeChat) {
      this.unsubscribeChat();
      this.unsubscribeChat = null;
    }

    container.innerHTML = `
      <div class="tp-page" style="max-width: 1240px; margin: 0 auto; height: calc(100vh - 120px); min-height: 600px; display: flex; flex-direction: column;">
        
        <!-- Header Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <div class="telemetry-chip" style="display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 0.25rem;">
              <span class="pulse-beacon" style="background: #10b981;"></span> SECURE STUDENT MESSAGING // PEER TO PEER
            </div>
            <h1 class="headline-lg" style="margin: 0;">Student Chat Studio</h1>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <a href="#/connect" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
              <span>🌐</span> Connect Hub
            </a>
            <a href="#/connect/friends" class="tp-btn tp-btn-ghost" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
              <span>👥</span> My Friends
            </a>
          </div>
        </div>

        <!-- Chat Frame Grid -->
        <div id="tp-chat-frame" class="tp-card" style="
          flex: 1; padding: 0; overflow: hidden; display: grid;
          grid-template-columns: 340px 1fr; border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(16px);
        ">
          <!-- Left Column: Conversations Sidebar -->
          <div id="tp-chat-sidebar" style="
            border-right: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column;
            background: rgba(3, 7, 18, 0.4); height: 100%;
          ">
            <!-- Sidebar Header & Search -->
            <div style="padding: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <div style="font-size: 0.88rem; font-weight: 700; color: #cbd5e1; margin-bottom: 0.6rem;">
                CONVERSATIONS
              </div>
              <input type="text" id="conv-search-input" class="tp-input" placeholder="Filter conversations..." style="font-size: 0.82rem; padding: 0.5rem 0.75rem;" />
            </div>

            <!-- Conversation List -->
            <div id="conversations-list-root" style="flex: 1; overflow-y: auto; padding: 0.5rem;">
              <div style="text-align: center; padding: 2rem 1rem; color: #64748b; font-size: 0.85rem;">
                Loading conversations...
              </div>
            </div>
          </div>

          <!-- Right Column: Active Thread View -->
          <div id="tp-chat-main" style="display: flex; flex-direction: column; height: 100%; position: relative; background: rgba(10, 15, 29, 0.5);">
            <div id="active-chat-content" style="flex: 1; display: flex; flex-direction: column; height: 100%; justify-content: center; align-items: center; padding: 2rem;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">💬</div>
              <h3 style="color: #fff; font-size: 1.25rem; margin-bottom: 0.5rem;">Select a Conversation</h3>
              <p style="color: #94a3b8; font-size: 0.92rem; text-align: center; max-width: 380px;">
                Choose an accepted friend from the list on the left to start real-time messaging, or discover new peers in Connect.
              </p>
            </div>
          </div>
        </div>

      </div>
    `;

    // Handle deep link to specific user or conversation
    if (targetUserId) {
      await this._handleInitiateChatWithUser(container, user, targetUserId);
    } else if (targetConvId) {
      this.activeConversationId = targetConvId;
    }

    await this._loadConversationsList(container, user);
  }

  /**
   * Check friendship and initiate direct conversation if allowed
   */
  static async _handleInitiateChatWithUser(container, currentUser, targetUserId) {
    try {
      const status = await ConnectEngine.getConnectionStatus(currentUser.id, targetUserId);
      if (status !== 'ACCEPTED') {
        const peer = await authContext.getPublicProfile(targetUserId);
        const name = peer?.full_name || 'This student';
        container.querySelector('#active-chat-content').innerHTML = `
          <div style="text-align: center; max-width: 440px; padding: 2rem; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px;">
            <div style="font-size: 3rem; margin-bottom: 0.75rem;">🔒</div>
            <h3 style="color: #fff; font-size: 1.3rem; margin-bottom: 0.5rem;">Friendship Required</h3>
            <p style="color: #94a3b8; font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.5rem;">
              For privacy and safety, students can only message each other after a friend request has been accepted. You and <strong>${name}</strong> are not yet connected.
            </p>
            <div style="display: flex; gap: 0.75rem; justify-content: center;">
              <button type="button" id="prompt-view-profile-btn" class="tp-btn tp-btn-primary" style="font-size: 0.88rem;">
                View ${name}'s Profile
              </button>
              <a href="#/connect" class="tp-btn tp-btn-ghost" style="font-size: 0.88rem;">
                Explore Connect
              </a>
            </div>
          </div>
        `;

        container.querySelector('#prompt-view-profile-btn')?.addEventListener('click', () => {
          PublicProfileModal.open(targetUserId);
        });
        return;
      }

      const conv = await ChatEngine.getOrCreateDirectConversation(currentUser.id, targetUserId);
      this.activeConversationId = conv.id;
      this.activePeerId = targetUserId;
      await this._openConversation(container, currentUser, conv.id);
    } catch (err) {
      Toast.show(err.message, 'error');
    }
  }

  /**
   * Load and render list of conversations
   */
  static async _loadConversationsList(container, user) {
    const listRoot = container.querySelector('#conversations-list-root');
    if (!listRoot) return;

    try {
      const convs = await ChatEngine.getUserConversations(user.id);

      if (convs.length === 0) {
        listRoot.innerHTML = `
          <div style="text-align: center; padding: 3rem 1rem; color: #64748b;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">👥</div>
            <div style="font-size: 0.88rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.25rem;">No Active Chats</div>
            <p style="font-size: 0.78rem; line-height: 1.4;">Add friends from your department in TechPath Connect to chat.</p>
            <a href="#/connect" class="tp-btn tp-btn-primary" style="margin-top: 1rem; font-size: 0.8rem; padding: 0.4rem 0.8rem;">
              Find Peers
            </a>
          </div>
        `;
        return;
      }

      listRoot.innerHTML = convs.map(c => {
        const peer = c.peer || {};
        const initial = (peer.full_name || 'S').charAt(0).toUpperCase();
        const lastSnippet = c.lastMessage ? c.lastMessage.content : 'Started a new conversation';
        const isCurrent = this.activeConversationId === c.id;

        return `
          <div class="conv-item ${isCurrent ? 'active' : ''}" data-cid="${c.id}" data-pid="${peer.id}" style="
            display: flex; gap: 0.75rem; align-items: center; padding: 0.75rem; border-radius: 12px;
            cursor: pointer; transition: background 0.15s; margin-bottom: 0.25rem;
            background: ${isCurrent ? 'rgba(139, 92, 246, 0.18)' : 'transparent'};
            border: 1px solid ${isCurrent ? 'rgba(139, 92, 246, 0.35)' : 'transparent'};
          ">
            <div style="
              width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #8b5cf6, #3b82f6);
              display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700; color: #fff; flex-shrink: 0;
            ">
              ${peer.avatar_url ? `<img src="${peer.avatar_url}" style="width: 100%; height: 100%; border-radius: 12px; object-fit: cover;" />` : initial}
            </div>

            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-size: 0.92rem; font-weight: 700; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${peer.full_name}
                </span>
                ${c.unreadCount > 0 ? `
                  <span style="background: #a855f7; color: #fff; font-size: 0.7rem; font-weight: 800; border-radius: 999px; padding: 0.1rem 0.45rem;">${c.unreadCount}</span>
                ` : ''}
              </div>
              <div style="font-size: 0.78rem; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 0.15rem;">
                ${lastSnippet}
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Wire conversation selection
      listRoot.querySelectorAll('.conv-item').forEach(item => {
        item.addEventListener('click', async () => {
          const cid = item.getAttribute('data-cid');
          const pid = item.getAttribute('data-pid');
          this.activeConversationId = cid;
          this.activePeerId = pid;
          this._highlightActiveConversation(listRoot, cid);
          await this._openConversation(container, user, cid);
        });
      });

      // Search filter in conversations
      const searchInput = container.querySelector('#conv-search-input');
      searchInput?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        listRoot.querySelectorAll('.conv-item').forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(q) ? 'flex' : 'none';
        });
      });

      // If a conversation was marked active, render it
      if (this.activeConversationId && !container.querySelector('#chat-message-stream')) {
        await this._openConversation(container, user, this.activeConversationId);
      }

    } catch (err) {
      console.error('[ChatPage Load Error]:', err);
    }
  }

  static _highlightActiveConversation(listRoot, activeId) {
    listRoot.querySelectorAll('.conv-item').forEach(item => {
      const isCurrent = item.getAttribute('data-cid') === activeId;
      item.style.background = isCurrent ? 'rgba(139, 92, 246, 0.18)' : 'transparent';
      item.style.border = isCurrent ? '1px solid rgba(139, 92, 246, 0.35)' : 'transparent';
    });
  }

  /**
   * Open and render an active conversation thread
   */
  static async _openConversation(container, user, conversationId) {
    const mainCol = container.querySelector('#tp-chat-main');
    if (!mainCol) return;

    // Clean up previous subscription
    if (this.unsubscribeChat) {
      this.unsubscribeChat();
      this.unsubscribeChat = null;
    }

    try {
      await ChatEngine.assertAccess(conversationId, user.id);
    } catch (err) {
      mainCol.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #ef4444;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚠️</div>
          <h3>${err.message}</h3>
        </div>
      `;
      return;
    }

    // Resolve peer
    const convs = await ChatEngine.getUserConversations(user.id);
    const convInfo = convs.find(c => c.id === conversationId);
    const peer = convInfo?.peer || (this.activePeerId ? await authContext.getPublicProfile(this.activePeerId) : null);

    if (!peer) {
      mainCol.innerHTML = `<div style="text-align:center; padding:3rem; color:#94a3b8;">Peer information unavailable.</div>`;
      return;
    }

    const peerInitial = (peer.full_name || 'S').charAt(0).toUpperCase();

    mainCol.innerHTML = `
      <!-- Conversation Header Bar -->
      <div style="
        padding: 0.85rem 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(15, 23, 42, 0.85); display: flex; align-items: center; justify-content: space-between;
      ">
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <!-- Mobile Back Button -->
          <button type="button" id="mobile-back-to-convs-btn" style="
            display: none; background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; padding: 0.2rem 0.5rem;
          ">←</button>

          <div style="
            width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 700; color: #fff;
          ">
            ${peer.avatar_url ? `<img src="${peer.avatar_url}" style="width: 100%; height: 100%; border-radius: 12px; object-fit: cover;" />` : peerInitial}
          </div>

          <div>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 1rem; font-weight: 700; color: #fff;">${peer.full_name}</span>
              <span style="font-family: monospace; font-size: 0.72rem; color: #38bdf8; background: rgba(56, 189, 248, 0.1); padding: 0.1rem 0.4rem; border-radius: 4px;">
                ${peer.techpath_id}
              </span>
            </div>
            <div style="font-size: 0.75rem; color: #94a3b8;">
              ${(peer.branch_id || 'CSE').toUpperCase()} • ${peer.specialization || 'Engineering'}
            </div>
          </div>
        </div>

        <!-- Options Menu -->
        <div style="display: flex; gap: 0.4rem; align-items: center;">
          <button type="button" id="chat-view-profile-btn" class="tp-btn tp-btn-ghost" style="font-size: 0.8rem; padding: 0.35rem 0.7rem;">
            Profile
          </button>
          <button type="button" id="chat-block-user-btn" class="tp-btn tp-btn-ghost" title="Block User" style="font-size: 0.8rem; padding: 0.35rem 0.6rem; color: #f43f5e;">
            🚫
          </button>
        </div>
      </div>

      <!-- Message History Bubble Stream -->
      <div id="chat-message-stream" style="
        flex: 1; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.85rem;
      ">
        <div style="text-align: center; color: #64748b; font-size: 0.8rem; margin-bottom: 0.5rem;">
          End-to-end authorized communication between accepted friends.
        </div>
      </div>

      <!-- Message Input Bar -->
      <div style="
        padding: 0.85rem 1.25rem; border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(15, 23, 42, 0.9); display: flex; gap: 0.75rem; align-items: center;
      ">
        <input type="text" id="chat-message-input" class="tp-input"
          placeholder="Type an engineering question, note, or message..."
          maxlength="2000"
          style="flex: 1; font-size: 0.92rem; padding: 0.7rem 1rem; background: rgba(0,0,0,0.4);" />
        <button type="button" id="chat-send-btn" class="tp-btn tp-btn-primary" style="
          background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: #fff; padding: 0.7rem 1.4rem; font-weight: 700; border-radius: 10px; display: inline-flex; align-items: center; gap: 0.4rem;
        ">
          <span>Send</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    `;

    // Responsive mobile view check
    const mobileBack = mainCol.querySelector('#mobile-back-to-convs-btn');
    if (window.innerWidth <= 768) {
      if (mobileBack) mobileBack.style.display = 'block';
      const sidebar = container.querySelector('#tp-chat-sidebar');
      if (sidebar) sidebar.style.display = 'none';
      mobileBack.addEventListener('click', () => {
        if (sidebar) sidebar.style.display = 'flex';
        mainCol.innerHTML = `
          <div id="active-chat-content" style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem;">
            <div style="font-size:2.5rem; margin-bottom:0.5rem;">💬</div>
            <p style="color:#94a3b8;">Select a conversation to begin.</p>
          </div>
        `;
      });
    }

    // View profile button
    mainCol.querySelector('#chat-view-profile-btn')?.addEventListener('click', () => {
      PublicProfileModal.open(peer.id);
    });

    // Block user button
    mainCol.querySelector('#chat-block-user-btn')?.addEventListener('click', async () => {
      if (!confirm(`Block ${peer.full_name}? Chat and friendship will be terminated.`)) return;
      try {
        await ConnectEngine.blockUser(user.id, peer.id);
        Toast.show(`${peer.full_name} has been blocked.`, 'warning');
        ChatPage.render(container);
      } catch (err) { Toast.show(err.message, 'error'); }
    });

    // Mark as read
    await ChatEngine.markConversationAsRead(conversationId, user.id);

    // Render initial messages
    const stream = mainCol.querySelector('#chat-message-stream');
    const messages = await ChatEngine.getMessages(conversationId, user.id);
    this._renderMessageBubbles(stream, messages, user.id, peer);

    // Scroll to bottom
    stream.scrollTop = stream.scrollHeight;

    // Send Message Handler
    const input = mainCol.querySelector('#chat-message-input');
    const sendBtn = mainCol.querySelector('#chat-send-btn');

    const handleSend = async () => {
      const text = input.value.trim();
      if (!text) return;

      input.value = '';
      sendBtn.disabled = true;

      try {
        const msg = await ChatEngine.sendMessage({
          conversationId,
          senderId: user.id,
          content: text
        });

        // Append locally immediately
        this._appendSingleMessage(stream, msg, user.id, peer);
        stream.scrollTop = stream.scrollHeight;
      } catch (err) {
        Toast.show(err.message || 'Failed to send message.', 'error');
      } finally {
        sendBtn.disabled = false;
        input.focus();
      }
    };

    sendBtn?.addEventListener('click', handleSend);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    // Subscribe to live messages
    this.unsubscribeChat = ChatEngine.subscribeToConversation(conversationId, (newMsg) => {
      // Avoid duplicate append if already in stream
      if (!stream.querySelector(`[data-mid="${newMsg.id}"]`)) {
        this._appendSingleMessage(stream, newMsg, user.id, peer);
        stream.scrollTop = stream.scrollHeight;
        ChatEngine.markConversationAsRead(conversationId, user.id);
      }
    });
  }

  static _renderMessageBubbles(stream, messages, currentUserId, peer) {
    if (messages.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.id = 'chat-empty-hint';
      placeholder.style.cssText = 'text-align: center; color: #64748b; font-size: 0.88rem; margin: 3rem 0;';
      placeholder.innerHTML = `👋 Say hello to ${peer.full_name} and start your technical exchange!`;
      stream.appendChild(placeholder);
      return;
    }

    messages.forEach(msg => {
      this._appendSingleMessage(stream, msg, currentUserId, peer);
    });
  }

  static _appendSingleMessage(stream, msg, currentUserId, peer) {
    const emptyHint = stream.querySelector('#chat-empty-hint');
    if (emptyHint) emptyHint.remove();

    if (stream.querySelector(`[data-mid="${msg.id}"]`)) return;

    const isMine = msg.sender_id === currentUserId;
    const timeStr = new Date(msg.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    const bubble = document.createElement('div');
    bubble.setAttribute('data-mid', msg.id);
    bubble.style.cssText = `
      display: flex; flex-direction: column;
      align-items: ${isMine ? 'flex-end' : 'flex-start'};
      margin-bottom: 0.35rem;
    `;

    bubble.innerHTML = `
      <div style="
        max-width: 75%; padding: 0.75rem 1rem; border-radius: 16px;
        background: ${isMine ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(30, 41, 59, 0.85)'};
        color: #f8fafc; font-size: 0.92rem; line-height: 1.5;
        border: 1px solid ${isMine ? 'rgba(167, 139, 250, 0.3)' : 'rgba(255, 255, 255, 0.08)'};
        border-bottom-${isMine ? 'right' : 'left'}-radius: 4px;
        word-break: break-word; box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        position: relative; group: hover;
      ">
        ${this._escapeHtml(msg.content)}
      </div>
      <div style="font-size: 0.7rem; color: #64748b; margin-top: 0.2rem; display: flex; align-items: center; gap: 0.4rem; padding: 0 0.4rem;">
        <span>${timeStr}</span>
        ${isMine ? `
          <span title="Delivered" style="color: #a78bfa;">✓</span>
          <button type="button" class="del-msg-btn" data-id="${msg.id}" style="background:none; border:none; color:#64748b; cursor:pointer; font-size:0.68rem; padding:0;">Delete</button>
        ` : `
          <button type="button" class="report-msg-btn" data-id="${msg.id}" style="background:none; border:none; color:#64748b; cursor:pointer; font-size:0.68rem; padding:0;">Report</button>
        `}
      </div>
    `;

    // Delete message handler
    bubble.querySelector('.del-msg-btn')?.addEventListener('click', async () => {
      if (!confirm('Delete this message for everyone?')) return;
      try {
        await ChatEngine.deleteMessage(msg.id, currentUserId);
        bubble.remove();
        Toast.show('Message deleted.', 'info');
      } catch (err) { Toast.show(err.message, 'error'); }
    });

    // Report message handler
    bubble.querySelector('.report-msg-btn')?.addEventListener('click', async () => {
      const reason = prompt('Please describe why you are reporting this message:');
      if (!reason) return;
      try {
        await ConnectEngine.reportUser({
          reporterId: currentUserId,
          reportedId: peer.id,
          category: 'Inappropriate Content',
          details: reason,
          messageId: msg.id
        });
        Toast.show('Message reported to moderators.', 'success');
      } catch (err) { Toast.show(err.message, 'error'); }
    });

    stream.appendChild(bubble);
  }

  static _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
