/**
 * TECHPATH — STUDY GROUPS PAGE
 * Academic peer collaboration, personalized engineering study circles,
 * public/private membership lifecycle, and member-gated group discussions.
 */

import { authContext } from '../context/AuthContext.js';
import { learningContext } from '../context/LearningContext.js';
import { StudyGroupEngine } from '../services/StudyGroupEngine.js';
import { Toast } from '../components/Toast.js';

export class StudyGroupsPage {
  static activeTab = 'recommended'; // 'recommended' | 'my_groups' | 'discover'
  static searchQuery = '';
  static branchFilter = 'ALL';
  static semesterFilter = 'ALL';
  static difficultyFilter = 'ALL';
  static visibilityFilter = 'ALL';
  static activeModalGroupId = null;

  static async render(container, options = {}) {
    const user = authContext.getUser();
    if (!user) {
      window.location.hash = '#/signin';
      return;
    }

    if (options.activeTab) {
      this.activeTab = options.activeTab;
    }

    const profile = user.profile || {};
    const currentBranch = (profile.branch || learningContext.get().branch_id || 'CSE').toUpperCase();
    const currentSemester = profile.semester || 4;

    container.innerHTML = `
      <div class="tp-page" style="max-width: 1200px; margin: 0 auto; padding-bottom: 4rem;">
        
        <!-- Header Section -->
        <div style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom: 0.5rem; display: inline-flex; align-items: center; gap: 0.5rem;">
                <span class="pulse-beacon" style="background: #3b82f6;"></span>
                <span>ACADEMIC PEER CIRCLES // STUDY GROUPS HUB</span>
              </div>
              <h1 class="display-lg" style="margin: 0; font-family: 'Space Grotesk', sans-serif;">Engineering Study Groups</h1>
              <p style="color: var(--tp-text-dark-secondary); margin-top: 0.35rem; font-size: 0.95rem;">
                Collaborate on coursework, solve previous-year exam problems, share code reviews, and build together in focused engineering circles.
              </p>
            </div>

            <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
              <a href="#/connect" class="tp-btn tp-btn-secondary" style="font-size: 0.9rem; text-decoration: none;">
                ← Back to Connect
              </a>
              <button id="open-create-group-btn" class="tp-btn tp-btn-primary" style="font-size: 0.9rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Study Group
              </button>
            </div>
          </div>

          <!-- Academic Context Pill Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; padding: 0.75rem 1.25rem; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; font-size: 0.88rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <span style="color: var(--tp-text-dark-secondary);">Active Academic Profile:</span>
              <span style="background: var(--tp-surface); border: 1px solid var(--tp-border); padding: 2px 10px; border-radius: 9999px; font-weight: 600; color: #3b82f6;">
                🎓 ${profile.branch || 'Engineering'}
              </span>
              <span style="background: var(--tp-surface); border: 1px solid var(--tp-border); padding: 2px 10px; border-radius: 9999px; font-weight: 600;">
                Sem ${currentSemester}
              </span>
              ${profile.specialization ? `<span style="background: var(--tp-surface); border: 1px solid var(--tp-border); padding: 2px 10px; border-radius: 9999px; color: var(--tp-text-dark-secondary);">Spec: ${profile.specialization}</span>` : ''}
              ${profile.career_goal ? `<span style="background: var(--tp-surface); border: 1px solid var(--tp-border); padding: 2px 10px; border-radius: 9999px; color: #10b981;">🎯 Goal: ${profile.career_goal}</span>` : ''}
            </div>
            <a href="#/profile" style="color: #3b82f6; text-decoration: none; font-weight: 500; font-size: 0.85rem;">
              Edit Academic Profile →
            </a>
          </div>

          <!-- Nav Tabs -->
          <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--tp-border); margin-top: 1.5rem;">
            <button class="tp-btn tp-tab-btn ${this.activeTab === 'recommended' ? 'active' : ''}" data-tab="recommended" style="border-radius: 8px 8px 0 0; font-weight: 600; padding: 0.75rem 1.25rem; border: none; background: ${this.activeTab === 'recommended' ? 'var(--tp-surface)' : 'transparent'}; border-bottom: 2px solid ${this.activeTab === 'recommended' ? '#3b82f6' : 'transparent'}; color: ${this.activeTab === 'recommended' ? '#3b82f6' : 'var(--tp-text-dark-secondary)'};">
              🎯 Recommended for You
            </button>
            <button class="tp-btn tp-tab-btn ${this.activeTab === 'my_groups' ? 'active' : ''}" data-tab="my_groups" style="border-radius: 8px 8px 0 0; font-weight: 600; padding: 0.75rem 1.25rem; border: none; background: ${this.activeTab === 'my_groups' ? 'var(--tp-surface)' : 'transparent'}; border-bottom: 2px solid ${this.activeTab === 'my_groups' ? '#3b82f6' : 'transparent'}; color: ${this.activeTab === 'my_groups' ? '#3b82f6' : 'var(--tp-text-dark-secondary)'};">
              👥 My Study Groups <span id="my-groups-count-badge" style="background: rgba(59, 130, 246, 0.2); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; margin-left: 4px;">0</span>
            </button>
            <button class="tp-btn tp-tab-btn ${this.activeTab === 'discover' ? 'active' : ''}" data-tab="discover" style="border-radius: 8px 8px 0 0; font-weight: 600; padding: 0.75rem 1.25rem; border: none; background: ${this.activeTab === 'discover' ? 'var(--tp-surface)' : 'transparent'}; border-bottom: 2px solid ${this.activeTab === 'discover' ? '#3b82f6' : 'transparent'}; color: ${this.activeTab === 'discover' ? '#3b82f6' : 'var(--tp-text-dark-secondary)'};">
              🌐 Discover All Groups
            </button>
          </div>
        </div>

        <!-- Filter & Search Controls -->
        <div class="tp-card" style="margin-bottom: 1.75rem; padding: 1rem 1.25rem; background: var(--tp-surface); border: 1px solid var(--tp-border); border-radius: 12px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; align-items: center;">
            
            <!-- Search -->
            <div style="grid-column: span 2; min-width: 240px;">
              <input type="text" id="sg-search-input" class="tp-input" placeholder="Search groups by topic, subject, or keywords..." value="${this.searchQuery}" style="width: 100%; border-radius: 8px;" />
            </div>

            <!-- Branch -->
            <div>
              <select id="sg-branch-select" class="tp-input" style="width: 100%; border-radius: 8px;">
                <option value="ALL" ${this.branchFilter === 'ALL' ? 'selected' : ''}>All Branches</option>
                <option value="CSE" ${this.branchFilter === 'CSE' ? 'selected' : ''}>Computer Science (CSE)</option>
                <option value="ECE" ${this.branchFilter === 'ECE' ? 'selected' : ''}>Electronics (ECE)</option>
                <option value="MECH" ${this.branchFilter === 'MECH' ? 'selected' : ''}>Mechanical (MECH)</option>
                <option value="CIVIL" ${this.branchFilter === 'CIVIL' ? 'selected' : ''}>Civil (CIVIL)</option>
                <option value="EEE" ${this.branchFilter === 'EEE' ? 'selected' : ''}>Electrical (EEE)</option>
                <option value="AIML" ${this.branchFilter === 'AIML' ? 'selected' : ''}>AI & Data Science (AIML)</option>
              </select>
            </div>

            <!-- Semester -->
            <div>
              <select id="sg-sem-select" class="tp-input" style="width: 100%; border-radius: 8px;">
                <option value="ALL" ${this.semesterFilter === 'ALL' ? 'selected' : ''}>All Semesters</option>
                ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" ${String(this.semesterFilter) === String(s) ? 'selected' : ''}>Semester ${s}</option>`).join('')}
              </select>
            </div>

            <!-- Difficulty -->
            <div>
              <select id="sg-diff-select" class="tp-input" style="width: 100%; border-radius: 8px;">
                <option value="ALL" ${this.difficultyFilter === 'ALL' ? 'selected' : ''}>Any Difficulty</option>
                <option value="Beginner" ${this.difficultyFilter === 'Beginner' ? 'selected' : ''}>Beginner</option>
                <option value="Intermediate" ${this.difficultyFilter === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                <option value="Advanced" ${this.difficultyFilter === 'Advanced' ? 'selected' : ''}>Advanced</option>
                <option value="Comprehensive" ${this.difficultyFilter === 'Comprehensive' ? 'selected' : ''}>Comprehensive</option>
              </select>
            </div>

            <!-- Visibility -->
            <div>
              <select id="sg-vis-select" class="tp-input" style="width: 100%; border-radius: 8px;">
                <option value="ALL" ${this.visibilityFilter === 'ALL' ? 'selected' : ''}>All Visibility</option>
                <option value="PUBLIC" ${this.visibilityFilter === 'PUBLIC' ? 'selected' : ''}>Public Circles</option>
                <option value="PRIVATE" ${this.visibilityFilter === 'PRIVATE' ? 'selected' : ''}>Private (Request Only)</option>
              </select>
            </div>

          </div>
        </div>

        <!-- Groups Grid Container -->
        <div id="study-groups-grid" style="min-height: 300px;">
          <div style="display: flex; justify-content: center; align-items: center; padding: 3rem;">
            <div class="cube-spinner" style="width: 32px; height: 32px;"></div>
          </div>
        </div>

      </div>

      <!-- Modal: Group Workspace & Discussion -->
      <div id="sg-workspace-modal" style="display: none; position: fixed; inset: 0; z-index: 1000; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px); overflow-y: auto; padding: 2rem 1rem;">
        <div style="max-width: 800px; margin: 0 auto; background: var(--tp-surface); border: 1px solid var(--tp-border); border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh;">
          <div id="sg-workspace-content" style="display: flex; flex-direction: column; height: 100%;">
            <!-- Dynamic workspace loaded here -->
          </div>
        </div>
      </div>

      <!-- Modal: Create Study Group -->
      <div id="sg-create-modal" style="display: none; position: fixed; inset: 0; z-index: 1000; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px); overflow-y: auto; padding: 2rem 1rem;">
        <div style="max-width: 620px; margin: 0 auto; background: var(--tp-surface); border: 1px solid var(--tp-border); border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); overflow: hidden;">
          <div style="padding: 1.5rem 1.75rem; border-bottom: 1px solid var(--tp-border); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700;">Create an Engineering Study Group</h3>
            <button id="close-create-modal-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--tp-text-dark-secondary);">✕</button>
          </div>
          <form id="sg-create-form" style="padding: 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 1.15rem;">
            <div>
              <label class="tp-label" style="display: block; margin-bottom: 0.35rem; font-weight: 600;">Group Name *</label>
              <input type="text" id="create-sg-name" class="tp-input" placeholder="e.g. Distributed Database Internals & Raft" required style="width: 100%; border-radius: 8px;" />
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label class="tp-label" style="display: block; margin-bottom: 0.35rem; font-weight: 600;">Engineering Branch *</label>
                <select id="create-sg-branch" class="tp-input" style="width: 100%; border-radius: 8px;" required>
                  <option value="CSE">CSE (Computer Science)</option>
                  <option value="ECE">ECE (Electronics)</option>
                  <option value="MECH">MECH (Mechanical)</option>
                  <option value="CIVIL">CIVIL (Civil)</option>
                  <option value="EEE">EEE (Electrical)</option>
                  <option value="AIML">AIML (AI / Data Science)</option>
                  <option value="ALL">All Engineering Branches</option>
                </select>
              </div>
              <div>
                <label class="tp-label" style="display: block; margin-bottom: 0.35rem; font-weight: 600;">Target Semester *</label>
                <select id="create-sg-semester" class="tp-input" style="width: 100%; border-radius: 8px;" required>
                  ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" ${s === 4 ? 'selected' : ''}>Semester ${s}</option>`).join('')}
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label class="tp-label" style="display: block; margin-bottom: 0.35rem; font-weight: 600;">Subject / Core Topic *</label>
                <input type="text" id="create-sg-subject" class="tp-input" placeholder="e.g. Operating Systems, VLSI, Algorithms" required style="width: 100%; border-radius: 8px;" />
              </div>
              <div>
                <label class="tp-label" style="display: block; margin-bottom: 0.35rem; font-weight: 600;">Difficulty Level *</label>
                <select id="create-sg-difficulty" class="tp-input" style="width: 100%; border-radius: 8px;">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate" selected>Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Comprehensive">Comprehensive</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label class="tp-label" style="display: block; margin-bottom: 0.35rem; font-weight: 600;">Max Capacity (Members) *</label>
                <input type="number" id="create-sg-capacity" class="tp-input" min="2" max="100" value="25" required style="width: 100%; border-radius: 8px;" />
              </div>
              <div>
                <label class="tp-label" style="display: block; margin-bottom: 0.35rem; font-weight: 600;">Access Control *</label>
                <select id="create-sg-privacy" class="tp-input" style="width: 100%; border-radius: 8px;">
                  <option value="public" selected>Public (Instant Join)</option>
                  <option value="private">Private (Approval Required)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="tp-label" style="display: block; margin-bottom: 0.35rem; font-weight: 600;">Description & Goals *</label>
              <textarea id="create-sg-desc" class="tp-input" rows="3" placeholder="Outline the group purpose, meeting cadence, resources studied, or project milestones..." required style="width: 100%; border-radius: 8px;"></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem;">
              <button type="button" id="cancel-create-modal-btn" class="tp-btn tp-btn-secondary" style="border-radius: 8px;">Cancel</button>
              <button type="submit" id="submit-create-group-btn" class="tp-btn tp-btn-primary" style="border-radius: 8px; font-weight: 600;">Create Group Circle</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this._bindEvents(container, user);
    await this._loadGroups(container, user);
  }

  static _bindEvents(container, user) {
    // 1. Tab switches
    container.querySelectorAll('.tp-tab-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        if (tab && tab !== this.activeTab) {
          this.activeTab = tab;
          container.querySelectorAll('.tp-tab-btn').forEach(b => {
            b.classList.remove('active');
            b.style.background = 'transparent';
            b.style.borderBottom = '2px solid transparent';
            b.style.color = 'var(--tp-text-dark-secondary)';
          });
          e.currentTarget.classList.add('active');
          e.currentTarget.style.background = 'var(--tp-surface)';
          e.currentTarget.style.borderBottom = '2px solid #3b82f6';
          e.currentTarget.style.color = '#3b82f6';
          await this._loadGroups(container, user);
        }
      });
    });

    // 2. Filter changes
    const searchInput = container.querySelector('#sg-search-input');
    let searchDebounce = null;
    searchInput?.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(async () => {
        this.searchQuery = e.target.value;
        await this._loadGroups(container, user);
      }, 250);
    });

    container.querySelector('#sg-branch-select')?.addEventListener('change', async (e) => {
      this.branchFilter = e.target.value;
      await this._loadGroups(container, user);
    });

    container.querySelector('#sg-sem-select')?.addEventListener('change', async (e) => {
      this.semesterFilter = e.target.value;
      await this._loadGroups(container, user);
    });

    container.querySelector('#sg-diff-select')?.addEventListener('change', async (e) => {
      this.difficultyFilter = e.target.value;
      await this._loadGroups(container, user);
    });

    container.querySelector('#sg-vis-select')?.addEventListener('change', async (e) => {
      this.visibilityFilter = e.target.value;
      await this._loadGroups(container, user);
    });

    // 3. Create Group Modal toggles
    const createModal = container.querySelector('#sg-create-modal');
    container.querySelector('#open-create-group-btn')?.addEventListener('click', () => {
      if (createModal) createModal.style.display = 'block';
    });
    container.querySelector('#close-create-modal-btn')?.addEventListener('click', () => {
      if (createModal) createModal.style.display = 'none';
    });
    container.querySelector('#cancel-create-modal-btn')?.addEventListener('click', () => {
      if (createModal) createModal.style.display = 'none';
    });

    // 4. Create Group form submission
    const form = container.querySelector('#sg-create-form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = container.querySelector('#submit-create-group-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating...';

      try {
        const payload = {
          name: container.querySelector('#create-sg-name')?.value,
          branch: container.querySelector('#create-sg-branch')?.value,
          semester: container.querySelector('#create-sg-semester')?.value,
          subject: container.querySelector('#create-sg-subject')?.value,
          difficulty: container.querySelector('#create-sg-difficulty')?.value,
          max_members: container.querySelector('#create-sg-capacity')?.value,
          is_private: container.querySelector('#create-sg-privacy')?.value === 'private',
          description: container.querySelector('#create-sg-desc')?.value
        };

        const newGroup = await StudyGroupEngine.createGroup(payload, user);
        Toast.show(`Study group "${newGroup.name}" created!`, 'success');
        if (createModal) createModal.style.display = 'none';
        form.reset();

        // Switch to 'my_groups' to see newly created group
        this.activeTab = 'my_groups';
        await this._loadGroups(container, user);
      } catch (err) {
        Toast.show(err.message || 'Failed to create study group.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Group Circle';
      }
    });

    // Global listener for study group events to auto-refresh
    window.addEventListener('techpath:study_group_membership_changed', async () => {
      await this._loadGroups(container, user);
      if (this.activeModalGroupId) {
        await this._openGroupWorkspace(container, user, this.activeModalGroupId);
      }
    });
  }

  /**
   * Load and render filtered study groups
   */
  static async _loadGroups(container, user) {
    const grid = container.querySelector('#study-groups-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; padding: 4rem;">
        <div class="cube-spinner" style="width: 32px; height: 32px;"></div>
      </div>
    `;

    try {
      const filters = {
        tab: this.activeTab,
        search: this.searchQuery,
        branch: this.branchFilter,
        semester: this.semesterFilter,
        difficulty: this.difficultyFilter,
        visibility: this.visibilityFilter
      };

      const groups = await StudyGroupEngine.getPersonalizedGroups(user.profile || {}, filters, user.id);

      // Update badge on my groups
      const myMemberships = await StudyGroupEngine.getUserMemberships(user.id);
      const countBadge = container.querySelector('#my-groups-count-badge');
      if (countBadge) countBadge.textContent = myMemberships.length;

      if (!groups || groups.length === 0) {
        grid.innerHTML = `
          <div class="tp-card" style="text-align: center; padding: 4rem 2rem; border-radius: 16px;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</div>
            <h3 style="margin-bottom: 0.5rem; font-size: 1.2rem; font-weight: 700;">No Study Groups Found</h3>
            <p style="color: var(--tp-text-dark-secondary); max-width: 480px; margin: 0 auto 1.5rem auto; font-size: 0.92rem;">
              ${this.activeTab === 'my_groups' 
                ? "You haven't joined any study groups yet. Explore recommended circles to collaborate with fellow engineers!" 
                : "No study circles match your current search and filter settings. Try adjusting your filters or start your own group."}
            </p>
            <button id="empty-state-action-btn" class="tp-btn tp-btn-primary" style="font-weight: 600;">
              ${this.activeTab === 'my_groups' ? 'Explore Recommended Groups' : '+ Create New Group'}
            </button>
          </div>
        `;

        grid.querySelector('#empty-state-action-btn')?.addEventListener('click', () => {
          if (this.activeTab === 'my_groups') {
            this.activeTab = 'recommended';
            container.querySelector('[data-tab="recommended"]')?.click();
          } else {
            const m = container.querySelector('#sg-create-modal');
            if (m) m.style.display = 'block';
          }
        });
        return;
      }

      grid.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.25rem;">
          ${groups.map(g => this._renderGroupCard(g, user)).join('')}
        </div>
      `;

      // Attach group card action listeners
      this._bindCardActions(grid, container, user);

    } catch (err) {
      console.error('[StudyGroupsPage._loadGroups Error]:', err);
      grid.innerHTML = `
        <div class="tp-card" style="text-align: center; padding: 3rem; color: #ef4444;">
          Failed to load study groups. Please refresh the page.
        </div>
      `;
    }
  }

  /**
   * Render individual group card
   */
  static _renderGroupCard(g, user) {
    const isMember = g.is_member;
    const isCreator = g.is_creator;
    const hasPending = g.has_pending_request;
    const isFull = g.is_full;
    const memberCount = g.member_count || 1;
    const maxCapacity = g.max_members || 25;
    const fillPercent = Math.min(100, Math.round((memberCount / maxCapacity) * 100));

    let actionBtnHtml = '';
    if (isMember) {
      actionBtnHtml = `
        <button class="tp-btn tp-btn-primary open-workspace-btn" data-group-id="${g.id}" style="width: 100%; justify-content: center; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
          <span>Enter Workspace & Chat 💬</span>
        </button>
      `;
    } else if (hasPending) {
      actionBtnHtml = `
        <button class="tp-btn tp-btn-secondary" disabled style="width: 100%; justify-content: center; opacity: 0.7; cursor: not-allowed;">
          ⏳ Request Pending Approval
        </button>
      `;
    } else if (isFull) {
      actionBtnHtml = `
        <button class="tp-btn tp-btn-secondary" disabled style="width: 100%; justify-content: center; opacity: 0.5; cursor: not-allowed;">
          Circle Full (${memberCount}/${maxCapacity})
        </button>
      `;
    } else if (g.is_private) {
      actionBtnHtml = `
        <button class="tp-btn tp-btn-secondary join-group-btn" data-group-id="${g.id}" style="width: 100%; justify-content: center; font-weight: 600; border-color: rgba(168, 85, 247, 0.4); color: #c084fc;">
          Request Access 🔒
        </button>
      `;
    } else {
      actionBtnHtml = `
        <button class="tp-btn tp-btn-primary join-group-btn" data-group-id="${g.id}" style="width: 100%; justify-content: center; font-weight: 600;">
          Join Study Circle +
        </button>
      `;
    }

    const matchBadge = this.activeTab === 'recommended' && g.relevance_score > 30 ? `
      <span style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px;">
        🎯 ${g.relevance_score}% Match
      </span>
    ` : '';

    return `
      <div class="tp-card" style="background: var(--tp-surface); border: 1px solid var(--tp-border); border-radius: 14px; padding: 1.35rem; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.15s ease, border-color 0.15s ease;"
           onmouseover="this.style.borderColor='rgba(59, 130, 246, 0.5)'" onmouseout="this.style.borderColor='var(--tp-border)'">
        
        <div>
          <!-- Top Tag Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center;">
              <span style="background: rgba(59, 130, 246, 0.12); color: #3b82f6; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">
                ${g.branch}
              </span>
              <span style="background: var(--tp-surface-hover, rgba(255,255,255,0.05)); border: 1px solid var(--tp-border); font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; color: var(--tp-text-dark-secondary);">
                Sem ${g.semester}
              </span>
              <span style="background: ${g.is_private ? 'rgba(168, 85, 247, 0.12)' : 'rgba(16, 185, 129, 0.12)'}; color: ${g.is_private ? '#a855f7' : '#10b981'}; font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 4px;">
                ${g.is_private ? '🔒 Private' : '🌐 Public'}
              </span>
            </div>
            ${matchBadge}
          </div>

          <!-- Group Title & Subject -->
          <h3 style="margin: 0 0 0.35rem 0; font-size: 1.15rem; font-weight: 700; line-height: 1.35;">
            ${g.name}
          </h3>
          <div style="color: #3b82f6; font-size: 0.82rem; font-weight: 600; margin-bottom: 0.75rem;">
            📚 ${g.subject || 'Engineering Core'} • <span style="color: var(--tp-text-dark-secondary);">${g.difficulty}</span>
          </div>

          <!-- Description -->
          <p style="color: var(--tp-text-dark-secondary); font-size: 0.88rem; line-height: 1.45; margin: 0 0 1.25rem 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
            ${g.description || 'Collaborative engineering study group for coursework and exam mastery.'}
          </p>
        </div>

        <div>
          <!-- Member Progress & Capacity -->
          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.35rem;">
              <span style="color: var(--tp-text-dark-secondary);">Capacity</span>
              <span style="font-weight: 600;">${memberCount} / ${maxCapacity} seats</span>
            </div>
            <div style="height: 6px; width: 100%; background: var(--tp-border); border-radius: 9999px; overflow: hidden;">
              <div style="height: 100%; width: ${fillPercent}%; background: ${fillPercent > 90 ? '#ef4444' : fillPercent > 60 ? '#f59e0b' : '#3b82f6'}; border-radius: 9999px;"></div>
            </div>
          </div>

          <!-- Organizer Signature -->
          <div style="font-size: 0.78rem; color: var(--tp-text-dark-secondary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
            <span>Organizer:</span>
            <span style="font-weight: 600; color: var(--tp-text-dark-primary);">${g.creator_name || 'Academic Lead'}</span>
            ${isCreator ? '<span style="background: rgba(59, 130, 246, 0.2); color: #3b82f6; font-size: 0.68rem; padding: 1px 6px; border-radius: 4px; font-weight: 700;">YOU</span>' : ''}
          </div>

          <!-- Card Action Button -->
          ${actionBtnHtml}
        </div>

      </div>
    `;
  }

  /**
   * Bind card buttons (join, workspace modal)
   */
  static _bindCardActions(grid, container, user) {
    // 1. Join Group Button
    grid.querySelectorAll('.join-group-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const groupId = e.currentTarget.getAttribute('data-group-id');
        if (!groupId) return;
        const origText = e.currentTarget.innerHTML;
        e.currentTarget.disabled = true;
        e.currentTarget.textContent = 'Processing...';

        try {
          const res = await StudyGroupEngine.joinGroup(groupId, user);
          Toast.show(res.message, 'success');
          await this._loadGroups(container, user);
        } catch (err) {
          Toast.show(err.message || 'Unable to join group.', 'error');
          e.currentTarget.disabled = false;
          e.currentTarget.innerHTML = origText;
        }
      });
    });

    // 2. Open Workspace Modal
    grid.querySelectorAll('.open-workspace-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const groupId = e.currentTarget.getAttribute('data-group-id');
        if (!groupId) return;
        await this._openGroupWorkspace(container, user, groupId);
      });
    });
  }

  /**
   * Open Group Workspace modal (Discussion board, member roster, pending join requests)
   */
  static async _openGroupWorkspace(container, user, groupId) {
    this.activeModalGroupId = groupId;
    const modal = container.querySelector('#sg-workspace-modal');
    const content = container.querySelector('#sg-workspace-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; padding: 5rem;">
        <div class="cube-spinner" style="width: 36px; height: 36px;"></div>
      </div>
    `;
    modal.style.display = 'block';

    try {
      const details = await StudyGroupEngine.getGroupDetails(groupId, user.id);
      if (!details) throw new Error('Group not found');

      // Fetch messages (strict gating verification)
      let messages = [];
      try {
        messages = await StudyGroupEngine.getGroupMessages(groupId, user.id);
      } catch (e) {
        messages = [];
      }

      content.innerHTML = `
        <!-- Workspace Header -->
        <div style="padding: 1.25rem 1.75rem; border-bottom: 1px solid var(--tp-border); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02);">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span style="background: rgba(59, 130, 246, 0.15); color: #3b82f6; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;">
                ${details.branch} • Sem ${details.semester}
              </span>
              <span style="font-size: 0.8rem; color: var(--tp-text-dark-secondary);">
                ${details.subject}
              </span>
            </div>
            <h2 style="margin: 0; font-size: 1.35rem; font-weight: 700; font-family: 'Space Grotesk', sans-serif;">
              ${details.name}
            </h2>
          </div>
          <button id="close-workspace-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--tp-text-dark-secondary);">✕</button>
        </div>

        <!-- Subtabs inside modal -->
        <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--tp-border); padding: 0 1.75rem; background: var(--tp-surface);">
          <button id="ws-tab-chat" class="tp-btn ws-tab-btn active" style="border-radius: 0; padding: 0.75rem 1rem; border: none; background: transparent; border-bottom: 2px solid #3b82f6; color: #3b82f6; font-weight: 600;">
            💬 Discussion (${messages.length})
          </button>
          <button id="ws-tab-members" class="tp-btn ws-tab-btn" style="border-radius: 0; padding: 0.75rem 1rem; border: none; background: transparent; border-bottom: 2px solid transparent; color: var(--tp-text-dark-secondary); font-weight: 600;">
            👥 Members (${details.members.length})
          </button>
          ${details.is_creator && details.pending_requests && details.pending_requests.length > 0 ? `
            <button id="ws-tab-requests" class="tp-btn ws-tab-btn" style="border-radius: 0; padding: 0.75rem 1rem; border: none; background: transparent; border-bottom: 2px solid transparent; color: #a855f7; font-weight: 600;">
              📥 Requests (${details.pending_requests.length})
            </button>
          ` : ''}
        </div>

        <!-- Body Panes -->
        <div id="ws-panes-container" style="flex: 1; overflow-y: auto; padding: 1.25rem 1.75rem; display: flex; flex-direction: column;">
          
          <!-- Pane 1: Chat & Discussion -->
          <div id="ws-pane-chat" style="display: flex; flex-direction: column; height: 100%; min-height: 380px;">
            <div id="ws-messages-list" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.85rem; padding-right: 0.5rem; margin-bottom: 1rem; max-height: 380px;">
              ${messages.length === 0 ? `
                <div style="text-align: center; color: var(--tp-text-dark-secondary); padding: 3rem 1rem;">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">💭</div>
                  <div style="font-weight: 600;">No messages yet in this study circle.</div>
                  <div style="font-size: 0.85rem;">Be the first to share a question, formula, or note!</div>
                </div>
              ` : messages.map(m => `
                <div style="display: flex; gap: 0.75rem; align-items: flex-start; ${m.user_id === user.id ? 'justify-content: flex-end;' : ''}">
                  ${m.user_id !== user.id ? `
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: #3b82f6; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.8rem; flex-shrink: 0;">
                      ${(m.user_name || 'U').charAt(0).toUpperCase()}
                    </div>
                  ` : ''}
                  <div style="max-width: 80%; background: ${m.user_id === user.id ? 'rgba(59, 130, 246, 0.2)' : 'var(--tp-surface-hover, rgba(255,255,255,0.05))'}; border: 1px solid ${m.user_id === user.id ? 'rgba(59, 130, 246, 0.4)' : 'var(--tp-border)'}; border-radius: 12px; padding: 0.65rem 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 0.75rem; margin-bottom: 0.25rem;">
                      <span style="font-size: 0.78rem; font-weight: 700; color: ${m.user_id === user.id ? '#60a5fa' : 'var(--tp-text-dark-primary)'};">
                        ${m.user_id === user.id ? 'You' : m.user_name}
                      </span>
                      <span style="font-size: 0.7rem; color: var(--tp-text-dark-secondary);">
                        ${new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style="font-size: 0.9rem; line-height: 1.4; word-break: break-word;">
                      ${m.message}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Chat Input Box -->
            <form id="ws-send-form" style="display: flex; gap: 0.5rem; border-top: 1px solid var(--tp-border); padding-top: 0.75rem;">
              <input type="text" id="ws-chat-input" class="tp-input" placeholder="Type a message or engineering question to the group..." style="flex: 1; border-radius: 8px;" required />
              <button type="submit" id="ws-send-btn" class="tp-btn tp-btn-primary" style="font-weight: 600; border-radius: 8px;">
                Send
              </button>
            </form>
          </div>

          <!-- Pane 2: Members Roster -->
          <div id="ws-pane-members" style="display: none; flex-direction: column; gap: 0.75rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem;">
              ${details.members.map(mem => `
                <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid var(--tp-border); border-radius: 10px; background: rgba(255,255,255,0.02);">
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: #2563eb; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
                    ${(mem.user_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style="font-weight: 600; font-size: 0.88rem;">${mem.user_name}</div>
                    <div style="font-size: 0.75rem; color: var(--tp-text-dark-secondary);">${mem.techpath_id || 'Student'} • <span style="color: ${mem.role === 'creator' ? '#3b82f6' : 'inherit'}; font-weight: 600;">${mem.role === 'creator' ? '👑 Organizer' : 'Member'}</span></div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div style="margin-top: 1.5rem; border-top: 1px solid var(--tp-border); padding-top: 1rem; display: flex; justify-content: flex-end;">
              <button id="ws-leave-group-btn" class="tp-btn tp-btn-secondary" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.4); font-size: 0.85rem;">
                🚪 Leave Study Group
              </button>
            </div>
          </div>

          <!-- Pane 3: Pending Requests (Creator only) -->
          ${details.is_creator ? `
            <div id="ws-pane-requests" style="display: none; flex-direction: column; gap: 0.75rem;">
              ${details.pending_requests.length === 0 ? `
                <div style="text-align: center; color: var(--tp-text-dark-secondary); padding: 2rem;">
                  No pending membership applications.
                </div>
              ` : details.pending_requests.map(req => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; border: 1px solid var(--tp-border); border-radius: 10px; background: rgba(255,255,255,0.02);">
                  <div>
                    <div style="font-weight: 600; font-size: 0.95rem;">${req.user_name}</div>
                    <div style="font-size: 0.78rem; color: var(--tp-text-dark-secondary);">Applied on ${new Date(req.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style="display: flex; gap: 0.5rem;">
                    <button class="tp-btn tp-btn-primary handle-req-btn" data-req-id="${req.id}" data-action="accept" style="font-size: 0.82rem; padding: 4px 10px;">
                      ✓ Approve
                    </button>
                    <button class="tp-btn tp-btn-secondary handle-req-btn" data-req-id="${req.id}" data-action="reject" style="font-size: 0.82rem; padding: 4px 10px; color: #ef4444;">
                      ✕ Reject
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

        </div>
      `;

      // Scroll messages down
      const msgList = content.querySelector('#ws-messages-list');
      if (msgList) msgList.scrollTop = msgList.scrollHeight;

      // Bind workspace subtab toggles
      const tabChat = content.querySelector('#ws-tab-chat');
      const tabMembers = content.querySelector('#ws-tab-members');
      const tabRequests = content.querySelector('#ws-tab-requests');

      const paneChat = content.querySelector('#ws-pane-chat');
      const paneMembers = content.querySelector('#ws-pane-members');
      const paneRequests = content.querySelector('#ws-pane-requests');

      const resetTabs = () => {
        [tabChat, tabMembers, tabRequests].forEach(t => {
          if (t) {
            t.style.borderBottom = '2px solid transparent';
            t.style.color = 'var(--tp-text-dark-secondary)';
          }
        });
        if (paneChat) paneChat.style.display = 'none';
        if (paneMembers) paneMembers.style.display = 'none';
        if (paneRequests) paneRequests.style.display = 'none';
      };

      tabChat?.addEventListener('click', () => {
        resetTabs();
        tabChat.style.borderBottom = '2px solid #3b82f6';
        tabChat.style.color = '#3b82f6';
        if (paneChat) paneChat.style.display = 'flex';
      });

      tabMembers?.addEventListener('click', () => {
        resetTabs();
        tabMembers.style.borderBottom = '2px solid #3b82f6';
        tabMembers.style.color = '#3b82f6';
        if (paneMembers) paneMembers.style.display = 'flex';
      });

      tabRequests?.addEventListener('click', () => {
        resetTabs();
        tabRequests.style.borderBottom = '2px solid #a855f7';
        tabRequests.style.color = '#a855f7';
        if (paneRequests) paneRequests.style.display = 'flex';
      });

      // Close modal
      content.querySelector('#close-workspace-btn')?.addEventListener('click', () => {
        modal.style.display = 'none';
        this.activeModalGroupId = null;
      });

      // Send message
      const sendForm = content.querySelector('#ws-send-form');
      sendForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const chatInput = content.querySelector('#ws-chat-input');
        const text = (chatInput?.value || '').trim();
        if (!text) return;

        try {
          await StudyGroupEngine.sendGroupMessage(groupId, user, text);
          chatInput.value = '';
          // Re-render chat pane
          await this._openGroupWorkspace(container, user, groupId);
        } catch (err) {
          Toast.show(err.message || 'Failed to send message.', 'error');
        }
      });

      // Leave group button
      content.querySelector('#ws-leave-group-btn')?.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to leave this study group?')) return;
        try {
          await StudyGroupEngine.leaveGroup(groupId, user.id);
          Toast.show('Left study group.', 'info');
          modal.style.display = 'none';
          this.activeModalGroupId = null;
          await this._loadGroups(container, user);
        } catch (err) {
          Toast.show(err.message || 'Error leaving group.', 'error');
        }
      });

      // Handle pending requests (Approve / Reject)
      content.querySelectorAll('.handle-req-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const reqId = e.currentTarget.getAttribute('data-req-id');
          const decision = e.currentTarget.getAttribute('data-action');
          try {
            await StudyGroupEngine.handleJoinRequest(reqId, decision, user);
            Toast.show(`Request ${decision}ed.`, 'success');
            await this._openGroupWorkspace(container, user, groupId);
          } catch (err) {
            Toast.show(err.message || 'Action failed.', 'error');
          }
        });
      });

    } catch (err) {
      console.error('[StudyGroupsPage._openGroupWorkspace Error]:', err);
      content.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #ef4444;">
          ${err.message || 'Could not load group workspace.'}
          <div style="margin-top: 1rem;">
            <button onclick="document.getElementById('sg-workspace-modal').style.display='none'" class="tp-btn tp-btn-secondary">Close</button>
          </div>
        </div>
      `;
    }
  }
}
