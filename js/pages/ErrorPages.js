/**
 * TECHPATH — UNIFIED ERROR SYSTEM & PAGES
 * Custom 3D Holographic Visualizer for 404, Offline/Network, 500, 401, 403, 503, Session Expired
 */
export class ErrorPages {
  /**
   * Universal error renderer with 3D canvas visualizer & direct actions
   */
  static _render(container, {
    code = 'ERROR',
    badge = 'SYSTEM ALERT',
    title = 'An Error Occurred',
    message = 'We encountered an unexpected condition.',
    details = '',
    themeColor = '#a855f7',
    secondaryColor = '#3b82f6',
    primaryAction = { label: 'Go to Dashboard', href: '#/dashboard', id: 'tp-err-primary-btn' },
    showTryAgain = true,
    showBack = true,
    showSupport = true,
    customActionHtml = ''
  }) {
    if (!container) return;

    const canvasId = `tp-error-canvas-${Math.random().toString(36).slice(2, 7)}`;
    const currentPath = window.location.hash || '#/dashboard';

    container.innerHTML = `
      <div class="tp-error-container" style="
        min-height: calc(100vh - 120px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2.5rem 1.5rem;
        background: radial-gradient(circle at 50% 30%, rgba(15, 23, 42, 0.75) 0%, #030712 100%);
        position: relative;
        overflow: hidden;
      ">
        <!-- Ambient Glow Backdrops -->
        <div style="
          position: absolute;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, ${themeColor}22 0%, transparent 70%);
          filter: blur(60px);
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        "></div>

        <div class="tp-error-card" style="
          position: relative;
          z-index: 2;
          max-width: 640px;
          width: 100%;
          background: rgba(15, 23, 42, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top: 1px solid ${themeColor}66;
          border-radius: 20px;
          padding: 2.5rem;
          text-align: center;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px ${themeColor}1a;
          backdrop-filter: blur(18px);
        ">
          <!-- 3D Holographic Canvas -->
          <div style="position: relative; width: 140px; height: 140px; margin: 0 auto 1.5rem auto;">
            <canvas id="${canvasId}" width="140" height="140" style="display: block; width: 140px; height: 140px;"></canvas>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-family: 'Space Grotesk', system-ui, sans-serif;
              font-size: 1.6rem;
              font-weight: 800;
              letter-spacing: -0.05em;
              color: #f8fafc;
              text-shadow: 0 0 15px ${themeColor};
              pointer-events: none;
            ">${code}</div>
          </div>

          <!-- Status Badge -->
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: ${themeColor}18; border: 1px solid ${themeColor}44; border-radius: 999px; padding: 0.35rem 1rem; margin-bottom: 1.25rem;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${themeColor}; box-shadow: 0 0 8px ${themeColor};"></span>
            <span style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #e2e8f0;">${badge}</span>
          </div>

          <!-- Error Title & Description -->
          <h1 style="font-size: 1.85rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.85rem; font-family: 'Space Grotesk', system-ui, sans-serif;">
            ${title}
          </h1>
          <p style="color: #94a3b8; font-size: 0.98rem; line-height: 1.65; margin-bottom: 1.75rem; max-width: 520px; margin-left: auto; margin-right: auto;">
            ${message}
          </p>

          ${details ? `
            <details style="text-align: left; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 0.75rem 1rem; margin-bottom: 1.75rem;">
              <summary style="cursor: pointer; color: #94a3b8; font-size: 0.82rem; font-weight: 600; outline: none;">
                Technical Diagnostic Info
              </summary>
              <pre style="margin-top: 0.65rem; font-size: 0.75rem; color: #f43f5e; overflow-x: auto; background: rgba(0,0,0,0.5); padding: 0.6rem; border-radius: 6px; font-family: monospace;">${details}</pre>
            </details>
          ` : ''}

          <!-- Custom action buttons if any -->
          ${customActionHtml}

          <!-- Primary & Secondary Actions Bar -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; align-items: center; margin-top: 1rem;">
            ${primaryAction ? `
              <a href="${primaryAction.href}" id="${primaryAction.id || ''}" class="tp-btn tp-btn-primary" style="
                background: linear-gradient(135deg, ${themeColor}, ${secondaryColor});
                color: #ffffff;
                padding: 0.75rem 1.6rem;
                font-weight: 700;
                font-size: 0.92rem;
                border-radius: 10px;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                box-shadow: 0 4px 16px ${themeColor}44;
                transition: transform 0.2s, box-shadow 0.2s;
              ">
                ${primaryAction.label}
              </a>
            ` : ''}

            ${showTryAgain ? `
              <button type="button" id="tp-err-tryagain-btn" style="
                background: rgba(255, 255, 255, 0.06);
                color: #e2e8f0;
                border: 1px solid rgba(255, 255, 255, 0.15);
                padding: 0.75rem 1.3rem;
                font-weight: 600;
                font-size: 0.92rem;
                border-radius: 10px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                transition: background 0.2s;
              ">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Try Again
              </button>
            ` : ''}

            ${showBack ? `
              <button type="button" id="tp-err-back-btn" style="
                background: rgba(255, 255, 255, 0.04);
                color: #cbd5e1;
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 0.75rem 1.2rem;
                font-weight: 600;
                font-size: 0.92rem;
                border-radius: 10px;
                cursor: pointer;
                transition: background 0.2s;
              ">
                Go Back
              </button>
            ` : ''}
          </div>

          <!-- Auxiliary Footer Links -->
          <div style="margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid rgba(255, 255, 255, 0.07); display: flex; justify-content: center; gap: 1.5rem; font-size: 0.82rem;">
            <a href="#/" style="color: #94a3b8; text-decoration: none; transition: color 0.2s;">Home Page</a>
            <span style="color: rgba(255,255,255,0.2)">•</span>
            <a href="#/dashboard" style="color: #94a3b8; text-decoration: none; transition: color 0.2s;">Dashboard</a>
            ${showSupport ? `
              <span style="color: rgba(255,255,255,0.2)">•</span>
              <a href="#/contact" style="color: ${themeColor}; text-decoration: none; font-weight: 600;">Contact Support</a>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    // Initialize 3D Canvas visualizer
    this._initErrorCanvas(canvasId, themeColor, secondaryColor);

    // Bind action events
    const tryBtn = container.querySelector('#tp-err-tryagain-btn');
    if (tryBtn) {
      tryBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }

    const backBtn = container.querySelector('#tp-err-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.hash = '#/dashboard';
        }
      });
    }
  }

  /**
   * Interactive rotating holographic rings / hexagon visualizer
   */
  static _initErrorCanvas(canvasId, col1, col2) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    let animId = null;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, 140, 140);
      const cx = 70;
      const cy = 70;

      // Outer pulsing ring
      const pulse = Math.sin(frame * 0.04) * 4;
      ctx.save();
      ctx.strokeStyle = col1;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 60 + pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Rotating dashed ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(frame * 0.025);
      ctx.strokeStyle = col2;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Counter-rotating inner hexagon
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-frame * 0.018);
      ctx.strokeStyle = col1;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const sides = 6;
      const rad = 42;
      for (let i = 0; i < sides; i++) {
        const a = (i * 2 * Math.PI) / sides;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Holographic corner dots
      for (let i = 0; i < 4; i++) {
        const angle = frame * 0.03 + (i * Math.PI) / 2;
        const x = cx + Math.cos(angle) * 52;
        const y = cy + Math.sin(angle) * 52;
        ctx.fillStyle = col2;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    // Stop animation if canvas gets disconnected
    const observer = new MutationObserver(() => {
      if (!document.body.contains(canvas)) {
        cancelAnimationFrame(animId);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 1. 404 NOT FOUND
  static render404(c) {
    this._render(c, {
      code: '404',
      badge: 'RESOURCE NOT FOUND',
      title: 'Target Coordinate Unreachable',
      message: 'The page or learning module you requested does not exist or has been shifted in the TechPath neural grid.',
      themeColor: '#a855f7',
      secondaryColor: '#3b82f6',
      primaryAction: { label: 'Return to Dashboard', href: '#/dashboard' }
    });
  }

  // 2. NETWORK ERROR / OFFLINE
  static renderNetworkError(c) {
    this._render(c, {
      code: 'OFFLINE',
      badge: 'CONNECTION SEVERED',
      title: 'No Network Signal Detected',
      message: 'Your system appears to be disconnected from the internet. Please check your WiFi or cellular data connection.',
      themeColor: '#eab308',
      secondaryColor: '#f97316',
      primaryAction: { label: 'Check Signal & Retry', href: window.location.hash || '#/dashboard' }
    });

    // Auto-detect return of online status
    const onOnline = () => {
      window.removeEventListener('online', onOnline);
      const notice = document.createElement('div');
      notice.innerHTML = `
        <div style="position:fixed; bottom:24px; right:24px; z-index:9999; background:#10b981; color:#fff; padding:1rem 1.5rem; border-radius:12px; font-weight:700; box-shadow:0 10px 25px rgba(16,185,129,0.4); display:flex; align-items:center; gap:0.6rem;">
          <span>🌐</span> Connection Restored! Refreshing...
        </div>
      `;
      document.body.appendChild(notice);
      setTimeout(() => window.location.reload(), 1200);
    };
    window.addEventListener('online', onOnline, { once: true });
  }

  // 3. 500 INTERNAL SERVER ERROR
  static render500(c, detail = '') {
    this._render(c, {
      code: '500',
      badge: 'INTERNAL CORE EXCEPTION',
      title: 'Unexpected Processing Error',
      message: 'Our engine encountered a runtime fault while executing this operation. Automated telemetry has logged this event.',
      details: detail,
      themeColor: '#ef4444',
      secondaryColor: '#f43f5e',
      primaryAction: { label: 'Reload TechPath', href: window.location.hash || '#/dashboard' }
    });
  }

  // 4. 401 UNAUTHORIZED
  static render401(c) {
    const returnUrl = encodeURIComponent(window.location.hash || '#/dashboard');
    this._render(c, {
      code: '401',
      badge: 'AUTHENTICATION REQUIRED',
      title: 'Restricted Educational Grid',
      message: 'You must be authenticated with a verified TechPath student or admin account to enter this portal.',
      themeColor: '#06b6d4',
      secondaryColor: '#3b82f6',
      primaryAction: { label: 'Sign In to Proceed', href: `#/signin?redirect=${returnUrl}` }
    });
  }

  // 5. 403 FORBIDDEN
  static render403(c) {
    this._render(c, {
      code: '403',
      badge: 'ACCESS DENIED',
      title: 'Insufficient Clearance Level',
      message: 'Your current account profile does not possess the administrative privileges required to access this system control.',
      themeColor: '#f43f5e',
      secondaryColor: '#9333ea',
      primaryAction: { label: 'Back to Dashboard', href: '#/dashboard' }
    });
  }

  // 6. 503 SERVICE UNAVAILABLE / MAINTENANCE
  static render503(c) {
    this._render(c, {
      code: '503',
      badge: 'SCHEDULED MAINTENANCE',
      title: 'System Upgrades Underway',
      message: 'The TechPath engineering cluster is undergoing routine updates and performance optimization. Service will resume shortly.',
      themeColor: '#10b981',
      secondaryColor: '#06b6d4',
      primaryAction: { label: 'Check Status', href: window.location.hash || '#/dashboard' }
    });
  }

  // 7. SESSION EXPIRED
  static renderSessionExpired(c) {
    const returnUrl = encodeURIComponent(window.location.hash || '#/dashboard');
    this._render(c, {
      code: 'EXPIRED',
      badge: 'SESSION TIMEOUT',
      title: 'Security Token Has Expired',
      message: 'Your session credentials have timed out for your security. Please sign in again to resume your learning progress seamlessly.',
      themeColor: '#f59e0b',
      secondaryColor: '#ef4444',
      primaryAction: { label: 'Re-Authenticate Now', href: `#/signin?redirect=${returnUrl}` },
      showSupport: false
    });
  }
}
