/**
 * TECHPATH — ADVANCED RESUME BUILDER & ATS STUDIO
 * Full interactive Resume Builder with prefill from academic profile,
 * live multi-template rendering, add/edit/delete/reorder sections,
 * 5 professional templates (ATS, Modern, Minimal, Engineering, Student),
 * real PDF export & printing, and user database persistence.
 */

import { authContext } from '../context/AuthContext.js';
import { learningContext } from '../context/LearningContext.js';
import { dbStore } from '../db/store.js';
import { Toast } from '../components/Toast.js';
import { TaxonomyEngine } from '../services/TaxonomyEngine.js';
import { ResumeEngine, TARGET_ENGINEERING_ROLES } from '../services/ResumeEngine.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export class ResumePage {
  static activeTemplate = 'ats'; // 'ats' | 'modern' | 'minimal' | 'engineering' | 'student'
  static activeResume = null;
  static isPreviewOnly = false;
  static activeTargetRole = 'role_swe';

  static async render(container) {
    const user = authContext.getUser();
    const profile = authContext.getProfile() || user?.profile || {};
    const ctx = learningContext.get();

    // 1. Load or Initialize Resume for Authenticated User
    const branch = (profile.branch_id || profile.branch || ctx.branch_id || 'cse').toLowerCase();
    const branchObj = TaxonomyEngine.getBranchById(branch) || TaxonomyEngine.ALL_BRANCHES[0];
    const branchName = branchObj ? branchObj.name : branch.toUpperCase();
    const semester = (profile.semester_id || profile.semester || ctx.semester_id || 'sem_5').replace('sem_', '');
    const userSkills = profile.skills || ['Data Structures & Algorithms', 'Python', 'Git', 'System Design'];
    const certs = JSON.parse(localStorage.getItem('TP_CERTIFICATES') || '[]');

    const userId = user?.id || 'usr_guest';
    let userResumes = [];
    try {
      userResumes = await dbStore.filter('resumes', r => r.user_id === userId);
    } catch { /* proceed */ }

    if (!this.activeResume) {
      if (userResumes.length > 0) {
        this.activeResume = userResumes[0];
      } else {
        // Initialize default prefilled resume from user's authentic profile
        this.activeResume = {
          id: 'res_' + Date.now(),
          user_id: userId,
          title: `${profile.full_name || 'Engineering'} Technical Resume`,
          template: 'ats',
          personal: {
            name: profile.full_name || profile.name || (user?.email ? user.email.split('@')[0] : 'Engineer Scholar'),
            email: user?.email || 'scholar@techpath.edu',
            phone: profile.phone || '+91 98765 43210',
            location: profile.location || 'India',
            title: profile.career_goal || (branchObj?.roles?.[0] || 'Software Engineer'),
            website: '',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com/in'
          },
          summary: profile.bio || `Ambitious engineering student specialized in ${branchName}, Semester ${semester}. Passionate about robust systems architecture, distributed computing, and hands-on capstone engineering.`,
          objective: `Seeking an impactful engineering internship or entry-level role in ${profile.career_goal || 'Technology'} to apply rigorous engineering principles and solve high-scale challenges.`,
          education: [
            {
              id: 'edu_1',
              degree: `Bachelor of Technology (B.Tech) in ${branchName}`,
              institution: 'Engineering Institute of Technology',
              year: '2022 – 2026',
              gpa: '8.7 / 10.0 CGPA',
              coursework: 'Data Structures, Operating Systems, Computer Networks, Database Architecture'
            }
          ],
          skills: [
            { category: 'Core Disciplines', items: userSkills.join(', ') },
            { category: 'Languages & Tools', items: 'Python, C++, SQL, Linux, Git & GitHub, Docker' }
          ],
          projects: [
            {
              id: 'proj_1',
              title: 'Distributed Telemetry & Real-Time Monitoring Pipeline',
              techStack: 'Python, Docker, Redis, WebSocket',
              link: 'https://github.com/project-demo',
              bullets: [
                'Engineered an asynchronous telemetry ingestion engine processing 10,000 events/sec with sub-10ms latency.',
                'Implemented resilient failover caching and memory-mapped persistent buffers.'
              ]
            }
          ],
          experience: [],
          internships: [],
          certifications: certs.map((c, i) => ({
            id: 'cert_' + i,
            title: c.title || 'Technical Certification',
            issuer: c.issuer || 'TechPath Academic Board',
            date: c.date || '2026',
            link: ''
          })),
          achievements: [
            {
              id: 'ach_1',
              title: 'Academic Honor Roll & Top Percentile in Engineering Core',
              year: '2025',
              description: 'Awarded department merit certificate for excellence in systems and algorithmic benchmarks.'
            }
          ],
          publications: [],
          languages: [
            { id: 'lang_1', name: 'English', proficiency: 'Professional Working' }
          ],
          volunteer: [],
          updated_at: new Date().toISOString()
        };
      }
    }

    const res = this.activeResume;
    this.activeTemplate = res.template || this.activeTemplate;

    // Render Master Layout
    container.innerHTML = `
      <style>
        @media print {
          body * { visibility: hidden !important; }
          #tp-printable-resume, #tp-printable-resume * { visibility: visible !important; }
          #tp-printable-resume {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0.5in !important;
            box-shadow: none !important;
            background: #fff !important;
            color: #000 !important;
          }
          .tp-nav-rail, .tp-header, .tp-btn, .tp-resume-controls { display: none !important; }
        }
        .tp-resume-sheet {
          background: #ffffff;
          color: #1e293b;
          width: 100%;
          min-height: 1050px;
          padding: 2.5rem;
          border-radius: var(--radius-sm);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
          font-family: var(--font-sans);
          transition: all 0.2s ease;
          overflow: hidden;
        }
        .tp-resume-sheet h1, .tp-resume-sheet h2, .tp-resume-sheet h3 {
          color: #0f172a;
          margin-top: 0;
        }
        .tp-resume-field-group {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--tp-border-dark);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          margin-bottom: 1rem;
        }
      </style>

      <div class="tp-page" style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 1400px; width: 100%; margin: 0 auto;">
        
        <!-- Header Toolbar -->
        <div class="tp-resume-controls" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.4rem;">
              <span class="pulse-beacon"></span> RESUME STUDIO // ATS ENGINE // ${this.activeTemplate.toUpperCase()}
            </div>
            <h1 class="display-lg" style="margin: 0;">Interactive Resume Builder</h1>
            <p style="color: var(--tp-text-dark-secondary); font-size: 0.88rem; margin-top: 0.25rem;">
              Construct verified, ATS-compliant technical resumes. Prefilled from your academic dossier and synchronized with Mock Interviews.
            </p>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <!-- Template Selector -->
            <select id="resume-template-select" class="tp-input" style="padding: 0.45rem 0.8rem; font-size: 0.82rem; width: auto; background: #0f172a; color: #fff;">
              <option value="ats" ${this.activeTemplate === 'ats' ? 'selected' : ''}>ATS-Friendly (Standard Clean)</option>
              <option value="modern" ${this.activeTemplate === 'modern' ? 'selected' : ''}>Modern (Two-Column Accent)</option>
              <option value="minimal" ${this.activeTemplate === 'minimal' ? 'selected' : ''}>Minimal (Clean Typography)</option>
              <option value="engineering" ${this.activeTemplate === 'engineering' ? 'selected' : ''}>Engineering (Technical Specs)</option>
              <option value="student" ${this.activeTemplate === 'student' ? 'selected' : ''}>Student (Coursework Forward)</option>
            </select>

            <button id="resume-coach-btn" class="tp-btn tp-btn-sm" style="font-size: 0.82rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; font-weight: 700; box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4); display: inline-flex; align-items: center; gap: 0.4rem;">
              <span>🤖</span> AI Resume Coach
            </button>
            <button id="resume-save-btn" class="tp-btn tp-btn-primary tp-btn-sm" style="font-size: 0.82rem;">
              💾 Save Resume
            </button>
            <button id="resume-duplicate-btn" class="tp-btn tp-btn-secondary tp-btn-sm" style="font-size: 0.82rem;">
              📋 Duplicate
            </button>
            <button id="resume-print-btn" class="tp-btn tp-btn-secondary tp-btn-sm" style="font-size: 0.82rem;">
              🖨️ Print / PDF
            </button>
            <a href="#/mock-interview" class="tp-btn tp-btn-accent tp-btn-sm" style="font-size: 0.82rem;">
              🎤 Launch Interview With Resume →
            </a>
          </div>
        </div>

        <!-- 2-Column Studio Grid: Left = Editor, Right = Live Preview -->
        <div style="display: grid; grid-template-columns: minmax(420px, 1.1fr) minmax(480px, 1fr); gap: 1.75rem; align-items: start;" class="tp-resume-studio-grid">
          
          <!-- LEFT COLUMN: Section Editor Controls -->
          <div class="tp-resume-editor" style="display: flex; flex-direction: column; gap: 1rem; max-height: calc(100vh - 180px); overflow-y: auto; padding-right: 0.5rem;">
            
            <!-- 1. Personal Information -->
            <div class="tp-resume-field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <h3 class="headline-md" style="font-size: 1.05rem; color: #fff; margin: 0;">1. Personal Information</h3>
                <span class="mono-chip" style="font-size: 0.68rem; color: var(--tp-info);">PREFILLED</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <div>
                  <label class="tp-form-label">Full Name *</label>
                  <input type="text" id="inp-pers-name" class="tp-input" value="${res.personal.name}" />
                </div>
                <div>
                  <label class="tp-form-label">Target Professional Title *</label>
                  <input type="text" id="inp-pers-title" class="tp-input" value="${res.personal.title}" />
                </div>
                <div>
                  <label class="tp-form-label">Email Address *</label>
                  <input type="email" id="inp-pers-email" class="tp-input" value="${res.personal.email}" />
                </div>
                <div>
                  <label class="tp-form-label">Phone Number</label>
                  <input type="text" id="inp-pers-phone" class="tp-input" value="${res.personal.phone}" />
                </div>
                <div>
                  <label class="tp-form-label">Location / City</label>
                  <input type="text" id="inp-pers-loc" class="tp-input" value="${res.personal.location}" />
                </div>
                <div>
                  <label class="tp-form-label">Portfolio Website</label>
                  <input type="url" id="inp-pers-web" class="tp-input" value="${res.personal.website || ''}" placeholder="https://yourportfolio.dev" />
                </div>
                <div>
                  <label class="tp-form-label">GitHub Profile</label>
                  <input type="url" id="inp-pers-gh" class="tp-input" value="${res.personal.github}" />
                </div>
                <div>
                  <label class="tp-form-label">LinkedIn Profile</label>
                  <input type="url" id="inp-pers-li" class="tp-input" value="${res.personal.linkedin}" />
                </div>
              </div>
            </div>

            <!-- 2. Professional Summary & Career Objective -->
            <div class="tp-resume-field-group">
              <h3 class="headline-md" style="font-size: 1.05rem; color: #fff; margin: 0 0 0.75rem 0;">2. Professional Summary & Career Objective</h3>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div>
                  <label class="tp-form-label">Professional Summary</label>
                  <textarea id="inp-summary" class="tp-input" rows="3" style="resize: vertical;">${res.summary}</textarea>
                </div>
                <div>
                  <label class="tp-form-label">Career Objective</label>
                  <textarea id="inp-objective" class="tp-input" rows="2" style="resize: vertical;">${res.objective}</textarea>
                </div>
              </div>
            </div>

            <!-- 3. Education -->
            <div class="tp-resume-field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <h3 class="headline-md" style="font-size: 1.05rem; color: #fff; margin: 0;">3. Education</h3>
                <button type="button" id="btn-add-edu" class="tp-btn tp-btn-secondary tp-btn-xs">+ Add Degree</button>
              </div>
              <div id="edu-items-container" style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${res.education.map((edu, idx) => `
                  <div class="tp-card" style="padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark);" data-edu-idx="${idx}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <span style="font-size: 0.78rem; font-weight: 600; color: #fff;">Degree Entry #${idx + 1}</span>
                      <button type="button" class="btn-del-edu" data-idx="${idx}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.8rem;">✕ Remove</button>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                      <input type="text" class="tp-input edu-degree" value="${edu.degree}" placeholder="Degree Title" />
                      <input type="text" class="tp-input edu-inst" value="${edu.institution}" placeholder="University / College" />
                      <input type="text" class="tp-input edu-year" value="${edu.year}" placeholder="Graduation Year" />
                      <input type="text" class="tp-input edu-gpa" value="${edu.gpa}" placeholder="CGPA / Grade" />
                      <div style="grid-column: 1 / -1;">
                        <input type="text" class="tp-input edu-coursework" value="${edu.coursework || ''}" placeholder="Key Relevant Coursework" />
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 4. Technical Skills -->
            <div class="tp-resume-field-group">
              <h3 class="headline-md" style="font-size: 1.05rem; color: #fff; margin: 0 0 0.75rem 0;">4. Technical Skills & Core Disciplines</h3>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${res.skills.map((sk, idx) => `
                  <div style="display: grid; grid-template-columns: 140px 1fr; gap: 0.5rem;">
                    <input type="text" class="tp-input skill-cat" data-idx="${idx}" value="${sk.category}" />
                    <input type="text" class="tp-input skill-items" data-idx="${idx}" value="${sk.items}" />
                  </div>
                `).join('')}
                <button type="button" id="btn-add-skill-cat" class="tp-btn tp-btn-secondary tp-btn-xs" style="align-self: flex-start;">+ Add Skill Category</button>
              </div>
            </div>

            <!-- 5. Engineering Projects -->
            <div class="tp-resume-field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <h3 class="headline-md" style="font-size: 1.05rem; color: #fff; margin: 0;">5. Engineering Projects</h3>
                <button type="button" id="btn-add-proj" class="tp-btn tp-btn-secondary tp-btn-xs">+ Add Project</button>
              </div>
              <div id="proj-items-container" style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${res.projects.map((proj, idx) => `
                  <div class="tp-card" style="padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark);" data-proj-idx="${idx}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <span style="font-size: 0.78rem; font-weight: 600; color: #fff;">Project #${idx + 1}</span>
                      <button type="button" class="btn-del-proj" data-idx="${idx}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.8rem;">✕ Remove</button>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                      <input type="text" class="tp-input proj-title" value="${proj.title}" placeholder="Project Title" />
                      <input type="text" class="tp-input proj-tech" value="${proj.techStack}" placeholder="Technologies (e.g. Python, Docker)" />
                      <div style="grid-column: 1 / -1;">
                        <input type="text" class="tp-input proj-link" value="${proj.link || ''}" placeholder="Repository / Live Demo Link" />
                      </div>
                    </div>
                    <label class="tp-form-label" style="font-size: 0.75rem;">Bullet Points (One per line)</label>
                    <textarea class="tp-input proj-bullets" rows="2" style="font-size: 0.82rem; resize: vertical;">${(proj.bullets || []).join('\n')}</textarea>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 6. Professional Experience & Internships -->
            <div class="tp-resume-field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <h3 class="headline-md" style="font-size: 1.05rem; color: #fff; margin: 0;">6. Work Experience & Internships</h3>
                <button type="button" id="btn-add-exp" class="tp-btn tp-btn-secondary tp-btn-xs">+ Add Experience</button>
              </div>
              <div id="exp-items-container" style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${res.experience.length === 0 ? `
                  <p style="font-size: 0.78rem; color: var(--tp-text-dark-muted); margin: 0;">No professional experience added yet. Click above to add internships, lab assistantships, or roles.</p>
                ` : res.experience.map((exp, idx) => `
                  <div class="tp-card" style="padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark);" data-exp-idx="${idx}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <span style="font-size: 0.78rem; font-weight: 600; color: #fff;">Role #${idx + 1}</span>
                      <button type="button" class="btn-del-exp" data-idx="${idx}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.8rem;">✕ Remove</button>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                      <input type="text" class="tp-input exp-title" value="${exp.title}" placeholder="Role Title" />
                      <input type="text" class="tp-input exp-comp" value="${exp.company}" placeholder="Organization / Lab" />
                      <input type="text" class="tp-input exp-dur" value="${exp.duration}" placeholder="Duration (e.g. June 2025 – August 2025)" />
                      <input type="text" class="tp-input exp-loc" value="${exp.location || ''}" placeholder="Location" />
                    </div>
                    <textarea class="tp-input exp-bullets" rows="2" style="font-size: 0.82rem; resize: vertical;">${(exp.bullets || []).join('\n')}</textarea>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 7. Certifications & Achievements -->
            <div class="tp-resume-field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <h3 class="headline-md" style="font-size: 1.05rem; color: #fff; margin: 0;">7. Certifications & Achievements</h3>
                <button type="button" id="btn-add-cert" class="tp-btn tp-btn-secondary tp-btn-xs">+ Add Certification</button>
              </div>
              <div id="cert-items-container" style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${res.certifications.map((cert, idx) => `
                  <div style="display: grid; grid-template-columns: 1fr 1fr 80px 40px; gap: 0.5rem; align-items: center;">
                    <input type="text" class="tp-input cert-title" data-idx="${idx}" value="${cert.title}" placeholder="Certificate Name" />
                    <input type="text" class="tp-input cert-issuer" data-idx="${idx}" value="${cert.issuer}" placeholder="Issuer" />
                    <input type="text" class="tp-input cert-date" data-idx="${idx}" value="${cert.date}" placeholder="Year" />
                    <button type="button" class="btn-del-cert" data-idx="${idx}" style="background: none; border: none; color: #ef4444; cursor: pointer;">✕</button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: Live Interactive Resume Preview -->
          <div style="position: sticky; top: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span class="mono-chip" style="color: var(--tp-success);">LIVE PREVIEW &bull; ${this.activeTemplate.toUpperCase()} TEMPLATE</span>
              <span style="font-size: 0.75rem; color: var(--tp-text-dark-muted);">Updates instantly as you type</span>
            </div>

            <!-- Printable Sheet -->
            <div id="tp-printable-resume" class="tp-resume-sheet">
              ${this._generateTemplateHtml(res, this.activeTemplate)}
            </div>
          </div>
        </div>

        <!-- AI Resume Coach Modal Host -->
        <div id="tp-resume-coach-modal-host"></div>

      </div>
    `;

    this._bindEvents(container, profile, userId);
  }

  /**
   * Generates clean, ATS-compliant HTML for the 5 supported templates
   */
  static _generateTemplateHtml(res, template) {
    const p = res.personal || {};
    const contactParts = [
      p.email,
      p.phone,
      p.location,
      p.linkedin ? `<a href="${p.linkedin}" style="color:inherit;text-decoration:none;">LinkedIn</a>` : null,
      p.github ? `<a href="${p.github}" style="color:inherit;text-decoration:none;">GitHub</a>` : null,
      p.website ? `<a href="${p.website}" style="color:inherit;text-decoration:none;">Portfolio</a>` : null
    ].filter(Boolean);

    // ──────────────────────────────────────────────────────────────────────────
    // 1. ATS-FRIENDLY TEMPLATE (Standard, maximum parseability)
    // ──────────────────────────────────────────────────────────────────────────
    if (template === 'ats') {
      return `
        <div style="line-height: 1.45; font-size: 10pt; color: #111827;">
          <div style="text-align: center; border-bottom: 2px solid #111827; padding-bottom: 8px; margin-bottom: 12px;">
            <h1 style="font-size: 20pt; font-weight: 700; margin: 0; color: #000; letter-spacing: -0.5px;">${p.name}</h1>
            <div style="font-size: 11pt; font-weight: 600; color: #374151; margin: 3px 0 6px 0;">${p.title}</div>
            <div style="font-size: 9pt; color: #4b5563;">
              ${contactParts.join(' &bull; ')}
            </div>
          </div>

          ${res.summary ? `
            <div style="margin-bottom: 12px;">
              <h2 style="font-size: 11pt; font-weight: 700; border-bottom: 1px solid #9ca3af; text-transform: uppercase; margin: 0 0 4px 0; padding-bottom: 2px;">Professional Summary</h2>
              <p style="margin: 0; font-size: 9.5pt; color: #374151; text-align: justify;">${res.summary}</p>
            </div>
          ` : ''}

          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 11pt; font-weight: 700; border-bottom: 1px solid #9ca3af; text-transform: uppercase; margin: 0 0 6px 0; padding-bottom: 2px;">Education</h2>
            ${res.education.map(e => `
              <div style="margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between; font-weight: 700;">
                  <span>${e.institution}</span>
                  <span>${e.year}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-style: italic; font-size: 9.5pt; color: #374151;">
                  <span>${e.degree}</span>
                  <span>${e.gpa}</span>
                </div>
                ${e.coursework ? `<div style="font-size: 8.5pt; color: #6b7280; margin-top: 2px;">Relevant Coursework: ${e.coursework}</div>` : ''}
              </div>
            `).join('')}
          </div>

          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 11pt; font-weight: 700; border-bottom: 1px solid #9ca3af; text-transform: uppercase; margin: 0 0 6px 0; padding-bottom: 2px;">Technical Skills</h2>
            ${res.skills.map(s => `
              <div style="font-size: 9.5pt; margin-bottom: 3px;">
                <strong>${s.category}:</strong> ${s.items}
              </div>
            `).join('')}
          </div>

          ${res.projects && res.projects.length > 0 ? `
            <div style="margin-bottom: 12px;">
              <h2 style="font-size: 11pt; font-weight: 700; border-bottom: 1px solid #9ca3af; text-transform: uppercase; margin: 0 0 6px 0; padding-bottom: 2px;">Technical & Capstone Projects</h2>
              ${res.projects.map(pr => `
                <div style="margin-bottom: 8px;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700;">
                    <span>${pr.title} ${pr.link ? `<a href="${pr.link}" style="font-size: 8pt; font-weight: normal; color: #2563eb;">[Link]</a>` : ''}</span>
                    <span style="font-weight: normal; font-size: 9pt; color: #4b5563;">${pr.techStack}</span>
                  </div>
                  <ul style="margin: 3px 0 0 16px; padding: 0; font-size: 9pt; color: #374151;">
                    ${(pr.bullets || []).map(b => `<li style="margin-bottom: 2px;">${b}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${res.experience && res.experience.length > 0 ? `
            <div style="margin-bottom: 12px;">
              <h2 style="font-size: 11pt; font-weight: 700; border-bottom: 1px solid #9ca3af; text-transform: uppercase; margin: 0 0 6px 0; padding-bottom: 2px;">Experience & Internships</h2>
              ${res.experience.map(x => `
                <div style="margin-bottom: 8px;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700;">
                    <span>${x.title} — ${x.company}</span>
                    <span>${x.duration}</span>
                  </div>
                  <ul style="margin: 3px 0 0 16px; padding: 0; font-size: 9pt; color: #374151;">
                    ${(x.bullets || []).map(b => `<li style="margin-bottom: 2px;">${b}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${res.certifications && res.certifications.length > 0 ? `
            <div>
              <h2 style="font-size: 11pt; font-weight: 700; border-bottom: 1px solid #9ca3af; text-transform: uppercase; margin: 0 0 6px 0; padding-bottom: 2px;">Certifications & Credentials</h2>
              <div style="font-size: 9pt; color: #374151;">
                ${res.certifications.map(c => `&bull; <strong>${c.title}</strong> — ${c.issuer} (${c.date})`).join('<br/>')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. MODERN TEMPLATE (Two-column layout with header accent)
    // ──────────────────────────────────────────────────────────────────────────
    if (template === 'modern') {
      return `
        <div style="font-size: 9.5pt; color: #334155; line-height: 1.45;">
          <div style="background: #0f172a; color: #fff; padding: 1.5rem; border-radius: 6px; margin: -2.5rem -2.5rem 1.5rem -2.5rem;">
            <h1 style="color: #fff; font-size: 22pt; margin: 0; font-weight: 800;">${p.name}</h1>
            <div style="color: #38bdf8; font-size: 11pt; font-weight: 600; margin-top: 4px;">${p.title}</div>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 8px; font-size: 8.5pt; color: #94a3b8;">
              ${contactParts.map(cp => `<span>${cp}</span>`).join(' &bull; ')}
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem;">
            <!-- Left Sidebar -->
            <div>
              <div style="margin-bottom: 1rem;">
                <h3 style="font-size: 10pt; text-transform: uppercase; color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 3px;">Technical Skills</h3>
                ${res.skills.map(s => `
                  <div style="margin-bottom: 6px; font-size: 9pt;">
                    <div style="font-weight: 700; color: #0f172a;">${s.category}</div>
                    <div style="color: #475569;">${s.items}</div>
                  </div>
                `).join('')}
              </div>

              <div>
                <h3 style="font-size: 10pt; text-transform: uppercase; color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 3px;">Certifications</h3>
                ${res.certifications.map(c => `
                  <div style="margin-bottom: 4px; font-size: 8.5pt;">
                    <strong>${c.title}</strong>
                    <div style="color: #64748b;">${c.issuer} &bull; ${c.date}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Right Main Body -->
            <div>
              ${res.summary ? `
                <div style="margin-bottom: 1rem;">
                  <h3 style="font-size: 10pt; text-transform: uppercase; color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 3px;">Executive Summary</h3>
                  <p style="margin: 0; font-size: 9.5pt;">${res.summary}</p>
                </div>
              ` : ''}

              <div style="margin-bottom: 1rem;">
                <h3 style="font-size: 10pt; text-transform: uppercase; color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 3px;">Education</h3>
                ${res.education.map(e => `
                  <div style="margin-bottom: 8px;">
                    <strong style="color: #0f172a;">${e.degree}</strong>
                    <div style="display: flex; justify-content: space-between; font-size: 8.5pt; color: #64748b;">
                      <span>${e.institution}</span>
                      <span>${e.year} &bull; ${e.gpa}</span>
                    </div>
                  </div>
                `).join('')}
              </div>

              ${res.projects && res.projects.length > 0 ? `
                <div>
                  <h3 style="font-size: 10pt; text-transform: uppercase; color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 3px;">Featured Projects</h3>
                  ${res.projects.map(pr => `
                    <div style="margin-bottom: 8px;">
                      <div style="font-weight: 700; color: #0f172a;">${pr.title}</div>
                      <div style="font-size: 8.5pt; color: #0284c7; margin-bottom: 2px;">${pr.techStack}</div>
                      <ul style="margin: 0 0 0 14px; padding: 0; font-size: 9pt;">
                        ${(pr.bullets || []).map(b => `<li>${b}</li>`).join('')}
                      </ul>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. MINIMAL TEMPLATE (Refined typography and clean spacing)
    // ──────────────────────────────────────────────────────────────────────────
    if (template === 'minimal') {
      return `
        <div style="font-family: Georgia, serif; line-height: 1.5; font-size: 10pt; color: #1e293b;">
          <div style="text-align: left; margin-bottom: 1.5rem;">
            <h1 style="font-size: 24pt; font-weight: normal; margin: 0; color: #000;">${p.name}</h1>
            <p style="font-style: italic; color: #64748b; margin: 4px 0 6px 0;">${p.title}</p>
            <div style="font-size: 8.5pt; color: #64748b;">
              ${contactParts.join(' &bull; ')}
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <div style="font-weight: bold; letter-spacing: 1px; font-size: 9pt; text-transform: uppercase; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px;">Summary</div>
            <p style="margin: 0; font-size: 9.5pt;">${res.summary}</p>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <div style="font-weight: bold; letter-spacing: 1px; font-size: 9pt; text-transform: uppercase; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px;">Education</div>
            ${res.education.map(e => `
              <div style="margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between;">
                  <strong>${e.degree}</strong>
                  <span>${e.year}</span>
                </div>
                <div style="color: #64748b; font-size: 9pt;">${e.institution} &mdash; ${e.gpa}</div>
              </div>
            `).join('')}
          </div>

          <div style="margin-bottom: 1.25rem;">
            <div style="font-weight: bold; letter-spacing: 1px; font-size: 9pt; text-transform: uppercase; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px;">Core Competencies</div>
            ${res.skills.map(s => `
              <div style="margin-bottom: 3px; font-size: 9.5pt;">
                <em>${s.category}:</em> ${s.items}
              </div>
            `).join('')}
          </div>

          ${res.projects && res.projects.length > 0 ? `
            <div>
              <div style="font-weight: bold; letter-spacing: 1px; font-size: 9pt; text-transform: uppercase; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px;">Projects</div>
              ${res.projects.map(pr => `
                <div style="margin-bottom: 8px;">
                  <strong>${pr.title}</strong> (${pr.techStack})
                  <div style="font-size: 9pt; color: #475569; margin-top: 2px;">
                    ${(pr.bullets || []).join('. ')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. ENGINEERING TEMPLATE (Technical specs & systems highlights)
    // ──────────────────────────────────────────────────────────────────────────
    if (template === 'engineering') {
      return `
        <div style="font-family: var(--font-mono, monospace); line-height: 1.4; font-size: 9pt; color: #0f172a;">
          <div style="border: 2px solid #0f172a; padding: 12px; margin-bottom: 14px; background: #f8fafc;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <div>
                <h1 style="font-size: 18pt; margin: 0; text-transform: uppercase; letter-spacing: 1px;">// ${p.name}</h1>
                <div style="font-weight: bold; color: #dc2626; margin-top: 2px;">TARGET_ROLE = "${p.title}"</div>
              </div>
              <div style="text-align: right; font-size: 8pt; color: #475569;">
                ${p.email}<br/>${p.phone}<br/>${p.location}
              </div>
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="background: #0f172a; color: #fff; padding: 2px 6px; font-size: 8.5pt; font-weight: bold; display: inline-block;">[01] SYSTEM_ARCHITECTURE_AND_SKILLS</div>
            <div style="margin-top: 4px; padding-left: 8px; border-left: 2px solid #cbd5e1;">
              ${res.skills.map(s => `<div><strong>${s.category}</strong>: ${s.items}</div>`).join('')}
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="background: #0f172a; color: #fff; padding: 2px 6px; font-size: 8.5pt; font-weight: bold; display: inline-block;">[02] ACADEMIC_CREDENTIALS</div>
            <div style="margin-top: 4px; padding-left: 8px; border-left: 2px solid #cbd5e1;">
              ${res.education.map(e => `
                <div style="margin-bottom: 4px;">
                  <strong>${e.degree}</strong> @ ${e.institution} [${e.year}] &bull; SCORE: ${e.gpa}
                  ${e.coursework ? `<div style="font-size: 8pt; color: #475569;">CORE_MODULES: ${e.coursework}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          ${res.projects && res.projects.length > 0 ? `
            <div style="margin-bottom: 12px;">
              <div style="background: #0f172a; color: #fff; padding: 2px 6px; font-size: 8.5pt; font-weight: bold; display: inline-block;">[03] ENGINEERING_PROJECTS</div>
              <div style="margin-top: 4px; padding-left: 8px; border-left: 2px solid #cbd5e1;">
                ${res.projects.map(pr => `
                  <div style="margin-bottom: 6px;">
                    <strong>&gt; ${pr.title}</strong> [STACK: ${pr.techStack}]
                    ${(pr.bullets || []).map(b => `<div style="font-size: 8.5pt; color: #334155; margin-left: 10px;">- ${b}</div>`).join('')}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 5. STUDENT TEMPLATE (Education & Academic forward)
    // ──────────────────────────────────────────────────────────────────────────
    return `
      <div style="line-height: 1.5; font-size: 10pt; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 1.25rem;">
          <h1 style="font-size: 22pt; margin: 0; color: #0284c7;">${p.name}</h1>
          <div style="font-size: 11pt; color: #475569; font-weight: 600;">${p.title}</div>
          <div style="font-size: 8.5pt; color: #64748b; margin-top: 4px;">
            ${contactParts.join(' | ')}
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <h3 style="font-size: 10.5pt; color: #0284c7; border-bottom: 1.5px solid #0284c7; padding-bottom: 2px; margin: 0 0 6px 0;">ACADEMIC EDUCATION</h3>
          ${res.education.map(e => `
            <div style="margin-bottom: 6px;">
              <div style="display: flex; justify-content: space-between; font-weight: bold;">
                <span>${e.degree}</span>
                <span>${e.year}</span>
              </div>
              <div style="display: flex; justify-content: space-between; color: #475569; font-size: 9pt;">
                <span>${e.institution}</span>
                <span style="color: #0284c7; font-weight: 600;">GPA: ${e.gpa}</span>
              </div>
              ${e.coursework ? `<div style="font-size: 8.5pt; color: #64748b; margin-top: 2px;">Key Engineering Coursework: ${e.coursework}</div>` : ''}
            </div>
          `).join('')}
        </div>

        <div style="margin-bottom: 1rem;">
          <h3 style="font-size: 10.5pt; color: #0284c7; border-bottom: 1.5px solid #0284c7; padding-bottom: 2px; margin: 0 0 6px 0;">TECHNICAL SKILLS & COMPETENCIES</h3>
          ${res.skills.map(s => `
            <div style="margin-bottom: 3px; font-size: 9.5pt;">
              <strong>${s.category}:</strong> ${s.items}
            </div>
          `).join('')}
        </div>

        ${res.projects && res.projects.length > 0 ? `
          <div style="margin-bottom: 1rem;">
            <h3 style="font-size: 10.5pt; color: #0284c7; border-bottom: 1.5px solid #0284c7; padding-bottom: 2px; margin: 0 0 6px 0;">CAPSTONE & LAB PROJECTS</h3>
            ${res.projects.map(pr => `
              <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                  <span>${pr.title}</span>
                  <span style="font-weight: normal; font-size: 8.5pt; color: #64748b;">${pr.techStack}</span>
                </div>
                <ul style="margin: 2px 0 0 16px; padding: 0; font-size: 9pt; color: #475569;">
                  ${(pr.bullets || []).map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  static _bindEvents(container, profile = {}, userId = 'usr_guest') {
    const res = this.activeResume;
    const previewSheet = container.querySelector('#tp-printable-resume');

    const updateLivePreview = () => {
      if (previewSheet) {
        previewSheet.innerHTML = this._generateTemplateHtml(res, this.activeTemplate);
      }
    };

    // Template selection change
    const tplSelect = container.querySelector('#resume-template-select');
    if (tplSelect) {
      tplSelect.addEventListener('change', (e) => {
        this.activeTemplate = e.target.value;
        res.template = this.activeTemplate;
        updateLivePreview();
      });
    }

    // AI Resume Coach button listener
    const coachBtn = container.querySelector('#resume-coach-btn');
    if (coachBtn) {
      coachBtn.addEventListener('click', () => {
        this._openCoachModal(container, profile, userId);
      });
    }

    // Live personal inputs
    const syncPersonal = (field, id) => {
      const el = container.querySelector(id);
      if (el) {
        el.addEventListener('input', (e) => {
          res.personal[field] = e.target.value;
          updateLivePreview();
        });
      }
    };
    syncPersonal('name', '#inp-pers-name');
    syncPersonal('title', '#inp-pers-title');
    syncPersonal('email', '#inp-pers-email');
    syncPersonal('phone', '#inp-pers-phone');
    syncPersonal('location', '#inp-pers-loc');
    syncPersonal('website', '#inp-pers-web');
    syncPersonal('github', '#inp-pers-gh');
    syncPersonal('linkedin', '#inp-pers-li');

    // Summary & Objective
    const summaryInput = container.querySelector('#inp-summary');
    if (summaryInput) {
      summaryInput.addEventListener('input', (e) => {
        res.summary = e.target.value;
        updateLivePreview();
      });
    }
    const objInput = container.querySelector('#inp-objective');
    if (objInput) {
      objInput.addEventListener('input', (e) => {
        res.objective = e.target.value;
        updateLivePreview();
      });
    }

    // Skills inputs
    container.querySelectorAll('.skill-cat').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        if (res.skills[idx]) res.skills[idx].category = e.target.value;
        updateLivePreview();
      });
    });
    container.querySelectorAll('.skill-items').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        if (res.skills[idx]) res.skills[idx].items = e.target.value;
        updateLivePreview();
      });
    });

    // Add Skill Category
    const addSkillBtn = container.querySelector('#btn-add-skill-cat');
    if (addSkillBtn) {
      addSkillBtn.addEventListener('click', () => {
        res.skills.push({ category: 'Frameworks & Libraries', items: 'React, Node.js, Express, PostgreSQL' });
        this.render(container);
      });
    }

    // Add Education
    const addEduBtn = container.querySelector('#btn-add-edu');
    if (addEduBtn) {
      addEduBtn.addEventListener('click', () => {
        res.education.push({
          id: 'edu_' + Date.now(),
          degree: 'Secondary School Certification / Diploma',
          institution: 'Pre-University College',
          year: '2020 – 2022',
          gpa: '9.2 GPA',
          coursework: 'Physics, Mathematics, Computer Science'
        });
        this.render(container);
      });
    }

    // Delete Education
    container.querySelectorAll('.btn-del-edu').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        res.education.splice(idx, 1);
        this.render(container);
      });
    });

    // Education inputs live binding
    container.querySelectorAll('[data-edu-idx]').forEach(card => {
      const idx = parseInt(card.dataset.eduIdx, 10);
      card.querySelector('.edu-degree')?.addEventListener('input', e => { res.education[idx].degree = e.target.value; updateLivePreview(); });
      card.querySelector('.edu-inst')?.addEventListener('input', e => { res.education[idx].institution = e.target.value; updateLivePreview(); });
      card.querySelector('.edu-year')?.addEventListener('input', e => { res.education[idx].year = e.target.value; updateLivePreview(); });
      card.querySelector('.edu-gpa')?.addEventListener('input', e => { res.education[idx].gpa = e.target.value; updateLivePreview(); });
      card.querySelector('.edu-coursework')?.addEventListener('input', e => { res.education[idx].coursework = e.target.value; updateLivePreview(); });
    });

    // Add Project
    const addProjBtn = container.querySelector('#btn-add-proj');
    if (addProjBtn) {
      addProjBtn.addEventListener('click', () => {
        res.projects.push({
          id: 'proj_' + Date.now(),
          title: 'High-Throughput Distributed Cache',
          techStack: 'Go, gRPC, Consistent Hashing',
          link: '',
          bullets: [
            'Architected a distributed memory cache supporting dynamic node rebalancing.',
            'Benchmark tests verified sub-5ms response under 50,000 requests per second.'
          ]
        });
        this.render(container);
      });
    }

    // Delete Project
    container.querySelectorAll('.btn-del-proj').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        res.projects.splice(idx, 1);
        this.render(container);
      });
    });

    // Project inputs live binding
    container.querySelectorAll('[data-proj-idx]').forEach(card => {
      const idx = parseInt(card.dataset.projIdx, 10);
      card.querySelector('.proj-title')?.addEventListener('input', e => { res.projects[idx].title = e.target.value; updateLivePreview(); });
      card.querySelector('.proj-tech')?.addEventListener('input', e => { res.projects[idx].techStack = e.target.value; updateLivePreview(); });
      card.querySelector('.proj-link')?.addEventListener('input', e => { res.projects[idx].link = e.target.value; updateLivePreview(); });
      card.querySelector('.proj-bullets')?.addEventListener('input', e => {
        res.projects[idx].bullets = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
        updateLivePreview();
      });
    });

    // Save Resume to Database (IndexedDB + Supabase)
    const saveBtn = container.querySelector('#resume-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving Resume...';
        try {
          res.updated_at = new Date().toISOString();
          await dbStore.insert('resumes', res);
          localStorage.setItem('TP_ACTIVE_RESUME', JSON.stringify(res));
          learningContext.setResume(res.id);

          // Supabase persistence for authenticated user
          if (isSupabaseConfigured() && supabase && userId !== 'usr_guest') {
            try {
              await supabase.from('resumes').upsert({
                id: res.id,
                user_id: userId,
                title: res.title,
                parsed_data: res,
                updated_at: res.updated_at
              });
            } catch (supaErr) {
              console.warn('Supabase resume sync notice:', supaErr);
            }
          }

          Toast.success('Resume saved successfully!');
        } catch (err) {
          Toast.error('Saved to local storage.');
          localStorage.setItem('TP_ACTIVE_RESUME', JSON.stringify(res));
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = '💾 Save Resume';
        }
      });
    }

    // Duplicate Resume
    const dupBtn = container.querySelector('#resume-duplicate-btn');
    if (dupBtn) {
      dupBtn.addEventListener('click', async () => {
        const clone = JSON.parse(JSON.stringify(res));
        clone.id = 'res_' + Date.now();
        clone.title = `${res.title} (Copy)`;
        this.activeResume = clone;
        await dbStore.insert('resumes', clone);
        Toast.success('Resume duplicated successfully!');
        this.render(container);
      });
    }

    // Real PDF Export & Native Print
    const printBtn = container.querySelector('#resume-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  /**
   * Opens and renders the interactive AI Resume Coach modal
   */
  static async _openCoachModal(container, profile, userId) {
    const modalHost = container.querySelector('#tp-resume-coach-modal-host');
    if (!modalHost) return;

    modalHost.innerHTML = `
      <div class="tp-modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
        <div class="tp-modal-content tp-card" style="background: #0b1329; border: 1px solid rgba(99, 102, 241, 0.4); border-radius: var(--radius-md); max-width: 960px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; color: #fff; font-size: 1.1rem;">🤖 Analyzing Dossier...</div>
            <button id="coach-close-loading" class="tp-btn tp-btn-secondary tp-btn-xs">✕</button>
          </div>
          <div style="text-align: center; padding: 3rem 1rem;">
            <div class="tp-spinner" style="margin: 0 auto 1rem auto;"></div>
            <p style="color: var(--tp-text-dark-secondary); font-size: 0.95rem;">
              Evaluating technical competencies, project depth, and role benchmarks for ${this.activeTargetRole.toUpperCase()}...
            </p>
          </div>
        </div>
      </div>
    `;

    modalHost.querySelector('#coach-close-loading')?.addEventListener('click', () => {
      modalHost.innerHTML = '';
    });

    try {
      const analysis = await ResumeEngine.analyzeResumeWithCoach(
        this.activeResume,
        this.activeTargetRole,
        profile,
        userId
      );
      this._renderCoachModalContent(modalHost, analysis, profile, userId, container);
    } catch (err) {
      modalHost.innerHTML = `
        <div class="tp-modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
          <div class="tp-modal-content tp-card" style="background: #0b1329; border: 1px solid #ef4444; border-radius: var(--radius-md); max-width: 500px; width: 100%; padding: 2rem; text-align: center;">
            <h3 style="color: #ef4444; margin-bottom: 0.5rem;">Analysis Error</h3>
            <p style="color: var(--tp-text-dark-secondary); font-size: 0.88rem; margin-bottom: 1.5rem;">${err.message || 'Could not analyze resume at this time.'}</p>
            <div style="display: flex; gap: 0.5rem; justify-content: center;">
              <button id="coach-err-retry" class="tp-btn tp-btn-primary tp-btn-sm">Retry</button>
              <button id="coach-err-close" class="tp-btn tp-btn-secondary tp-btn-sm">Close</button>
            </div>
          </div>
        </div>
      `;
      modalHost.querySelector('#coach-err-close')?.addEventListener('click', () => { modalHost.innerHTML = ''; });
      modalHost.querySelector('#coach-err-retry')?.addEventListener('click', () => {
        this._openCoachModal(container, profile, userId);
      });
    }
  }

  /**
   * Renders the complete AI Resume Coach results, 8-category breakdown, skills alignment, and actionable rewrites
   */
  static _renderCoachModalContent(modalHost, analysis, profile, userId, container) {
    const role = analysis.targetRole;
    const score = analysis.strengthScore;
    const b = analysis.scoreBreakdown;

    modalHost.innerHTML = `
      <div class="tp-modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
        <div class="tp-modal-content tp-card" style="background: #0b1329; border: 1px solid rgba(99, 102, 241, 0.4); border-radius: var(--radius-md); max-width: 960px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- Modal Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1.25rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom: 0.35rem; display: inline-flex; align-items: center; gap: 0.4rem;">
                <span class="pulse-beacon"></span>
                <span>AI RESUME COACH // ROLE BENCHMARK ENGINE</span>
              </div>
              <h2 style="font-size: 1.4rem; font-weight: 800; color: #fff; margin: 0;">
                🤖 AI Resume Coach: ${role.name}
              </h2>
              <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin: 0.25rem 0 0 0;">
                Empirical technical critique comparing your written dossier directly against ${role.track} benchmarks.
              </p>
            </div>

            <button id="coach-close-btn" class="tp-btn tp-btn-secondary tp-btn-xs" style="font-size: 1.1rem; padding: 0.35rem 0.65rem;">
              ✕
            </button>
          </div>

          <!-- Target Role Switcher -->
          <div class="tp-card" style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); padding: 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div>
              <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--tp-text-dark-muted); letter-spacing: 0.5px;">Target Engineering Role</div>
              <div style="font-size: 0.88rem; color: #fff; font-weight: 600; margin-top: 0.15rem;">${role.track}</div>
            </div>

            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <label style="font-size: 0.82rem; color: var(--tp-text-dark-secondary);">Switch Role:</label>
              <select id="coach-target-role-select" class="tp-input" style="padding: 0.4rem 0.75rem; font-size: 0.82rem; width: auto; background: #0f172a; color: #fff;">
                ${TARGET_ENGINEERING_ROLES.map(r => `
                  <option value="${r.id}" ${r.id === this.activeTargetRole ? 'selected' : ''}>${r.name}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Overall Strength Scorecard (8 Transparent Categories) -->
          <div class="tp-card" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.04)); border: 1px solid rgba(99, 102, 241, 0.3); padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="mono-chip" style="background: ${score >= 75 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${score >= 75 ? '#34d399' : '#fbbf24'}; font-size: 0.8rem; font-weight: 800; border: 1px solid ${score >= 75 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'};">
                  RESUME STRENGTH: ${score}%
                </span>
                <h3 style="font-size: 1.25rem; font-weight: 800; color: #fff; margin: 0.4rem 0 0.2rem 0;">
                  ${score >= 80 ? 'Strong Technical Presentation' : score >= 60 ? 'Developing Presentation with Actionable Gaps' : 'Foundational Draft Needing Evidence'}
                </h3>
                <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin: 0; line-height: 1.4;">
                  ${analysis.scoreExplanation}
                </p>
              </div>

              <div style="text-align: right;">
                <div style="font-size: 2.2rem; font-weight: 800; color: #fff; font-family: var(--font-mono);">${score}<span style="font-size: 1.2rem; color: var(--tp-text-dark-muted);">/100</span></div>
              </div>
            </div>

            <!-- 8 Category Progress Meters (2 columns) -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1rem;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.25rem;">
                  <span style="color: var(--tp-text-dark-secondary);">1. Completeness</span>
                  <span style="color: #fff; font-weight: 600;">${b.completeness}/15</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${(b.completeness/15)*100}%; background: var(--tp-primary);"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.25rem;">
                  <span style="color: var(--tp-text-dark-secondary);">2. Role Relevance</span>
                  <span style="color: #fff; font-weight: 600;">${b.roleRelevance}/15</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${(b.roleRelevance/15)*100}%; background: #38bdf8;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.25rem;">
                  <span style="color: var(--tp-text-dark-secondary);">3. Skills Evidence in Projects</span>
                  <span style="color: #fff; font-weight: 600;">${b.skillsEvidence}/15</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${(b.skillsEvidence/15)*100}%; background: #10b981;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.25rem;">
                  <span style="color: var(--tp-text-dark-secondary);">4. Projects Depth & Tech Stack</span>
                  <span style="color: #fff; font-weight: 600;">${b.projectsDepth}/15</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${(b.projectsDepth/15)*100}%; background: #8b5cf6;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.25rem;">
                  <span style="color: var(--tp-text-dark-secondary);">5. Experience & Internships</span>
                  <span style="color: #fff; font-weight: 600;">${b.experienceAndTraining}/10</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${(b.experienceAndTraining/10)*100}%; background: #f59e0b;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.25rem;">
                  <span style="color: var(--tp-text-dark-secondary);">6. Action Verbs & Metrics</span>
                  <span style="color: #fff; font-weight: 600;">${b.actionVerbsAndImpact}/15</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${(b.actionVerbsAndImpact/15)*100}%; background: #ec4899;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.25rem;">
                  <span style="color: var(--tp-text-dark-secondary);">7. Formatting & Parseability</span>
                  <span style="color: #fff; font-weight: 600;">${b.formatting}/10</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${(b.formatting/10)*100}%; background: #64748b;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 0.25rem;">
                  <span style="color: var(--tp-text-dark-secondary);">8. Target Role Keywords</span>
                  <span style="color: #fff; font-weight: 600;">${b.keywordCoverage}/15</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                  <div style="height: 100%; width: ${(b.keywordCoverage/15)*100}%; background: #06b6d4;"></div>
                </div>
              </div>
            </div>

          </div>

          <!-- Target Role Skills Alignment (3 Distinct Buckets) -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0;">
              Target Role Skills Alignment (${role.name})
            </h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
              
              <!-- 1. Already Represented -->
              <div class="tp-card" style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.25); padding: 1rem;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #34d399; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
                  <span>✓</span> Already Represented (${analysis.skillFit.alreadyRepresented.length})
                </div>
                <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                  ${analysis.skillFit.alreadyRepresented.length === 0 ? `
                    <span style="font-size: 0.78rem; color: var(--tp-text-dark-muted);">No core skills demonstrated yet.</span>
                  ` : analysis.skillFit.alreadyRepresented.map(s => `
                    <span class="mono-chip" style="font-size: 0.7rem; background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
                      ✓ ${s.name}
                    </span>
                  `).join('')}
                </div>
              </div>

              <!-- 2. Needs Stronger Evidence -->
              <div class="tp-card" style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.25); padding: 1rem;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #fbbf24; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
                  <span>⚠️</span> Needs Stronger Evidence (${analysis.skillFit.needsEvidence.length})
                </div>
                <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                  ${analysis.skillFit.needsEvidence.length === 0 ? `
                    <span style="font-size: 0.78rem; color: var(--tp-text-dark-muted);">All listed skills have project evidence.</span>
                  ` : analysis.skillFit.needsEvidence.map(s => `
                    <span class="mono-chip" style="font-size: 0.7rem; background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);" title="Listed in skills, but missing from project bullets">
                      ⚠️ ${s.name}
                    </span>
                  `).join('')}
                </div>
                <div style="font-size: 0.72rem; color: var(--tp-text-dark-muted); margin-top: 0.5rem;">
                  Listed in skills, but no project demonstrates how you used it.
                </div>
              </div>

              <!-- 3. Missing from Resume -->
              <div class="tp-card" style="background: rgba(56, 189, 248, 0.05); border: 1px solid rgba(56, 189, 248, 0.25); padding: 1rem;">
                <div style="font-size: 0.8rem; font-weight: 700; color: #38bdf8; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.35rem;">
                  <span>➕</span> Missing from Resume (${analysis.skillFit.missingFromResume.length})
                </div>
                <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                  ${analysis.skillFit.missingFromResume.length === 0 ? `
                    <span style="font-size: 0.78rem; color: var(--tp-text-dark-muted);">Full coverage of core role skills.</span>
                  ` : analysis.skillFit.missingFromResume.map(s => `
                    <span class="mono-chip" style="font-size: 0.7rem; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.25);" title="Consider learning/adding if applicable">
                      ➕ ${s.name}
                    </span>
                  `).join('')}
                </div>
                <div style="font-size: 0.72rem; color: var(--tp-text-dark-muted); margin-top: 0.5rem;">
                  Add ONLY if you have real experience; otherwise study first.
                </div>
              </div>

            </div>
          </div>

          <!-- "Skills to Strengthen for This Role" (Connected to Skills Matrix & LearnHub) -->
          ${analysis.skillsToStrengthen && analysis.skillsToStrengthen.length > 0 ? `
            <div class="tp-card" style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div>
                  <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0;">
                    ⚡ Skills to Strengthen for ${role.name}
                  </h3>
                  <div style="font-size: 0.78rem; color: var(--tp-text-dark-muted); margin-top: 0.15rem;">
                    Synchronized with Skills Matrix, Skill Gap Analysis & LearnHub.
                  </div>
                </div>
                <div style="font-size: 0.72rem; color: #f59e0b; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.2rem 0.5rem; border-radius: 4px;">
                  ⚠️ Do NOT claim a skill before you actually learn or demonstrate it
                </div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem;">
                ${analysis.skillsToStrengthen.map(item => `
                  <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm); padding: 0.85rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.5rem;">
                    <div>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                        <span style="font-weight: 700; color: #fff; font-size: 0.88rem;">${item.name}</span>
                        <span class="mono-chip" style="font-size: 0.65rem; color: ${item.status.includes('Missing') ? '#38bdf8' : '#fbbf24'};">
                          ${item.status}
                        </span>
                      </div>
                      <p style="font-size: 0.78rem; color: var(--tp-text-dark-secondary); margin: 0; line-height: 1.4;">
                        ${item.whyItMatters}
                      </p>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.4rem;">
                      <span style="font-size: 0.72rem; color: var(--tp-text-dark-muted);">Req: ${item.suggestedProficiency}</span>
                      <a href="${item.actionHref}" class="tp-btn tp-btn-xs tp-btn-secondary" style="font-size: 0.72rem;">
                        ${item.actionLabel}
                      </a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- WHAT TO ADD & WHAT TO IMPROVE -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            
            <!-- What to Add -->
            <div class="tp-card" style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); padding: 1.25rem;">
              <h3 style="font-size: 0.95rem; font-weight: 700; color: #38bdf8; margin: 0 0 0.75rem 0;">
                ➕ What to Add (Grounded Recommendations)
              </h3>
              ${analysis.whatToAdd.length === 0 ? `
                <p style="font-size: 0.82rem; color: var(--tp-text-dark-muted); margin: 0;">All essential sections and portfolio links are present.</p>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                  ${analysis.whatToAdd.map(item => `
                    <div style="font-size: 0.82rem; line-height: 1.45;">
                      <strong style="color: #fff;">• ${item.title}:</strong>
                      <span style="color: var(--tp-text-dark-secondary);">${item.detail}</span>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <!-- What to Improve -->
            <div class="tp-card" style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); padding: 1.25rem;">
              <h3 style="font-size: 0.95rem; font-weight: 700; color: #fbbf24; margin: 0 0 0.75rem 0;">
                🔧 What to Improve (Clarity & Phrasing)
              </h3>
              ${analysis.whatToImprove.length === 0 ? `
                <p style="font-size: 0.82rem; color: var(--tp-text-dark-muted); margin: 0;">Descriptions use strong active engineering verbs.</p>
              ` : `
                <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                  ${analysis.whatToImprove.map(item => `
                    <div style="font-size: 0.82rem; line-height: 1.45;">
                      <strong style="color: #fff;">• ${item.title}:</strong>
                      <span style="color: var(--tp-text-dark-secondary);">${item.detail}</span>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

          </div>

          <!-- HOW TO MAKE IT STRONGER (Actionable Suggestions with 1-Click Apply) -->
          <div class="tp-card" style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <div>
                <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0;">
                  ✨ How to Make It Stronger (Actionable Suggestions)
                </h3>
                <div style="font-size: 0.78rem; color: var(--tp-text-dark-muted); margin-top: 0.15rem;">
                  Rewrites strictly use your authentic background and facts. Click to apply directly into your editable resume.
                </div>
              </div>
            </div>

            ${analysis.suggestions.length === 0 ? `
              <p style="font-size: 0.85rem; color: var(--tp-text-dark-muted); margin: 0;">
                No automated rewrites needed. Your current phrasing is strong and active.
              </p>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${analysis.suggestions.map(sug => `
                  <div class="tp-card" style="background: rgba(0,0,0,0.3); border: 1px solid var(--tp-border-dark); padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                      <strong style="font-size: 0.88rem; color: #fff;">${sug.title}</strong>
                      <button class="tp-btn tp-btn-xs tp-btn-accent btn-apply-sug" data-sug-id="${sug.id}" style="font-weight: 600;">
                        Apply to Resume →
                      </button>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.82rem;">
                      <div style="padding: 0.4rem 0.6rem; background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; color: #fca5a5; text-decoration: line-through;">
                        ${sug.currentText}
                      </div>
                      <div style="padding: 0.4rem 0.6rem; background: rgba(16, 185, 129, 0.08); border-left: 3px solid #10b981; color: #6ee7b7; font-weight: 500;">
                        ${sug.suggestedText}
                      </div>
                    </div>

                    <div style="font-size: 0.75rem; color: var(--tp-text-dark-muted);">
                      💡 Rationale: ${sug.reason}
                    </div>

                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Modal Footer -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--tp-border-dark); padding-top: 1rem; flex-wrap: wrap; gap: 0.75rem;">
            <div style="font-size: 0.78rem; color: var(--tp-text-dark-muted);">
              Recommended Next Action: <span style="color: #fff;">${analysis.recommendedNextAction}</span>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <button id="coach-footer-close" class="tp-btn tp-btn-secondary tp-btn-sm">
                Close Coach
              </button>
              <button id="coach-footer-save" class="tp-btn tp-btn-primary tp-btn-sm">
                💾 Save Resume & Changes
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    // Bind Close Buttons
    const close = () => { modalHost.innerHTML = ''; };
    modalHost.querySelector('#coach-close-btn')?.addEventListener('click', close);
    modalHost.querySelector('#coach-footer-close')?.addEventListener('click', close);

    // Target Role Dropdown Change
    const roleSelect = modalHost.querySelector('#coach-target-role-select');
    if (roleSelect) {
      roleSelect.addEventListener('change', async (e) => {
        this.activeTargetRole = e.target.value;
        await this._openCoachModal(container, profile, userId);
      });
    }

    // Apply Suggestion Buttons
    modalHost.querySelectorAll('.btn-apply-sug').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const sugId = e.currentTarget.dataset.sugId;
        const sug = analysis.suggestions.find(s => s.id === sugId);
        if (!sug) return;

        // Apply suggestion
        this.activeResume = ResumeEngine.applyCoachSuggestion(this.activeResume, sug);

        // Update main page form inputs without losing other fields
        if (sug.type === 'summary') {
          const sumInp = container.querySelector('#inp-summary');
          if (sumInp) sumInp.value = this.activeResume.summary;
        } else if (sug.type === 'bullet') {
          // Re-render project cards or update specific bullet
          const projCard = container.querySelector(`[data-proj-idx="${sug.targetProjectIdx}"]`);
          if (projCard) {
            const bulletsInp = projCard.querySelector('.proj-bullets');
            if (bulletsInp) {
              bulletsInp.value = (this.activeResume.projects[sug.targetProjectIdx].bullets || []).join('\n');
            }
          }
        }

        // Update live preview sheet
        const previewSheet = container.querySelector('#tp-printable-resume');
        if (previewSheet) {
          previewSheet.innerHTML = this._generateTemplateHtml(this.activeResume, this.activeTemplate);
        }

        e.currentTarget.textContent = '✓ Applied to Resume';
        e.currentTarget.disabled = true;
        e.currentTarget.classList.remove('tp-btn-accent');
        e.currentTarget.classList.add('tp-btn-secondary');

        Toast.success('Suggestion applied! Review in editor and save.');
      });
    });

    // Save Resume & Changes
    modalHost.querySelector('#coach-footer-save')?.addEventListener('click', async () => {
      try {
        this.activeResume.updated_at = new Date().toISOString();
        await dbStore.insert('resumes', this.activeResume);
        localStorage.setItem('TP_ACTIVE_RESUME', JSON.stringify(this.activeResume));

        if (isSupabaseConfigured() && supabase && userId !== 'usr_guest') {
          try {
            await supabase.from('resumes').upsert({
              id: this.activeResume.id,
              user_id: userId,
              title: this.activeResume.title,
              parsed_data: this.activeResume,
              updated_at: this.activeResume.updated_at
            });
          } catch {}
        }

        Toast.success('Resume saved successfully with applied improvements!');
        close();
      } catch {
        Toast.error('Could not save resume.');
      }
    });
  }
}

