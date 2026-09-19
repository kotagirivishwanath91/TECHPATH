/**
 * TECHPATH — MASTER APPLICATION BOOTSTRAP
 * Initializes DB, Auth, Learning Context, Cookie Consent, Cube Animation, Router
 */

import { dbStore }          from './db/store.js';
import { learningContext }  from './context/LearningContext.js';
import { authContext }      from './context/AuthContext.js';
import { CubeLoader }       from './components/CubeLoader.js';
import { AppRouter }        from './router.js';

class TechPathApp {
  static async start() {
    console.log('%cTechPath 3.0 — From Classroom to Career', 'color:#e11d48;font-weight:700;font-size:14px');

    // 1. Resolve root DOM nodes immediately
    const viewport = document.getElementById('main-viewport');
    const rail     = document.getElementById('nav-rail-root');
    const header   = document.getElementById('header-root');

    if (!viewport || !rail || !header) {
      console.error('[TechPath] Critical DOM root missing. Check index.html.');
      return;
    }

    // 2. Instantiate router immediately
    const router = new AppRouter(viewport, rail, header);

    // 3. Resolve initial auth state before first navigation (with 600ms cap so network never delays render)
    try {
      await Promise.race([
        authContext.init(),
        new Promise(r => setTimeout(r, 600))
      ]);
    } catch (err) {
      console.warn('[Auth] Init fallback note:', err);
    }

    // 4. Clean up any legacy demo accounts from local storage
    try {
      const users = JSON.parse(localStorage.getItem('TP_USERS_DB') || '[]');
      const sanitized = users.filter(u => u.email !== 'demo@techpath.edu' && u.email !== 'admin@techpath.edu');
      if (sanitized.length !== users.length) {
        localStorage.setItem('TP_USERS_DB', JSON.stringify(sanitized));
      }
    } catch {}

    // 5. Init learning context from current state
    const auth = authContext.get();
    const branch = auth.user?.profile?.branch_id || 'cse';
    const semester = auth.user?.profile?.semester_id || 'sem_3';
    learningContext.setBranch(branch).catch(() => {});
    learningContext.setSemester(semester).catch(() => {});

    // 6. Subscribe to learning & auth context changes → re-navigate current route
    learningContext.subscribe(() => router.navigate());
    authContext.subscribe((event) => {
      if (event === 'login' || event === 'logout') {
        router.navigate();
      }
    });

    // 7. Cookie consent banner
    this._initCookieConsent();

    // 8. Global 3D Brand Cube: White + TechPath Red, smooth rotation, slice & seamless reveal
    CubeLoader.playInitialAnimation();

    // 9. Navigate immediately (mounts view under overlay for smooth zero-flash reveal)
    router.navigate();

    // 10. Background DB initialization & canonical seeding (NEVER blocks auth or initial rendering)
    (async () => {
      try {
        await dbStore.init();
        await dbStore.seedAll();
      } catch (e) {
        console.warn('[DB] Background seed note:', e.message);
      }
    })();

    // 11. Service Worker (PWA)
    this._registerServiceWorker();
  }

  static _initCookieConsent() {
    const banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;
    const consent = localStorage.getItem('TP_COOKIE_CONSENT');
    if (!consent) {
      banner.style.display = 'block';
      const dismissBanner = () => {
        localStorage.setItem('TP_COOKIE_CONSENT', JSON.stringify({ essential: true, analytics: false, ts: new Date().toISOString() }));
        banner.style.display = 'none';
      };
      banner.querySelector('#cookie-accept-btn')?.addEventListener('click', () => {
        localStorage.setItem('TP_COOKIE_CONSENT', JSON.stringify({ essential: true, analytics: true, ts: new Date().toISOString() }));
        banner.style.display = 'none';
      });
      banner.querySelector('#cookie-reject-btn')?.addEventListener('click', dismissBanner);
      banner.querySelector('#cookie-close-btn')?.addEventListener('click', dismissBanner);
      banner.querySelector('#cookie-manage-btn')?.addEventListener('click', () => {
        window.location.hash = '#/settings?tab=privacy';
        banner.style.display = 'none';
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && banner.style.display !== 'none') {
          dismissBanner();
        }
      });
    }
  }

  static _runOpeningAnimation(onComplete) {
    const overlay     = document.getElementById('cube-overlay');
    const cube        = document.getElementById('glass-cube');
    const revealBrand = document.getElementById('reveal-brand');

    onComplete?.();

    if (!overlay || !cube) return;

    if (sessionStorage.getItem('TP_INTRO_SEEN')) {
      overlay.style.display = 'none';
      return;
    }

    const dismiss = () => {
      overlay.style.display = 'none';
      sessionStorage.setItem('TP_INTRO_SEEN', 'true');
    };
    overlay.addEventListener('click', dismiss);

    setTimeout(() => { cube.classList.add('separated'); }, 700);
    setTimeout(() => { revealBrand?.classList.add('visible'); }, 1000);
    setTimeout(() => {
      overlay.classList.add('fade-out');
      sessionStorage.setItem('TP_INTRO_SEEN', 'true');
      setTimeout(() => { overlay.style.display = 'none'; }, 400);
    }, 1600);
  }

  static _registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => {
          console.log('[SW] Registration note:', err.message);
        });
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => TechPathApp.start());
} else {
  TechPathApp.start();
}
