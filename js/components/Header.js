/**
 * TECHPATH — GLOBAL HEADER
 * Branch/Semester switcher, notifications, search, user menu, language selector
 */
import { learningContext } from '../context/LearningContext.js';
import { authContext } from '../context/AuthContext.js';
import { APP_CONFIG } from '../config.js';
import { NotificationEngine } from '../services/NotificationEngine.js';
import { I18nEngine } from '../services/I18nEngine.js';

export class HeaderComponent {
  static async render(container) {
    const ctx = learningContext.get();
    const auth = authContext.get();
    const unread = await NotificationEngine.getUnreadCount();
    const isAuth = authContext.isLoggedIn();

    container.innerHTML = `
      <header class="tp-header" role="banner">
        <div class="tp-header-inner">

          <!-- Left: Logo + Context Selectors -->
          <div class="tp-header-left">
            <a href="#/dashboard" class="tp-header-logo" aria-label="TechPath Home">
              <span class="tp-logo-text">TECH<span class="tp-logo-accent">PATH</span></span>
            </a>

            ${isAuth ? `
            <div class="tp-context-selectors" role="group" aria-label="Academic context">
              <a href="#/profile" class="telemetry-chip" style="text-decoration: none; display: flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.65rem; border-color: rgba(225,29,72,0.4); background: rgba(0,0,0,0.35); font-size: 0.78rem;" title="Academic Context: ${ctx.branch_id.toUpperCase()} • Semester ${ctx.semester_id.replace('sem_', '')} (Managed in Profile)">
                <span class="pulse-beacon" style="width: 6px; height: 6px;"></span>
                <span style="color: #fff; font-weight: 700;">${ctx.branch_id.toUpperCase()}</span>
                <span style="color: var(--tp-text-dark-muted);">&bull;</span>
                <span style="color: var(--tp-primary); font-weight: 600;">Sem ${ctx.semester_id.replace('sem_', '')}</span>
              </a>
            </div>
            ` : ''}
          </div>

          <!-- Center: Search -->
          <div class="tp-header-center">
            <div class="tp-search-wrap">
              <svg class="tp-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input id="hdr-search-input" type="search" class="tp-search-input" placeholder="Search subjects, topics, skills, 3D models..." aria-label="Global search" autocomplete="off" />
            </div>
          </div>

          <!-- Right: Notifications, Language, User -->
          <div class="tp-header-right">
            <!-- Language Selector (All 51 Global Languages) -->
            <select id="hdr-lang-select" class="tp-select tp-select-compact tp-select-lang" aria-label="Select language" title="Change platform language">
              ${APP_CONFIG.languages.map(l => `
                <option value="${l.code}" ${l.code === (ctx.preferred_language || 'en') ? 'selected' : ''}>${l.name}</option>
              `).join('')}
            </select>

            ${isAuth ? `
            <!-- Notifications -->
            <a href="#/notifications" class="tp-header-icon-btn" aria-label="Notifications (${unread} unread)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span id="notif-badge" class="tp-notif-badge" style="display:${unread > 0 ? 'flex' : 'none'}">${unread}</span>
            </a>

            <!-- User Menu -->
            <div class="tp-user-menu-wrap">
              <button id="user-menu-btn" class="tp-user-avatar-btn" aria-label="User menu" aria-expanded="false" aria-haspopup="menu">
                <span class="tp-user-avatar">${(auth.user?.name || 'U')[0].toUpperCase()}</span>
              </button>
              <div id="user-menu-dropdown" class="tp-user-dropdown" role="menu" style="display:none;">
                <div class="tp-user-dropdown-header">
                  <strong>${auth.user?.name || 'User'}</strong>
                  <span>${auth.user?.email || ''}</span>
                </div>
                <a href="#/profile" class="tp-user-dropdown-item" role="menuitem">👤 My Profile</a>
                <a href="#/security" class="tp-user-dropdown-item" role="menuitem">🛡️ Security Center</a>
                <a href="#/preferences" class="tp-user-dropdown-item" role="menuitem">🎛️ Preferences</a>
                <a href="#/achievements" class="tp-user-dropdown-item" role="menuitem">🏅 Achievements</a>
                <a href="#/settings" class="tp-user-dropdown-item" role="menuitem">⚙️ Settings</a>
                ${authContext.isAdminUser() ? `<a href="#/admin" class="tp-user-dropdown-item" role="menuitem" style="color:var(--tp-warning)">Admin Panel</a>` : ''}
                <div class="tp-user-dropdown-divider"></div>
                <button id="logout-btn" class="tp-user-dropdown-item tp-user-dropdown-danger" role="menuitem">Sign Out</button>
              </div>
            </div>
            ` : `
            <a href="#/signin" class="tp-btn tp-btn-primary tp-btn-sm">Sign In</a>
            `}
          </div>

        </div>
      </header>
    `;

    this._attachHandlers(container);
  }

  static _attachHandlers(container) {
    // Language change
    const langSel = container.querySelector('#hdr-lang-select');
    if (langSel) {
      langSel.addEventListener('change', e => {
        I18nEngine.setLanguage(e.target.value);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      });
    }

    // Search
    const searchInput = container.querySelector('#hdr-search-input');
    if (searchInput) {
      let timer;
      searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          window.location.hash = `#/search?q=${encodeURIComponent(e.target.value)}`;
        }
      });
      searchInput.addEventListener('input', e => {
        clearTimeout(timer);
        if (e.target.value.length > 1) {
          timer = setTimeout(() => {
            window.location.hash = `#/search?q=${encodeURIComponent(e.target.value)}`;
          }, 600);
        }
      });
    }

    // User menu toggle
    const menuBtn = container.querySelector('#user-menu-btn');
    const menuDropdown = container.querySelector('#user-menu-dropdown');
    if (menuBtn && menuDropdown) {
      menuBtn.addEventListener('click', e => {
        e.stopPropagation();
        const open = menuDropdown.style.display !== 'none';
        menuDropdown.style.display = open ? 'none' : 'block';
        menuBtn.setAttribute('aria-expanded', String(!open));
      });
      document.addEventListener('click', () => {
        if (menuDropdown) menuDropdown.style.display = 'none';
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      });
    }

    // Logout
    const logoutBtn = container.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        authContext.logout();
        window.location.hash = '#/signin';
        window.location.reload();
      });
    }
  }
}
