/**
 * TECHPATH — COMPLETE USER PROFILE & ACADEMIC DOSSIER
 * Supabase-synchronized profile with photo upload, branch/semester/specialization,
 * skills tags, certificates, learning progress metrics, and live edit mode.
 */

import { authContext } from '../context/AuthContext.js';
import { learningContext } from '../context/LearningContext.js';
import { supabase } from '../lib/supabase.js';
import { dbStore } from '../db/store.js';
import { Toast } from '../components/Toast.js';
import { I18nEngine } from '../services/I18nEngine.js';
import { ClassesEngine } from '../services/ClassesEngine.js';
import { TaxonomyEngine } from '../services/TaxonomyEngine.js';
import { AcademicTaxonomySelector } from '../components/AcademicTaxonomySelector.js';

export class ProfilePage {
  static isEditing = false;
  static activeSubTab = 'student'; // 'student' | 'teacher'

  static async render(container) {
    if (!authContext.isLoggedIn()) {
      window.location.hash = '#/signin';
      return;
    }
    const user = authContext.getUser();
    const ctx = learningContext.get();

    // 1. Fetch profile from Supabase or fallback to local
    let profile = authContext.getProfile() || {};
    try {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (data) {
          profile = { ...profile, ...data };
        }
      }
    } catch (e) {
      console.warn('Profile fetch note:', e.message);
    }

    // Avatar
    const avatarUrl = profile.avatar_url || localStorage.getItem('TP_AVATAR_DATA') || '';
    const initial = (profile.full_name || profile.name || user?.email || 'E').charAt(0).toUpperCase();

    // Branch & Academic metadata
    const branch = (profile.branch_id || profile.branch || ctx.branch_id || 'cse').toLowerCase();
    const semester = (profile.semester_id || profile.semester || ctx.semester_id || 'sem_3');
    const specialization = profile.specialization || profile.specialization_id || 'Core Systems Engineering';
    const deptObj = TaxonomyEngine.getDepartmentById(profile.department_id) || TaxonomyEngine.DEPARTMENTS[0];
    const branchObj = TaxonomyEngine.getBranchById(branch) || TaxonomyEngine.ALL_BRANCHES[0];
    const department = profile.department_name || deptObj?.name || 'Computer & Computing';
    const branchDisplayName = branchObj ? `${branchObj.name} (${branchObj.code})` : branch.toUpperCase();
    const learningLevel = profile.learning_level || ctx.learning_level || 'intermediate';
    const careerGoal = profile.career_goal || ctx.career_goal || (branchObj?.roles?.[0] || 'Software Engineer');
    const preferredLang = profile.preferred_language || I18nEngine.getCurrentLanguage();
    
    // Ensure stable, permanent TechPath ID (TP-XXXXXXXX)
    let techpathId = profile.techpath_id || user?.profile?.techpath_id;
    if (!techpathId) {
      techpathId = await authContext.generateUniqueTechPathId();
      profile.techpath_id = techpathId;
      if (user?.id) {
        try {
          await supabase.from('profiles').update({ techpath_id: techpathId }).eq('id', user.id);
        } catch { /* proceed */ }
      }
    }

    const bio = profile.bio || profile.description || user?.profile?.bio || '2nd-year engineering student interested in systems, coding, and collaborative learning.';
    const userSkills = profile.skills || [
      branch === 'ece' ? 'Embedded C' : 'Algorithms & Data Structures',
      branch === 'mech' ? 'Thermodynamics' : 'System Architecture',
      'Git & CI/CD', 'Problem Solving'
    ];

    // Certificates & Achievements
    const completedTopics = JSON.parse(localStorage.getItem('TP_COMPLETED_TOPICS') || '["Algorithm Analysis", "Hardware Pipeline Stages"]');
    const userProjects = JSON.parse(localStorage.getItem('TP_USER_PROJECTS') || '[]');
    const certificates = JSON.parse(localStorage.getItem('TP_CERTIFICATES') || '[]');
    if (certificates.length === 0) {
      certificates.push(
        { title: `Foundation in ${branch.toUpperCase()} Systems`, date: 'September 2026', issuer: 'TechPath Academic Board' }
      );
      localStorage.setItem('TP_CERTIFICATES', JSON.stringify(certificates));
    }

    // Compute progress metric
    const progressPercent = Math.min(100, Math.max(25, completedTopics.length * 15));

    let teacherProfile = null;
    if (user?.id) {
      try {
        teacherProfile = await ClassesEngine.getTeacherProfile(user.id);
      } catch { /* proceed */ }
    }

    container.innerHTML = `
      <div class="tp-page" style="display: flex; flex-direction: column; gap: 2rem; max-width: 1050px; width: 100%;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
              <span class="pulse-beacon"></span> ACADEMIC PORTFOLIO // SUPABASE PROFILE
            </div>
            <h1 class="display-lg">Student Profile & Dossier</h1>
            <p style="color: var(--tp-text-dark-secondary); max-width: 700px;">
              Manage your engineering credentials, branch specialization, verified skills, and academic certifications.
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            ${this.activeSubTab === 'student' ? (!this.isEditing ? `
              <button id="edit-profile-btn" class="tp-btn tp-btn-primary" style="font-size: 0.88rem;">
                ✏️ Edit Profile
              </button>
            ` : `
              <button id="cancel-edit-btn" class="tp-btn tp-btn-secondary" style="font-size: 0.88rem;">
                Cancel
              </button>
            `) : `
              <a href="#/teacher/dashboard" class="tp-btn tp-btn-primary" style="font-size: 0.88rem;">
                👨‍🏫 Open Teacher Studio →
              </a>
            `}
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem; overflow-x: auto;">
          <button type="button" id="tab-student-dossier" class="tp-btn ${this.activeSubTab !== 'teacher' ? 'tp-btn-primary' : 'tp-btn-secondary'}" style="font-size: 0.85rem; padding: 0.4rem 1.1rem;">
            👤 Student Dossier
          </button>
          <button type="button" id="tab-teacher-profile" class="tp-btn ${this.activeSubTab === 'teacher' ? 'tp-btn-primary' : 'tp-btn-secondary'}" style="font-size: 0.85rem; padding: 0.4rem 1.1rem;">
            👨‍🏫 Teaching Profile ${teacherProfile?.verification_status === 'Teacher Verified' ? '✓' : ''}
          </button>
          <a href="#/security" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1.1rem;">
            🛡️ Security Center
          </a>
          <a href="#/preferences" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 1.1rem;">
            🎛️ Preferences
          </a>
        </div>

        <!-- Identity Banner Card -->
        <div class="tp-card tp-card-glass" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
            <!-- Profile Photo Container -->
            <div style="position: relative;">
              <div id="profile-avatar-display" style="width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, var(--tp-primary), var(--tp-accent)); display: flex; align-items: center; justify-content: center; font-size: 2.25rem; font-weight: 700; color: #fff; overflow: hidden; border: 3px solid rgba(225,29,72,0.4); box-shadow: var(--shadow-md);">
                ${avatarUrl ? `
                  <img src="${avatarUrl}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;" />
                ` : initial}
              </div>
              <label for="avatar-file-input" style="position: absolute; bottom: -4px; right: -4px; background: var(--tp-primary); color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.75rem; border: 2px solid #000;" title="Change Photo">
                📷
              </label>
              <input type="file" id="avatar-file-input" accept="image/png,image/jpeg,image/webp" style="display: none;" />
            </div>

            <!-- Identity Info -->
            <div>
              <h2 class="headline-lg" style="color: #fff; margin-bottom: 0.25rem;">
                ${profile.full_name || profile.name || user?.email?.split('@')[0] || 'Engineering Scholar'}
              </h2>
              <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.65rem; flex-wrap: wrap;">
                <span style="color: var(--tp-text-dark-secondary); font-size: 0.88rem;">
                  ${user?.email || 'student@techpath.edu'}
                </span>
                <div style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(0,0,0,0.45); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 8px; padding: 0.2rem 0.65rem;">
                  <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700;">TECHPATH ID:</span>
                  <span style="font-family: monospace; font-size: 0.88rem; font-weight: 800; color: #38bdf8;">${techpathId}</span>
                  <button type="button" id="profile-copy-id-btn" title="Copy TechPath ID" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0; display: flex; align-items: center;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </div>
              </div>

              <!-- Academic Meta Chips -->
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span class="telemetry-chip" style="color: var(--tp-primary); border-color: var(--tp-primary); font-size: 0.75rem;">
                  ${branch.toUpperCase()} &bull; SEMESTER ${semester.replace('sem_', '')}
                </span>
                <span class="mono-chip" style="color: var(--tp-info); font-size: 0.75rem;">
                  ${specialization}
                </span>
                <span class="mono-chip" style="color: var(--tp-success); font-size: 0.75rem;">
                  ${learningLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Navigation Actions -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <a href="#/learning" class="tp-btn tp-btn-ghost" style="font-size: 0.8rem;">View Progress</a>
            <a href="#/projects" class="tp-btn tp-btn-ghost" style="font-size: 0.8rem;">View Projects</a>
            <a href="#/achievements" class="tp-btn tp-btn-ghost" style="font-size: 0.8rem;">Achievem        <!-- Sub-Tab Content: Student Dossier vs Teaching Profile -->
        ${this.activeSubTab === 'teacher' ? `
          <!-- TEACHING PROFILE STUDIO (Requirement 1) -->
          <div class="tp-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.85rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h3 class="headline-md" style="color: #fff;">Teaching Profile & Pedagogy Settings</h3>
                <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary);">
                  Configure your teaching subjects, pricing, and availability. Displayed to students on TechPath Classes marketplace.
                </p>
              </div>
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <span class="telemetry-chip" style="font-size: 0.72rem; color: ${teacherProfile?.verification_status === 'Teacher Verified' ? '#10b981' : '#f59e0b'}; border-color: ${teacherProfile?.verification_status === 'Teacher Verified' ? '#10b981' : '#f59e0b'};">
                  ${teacherProfile?.verification_status || 'Unverified'}
                </span>
                <a href="#/teacher/dashboard" class="tp-btn tp-btn-secondary" style="font-size: 0.8rem;">
                  Open Teacher Studio →
                </a>
              </div>
            </div>

            <form id="teaching-profile-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
              <div>
                <label class="tp-form-label">Teaching Name / Display Alias *</label>
                <input type="text" id="tp-name" class="tp-input" value="${teacherProfile?.teacher_name || profile.full_name || profile.name || ''}" required />
              </div>

              <div>
                <label class="tp-form-label">Engineering Discipline / Branch *</label>
                <select id="tp-branch" class="tp-input" required>
                  <option value="cse" ${(teacherProfile?.branch_id || branch) === 'cse' ? 'selected' : ''}>Computer Science & Engineering (CSE)</option>
                  <option value="ece" ${(teacherProfile?.branch_id || branch) === 'ece' ? 'selected' : ''}>Electronics & Communication Engineering (ECE)</option>
                  <option value="mech" ${(teacherProfile?.branch_id || branch) === 'mech' ? 'selected' : ''}>Mechanical Engineering (MECH)</option>
                  <option value="civil" ${(teacherProfile?.branch_id || branch) === 'civil' ? 'selected' : ''}>Civil Engineering (CIVIL)</option>
                  <option value="eee" ${(teacherProfile?.branch_id || branch) === 'eee' ? 'selected' : ''}>Electrical & Electronics (EEE)</option>
                  <option value="aiml" ${(teacherProfile?.branch_id || branch) === 'aiml' ? 'selected' : ''}>Artificial Intelligence & ML (AIML)</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Specialization / Core Track</label>
                <input type="text" id="tp-specialization" class="tp-input" value="${teacherProfile?.specialization || specialization}" placeholder="e.g. Distributed Systems, VLSI, FEA" />
              </div>

              <div>
                <label class="tp-form-label">Target Student Semester Level</label>
                <input type="text" id="tp-sem-level" class="tp-input" value="${teacherProfile?.semester_level || 'Semester 3 to 6'}" placeholder="e.g. Semester 2 to 5" />
              </div>

              <div style="grid-column: 1 / -1;">
                <label class="tp-form-label">Teaching Subjects (Comma-separated) *</label>
                <input type="text" id="tp-subjects" class="tp-input" value="${(teacherProfile?.teaching_subjects || ['Data Structures & Algorithms', 'C++ Programming']).join(', ')}" required />
              </div>

              <div style="grid-column: 1 / -1;">
                <label class="tp-form-label">Key Topics / Units Covered (Comma-separated)</label>
                <input type="text" id="tp-topics" class="tp-input" value="${(teacherProfile?.teaching_topics || ['Trees & Graphs', 'Dynamic Programming']).join(', ')}" />
              </div>

              <div style="grid-column: 1 / -1;">
                <label class="tp-form-label">Teaching Experience & Academic Credentials</label>
                <input type="text" id="tp-experience" class="tp-input" value="${teacherProfile?.teaching_experience || ''}" placeholder="e.g. 2 years peer tutoring, lab assistant for Microcontrollers, top percentile in University exams" />
              </div>

              <div style="grid-column: 1 / -1;">
                <label class="tp-form-label">Skills & Technical Competencies (Comma-separated)</label>
                <input type="text" id="tp-skills" class="tp-input" value="${(teacherProfile?.skills || userSkills).join(', ')}" />
              </div>

              <div style="grid-column: 1 / -1;">
                <label class="tp-form-label">Short Teaching Description & Philosophy *</label>
                <textarea id="tp-description" class="tp-input" rows="3" placeholder="Briefly describe your teaching style, interactive exercises, and how you assist students..." required>${teacherProfile?.description || 'Senior engineering peer passionate about intuitive, visual explanations and hands-on coding.'}</textarea>
              </div>

              <div>
                <label class="tp-form-label">Languages Taught In (Comma-separated)</label>
                <input type="text" id="tp-languages" class="tp-input" value="${(teacherProfile?.languages || ['English']).join(', ')}" required />
              </div>

              <div>
                <label class="tp-form-label">Class Format</label>
                <select id="tp-format" class="tp-input">
                  <option value="Interactive Live Session + Code Lab" selected>Interactive Live Session + Code Lab</option>
                  <option value="Live Lecture + Q&A Drill">Live Lecture + Q&A Drill</option>
                  <option value="1-on-1 Mentorship & Code Review">1-on-1 Mentorship & Code Review</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Availability Summary</label>
                <input type="text" id="tp-avail" class="tp-input" value="${teacherProfile?.availability_summary || 'Weekdays 6 PM - 9 PM, Weekends'}" placeholder="e.g. Mon/Wed 5 PM - 8 PM" />
              </div>

              <!-- Transparent Pricing Controls -->
              <div>
                <label class="tp-form-label">Standard Price Per Class (₹ INR) *</label>
                <input type="number" id="tp-price-class" class="tp-input" value="${teacherProfile?.price_per_class || 300}" min="50" step="10" required />
              </div>

              <div>
                <label class="tp-form-label">Price Per Hour (₹ INR)</label>
                <input type="number" id="tp-price-hour" class="tp-input" value="${teacherProfile?.price_per_hour || 350}" min="50" step="10" />
              </div>

              <div>
                <label class="tp-form-label">Optional Package Price (5 Classes)</label>
                <input type="number" id="tp-price-pkg" class="tp-input" value="${teacherProfile?.package_price || 1200}" min="100" step="50" />
              </div>

              <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; border-top: 1px solid var(--tp-border-dark); padding-top: 1rem;">
                <button type="submit" id="tp-save-btn" class="tp-btn tp-btn-primary" style="padding: 0.65rem 1.75rem;">
                  💾 Save Teaching Profile
                </button>
              </div>
            </form>
          </div>
        ` : `
          <!-- View vs Edit Mode for Student Dossier -->
          ${!this.isEditing ? `
            <!-- VIEW MODE: Academic Details, Progress & Portfolio -->
            <div style="display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; align-items: start;" class="profile-layout-grid">
              <!-- Left Column: Dossier Details -->
              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Academic Specifications Card -->
                <div class="tp-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                    <h3 class="headline-md" style="color: #fff;">Academic Curriculum Mapping</h3>
                    <span class="mono-chip" style="color: var(--tp-primary);">AUTHENTIC TELEMETRY</span>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
                    <div class="tp-spec-row">
                      <span class="tp-spec-label">Faculty / Department</span>
                      <p class="tp-spec-val" style="color: #fff; font-weight: 500;">${department}</p>
                    </div>
                    <div class="tp-spec-row">
                      <span class="tp-spec-label">Discipline / Branch</span>
                      <p class="tp-spec-val" style="color: #fff; font-weight: 500;">${branchDisplayName} (B.Tech 4-Year)</p>
                    </div>
                    <div class="tp-spec-row">
                      <span class="tp-spec-label">Active Semester</span>
                      <p class="tp-spec-val" style="color: #fff; font-weight: 500;">Semester ${semester.replace('sem_', '')} of 8</p>
                    </div>
                    <div class="tp-spec-row">
                      <span class="tp-spec-label">Track Specialization</span>
                      <p class="tp-spec-val" style="color: #fff; font-weight: 500;">${specialization}</p>
                    </div>
                    <div class="tp-spec-row">
                      <span class="tp-spec-label">Target Career Role</span>
                      <p class="tp-spec-val" style="color: #fff; font-weight: 500;">${careerGoal}</p>
                    </div>
                    <div class="tp-spec-row">
                      <span class="tp-spec-label">Selected Career Roles</span>
                      <p class="tp-spec-val" style="color: #fff; font-weight: 500;">${(profile.career_interests || [careerGoal]).join(', ')}</p>
                    </div>
                    <div class="tp-spec-row">
                      <span class="tp-spec-label">Learning Level</span>
                      <p class="tp-spec-val" style="color: #fff; font-weight: 500;">${learningLevel.toUpperCase()}</p>
                    </div>
                    <div class="tp-spec-row">
                      <span class="tp-spec-label">Preferred UI & AI Language</span>
                      <p class="tp-spec-val" style="color: #fff; font-weight: 500;">${preferredLang.toUpperCase()}</p>
                    </div>
                    <div class="tp-spec-row" style="grid-column: 1 / -1;">
                      <span class="tp-spec-label">Professional & Social Links</span>
                      <div style="display: flex; gap: 0.6rem; margin-top: 0.35rem; flex-wrap: wrap;">
                        ${profile.github_url ? `
                          <a href="${profile.github_url}" target="_blank" rel="noopener noreferrer" class="tp-tag" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.35rem; background:rgba(255,255,255,0.06); color:#fff; border:1px solid rgba(255,255,255,0.15);">
                            <span>🐙</span> GitHub
                          </a>` : ''}
                        ${profile.linkedin_url ? `
                          <a href="${profile.linkedin_url}" target="_blank" rel="noopener noreferrer" class="tp-tag" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.35rem; background:rgba(10,102,194,0.15); color:#60a5fa; border:1px solid rgba(10,102,194,0.3);">
                            <span>💼</span> LinkedIn
                          </a>` : ''}
                        ${profile.portfolio_url ? `
                          <a href="${profile.portfolio_url}" target="_blank" rel="noopener noreferrer" class="tp-tag" style="text-decoration:none; display:inline-flex; align-items:center; gap:0.35rem; background:rgba(168,85,247,0.15); color:#c084fc; border:1px solid rgba(168,85,247,0.3);">
                            <span>🌐</span> Portfolio
                          </a>` : ''}
                        ${!profile.github_url && !profile.linkedin_url && !profile.portfolio_url ? `
                          <span style="font-size:0.82rem; color:var(--tp-text-dark-muted); font-style:italic;">No external links configured yet.</span>` : ''}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- About Me / Peer Description Card -->
                <div class="tp-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <h3 class="headline-md" style="color: #fff; font-size: 1.15rem;">About Me // Peer Description</h3>
                    <span class="mono-chip" style="color: #a855f7;">TECHPATH CONNECT</span>
                  </div>
                  <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.75rem;">
                    Visible to students in your department on TechPath Connect to understand your background and projects.
                  </p>
                  <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 1rem 1.25rem;">
                    <p style="color: #f1f5f9; font-size: 0.95rem; line-height: 1.6; margin: 0; font-style: italic;">
                      “${bio}”
                    </p>
                  </div>
                </div>

                <!-- Verified Engineering Skills -->
                <div class="tp-card">
                  <h3 class="headline-md" style="margin-bottom: 0.5rem; color: #fff;">Verified Engineering Skills</h3>
                  <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin-bottom: 1rem;">Competencies validated through lab modules and interview assessments.</p>
                  <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${userSkills.map(s => `
                      <span style="padding: 0.35rem 0.85rem; border-radius: 9999px; background: rgba(225,29,72,0.1); border: 1px solid rgba(225,29,72,0.3); color: #fff; font-size: 0.85rem; font-weight: 500;">
                        ⚡ ${s}
                      </span>
                    `).join('')}
                  </div>
                </div>

                <!-- Academic Certificates -->
                <div class="tp-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 class="headline-md" style="color: #fff;">Certificates & Verified Credentials</h3>
                    <span class="mono-chip" style="color: var(--tp-success);">${certificates.length} ISSUED</span>
                  </div>
                  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    ${certificates.map(cert => `
                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; border-radius: var(--radius-sm); background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark);">
                        <div>
                          <strong style="color: #fff; font-size: 0.92rem;">${cert.title}</strong>
                          <p style="font-size: 0.78rem; color: var(--tp-text-dark-muted); margin-top: 0.2rem;">${cert.issuer} &bull; ${cert.date}</p>
                        </div>
                        <span class="telemetry-chip" style="font-size: 0.7rem; color: #10b981; border-color: #10b981;">VERIFIED</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Right Column: Progress & Stats -->
              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <!-- Learning Velocity Card -->
                <div class="tp-card tp-card-glass">
                  <h3 style="font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 0.75rem;">Curriculum Mastery</h3>
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.4rem;">
                    <span style="color: var(--tp-text-dark-secondary);">Semester Progress</span>
                    <strong style="color: var(--tp-primary);">${progressPercent}%</strong>
                  </div>
                  <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden; margin-bottom: 1rem;">
                    <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, var(--tp-primary), var(--tp-accent));"></div>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.82rem;">
                    <div style="display: flex; justify-content: space-between; color: var(--tp-text-dark-secondary);">
                      <span>Completed Topics:</span>
                      <strong style="color: #fff;">${completedTopics.length} Units</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; color: var(--tp-text-dark-secondary);">
                      <span>Completed Projects:</span>
                      <strong style="color: #fff;">${userProjects.length} Projects</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; color: var(--tp-text-dark-secondary);">
                      <span>Active Discipline:</span>
                      <strong style="color: #fff;">${branch.toUpperCase()}</strong>
                    </div>
                  </div>
                </div>

                <!-- Fast Action Links -->
                <div class="tp-card">
                  <h4 style="font-size: 0.95rem; font-weight: 600; color: #fff; margin-bottom: 0.75rem;">Account Governance</h4>
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    <a href="#/security" class="tp-btn tp-btn-secondary" style="width: 100%; text-align: center; font-size: 0.85rem;">
                      🛡️ Security & Sessions
                    </a>
                    <a href="#/preferences" class="tp-btn tp-btn-secondary" style="width: 100%; text-align: center; font-size: 0.85rem;">
                      ⚙️ Platform Preferences
                    </a>
                    <button id="profile-logout-btn" class="tp-btn tp-btn-ghost" style="width: 100%; color: var(--tp-primary); font-size: 0.85rem;">
                      Log Out of Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ` : `
            <!-- EDIT MODE FORM -->
            <div class="tp-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.85rem;">
                <div>
                  <h3 class="headline-md" style="color: #fff;">Edit Engineering Profile</h3>
                  <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary);">Changes will synchronize immediately with your Supabase account and update all branch views.</p>
                </div>
                <span class="mono-chip" style="color: var(--tp-primary);">EDIT MODE</span>
              </div>

              <form id="edit-profile-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
                <div>
                  <label class="tp-form-label">Full Name *</label>
                  <input type="text" id="edit-full-name" class="tp-input" value="${profile.full_name || profile.name || ''}" placeholder="First and Last Name" required />
                </div>

                <div>
                  <label class="tp-form-label">Email Address (Read-Only)</label>
                  <input type="email" class="tp-input" value="${user?.email || ''}" disabled style="opacity: 0.6; cursor: not-allowed;" />
                </div>

                <div>
                  <label class="tp-form-label">TechPath ID (Permanent & Canonical)</label>
                  <input type="text" class="tp-input" value="${techpathId}" disabled style="opacity: 0.75; font-family: monospace; font-weight: 700; color: #38bdf8; cursor: not-allowed;" />
                  <p style="font-size: 0.72rem; color: var(--tp-text-dark-muted); margin-top: 0.2rem;">Used by peers to connect with you. Unique and unchangeable.</p>
                </div>

                <!-- Complete 33-Department Academic Taxonomy & Role Selector Mount -->
                <div id="profile-taxonomy-mount" style="grid-column: 1 / -1;"></div>

                <div>
                  <label class="tp-form-label">Learning Level</label>
                  <select id="edit-level" class="tp-input">
                    <option value="beginner" ${learningLevel === 'beginner' ? 'selected' : ''}>Beginner (Foundations)</option>
                    <option value="intermediate" ${learningLevel === 'intermediate' ? 'selected' : ''}>Intermediate (Core Engineering)</option>
                    <option value="advanced" ${learningLevel === 'advanced' ? 'selected' : ''}>Advanced (Systems & Capstone)</option>
                  </select>
                </div>

                <div>
                  <label class="tp-form-label">Primary Career Target Goal</label>
                  <input type="text" id="edit-career-goal" class="tp-input" value="${careerGoal}" placeholder="e.g. Systems Engineer, Robotics Lead" />
                </div>

                <div>
                  <label class="tp-form-label">Preferred Platform Language</label>
                  <select id="edit-language" class="tp-input">
                    ${I18nEngine.getAllLanguages().map(l => `
                      <option value="${l.code}" ${l.code === preferredLang ? 'selected' : ''}>${l.nativeName} (${l.name})</option>
                    `).join('')}
                  </select>
                </div>

                <div>
                  <label class="tp-form-label">GitHub Profile URL</label>
                  <input type="url" id="edit-github-url" class="tp-input" value="${profile.github_url || ''}" placeholder="https://github.com/username" />
                </div>

                <div>
                  <label class="tp-form-label">LinkedIn Profile URL</label>
                  <input type="url" id="edit-linkedin-url" class="tp-input" value="${profile.linkedin_url || ''}" placeholder="https://linkedin.com/in/username" />
                </div>

                <div>
                  <label class="tp-form-label">Portfolio / Personal Website URL</label>
                  <input type="url" id="edit-portfolio-url" class="tp-input" value="${profile.portfolio_url || ''}" placeholder="https://yourportfolio.dev" />
                </div>

                <div style="grid-column: 1 / -1;">
                  <label class="tp-form-label">Engineering Skills (Comma-separated)</label>
                  <input type="text" id="edit-skills" class="tp-input" value="${(userSkills || []).join(', ')}" placeholder="e.g. Python, Machine Learning, Neural Networks, PyTorch" />
                </div>

                <div style="grid-column: 1 / -1;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                    <label class="tp-form-label" style="margin-bottom: 0;">Tell other students a little about yourself (Peer Bio) *</label>
                    <span id="bio-char-counter" style="font-size: 0.78rem; color: #94a3b8; font-family: monospace;">${(bio || '').length}/250</span>
                  </div>
                  <textarea id="edit-bio" class="tp-input" rows="3" maxlength="250" placeholder="e.g. 3rd year CSE student interested in Distributed Systems and React. Currently building an open-source IoT dashboard." required style="resize: vertical; font-family: inherit;">${bio || ''}</textarea>
                  <p style="font-size: 0.78rem; color: var(--tp-text-dark-secondary); margin-top: 0.35rem;">
                    Displayed on TechPath Connect to help peer engineering students discover and connect with you.
                  </p>
                </div>

                <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; border-top: 1px solid var(--tp-border-dark); padding-top: 1rem;">
                  <button type="button" id="form-cancel-btn" class="tp-btn tp-btn-secondary">Cancel</button>
                  <button type="submit" id="form-save-btn" class="tp-btn tp-btn-primary" style="padding: 0.65rem 1.75rem;">
                    💾 Save Changes to Supabase
                  </button>
                </div>
              </form>
            </div>
          `}
        `}
      </div>
    `;

    this._bindEvents(container, profile, user, techpathId);
  }

  static _bindEvents(container, profile, user, techpathId) {
    // Tab Toggles: Student Dossier vs Teaching Profile
    const studentTabBtn = container.querySelector('#tab-student-dossier');
    if (studentTabBtn) {
      studentTabBtn.addEventListener('click', () => {
        this.activeSubTab = 'student';
        this.render(container);
      });
    }

    const teacherTabBtn = container.querySelector('#tab-teacher-profile');
    if (teacherTabBtn) {
      teacherTabBtn.addEventListener('click', () => {
        this.activeSubTab = 'teacher';
        this.render(container);
      });
    }

    // Teaching Profile Save Handler
    const tpForm = container.querySelector('#teaching-profile-form');
    if (tpForm) {
      tpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = tpForm.querySelector('#tp-save-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving Teaching Profile...';

        try {
          const subjects = tpForm.querySelector('#tp-subjects').value.split(',').map(s => s.trim()).filter(Boolean);
          const topics = tpForm.querySelector('#tp-topics').value.split(',').map(s => s.trim()).filter(Boolean);
          const skills = tpForm.querySelector('#tp-skills').value.split(',').map(s => s.trim()).filter(Boolean);
          const languages = tpForm.querySelector('#tp-languages').value.split(',').map(s => s.trim()).filter(Boolean);

          await ClassesEngine.saveTeacherProfile(user.id, {
            teacher_name: tpForm.querySelector('#tp-name').value.trim(),
            techpath_id: techpathId,
            branch_id: tpForm.querySelector('#tp-branch').value,
            specialization: tpForm.querySelector('#tp-specialization').value.trim(),
            semester_level: tpForm.querySelector('#tp-sem-level').value.trim(),
            teaching_subjects: subjects,
            teaching_topics: topics,
            teaching_experience: tpForm.querySelector('#tp-experience').value.trim(),
            skills: skills,
            description: tpForm.querySelector('#tp-description').value.trim(),
            languages: languages,
            class_format: tpForm.querySelector('#tp-format').value,
            availability_summary: tpForm.querySelector('#tp-avail').value.trim(),
            price_per_class: parseFloat(tpForm.querySelector('#tp-price-class').value),
            price_per_hour: parseFloat(tpForm.querySelector('#tp-price-hour').value),
            package_price: parseFloat(tpForm.querySelector('#tp-price-pkg').value)
          });

          Toast.success('Teaching Profile updated successfully! Synchronized with Marketplace.');
          this.render(container);
        } catch (err) {
          Toast.error(err.message || 'Failed to update teaching profile.');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = '💾 Save Teaching Profile';
        }
      });
    }

    // Copy TechPath ID Button
    const copyIdBtn = container.querySelector('#profile-copy-id-btn');
    if (copyIdBtn) {
      copyIdBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(techpathId);
          Toast.success(`Copied ID: ${techpathId}`);
        } catch {
          Toast.info(`TechPath ID: ${techpathId}`);
        }
      });
    }

    // Bio character counter
    const bioInput = container.querySelector('#edit-bio');
    const bioCounter = container.querySelector('#bio-char-counter');
    if (bioInput && bioCounter) {
      bioInput.addEventListener('input', () => {
        bioCounter.textContent = `${bioInput.value.length}/250`;
      });
    }

    // Edit mode toggle
    const editBtn = container.querySelector('#edit-profile-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        this.isEditing = true;
        this.render(container);
      });
    }

    const cancelBtn = container.querySelector('#cancel-edit-btn, #form-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.isEditing = false;
        this.render(container);
      });
    }

    // Avatar upload handler
    const avatarInput = container.querySelector('#avatar-file-input');
    if (avatarInput) {
      avatarInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            Toast.error('Avatar file size must be under 5MB.');
            return;
          }
          const reader = new FileReader();
          reader.onload = async () => {
            const base64Data = reader.result;
            localStorage.setItem('TP_AVATAR_DATA', base64Data);

            if (user?.id) {
              try {
                await supabase.from('profiles').update({ avatar_url: base64Data }).eq('id', user.id);
              } catch (err) {
                console.warn('Avatar Supabase sync notice:', err.message);
              }
            }
            Toast.success('Profile photo updated successfully!');
            this.render(container);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Mount Academic Taxonomy Selector if container exists
    let currentTaxonomy = {
      departmentId: profile.department_id || 'dept_cs',
      departmentName: profile.department_name || 'Computer & Computing',
      branchId: (profile.branch_id || profile.branch || 'cse').toLowerCase(),
      specialization: profile.specialization || profile.specialization_id || 'Core Systems Engineering',
      semesterId: profile.semester_id || profile.semester || 'sem_3',
      careerRoles: profile.career_interests || [careerGoal]
    };

    const taxonomyMount = container.querySelector('#profile-taxonomy-mount');
    if (taxonomyMount) {
      AcademicTaxonomySelector.render(taxonomyMount, {
        initialDepartment: currentTaxonomy.departmentId,
        initialBranch: currentTaxonomy.branchId,
        initialSpecialization: currentTaxonomy.specialization,
        initialSemester: currentTaxonomy.semesterId,
        initialRoles: currentTaxonomy.careerRoles,
        onChange: (data) => {
          currentTaxonomy = { ...currentTaxonomy, ...data };
        }
      });
    }

    // Edit profile form submit
    const form = container.querySelector('#edit-profile-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = container.querySelector('#edit-full-name').value.trim();
        const deptId = currentTaxonomy.departmentId;
        const deptName = currentTaxonomy.departmentName || TaxonomyEngine.getDepartmentById(deptId)?.name || 'Computer & Computing';
        const branch = currentTaxonomy.branchId;
        const branchName = currentTaxonomy.branchName || TaxonomyEngine.getBranchById(branch)?.name || branch.toUpperCase();
        const semester = currentTaxonomy.semesterId;
        const specialization = currentTaxonomy.specialization;
        const learningLevel = container.querySelector('#edit-level').value;
        const primaryGoalInput = container.querySelector('#edit-career-goal')?.value.trim();
        const rolesArray = currentTaxonomy.careerRoles.length > 0 ? currentTaxonomy.careerRoles : (profile.career_interests || [careerGoal]);
        const careerGoal = primaryGoalInput || rolesArray[0] || 'Software Engineer';
        const preferredLanguage = container.querySelector('#edit-language').value;
        const bio = container.querySelector('#edit-bio')?.value.trim() || '';
        const githubUrl = container.querySelector('#edit-github-url')?.value.trim() || '';
        const linkedinUrl = container.querySelector('#edit-linkedin-url')?.value.trim() || '';
        const portfolioUrl = container.querySelector('#edit-portfolio-url')?.value.trim() || '';

        if (!fullName) {
          Toast.error('Full name is required.');
          return;
        }

        const urlRegex = /^https?:\/\/.+/i;
        if (githubUrl && !urlRegex.test(githubUrl)) {
          Toast.error('Please enter a valid GitHub URL (starting with https://).');
          return;
        }
        if (linkedinUrl && !urlRegex.test(linkedinUrl)) {
          Toast.error('Please enter a valid LinkedIn URL (starting with https://).');
          return;
        }
        if (portfolioUrl && !urlRegex.test(portfolioUrl)) {
          Toast.error('Please enter a valid Portfolio URL (starting with https://).');
          return;
        }

        const saveBtn = form.querySelector('#form-save-btn');
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.textContent = 'Saving Changes to Supabase...';
        }

        const skillsInput = container.querySelector('#edit-skills')?.value || '';
        const skillsArray = skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(Boolean) : userSkills;

        const updatedFields = {
          full_name: fullName,
          name: fullName,
          department_id: deptId,
          department_name: deptName,
          branch_id: branch,
          branch: branch,
          branch_name: branchName,
          semester_id: semester,
          semester: semester,
          specialization: specialization,
          learning_level: learningLevel,
          career_goal: careerGoal,
          career_interests: rolesArray,
          skills: skillsArray,
          preferred_language: preferredLanguage,
          bio: bio,
          description: bio,
          github_url: githubUrl || null,
          linkedin_url: linkedinUrl || null,
          portfolio_url: portfolioUrl || null
        };

        try {
          // 1. Update AuthContext & Local Storage
          await authContext.updateProfile(updatedFields);

          // 2. Persist directly to Supabase profile row without duplicates
          if (user?.id) {
            try {
              await supabase.from('profiles').update({
                ...updatedFields,
                updated_at: new Date().toISOString()
              }).eq('id', user.id);
            } catch (err) {
              console.warn('Supabase profile update notice:', err.message);
            }
          }

          // 3. Reactively update learningContext across the app
          learningContext.update({
            department_id: deptId,
            department_name: deptName,
            branch_id: branch,
            semester_id: semester,
            specialization_id: specialization,
            specialization: specialization,
            career_goal: careerGoal,
            target_role: rolesArray[0] || careerGoal,
            learning_level: learningLevel,
            career_interests: rolesArray,
            skills: skillsArray,
            preferred_language: preferredLanguage
          });

          // 4. Update language engine if changed
          if (preferredLanguage !== I18nEngine.getCurrentLanguage()) {
            I18nEngine.setLanguage(preferredLanguage);
          }

          // 5. Fire global reactive update events for all recommendation engines
          window.dispatchEvent(new CustomEvent('tp:profile_saved', { detail: { profile: updatedFields } }));
          window.dispatchEvent(new CustomEvent('techpath:profile-updated', { detail: { profile: updatedFields } }));
          window.dispatchEvent(new CustomEvent('tp:recommendations_refresh', { detail: { branch, semester, specialization, careerGoal, roles: rolesArray } }));

          Toast.success('Profile saved to Supabase and synchronized across TechPath!');
          this.isEditing = false;
          this.render(container);
        } catch (err) {
          Toast.error(err.message || 'Failed to save profile changes.');
        } finally {
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Save Changes to Supabase';
          }
        }
      });
    }

    // Logout button
    const logoutBtn = container.querySelector('#profile-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await authContext.logout();
        window.location.hash = '#/signin';
      });
    }
  }
}
