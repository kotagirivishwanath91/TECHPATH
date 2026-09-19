/**
 * TECHPATH — SETTINGS PAGE
 * Dedicated configuration center featuring 8 functional sections:
 * 1. Account Settings (Email, Full Name, Phone, Academic Profile Link)
 * 2. Privacy Settings (Profile Visibility, Chat Requests, Online Status)
 * 3. Notification Settings (Class Reminders, Chat Alerts, Exam Alerts)
 * 4. Appearance Settings (Theme, Font Size, High Contrast, Reduced Motion)
 * 5. Learning Preferences (Daily Goal, Learning Mode, Revision Cycle)
 * 6. AI Assistant Preferences (Tutor Persona, Explanation Depth, Code Lang)
 * 7. Language & Regional Settings (51 Languages, Date/Time Format)
 * 8. Security Settings (Status, Password/2FA Quick Links, Danger Zone)
 */

import { authContext } from '../context/AuthContext.js';
import { learningContext } from '../context/LearningContext.js';
import { dbStore } from '../db/store.js';
import { I18nEngine } from '../services/I18nEngine.js';
import { ConnectEngine } from '../services/ConnectEngine.js';
import { Toast } from '../components/Toast.js';
import { supabase } from '../lib/supabase.js';

export class SettingsPage {
  static async render(container) {
    const user = authContext.getUser();
    const ctx = learningContext.get();

    // Default configuration values
    const defaultSettings = {
      // 1. Account
      full_name: user?.profile?.full_name || user?.name || '',
      phone: user?.profile?.phone || '',
      bio: user?.profile?.bio || '',
      // 2. Privacy
      profile_visibility: 'department', // 'everyone' | 'department' | 'friends' | 'private'
      allow_friend_requests: 'department', // 'everyone' | 'department' | 'nobody'
      allow_direct_messages: 'department', // 'everyone' | 'department' | 'friends'
      show_online_status: true,
      show_academic_progress: true,
      show_skills_tags: true,
      discoverable_in_connect: true,
      // 3. Notifications
      notify_class_reminders: true,
      notify_live_sessions: true,
      notify_chat_messages: true,
      notify_forum_replies: true,
      notify_weekly_digest: false,
      notify_exam_deadlines: true,
      // 4. Appearance
      theme: localStorage.getItem('TP_THEME') || 'dark', // 'dark' | 'light' | 'system'
      font_size: localStorage.getItem('TP_FONT_SIZE') || 'normal', // 'compact' | 'normal' | 'large'
      high_contrast: localStorage.getItem('TP_HIGH_CONTRAST') === 'true',
      reduced_motion: localStorage.getItem('TP_REDUCED_MOTION') === 'true',
      // 5. Learning
      daily_goal_minutes: 45,
      preferred_learning_mode: 'interactive_3d', // 'interactive_3d' | 'video_lectures' | 'coding_drills' | 'balanced'
      revision_schedule: 'spaced', // 'spaced' | 'daily' | 'weekly'
      difficulty_pacing: 'adaptive', // 'adaptive' | 'rigorous' | 'foundational'
      video_autoplay: true,
      // 6. AI Assistant
      ai_persona: 'step_by_step', // 'step_by_step' | 'socratic' | 'concise'
      ai_code_language: 'cpp', // 'cpp' | 'python' | 'java' | 'c'
      ai_code_comments: true,
      ai_auto_summary: true,
      // 7. Language & Regional
      platform_language: I18nEngine.getCurrentLanguage() || 'en',
      date_format: 'DD/MM/YYYY',
      time_format: '12h'
    };

    // Attempt to load settings from Supabase and DB Store
    let dbPrefs = null;
    let sbProfile = null;
    if (user?.id) {
      try {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
        if (data) sbProfile = data;
      } catch { /* proceed */ }

      try {
        const results = await dbStore.filter('preferences', p => p.user_id === user.id);
        if (results && results[0]) dbPrefs = results[0];
      } catch (e) {
        // Fallback to local
      }
    }

    const localPrefs = JSON.parse(localStorage.getItem('TP_USER_PREFERENCES') || '{}');
    const sbPrefs = sbProfile?.learning_preferences || {};
    const settings = {
      ...defaultSettings,
      ...localPrefs,
      ...(dbPrefs?.settings || {}),
      ...sbPrefs,
      ...(sbProfile?.full_name ? { full_name: sbProfile.full_name } : {}),
      ...(sbProfile?.bio ? { bio: sbProfile.bio } : {}),
      ...(sbProfile?.preferred_language ? { platform_language: sbProfile.preferred_language } : {})
    };

    const branchDisplay = (ctx.branch_id || 'cse').toUpperCase();
    const semDisplay = (ctx.semester_id || 'sem_3').toUpperCase().replace('_', ' ');

    container.innerHTML = `
      <div class="tp-page" style="display: flex; flex-direction: column; gap: 2rem; max-width: 1050px; width: 100%; margin: 0 auto; padding-bottom: 4rem;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
              <span class="pulse-beacon"></span> SYSTEM SETTINGS & USER GOVERNANCE
            </div>
            <h1 class="display-lg">Platform Settings</h1>
            <p style="color: var(--tp-text-dark-secondary); max-width: 700px; margin: 0;">
              Configure your personal account, privacy controls, alerts, visual appearance, 3D/video learning defaults, and AI tutor behavior.
            </p>
          </div>
          <button id="save-all-settings-top-btn" class="tp-btn tp-btn-primary" style="padding: 0.65rem 1.5rem; font-size: 0.95rem;">
            💾 Save All Settings
          </button>
        </div>

        <!-- Settings Tabs Navigation Bar -->
        <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem; overflow-x: auto;">
          <a href="#/settings" class="tp-btn tp-btn-primary" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
            ⚙️ Settings
          </a>
          <a href="#/preferences" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
            🎛️ Preferences
          </a>
          <a href="#/security" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
            🛡️ Security Center
          </a>
          <a href="#/profile" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
            👤 Profile
          </a>
        </div>

        <!-- 8 SECTIONS FORM -->
        <form id="settings-master-form" style="display: flex; flex-direction: column; gap: 2rem;">

          <!-- SECTION 1: ACCOUNT SETTINGS -->
          <div class="tp-card" id="section-account">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.25rem;">👤</span>
                <h3 class="headline-md" style="color: #fff; margin: 0;">1. Account Settings</h3>
              </div>
              <span class="mono-chip" style="color: var(--tp-primary);">IDENTITY</span>
            </div>

            <!-- Centralized Branch & Semester Notice -->
            <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div>
                <strong style="color: #38bdf8; font-size: 0.95rem; display: block; margin-bottom: 0.25rem;">
                  Academic Discipline: ${branchDisplay} &bull; ${semDisplay}
                </strong>
                <span style="color: #cbd5e1; font-size: 0.85rem;">
                  Branch and Semester are authoritative academic records managed exclusively in your Profile.
                </span>
              </div>
              <a href="#/profile" class="tp-btn tp-btn-secondary" style="font-size: 0.82rem; padding: 0.4rem 0.85rem;">
                Manage in Profile →
              </a>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
              <div>
                <label class="tp-form-label">Full Name</label>
                <input type="text" id="set-fullname" class="tp-input" value="${settings.full_name}" placeholder="Your Full Name" />
              </div>

              <div>
                <label class="tp-form-label">Email Address (Identity Verified)</label>
                <input type="email" class="tp-input" value="${user?.email || 'student@techpath.edu'}" disabled style="opacity: 0.65; cursor: not-allowed;" />
              </div>

              <div>
                <label class="tp-form-label">Phone Number (Optional)</label>
                <input type="tel" id="set-phone" class="tp-input" value="${settings.phone}" placeholder="+91 98765 43210" />
              </div>

              <div>
                <label class="tp-form-label">TechPath ID</label>
                <input type="text" class="tp-input" value="${user?.profile?.techpath_id || 'TP-' + branchDisplay + '-7K4M92'}" disabled style="opacity: 0.65; cursor: not-allowed; font-family: monospace;" />
              </div>

              <div style="grid-column: 1 / -1;">
                <label class="tp-form-label">Short Peer Bio</label>
                <textarea id="set-bio" class="tp-input" rows="2" placeholder="Brief statement about your engineering interests...">${settings.bio}</textarea>
              </div>
            </div>
          </div>

          <!-- SECTION 2: PRIVACY SETTINGS -->
          <div class="tp-card" id="section-privacy">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.25rem;">🔒</span>
                <h3 class="headline-md" style="color: #fff; margin: 0;">2. Privacy Settings</h3>
              </div>
              <span class="mono-chip" style="color: #10b981;">DATA CONTROLS</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
              <div>
                <label class="tp-form-label">Profile Visibility</label>
                <select id="set-privacy-visibility" class="tp-input">
                  <option value="everyone" ${settings.profile_visibility === 'everyone' ? 'selected' : ''}>Public (All TechPath Students)</option>
                  <option value="department" ${settings.profile_visibility === 'department' ? 'selected' : ''}>Department Only (${branchDisplay})</option>
                  <option value="friends" ${settings.profile_visibility === 'friends' ? 'selected' : ''}>Friends Only</option>
                  <option value="private" ${settings.profile_visibility === 'private' ? 'selected' : ''}>Private (Hidden from discovery)</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Who Can Send Friend Requests</label>
                <select id="set-privacy-requests" class="tp-input">
                  <option value="everyone" ${settings.allow_friend_requests === 'everyone' ? 'selected' : ''}>Everyone</option>
                  <option value="department" ${settings.allow_friend_requests === 'department' ? 'selected' : ''}>Students in ${branchDisplay}</option>
                  <option value="nobody" ${settings.allow_friend_requests === 'nobody' ? 'selected' : ''}>Nobody</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Direct Message Permissions</label>
                <select id="set-privacy-messages" class="tp-input">
                  <option value="everyone" ${settings.allow_direct_messages === 'everyone' ? 'selected' : ''}>Anyone on TechPath</option>
                  <option value="department" ${settings.allow_direct_messages === 'department' ? 'selected' : ''}>Same Department Students</option>
                  <option value="friends" ${settings.allow_direct_messages === 'friends' ? 'selected' : ''}>Friends & Class Cohort Only</option>
                </select>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.06);">
              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-privacy-online" ${settings.show_online_status ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Show Online Status when active in TechPath Connect</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-privacy-academic" ${settings.show_academic_progress ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Display Completed Units and Academic Progress on Public Dossier</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-privacy-skills" ${settings.show_skills_tags ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Show Verified Skill Badges on Profile</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-privacy-discoverable" ${settings.discoverable_in_connect ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>List profile in TechPath Connect peer recommendations</span>
              </label>
            </div>
          </div>

          <!-- SECTION 3: NOTIFICATION SETTINGS -->
          <div class="tp-card" id="section-notifications">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.25rem;">🔔</span>
                <h3 class="headline-md" style="color: #fff; margin: 0;">3. Notification Settings</h3>
              </div>
              <span class="mono-chip" style="color: #f59e0b;">ALERTS</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-notif-classes" ${settings.notify_class_reminders ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Class Schedule Reminders (15 mins prior to start)</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-notif-live" ${settings.notify_live_sessions ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Live Session Announcements & Teacher Invites</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-notif-chat" ${settings.notify_chat_messages ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Direct Chat & Friend Message Notifications</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-notif-forum" ${settings.notify_forum_replies ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Study Group Discussions & Forum Mentions</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-notif-exams" ${settings.notify_exam_deadlines ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Exam Roadmap Deadlines & PYQ Updates</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-notif-digest" ${settings.notify_weekly_digest ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Weekly Curriculum Progress Summary Email</span>
              </label>
            </div>
          </div>

          <!-- SECTION 4: APPEARANCE SETTINGS -->
          <div class="tp-card" id="section-appearance">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.25rem;">🎨</span>
                <h3 class="headline-md" style="color: #fff; margin: 0;">4. Appearance & Accessibility</h3>
              </div>
              <span class="mono-chip" style="color: #a855f7;">UI THEME</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
              <div>
                <label class="tp-form-label">Color Theme</label>
                <select id="set-app-theme" class="tp-input">
                  <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Obsidian Dark (Recommended)</option>
                  <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Daylight Crisp (Light Mode)</option>
                  <option value="system" ${settings.theme === 'system' ? 'selected' : ''}>System Default Sync</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Font Scale</label>
                <select id="set-app-font-size" class="tp-input">
                  <option value="compact" ${settings.font_size === 'compact' ? 'selected' : ''}>Compact (14px baseline)</option>
                  <option value="normal" ${settings.font_size === 'normal' ? 'selected' : ''}>Standard (16px baseline)</option>
                  <option value="large" ${settings.font_size === 'large' ? 'selected' : ''}>Enhanced Legibility (18px baseline)</option>
                </select>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.06);">
              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-app-contrast" ${settings.high_contrast ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>High-Contrast Mode (WCAG AAA contrast borders & text)</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-app-motion" ${settings.reduced_motion ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Reduced Motion (Disable heavy 3D spins and micro-transitions)</span>
              </label>
            </div>
          </div>

          <!-- SECTION 5: LEARNING PREFERENCES -->
          <div class="tp-card" id="section-learning">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.25rem;">📚</span>
                <h3 class="headline-md" style="color: #fff; margin: 0;">5. Learning Preferences</h3>
              </div>
              <span class="mono-chip" style="color: #38bdf8;">PEDAGOGY</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
              <div>
                <label class="tp-form-label">Daily Study Target</label>
                <select id="set-learn-goal" class="tp-input">
                  <option value="30" ${settings.daily_goal_minutes === 30 ? 'selected' : ''}>30 Minutes / day</option>
                  <option value="45" ${settings.daily_goal_minutes === 45 ? 'selected' : ''}>45 Minutes / day (Standard)</option>
                  <option value="60" ${settings.daily_goal_minutes === 60 ? 'selected' : ''}>60 Minutes / day (Intensive)</option>
                  <option value="90" ${settings.daily_goal_minutes === 90 ? 'selected' : ''}>90 Minutes / day (Exam Sprint)</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Preferred Learning Mode</label>
                <select id="set-learn-mode" class="tp-input">
                  <option value="interactive_3d" ${settings.preferred_learning_mode === 'interactive_3d' ? 'selected' : ''}>Interactive 3D Simulation</option>
                  <option value="video_lectures" ${settings.preferred_learning_mode === 'video_lectures' ? 'selected' : ''}>Video Lectures & Demos</option>
                  <option value="coding_drills" ${settings.preferred_learning_mode === 'coding_drills' ? 'selected' : ''}>Hands-on Coding & Problem Sets</option>
                  <option value="balanced" ${settings.preferred_learning_mode === 'balanced' ? 'selected' : ''}>Balanced Multi-Modal</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Revision Schedule Method</label>
                <select id="set-learn-revision" class="tp-input">
                  <option value="spaced" ${settings.revision_schedule === 'spaced' ? 'selected' : ''}>Spaced Repetition (1-3-7-21 Day Intervals)</option>
                  <option value="daily" ${settings.revision_schedule === 'daily' ? 'selected' : ''}>Daily End-of-Day Quick Recap</option>
                  <option value="weekly" ${settings.revision_schedule === 'weekly' ? 'selected' : ''}>Weekend Mastery Drills</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Subject Difficulty Pacing</label>
                <select id="set-learn-difficulty" class="tp-input">
                  <option value="foundational" ${settings.difficulty_pacing === 'foundational' ? 'selected' : ''}>Foundational (Step-by-step)</option>
                  <option value="adaptive" ${settings.difficulty_pacing === 'adaptive' ? 'selected' : ''}>Adaptive (Matches Your Performance)</option>
                  <option value="rigorous" ${settings.difficulty_pacing === 'rigorous' ? 'selected' : ''}>Rigorous (Advanced Interview Prep)</option>
                </select>
              </div>
            </div>

            <div style="padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.06);">
              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-learn-autoplay" ${settings.video_autoplay ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Autoplay Next Topic Video in Class Sequence</span>
              </label>
            </div>
          </div>

          <!-- SECTION 6: AI ASSISTANT PREFERENCES -->
          <div class="tp-card" id="section-ai">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.25rem;">🤖</span>
                <h3 class="headline-md" style="color: #fff; margin: 0;">6. AI Assistant Preferences</h3>
              </div>
              <span class="mono-chip" style="color: #ec4899;">GEMINI AI</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
              <div>
                <label class="tp-form-label">AI Tutor Personality</label>
                <select id="set-ai-persona" class="tp-input">
                  <option value="step_by_step" ${settings.ai_persona === 'step_by_step' ? 'selected' : ''}>Detailed Step-by-Step Instructor</option>
                  <option value="socratic" ${settings.ai_persona === 'socratic' ? 'selected' : ''}>Socratic Mentor (Guides with Hints)</option>
                  <option value="concise" ${settings.ai_persona === 'concise' ? 'selected' : ''}>Direct & Concise (Fast Solutions)</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Default Code Language for AI Explanations</label>
                <select id="set-ai-codelang" class="tp-input">
                  <option value="cpp" ${settings.ai_code_language === 'cpp' ? 'selected' : ''}>C++ (Modern C++20)</option>
                  <option value="python" ${settings.ai_code_language === 'python' ? 'selected' : ''}>Python 3</option>
                  <option value="java" ${settings.ai_code_language === 'java' ? 'selected' : ''}>Java 17 LTS</option>
                  <option value="c" ${settings.ai_code_language === 'c' ? 'selected' : ''}>C (Embedded Systems Standard)</option>
                </select>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.06);">
              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-ai-comments" ${settings.ai_code_comments ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Require Thorough Explanatory Comments in AI Generated Code</span>
              </label>

              <label style="display: flex; align-items: center; gap: 0.75rem; color: #f1f5f9; cursor: pointer; font-size: 0.9rem;">
                <input type="checkbox" id="set-ai-summary" ${settings.ai_auto_summary ? 'checked' : ''} style="accent-color: var(--tp-primary); width: 18px; height: 18px;" />
                <span>Automatically Generate AI Revision Flashcards from Doubt Solver Chats</span>
              </label>
            </div>
          </div>

          <!-- SECTION 7: LANGUAGE & REGIONAL SETTINGS -->
          <div class="tp-card" id="section-language">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.25rem;">🌐</span>
                <h3 class="headline-md" style="color: #fff; margin: 0;">7. Language & Regional Settings</h3>
              </div>
              <span class="mono-chip" style="color: #06b6d4;">51 LANGUAGES</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
              <div>
                <label class="tp-form-label">Platform UI & AI Tutor Language</label>
                <select id="set-lang-select" class="tp-input">
                  ${I18nEngine.getAllLanguages().map(l => `
                    <option value="${l.code}" ${l.code === settings.platform_language ? 'selected' : ''}>
                      ${l.nativeName} (${l.name})
                    </option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="tp-form-label">Date Format</label>
                <select id="set-date-format" class="tp-input">
                  <option value="DD/MM/YYYY" ${settings.date_format === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY (Standard)</option>
                  <option value="MM/DD/YYYY" ${settings.date_format === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD" ${settings.date_format === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD (ISO)</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Time Display Format</label>
                <select id="set-time-format" class="tp-input">
                  <option value="12h" ${settings.time_format === '12h' ? 'selected' : ''}>12-Hour (e.g. 06:30 PM IST)</option>
                  <option value="24h" ${settings.time_format === '24h' ? 'selected' : ''}>24-Hour Military (e.g. 18:30 IST)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- SECTION 8: SECURITY SETTINGS & QUICK LINKS -->
          <div class="tp-card" id="section-security">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <span style="font-size: 1.25rem;">🛡️</span>
                <h3 class="headline-md" style="color: #fff; margin: 0;">8. Security & Authentication Status</h3>
              </div>
              <span class="mono-chip" style="color: #10b981;">ACTIVE STATUS</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
              <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--tp-border-dark); border-radius: 6px; padding: 1rem;">
                <span style="color: #94a3b8; font-size: 0.78rem; text-transform: uppercase;">Credential Status</span>
                <strong style="display: block; color: #fff; font-size: 1rem; margin: 0.35rem 0;">Protected with Supabase Auth</strong>
                <a href="#/security" class="tp-btn tp-btn-secondary" style="font-size: 0.78rem; padding: 0.35rem 0.75rem; margin-top: 0.5rem; display: inline-block;">
                  Change Password →
                </a>
              </div>

              <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--tp-border-dark); border-radius: 6px; padding: 1rem;">
                <span style="color: #94a3b8; font-size: 0.78rem; text-transform: uppercase;">Active Web Sessions</span>
                <strong style="display: block; color: #10b981; font-size: 1rem; margin: 0.35rem 0;">1 Active Local Session</strong>
                <a href="#/security" class="tp-btn tp-btn-secondary" style="font-size: 0.78rem; padding: 0.35rem 0.75rem; margin-top: 0.5rem; display: inline-block;">
                  Manage Sessions & Tokens →
                </a>
              </div>

              <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--tp-border-dark); border-radius: 6px; padding: 1rem;">
                <span style="color: #94a3b8; font-size: 0.78rem; text-transform: uppercase;">Compliance & GDPR Article 17</span>
                <strong style="display: block; color: #cbd5e1; font-size: 1rem; margin: 0.35rem 0;">Full Data Portability</strong>
                <a href="#/security" class="tp-btn tp-btn-ghost" style="font-size: 0.78rem; padding: 0.35rem 0.75rem; margin-top: 0.5rem; display: inline-block; color: #f87171;">
                  Data Erasure & Danger Zone →
                </a>
              </div>
            </div>
          </div>

          <!-- Bottom Save Actions -->
          <div style="display: flex; justify-content: flex-end; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--tp-border-dark);">
            <button type="button" id="reset-settings-btn" class="tp-btn tp-btn-secondary" style="padding: 0.65rem 1.5rem;">
              Reset to Defaults
            </button>
            <button type="submit" id="save-all-settings-bottom-btn" class="tp-btn tp-btn-primary" style="padding: 0.65rem 2rem; font-size: 1rem; font-weight: 600;">
              💾 Save All Settings
            </button>
          </div>

        </form>

      </div>
    `;

    this._bindEvents(container, user, defaultSettings);
  }

  static _bindEvents(container, user, defaultSettings) {
    const form = container.querySelector('#settings-master-form');
    const saveTopBtn = container.querySelector('#save-all-settings-top-btn');

    // Live theme preview
    const themeSelect = container.querySelector('#set-app-theme');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'light') {
          document.body.classList.add('light-theme');
        } else {
          document.body.classList.remove('light-theme');
        }
      });
    }

    // Save handler
    const handleSave = async (e) => {
      if (e) e.preventDefault();

      const updated = {
        // Account
        full_name: container.querySelector('#set-fullname').value.trim(),
        phone: container.querySelector('#set-phone').value.trim(),
        bio: container.querySelector('#set-bio').value.trim(),
        // Privacy
        profile_visibility: container.querySelector('#set-privacy-visibility').value,
        allow_friend_requests: container.querySelector('#set-privacy-requests').value,
        allow_direct_messages: container.querySelector('#set-privacy-messages').value,
        show_online_status: container.querySelector('#set-privacy-online').checked,
        show_academic_progress: container.querySelector('#set-privacy-academic').checked,
        show_skills_tags: container.querySelector('#set-privacy-skills').checked,
        discoverable_in_connect: container.querySelector('#set-privacy-discoverable').checked,
        // Notifications
        notify_class_reminders: container.querySelector('#set-notif-classes').checked,
        notify_live_sessions: container.querySelector('#set-notif-live').checked,
        notify_chat_messages: container.querySelector('#set-notif-chat').checked,
        notify_forum_replies: container.querySelector('#set-notif-forum').checked,
        notify_exam_deadlines: container.querySelector('#set-notif-exams').checked,
        notify_weekly_digest: container.querySelector('#set-notif-digest').checked,
        // Appearance
        theme: container.querySelector('#set-app-theme').value,
        font_size: container.querySelector('#set-app-font-size').value,
        high_contrast: container.querySelector('#set-app-contrast').checked,
        reduced_motion: container.querySelector('#set-app-motion').checked,
        // Learning
        daily_goal_minutes: parseInt(container.querySelector('#set-learn-goal').value, 10),
        preferred_learning_mode: container.querySelector('#set-learn-mode').value,
        revision_schedule: container.querySelector('#set-learn-revision').value,
        difficulty_pacing: container.querySelector('#set-learn-difficulty').value,
        video_autoplay: container.querySelector('#set-learn-autoplay').checked,
        // AI
        ai_persona: container.querySelector('#set-ai-persona').value,
        ai_code_language: container.querySelector('#set-ai-codelang').value,
        ai_code_comments: container.querySelector('#set-ai-comments').checked,
        ai_auto_summary: container.querySelector('#set-ai-summary').checked,
        // Language
        platform_language: container.querySelector('#set-lang-select').value,
        date_format: container.querySelector('#set-date-format').value,
        time_format: container.querySelector('#set-time-format').value
      };

      // 1. Persist to Local Storage
      localStorage.setItem('TP_USER_PREFERENCES', JSON.stringify(updated));
      localStorage.setItem('TP_THEME', updated.theme);
      localStorage.setItem('TP_FONT_SIZE', updated.font_size);
      localStorage.setItem('TP_HIGH_CONTRAST', String(updated.high_contrast));
      localStorage.setItem('TP_REDUCED_MOTION', String(updated.reduced_motion));

      // 2. Persist to Supabase and DB Store
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

          // Persist directly to authenticated Supabase profiles table
          try {
            await supabase.from('profiles').update({
              full_name: updated.full_name,
              bio: updated.bio,
              preferred_language: updated.platform_language,
              learning_preferences: updated,
              updated_at: new Date().toISOString()
            }).eq('id', user.id);
          } catch (sbErr) {
            console.warn('[Supabase Settings Update Note]:', sbErr.message);
          }

          // Also update social preferences
          await ConnectEngine.saveSocialPreferences(user.id, {
            profile_visibility: updated.profile_visibility,
            allow_requests: updated.allow_friend_requests,
            discoverable: updated.discoverable_in_connect,
            show_online: updated.show_online_status,
            show_academic: updated.show_academic_progress,
            show_skills: updated.show_skills_tags
          });

          // Sync basic profile fields
          await authContext.updateProfile({
            full_name: updated.full_name,
            name: updated.full_name,
            phone: updated.phone,
            bio: updated.bio,
            preferred_language: updated.platform_language,
            learning_preferences: updated
          });
        } catch (err) {
          console.warn('DB settings sync notice:', err.message);
        }
      }

      // 3. Apply DOM Appearance modifications immediately
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

      // 4. Update Language Engine if changed
      if (updated.platform_language !== I18nEngine.getCurrentLanguage()) {
        I18nEngine.setLanguage(updated.platform_language);
      }

      Toast.success('Settings saved and synchronized across all TechPath modules!');
    };

    if (form) form.addEventListener('submit', handleSave);
    if (saveTopBtn) saveTopBtn.addEventListener('click', handleSave);

    // Reset button
    const resetBtn = container.querySelector('#reset-settings-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset all settings to default values?')) {
          localStorage.removeItem('TP_USER_PREFERENCES');
          SettingsPage.render(container);
          Toast.info('Settings reset to defaults.');
        }
      });
    }
  }
}
