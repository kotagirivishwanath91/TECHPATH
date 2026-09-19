/**
 * TECHPATH — NOTIFICATIONS CENTER
 * Real-time event notifications, category filtering, mark-as-read, and delivery preferences
 */
import { NotificationEngine } from '../services/NotificationEngine.js';
import { Toast } from '../components/Toast.js';

export class NotificationsPage {
  static activeCategory = 'all';

  static async render(container) {
    let notifs = await NotificationEngine.getAll();

    // Default sample notifications if none exist
    if (notifs.length === 0) {
      await NotificationEngine.send('achievement', '🔥 14-Day Streak Unlocked!', 'You have demonstrated consistency across two consecutive study weeks.');
      await NotificationEngine.send('reminder', '📖 Continue Operating Systems', 'Review Unit 2: Virtual Memory & Page Replacement.', '#/learning');
      await NotificationEngine.send('skill', '⚡ Skill Gap Flagged: Distributed Systems', 'Take the assessment or start the recommended project.', '#/skills');
      await NotificationEngine.send('quiz', '📝 Topic Quiz Ready: Graph Algorithms', 'Verify your mastery on Dijkstra and Bellman-Ford algorithms.', '#/practice');
      notifs = await NotificationEngine.getAll();
    }

    const unreadCount = notifs.filter(n => !n.read).length;
    let filtered = notifs;
    if (this.activeCategory === 'unread') {
      filtered = notifs.filter(n => !n.read);
    } else if (this.activeCategory !== 'all') {
      filtered = notifs.filter(n => n.type === this.activeCategory);
    }

    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:900px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom:0.5rem">
              <span class="pulse-beacon"></span> DISPATCH TELEMETRY
            </div>
            <h1 class="display-lg">Notifications Center</h1>
            <p style="color:var(--tp-text-dark-secondary)">Activity updates, streak alerts, study reminders, and skill acquisition benchmarks.</p>
          </div>
          ${unreadCount > 0 ? `
            <button id="mark-all-read-btn" class="tp-btn tp-btn-secondary">
              Mark all as read (${unreadCount})
            </button>
          ` : ''}
        </div>

        <!-- Filter Category Tabs -->
        <div style="display:flex;gap:0.5rem;overflow-x:auto;padding-bottom:0.5rem;border-bottom:1px solid var(--tp-border-dark)">
          ${[
            { id: 'all', label: `All (${notifs.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'social', label: '👥 Social & Friends' },
            { id: 'study_group', label: '🧑‍🤝‍🧑 Study Groups' },
            { id: 'achievement', label: '🏆 Achievements' },
            { id: 'reminder', label: '⏰ Study Reminders' },
            { id: 'skill', label: '⚡ Skills & Career' },
            { id: 'quiz', label: '📝 Quizzes & Exams' },
          ].map(c => `
            <button class="tp-btn ${this.activeCategory === c.id ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm tp-notif-filter-btn" data-cat="${c.id}" style="white-space:nowrap">
              ${c.label}
            </button>
          `).join('')}
        </div>

        <!-- Notifications List -->
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          ${filtered.length === 0 ? `
            <div class="tp-card tp-empty-state">
              <div class="tp-empty-icon">🔔</div>
              <h3 class="tp-empty-title">No notifications in this view</h3>
              <p class="tp-empty-desc">You are completely up to date with your curriculum, friend requests, and study groups.</p>
            </div>
          ` : filtered.map(n => `
            <div class="tp-card tp-notif-row" data-id="${n.id}" style="padding:1rem 1.25rem;border-left:3px solid ${n.read ? 'var(--tp-border-dark)' : 'var(--tp-primary)'};background:${n.read ? 'rgba(255,255,255,0.01)' : 'rgba(225,29,72,0.04)'};display:flex;justify-content:space-between;align-items:center;gap:1rem;cursor:pointer">
              <div style="display:flex;align-items:flex-start;gap:1rem;flex:1;">
                <div style="font-size:1.5rem;margin-top:0.1rem">
                  ${n.type === 'achievement' ? '🏆' : n.type === 'social' ? '👥' : n.type === 'study_group' ? '🧑‍🤝‍🧑' : n.type === 'skill' ? '⚡' : n.type === 'quiz' ? '📝' : '⏰'}
                </div>
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem">
                    <strong style="font-size:0.95rem;color:${n.read ? 'var(--tp-text-light)' : '#fff'}">${n.title}</strong>
                    ${!n.read ? '<span class="tp-notif-dot"></span>' : ''}
                  </div>
                  <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin:0;line-height:1.4">${n.message}</p>
                  <span style="font-size:0.72rem;color:var(--tp-text-dark-muted);margin-top:0.4rem;display:inline-block">
                    ${new Date(n.created_at).toLocaleDateString()} at ${new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <!-- Action Controls -->
              <div style="display:flex;align-items:center;gap:0.5rem;flex-shrink:0;">
                ${(n.type === 'social' && n.title.toLowerCase().includes('friend request') && !n.read) ? `
                  <button type="button" class="tp-btn tp-btn-primary tp-btn-sm notif-accept-friend-btn" data-req-id="${n.related_entity_id || ''}" data-sender-id="${n.related_user_id || ''}" style="background:#10b981;padding:0.35rem 0.8rem;font-size:0.8rem;">
                    ✓ Accept
                  </button>
                  <button type="button" class="tp-btn tp-btn-secondary tp-btn-sm notif-reject-friend-btn" data-req-id="${n.related_entity_id || ''}" style="padding:0.35rem 0.7rem;font-size:0.8rem;">
                    Reject
                  </button>
                ` : ''}

                ${n.link ? `
                  <a href="${n.link}" class="tp-btn tp-btn-secondary tp-btn-sm" style="white-space:nowrap;font-size:0.8rem;padding:0.35rem 0.75rem;">
                    View →
                  </a>
                ` : ''}

                ${!n.read ? `
                  <button class="tp-btn tp-btn-ghost tp-btn-sm tp-mark-read-btn" data-id="${n.id}" style="font-size:0.75rem" title="Mark as read">
                    ✓
                  </button>
                ` : ''}

                <!-- Dismiss Button (Requirement 5) -->
                <button type="button" class="tp-btn tp-btn-ghost tp-btn-sm tp-dismiss-btn" data-id="${n.id}" style="color:var(--tp-text-dark-muted);font-size:0.85rem;padding:0.25rem 0.5rem;" title="Dismiss notification">
                  ✕
                </button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    // Event handlers
    container.querySelectorAll('.tp-notif-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeCategory = e.currentTarget.dataset.cat;
        NotificationsPage.render(container);
      });
    });

    container.querySelector('#mark-all-read-btn')?.addEventListener('click', async () => {
      await NotificationEngine.markAllRead();
      Toast.show({ message: 'All notifications marked as read', type: 'info' });
      await NotificationsPage.render(container);
    });

    container.querySelectorAll('.tp-mark-read-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        await NotificationEngine.markRead(id);
        await NotificationsPage.render(container);
      });
    });

    // Dismiss button handler (Fix stuck notifications)
    container.querySelectorAll('.tp-dismiss-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        await NotificationEngine.dismiss(id);
        Toast.show({ message: 'Notification dismissed', type: 'info' });
        await NotificationsPage.render(container);
      });
    });

    // Inline Friend Request Accept handler
    container.querySelectorAll('.notif-accept-friend-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const reqId = btn.dataset.reqId;
        const senderId = btn.dataset.senderId;
        const user = authContext.getUser();
        btn.disabled = true;
        btn.textContent = 'Accepting...';
        try {
          if (reqId) {
            await ConnectEngine.acceptFriendRequest(reqId, user.id);
          } else if (senderId) {
            const reqs = await ConnectEngine.getFriendRequests(user.id);
            const req = reqs.received.find(r => (r.requester_user_id || r.sender_id) === senderId);
            if (req) await ConnectEngine.acceptFriendRequest(req.id, user.id);
          }
          const row = btn.closest('.tp-notif-row');
          if (row?.dataset?.id) await NotificationEngine.markRead(row.dataset.id);
          Toast.success('Friend request accepted! You are now friends.');
          await NotificationsPage.render(container);
        } catch (err) {
          Toast.error(err.message);
          btn.disabled = false;
          btn.textContent = '✓ Accept';
        }
      });
    });

    // Inline Friend Request Reject handler
    container.querySelectorAll('.notif-reject-friend-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const reqId = btn.dataset.reqId;
        const user = authContext.getUser();
        btn.disabled = true;
        try {
          if (reqId) {
            await ConnectEngine.rejectFriendRequest(reqId, user.id);
          }
          const row = btn.closest('.tp-notif-row');
          if (row?.dataset?.id) await NotificationEngine.dismiss(row.dataset.id);
          Toast.info('Friend request rejected.');
          await NotificationsPage.render(container);
        } catch (err) {
          Toast.error(err.message);
          btn.disabled = false;
        }
      });
    });

    container.querySelectorAll('.tp-notif-row').forEach(row => {
      row.addEventListener('click', async (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        const id = row.dataset.id;
        await NotificationEngine.markRead(id);
        const notif = notifs.find(n => n.id === id);
        if (notif?.link) {
          window.location.hash = notif.link;
        } else {
          await NotificationsPage.render(container);
        }
      });
    });
  }
}
