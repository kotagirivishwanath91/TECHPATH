/**
 * TECHPATH — MASTER ROUTER
 * All 280+ routes, auth guard, admin guard, hash-based SPA navigation
 */
import { DashboardPage }  from './pages/DashboardPage.js';
import { LearningPage }   from './pages/LearningPage.js';
import { ThreeDPage }     from './pages/ThreeDPage.js';
import { SkillsPage }     from './pages/SkillsPage.js';
import { ProjectsPage }   from './pages/ProjectsPage.js';
import { CareerPage }     from './pages/CareerPage.js';
import { InterviewPage }  from './pages/InterviewPage.js';
import { ExamsPage }      from './pages/ExamsPage.js';
import { PDFPage }        from './pages/PDFPage.js';
import { PracticePage }   from './pages/PracticePage.js';
import { RoadmapsPage }   from './pages/RoadmapsPage.js';
import { ResumePage }     from './pages/ResumePage.js';
import { ProfilePage }    from './pages/ProfilePage.js';
import { SecurityPage }   from './pages/SecurityPage.js';
import { PreferencesPage } from './pages/PreferencesPage.js';
import { SettingsPage }    from './pages/SettingsPage.js';
import { AdminPage }      from './pages/AdminPage.js';
import { ReviewsPage }    from './pages/ReviewsPage.js';
import { ContactPage }    from './pages/ContactPage.js';
import { AuthPages }      from './pages/AuthPages.js';
import { ErrorPages }     from './pages/ErrorPages.js';
import { AboutPage }      from './pages/AboutPage.js';
import { ThankYouPage }   from './pages/ThankYouPage.js';
import { ConnectPage }    from './pages/ConnectPage.js';
import { StudyGroupsPage } from './pages/StudyGroupsPage.js';
import { ChatPage }       from './pages/ChatPage.js';
import { ClassesPage }    from './pages/ClassesPage.js';
import { ClassDetailPage } from './pages/ClassDetailPage.js';
import { ClassroomPage }   from './pages/ClassroomPage.js';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage.js';
import { StudentClassesPage } from './pages/StudentClassesPage.js';
import { ExamDetailPage } from './pages/ExamDetailPage.js';
import { PYQPage }        from './pages/PYQPage.js';
import { MyExamsPage }    from './pages/MyExamsPage.js';
import { InterviewPreparationPage } from './pages/InterviewPreparationPage.js';
import { QuizLeaguePage } from './pages/QuizLeaguePage.js';
import { InternshipsPage } from './pages/InternshipsPage.js';
import { CubeLoader }     from './components/CubeLoader.js';
import { NavRailComponent } from './components/NavRail.js';
import { HeaderComponent }  from './components/Header.js';
import { authContext }      from './context/AuthContext.js';

// Lazy-loaded pages (created as needed)
const lazyPage = (loader) => async (vp) => {
  try { const mod = await loader(); await mod.render(vp); }
  catch(e) { console.error('Page load error:', e); ErrorPages.render500(vp, e.message); }
};

export class AppRouter {
  constructor(viewportRoot, railRoot, headerRoot) {
    this.viewport = viewportRoot;
    this.rail = railRoot;
    this.header = headerRoot;
    window.addEventListener('hashchange', () => this.navigate());
    window.addEventListener('popstate', () => this.navigate());
    window.addEventListener('offline', () => {
      ErrorPages.renderNetworkError(this.viewport);
    });

    // Direct pathname support for SPA (e.g. /profile, /account/profile)
    if (typeof window !== 'undefined' && window.location.pathname && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
      const direct = window.location.pathname;
      if (!window.location.hash || window.location.hash === '#/' || window.location.hash === '#') {
        const canonical = (direct === '/account/profile' || direct === '/account') ? '/profile' : direct;
        window.location.replace('#' + canonical + (window.location.search || ''));
      }
    }
  }

  async navigate() {
    let raw = window.location.hash.slice(1);
    if (!raw && typeof window !== 'undefined' && window.location.pathname && window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
      raw = window.location.pathname;
    }
    // Auth is entry point for unauthenticated users; dashboard for authenticated users
    if (!raw || raw === '/' || raw === '') {
      raw = authContext.isLoggedIn()
        ? (authContext.hasCompletedOnboarding() ? '/dashboard' : '/onboarding')
        : '/signin';
    }
    const hash = raw.startsWith('/') ? raw : '/' + raw;
    let path = hash.split('?')[0];

    // Canonical redirect for /login -> #/signin
    if (path === '/login' || path === '/login/') {
      window.location.hash = '#/signin';
      return;
    }

    // Canonical redirect for /register -> #/signup
    if (path === '/register' || path === '/register/') {
      window.location.hash = '#/signup';
      return;
    }

    // Canonical redirect for /account/profile or /account -> #/profile
    if (path === '/account/profile' || path === '/account/profile/' || path === '/account' || path === '/account/') {
      window.location.hash = '#/profile';
      return;
    }

    // Route transition indicator
    CubeLoader.showRouteTransition();

    // Scroll top
    window.scrollTo(0, 0);

    // Offline check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      CubeLoader.hideRouteTransition();
      ErrorPages.renderNetworkError(this.viewport);
      return;
    }

    // Dismiss any residual boot loader immediately once route is accessed
    const overlay = document.getElementById('cube-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      sessionStorage.setItem('TP_INTRO_SEEN', 'true');
    }

    // 1. Intercept OAuth callback (Implicit token hash or PKCE query code)
    const rawHash = window.location.hash || '';
    const rawSearch = window.location.search || '';
    const isOAuthCallback =
      rawHash.includes('access_token=') ||
      rawHash.includes('error=') ||
      rawHash.includes('error_description=') ||
      rawSearch.includes('code=') ||
      rawSearch.includes('error=') ||
      path === '/auth/callback';

    if (isOAuthCallback) {
      await this._renderOAuthCallback();
      CubeLoader.hideRouteTransition();
      return;
    }

    // 2. Prevent already-authenticated users from landing on login / signup
    const isAuthRoute = ['/signin', '/login', '/signup', '/register', '/forgot-password', '/reset-password', '/verify-email', '/welcome'].includes(path);
    if (authContext.isLoggedIn() && isAuthRoute) {
      CubeLoader.hideRouteTransition();
      window.location.hash = '#/dashboard';
      return;
    }

    // 3. Public routes (no auth needed)
    const publicRoutes = [
      '/signin', '/login', '/signup', '/register', '/forgot-password', '/reset-password',
      '/verify-email', '/resend-verification', '/terms', '/legal/terms', '/legal/privacy',
      '/legal/cookies', '/legal/deletion-request', '/privacy', '/cookies', '/data-deletion',
      '/legal/ai-disclaimer', '/welcome', '/reviews', '/contact', '/faq',
      '/about', '/features', '/contact/thank-you', '/reviews/thank-you',
      '/401', '/403', '/404', '/500', '/503', '/session-expired', '/offline'
    ];

    // 4. Auth guard for private routes
    const isPublic = publicRoutes.some(r => path === r || path.startsWith(r));
    if (!isPublic && !authContext.isLoggedIn()) {
      window.location.hash = '#/signin';
      document.body.classList.add('tp-auth-mode');
      this.rail.innerHTML = '';
      this.header.innerHTML = '';
      AuthPages.renderLogin(this.viewport);
      CubeLoader.hideRouteTransition();
      return;
    }

    // 5. Admin guard: Strictly protected, unauthorized users are denied access and redirected to Dashboard
    if (path.startsWith('/admin') && !authContext.isAdminUser()) {
      CubeLoader.hideRouteTransition();
      window.location.hash = '#/dashboard';
      return;
    }

    // 6. Onboarding guard: Completed users never see onboarding; incomplete users continue onboarding
    if (path === '/onboarding') {
      if (authContext.hasCompletedOnboarding()) {
        CubeLoader.hideRouteTransition();
        window.location.hash = '#/dashboard';
        return;
      }
    } else if (authContext.isLoggedIn() && !authContext.hasCompletedOnboarding() && !isPublic && !isAuthRoute) {
      CubeLoader.hideRouteTransition();
      window.location.hash = '#/onboarding';
      return;
    }

    const isOnboarding = path === '/onboarding';
    if (isAuthRoute || isOnboarding) {
      document.body.classList.add('tp-auth-mode');
      this.rail.innerHTML = '';
      this.header.innerHTML = '';
    } else {
      document.body.classList.remove('tp-auth-mode');
      NavRailComponent.render(this.rail, path);
      await HeaderComponent.render(this.header);
    }

    // Route dispatch
    try {
      // ── AUTH ──────────────────────────────────────────────────────────────
      if (path === '/signin' || path === '/login') { AuthPages.renderLogin(this.viewport); return; }
      if (path === '/signup' || path === '/register') { AuthPages.renderSignup(this.viewport); return; }
      if (path === '/forgot-password')        { AuthPages.renderForgotPassword(this.viewport); return; }
      if (path === '/reset-password')         { AuthPages.renderResetPassword(this.viewport, '', ''); return; }
      if (path === '/verify-email')           { AuthPages.renderVerifyEmail(this.viewport, '', ''); return; }
      if (path === '/onboarding')             { AuthPages.renderOnboarding(this.viewport); return; }

      // ── AI DOUBT SOLVER ───────────────────────────────────────────────────
      if (path === '/doubt-solver' || path === '/ai-doubt' || path.startsWith('/doubt')) {
        await this._loadPage('DoubtSolverPage', this.viewport); return;
      }

      // ── MAIN ──────────────────────────────────────────────────────────────
      if (path === '/' || path === '/home' || path === '/dashboard') {
        await DashboardPage.render(this.viewport); return;
      }
      if (path === '/search')                 { await this._renderSearch(); return; }
      if (path === '/notifications')          { await this._loadPage('NotificationsPage', this.viewport); return; }
      if (path === '/library')               { await this._loadPage('LibraryPage', this.viewport); return; }
      if (path === '/goals')                  { await this._loadPage('GoalsPage', this.viewport); return; }
      if (path === '/planner')                { await this._loadPage('StudyPlannerPage', this.viewport); return; }
      if (path === '/analytics' || path.startsWith('/analytics/')) { await this._loadPage('AnalyticsPage', this.viewport); return; }
      if (path === '/achievements')           { await this._loadPage('AchievementsPage', this.viewport); return; }
      if (path === '/streaks')               { await this._loadPage('AchievementsPage', this.viewport); return; }

      // ── LEARNING ──────────────────────────────────────────────────────────
      if (path.startsWith('/learning') || path.startsWith('/subjects') || path.startsWith('/topics') || path.startsWith('/learnhub')) {
        await LearningPage.render(this.viewport); return;
      }

      // ── 3D ───────────────────────────────────────────────────────────────
      if (path.startsWith('/3d'))            { await ThreeDPage.render(this.viewport); return; }

      // ── PDF ───────────────────────────────────────────────────────────────
      if (path.startsWith('/pdf'))            { await PDFPage.render(this.viewport); return; }

      // ── PRACTICE ──────────────────────────────────────────────────────────
      if (path.startsWith('/practice') || path.startsWith('/quiz') || path.startsWith('/flashcards') || path.startsWith('/coding') || path.startsWith('/dsa')) {
        await PracticePage.render(this.viewport); return;
      }

      // ── SKILLS ───────────────────────────────────────────────────────────
      if (path.startsWith('/skills'))         { await SkillsPage.render(this.viewport); return; }

      // ── PROJECTS ─────────────────────────────────────────────────────────
      if (path.startsWith('/projects'))       { await ProjectsPage.render(this.viewport); return; }

      // ── INTERNSHIPS ───────────────────────────────────────────────────────
      if (path === '/internships' || path.startsWith('/internships')) {
        await InternshipsPage.render(this.viewport); return;
      }

      // ── CAREER ───────────────────────────────────────────────────────────
      if (path.startsWith('/career')) {
        await CareerPage.render(this.viewport); return;
      }

      // ── RESUME ───────────────────────────────────────────────────────────
      if (path.startsWith('/resume'))         { await ResumePage.render(this.viewport); return; }

      // ── PRACTICE ─────────────────────────────────────────────────────────
      if (path.startsWith('/practice')) {
        await PracticePage.render(this.viewport); return;
      }

      // ── QUIZ LEAGUE ───────────────────────────────────────────────────────
      if (path.startsWith('/quiz-league')) {
        const parts = path.split('/');
        const eventId = parts[2];
        await QuizLeaguePage.render(this.viewport, { eventId }); return;
      }

      // ── INTERVIEW & MOCK INTERVIEW ────────────────────────────────────────
      if (path === '/mock-interview' || path.startsWith('/mock-interview') || path.startsWith('/interview')) {
        if (path === '/interview/prep' || path === '/interview/questions') {
          await InterviewPreparationPage.render(this.viewport); return;
        }
        await InterviewPage.render(this.viewport); return;
      }

      // ── EXAMS ────────────────────────────────────────────────────────────
      if (path === '/exams/my-exams' || path === '/my-exams') {
        await MyExamsPage.render(this.viewport); return;
      }
      if (path === '/exams/pyqs' || path === '/pyqs') {
        await PYQPage.render(this.viewport); return;
      }
      if (path.startsWith('/exams/') && !path.includes('my-exams') && !path.includes('pyqs')) {
        const parts = path.split('/');
        const examId = parts[2];
        await ExamDetailPage.render(this.viewport, { examId }); return;
      }
      if (path === '/exams' || path.startsWith('/exam')) {
        await ExamsPage.render(this.viewport); return;
      }

      // ── ROADMAPS ─────────────────────────────────────────────────────────
      if (path.startsWith('/roadmaps') || path.startsWith('/roadmap')) {
        await RoadmapsPage.render(this.viewport); return;
      }

      // ── TECHPATH CLASSES & STUDENT TEACHER MARKETPLACE ───────────────────
      if (path === '/classes/my-classes' || path === '/my-classes') {
        await StudentClassesPage.render(this.viewport); return;
      }
      if (path.startsWith('/classes/') && path.endsWith('/classroom')) {
        const parts = path.split('/');
        const classId = parts[2];
        await ClassroomPage.render(this.viewport, { classId }); return;
      }
      if (path.startsWith('/classes/') && !path.includes('explore') && !path.includes('create')) {
        const parts = path.split('/');
        const classId = parts[2];
        await ClassDetailPage.render(this.viewport, { classId }); return;
      }
      if (path === '/classes' || path.startsWith('/classes/explore')) {
        await ClassesPage.render(this.viewport); return;
      }
      if (path.startsWith('/teacher/dashboard') || path.startsWith('/teacher/studio')) {
        await TeacherDashboardPage.render(this.viewport); return;
      }

      // ── TECHPATH CONNECT & NETWORKING ─────────────────────────────────────
      if (path === '/connect' || path === '/connect/discover') {
        await ConnectPage.render(this.viewport, { activeTab: 'discover' }); return;
      }
      if (path === '/connect/requests') {
        await ConnectPage.render(this.viewport, { activeTab: 'requests' }); return;
      }
      if (path === '/connect/friends') {
        await ConnectPage.render(this.viewport, { activeTab: 'friends' }); return;
      }
      if (path === '/connect/study-groups' || path === '/study-groups' || path.startsWith('/study-groups/')) {
        await StudyGroupsPage.render(this.viewport); return;
      }
      if (path.startsWith('/connect/chat') || path.startsWith('/chat')) {
        const parts = path.split('/');
        const lastPart = parts[parts.length - 1];
        const targetUserId = (lastPart && lastPart !== 'chat' && lastPart !== 'connect') ? lastPart : null;
        await ChatPage.render(this.viewport, { targetUserId }); return;
      }

      // ── COMMUNITY ────────────────────────────────────────────────────────
      if (path.startsWith('/community'))      { await this._loadPage('CommunityPage', this.viewport); return; }

      // ── PROFILE / SECURITY / PREFERENCES / SETTINGS ───────────────────────
      if (path.startsWith('/security')) {
        await SecurityPage.render(this.viewport); return;
      }
      if (path.startsWith('/preferences') || path.startsWith('/privacy-settings')) {
        await PreferencesPage.render(this.viewport); return;
      }
      if (path === '/settings' || path.startsWith('/settings')) {
        await SettingsPage.render(this.viewport); return;
      }
      if (path.startsWith('/profile') || path.startsWith('/account/profile')) {
        await ProfilePage.render(this.viewport); return;
      }

      // ── ABOUT / FEATURES ─────────────────────────────────────────────────
      if (path === '/about' || path === '/features') {
        await AboutPage.render(this.viewport);
        return;
      }

      // ── THANK-YOU PAGES ───────────────────────────────────────────────────
      if (path.startsWith('/contact/thank-you')) {
        ThankYouPage.render(this.viewport, 'contact');
        return;
      }
      if (path.startsWith('/reviews/thank-you')) {
        ThankYouPage.render(this.viewport, 'review');
        return;
      }

      // ── LEGAL & TERMS OF USE ───────────────────────────────────────────────
      if (path === '/terms' || path.startsWith('/terms') || path.startsWith('/legal') || path === '/privacy' || path.startsWith('/privacy') || path === '/cookies' || path.startsWith('/cookies') || path === '/data-deletion' || path.startsWith('/data-deletion')) {
        await this._loadPage('LegalPage', this.viewport);
        return;
      }

      // ── REVIEWS & FEEDBACK ───────────────────────────────────────────────
      if (path.startsWith('/reviews'))        { await ReviewsPage.render(this.viewport); return; }

      // ── FAQ / CONTACT & SUPPORT ──────────────────────────────────────────
      if (path.startsWith('/faq') || path.startsWith('/help')) { await this._loadPage('FAQPage', this.viewport); return; }
      if (path.startsWith('/contact') || path.startsWith('/support') || path.startsWith('/support-tickets')) { await ContactPage.render(this.viewport); return; }

      // ── ADMIN ─────────────────────────────────────────────────────────────
      if (path.startsWith('/admin'))          { await AdminPage.render(this.viewport); return; }

      // ── ERROR PAGES ───────────────────────────────────────────────────────
      if (path === '/401')  { ErrorPages.render401(this.viewport); return; }
      if (path === '/403')  { ErrorPages.render403(this.viewport); return; }
      if (path === '/500')  { ErrorPages.render500(this.viewport); return; }
      if (path === '/503')  { ErrorPages.render503(this.viewport); return; }
      if (path === '/session-expired') { ErrorPages.renderSessionExpired(this.viewport); return; }
      if (path === '/offline') { ErrorPages.renderNetworkError(this.viewport); return; }

      // ── 404 ───────────────────────────────────────────────────────────────
      ErrorPages.render404(this.viewport);
    } catch (err) {
      console.error('[Router] Page error:', err);
      ErrorPages.render500(this.viewport, err.message);
    } finally {
      CubeLoader.hideRouteTransition();
    }
  }

  /** Lazy-load a page module from js/pages/ */
  async _loadPage(name, viewport) {
    try {
      const mod = await import(`./pages/${name}.js`);
      const PageClass = mod[name] || mod.default;
      if (PageClass?.render) await PageClass.render(viewport);
      else viewport.innerHTML = `<div class="tp-empty-state"><p>Page module loaded but no render method found.</p></div>`;
    } catch (err) {
      console.error(`[Router] Failed to load ${name}:`, err);
      // Clean fallback for unconfigured views
      viewport.innerHTML = `
        <div class="tp-empty-state" style="border:1px solid var(--tp-border-dark);border-radius:var(--radius-md);padding:4rem 2rem;text-align:center;">
          <h1 class="headline-lg">${name.replace('Page','')}</h1>
          <p class="tp-empty-desc">No data records currently configured for this view.</p>
          <a href="#/dashboard" class="tp-btn tp-btn-secondary" style="margin-top:1.5rem">Return to Dashboard</a>
        </div>`;
    }
  }

  async _renderSearch() {
    const query = new URLSearchParams(window.location.hash.split('?')[1]).get('q') || '';
    try {
      const mod = await import('./pages/SearchPage.js');
      await mod.SearchPage.render(this.viewport, query);
    } catch {
      this.viewport.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:1.5rem;max-width:700px">
          <h1 class="headline-xl">Search</h1>
          <input type="search" class="tp-input" value="${query}" placeholder="Search subjects, topics, skills..." />
          <p style="color:var(--tp-text-dark-secondary)">Search is loading...</p>
        </div>`;
    }
  }

  /**
   * Dedicated Google OAuth Callback Flow Handler
   */
  async _renderOAuthCallback() {
    document.body.classList.add('tp-auth-mode');
    this.rail.innerHTML = '';
    this.header.innerHTML = '';

    this.viewport.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:75vh;padding:2rem;text-align:center;">
        <div class="tp-card tp-card-glass" style="max-width:480px;width:100%;padding:2.5rem;display:flex;flex-direction:column;align-items:center;gap:1.5rem;box-shadow:var(--shadow-glass);border:1px solid rgba(225,29,72,0.3);">
          
          <div id="oauth-spinner-icon" style="width:68px;height:68px;border-radius:50%;background:rgba(225,29,72,0.12);border:2px solid var(--tp-primary);display:flex;align-items:center;justify-content:center;font-size:2rem;position:relative;">
            <div style="width:36px;height:36px;border:3px solid rgba(225,29,72,0.2);border-top-color:var(--tp-primary);border-radius:50%;animation:tp-spin 0.8s linear infinite;"></div>
          </div>

          <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
            <div class="telemetry-chip" id="oauth-telemetry">
              <span class="pulse-beacon"></span> AUTHENTICATING WITH GOOGLE...
            </div>
            <h2 class="headline-xl" id="oauth-status-title" style="margin-top:0.5rem;">Authenticating...</h2>
            <p id="oauth-status-msg" style="color:var(--tp-text-dark-secondary);font-size:0.95rem;line-height:1.5;max-width:380px;">
              Verifying credentials and restoring your session.
            </p>
          </div>

          <div id="oauth-action-area" style="display:none;flex-direction:column;gap:0.75rem;width:100%;margin-top:0.5rem;">
            <button id="oauth-retry-btn" class="tp-btn tp-btn-primary tp-btn-full" style="display:none;">
              🔄 Retry Profile Sync
            </button>
            <a href="#/signin" class="tp-btn tp-btn-secondary tp-btn-full">
              &larr; Return to Sign In
            </a>
          </div>

        </div>
      </div>
    `;

    const titleEl = document.getElementById('oauth-status-title');
    const msgEl = document.getElementById('oauth-status-msg');
    const chipEl = document.getElementById('oauth-telemetry');
    const actionArea = document.getElementById('oauth-action-area');
    const retryBtn = document.getElementById('oauth-retry-btn');
    const spinnerIcon = document.getElementById('oauth-spinner-icon');

    const updateStatus = (title, msg, isSuccess = false) => {
      if (titleEl) titleEl.textContent = title;
      if (msgEl) msgEl.textContent = msg;
      if (isSuccess && spinnerIcon) {
        spinnerIcon.innerHTML = `<span style="font-size:2rem;">✅</span>`;
        spinnerIcon.style.borderColor = '#10b981';
        spinnerIcon.style.background = 'rgba(16,185,129,0.15)';
      }
    };

    try {
      const { destination, user } = await authContext.processOAuthCallback((title, msg) => {
        updateStatus(title, msg, title.includes('successful') || title.includes('complete'));
      });

      // Clean the address bar tokens immediately
      if (window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname + destination);
      } else {
        window.location.hash = destination;
      }

      // Execute short post-login cube fragments reassembly, 360 spin, welcome banner, then launch Dashboard
      CubeLoader.playLoginSuccessAnimation(user?.name || 'Engineer', () => {
        document.body.classList.remove('tp-auth-mode');
        this.navigate();
      });

    } catch (err) {
      console.error('[OAuth Callback Error]:', err);
      if (spinnerIcon) {
        spinnerIcon.innerHTML = `<span style="font-size:2rem;">⚠️</span>`;
        spinnerIcon.style.borderColor = 'var(--tp-warning)';
        spinnerIcon.style.background = 'rgba(245,158,11,0.15)';
      }
      if (chipEl) chipEl.innerHTML = `<span style="color:var(--tp-danger)">●</span> AUTHENTICATION NOTICE`;
      if (titleEl) titleEl.textContent = 'Google sign-in could not be completed';

      let friendlyMsg = err.message || 'An unexpected error occurred during Google authentication.';
      if (friendlyMsg.includes('cancelled') || friendlyMsg.includes('closed')) {
        friendlyMsg = 'Google sign-in was cancelled. Please try again.';
      } else if (friendlyMsg.includes('session')) {
        friendlyMsg = 'Your session could not be restored. Please sign in again.';
      }
      if (msgEl) msgEl.textContent = friendlyMsg;
      if (actionArea) actionArea.style.display = 'flex';

      if (retryBtn) {
        retryBtn.style.display = 'block';
        retryBtn.textContent = '🔄 Retry Sign In with Google';
        retryBtn.onclick = async () => {
          retryBtn.disabled = true;
          retryBtn.textContent = 'Connecting...';
          try {
            await authContext.loginWithGoogle();
          } catch (e) {
            retryBtn.disabled = false;
            retryBtn.textContent = '🔄 Retry Sign In with Google';
            if (msgEl) msgEl.textContent = e.message;
          }
        };
      }
    }
  }
}
