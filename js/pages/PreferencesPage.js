/**
 * TECHPATH — PREFERENCES & CUSTOMIZATION STUDIO
 * Learning, Career, AI Configuration, 51-Language Switching,
 * Appearance (Dark/Light, Font Size, Reduced Motion), Notifications & Privacy.
 */

import { learningContext } from '../context/LearningContext.js';
import { authContext } from '../context/AuthContext.js';
import { dbStore } from '../db/store.js';
import { I18nEngine } from '../services/I18nEngine.js';
import { Toast } from '../components/Toast.js';
import { ConnectEngine } from '../services/ConnectEngine.js';
import { supabase } from '../lib/supabase.js';

export class PreferencesPage {
  static async render(container) {
    const ctx = learningContext.get();
    const user = authContext.getUser();

    // Stored preferences
    const defaultPrefs = {
      // Learning
      learning_level: ctx.learning_level || 'intermediate',
      study_duration: 45, // mins
      revision_preference: 'spaced', // 'spaced' | 'daily' | 'weekly'
      difficulty_pref: 'adaptive', // 'adaptive' | 'rigorous' | 'foundational'
      video_autoplay: true,
      project_difficulty: 'intermediate',
      // Career
      career_goal: ctx.career_goal || 'Software Engineer',
      target_roles: 'Full-Stack Developer, Systems Architect',
      preferred_industries: 'Software, Aerospace, Robotics, Automotive',
      internship_pref: 'remote_or_hybrid',
      // AI Settings (Real settings for our Gemini AI Doubt Solver & PDF Studio)
      ai_explanation_depth: 'step_by_step', // 'step_by_step' | 'detailed' | 'simple' | 'exam'
      ai_code_language: 'cpp', // 'cpp' | 'python' | 'java' | 'c'
      ai_code_comments: true,
      // Appearance
      theme: localStorage.getItem('TP_THEME') || 'dark', // 'dark' | 'light' | 'system'
      font_size: localStorage.getItem('TP_FONT_SIZE') || 'normal', // 'compact' | 'normal' | 'large'
      reduced_motion: localStorage.getItem('TP_REDUCED_MOTION') === 'true',
      high_contrast: localStorage.getItem('TP_HIGH_CONTRAST') === 'true',
      // Notifications
      notify_learning_reminders: true,
      notify_quiz: true,
      notify_projects: true,
      notify_career: true,
      notify_internships: true,
      notify_achievements: true,
      notify_support: true,
      // Privacy & Analytics
      analytics_enabled: true,
      essential_cookies_only: false,
      // Social & Connect Privacy
      social_visibility: 'department', // 'everyone' | 'department' | 'friends'
      social_allow_requests: 'department', // 'everyone' | 'department' | 'nobody'
      social_show_online: true,
      social_show_academic: true,
      social_show_skills: true,
      social_discoverable: true
    };

    let userSocialPrefs = {};
    let sbProfile = null;
    if (user?.id) {
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
        if (data) sbProfile = data;
      } catch { /* proceed */ }

      try {
        userSocialPrefs = await ConnectEngine.getSocialPreferences(user.id) || {};
      } catch { /* proceed */ }
    }

    const savedPrefs = JSON.parse(localStorage.getItem('TP_USER_PREFERENCES') || '{}');
    const sbPrefs = sbProfile?.learning_preferences || {};
    const prefs = {
      ...defaultPrefs,
      ...savedPrefs,
      ...sbPrefs,
      ...userSocialPrefs,
      ...(sbProfile?.learning_level ? { learning_level: sbProfile.learning_level } : {}),
      ...(sbProfile?.career_goal ? { career_goal: sbProfile.career_goal } : {}),
      ...(sbProfile?.target_role ? { target_roles: sbProfile.target_role } : {}),
      ...(sbProfile?.preferred_language ? { platform_language: sbProfile.preferred_language } : {})
    };
    const currentLang = sbProfile?.preferred_language || I18nEngine.getCurrentLanguage() || 'en';

    container.innerHTML = `
      <div class="tp-page" style="display: flex; flex-direction: column; gap: 2rem; max-width: 960px; width: 100%;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
              SYSTEM TELEMETRY // USER CONFIGURATION & PREFERENCES
            </div>
            <h1 class="display-lg">Settings & Preferences</h1>
            <p style="color: var(--tp-text-dark-secondary); max-width: 700px;">
              Personalize your curriculum pacing, real AI code studio settings, 51-language localization, and visual accessibility.
            </p>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem;">
          <a href="#/profile" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1.1rem;">
            👤 Profile
          </a>
          <a href="#/security" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1.1rem;">
            🛡️ Security Center
          </a>
          <a href="#/preferences" class="tp-btn tp-btn-primary" style="font-size: 0.85rem; padding: 0.4rem 1.1rem;">
            🎛️ Preferences
          </a>
        </div>

        <!-- Preferences Form -->
        <form id="preferences-master-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- 1. Learning Preferences -->
          <div class="tp-card">
            <h3 class="headline-md" style="margin-bottom: 0.35rem; color: #fff;">1. Learning Preferences</h3>
            <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin-bottom: 1.25rem;">Fine-tune your cognitive load, study session intervals, and project complexity.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
              <div>
                <label class="tp-form-label">Learning Level</label>
                <select id="pref-learning-level" class="tp-input">
                  <option value="beginner" ${prefs.learning_level === 'beginner' ? 'selected' : ''}>Beginner (Foundations & Core Principles)</option>
                  <option value="intermediate" ${prefs.learning_level === 'intermediate' ? 'selected' : ''}>Intermediate (Standard Degree Curriculum)</option>
                  <option value="advanced" ${prefs.learning_level === 'advanced' ? 'selected' : ''}>Advanced (Rigorous & Capstone Level)</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Preferred Daily Study Session</label>
                <select id="pref-study-duration" class="tp-input">
                  <option value="25" ${prefs.study_duration == 25 ? 'selected' : ''}>25 Minutes (Pomodoro)</option>
                  <option value="45" ${prefs.study_duration == 45 ? 'selected' : ''}>45 Minutes (Optimal Focus)</option>
                  <option value="60" ${prefs.study_duration == 60 ? 'selected' : ''}>60 Minutes (Deep Work)</option>
                  <option value="90" ${prefs.study_duration == 90 ? 'selected' : ''}>90 Minutes (Exhaustive Block)</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Revision Strategy</label>
                <select id="pref-revision-pref" class="tp-input">
                  <option value="spaced" ${prefs.revision_preference === 'spaced' ? 'selected' : ''}>Spaced Repetition (Ebbinghaus Curve)</option>
                  <option value="daily" ${prefs.revision_preference === 'daily' ? 'selected' : ''}>Daily End-of-Day Quick Drills</option>
                  <option value="weekly" ${prefs.revision_preference === 'weekly' ? 'selected' : ''}>Weekly Comprehensive Mock Exams</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Project Difficulty Calibration</label>
                <select id="pref-project-difficulty" class="tp-input">
                  <option value="intermediate" ${prefs.project_difficulty === 'intermediate' ? 'selected' : ''}>Guided Industry Implementations</option>
                  <option value="advanced" ${prefs.project_difficulty === 'advanced' ? 'selected' : ''}>Production-Ready Scalable Systems</option>
                  <option value="foundational" ${prefs.project_difficulty === 'foundational' ? 'selected' : ''}>Foundational Architectural Prototyping</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 2. Career Preferences -->
          <div class="tp-card">
            <h3 class="headline-md" style="margin-bottom: 0.35rem; color: #fff;">2. Career & Industry Preferences</h3>
            <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin-bottom: 1.25rem;">Aligns your Mock Interview questions, resume suggestions, and internship matches.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
              <div>
                <label class="tp-form-label">Primary Career Goal</label>
                <input type="text" id="pref-career-goal" class="tp-input" value="${prefs.career_goal}" placeholder="e.g. Embedded Systems Lead, Robotics Engineer" />
              </div>

              <div>
                <label class="tp-form-label">Target Technical Roles</label>
                <input type="text" id="pref-target-roles" class="tp-input" value="${prefs.target_roles}" placeholder="e.g. Systems Engineer, Firmware Dev" />
              </div>

              <div>
                <label class="tp-form-label">Preferred Industries</label>
                <input type="text" id="pref-industries" class="tp-input" value="${prefs.preferred_industries}" placeholder="e.g. Aerospace, Automotive, AI" />
              </div>

              <div>
                <label class="tp-form-label">Internship Modality</label>
                <select id="pref-internship-pref" class="tp-input">
                  <option value="remote_or_hybrid" ${prefs.internship_pref === 'remote_or_hybrid' ? 'selected' : ''}>Hybrid / Remote Friendly</option>
                  <option value="onsite" ${prefs.internship_pref === 'onsite' ? 'selected' : ''}>On-Site Laboratory & Office</option>
                  <option value="research" ${prefs.internship_pref === 'research' ? 'selected' : ''}>Academic Research Fellowships</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 3. AI Studio Preferences -->
          <div class="tp-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <h3 class="headline-md" style="color: #fff;">3. AI Doubt Solver & PDF Engine Preferences</h3>
              <span class="mono-chip" style="color: var(--tp-primary);">GEMINI 1.5 PROXY</span>
            </div>
            <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin-bottom: 1.25rem;">Controls code generation syntax and mathematical derivation verbosity.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
              <div>
                <label class="tp-form-label">Default Programming Language</label>
                <select id="pref-ai-lang" class="tp-input">
                  <option value="cpp" ${prefs.ai_code_language === 'cpp' ? 'selected' : ''}>C++ (Modern C++17 / C++20)</option>
                  <option value="python" ${prefs.ai_code_language === 'python' ? 'selected' : ''}>Python (CPython 3.11+)</option>
                  <option value="java" ${prefs.ai_code_language === 'java' ? 'selected' : ''}>Java (OpenJDK 17 / 21)</option>
                  <option value="c" ${prefs.ai_code_language === 'c' ? 'selected' : ''}>C (ISO C99 / C11)</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Explanation Depth Default</label>
                <select id="pref-ai-depth" class="tp-input">
                  <option value="step_by_step" ${prefs.ai_explanation_depth === 'step_by_step' ? 'selected' : ''}>Step-by-Step Derivation</option>
                  <option value="detailed" ${prefs.ai_explanation_depth === 'detailed' ? 'selected' : ''}>Detailed Technical</option>
                  <option value="simple" ${prefs.ai_explanation_depth === 'simple' ? 'selected' : ''}>Intuitive Simple</option>
                  <option value="exam" ${prefs.ai_explanation_depth === 'exam' ? 'selected' : ''}>Exam Mode (IEEE / IS Standards)</option>
                </select>
              </div>

              <div style="display: flex; align-items: center; gap: 0.75rem; margin-top: 1.5rem;">
                <input type="checkbox" id="pref-ai-comments" ${prefs.ai_code_comments ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--tp-primary);" />
                <label for="pref-ai-comments" style="font-size: 0.88rem; color: #fff; cursor: pointer;">
                  Include comprehensive inline code comments for algorithmic complexity
                </label>
              </div>
            </div>
          </div>

          <!-- 4. Language & Localization -->
          <div class="tp-card">
            <h3 class="headline-md" style="margin-bottom: 0.35rem; color: #fff;">4. Language & Localization (51 Languages)</h3>
            <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin-bottom: 1.25rem;">Switch language instantly across the entire website with bidirectional RTL support.</p>

            <div style="max-width: 400px;">
              <label class="tp-form-label">Active Platform Language</label>
              <select id="pref-platform-lang" class="tp-input">
                ${I18nEngine.getAllLanguages().map(l => `
                  <option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>
                    ${l.nativeName} (${l.name})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- 5. Appearance & Accessibility -->
          <div class="tp-card">
            <h3 class="headline-md" style="margin-bottom: 0.35rem; color: #fff;">5. Appearance & Accessibility</h3>
            <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin-bottom: 1.25rem;">Theme customization, typography scaling, and motor/vestibular accommodations.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
              <div>
                <label class="tp-form-label">Theme Mode</label>
                <select id="pref-theme" class="tp-input">
                  <option value="dark" ${prefs.theme === 'dark' ? 'selected' : ''}>Obsidian Dark (Engineering Studio)</option>
                  <option value="light" ${prefs.theme === 'light' ? 'selected' : ''}>Clean Light (High Luminance)</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Font Scale</label>
                <select id="pref-font-size" class="tp-input">
                  <option value="compact" ${prefs.font_size === 'compact' ? 'selected' : ''}>Compact (Information Dense)</option>
                  <option value="normal" ${prefs.font_size === 'normal' ? 'selected' : ''}>Standard (Default)</option>
                  <option value="large" ${prefs.font_size === 'large' ? 'selected' : ''}>Large (High Readability)</option>
                </select>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.75rem; grid-column: 1 / -1;">
                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                  <input type="checkbox" id="pref-reduced-motion" ${prefs.reduced_motion ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--tp-primary);" />
                  <span style="font-size: 0.88rem; color: #fff;">Reduced Motion (Suppresses 3D cube rotations & transition pulses)</span>
                </label>

                <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                  <input type="checkbox" id="pref-high-contrast" ${prefs.high_contrast ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--tp-primary);" />
                  <span style="font-size: 0.88rem; color: #fff;">High Contrast Borders (Enhances boundary separation for low-vision)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- 6. Notifications Telemetry -->
          <div class="tp-card">
            <h3 class="headline-md" style="margin-bottom: 0.35rem; color: #fff;">6. Notification Preferences</h3>
            <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin-bottom: 1.25rem;">Control what alerts and study nudges you receive.</p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                <input type="checkbox" id="pref-notif-reminders" ${prefs.notify_learning_reminders ? 'checked' : ''} style="accent-color: var(--tp-primary);" />
                <span style="font-size: 0.85rem; color: #fff;">Study Session Daily Reminders</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                <input type="checkbox" id="pref-notif-quiz" ${prefs.notify_quiz ? 'checked' : ''} style="accent-color: var(--tp-primary);" />
                <span style="font-size: 0.85rem; color: #fff;">Quiz & Retention Drill Notifications</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                <input type="checkbox" id="pref-notif-projects" ${prefs.notify_projects ? 'checked' : ''} style="accent-color: var(--tp-primary);" />
                <span style="font-size: 0.85rem; color: #fff;">Project Milestone Updates</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                <input type="checkbox" id="pref-notif-internships" ${prefs.notify_internships ? 'checked' : ''} style="accent-color: var(--tp-primary);" />
                <span style="font-size: 0.85rem; color: #fff;">New Branch Internship Matches</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                <input type="checkbox" id="pref-notif-achievements" ${prefs.notify_achievements ? 'checked' : ''} style="accent-color: var(--tp-primary);" />
                <span style="font-size: 0.85rem; color: #fff;">Badges & Academic Achievements</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                <input type="checkbox" id="pref-notif-support" ${prefs.notify_support ? 'checked' : ''} style="accent-color: var(--tp-primary);" />
                <span style="font-size: 0.85rem; color: #fff;">Faculty & Support Ticket Updates</span>
              </label>
            </div>
          </div>

          <!-- 7. TechPath Connect & Social Privacy Controls -->
          <div class="tp-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <h3 class="headline-md" style="color: #fff;">7. TechPath Connect & Social Privacy</h3>
              <span class="mono-chip" style="color: #a855f7;">CONNECT PRIVACY</span>
            </div>
            <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin-bottom: 1.25rem;">
              Manage your visibility across engineering departments, who can send peer requests, and public dossier exposure.
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
              <div>
                <label class="tp-form-label">Profile Visibility</label>
                <select id="pref-social-visibility" class="tp-input">
                  <option value="department" ${prefs.social_visibility === 'department' ? 'selected' : ''}>Department Only (Recommended)</option>
                  <option value="everyone" ${prefs.social_visibility === 'everyone' ? 'selected' : ''}>Public (All Engineering Disciplines)</option>
                  <option value="friends" ${prefs.social_visibility === 'friends' ? 'selected' : ''}>Friends Only</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Allow Friend Requests From</label>
                <select id="pref-social-requests" class="tp-input">
                  <option value="department" ${prefs.social_allow_requests === 'department' ? 'selected' : ''}>Department Students Only</option>
                  <option value="everyone" ${prefs.social_allow_requests === 'everyone' ? 'selected' : ''}>All Engineering Students</option>
                  <option value="nobody" ${prefs.social_allow_requests === 'nobody' ? 'selected' : ''}>Nobody (Pause Incoming)</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
              <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                <input type="checkbox" id="pref-social-discoverable" ${prefs.social_discoverable !== false ? 'checked' : ''} style="accent-color: #a855f7;" />
                <span style="font-size: 0.85rem; color: #fff;">Discoverable in TechPath Connect Search</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                <input type="checkbox" id="pref-social-online" ${prefs.social_show_online !== false ? 'checked' : ''} style="accent-color: #a855f7;" />
                <span style="font-size: 0.85rem; color: #fff;">Show Active / Online Presence</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                <input type="checkbox" id="pref-social-academic" ${prefs.social_show_academic !== false ? 'checked' : ''} style="accent-color: #a855f7;" />
                <span style="font-size: 0.85rem; color: #fff;">Show Branch & Semester on Peer Cards</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer;">
                <input type="checkbox" id="pref-social-skills" ${prefs.social_show_skills !== false ? 'checked' : ''} style="accent-color: #a855f7;" />
                <span style="font-size: 0.85rem; color: #fff;">Show Verified Engineering Skills</span>
              </label>
            </div>
          </div>

          <!-- 8. Cookie Preferences & Statutory Privacy Governance -->
          <div class="tp-card" id="cookie-preferences-card" style="scroll-margin-top: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <h3 class="headline-md" style="color: #fff;">8. Cookie & Statutory Privacy Governance</h3>
              <span class="mono-chip" style="color: var(--tp-primary);">LEGAL COMPLIANCE</span>
            </div>
            <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin-bottom: 1.25rem;">
              Configure cookie consent telemetry and review our consolidated statutory policies.
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
              <div style="padding: 1rem; border-radius: var(--radius-md); background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <strong style="color: #fff; font-size: 0.9rem;">Essential Platform Cookies</strong>
                  <span class="telemetry-chip" style="color: var(--tp-success); border-color: var(--tp-success);">REQUIRED</span>
                </div>
                <p style="font-size: 0.78rem; color: var(--tp-text-dark-muted); margin: 0;">
                  Preserves session authentication, cryptographic tokens, and curriculum isolation. Cannot be disabled.
                </p>
              </div>

              <div style="padding: 1rem; border-radius: var(--radius-md); background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                  <strong style="color: #fff; font-size: 0.9rem;">Performance & Analytics Telemetry</strong>
                  <input type="checkbox" id="pref-analytics-enabled" ${prefs.analytics_enabled !== false ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 16px; height: 16px;" />
                </div>
                <p style="font-size: 0.78rem; color: var(--tp-text-dark-muted); margin: 0;">
                  Anonymous study duration metrics to assist in pacing algorithmic engineering drills.
                </p>
              </div>
            </div>

            <!-- Visible Terms of Use & Privacy Links -->
            <div style="padding: 1rem; border-radius: var(--radius-md); background: rgba(225,29,72,0.06); border: 1px solid rgba(225,29,72,0.2); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div>
                <strong style="color: #fff; font-size: 0.88rem;">Official Statutory Agreements</strong>
                <p style="font-size: 0.78rem; color: var(--tp-text-dark-secondary); margin: 0.2rem 0 0 0;">
                  By utilizing TechPath, you agree to our 24-section consolidated Terms of Use and student privacy protections.
                </p>
              </div>
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <a href="#/terms" class="tp-btn tp-btn-secondary tp-btn-sm" style="color: #fff; text-decoration: none;">
                  📜 Terms of Use
                </a>
                <a href="#/legal/privacy" class="tp-btn tp-btn-ghost tp-btn-sm" style="text-decoration: none;">
                  🛡️ Privacy Policy
                </a>
              </div>
            </div>
          </div>

          <!-- Save Button Bar -->
          <div style="display: flex; justify-content: flex-end; gap: 1rem; align-items: center; position: sticky; bottom: 1rem; z-index: 20; background: rgba(11,13,18,0.9); padding: 1rem; border: 1px solid var(--tp-border-dark); border-radius: var(--radius-md); backdrop-filter: blur(8px);">
            <button type="submit" id="save-all-prefs-btn" class="tp-btn tp-btn-primary" style="padding: 0.75rem 2rem; font-size: 0.95rem; font-weight: 600;">
              Save & Apply Preferences
            </button>
          </div>
        </form>
      </div>
    `;

    this._bindEvents(container, user);
  }

  static _bindEvents(container, user) {
    // Form submit
    const form = container.querySelector('#preferences-master-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Gather values
        const updated = {
          learning_level: container.querySelector('#pref-learning-level').value,
          study_duration: parseInt(container.querySelector('#pref-study-duration').value, 10),
          revision_preference: container.querySelector('#pref-revision-pref').value,
          project_difficulty: container.querySelector('#pref-project-difficulty').value,
          career_goal: container.querySelector('#pref-career-goal').value,
          target_roles: container.querySelector('#pref-target-roles').value,
          preferred_industries: container.querySelector('#pref-industries').value,
          internship_pref: container.querySelector('#pref-internship-pref').value,
          ai_code_language: container.querySelector('#pref-ai-lang').value,
          ai_explanation_depth: container.querySelector('#pref-ai-depth').value,
          ai_code_comments: container.querySelector('#pref-ai-comments').checked,
          theme: container.querySelector('#pref-theme').value,
          font_size: container.querySelector('#pref-font-size').value,
          reduced_motion: container.querySelector('#pref-reduced-motion').checked,
          high_contrast: container.querySelector('#pref-high-contrast').checked,
          notify_learning_reminders: container.querySelector('#pref-notif-reminders').checked,
          notify_quiz: container.querySelector('#pref-notif-quiz').checked,
          notify_projects: container.querySelector('#pref-notif-projects').checked,
          notify_internships: container.querySelector('#pref-notif-internships').checked,
          notify_achievements: container.querySelector('#pref-notif-achievements').checked,
          notify_support: container.querySelector('#pref-notif-support').checked,
          social_visibility: container.querySelector('#pref-social-visibility').value,
          social_allow_requests: container.querySelector('#pref-social-requests').value,
          social_discoverable: container.querySelector('#pref-social-discoverable').checked,
          social_show_online: container.querySelector('#pref-social-online').checked,
          social_show_academic: container.querySelector('#pref-social-academic').checked,
          social_show_skills: container.querySelector('#pref-social-skills').checked,
          analytics_enabled: container.querySelector('#pref-analytics-enabled')?.checked ?? true
        };

        // 2. Persist
        localStorage.setItem('TP_USER_PREFERENCES', JSON.stringify(updated));
        localStorage.setItem('TP_THEME', updated.theme);
        localStorage.setItem('TP_FONT_SIZE', updated.font_size);
        localStorage.setItem('TP_REDUCED_MOTION', String(updated.reduced_motion));
        localStorage.setItem('TP_HIGH_CONTRAST', String(updated.high_contrast));

        if (user?.id) {
          try {
            const prefRecord = {
              id: `pref_${user.id}`,
              user_id: user.id,
              settings: updated,
              updated_at: new Date().toISOString()
            };
            const existing = await dbStore.getById('preferences', prefRecord.id);
            if (existing) {
              await dbStore.update('preferences', prefRecord.id, prefRecord);
            } else {
              await dbStore.insert('preferences', prefRecord);
            }

            // Persist directly to Supabase profiles table for authenticated user ownership
            try {
              await supabase.from('profiles').update({
                preferred_language: newLang,
                learning_level: updated.learning_level,
                career_goal: updated.career_goal,
                target_role: updated.target_roles || updated.career_goal,
                learning_preferences: updated,
                updated_at: new Date().toISOString()
              }).eq('id', user.id);
            } catch (sbErr) {
              console.warn('[Supabase Preferences Update Note]:', sbErr.message);
            }

            await ConnectEngine.saveSocialPreferences(user.id, {
              profile_visibility: updated.social_visibility,
              allow_requests: updated.social_allow_requests,
              discoverable: updated.social_discoverable,
              show_online: updated.social_show_online,
              show_academic: updated.social_show_academic,
              show_skills: updated.social_show_skills
            });

            await authContext.updateProfile({
              preferred_language: newLang,
              learning_level: updated.learning_level,
              career_goal: updated.career_goal,
              target_role: updated.target_roles || updated.career_goal,
              learning_preferences: updated
            });
          } catch (err) {
            console.warn('Preferences save notice:', err.message);
          }
        }

        // 3. Apply visual updates immediately
        if (updated.theme === 'light') {
          document.body.classList.add('light-theme');
        } else {
          document.body.classList.remove('light-theme');
        }

        if (updated.font_size === 'large') {
          document.documentElement.style.fontSize = '18px';
        } else if (updated.font_size === 'compact') {
          document.documentElement.style.fontSize = '14px';
        } else {
          document.documentElement.style.fontSize = '16px';
        }

        if (updated.high_contrast) {
          document.body.classList.add('high-contrast-mode');
        } else {
          document.body.classList.remove('high-contrast-mode');
        }

        // 4. Update language if changed
        const newLang = container.querySelector('#pref-platform-lang').value;
        if (newLang !== I18nEngine.getCurrentLanguage()) {
          I18nEngine.setLanguage(newLang);
        }

        // 5. Synchronize learningContext
        learningContext.update({
          learning_level: updated.learning_level,
          career_goal: updated.career_goal,
          target_role: updated.target_roles || updated.career_goal,
          preferred_language: newLang
        });
        learningContext.setLanguage(newLang);

        Toast.success('Preferences saved and applied immediately across TechPath!');
      });
    }

    // Live theme preview
    const themeSelect = container.querySelector('#pref-theme');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'light') {
          document.body.classList.add('light-theme');
        } else {
          document.body.classList.remove('light-theme');
        }
      });
    }

    // Auto-scroll to cookies tab if URL contains tab=cookies
    if (window.location.hash.includes('cookies') || window.location.search.includes('cookies')) {
      setTimeout(() => {
        const cookieCard = container.querySelector('#cookie-preferences-card');
        if (cookieCard) cookieCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }
}
