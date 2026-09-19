/**
 * TECHPATH — COMPLETE AUTHENTICATION PAGES
 * 
 * Features:
 * - Clean White + TechPath Red branding
 * - Sliced cube transitions into real Sign In / Sign Up UI
 * - Prominent Google Sign-In with robust error recovery
 * - Form validation, show/hide password, and keyboard accessibility
 * - Zero heavy background loops for ultra-smooth typing & zero mobile lag
 * - Post-login 3D cube spin & welcome transition triggers
 */

import { authContext } from '../context/AuthContext.js';
import { learningContext } from '../context/LearningContext.js';
import { APP_CONFIG } from '../config.js';
import { Toast } from '../components/Toast.js';
import { CubeLoader } from '../components/CubeLoader.js';
import { DEPARTMENTS, ALL_BRANCHES, TaxonomyEngine } from '../services/TaxonomyEngine.js';

export class AuthPages {

  // ─── 1. SIGN IN (LOGIN) ──────────────────────────────────────────────────
  static renderLogin(container) {
    container.innerHTML = `
      <div class="tp-auth-page-wrapper" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; background: radial-gradient(circle at center, #111522 0%, #07090e 100%);">
        
        <div class="tp-auth-shell" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem; max-width: 980px; width: 100%; align-items: center; box-sizing: border-box;">

          <!-- Left Column: Premium Brand Showcase (Pure CSS, 60fps, Zero Lag) -->
          <div class="tp-auth-visual-panel" style="display: flex; flex-direction: column; gap: 1.5rem; padding: 2.5rem; border-radius: var(--radius-xl); background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); position: relative; overflow: hidden;">
            <div style="position: absolute; inset: 0; background-image: radial-gradient(circle at 20% 30%, rgba(225, 29, 72, 0.15), transparent 60%); pointer-events: none;"></div>

            <div style="position: relative; z-index: 2;">
              <div class="telemetry-chip" style="margin-bottom: 0.75rem; background: rgba(225, 29, 72, 0.15); border-color: rgba(225, 29, 72, 0.35); color: #fda4af;">
                <span class="pulse-beacon" style="background: #e11d48;"></span> ENGINEERING ACADEMIC GATEWAY
              </div>
              <div class="tp-logo-text" style="font-size: 2.6rem; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
                TECH<span style="color: #e11d48;">PATH</span>
              </div>
              <p style="font-size: 0.88rem; font-weight: 600; color: #38bdf8; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 0.25rem;">
                From Classroom to Career
              </p>
              <p style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.6; margin-top: 1rem;">
                Sign in to resume your branch-specific coursework, explore interactive 3D engineering models, and verify placement readiness.
              </p>
            </div>

            <!-- Sleek Brand Feature Highlights -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.88rem; color: #e2e8f0; position: relative; z-index: 2; padding: 1.25rem; background: rgba(0,0,0,0.3); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.06);">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="color: #e11d48; font-weight: bold;">✓</span> 11 Engineering Disciplines Isolated (CSE, ECE, MECH, CIVIL)
              </div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="color: #e11d48; font-weight: bold;">✓</span> Interactive 3D Structural Simulations & Exploded Views
              </div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="color: #e11d48; font-weight: bold;">✓</span> TechPath Classes, Practice Center & Placement Preparation
              </div>
            </div>
          </div>

          <!-- Right Column: Clean White/Red Authentication Card -->
          <div class="tp-card tp-card-glass" style="padding: 2.25rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-glass); border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(12px); box-sizing: border-box; width: 100%;">
            
            <h1 class="headline-xl" style="color: #fff; margin-bottom: 0.35rem; font-size: 1.75rem;">Welcome Back</h1>
            <p style="color: var(--tp-text-dark-secondary); font-size: 0.92rem; margin-bottom: 1.5rem;">
              Enter your student or faculty credentials to continue.
            </p>

            <!-- Google Sign In Button (Prominent, High Contrast) -->
            <button id="google-login-btn" class="tp-btn tp-btn-secondary tp-btn-full" style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 0.75rem 1rem; font-size: 0.95rem; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255,255,255,0.06); color: #fff; min-height: 46px; cursor: pointer; transition: background 0.2s ease;">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </button>

            <div class="tp-auth-divider" style="margin: 1.25rem 0; display: flex; align-items: center; text-align: center; color: var(--tp-text-dark-muted); font-size: 0.8rem; text-transform: uppercase;">
              <span style="flex: 1; border-bottom: 1px solid rgba(255,255,255,0.1);"></span>
              <span style="padding: 0 0.75rem;">or with email</span>
              <span style="flex: 1; border-bottom: 1px solid rgba(255,255,255,0.1);"></span>
            </div>

            <!-- Email / Password Form -->
            <form id="login-form" novalidate style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="tp-form-group">
                <label for="login-email" class="tp-form-label">Email or Student ID</label>
                <input type="text" id="login-email" class="tp-input" placeholder="student@university.edu or TP-CSE-..." required autocomplete="username" style="min-height: 44px; font-size: 16px;" />
                <span class="tp-form-error" id="login-email-err"></span>
              </div>

              <div class="tp-form-group">
                <label for="login-password" class="tp-form-label">Password</label>
                <div class="tp-input-wrap" style="position: relative;">
                  <input type="password" id="login-password" class="tp-input" placeholder="••••••••" required autocomplete="current-password" style="min-height: 44px; font-size: 16px; padding-right: 42px;" />
                  <button type="button" id="login-pw-toggle" class="tp-input-icon-btn" aria-label="Toggle password visibility" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--tp-text-dark-muted); font-size: 1.1rem; padding: 4px;">👁</button>
                </div>
                <span class="tp-form-error" id="login-pw-err"></span>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--tp-text-dark-secondary);">
                  <input type="checkbox" id="login-remember" checked style="accent-color: var(--tp-primary); width: 16px; height: 16px;"> Remember session
                </label>
                <a href="#/forgot-password" class="tp-link" style="color: #38bdf8; text-decoration: none;">Forgot password?</a>
              </div>

              <div class="tp-form-error tp-form-error-main" id="login-main-err" style="display: none; padding: 0.75rem; border-radius: var(--radius-sm); background: rgba(239, 68, 68, 0.15); border: 1px solid var(--tp-error); color: #fca5a5; font-size: 0.85rem;"></div>

              <button type="submit" id="login-submit-btn" class="tp-btn tp-btn-primary tp-btn-full" style="padding: 0.85rem; font-size: 1rem; margin-top: 0.5rem; min-height: 46px; font-weight: 600;">
                Sign In →
              </button>
            </form>

            <!-- Sign Up Link -->
            <div style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--tp-text-dark-secondary);">
              Don't have an account? <a href="#/signup" class="tp-link" style="color: var(--tp-primary); font-weight: 600;">Sign Up</a>
            </div>

            <!-- Terms & Privacy -->
            <div style="text-align: center; margin-top: 1rem; font-size: 0.78rem; color: var(--tp-text-dark-muted);">
              By signing in, you agree to TechPath's
              <a href="#/terms" class="tp-link" style="color: #94a3b8;">Terms of Use</a> and
              <a href="#/legal/privacy" class="tp-link" style="color: #94a3b8;">Privacy Policy</a>.
            </div>

          </div>

        </div>
      </div>
    `;

    this._attachLoginHandlers(container);
  }

  // ─── 2. SIGN UP (CREATE ACCOUNT) ─────────────────────────────────────────
  static renderSignup(container) {
    container.innerHTML = `
      <div class="tp-auth-page-wrapper" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; background: radial-gradient(circle at center, #111522 0%, #07090e 100%);">
        
        <div class="tp-auth-shell" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem; max-width: 980px; width: 100%; align-items: center; box-sizing: border-box;">

          <!-- Left Column: Premium Brand Showcase -->
          <div class="tp-auth-visual-panel" style="display: flex; flex-direction: column; gap: 1.5rem; padding: 2.5rem; border-radius: var(--radius-xl); background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); position: relative; overflow: hidden;">
            <div style="position: absolute; inset: 0; background-image: radial-gradient(circle at 20% 30%, rgba(225, 29, 72, 0.15), transparent 60%); pointer-events: none;"></div>

            <div style="position: relative; z-index: 2;">
              <div class="telemetry-chip" style="margin-bottom: 0.75rem; background: rgba(225, 29, 72, 0.15); border-color: rgba(225, 29, 72, 0.35); color: #fda4af;">
                <span class="pulse-beacon" style="background: #e11d48;"></span> STUDENT & FACULTY ENROLLMENT
              </div>
              <div class="tp-logo-text" style="font-size: 2.6rem; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
                TECH<span style="color: #e11d48;">PATH</span>
              </div>
              <p style="font-size: 0.88rem; font-weight: 600; color: #38bdf8; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 0.25rem;">
                From Classroom to Career
              </p>
              <p style="font-size: 0.95rem; color: #cbd5e1; line-height: 1.6; margin-top: 1rem;">
                Create your verified profile to unlock branch curriculums, interactive 3D engineering components, and competitive placement drills.
              </p>
            </div>

            <!-- Features -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.88rem; color: #e2e8f0; position: relative; z-index: 2; padding: 1.25rem; background: rgba(0,0,0,0.3); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.06);">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="color: #e11d48; font-weight: bold;">✓</span> 100% Free for Engineering Students Worldwide
              </div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="color: #e11d48; font-weight: bold;">✓</span> Zero Cross-Branch Distraction (Curriculum Isolation)
              </div>
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="color: #e11d48; font-weight: bold;">✓</span> Verifiable Academic Dossier & Skill Matrix
              </div>
            </div>
          </div>

          <!-- Right Column: Sign Up Card -->
          <div class="tp-card tp-card-glass" style="padding: 2.25rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-glass); border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(12px); box-sizing: border-box; width: 100%;">
            
            <h1 class="headline-xl" style="color: #fff; margin-bottom: 0.35rem; font-size: 1.75rem;">Create Your Account</h1>
            <p style="color: var(--tp-text-dark-secondary); font-size: 0.92rem; margin-bottom: 1.5rem;">
              Join thousands of engineering peers on TechPath.
            </p>

            <!-- Google Sign Up Button -->
            <button id="google-signup-btn" class="tp-btn tp-btn-secondary tp-btn-full" style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; padding: 0.75rem 1rem; font-size: 0.95rem; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255,255,255,0.06); color: #fff; min-height: 46px; cursor: pointer;">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </button>

            <div class="tp-auth-divider" style="margin: 1.25rem 0; display: flex; align-items: center; text-align: center; color: var(--tp-text-dark-muted); font-size: 0.8rem; text-transform: uppercase;">
              <span style="flex: 1; border-bottom: 1px solid rgba(255,255,255,0.1);"></span>
              <span style="padding: 0 0.75rem;">or create with email</span>
              <span style="flex: 1; border-bottom: 1px solid rgba(255,255,255,0.1);"></span>
            </div>

            <!-- Sign Up Form -->
            <form id="signup-form" novalidate style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="tp-form-group">
                <label for="signup-name" class="tp-form-label">Full Name *</label>
                <input type="text" id="signup-name" class="tp-input" placeholder="e.g. Rahul Sharma" required autocomplete="name" style="min-height: 44px; font-size: 16px;" />
                <span class="tp-form-error" id="signup-name-err"></span>
              </div>

              <div class="tp-form-group">
                <label for="signup-email" class="tp-form-label">Email Address *</label>
                <input type="email" id="signup-email" class="tp-input" placeholder="yourname@college.edu" required autocomplete="email" style="min-height: 44px; font-size: 16px;" />
                <span class="tp-form-error" id="signup-email-err"></span>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <div class="tp-form-group">
                  <label for="signup-password" class="tp-form-label">Password *</label>
                  <div class="tp-input-wrap" style="position: relative;">
                    <input type="password" id="signup-password" class="tp-input" placeholder="Min 8 chars" required autocomplete="new-password" style="min-height: 44px; font-size: 16px; padding-right: 36px;" />
                    <button type="button" id="signup-pw-toggle" class="tp-input-icon-btn" aria-label="Toggle password visibility" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--tp-text-dark-muted); font-size: 1.05rem;">👁</button>
                  </div>
                </div>

                <div class="tp-form-group">
                  <label for="signup-confirm-password" class="tp-form-label">Confirm Password *</label>
                  <input type="password" id="signup-confirm-password" class="tp-input" placeholder="Re-enter password" required autocomplete="new-password" style="min-height: 44px; font-size: 16px;" />
                </div>
              </div>

              <!-- Terms + Privacy Checkbox -->
              <div style="display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin: 0.25rem 0;">
                <input type="checkbox" id="signup-consent" required style="margin-top: 3px; accent-color: var(--tp-primary); width: 16px; height: 16px;">
                <label for="signup-consent" style="cursor: pointer; line-height: 1.4;">
                  I agree to TechPath's
                  <a href="#/terms" class="tp-link" target="_blank" style="color: #38bdf8;">Terms of Use</a> and
                  <a href="#/legal/privacy" class="tp-link" target="_blank" style="color: #38bdf8;">Privacy Policy</a>.
                </label>
              </div>

              <div class="tp-form-error tp-form-error-main" id="signup-main-err" style="display: none; padding: 0.75rem; border-radius: var(--radius-sm); background: rgba(239, 68, 68, 0.15); border: 1px solid var(--tp-error); color: #fca5a5; font-size: 0.85rem;"></div>

              <button type="submit" id="signup-submit-btn" class="tp-btn tp-btn-primary tp-btn-full" style="padding: 0.85rem; font-size: 1rem; margin-top: 0.5rem; min-height: 46px; font-weight: 600;">
                Create Account →
              </button>
            </form>

            <div style="text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--tp-text-dark-secondary);">
              Already have an account? <a href="#/signin" class="tp-link" style="color: var(--tp-primary); font-weight: 600;">Sign In</a>
            </div>

          </div>

        </div>
      </div>
    `;

    this._attachSignupHandlers(container);
  }

  // ─── Event Handlers: Login ────────────────────────────────────────────────
  static _attachLoginHandlers(container) {
    const mainErr = container.querySelector('#login-main-err');
    const emailEl = container.querySelector('#login-email');
    const pwEl = container.querySelector('#login-password');
    const submitBtn = container.querySelector('#login-submit-btn');
    const form = container.querySelector('#login-form');

    // Password visibility toggle
    container.querySelector('#login-pw-toggle')?.addEventListener('click', () => {
      pwEl.type = pwEl.type === 'password' ? 'text' : 'password';
    });

    // Google Login via Supabase OAuth
    const googleLoginBtn = container.querySelector('#google-login-btn');
    googleLoginBtn?.addEventListener('click', async () => {
      try {
        if (mainErr) { mainErr.style.display = 'none'; mainErr.textContent = ''; }
        googleLoginBtn.disabled = true;
        googleLoginBtn.innerHTML = `
          <div style="width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:tp-spin 0.8s linear infinite;"></div>
          Connecting to Google...
        `;
        await authContext.loginWithGoogle();
      } catch (err) {
        googleLoginBtn.disabled = false;
        googleLoginBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          Continue with Google
        `;
        if (mainErr) {
          mainErr.style.display = 'block';
          mainErr.textContent = err.message || 'Google sign-in was cancelled or could not be reached. Please try again.';
        }
      }
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (mainErr) { mainErr.style.display = 'none'; mainErr.textContent = ''; }
      const email = emailEl.value.trim();
      const pw = pwEl.value;

      if (!email || !pw) {
        if (mainErr) { mainErr.style.display = 'block'; mainErr.textContent = 'Please enter both email and password.'; }
        return;
      }
      await this._doLogin({ email, password: pw }, mainErr, submitBtn);
    });
  }

  static async _doLogin({ email, password }, mainErr, submitBtn) {
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Authenticating...'; }
    CubeLoader.showRouteTransition('Authenticating & Hydrating Profile...');
    try {
      const { user } = await authContext.login({ email, password });
      Toast.success(`Welcome back, ${user.name}!`);

      // Determine destination strictly using persisted onboarding completion status
      const hasCompleted = authContext.hasCompletedOnboarding();
      const target = hasCompleted ? '#/dashboard' : '#/onboarding';

      // Execute short post-login cube fragments reassembly, 360 spin, welcome banner, then launch target
      CubeLoader.playLoginSuccessAnimation(user.name, () => {
        window.location.hash = target;
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      });
    } catch (err) {
      CubeLoader.hideRouteTransition();
      if (mainErr) {
        mainErr.style.display = 'block';
        mainErr.textContent = err.message || 'Authentication failed. Please verify credentials.';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In →';
      }
    }
  }

  // ─── Event Handlers: Signup ───────────────────────────────────────────────
  static _attachSignupHandlers(container) {
    const mainErr = container.querySelector('#signup-main-err');
    const nameEl = container.querySelector('#signup-name');
    const emailEl = container.querySelector('#signup-email');
    const pwEl = container.querySelector('#signup-password');
    const confirmPwEl = container.querySelector('#signup-confirm-password');
    const consentEl = container.querySelector('#signup-consent');
    const submitBtn = container.querySelector('#signup-submit-btn');

    // Google Sign-up via Supabase OAuth
    const googleSignupBtn = container.querySelector('#google-signup-btn');
    googleSignupBtn?.addEventListener('click', async () => {
      try {
        if (mainErr) { mainErr.style.display = 'none'; mainErr.textContent = ''; }
        googleSignupBtn.disabled = true;
        googleSignupBtn.innerHTML = `
          <div style="width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:tp-spin 0.8s linear infinite;"></div>
          Connecting to Google...
        `;
        await authContext.loginWithGoogle();
      } catch (err) {
        googleSignupBtn.disabled = false;
        googleSignupBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          Continue with Google
        `;
        if (mainErr) {
          mainErr.style.display = 'block';
          mainErr.textContent = err.message || 'Google sign-up failed. Please try again.';
        }
      }
    });

    container.querySelector('#signup-pw-toggle')?.addEventListener('click', () => {
      pwEl.type = pwEl.type === 'password' ? 'text' : 'password';
    });

    container.querySelector('#signup-form').addEventListener('submit', async e => {
      e.preventDefault();
      if (mainErr) { mainErr.style.display = 'none'; mainErr.textContent = ''; }

      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const password = pwEl.value;
      const confirmPassword = confirmPwEl.value;
      const consent = consentEl.checked;

      if (!name || !email || !password) {
        mainErr.style.display = 'block';
        mainErr.textContent = 'Please fill out all required fields.';
        return;
      }

      if (password.length < 8) {
        mainErr.style.display = 'block';
        mainErr.textContent = 'Password must be at least 8 characters long.';
        return;
      }

      if (password !== confirmPassword) {
        mainErr.style.display = 'block';
        mainErr.textContent = 'Passwords do not match.';
        return;
      }

      if (!consent) {
        mainErr.style.display = 'block';
        mainErr.textContent = 'You must agree to the Terms of Use and Privacy Policy to continue.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';

      try {
        await authContext.signup({
          name,
          email,
          password,
          consentAccepted: true,
          consentVersion: '1.0'
        });
        Toast.success('Account created! Welcome to TechPath.');

        // Execute short post-login cube fragments reassembly, 360 spin, welcome banner, then launch Onboarding
        CubeLoader.playLoginSuccessAnimation(name, () => {
          window.location.hash = '#/onboarding';
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
      } catch (err) {
        mainErr.style.display = 'block';
        mainErr.textContent = err.message || 'Signup failed. Please check your credentials.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account →';
      }
    });
  }

  // ─── 3. FORGOT PASSWORD ──────────────────────────────────────────────────
  static renderForgotPassword(container) {
    container.innerHTML = `
      <div class="tp-auth-page-wrapper" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem;">
        <div class="tp-card tp-card-glass" style="max-width: 480px; width: 100%; padding: 2.5rem; border-radius: var(--radius-xl);">
          <div class="telemetry-chip" style="margin-bottom: 0.75rem;">CREDENTIAL RECOVERY</div>
          <h1 class="headline-xl" style="color: #fff; margin-bottom: 0.5rem;">Reset Password</h1>
          <p style="color: var(--tp-text-dark-secondary); font-size: 0.92rem; margin-bottom: 1.5rem;">
            Enter your registered email address to receive a secure password recovery link.
          </p>

          <form id="forgot-pw-form" style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="tp-form-group">
              <label class="tp-form-label">Email Address</label>
              <input type="email" id="forgot-email" class="tp-input" placeholder="student@university.edu" required style="min-height: 44px; font-size: 16px;" />
            </div>

            <div id="forgot-status" style="display: none; padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.88rem;"></div>

            <button type="submit" id="forgot-submit-btn" class="tp-btn tp-btn-primary tp-btn-full" style="padding: 0.85rem; font-size: 1rem; min-height: 46px;">
              Send Recovery Link →
            </button>

            <a href="#/signin" class="tp-btn tp-btn-secondary tp-btn-full" style="text-align: center; font-size: 0.9rem; margin-top: 0.5rem;">
              &larr; Back to Sign In
            </a>
          </form>
        </div>
      </div>
    `;

    const form = container.querySelector('#forgot-pw-form');
    const statusBox = container.querySelector('#forgot-status');
    const submitBtn = container.querySelector('#forgot-submit-btn');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = container.querySelector('#forgot-email').value.trim();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        await authContext.forgotPassword(email);
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(16, 185, 129, 0.15)';
        statusBox.style.border = '1px solid var(--tp-success)';
        statusBox.style.color = '#86efac';
        statusBox.textContent = `Password reset instructions have been dispatched to ${email}. Check your inbox.`;
      } catch (err) {
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(239, 68, 68, 0.15)';
        statusBox.style.border = '1px solid var(--tp-error)';
        statusBox.style.color = '#fca5a5';
        statusBox.textContent = err.message || 'Failed to dispatch reset email. Please verify the address.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Recovery Link →';
      }
    });
  }

  // ─── 4. RESET PASSWORD ───────────────────────────────────────────────────
  static renderResetPassword(container) {
    container.innerHTML = `
      <div class="tp-auth-page-wrapper" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem;">
        <div class="tp-card tp-card-glass" style="max-width: 480px; width: 100%; padding: 2.5rem; border-radius: var(--radius-xl);">
          <div class="telemetry-chip" style="margin-bottom: 0.75rem;">SECURITY UPDATE</div>
          <h1 class="headline-xl" style="color: #fff; margin-bottom: 0.5rem;">Set New Password</h1>
          <p style="color: var(--tp-text-dark-secondary); font-size: 0.92rem; margin-bottom: 1.5rem;">
            Create a strong new password for your TechPath account.
          </p>

          <form id="reset-pw-form" style="display: flex; flex-direction: column; gap: 1rem;">
            <div class="tp-form-group">
              <label class="tp-form-label">New Password</label>
              <input type="password" id="reset-new-pw" class="tp-input" placeholder="Min 8 characters" required minlength="8" style="min-height: 44px; font-size: 16px;" />
            </div>

            <div class="tp-form-group">
              <label class="tp-form-label">Confirm New Password</label>
              <input type="password" id="reset-confirm-pw" class="tp-input" placeholder="Re-enter new password" required minlength="8" style="min-height: 44px; font-size: 16px;" />
            </div>

            <div id="reset-status" style="display: none; padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.88rem;"></div>

            <button type="submit" id="reset-submit-btn" class="tp-btn tp-btn-primary tp-btn-full" style="padding: 0.85rem; font-size: 1rem; min-height: 46px;">
              Update Password →
            </button>
          </form>
        </div>
      </div>
    `;

    const form = container.querySelector('#reset-pw-form');
    const statusBox = container.querySelector('#reset-status');
    const submitBtn = container.querySelector('#reset-submit-btn');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const newPw = container.querySelector('#reset-new-pw').value;
      const confirmPw = container.querySelector('#reset-confirm-pw').value;

      if (newPw !== confirmPw) {
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(239, 68, 68, 0.15)';
        statusBox.style.border = '1px solid var(--tp-error)';
        statusBox.style.color = '#fca5a5';
        statusBox.textContent = 'Passwords do not match.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Updating...';

      try {
        await authContext.resetPassword('', '', newPw);
        Toast.success('Password updated successfully! Please sign in.');
        window.location.hash = '#/signin';
      } catch (err) {
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(239, 68, 68, 0.15)';
        statusBox.style.border = '1px solid var(--tp-error)';
        statusBox.style.color = '#fca5a5';
        statusBox.textContent = err.message || 'Password update failed.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Update Password →';
      }
    });
  }

  // ─── 5. ONBOARDING ───────────────────────────────────────────────────────
  static renderOnboarding(container) {
    const profile = authContext.getProfile() || {};
    const curDept = profile.department_id || 'dept_cs';
    const curBranch = profile.branch_id || 'cse';
    const curSpec = profile.specialization_id || profile.specialization || '';
    const curSem = profile.semester_id || 'sem_1';
    const curCareer = profile.career_goal || 'Software Engineer';
    const curLevel = profile.learning_level || 'intermediate';
    const curLang = profile.preferred_language || localStorage.getItem('TP_USER_LANG') || 'en';
    const curBio = profile.bio || profile.description || '';
    let selectedRoles = Array.isArray(profile.career_interests) && profile.career_interests.length > 0 
      ? [...profile.career_interests] 
      : (profile.target_role ? [profile.target_role] : ['Software Engineer']);

    const allDepartments = DEPARTMENTS;
    const initialBranches = TaxonomyEngine.getBranchesByDepartment(curDept);
    const branchesToDisplay = initialBranches.length > 0 ? initialBranches : ALL_BRANCHES;
    const initialSpecs = TaxonomyEngine.getSpecializationsByBranch(curBranch);
    const initialRoles = TaxonomyEngine.getSuggestedRoles(curBranch);

    container.innerHTML = `
      <div class="tp-auth-page-wrapper" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2.5rem 1rem; background: radial-gradient(circle at center, #111522 0%, #07090e 100%);">
        <div class="tp-card tp-card-glass" style="max-width: 760px; width: 100%; padding: 2.5rem; border-radius: var(--radius-xl); box-shadow: var(--shadow-glass); border: 1px solid rgba(255,255,255,0.1);">
          
          <div style="text-align: center; margin-bottom: 2rem;">
            <div class="telemetry-chip" style="margin-bottom: 0.75rem; background: rgba(225, 29, 72, 0.15); border-color: rgba(225, 29, 72, 0.35); color: #fda4af;">
              <span class="pulse-beacon" style="background: #e11d48;"></span> ACADEMIC DOSSIER SETUP
            </div>
            <h1 class="headline-xl" style="color: #fff; margin-bottom: 0.5rem; font-size: 1.85rem;">Configure Academic Profile</h1>
            <p style="color: var(--tp-text-dark-secondary); font-size: 0.95rem; max-width: 580px; margin: 0 auto; line-height: 1.5;">
              Personalize your engineering taxonomy. TechPath isolates your specific branch curriculum, 3D interactive models, and career roadmaps.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">

            <!-- Row 1: Department & Branch -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
              <div class="tp-form-group">
                <label for="ob-dept" class="tp-form-label">1. Academic Department *</label>
                <select id="ob-dept" class="tp-input" style="min-height: 44px; font-size: 15px;">
                  ${allDepartments.map(d => `<option value="${d.id}" ${d.id === curDept ? 'selected' : ''}>${d.name} (${d.code})</option>`).join('')}
                </select>
              </div>

              <div class="tp-form-group">
                <label for="ob-branch" class="tp-form-label">2. Discipline / Branch *</label>
                <select id="ob-branch" class="tp-input" style="min-height: 44px; font-size: 15px;">
                  ${branchesToDisplay.map(b => `<option value="${b.id}" ${b.id === curBranch ? 'selected' : ''}>${b.name} (${b.code})</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Row 2: Specialization & Semester -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
              <div class="tp-form-group">
                <label for="ob-specialization" class="tp-form-label">3. Core Specialization</label>
                <select id="ob-specialization" class="tp-input" style="min-height: 44px; font-size: 15px;">
                  <option value="General Systems Track">General Systems Track</option>
                  ${initialSpecs.map(s => `<option value="${s.name}" ${s.name === curSpec || s.id === curSpec ? 'selected' : ''}>${s.name}</option>`).join('')}
                </select>
              </div>

              <div class="tp-form-group">
                <label for="ob-semester" class="tp-form-label">4. Academic Semester / Year *</label>
                <select id="ob-semester" class="tp-input" style="min-height: 44px; font-size: 15px;">
                  ${APP_CONFIG.semesters.map(s => `<option value="${s.id}" ${s.id === curSem ? 'selected' : ''}>${s.name} (Year ${s.year})</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Row 3: Career Goal & Learning Level -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
              <div class="tp-form-group">
                <label for="ob-career" class="tp-form-label">5. Target Career Goal *</label>
                <input type="text" id="ob-career" class="tp-input" value="${curCareer}" placeholder="e.g. Software Engineer, Robotics Specialist" list="ob-career-list" style="min-height: 44px; font-size: 15px;" />
                <datalist id="ob-career-list">
                  ${TaxonomyEngine.getAllCareerRoles().map(r => `<option value="${r}"></option>`).join('')}
                </datalist>
              </div>

              <div class="tp-form-group">
                <label for="ob-level" class="tp-form-label">6. Technical Learning Level *</label>
                <select id="ob-level" class="tp-input" style="min-height: 44px; font-size: 15px;">
                  <option value="beginner" ${curLevel === 'beginner' ? 'selected' : ''}>Beginner (First Principles & Core Basics)</option>
                  <option value="intermediate" ${curLevel === 'intermediate' ? 'selected' : ''}>Intermediate (Systems & Algorithmic Design)</option>
                  <option value="advanced" ${curLevel === 'advanced' ? 'selected' : ''}>Advanced (Production Systems & Interview Mastery)</option>
                </select>
              </div>
            </div>

            <!-- Row 4: Preferred Roles Interactive Chips -->
            <div class="tp-form-group">
              <label class="tp-form-label">7. Preferred Career Roles (Select all that apply)</label>
              <div id="ob-roles-container" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.35rem;">
                ${initialRoles.map(role => {
                  const isSelected = selectedRoles.includes(role);
                  return `
                    <button type="button" class="ob-role-chip tp-btn tp-btn-sm" data-role="${role}" style="border-radius: 999px; font-size: 0.8rem; padding: 0.35rem 0.85rem; border: 1px solid ${isSelected ? 'var(--tp-primary)' : 'rgba(255,255,255,0.15)'}; background: ${isSelected ? 'var(--tp-primary)' : 'rgba(255,255,255,0.05)'}; color: #fff; cursor: pointer; transition: all 0.2s ease;">
                      ${isSelected ? '✓ ' : '+ '}${role}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Row 5: Primary Language -->
            <div class="tp-form-group">
              <label for="ob-language" class="tp-form-label">8. Preferred Learning Language *</label>
              <select id="ob-language" class="tp-input" style="min-height: 44px; font-size: 15px;">
                ${APP_CONFIG.languages.map(l => `<option value="${l.code}" ${l.code === curLang ? 'selected' : ''}>${l.name}</option>`).join('')}
              </select>
            </div>

            <!-- Row 6: Bio / Overview -->
            <div class="tp-form-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label for="ob-bio" class="tp-form-label" style="margin-bottom: 0;">9. Student Bio & Peer Overview *</label>
                <span id="ob-bio-counter" style="font-size: 0.78rem; color: #94a3b8; font-family: monospace;">${curBio.length}/250</span>
              </div>
              <textarea id="ob-bio" class="tp-input" rows="3" maxlength="250" placeholder="e.g. 2nd-year CSE student focused on scalable cloud backend, algorithms, and distributed systems." required style="resize: vertical; font-family: inherit; font-size: 15px;">${curBio}</textarea>
              <p style="font-size: 0.76rem; color: var(--tp-text-dark-secondary); margin-top: 0.3rem;">
                Displayed on your verified TechPath engineering profile and peer collaboration spaces.
              </p>
            </div>

            <div id="ob-err" style="display: none; padding: 0.75rem; border-radius: var(--radius-sm); background: rgba(239, 68, 68, 0.15); border: 1px solid var(--tp-error); color: #fca5a5; font-size: 0.88rem;"></div>

            <button id="ob-complete-btn" class="tp-btn tp-btn-primary tp-btn-full" style="padding: 0.9rem; font-size: 1.05rem; margin-top: 0.75rem; min-height: 48px; font-weight: 700; letter-spacing: 0.02em;">
              Save Profile & Launch Command Dashboard →
            </button>
          </div>

        </div>
      </div>
    `;

    const deptSel = container.querySelector('#ob-dept');
    const branchSel = container.querySelector('#ob-branch');
    const specSel = container.querySelector('#ob-specialization');
    const semSel = container.querySelector('#ob-semester');
    const careerInput = container.querySelector('#ob-career');
    const levelSel = container.querySelector('#ob-level');
    const langSel = container.querySelector('#ob-language');
    const bioInput = container.querySelector('#ob-bio');
    const bioCounter = container.querySelector('#ob-bio-counter');
    const rolesContainer = container.querySelector('#ob-roles-container');
    const btn = container.querySelector('#ob-complete-btn');
    const errBox = container.querySelector('#ob-err');

    // 1. Update branches when department changes
    deptSel?.addEventListener('change', () => {
      const deptId = deptSel.value;
      const branches = TaxonomyEngine.getBranchesByDepartment(deptId);
      const list = branches.length > 0 ? branches : ALL_BRANCHES;
      branchSel.innerHTML = list.map(b => `<option value="${b.id}">${b.name} (${b.code})</option>`).join('');
      updateSpecsAndRoles(branchSel.value);
    });

    // 2. Update specs and roles when branch changes
    branchSel?.addEventListener('change', () => {
      updateSpecsAndRoles(branchSel.value);
    });

    function updateSpecsAndRoles(bId) {
      const specs = TaxonomyEngine.getSpecializationsByBranch(bId);
      specSel.innerHTML = `
        <option value="General Systems Track">General Systems Track</option>
        ${specs.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
      `;

      const roles = TaxonomyEngine.getSuggestedRoles(bId);
      rolesContainer.innerHTML = roles.map(role => {
        const isSelected = selectedRoles.includes(role);
        return `
          <button type="button" class="ob-role-chip tp-btn tp-btn-sm" data-role="${role}" style="border-radius: 999px; font-size: 0.8rem; padding: 0.35rem 0.85rem; border: 1px solid ${isSelected ? 'var(--tp-primary)' : 'rgba(255,255,255,0.15)'}; background: ${isSelected ? 'var(--tp-primary)' : 'rgba(255,255,255,0.05)'}; color: #fff; cursor: pointer; transition: all 0.2s ease;">
            ${isSelected ? '✓ ' : '+ '}${role}
          </button>
        `;
      }).join('');
      attachRoleChipListeners();
    }

    // 3. Toggle roles chips
    function attachRoleChipListeners() {
      rolesContainer?.querySelectorAll('.ob-role-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const role = chip.getAttribute('data-role');
          if (selectedRoles.includes(role)) {
            selectedRoles = selectedRoles.filter(r => r !== role);
            chip.style.borderColor = 'rgba(255,255,255,0.15)';
            chip.style.background = 'rgba(255,255,255,0.05)';
            chip.textContent = `+ ${role}`;
          } else {
            selectedRoles.push(role);
            chip.style.borderColor = 'var(--tp-primary)';
            chip.style.background = 'var(--tp-primary)';
            chip.textContent = `✓ ${role}`;
          }
        });
      });
    }
    attachRoleChipListeners();

    // 4. Bio character counter
    bioInput?.addEventListener('input', () => {
      bioCounter.textContent = `${bioInput.value.length}/250`;
    });

    // 5. Submit onboarding
    btn?.addEventListener('click', async () => {
      const deptId = deptSel.value;
      const branchId = branchSel.value;
      const specName = specSel.value;
      const semId = semSel.value;
      const career = careerInput.value.trim();
      const level = levelSel.value;
      const lang = langSel.value;
      const bioText = (bioInput.value || '').trim();

      if (!deptId || !branchId || !semId) {
        errBox.style.display = 'block';
        errBox.textContent = 'Please select your department, discipline/branch, and academic semester.';
        return;
      }

      if (!career) {
        errBox.style.display = 'block';
        errBox.textContent = 'Please specify your primary career goal / target role.';
        return;
      }

      if (!bioText) {
        errBox.style.display = 'block';
        errBox.textContent = 'Please write a brief student overview (bio) to introduce yourself to your peers.';
        return;
      }

      errBox.style.display = 'none';
      btn.disabled = true;
      btn.textContent = 'Saving Profile & Launching Dashboard...';
      CubeLoader.showRouteTransition('Saving Profile & Configuring Dashboard...');

      try {
        const semNum = parseInt(semId.replace('sem_', ''), 10) || 1;
        const year = Math.ceil(semNum / 2) || 1;

        await authContext.completeOnboarding({
          department_id: deptId,
          branch_id: branchId,
          specialization_id: specName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          specialization: specName,
          semester_id: semId,
          year,
          career_goal: career,
          target_role: career,
          career_interests: selectedRoles.length > 0 ? selectedRoles : [career],
          learning_level: level,
          preferred_language: lang,
          bio: bioText,
          description: bioText
        });

        await learningContext.setBranch(branchId);
        await learningContext.setSemester(semId);
        learningContext.update({
          career_goal: career,
          preferred_language: lang,
          bio: bioText
        });
        localStorage.setItem('TP_USER_LANG', lang);

        Toast.success('Profile configured! Welcome to TechPath 🎉');

        const user = authContext.getUser();
        CubeLoader.playLoginSuccessAnimation(user?.name || 'Engineer', () => {
          window.location.hash = '#/dashboard';
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
      } catch (err) {
        CubeLoader.hideRouteTransition();
        btn.disabled = false;
        btn.textContent = 'Save Profile & Launch Command Dashboard →';
        errBox.style.display = 'block';
        errBox.textContent = err.message || 'Setup failed. Please try again.';
      }
    });
  }
}
