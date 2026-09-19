/**
 * TECHPATH — CONNECT HUB (STUDENT NETWORKING & PEER DISCOVERY)
 * Branch-isolated student discovery, multi-facet filtering, friend request management,
 * and accepted friends list.
 */

import { authContext } from '../context/AuthContext.js';
import { learningContext } from '../context/LearningContext.js';
import { ConnectEngine } from '../services/ConnectEngine.js';
import { PublicProfileModal } from '../components/PublicProfileModal.js';
import { Toast } from '../components/Toast.js';
import { I18nEngine } from '../services/I18nEngine.js';
import { APP_CONFIG } from '../config.js';

export class ConnectPage {
  static activeTab = 'discover'; // 'discover' | 'requests' | 'friends'
  static activeSubTab = 'received'; // 'received' | 'sent'
  static searchQuery = '';
  static branchFilter = null;
  static semesterFilter = 'all';
  static skillFilter = '';
  static careerFilter = '';

  static async render(container, routeTab = null) {
    const user = authContext.getUser();
    if (!user) {
      window.location.hash = '#/signin';
      return;
    }

    const currentBranch = user.profile?.branch_id || learningContext.get().branch_id || 'cse';
    if (this.branchFilter === null) {
      this.branchFilter = currentBranch;
    }

    if (routeTab) {
      this.activeTab = routeTab;
    }

    // Compute request counts for badges
    const { received: recList, sent: sentList } = await ConnectEngine.getFriendRequests(user.id);
    const friendsList = await ConnectEngine.getFriends(user.id);

    container.innerHTML = `
      <div class="tp-page" style="max-width: 1200px; margin: 0 auto; padding-bottom: 4rem;">
        
        <!-- Header & Nav Tabs -->
        <div style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom: 0.5rem; display: inline-flex; align-items: center; gap: 0.5rem;">
                <span class="pulse-beacon" style="background: #a855f7;"></span>
                <span>ENGINEERING PEER NETWORK // BRANCH ISOLATED</span>
              </div>
              <h1 class="display-lg" style="margin: 0; font-family: 'Space Grotesk', sans-serif;">TechPath Connect</h1>
              <p style="color: var(--tp-text-dark-secondary); margin-top: 0.35rem; font-size: 0.95rem;">
                Discover students in your department, collaborate on capstones, exchange study tips, and build together.
              </p>
            </div>

            <!-- Quick Actions -->
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <a href="#/connect/study-groups" class="tp-btn tp-btn-secondary" style="
                display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.25rem; font-size: 0.9rem;
              ">
                <span>📚</span> Study Groups
              </a>
              <a href="#/connect/chat" class="tp-btn tp-btn-secondary" style="
                display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.25rem; font-size: 0.9rem;
              ">
                <span>💬</span> Direct Messages
              </a>
            </div>
          </div>

          <!-- Main Sub-Navigation Bar -->
          <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 0.75rem; flex-wrap: wrap;">
            <button type="button" id="tab-discover-btn" class="tp-btn ${this.activeTab === 'discover' ? 'tp-btn-primary' : 'tp-btn-ghost'}" style="font-size: 0.92rem; padding: 0.6rem 1.25rem;">
              <span>🌐</span> Discover Peers
            </button>
            <button type="button" id="tab-requests-btn" class="tp-btn ${this.activeTab === 'requests' ? 'tp-btn-primary' : 'tp-btn-ghost'}" style="font-size: 0.92rem; padding: 0.6rem 1.25rem; position: relative;">
              <span>📩</span> Friend Requests
              ${recList.length > 0 ? `<span style="background: #ef4444; color: #fff; font-size: 0.7rem; font-weight: 800; padding: 0.1rem 0.45rem; border-radius: 999px; margin-left: 0.4rem;">${recList.length}</span>` : ''}
            </button>
            <button type="button" id="tab-friends-btn" class="tp-btn ${this.activeTab === 'friends' ? 'tp-btn-primary' : 'tp-btn-ghost'}" style="font-size: 0.92rem; padding: 0.6rem 1.25rem;">
              <span>👥</span> My Friends (${friendsList.length})
            </button>
            <a href="#/connect/study-groups" class="tp-btn tp-btn-ghost" style="font-size: 0.92rem; padding: 0.6rem 1.25rem; text-decoration: none; color: inherit; display: inline-flex; align-items: center; gap: 0.4rem;">
              <span>📚</span> Study Circles Hub
            </a>
          </div>
        </div>

        <!-- Dynamic Content Body -->
        <div id="tp-connect-body-root"></div>
      </div>
    `;

    // Bind tab clicks
    container.querySelector('#tab-discover-btn')?.addEventListener('click', () => {
      this.activeTab = 'discover';
      window.location.hash = '#/connect';
      this.renderBody(container, user, currentBranch);
      this._updateTabStyles(container);
    });

    container.querySelector('#tab-requests-btn')?.addEventListener('click', () => {
      this.activeTab = 'requests';
      window.location.hash = '#/connect/requests';
      this.renderBody(container, user, currentBranch);
      this._updateTabStyles(container);
    });

    container.querySelector('#tab-friends-btn')?.addEventListener('click', () => {
      this.activeTab = 'friends';
      window.location.hash = '#/connect/friends';
      this.renderBody(container, user, currentBranch);
      this._updateTabStyles(container);
    });

    this.renderBody(container, user, currentBranch);
  }

  static _updateTabStyles(container) {
    const dBtn = container.querySelector('#tab-discover-btn');
    const rBtn = container.querySelector('#tab-requests-btn');
    const fBtn = container.querySelector('#tab-friends-btn');

    if (dBtn) dBtn.className = `tp-btn ${this.activeTab === 'discover' ? 'tp-btn-primary' : 'tp-btn-ghost'}`;
    if (rBtn) rBtn.className = `tp-btn ${this.activeTab === 'requests' ? 'tp-btn-primary' : 'tp-btn-ghost'}`;
    if (fBtn) fBtn.className = `tp-btn ${this.activeTab === 'friends' ? 'tp-btn-primary' : 'tp-btn-ghost'}`;
  }

  static async renderBody(container, user, currentBranch) {
    const bodyRoot = container.querySelector('#tp-connect-body-root');
    if (!bodyRoot) return;

    if (this.activeTab === 'discover') {
      await this._renderDiscoverTab(bodyRoot, user, currentBranch);
    } else if (this.activeTab === 'requests') {
      await this._renderRequestsTab(bodyRoot, user);
    } else if (this.activeTab === 'friends') {
      await this._renderFriendsTab(bodyRoot, user);
    }
  }

  // ─── 1. DISCOVER PEERS TAB ──────────────────────────────────────────────────
  static async _renderDiscoverTab(root, user, currentBranch) {
    root.innerHTML = `
      <!-- Canonical TechPath ID Direct Search Card (Requirement 2 & 3) -->
      <div class="tp-card tp-card-glass" style="margin-bottom: 1.75rem; border: 1px solid rgba(56, 189, 248, 0.35); background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.7)); border-radius: 18px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.35);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.3rem;">🎯</span>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin: 0; font-family: 'Space Grotesk', sans-serif;">Search by TechPath ID</h3>
          </div>
          <span class="telemetry-chip" style="font-size: 0.72rem; color: #38bdf8; border-color: rgba(56, 189, 248, 0.4);">CANONICAL LOOKUP</span>
        </div>
        <p style="font-size: 0.85rem; color: #94a3b8; margin: 0 0 1rem 0;">
          Every student has a unique TechPath ID (e.g. <code>TP-XXXXXXXX</code>). Enter their ID to view their verified public dossier and send a friend request.
        </p>

        <form id="techpath-id-search-form" style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 260px; position: relative;">
            <input type="text" id="techpath-id-input" class="tp-input" placeholder="Enter TechPath ID (e.g. TP-A8F29BC1)..." style="font-family: monospace; font-size: 0.95rem; text-transform: uppercase; background: rgba(0,0,0,0.5); padding-left: 2.5rem; letter-spacing: 0.05em;" required />
            <span style="position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: #38bdf8; font-family: monospace; font-weight: 800;">#</span>
          </div>
          <button type="submit" id="techpath-id-search-btn" class="tp-btn tp-btn-primary" style="padding: 0.65rem 1.4rem; white-space: nowrap; font-size: 0.9rem;">
            🔍 Search ID
          </button>
          <button type="button" id="techpath-id-clear-btn" class="tp-btn tp-btn-secondary" style="display: none; padding: 0.65rem 1rem; font-size: 0.9rem;">
            Clear
          </button>
        </form>

        <!-- Search Result Container -->
        <div id="techpath-id-result-container" style="margin-top: 1.25rem; display: none;"></div>
      </div>

      <!-- Filter & Search Controls Card -->
      <div class="tp-card tp-card-glass" style="margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.09);">
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          
          <!-- Search Bar -->
          <div style="position: relative;">
            <input type="text" id="connect-search-input" class="tp-input"
              value="${this.searchQuery}"
              placeholder="Search peers by name, TechPath ID (e.g. TP-CSE-...), skills, or bio..."
              style="padding-left: 2.75rem; width: 100%; font-size: 0.95rem; background: rgba(0,0,0,0.35);" />
            <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); font-size: 1.1rem; color: #64748b;">
              🔍
            </span>
            ${this.searchQuery ? `
              <button type="button" id="connect-search-clear" style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; cursor: pointer;">✕</button>
            ` : ''}
          </div>

          <!-- Branch & Academic Filters Strip -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem;">
            <!-- Department / Branch Filter (Defaults to Current User's Branch) -->
            <div>
              <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.35rem;">
                DISCIPLINE / BRANCH
              </label>
              <select id="connect-branch-select" class="tp-input" style="font-size: 0.88rem;">
                <option value="${currentBranch}">★ My Department (${currentBranch.toUpperCase()})</option>
                <option value="all" ${this.branchFilter === 'all' ? 'selected' : ''}>🌐 All Engineering Disciplines</option>
                ${APP_CONFIG.branches.map(b => `
                  <option value="${b.id}" ${this.branchFilter === b.id && this.branchFilter !== currentBranch ? 'selected' : ''}>
                    ${b.name} (${b.code})
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Semester Filter -->
            <div>
              <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.35rem;">
                SEMESTER
              </label>
              <select id="connect-sem-select" class="tp-input" style="font-size: 0.88rem;">
                <option value="all">All Semesters</option>
                ${APP_CONFIG.semesters.map(s => `
                  <option value="${s.id}" ${this.semesterFilter === s.id ? 'selected' : ''}>${s.name}</option>
                `).join('')}
              </select>
            </div>

            <!-- Skill Filter Input -->
            <div>
              <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.35rem;">
                FILTER BY SKILL
              </label>
              <input type="text" id="connect-skill-input" class="tp-input" value="${this.skillFilter}" placeholder="e.g. Python, Verilog, CAD..." style="font-size: 0.88rem;" />
            </div>

            <!-- Career Interest Filter Input -->
            <div>
              <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #94a3b8; margin-bottom: 0.35rem;">
                CAREER INTEREST
              </label>
              <input type="text" id="connect-career-input" class="tp-input" value="${this.careerFilter}" placeholder="e.g. Systems, AI, Thermal..." style="font-size: 0.88rem;" />
            </div>
          </div>

          <!-- Active Filter Pill Indicator -->
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.75rem;">
            <div>
              ${this.branchFilter === currentBranch ? `
                <span style="color: #a855f7; font-weight: 700;">✓ Isolated to your branch (${currentBranch.toUpperCase()})</span> by default. Unrelated departments are excluded.
              ` : `
                <span>Exploring: <strong>${this.branchFilter === 'all' ? 'All Departments' : this.branchFilter.toUpperCase()}</strong></span>
              `}
            </div>
            <button type="button" id="connect-reset-filters-btn" style="background: none; border: none; color: #38bdf8; cursor: pointer; text-decoration: underline; font-size: 0.82rem;">
              Reset Filters
            </button>
          </div>

        </div>
      </div>

      <!-- Student Cards Grid -->
      <div id="connect-students-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 1.5rem;">
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 0; color: #94a3b8;">
          <div class="tp-spinner" style="width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #8b5cf6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem auto;"></div>
          Scanning department peer network...
        </div>
      </div>
    `;

    // Attach filter listeners
    const searchInput = root.querySelector('#connect-search-input');
    searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this._loadStudentsGrid(root, user);
    });

    root.querySelector('#connect-search-clear')?.addEventListener('click', () => {
      this.searchQuery = '';
      this._renderDiscoverTab(root, user, currentBranch);
    });

    root.querySelector('#connect-branch-select')?.addEventListener('change', (e) => {
      this.branchFilter = e.target.value;
      this._loadStudentsGrid(root, user);
    });

    root.querySelector('#connect-sem-select')?.addEventListener('change', (e) => {
      this.semesterFilter = e.target.value;
      this._loadStudentsGrid(root, user);
    });

    root.querySelector('#connect-skill-input')?.addEventListener('input', (e) => {
      this.skillFilter = e.target.value;
      this._loadStudentsGrid(root, user);
    });

    root.querySelector('#connect-career-input')?.addEventListener('input', (e) => {
      this.careerFilter = e.target.value;
      this._loadStudentsGrid(root, user);
    });

    root.querySelector('#connect-reset-filters-btn')?.addEventListener('click', () => {
      this.searchQuery = '';
      this.branchFilter = currentBranch;
      this.semesterFilter = 'all';
      this.skillFilter = '';
      this.careerFilter = '';
      this._renderDiscoverTab(root, user, currentBranch);
    });

    this._bindTechPathIdSearch(root, user);
    await this._loadStudentsGrid(root, user);
  }

  static _bindTechPathIdSearch(root, user) {
    const form = root.querySelector('#techpath-id-search-form');
    const input = root.querySelector('#techpath-id-input');
    const clearBtn = root.querySelector('#techpath-id-clear-btn');
    const resultBox = root.querySelector('#techpath-id-result-container');

    if (!form || !input || !resultBox) return;

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      resultBox.style.display = 'none';
      resultBox.innerHTML = '';
      clearBtn.style.display = 'none';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const rawId = input.value.trim();
      if (!rawId) return;

      if (clearBtn) clearBtn.style.display = 'inline-block';
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: #94a3b8; background: rgba(0,0,0,0.3); border-radius: 12px;">
          <div class="tp-spinner" style="width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #38bdf8; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 0.5rem auto;"></div>
          Querying canonical database for TechPath ID ${rawId.toUpperCase()}...
        </div>
      `;

      try {
        const res = await ConnectEngine.searchByTechPathId(rawId, user.id);

        if (res.error === 'INVALID_FORMAT') {
          resultBox.innerHTML = `
            <div style="padding: 1rem 1.25rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; color: #f87171; font-size: 0.9rem;">
              ⚠️ <strong>Invalid Format:</strong> ${res.message}
            </div>
          `;
          return;
        }

        if (res.notFound) {
          resultBox.innerHTML = `
            <div style="padding: 1.25rem; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; color: #fbbf24; font-size: 0.9rem;">
              🔍 ${res.message}
            </div>
          `;
          return;
        }

        if (res.isSelf) {
          resultBox.innerHTML = `
            <div style="padding: 1.25rem; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; color: #38bdf8; font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                👤 <strong>This is your own TechPath ID!</strong> You cannot send a friend request to yourself.
              </div>
              <a href="#/profile" class="tp-btn tp-btn-secondary tp-btn-sm" style="font-size: 0.8rem;">
                View My Profile →
              </a>
            </div>
          `;
          return;
        }

        const p = res.profile;
        const status = res.connectionStatus;
        const initial = (p.full_name || 'S').charAt(0).toUpperCase();

        resultBox.innerHTML = `
          <div class="tp-card tp-card-glass" style="
            border: 2px solid rgba(56, 189, 248, 0.4); border-radius: 18px; padding: 1.5rem;
            background: rgba(15, 23, 42, 0.95); box-shadow: 0 15px 35px rgba(0,0,0,0.5);
          ">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
              <div style="display: flex; gap: 1rem; align-items: center;">
                <div style="
                  width: 64px; height: 64px; border-radius: 16px;
                  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
                  display: flex; align-items: center; justify-content: center;
                  font-size: 1.8rem; font-weight: 800; color: #fff; flex-shrink: 0;
                ">
                  ${p.avatar_url ? `<img src="${p.avatar_url}" alt="${p.full_name}" style="width: 100%; height: 100%; border-radius: 16px; object-fit: cover;" />` : initial}
                </div>
                <div>
                  <h3 style="font-size: 1.3rem; font-weight: 700; color: #fff; margin: 0 0 0.2rem 0;">
                    ${p.full_name}
                  </h3>
                  <div style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(0,0,0,0.4); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 6px; padding: 0.15rem 0.5rem;">
                    <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700;">TECHPATH ID:</span>
                    <span style="font-family: monospace; font-size: 0.85rem; font-weight: 800; color: #38bdf8;">${p.techpath_id}</span>
                  </div>
                </div>
              </div>

              <!-- Academic badge -->
              <div style="text-align: right;">
                <span class="telemetry-chip" style="color: #c084fc; border-color: rgba(192, 132, 252, 0.4); font-size: 0.75rem;">
                  ${(p.branch_id || 'CSE').toUpperCase()} • ${p.semester_id ? p.semester_id.replace('sem_', 'SEM ') : 'SEM 3'}
                </span>
                <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 0.25rem;">
                  ${p.specialization || 'Engineering'}
                </div>
              </div>
            </div>

            <!-- Bio -->
            <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.5; margin: 0 0 1rem 0; font-style: italic; background: rgba(0,0,0,0.2); padding: 0.75rem 1rem; border-radius: 10px; border-left: 3px solid #38bdf8;">
              “${p.bio || 'TechPath engineering student.'}”
            </p>

            <!-- Skills & Goal -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem;">
              <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                ${(p.skills || []).map(s => `<span class="tp-tag" style="font-size: 0.78rem;">⚡ ${s}</span>`).join('')}
              </div>
              <div style="font-size: 0.82rem; color: #94a3b8;">
                🎯 Target: <strong style="color: #fff;">${p.career_goal || 'Engineering Lead'}</strong>
              </div>
            </div>

            <!-- Social Links -->
            ${(p.github_url || p.linkedin_url || p.portfolio_url) ? `
              <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
                ${p.github_url ? `<a href="${p.github_url}" target="_blank" rel="noopener noreferrer" class="tp-tag" style="text-decoration:none; font-size:0.75rem;">🐙 GitHub</a>` : ''}
                ${p.linkedin_url ? `<a href="${p.linkedin_url}" target="_blank" rel="noopener noreferrer" class="tp-tag" style="text-decoration:none; font-size:0.75rem; color:#60a5fa;">💼 LinkedIn</a>` : ''}
                ${p.portfolio_url ? `<a href="${p.portfolio_url}" target="_blank" rel="noopener noreferrer" class="tp-tag" style="text-decoration:none; font-size:0.75rem; color:#c084fc;">🌐 Portfolio</a>` : ''}
              </div>
            ` : ''}

            <!-- Action footer (Strict chat permission: only if ACCEPTED) -->
            <div id="id-result-actions" style="display: flex; gap: 0.75rem; justify-content: flex-end; align-items: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1rem;">
              ${status === 'ACCEPTED' ? `
                <span style="display: inline-flex; align-items: center; gap: 0.3rem; color: #10b981; font-weight: 700; font-size: 0.88rem; margin-right: auto;">
                  ✓ Connected as Friends
                </span>
                <a href="#/connect/chat?user=${p.id}" class="tp-btn tp-btn-primary" style="padding: 0.55rem 1.3rem; font-size: 0.88rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
                  <span>💬</span> Message / Chat
                </a>
              ` : status === 'PENDING_SENT' ? `
                <button type="button" disabled class="tp-btn" style="background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); cursor: default; font-size: 0.88rem; padding: 0.55rem 1.2rem;">
                  ✓ Friend Request Sent
                </button>
              ` : status === 'PENDING_RECEIVED' ? `
                <button type="button" class="tp-btn tp-btn-primary id-search-accept-btn" data-id="${p.id}" style="background: #10b981; font-size: 0.88rem; padding: 0.55rem 1.2rem;">
                  Accept Friend Request
                </button>
                <button type="button" class="tp-btn tp-btn-secondary id-search-reject-btn" data-id="${p.id}" style="font-size: 0.88rem; padding: 0.55rem 1rem;">
                  Reject
                </button>
              ` : `
                <button type="button" class="tp-btn tp-btn-primary id-search-add-btn" data-id="${p.id}" style="font-size: 0.88rem; padding: 0.55rem 1.4rem;">
                  <span>➕</span> Add Friend
                </button>
              `}
            </div>
          </div>
        `;

        // Wire Action Buttons on the result card
        resultBox.querySelector('.id-search-add-btn')?.addEventListener('click', async (e) => {
          const btn = e.currentTarget;
          btn.disabled = true;
          btn.textContent = 'Sending...';
          try {
            await ConnectEngine.sendFriendRequest(user.id, p.id);
            Toast.show('Friend request sent!', 'success');
            form.dispatchEvent(new Event('submit'));
          } catch (err) {
            Toast.show(err.message, 'error');
            btn.disabled = false;
            btn.textContent = '➕ Add Friend';
          }
        });

        resultBox.querySelector('.id-search-accept-btn')?.addEventListener('click', async () => {
          try {
            const reqs = await ConnectEngine.getFriendRequests(user.id);
            const req = reqs.received.find(r => (r.requester_user_id || r.sender_id) === p.id);
            if (req) {
              await ConnectEngine.acceptFriendRequest(req.id, user.id);
              Toast.show('Friend request accepted!', 'success');
              form.dispatchEvent(new Event('submit'));
            }
          } catch (err) {
            Toast.show(err.message, 'error');
          }
        });

        resultBox.querySelector('.id-search-reject-btn')?.addEventListener('click', async () => {
          try {
            const reqs = await ConnectEngine.getFriendRequests(user.id);
            const req = reqs.received.find(r => (r.requester_user_id || r.sender_id) === p.id);
            if (req) {
              await ConnectEngine.rejectFriendRequest(req.id, user.id);
              Toast.show('Friend request rejected.', 'info');
              form.dispatchEvent(new Event('submit'));
            }
          } catch (err) {
            Toast.show(err.message, 'error');
          }
        });

      } catch (err) {
        resultBox.innerHTML = `
          <div style="padding: 1rem; color: #ef4444; background: rgba(239, 68, 68, 0.1); border-radius: 12px;">
            Error searching TechPath ID: ${err.message}
          </div>
        `;
      }
    });
  }

  static async _loadStudentsGrid(root, user) {
    const grid = root.querySelector('#connect-students-grid');
    if (!grid) return;

    try {
      const students = await ConnectEngine.getDiscoverableStudents({
        currentUserId: user.id,
        branchId: this.branchFilter,
        semesterId: this.semesterFilter,
        skillFilter: this.skillFilter,
        careerInterestFilter: this.careerFilter,
        searchQuery: this.searchQuery
      });

      if (students.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: rgba(15, 23, 42, 0.4); border: 1px dashed rgba(255,255,255,0.1); border-radius: 20px;">
            <div style="font-size: 3rem; margin-bottom: 0.75rem;">🔍</div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.4rem;">No Engineering Peers Found</h3>
            <p style="color: #94a3b8; font-size: 0.92rem; max-width: 480px; margin: 0 auto 1.5rem auto;">
              We couldn't find any students matching your active search or filters. Try adjusting your skill criteria or reset filters.
            </p>
            <button type="button" id="grid-reset-btn" class="tp-btn tp-btn-secondary" style="font-size: 0.88rem;">
              Reset to My Branch
            </button>
          </div>
        `;
        grid.querySelector('#grid-reset-btn')?.addEventListener('click', () => {
          this.searchQuery = '';
          this.branchFilter = user.profile?.branch_id || 'cse';
          this.semesterFilter = 'all';
          this.skillFilter = '';
          this.careerFilter = '';
          this._loadStudentsGrid(root, user);
        });
        return;
      }

      grid.innerHTML = students.map(s => {
        const initial = (s.full_name || 'S').charAt(0).toUpperCase();
        const branchBadge = (s.branch_id || 'CSE').toUpperCase();
        const semBadge = s.semester_id ? s.semester_id.replace('sem_', 'Sem ') : 'Sem 3';
        const status = s.connection_status;

        return `
          <div class="tp-card tp-card-glass tp-student-card" style="
            display: flex; flex-direction: column; justify-content: space-between;
            border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 18px; padding: 1.5rem;
            position: relative; transition: transform 0.2s, border-color 0.2s;
          ">
            <div>
              <!-- Top Row: Avatar & Badges -->
              <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                <div style="
                  width: 56px; height: 56px; border-radius: 16px;
                  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
                  display: flex; align-items: center; justify-content: center;
                  font-size: 1.6rem; font-weight: 800; color: #fff; flex-shrink: 0;
                  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.25);
                ">
                  ${s.avatar_url ? `<img src="${s.avatar_url}" alt="${s.full_name}" style="width: 100%; height: 100%; border-radius: 16px; object-fit: cover;" />` : initial}
                </div>

                <div style="flex: 1; min-width: 0;">
                  <div style="font-size: 1.15rem; font-weight: 700; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${s.full_name}
                  </div>
                  
                  <!-- TechPath ID pill -->
                  <div style="display: inline-flex; align-items: center; gap: 0.35rem; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 0.15rem 0.5rem; margin-top: 0.2rem;">
                    <span style="font-family: monospace; font-size: 0.75rem; font-weight: 700; color: #38bdf8;">${s.techpath_id}</span>
                  </div>
                </div>
              </div>

              <!-- Academic Spec & Semester -->
              <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.85rem; display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
                <span style="background: rgba(139, 92, 246, 0.15); color: #c084fc; padding: 0.15rem 0.5rem; border-radius: 6px; font-weight: 700;">${branchBadge}</span>
                <span style="background: rgba(255, 255, 255, 0.05); color: #e2e8f0; padding: 0.15rem 0.5rem; border-radius: 6px;">${semBadge}</span>
                <span style="color: #64748b; font-size: 0.75rem;">${s.specialization || 'Engineering'}</span>
              </div>

              <!-- Short Description Quote -->
              <p style="
                color: #cbd5e1; font-size: 0.88rem; line-height: 1.5; margin-bottom: 1rem;
                display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-style: italic;
              ">
                “${s.bio || 'TechPath engineering student eager to learn and collaborate.'}”
              </p>

              <!-- Skills Tags -->
              <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1.25rem;">
                ${s.skills.slice(0, 3).map(sk => `
                  <span style="font-size: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 0.2rem 0.5rem; color: #94a3b8;">
                    ${sk}
                  </span>
                `).join('')}
                ${s.skills.length > 3 ? `<span style="font-size: 0.75rem; color: #64748b; padding: 0.2rem 0.3rem;">+${s.skills.length - 3}</span>` : ''}
              </div>
            </div>

            <!-- Card Action Footer -->
            <div style="display: flex; gap: 0.5rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1rem;">
              <button type="button" class="tp-btn tp-btn-ghost view-profile-btn" data-id="${s.id}" style="flex: 1; font-size: 0.85rem; padding: 0.55rem;">
                View Profile
              </button>

              ${status === 'ACCEPTED' ? `
                <a href="#/connect/chat?user=${s.id}" class="tp-btn tp-btn-primary" style="
                  flex: 1; font-size: 0.85rem; padding: 0.55rem; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.3rem;
                ">
                  <span>💬</span> Message
                </a>
              ` : status === 'PENDING_SENT' ? `
                <button type="button" disabled class="tp-btn" style="
                  flex: 1; font-size: 0.82rem; padding: 0.55rem; background: rgba(255,255,255,0.05); color: #94a3b8; border: 1px solid rgba(255,255,255,0.1); cursor: default;
                ">
                  ✓ Pending
                </button>
              ` : status === 'PENDING_RECEIVED' ? `
                <button type="button" class="tp-btn tp-btn-primary quick-accept-btn" data-id="${s.id}" style="
                  flex: 1; font-size: 0.85rem; padding: 0.55rem; background: #10b981;
                ">
                  Accept
                </button>
              ` : `
                <button type="button" class="tp-btn tp-btn-primary send-request-btn" data-id="${s.id}" style="
                  flex: 1; font-size: 0.85rem; padding: 0.55rem;
                ">
                  <span>➕</span> Connect
                </button>
              `}
            </div>
          </div>
        `;
      }).join('');

      // Wire View Profile modal buttons
      grid.querySelectorAll('.view-profile-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          PublicProfileModal.open(id, () => this._loadStudentsGrid(root, user));
        });
      });

      // Wire Send Request buttons
      grid.querySelectorAll('.send-request-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const targetId = btn.getAttribute('data-id');
          btn.disabled = true;
          btn.textContent = 'Sending...';
          try {
            await ConnectEngine.sendFriendRequest(user.id, targetId);
            Toast.show('Friend request sent!', 'success');
            await this._loadStudentsGrid(root, user);
          } catch (err) {
            Toast.show(err.message, 'error');
            btn.disabled = false;
            btn.textContent = 'Connect';
          }
        });
      });

      // Wire Quick Accept buttons
      grid.querySelectorAll('.quick-accept-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const targetId = btn.getAttribute('data-id');
          try {
            const reqs = await ConnectEngine.getFriendRequests(user.id);
            const req = reqs.received.find(r => r.sender_id === targetId);
            if (req) {
              await ConnectEngine.acceptFriendRequest(req.id, user.id);
              Toast.show('Friend request accepted!', 'success');
              await this._loadStudentsGrid(root, user);
            }
          } catch (err) {
            Toast.show(err.message, 'error');
          }
        });
      });

    } catch (err) {
      console.error('[ConnectPage Load Error]:', err);
      grid.innerHTML = `<div style="grid-column: 1/-1; color: #ef4444; padding: 2rem; text-align: center;">Error loading peers: ${err.message}</div>`;
    }
  }

  // ─── 2. FRIEND REQUESTS TAB ─────────────────────────────────────────────────
  static async _renderRequestsTab(root, user) {
    const { received, sent } = await ConnectEngine.getFriendRequests(user.id);

    root.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Sub-tabs: Received vs Sent -->
        <div style="display: flex; gap: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.5rem;">
          <button type="button" id="subtab-received-btn" class="tp-btn ${this.activeSubTab === 'received' ? 'tp-btn-secondary' : 'tp-btn-ghost'}" style="font-size: 0.88rem; padding: 0.5rem 1rem;">
            Received Requests (${received.length})
          </button>
          <button type="button" id="subtab-sent-btn" class="tp-btn ${this.activeSubTab === 'sent' ? 'tp-btn-secondary' : 'tp-btn-ghost'}" style="font-size: 0.88rem; padding: 0.5rem 1rem;">
            Sent Requests (${sent.length})
          </button>
        </div>

        <div id="requests-list-container"></div>
      </div>
    `;

    root.querySelector('#subtab-received-btn')?.addEventListener('click', () => {
      this.activeSubTab = 'received';
      this._renderRequestsTab(root, user);
    });

    root.querySelector('#subtab-sent-btn')?.addEventListener('click', () => {
      this.activeSubTab = 'sent';
      this._renderRequestsTab(root, user);
    });

    const listContainer = root.querySelector('#requests-list-container');
    const list = this.activeSubTab === 'received' ? received : sent;

    if (list.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 3.5rem 1.5rem; background: rgba(15, 23, 42, 0.4); border: 1px dashed rgba(255,255,255,0.1); border-radius: 18px;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
          <h3 style="font-size: 1.15rem; color: #fff; font-weight: 700; margin-bottom: 0.35rem;">
            No ${this.activeSubTab === 'received' ? 'Received' : 'Sent'} Requests
          </h3>
          <p style="color: #94a3b8; font-size: 0.9rem; max-width: 420px; margin: 0 auto;">
            ${this.activeSubTab === 'received' ? 'You have no incoming friend requests right now.' : 'You have not sent any pending friend requests.'}
          </p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${list.map(r => {
          const peer = r.peer || {};
          const initial = (peer.full_name || 'S').charAt(0).toUpperCase();
          const timestamp = new Date(r.created_at).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });

          return `
            <div class="tp-card tp-card-glass" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; padding: 1.25rem 1.5rem; border-radius: 16px;">
              <div style="display: flex; gap: 1rem; align-items: center;">
                <div style="
                  width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #8b5cf6, #3b82f6);
                  display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 700; color: #fff;
                ">
                  ${peer.avatar_url ? `<img src="${peer.avatar_url}" style="width: 100%; height: 100%; border-radius: 14px; object-fit: cover;" />` : initial}
                </div>

                <div>
                  <div style="font-size: 1.05rem; font-weight: 700; color: #fff;">
                    ${peer.full_name}
                    <span style="font-family: monospace; font-size: 0.75rem; color: #38bdf8; margin-left: 0.4rem;">${peer.techpath_id}</span>
                  </div>
                  <div style="font-size: 0.82rem; color: #94a3b8; margin-top: 0.15rem;">
                    ${(peer.branch_id || 'CSE').toUpperCase()} • ${peer.specialization || 'Engineering'} • <span style="color: #64748b;">${timestamp}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <button type="button" class="tp-btn tp-btn-ghost view-req-profile-btn" data-id="${peer.id}" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
                  View Profile
                </button>

                ${this.activeSubTab === 'received' ? `
                  <button type="button" class="tp-btn tp-btn-primary accept-req-btn" data-id="${r.id}" style="font-size: 0.85rem; padding: 0.45rem 1.1rem; background: #10b981;">
                    Accept
                  </button>
                  <button type="button" class="tp-btn tp-btn-ghost reject-req-btn" data-id="${r.id}" style="font-size: 0.85rem; padding: 0.45rem 0.9rem; color: #f43f5e;">
                    Reject
                  </button>
                ` : `
                  <button type="button" class="tp-btn tp-btn-ghost cancel-req-btn" data-id="${r.id}" style="font-size: 0.85rem; padding: 0.45rem 0.9rem; color: #f43f5e; border: 1px solid rgba(244,63,94,0.2);">
                    Cancel Request
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Bind request actions
    listContainer.querySelectorAll('.view-req-profile-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        PublicProfileModal.open(btn.getAttribute('data-id'), () => this._renderRequestsTab(root, user));
      });
    });

    listContainer.querySelectorAll('.accept-req-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await ConnectEngine.acceptFriendRequest(btn.getAttribute('data-id'), user.id);
          Toast.show('Friend request accepted! You can now chat.', 'success');
          this._renderRequestsTab(root, user);
        } catch (err) { Toast.show(err.message, 'error'); }
      });
    });

    listContainer.querySelectorAll('.reject-req-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await ConnectEngine.rejectFriendRequest(btn.getAttribute('data-id'), user.id);
          Toast.show('Friend request rejected.', 'info');
          this._renderRequestsTab(root, user);
        } catch (err) { Toast.show(err.message, 'error'); }
      });
    });

    listContainer.querySelectorAll('.cancel-req-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await ConnectEngine.cancelFriendRequest(btn.getAttribute('data-id'), user.id);
          Toast.show('Friend request cancelled.', 'info');
          this._renderRequestsTab(root, user);
        } catch (err) { Toast.show(err.message, 'error'); }
      });
    });
  }

  // ─── 3. MY FRIENDS TAB ──────────────────────────────────────────────────────
  static async _renderFriendsTab(root, user) {
    const friends = await ConnectEngine.getFriends(user.id);

    root.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Friends Search & Count Strip -->
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
          <div>
            <span style="font-size: 1.1rem; font-weight: 700; color: #fff;">Accepted Friends</span>
            <span style="font-size: 0.85rem; color: #94a3b8; margin-left: 0.5rem;">(${friends.length} peers)</span>
          </div>

          <div style="max-width: 320px; width: 100%;">
            <input type="text" id="friends-filter-input" class="tp-input" placeholder="Search friends by name or ID..." style="font-size: 0.85rem;" />
          </div>
        </div>

        <div id="friends-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem;"></div>
      </div>
    `;

    const grid = root.querySelector('#friends-grid-container');
    const filterInput = root.querySelector('#friends-filter-input');

    const renderFriendsGrid = (list) => {
      if (list.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: rgba(15, 23, 42, 0.4); border: 1px dashed rgba(255,255,255,0.1); border-radius: 18px;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🤝</div>
            <h3 style="font-size: 1.15rem; color: #fff; font-weight: 700; margin-bottom: 0.35rem;">No Friends Yet</h3>
            <p style="color: #94a3b8; font-size: 0.9rem; max-width: 440px; margin: 0 auto 1.25rem auto;">
              Connect with peers from your department to share notes, solve doubt questions, and message each other.
            </p>
            <button type="button" id="go-discover-btn" class="tp-btn tp-btn-primary" style="font-size: 0.88rem;">
              Explore Department Peers
            </button>
          </div>
        `;
        grid.querySelector('#go-discover-btn')?.addEventListener('click', () => {
          this.activeTab = 'discover';
          this.renderBody(root.parentElement, user, user.profile?.branch_id || 'cse');
        });
        return;
      }

      grid.innerHTML = list.map(f => {
        const initial = (f.full_name || 'F').charAt(0).toUpperCase();
        return `
          <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; justify-content: space-between; border-radius: 16px; padding: 1.25rem;">
            <div>
              <div style="display: flex; gap: 0.85rem; align-items: center; margin-bottom: 0.85rem;">
                <div style="
                  width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, #10b981, #06b6d4);
                  display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 700; color: #fff;
                ">
                  ${f.avatar_url ? `<img src="${f.avatar_url}" style="width: 100%; height: 100%; border-radius: 14px; object-fit: cover;" />` : initial}
                </div>
                <div>
                  <div style="font-size: 1.05rem; font-weight: 700; color: #fff;">${f.full_name}</div>
                  <div style="font-family: monospace; font-size: 0.75rem; color: #38bdf8;">${f.techpath_id}</div>
                </div>
              </div>

              <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.75rem;">
                ${(f.branch_id || 'CSE').toUpperCase()} • ${f.specialization || 'Engineering'}
              </div>

              <p style="color: #cbd5e1; font-size: 0.85rem; line-height: 1.45; font-style: italic; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                “${f.bio || 'Engineering peer.'}”
              </p>
            </div>

            <div style="display: flex; gap: 0.5rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.85rem;">
              <a href="#/connect/chat?user=${f.id}" class="tp-btn tp-btn-primary" style="
                flex: 1; font-size: 0.82rem; padding: 0.5rem; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.3rem;
              ">
                <span>💬</span> Message
              </a>
              <button type="button" class="tp-btn tp-btn-ghost view-friend-profile-btn" data-id="${f.id}" style="font-size: 0.82rem; padding: 0.5rem 0.75rem;">
                Profile
              </button>
              <button type="button" class="tp-btn tp-btn-ghost remove-friend-btn" data-id="${f.id}" title="Remove Friend" style="color: #f43f5e; padding: 0.5rem 0.65rem;">
                ✕
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Actions
      grid.querySelectorAll('.view-friend-profile-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          PublicProfileModal.open(btn.getAttribute('data-id'), () => this._renderFriendsTab(root, user));
        });
      });

      grid.querySelectorAll('.remove-friend-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('Are you sure you want to remove this student from your friends list?')) return;
          try {
            await ConnectEngine.removeFriend(user.id, btn.getAttribute('data-id'));
            Toast.show('Friend removed.', 'info');
            this._renderFriendsTab(root, user);
          } catch (err) { Toast.show(err.message, 'error'); }
        });
      });
    };

    filterInput?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = friends.filter(f =>
        (f.full_name || '').toLowerCase().includes(q) ||
        (f.techpath_id || '').toLowerCase().includes(q) ||
        (f.bio || '').toLowerCase().includes(q)
      );
      renderFriendsGrid(filtered);
    });

    renderFriendsGrid(friends);
  }
}
