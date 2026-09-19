/**
 * TECHPATH — NAVIGATION RAIL
 * All routes, mobile hamburger, active state, auth-aware, admin-aware
 */
import { authContext } from '../context/AuthContext.js';
import { I18nEngine } from '../services/I18nEngine.js';

const NAV_ITEMS = [
  // Learn (main)
  { id: 'about',        icon: '✨', key: 'about', label: 'About & Features', href: '#/about', group: 'main' },
  { id: 'dashboard',    icon: '⊞', key: 'dashboard', label: 'Dashboard',    href: '#/dashboard',    group: 'main' },
  { id: 'learning',     icon: '📖', key: 'learnhub', label: 'LearnHub',     href: '#/learning',     group: 'main' },
  { id: 'doubt-solver', icon: '💡', key: 'doubt_solver', label: 'AI Doubt Solver', href: '#/doubt-solver', group: 'main' },
  { id: '3d',           icon: '🧊', key: 'model_3d', label: '3D Models',    href: '#/3d',           group: 'main' },
  { id: 'pdf',          icon: '📄', key: 'pdf_analyzer', label: 'PDF Analyzer', href: '#/pdf',      group: 'main' },
  { id: 'practice',     icon: '🧪', key: 'practice', label: 'Practice',     href: '#/practice',     group: 'main' },
  { id: 'quiz-league',  icon: '🏆', key: 'quiz_league', label: 'Quiz League', href: '#/quiz-league', group: 'main' },
  { id: 'exams',        icon: '🎯', key: 'exams', label: 'Exams',        href: '#/exams',        group: 'main' },

  // Build & Career (build)
  { id: 'projects',     icon: '🔨', key: 'projects', label: 'Projects',     href: '#/projects',     group: 'build' },
  { id: 'skills',       icon: '⚡', key: 'skills', label: 'Skills',       href: '#/skills',       group: 'build' },
  { id: 'career',       icon: '🚀', key: 'career', label: 'Career',       href: '#/career',       group: 'build' },
  { id: 'internships',  icon: '🏢', key: 'internships', label: 'Internships',  href: '#/internships',  group: 'build' },
  { id: 'resume',       icon: '📝', key: 'resume', label: 'Resume',       href: '#/resume',       group: 'build' },
  { id: 'interview',    icon: '🎤', key: 'mock_interview', label: 'Mock Interview', href: '#/mock-interview', group: 'build' },
  { id: 'roadmaps',     icon: '🗺️',  key: 'roadmaps', label: 'Roadmaps',    href: '#/roadmaps',     group: 'build' },

  // Track & Resources (track)
  { id: 'planner',      icon: '📅', key: 'planner', label: 'Study Planner', href: '#/planner',      group: 'track' },
  { id: 'goals',        icon: '🎪', key: 'goals', label: 'Goals',        href: '#/goals',        group: 'track' },
  { id: 'analytics',    icon: '📊', key: 'analytics', label: 'Analytics',    href: '#/analytics',    group: 'track' },
  { id: 'library',      icon: '📚', key: 'library', label: 'Library',      href: '#/library',      group: 'track' },
  { id: 'achievements', icon: '🏅', key: 'achievements', label: 'Achievements', href: '#/achievements', group: 'track' },

  // Community (social) - Single unified community hub without duplicates
  { id: 'connect',         icon: '🌐', key: 'connect', label: 'TechPath Connect / Explore', href: '#/connect', group: 'social' },
  { id: 'friends',         icon: '👥', key: 'friends', label: 'Friends', href: '#/connect/friends', group: 'social' },
  { id: 'friend-requests', icon: '📩', key: 'friend_requests', label: 'Friend Requests', href: '#/connect/requests', group: 'social' },
  { id: 'chat',            icon: '💬', key: 'chat', label: 'Messages / Chat', href: '#/connect/chat', group: 'social' },
  { id: 'teacher-studio',  icon: '👨‍🏫', key: 'teacher_studio', label: 'Teacher Studio', href: '#/teacher/dashboard', group: 'social' },
  { id: 'my-classes',      icon: '🎒', key: 'my_classes', label: 'My Classes', href: '#/classes/my-classes', group: 'social' },
  { id: 'classes',         icon: '🎓', key: 'classes', label: 'TechPath Classes', href: '#/classes', group: 'social' },
  { id: 'study-groups',    icon: '🧑‍🤝‍🧑', key: 'study_groups', label: 'Study Groups', href: '#/connect/study-groups', group: 'social' },
  { id: 'community',       icon: '📚', key: 'community_resources', label: 'Community Resources', href: '#/community', group: 'social' },

  // Account (account) - Actual product/navigation features (Profile is strictly the FINAL item)
  // Note: Settings, Preferences, FAQs, Privacy & Data, Cookie Preferences, Terms of Use, Privacy Policy, Data Deletion Request moved to Global Footer
  { id: 'security',               icon: '🛡️', key: 'security',               label: 'Security Center',        href: '#/security',                     group: 'account' },
  { id: 'reviews',                icon: '⭐', key: 'reviews',                label: 'Reviews',                href: '#/reviews',                      group: 'account' },
  { id: 'help-center',            icon: '❓', key: 'help_center',            label: 'Help Center',            href: '#/help',                         group: 'account' },
  { id: 'contact-us',             icon: '✉️', key: 'contact_us',             label: 'Contact Us',             href: '#/contact',                      group: 'account' },
  { id: 'support-tickets',        icon: '🎫', key: 'support_tickets',        label: 'Support Tickets',        href: '#/contact?tab=tickets',          group: 'account' },
  { id: 'account-deletion',       icon: '⚠️', key: 'account_deletion',       label: 'Account Deletion',       href: '#/security?action=delete',       group: 'account' },
  { id: 'profile',                icon: '👤', key: 'profile',                label: 'Profile',                href: '#/profile',                      group: 'account' }
];

const GROUPS = {
  main:    { label: 'Learn' },
  build:   { label: 'Build & Career' },
  track:   { label: 'Track & Resources' },
  social:  { label: 'Community' },
  account: { label: 'Account' }
};

export class NavRailComponent {
  static _savedScrollTop = 0;
  static _lastAdminStatus = null;
  static _lastLang = null;

  static render(container, currentHash) {
    const isAuth = authContext.isLoggedIn();
    const isAdmin = authContext.isAdminUser();
    const currentLang = localStorage.getItem('TP_USER_LANG') || 'en';

    let rawPath = currentHash ? currentHash.replace(/^\//, '') : 'dashboard';
    let activeId = 'dashboard';
    if (rawPath.startsWith('classes/my-classes') || rawPath.startsWith('my-classes')) activeId = 'my-classes';
    else if (rawPath.startsWith('classes')) activeId = 'classes';
    else if (rawPath.startsWith('teacher/dashboard') || rawPath.startsWith('teacher/studio')) activeId = 'teacher-studio';
    else if (rawPath.startsWith('connect/friends')) activeId = 'friends';
    else if (rawPath.startsWith('connect/requests')) activeId = 'friend-requests';
    else if (rawPath.startsWith('connect/study-groups') || rawPath.startsWith('study-groups')) activeId = 'study-groups';
    else if (rawPath.startsWith('connect/chat') || rawPath.startsWith('chat')) activeId = 'chat';
    else if (rawPath.startsWith('connect')) activeId = 'connect';
    else if (rawPath.startsWith('quiz-league')) activeId = 'quiz-league';
    else if (rawPath.startsWith('exams') || rawPath.startsWith('pyqs')) activeId = 'exams';
    else if (rawPath.startsWith('interview') || rawPath.startsWith('mock-interview')) activeId = 'interview';
    else if (rawPath.startsWith('practice')) activeId = 'practice';
    else if (rawPath.startsWith('settings')) activeId = 'settings';
    else if (rawPath.startsWith('preferences')) activeId = (window.location.hash.includes('cookies') ? 'cookie-preferences' : 'preferences');
    else if (rawPath.startsWith('security')) activeId = (window.location.hash.includes('delete') ? 'account-deletion' : 'security');
    else if (rawPath.startsWith('reviews')) activeId = 'reviews';
    else if (rawPath.startsWith('help')) activeId = 'help-center';
    else if (rawPath.startsWith('contact') && window.location.hash.includes('tickets')) activeId = 'support-tickets';
    else if (rawPath.startsWith('contact')) activeId = 'contact-us';
    else if (rawPath.startsWith('faq')) activeId = 'faq';
    else if (rawPath === 'terms' || rawPath.startsWith('terms') || rawPath.startsWith('legal/terms') || rawPath.startsWith('legal/ai-disclaimer') || rawPath.startsWith('legal/disclaimer') || rawPath.startsWith('legal/copyright') || rawPath.startsWith('legal/upload-policy') || rawPath.startsWith('legal/retention')) activeId = 'terms-of-use';
    else if (rawPath.startsWith('legal/privacy') || rawPath.startsWith('privacy')) activeId = 'privacy-policy';
    else if (rawPath.startsWith('legal/deletion-request') || rawPath.startsWith('deletion-request')) activeId = 'data-deletion-request';
    else if (rawPath.startsWith('profile') || rawPath.startsWith('account/profile') || rawPath === 'account') activeId = 'profile';
    else activeId = rawPath.split('/')[0] || 'dashboard';

    const existingRail = container.querySelector('#tp-nav-rail');

    // 1. IN-PLACE UPDATE: If DOM exists and auth/lang didn't change, DO NOT recreate DOM!
    if (existingRail && this._lastAdminStatus === isAdmin && this._lastLang === currentLang) {
      this._updateActiveLink(container, activeId);
      return;
    }

    // 2. FULL RENDER: Save scroll position before remount
    const savedScroll = existingRail ? existingRail.scrollTop :
      (parseInt(sessionStorage.getItem('TP_SIDEBAR_SCROLL') || '0', 10) || this._savedScrollTop || 0);

    this._lastAdminStatus = isAdmin;
    this._lastLang = currentLang;

    // Render groups with Admin panel positioned BEFORE Account group so Profile is strictly the final item
    container.innerHTML = `
      <!-- Mobile menu button -->
      <button id="nav-mobile-toggle" class="tp-nav-mobile-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>

      <nav class="tp-nav-rail" id="tp-nav-rail" aria-label="Main navigation" role="navigation">
        <div class="tp-nav-rail-inner">
          ${Object.entries(GROUPS).map(([groupId, group]) => {
            // If we are reaching account and user is admin, render Admin group right before Account!
            let adminSection = '';
            if (groupId === 'account' && isAdmin) {
              adminSection = `
                <div class="tp-nav-group">
                  <span class="tp-nav-group-label">Admin</span>
                  <a href="#/admin"
                     data-nav-id="admin"
                     class="tp-nav-item ${activeId === 'admin' ? 'tp-nav-item-active' : ''} tp-nav-item-admin"
                     aria-label="Admin Panel"
                     aria-current="${activeId === 'admin' ? 'page' : 'false'}">
                    <span class="tp-nav-icon" aria-hidden="true">🛡️</span>
                    <span class="tp-nav-label">Admin Panel</span>
                  </a>
                </div>
              `;
            }

            const items = NAV_ITEMS.filter(n => n.group === groupId);
            return `
              ${adminSection}
              <div class="tp-nav-group">
                <span class="tp-nav-group-label">${group.label}</span>
                ${items.map(item => {
                  const label = I18nEngine.t(item.key || item.id);
                  const isCurrent = activeId === item.id;
                  return `
                    <a href="${item.href}"
                       data-nav-id="${item.id}"
                       class="tp-nav-item ${isCurrent ? 'tp-nav-item-active' : ''}"
                       aria-label="${label}"
                       aria-current="${isCurrent ? 'page' : 'false'}">
                      <span class="tp-nav-icon" aria-hidden="true">${item.icon}</span>
                      <span class="tp-nav-label">${label}</span>
                    </a>
                  `;
                }).join('')}
              </div>
            `;
          }).join('')}
        </div>
      </nav>

      <!-- Mobile Overlay -->
      <div id="nav-overlay" class="tp-nav-overlay" style="display:none;" aria-hidden="true"></div>
    `;

    const navRail = container.querySelector('#tp-nav-rail');
    const toggleBtn = container.querySelector('#nav-mobile-toggle');
    const overlay = container.querySelector('#nav-overlay');

    // Restore scroll position immediately
    if (navRail) {
      navRail.scrollTop = savedScroll;
      requestAnimationFrame(() => {
        if (navRail) navRail.scrollTop = savedScroll;
      });

      // Passive scroll listener to maintain scroll position across all page transitions
      navRail.addEventListener('scroll', () => {
        NavRailComponent._savedScrollTop = navRail.scrollTop;
        try {
          sessionStorage.setItem('TP_SIDEBAR_SCROLL', String(navRail.scrollTop));
        } catch { /* ignore quota */ }
      }, { passive: true });
    }

    // Mobile toggle
    if (toggleBtn && navRail && overlay) {
      toggleBtn.addEventListener('click', () => {
        const open = navRail.classList.contains('tp-nav-rail-open');
        navRail.classList.toggle('tp-nav-rail-open', !open);
        overlay.style.display = open ? 'none' : 'block';
        overlay.setAttribute('aria-hidden', String(open));
        toggleBtn.setAttribute('aria-expanded', String(!open));
      });
      overlay.addEventListener('click', () => {
        navRail.classList.remove('tp-nav-rail-open');
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    }

    // Close nav on link click on mobile without affecting desktop sidebar scroll
    container.querySelectorAll('.tp-nav-item').forEach(link => {
      link.addEventListener('click', () => {
        if (navRail) {
          NavRailComponent._savedScrollTop = navRail.scrollTop;
          try {
            sessionStorage.setItem('TP_SIDEBAR_SCROLL', String(navRail.scrollTop));
          } catch { /* ignore */ }
        }
        if (window.innerWidth <= 768) {
          if (navRail) navRail.classList.remove('tp-nav-rail-open');
          if (overlay) { overlay.style.display = 'none'; overlay.setAttribute('aria-hidden', 'true'); }
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /**
   * Updates the active link class and aria attributes in-place without destroying DOM or resetting scroll
   */
  static _updateActiveLink(container, activeId) {
    const navRail = container.querySelector('#tp-nav-rail');
    const items = container.querySelectorAll('.tp-nav-item');
    items.forEach(link => {
      const id = link.dataset.navId;
      const isCurrent = id === activeId;
      link.classList.toggle('tp-nav-item-active', isCurrent);
      link.setAttribute('aria-current', isCurrent ? 'page' : 'false');
    });

    // Ensure scroll position is preserved without resetting
    if (navRail) {
      const saved = parseInt(sessionStorage.getItem('TP_SIDEBAR_SCROLL') || '0', 10);
      if (saved > 0 && Math.abs(navRail.scrollTop - saved) > 5) {
        navRail.scrollTop = saved;
      }
    }

    if (!window._tpPopstateScrollBound) {
      window._tpPopstateScrollBound = true;
      window.addEventListener('popstate', () => {
        const rail = document.querySelector('#tp-nav-rail');
        const saved = parseInt(sessionStorage.getItem('TP_SIDEBAR_SCROLL') || '0', 10);
        if (rail && saved > 0) {
          rail.scrollTop = saved;
          requestAnimationFrame(() => { rail.scrollTop = saved; });
        }
      });
    }
  }
}
