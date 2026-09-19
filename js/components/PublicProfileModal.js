/**
 * TECHPATH — PUBLIC STUDENT PROFILE MODAL
 * Sanitized profile inspection with friendship action controls,
 * copyable TechPath ID, branch credentials, skills, and reporting.
 */

import { authContext } from '../context/AuthContext.js';
import { ConnectEngine } from '../services/ConnectEngine.js';
import { Toast } from './Toast.js';
import { I18nEngine } from '../services/I18nEngine.js';

export class PublicProfileModal {
  static async open(targetUserId, onActionCallback = () => {}) {
    const current = authContext.getUser();
    if (!current) {
      Toast.show('Please sign in to view student profiles.', 'warning');
      window.location.hash = '#/signin';
      return;
    }

    const modalRoot = document.getElementById('tp-modal-root') || document.body;

    // Show loading state
    const overlay = document.createElement('div');
    overlay.id = 'tp-public-profile-modal-overlay';
    overlay.className = 'tp-modal-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(3, 7, 18, 0.85);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      padding: 1.5rem; animation: fadeIn 0.2s ease;
    `;
    overlay.innerHTML = `
      <div style="background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2rem; color: #fff;">
        <div class="tp-spinner" style="width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.2); border-top-color: var(--tp-primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem auto;"></div>
        <div>Loading Student Profile...</div>
      </div>
    `;
    modalRoot.appendChild(overlay);

    const close = () => {
      overlay.remove();
    };

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    try {
      const profile = await authContext.getPublicProfile(targetUserId);
      if (!profile) {
        Toast.show('Student profile could not be found.', 'error');
        close();
        return;
      }

      const connectionStatus = await ConnectEngine.getConnectionStatus(current.id, profile.id);
      const isSelf = current.id === profile.id;

      const initial = (profile.full_name || 'S').charAt(0).toUpperCase();
      const techpathId = profile.techpath_id || 'TP-ENG-000000';
      const branchDisplay = (profile.branch_id || 'CSE').toUpperCase();
      const semesterDisplay = profile.semester_id ? profile.semester_id.replace('sem_', 'Semester ') : 'Semester 3';

      overlay.innerHTML = `
        <div class="tp-profile-modal-card" style="
          max-width: 580px; width: 100%;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-top: 2px solid #8b5cf6;
          border-radius: 24px;
          padding: 2.25rem;
          color: #f8fafc;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.15);
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        ">
          <!-- Close Button -->
          <button type="button" id="tp-modal-close-btn" style="
            position: absolute; top: 1.25rem; right: 1.25rem;
            background: rgba(255, 255, 255, 0.08); border: none;
            color: #94a3b8; width: 34px; height: 34px; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            font-size: 1.1rem; transition: background 0.2s, color 0.2s;
          ">✕</button>

          <!-- Header Section -->
          <div style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1.5rem;">
            <!-- Avatar -->
            <div style="
              width: 80px; height: 80px; border-radius: 20px;
              background: linear-gradient(135deg, #8b5cf6, #3b82f6);
              display: flex; align-items: center; justify-content: center;
              font-size: 2.2rem; font-weight: 800; color: #fff;
              box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
              flex-shrink: 0;
            ">
              ${profile.avatar_url ? `<img src="${profile.avatar_url}" alt="${profile.full_name}" style="width: 100%; height: 100%; border-radius: 20px; object-fit: cover;" />` : initial}
            </div>

            <!-- Identity Info -->
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff; margin: 0; font-family: 'Space Grotesk', sans-serif;">
                  ${profile.full_name}
                </h2>
                <span style="font-size: 0.72rem; padding: 0.2rem 0.6rem; border-radius: 999px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981; font-weight: 700;">
                  Verified Student
                </span>
              </div>

              <!-- TechPath ID with Copy Button -->
              <div style="display: inline-flex; align-items: center; gap: 0.45rem; background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.25rem 0.65rem; margin-top: 0.4rem;">
                <span style="font-family: monospace; font-size: 0.85rem; font-weight: 700; color: #38bdf8;">${techpathId}</span>
                <button type="button" id="copy-techpath-id-btn" title="Copy TechPath ID" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0; display: flex; align-items: center;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
              </div>

              <!-- Academic credentials line -->
              <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.35rem;">
                <strong style="color: #cbd5e1;">${branchDisplay}</strong> • ${semesterDisplay} • ${profile.specialization || 'Engineering'}
              </div>
            </div>
          </div>

          <!-- Short Description / Bio -->
          <div style="background: rgba(0, 0, 0, 0.25); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: #8b5cf6; font-weight: 700; margin-bottom: 0.35rem;">
              About This Student
            </div>
            <p style="color: #e2e8f0; font-size: 0.92rem; line-height: 1.6; margin: 0; font-style: italic;">
              “${profile.bio || 'TechPath engineering student eager to learn, build, and collaborate.'}”
            </p>
          </div>

          <!-- Skills Section -->
          <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: 700; margin-bottom: 0.5rem;">
              Verified Skills
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${(profile.skills && profile.skills.length > 0) ? profile.skills.map(s => `
                <span style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 0.3rem 0.75rem; font-size: 0.8rem; color: #cbd5e1;">
                  ${s}
                </span>
              `).join('') : '<span style="color:#64748b; font-size:0.85rem;">No skills listed.</span>'}
            </div>
          </div>

          <!-- Career Interests Section -->
          <div style="margin-bottom: 1.75rem;">
            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: 700; margin-bottom: 0.5rem;">
              Career Interests
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${(profile.career_interests && profile.career_interests.length > 0) ? profile.career_interests.map(c => `
                <span style="background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 8px; padding: 0.3rem 0.75rem; font-size: 0.8rem; color: #60a5fa;">
                  🎯 ${c}
                </span>
              `).join('') : `<span style="color:#60a5fa; font-size:0.85rem;">🎯 ${profile.career_goal || 'Software Engineering'}</span>`}
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.25rem;">
            <!-- Left Side Actions (Friendship & Message) -->
            <div id="tp-modal-actions-box" style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
              ${isSelf ? `
                <a href="#/profile" class="tp-btn tp-btn-secondary" style="font-size: 0.88rem; padding: 0.65rem 1.2rem;">
                  Edit My Profile
                </a>
              ` : connectionStatus === 'ACCEPTED' ? `
                <a href="#/connect/chat?user=${profile.id}" class="tp-btn tp-btn-primary" style="
                  background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: #fff;
                  font-size: 0.88rem; padding: 0.65rem 1.3rem; border-radius: 10px;
                  text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;
                ">
                  <span>💬</span> Send Message
                </a>
                <button type="button" id="modal-remove-friend-btn" class="tp-btn tp-btn-ghost" style="font-size: 0.85rem; color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.2);">
                  Remove Friend
                </button>
              ` : connectionStatus === 'PENDING_SENT' ? `
                <button type="button" disabled style="
                  background: rgba(255, 255, 255, 0.05); color: #94a3b8;
                  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px;
                  font-size: 0.88rem; padding: 0.65rem 1.2rem; cursor: default;
                ">
                  ✓ Request Pending
                </button>
                <button type="button" id="modal-cancel-req-btn" style="
                  background: transparent; color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.2);
                  border-radius: 10px; font-size: 0.85rem; padding: 0.65rem 1rem; cursor: pointer;
                ">
                  Cancel Request
                </button>
              ` : connectionStatus === 'PENDING_RECEIVED' ? `
                <button type="button" id="modal-accept-req-btn" class="tp-btn tp-btn-primary" style="
                  background: #10b981; color: #fff; border-radius: 10px; font-size: 0.88rem; padding: 0.65rem 1.2rem;
                ">
                  Accept Friend Request
                </button>
                <button type="button" id="modal-reject-req-btn" style="
                  background: rgba(255, 255, 255, 0.05); color: #94a3b8; border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 10px; font-size: 0.88rem; padding: 0.65rem 1rem; cursor: pointer;
                ">
                  Reject
                </button>
              ` : connectionStatus === 'BLOCKED' ? `
                <button type="button" id="modal-unblock-btn" style="
                  background: rgba(244, 63, 94, 0.1); color: #f43f5e; border: 1px solid rgba(244, 63, 94, 0.3);
                  border-radius: 10px; font-size: 0.88rem; padding: 0.65rem 1.2rem; cursor: pointer;
                ">
                  Unblock User
                </button>
              ` : `
                <button type="button" id="modal-send-request-btn" class="tp-btn tp-btn-primary" style="
                  background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: #fff;
                  font-size: 0.88rem; padding: 0.65rem 1.4rem; border-radius: 10px;
                  display: inline-flex; align-items: center; gap: 0.4rem;
                ">
                  <span>➕</span> Send Friend Request
                </button>
              `}
            </div>

            <!-- Right Side Actions (Block / Report) -->
            ${!isSelf ? `
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <button type="button" id="modal-report-user-btn" title="Report User" style="
                  background: none; border: none; color: #64748b; font-size: 0.8rem; cursor: pointer;
                  padding: 0.4rem 0.6rem; border-radius: 6px; transition: color 0.2s;
                ">
                  🚩 Report
                </button>
                <span style="color: rgba(255,255,255,0.1)">|</span>
                <button type="button" id="modal-block-user-btn" title="Block User" style="
                  background: none; border: none; color: #64748b; font-size: 0.8rem; cursor: pointer;
                  padding: 0.4rem 0.6rem; border-radius: 6px; transition: color 0.2s;
                ">
                  🚫 Block
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      // Copy TechPath ID handler
      overlay.querySelector('#copy-techpath-id-btn')?.addEventListener('click', () => {
        navigator.clipboard.writeText(techpathId).then(() => {
          Toast.show(`TechPath ID ${techpathId} copied to clipboard!`, 'success');
        }).catch(() => {
          Toast.show(techpathId, 'info');
        });
      });

      // Close modal handler
      overlay.querySelector('#tp-modal-close-btn')?.addEventListener('click', close);
      const onKeyDown = (e) => {
        if (e.key === 'Escape') {
          window.removeEventListener('keydown', onKeyDown);
          close();
        }
      };
      window.addEventListener('keydown', onKeyDown);

      // Send Request handler
      overlay.querySelector('#modal-send-request-btn')?.addEventListener('click', async () => {
        const btn = overlay.querySelector('#modal-send-request-btn');
        btn.disabled = true;
        btn.textContent = 'Sending...';
        try {
          await ConnectEngine.sendFriendRequest(current.id, profile.id);
          Toast.show(`Friend request dispatched to ${profile.full_name}!`, 'success');
          close();
          onActionCallback();
        } catch (err) {
          Toast.show(err.message || 'Failed to send request.', 'error');
          btn.disabled = false;
          btn.textContent = 'Send Friend Request';
        }
      });

      // Remove Friend handler
      overlay.querySelector('#modal-remove-friend-btn')?.addEventListener('click', async () => {
        if (!confirm(`Are you sure you want to remove ${profile.full_name} from your friends list?`)) return;
        try {
          await ConnectEngine.removeFriend(current.id, profile.id);
          Toast.show(`Removed ${profile.full_name} from friends.`, 'info');
          close();
          onActionCallback();
        } catch (err) {
          Toast.show(err.message, 'error');
        }
      });

      // Accept Request handler
      overlay.querySelector('#modal-accept-req-btn')?.addEventListener('click', async () => {
        try {
          const reqs = await ConnectEngine.getFriendRequests(current.id);
          const req = reqs.received.find(r => r.sender_id === profile.id);
          if (req) {
            await ConnectEngine.acceptFriendRequest(req.id, current.id);
            Toast.show(`You are now friends with ${profile.full_name}!`, 'success');
            close();
            onActionCallback();
          }
        } catch (err) {
          Toast.show(err.message, 'error');
        }
      });

      // Reject Request handler
      overlay.querySelector('#modal-reject-req-btn')?.addEventListener('click', async () => {
        try {
          const reqs = await ConnectEngine.getFriendRequests(current.id);
          const req = reqs.received.find(r => r.sender_id === profile.id);
          if (req) {
            await ConnectEngine.rejectFriendRequest(req.id, current.id);
            Toast.show('Friend request rejected.', 'info');
            close();
            onActionCallback();
          }
        } catch (err) {
          Toast.show(err.message, 'error');
        }
      });

      // Cancel Request handler
      overlay.querySelector('#modal-cancel-req-btn')?.addEventListener('click', async () => {
        try {
          const reqs = await ConnectEngine.getFriendRequests(current.id);
          const req = reqs.sent.find(r => r.receiver_id === profile.id);
          if (req) {
            await ConnectEngine.cancelFriendRequest(req.id, current.id);
            Toast.show('Friend request cancelled.', 'info');
            close();
            onActionCallback();
          }
        } catch (err) {
          Toast.show(err.message, 'error');
        }
      });

      // Block User handler
      overlay.querySelector('#modal-block-user-btn')?.addEventListener('click', async () => {
        if (!confirm(`Block ${profile.full_name}? They will not be able to message you, send friend requests, or view your presence.`)) return;
        try {
          await ConnectEngine.blockUser(current.id, profile.id);
          Toast.show(`${profile.full_name} has been blocked.`, 'warning');
          close();
          onActionCallback();
        } catch (err) {
          Toast.show(err.message, 'error');
        }
      });

      // Report User handler
      overlay.querySelector('#modal-report-user-btn')?.addEventListener('click', async () => {
        const category = prompt('Report category (Spam, Harassment, Inappropriate Content, Fake Profile):', 'Inappropriate Content');
        if (!category) return;
        const details = prompt('Please explain the issue briefly:') || '';
        try {
          await ConnectEngine.reportUser({
            reporterId: current.id,
            reportedId: profile.id,
            category,
            details
          });
          Toast.show('Thank you. Your report has been submitted to TechPath moderators.', 'success');
        } catch (err) {
          Toast.show(err.message, 'error');
        }
      });

    } catch (err) {
      console.error('[PublicProfileModal Error]:', err);
      Toast.show('Failed to load student profile.', 'error');
      close();
    }
  }
}
