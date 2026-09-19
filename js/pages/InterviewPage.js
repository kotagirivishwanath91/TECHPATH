/**
 * TECHPATH — ADAPTIVE MOCK INTERVIEW STUDIO
 * Comprehensive interview drill platform supporting 9 interview types,
 * dynamic resume selection, question navigation (Prev/Next), timer,
 * honest academic rubric evaluation, and full session history.
 */

import { learningContext } from '../context/LearningContext.js';
import { authContext } from '../context/AuthContext.js';
import { InterviewEngine, INTERVIEW_TYPES } from '../services/InterviewEngine.js';
import { PDFAnalyzer } from '../services/PDFAnalyzer.js';
import { TaxonomyEngine } from '../services/TaxonomyEngine.js';
import { dbStore } from '../db/store.js';
import { Toast } from '../components/Toast.js';

export class InterviewPage {
  static async render(container) {
    const user = authContext.getUser();
    const profile = authContext.getProfile() || user?.profile || {};
    const ctx = learningContext.get();

    const branch = (profile.branch_id || profile.branch || ctx.branch_id || 'cse').toLowerCase();
    const branchObj = TaxonomyEngine.getBranchById(branch) || TaxonomyEngine.ALL_BRANCHES[0];
    const branchName = branchObj ? branchObj.name : branch.toUpperCase();

    // State
    let activeTab = 'interview'; // 'interview' | 'history'
    let currentStep = 1; // 1: select/upload resume, 2: confirm telemetry, 3: track & role settings, 4: active simulation, 5: final result, 6: session review
    let reviewSessionData = null;

    let selectedInterviewType = 'technical';
    let selectedDifficulty = 'intermediate';
    let timerEnabled = true;
    let timeRemaining = 300; // 5 minutes
    let timerInterval = null;

    let extractedResume = {
      personal: {
        name: profile.full_name || profile.name || 'Candidate Engineer',
        email: user?.email || '',
        college: 'Engineering Institute'
      },
      education: { degree: `B.Tech in ${branchName}`, year: '2026' },
      skills: profile.skills && profile.skills.length > 0 ? profile.skills : ['Data Structures', 'Python', 'System Architecture', 'Git'],
      projects: ['Distributed Telemetry & Real-Time Monitoring Pipeline'],
      experience: ['Engineering Capstone Project']
    };

    let activeSession = null;
    let interviewQuestions = [];
    let currentQIndex = 0;
    let sessionAnswers = [];
    let speechRecognition = null;
    let isRecording = false;

    // Initialize Web Speech API if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      speechRecognition = new SpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = 'en-US';
    }

    function renderShell() {
      container.innerHTML = `
        <div class="tp-page" style="display: flex; flex-direction: column; gap: 1.75rem; max-width: 1100px; margin: 0 auto; width: 100%;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
                <span class="pulse-beacon"></span> DISCIPLINE: ${branch.toUpperCase()} // RUBRIC EVALUATION
              </div>
              <h1 class="display-lg">Mock Interview Studio</h1>
              <p style="color: var(--tp-text-dark-secondary); max-width: 700px; font-size: 0.92rem;">
                Rigorous, role-specific engineering drills grounded in your academic curriculum, technical resume, and target role.
              </p>
            </div>

            <!-- Tab Switcher -->
            <div style="display: flex; gap: 0.5rem; background: rgba(255,255,255,0.03); padding: 0.3rem; border-radius: var(--radius-sm); border: 1px solid var(--tp-border-dark);">
              <button id="tab-interview-btn" class="tp-btn ${activeTab === 'interview' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm">
                🎙️ Interview Drill
              </button>
              <button id="tab-history-btn" class="tp-btn ${activeTab === 'history' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm">
                📜 Session History
              </button>
            </div>
          </div>

          <!-- Main Slot -->
          <div id="interview-main-slot"></div>
        </div>
      `;

      container.querySelector('#tab-interview-btn').addEventListener('click', () => {
        activeTab = 'interview';
        renderShell();
      });

      container.querySelector('#tab-history-btn').addEventListener('click', () => {
        activeTab = 'history';
        renderShell();
      });

      const slot = container.querySelector('#interview-main-slot');
      if (activeTab === 'history') {
        renderHistoryView(slot);
      } else {
        renderInterviewStep(slot);
      }
    }

    async function renderInterviewStep(slot) {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }

      // ────────────────────────────────────────────────────────────────────────
      // STEP 1: RESUME SELECTION / UPLOAD
      // ────────────────────────────────────────────────────────────────────────
      if (currentStep === 1) {
        let savedResumes = [];
        try {
          savedResumes = await dbStore.filter('resumes', r => r.user_id === (user?.id || 'usr_guest'));
        } catch { /* proceed */ }

        slot.innerHTML = `
          <div class="tp-card tp-card-glass" style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem;">
              <div>
                <span class="mono-chip" style="color: var(--tp-primary);">STEP 1 OF 3</span>
                <h2 class="headline-md" style="margin-top: 0.25rem;">Select or Upload Resume Grounding</h2>
              </div>
              <span class="telemetry-chip">BRANCH: ${branch.toUpperCase()}</span>
            </div>

            <p style="color: var(--tp-text-dark-secondary); font-size: 0.92rem; line-height: 1.5;">
              To simulate high-stakes interviews, questions are extracted directly from your listed capstone projects, core competencies, and engineering coursework.
            </p>

            ${savedResumes.length > 0 ? `
              <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm); padding: 1rem;">
                <label class="tp-form-label" style="font-size: 0.85rem; margin-bottom: 0.5rem;">Select from Your Saved Resumes:</label>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  ${savedResumes.map((r, idx) => `
                    <label style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.85rem; background: rgba(255,255,255,0.03); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-xs); cursor: pointer;">
                      <div style="display: flex; align-items: center; gap: 0.65rem;">
                        <input type="radio" name="saved-resume-pick" value="${r.id}" ${idx === 0 ? 'checked' : ''} />
                        <div>
                          <strong style="color: #fff; font-size: 0.9rem;">${r.title || 'Technical Resume'}</strong>
                          <div style="font-size: 0.75rem; color: var(--tp-text-dark-muted);">${r.personal?.title || 'Engineer'} &bull; ${r.personal?.email || ''}</div>
                        </div>
                      </div>
                      <span class="mono-chip" style="font-size: 0.7rem; color: var(--tp-success);">SAVED IN STUDIO</span>
                    </label>
                  `).join('')}
                </div>
                <button type="button" id="use-saved-resume-btn" class="tp-btn tp-btn-primary tp-btn-sm" style="margin-top: 0.75rem;">
                  Use Selected Resume &rarr;
                </button>
              </div>
            ` : ''}

            <!-- File Upload & Direct Text -->
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div id="resume-drop-zone" style="border: 2px dashed var(--tp-border-dark); border-radius: var(--radius-md); padding: 2rem 1.5rem; text-align: center; background: rgba(255,255,255,0.01); cursor: pointer;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📄</div>
                <p style="font-weight: 600; color: #fff; margin-bottom: 0.25rem;">Upload Resume (.PDF, .TXT)</p>
                <p style="font-size: 0.78rem; color: var(--tp-text-dark-muted);">Auto-extracts programming skills, projects, and coursework</p>
                <input type="file" id="resume-file-input" accept=".pdf,.txt" style="display: none;" />
              </div>

              <div>
                <label class="tp-form-label">Or Paste Resume Plain Text Directly:</label>
                <textarea id="resume-raw-textarea" class="tp-input" style="height: 110px; font-size: 0.85rem;" placeholder="Paste text content from your resume here..."></textarea>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--tp-border-dark); padding-top: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <button id="use-default-profile-btn" class="tp-btn tp-btn-secondary tp-btn-sm">
                Use Authentic ${branch.toUpperCase()} Profile &rarr;
              </button>
              <button id="parse-resume-btn" class="tp-btn tp-btn-primary tp-btn-sm">
                Extract & Proceed to Step 2 &rarr;
              </button>
            </div>
          </div>
        `;

        const fileInput = slot.querySelector('#resume-file-input');
        const dropZone = slot.querySelector('#resume-drop-zone');
        if (dropZone && fileInput) {
          dropZone.addEventListener('click', () => fileInput.click());
          fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
              try {
                let text = '';
                if (file.name.endsWith('.pdf')) {
                  const res = await PDFAnalyzer.extractTextFromPDF(file);
                  text = res.pages.map(p => p.text).join('\n\n');
                } else {
                  text = await file.text();
                }
                slot.querySelector('#resume-raw-textarea').value = text;
                Toast.success(`Extracted text from ${file.name}`);
              } catch (err) {
                Toast.error(`Could not read file: ${err.message}`);
              }
            }
          });
        }

        const savedBtn = slot.querySelector('#use-saved-resume-btn');
        if (savedBtn) {
          savedBtn.addEventListener('click', () => {
            const pickedId = slot.querySelector('input[name="saved-resume-pick"]:checked')?.value;
            const chosen = savedResumes.find(r => r.id === pickedId);
            if (chosen) {
              extractedResume.personal = { ...extractedResume.personal, ...chosen.personal };
              extractedResume.education = chosen.education?.[0] || extractedResume.education;
              extractedResume.skills = chosen.skills ? chosen.skills.flatMap(s => typeof s === 'string' ? s : (s.items ? s.items.split(',').map(x => x.trim()) : [])) : extractedResume.skills;
              extractedResume.projects = chosen.projects ? chosen.projects.map(p => p.title || p) : extractedResume.projects;
              extractedResume.experience = chosen.experience ? chosen.experience.map(x => `${x.title} at ${x.company}`) : extractedResume.experience;
            }
            currentStep = 2;
            renderInterviewStep(slot);
          });
        }

        slot.querySelector('#use-default-profile-btn').addEventListener('click', () => {
          currentStep = 2;
          renderInterviewStep(slot);
        });

        slot.querySelector('#parse-resume-btn').addEventListener('click', () => {
          const raw = slot.querySelector('#resume-raw-textarea').value.trim();
          if (raw) {
            const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
            const commonSkills = ['Python', 'C++', 'Java', 'SQL', 'Docker', 'Linux', 'Verilog', 'MATLAB', 'CAD', 'SolidWorks', 'PyTorch', 'Git'];
            const found = commonSkills.filter(s => raw.toLowerCase().includes(s.toLowerCase()));
            if (found.length > 0) extractedResume.skills = found;
            const projLines = lines.filter(l => /project|developed|built|designed|implemented/i.test(l));
            if (projLines.length > 0) extractedResume.projects = projLines.slice(0, 3);
          }
          currentStep = 2;
          renderInterviewStep(slot);
        });
      }

      // ────────────────────────────────────────────────────────────────────────
      // STEP 2: CONFIRM TELEMETRY
      // ────────────────────────────────────────────────────────────────────────
      else if (currentStep === 2) {
        slot.innerHTML = `
          <div class="tp-card tp-card-glass" style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem;">
              <div>
                <span class="mono-chip" style="color: var(--tp-primary);">STEP 2 OF 3</span>
                <h2 class="headline-md" style="margin-top: 0.25rem;">Confirm Extracted Profile Telemetry</h2>
              </div>
              <button id="back-to-step1" class="tp-btn tp-btn-secondary tp-btn-xs">&larr; Back</button>
            </div>

            <p style="color: var(--tp-text-dark-secondary); font-size: 0.92rem;">
              Review your candidate parameters. Question generation dynamically maps against these attributes.
            </p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label class="tp-form-label">Candidate Name</label>
                <input type="text" id="conf-name" class="tp-input" value="${extractedResume.personal.name}" />
              </div>
              <div>
                <label class="tp-form-label">Degree & Department</label>
                <input type="text" id="conf-deg" class="tp-input" value="${extractedResume.education.degree}" />
              </div>
            </div>

            <div>
              <label class="tp-form-label">Detected Skills (Comma-separated)</label>
              <input type="text" id="conf-skills" class="tp-input" value="${extractedResume.skills.join(', ')}" />
            </div>

            <div>
              <label class="tp-form-label">Extracted Projects</label>
              <textarea id="conf-projects" class="tp-input" rows="3">${extractedResume.projects.join('\n')}</textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--tp-border-dark); padding-top: 1rem;">
              <button id="conf-proceed-btn" class="tp-btn tp-btn-primary">
                Confirm & Configure Interview &rarr;
              </button>
            </div>
          </div>
        `;

        slot.querySelector('#back-to-step1').addEventListener('click', () => {
          currentStep = 1;
          renderInterviewStep(slot);
        });

        slot.querySelector('#conf-proceed-btn').addEventListener('click', () => {
          extractedResume.personal.name = slot.querySelector('#conf-name').value.trim();
          extractedResume.education.degree = slot.querySelector('#conf-deg').value.trim();
          extractedResume.skills = slot.querySelector('#conf-skills').value.split(',').map(s => s.trim()).filter(Boolean);
          extractedResume.projects = slot.querySelector('#conf-projects').value.split('\n').map(p => p.trim()).filter(Boolean);
          currentStep = 3;
          renderInterviewStep(slot);
        });
      }

      // ────────────────────────────────────────────────────────────────────────
      // STEP 3: INTERVIEW SETTINGS (ROLE, 9 TYPES, DIFFICULTY, TIMER)
      // ────────────────────────────────────────────────────────────────────────
      else if (currentStep === 3) {
        const roles = InterviewEngine.getSuggestedRoles(branch, extractedResume);
        const specialization = profile.specialization || ctx.specialization || 'Core Systems Engineering';

        slot.innerHTML = `
          <div class="tp-card tp-card-glass" style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem;">
              <div>
                <span class="mono-chip" style="color: var(--tp-primary);">STEP 3 OF 3</span>
                <h2 class="headline-md" style="margin-top: 0.25rem;">Interview Mode & Target Role</h2>
              </div>
              <button id="back-to-step2" class="tp-btn tp-btn-secondary tp-btn-xs">&larr; Back</button>
            </div>

            <div>
              <label class="tp-form-label">Target Role Specification</label>
              <select id="sel-target-role" class="tp-input" style="font-size: 0.95rem; font-weight: 600;">
                ${roles.map(r => `<option value="${r}">${r}</option>`).join('')}
              </select>
            </div>

            <!-- 9 Interview Types Supported -->
            <div>
              <label class="tp-form-label">Interview Type / Focus Track *</label>
              <select id="sel-interview-type" class="tp-input" style="font-size: 0.9rem;">
                ${INTERVIEW_TYPES.map(t => `
                  <option value="${t.id}" ${t.id === selectedInterviewType ? 'selected' : ''}>
                    ${t.label}
                  </option>
                `).join('')}
              </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label class="tp-form-label">Target Difficulty</label>
                <select id="sel-difficulty" class="tp-input">
                  <option value="intermediate" ${selectedDifficulty === 'intermediate' ? 'selected' : ''}>Intermediate (University Placements)</option>
                  <option value="advanced" ${selectedDifficulty === 'advanced' ? 'selected' : ''}>Advanced (Tier-1 Systems & R&D)</option>
                  <option value="beginner" ${selectedDifficulty === 'beginner' ? 'selected' : ''}>Foundations (Internship/Entry)</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Response Timer</label>
                <select id="sel-timer" class="tp-input">
                  <option value="300" selected>5 Minutes per Question</option>
                  <option value="180">3 Minutes per Question</option>
                  <option value="0">Untimed / Practice Mode</option>
                </select>
              </div>
            </div>

            <div style="background: rgba(56,189,248,0.06); border-left: 3px solid #38bdf8; border-radius: var(--radius-sm); padding: 0.85rem 1rem;">
              <span class="mono-chip" style="color: #38bdf8; font-size: 0.72rem;">EVALUATION MODE: ACADEMIC RUBRIC & STATIC HEURISTICS</span>
              <p style="font-size: 0.82rem; color: #f1f5f9; margin: 0.35rem 0 0 0;">
                Answers are evaluated against verified curriculum rubrics (Correctness, Completeness, Relevance, Clarity, and Technical Depth). No fabricated AI claims.
              </p>
            </div>

            <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--tp-border-dark); padding-top: 1rem;">
              <button id="start-interview-sim-btn" class="tp-btn tp-btn-primary" style="padding: 0.7rem 2rem; font-size: 0.95rem;">
                🚀 Start Mock Interview Drill &rarr;
              </button>
            </div>
          </div>
        `;

        slot.querySelector('#back-to-step2').addEventListener('click', () => {
          currentStep = 2;
          renderInterviewStep(slot);
        });

        slot.querySelector('#start-interview-sim-btn').addEventListener('click', async () => {
          const targetRole = slot.querySelector('#sel-target-role').value;
          selectedInterviewType = slot.querySelector('#sel-interview-type').value;
          selectedDifficulty = slot.querySelector('#sel-difficulty').value;
          const timerVal = parseInt(slot.querySelector('#sel-timer').value, 10);
          timerEnabled = timerVal > 0;
          timeRemaining = timerVal;

          const btn = slot.querySelector('#start-interview-sim-btn');
          btn.disabled = true;
          btn.textContent = 'Synthesizing Session...';

          try {
            const res = await InterviewEngine.startSession(user?.id || 'usr_guest', {
              interviewType: selectedInterviewType,
              targetRole,
              branch,
              specialization,
              difficulty: selectedDifficulty,
              resumeData: extractedResume
            });

            activeSession = res.session;
            interviewQuestions = res.questions;
            currentQIndex = 0;
            sessionAnswers = [];

            currentStep = 4;
            renderInterviewStep(slot);
          } catch (err) {
            Toast.error(`Could not start interview: ${err.message}`);
            btn.disabled = false;
            btn.textContent = '🚀 Start Mock Interview Drill →';
          }
        });
      }

      // ────────────────────────────────────────────────────────────────────────
      // STEP 4: ACTIVE INTERVIEW DRILL (NAV, TIMER, ANSWERS, EVALUATION)
      // ────────────────────────────────────────────────────────────────────────
      else if (currentStep === 4) {
        renderActiveDrill(slot);
      }

      // ────────────────────────────────────────────────────────────────────────
      // STEP 5: FINAL RESULT REPORT CARD
      // ────────────────────────────────────────────────────────────────────────
      else if (currentStep === 5) {
        renderFinalReport(slot);
      }
    }

    function renderActiveDrill(slot) {
      if (!interviewQuestions || interviewQuestions.length === 0) {
        slot.innerHTML = `
          <div class="tp-card tp-card-glass" style="max-width: 700px; margin: 2rem auto; text-align: center; padding: 2.5rem;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚠️</div>
            <h2 class="headline-md">No Interview Questions Loaded</h2>
            <p style="color: var(--tp-text-dark-secondary); margin: 0.75rem 0 1.5rem 0;">
              Unable to synthesize questions for this track. Click Retry below to regenerate questions or reconfigure your track.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button id="retry-drill-btn" class="tp-btn tp-btn-primary">🔄 Retry Generation</button>
              <button id="reconfigure-drill-btn" class="tp-btn tp-btn-secondary">⚙️ Reconfigure Drill</button>
            </div>
          </div>
        `;
        slot.querySelector('#retry-drill-btn')?.addEventListener('click', async () => {
          try {
            const btn = slot.querySelector('#retry-drill-btn');
            if (btn) { btn.disabled = true; btn.textContent = 'Retrying...'; }
            const res = await InterviewEngine.startSession(user?.id || 'usr_guest', {
              interviewType: selectedInterviewType,
              targetRole: activeSession?.target_role || 'Software Engineer',
              branch,
              specialization,
              difficulty: selectedDifficulty,
              resumeData: extractedResume
            });
            activeSession = res.session;
            interviewQuestions = res.questions;
            currentQIndex = 0;
            renderActiveDrill(slot);
          } catch (e) {
            Toast.error('Retry failed: ' + e.message);
            currentStep = 3;
            renderInterviewStep(slot);
          }
        });
        slot.querySelector('#reconfigure-drill-btn')?.addEventListener('click', () => {
          currentStep = 3;
          renderInterviewStep(slot);
        });
        return;
      }

      if (currentQIndex >= interviewQuestions.length) {
        currentStep = 5;
        renderInterviewStep(slot);
        return;
      }

      const q = interviewQuestions[currentQIndex];
      const existingAns = sessionAnswers[currentQIndex];
      const questionContent = q.question_text || q.text || 'Explain your architectural approach, constraints, and validation methodology for this engineering scenario.';

      slot.innerHTML = `
        <div class="tp-card tp-card-glass" style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- Telemetry Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span class="telemetry-chip">${q.category || 'TECHNICAL'}</span>
              <strong style="color: #fff; font-size: 1.05rem;">Question ${currentQIndex + 1} of ${interviewQuestions.length}</strong>
            </div>

            <div style="display: flex; align-items: center; gap: 0.75rem;">
              ${timerEnabled ? `
                <div style="display: flex; align-items: center; gap: 0.4rem; background: rgba(0,0,0,0.3); border: 1px solid var(--tp-border-dark); border-radius: 4px; padding: 0.25rem 0.65rem; font-family: monospace; font-size: 0.85rem; color: #f59e0b;">
                  <span>⏱️</span>
                  <span id="drill-timer-display">${formatTimer(timeRemaining)}</span>
                </div>
              ` : ''}
              <span class="mono-chip" style="color: var(--tp-primary); font-size: 0.75rem;">
                ${(activeSession?.target_role || 'Role').split(' ')[0]}
              </span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div style="height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden;">
            <div style="width: ${Math.round(((currentQIndex + 1) / interviewQuestions.length) * 100)}%; height: 100%; background: var(--tp-primary); transition: width 0.3s;"></div>
          </div>

          <!-- Question Prompt -->
          <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-md); padding: 1.25rem;">
            <p style="font-size: 1.15rem; font-weight: 600; line-height: 1.5; color: #fff; margin: 0;">
              ${questionContent}
            </p>
          </div>

          <!-- Answer & Voice Dictation Area -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label class="tp-form-label" style="margin: 0;">Your Technical Reasoning & Articulation</label>
              ${speechRecognition ? `
                <button type="button" id="toggle-voice-btn" class="tp-btn tp-btn-secondary tp-btn-xs" style="display: flex; align-items: center; gap: 0.4rem;">
                  <span id="voice-dot" style="width: 8px; height: 8px; border-radius: 50%; background: #64748b; display: inline-block;"></span>
                  <span id="voice-label">Dictate Response</span>
                </button>
              ` : ''}
            </div>

            <textarea id="live-answer-input" class="tp-input" style="height: 140px; font-size: 0.95rem; line-height: 1.5;" placeholder="Articulate your engineering trade-offs, formulas, architectural patterns, and failure modes...">${existingAns?.answer || ''}</textarea>

            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--tp-text-dark-muted);">
              <span>Tip: Mention specific engineering constraints, tools, and quantifiable benchmarks.</span>
              <span id="ans-word-count">0 words</span>
            </div>
          </div>

          <!-- Action Buttons Strip -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--tp-border-dark); padding-top: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              ${currentQIndex > 0 ? `
                <button id="btn-prev-q" class="tp-btn tp-btn-secondary tp-btn-sm">&larr; Previous Question</button>
              ` : ''}
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <button id="btn-submit-answer" class="tp-btn tp-btn-primary tp-btn-sm">
                Evaluate Response &rarr;
              </button>
            </div>
          </div>

          <!-- Rubric Feedback Card -->
          <div id="eval-rubric-card" style="display: ${existingAns ? 'flex' : 'none'}; flex-direction: column; gap: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm); padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.5rem;">
              <span class="mono-chip" style="color: var(--tp-success);">EVALUATION MODE: ACADEMIC RUBRIC & STATIC HEURISTICS</span>
              <strong id="eval-score-label" style="color: var(--tp-primary); font-size: 1.2rem;">Score: ${existingAns?.eval?.overallScore || 0}/100</strong>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;">
              <div class="tp-card" style="padding: 0.65rem; text-align: center;">
                <div style="font-size: 0.7rem; color: var(--tp-text-dark-muted);">CORRECTNESS</div>
                <div id="dim-correctness" style="font-size: 1.15rem; font-weight: 700; color: #fff;">${existingAns?.eval?.correctness || 0}%</div>
              </div>
              <div class="tp-card" style="padding: 0.65rem; text-align: center;">
                <div style="font-size: 0.7rem; color: var(--tp-text-dark-muted);">COMPLETENESS</div>
                <div id="dim-completeness" style="font-size: 1.15rem; font-weight: 700; color: #fff;">${existingAns?.eval?.completeness || 0}%</div>
              </div>
              <div class="tp-card" style="padding: 0.65rem; text-align: center;">
                <div style="font-size: 0.7rem; color: var(--tp-text-dark-muted);">RELEVANCE</div>
                <div id="dim-relevance" style="font-size: 1.15rem; font-weight: 700; color: #fff;">${existingAns?.eval?.relevance || 0}%</div>
              </div>
              <div class="tp-card" style="padding: 0.65rem; text-align: center;">
                <div style="font-size: 0.7rem; color: var(--tp-text-dark-muted);">TECH DEPTH</div>
                <div id="dim-depth" style="font-size: 1.15rem; font-weight: 700; color: #fff;">${existingAns?.eval?.technicalDepth || 0}%</div>
              </div>
            </div>

            <p id="eval-feedback-text" style="font-size: 0.88rem; color: var(--tp-text-dark-secondary); line-height: 1.45; margin: 0;">
              ${existingAns?.eval?.feedback || ''}
            </p>

            <div style="background: rgba(225,29,72,0.06); padding: 0.75rem 1rem; border-left: 3px solid var(--tp-primary); border-radius: var(--radius-xs);">
              <span class="mono-chip" style="font-size: 0.7rem; color: var(--tp-primary);">IDEAL MODEL ANSWER OUTLINE</span>
              <pre id="eval-model-text" style="white-space: pre-wrap; font-size: 0.82rem; color: #fff; margin-top: 0.35rem; font-family: inherit;">${existingAns?.eval?.improvedAnswer || ''}</pre>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
              <button id="btn-next-step" class="tp-btn tp-btn-secondary tp-btn-sm">
                ${currentQIndex + 1 < interviewQuestions.length ? 'Proceed to Next Question &rarr;' : 'Finish Interview & Generate Results &rarr;'}
              </button>
            </div>
          </div>
        </div>
      `;

      const textarea = slot.querySelector('#live-answer-input');
      const wordBadge = slot.querySelector('#ans-word-count');
      textarea.addEventListener('input', () => {
        const cnt = textarea.value.trim().split(/\s+/).filter(Boolean).length;
        wordBadge.textContent = `${cnt} words`;
      });

      // Voice
      const voiceBtn = slot.querySelector('#toggle-voice-btn');
      const voiceDot = slot.querySelector('#voice-dot');
      const voiceLabel = slot.querySelector('#voice-label');
      if (voiceBtn && speechRecognition) {
        voiceBtn.addEventListener('click', () => {
          if (!isRecording) {
            try {
              speechRecognition.start();
              isRecording = true;
              voiceDot.style.background = '#ef4444';
              voiceLabel.textContent = 'Listening...';
            } catch { /* proceed */ }
          } else {
            speechRecognition.stop();
            isRecording = false;
            voiceDot.style.background = '#64748b';
            voiceLabel.textContent = 'Dictate Response';
          }
        });

        speechRecognition.onresult = (e) => {
          let str = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            str += e.results[i][0].transcript;
          }
          textarea.value += (textarea.value ? ' ' : '') + str;
        };
      }

      // Previous Question
      const prevBtn = slot.querySelector('#btn-prev-q');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentQIndex > 0) {
            currentQIndex--;
            renderActiveDrill(slot);
          }
        });
      }

      // Submit / Evaluate
      const submitBtn = slot.querySelector('#btn-submit-answer');
      const evalCard = slot.querySelector('#eval-rubric-card');
      submitBtn.addEventListener('click', async () => {
        const text = textarea.value.trim();
        if (text.length < 8) {
          Toast.error('Please articulate a response of at least 8 characters.');
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Evaluating Response...';

        try {
          const evalRes = await InterviewEngine.submitAnswer(
            activeSession.id,
            q.id || `q_${currentQIndex}`,
            text,
            q.target_skill_id,
            user?.id || 'usr_guest'
          );

          sessionAnswers[currentQIndex] = {
            question: q.question_text || q.text || 'Technical Question',
            category: q.category,
            answer: text,
            eval: evalRes
          };

          evalCard.style.display = 'flex';
          slot.querySelector('#eval-score-label').textContent = `Score: ${evalRes.overallScore}/100`;
          slot.querySelector('#dim-correctness').textContent = `${evalRes.correctness}%`;
          slot.querySelector('#dim-completeness').textContent = `${evalRes.completeness}%`;
          slot.querySelector('#dim-relevance').textContent = `${evalRes.relevance}%`;
          slot.querySelector('#dim-depth').textContent = `${evalRes.technicalDepth}%`;
          slot.querySelector('#eval-feedback-text').textContent = evalRes.feedback;
          slot.querySelector('#eval-model-text').textContent = evalRes.improvedAnswer;

          submitBtn.style.display = 'none';
          evalCard.scrollIntoView({ behavior: 'smooth' });
        } catch (err) {
          Toast.error(`Evaluation failed: ${err.message}`);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Evaluate Response →';
        }
      });

      // Next / Finish Step
      const nextBtn = slot.querySelector('#btn-next-step');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          currentQIndex++;
          renderActiveDrill(slot);
        });
      }

      // Timer interval
      if (timerEnabled) {
        const timerDisp = slot.querySelector('#drill-timer-display');
        timerInterval = setInterval(() => {
          if (timeRemaining > 0) {
            timeRemaining--;
            if (timerDisp) timerDisp.textContent = formatTimer(timeRemaining);
          } else {
            clearInterval(timerInterval);
            timerInterval = null;
          }
        }, 1000);
      }
    }

    function formatTimer(secs) {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    async function renderFinalReport(slot) {
      const report = await InterviewEngine.completeSession(activeSession.id, user?.id || 'usr_guest');

      slot.innerHTML = `
        <div class="tp-card tp-card-glass" style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.75rem;">
          <!-- Top Debrief Banner -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="telemetry-chip" style="margin-bottom: 0.4rem;">VERIFIED ASSESSMENT REPORT CARD</span>
              <h2 class="display-lg" style="margin: 0;">Interview Performance Debrief</h2>
              <p style="color: var(--tp-text-dark-secondary); font-size: 0.88rem; margin-top: 0.25rem;">
                Candidate: <strong>${extractedResume.personal.name}</strong> &bull; Role: <strong>${activeSession.target_role}</strong> &bull; Type: <strong>${activeSession.interview_type}</strong>
              </p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 2.75rem; font-weight: 800; color: ${report.overall_score >= 75 ? 'var(--tp-success)' : 'var(--tp-primary)'};">
                ${report.overall_score}/100
              </div>
              <span class="mono-chip" style="font-size: 0.72rem; color: var(--tp-text-dark-muted);">COMPOSITE RUBRIC SCORE</span>
            </div>
          </div>

          <!-- Dimension Meters -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
            <div class="tp-card" style="text-align: center; padding: 1rem;">
              <div style="font-size: 0.75rem; color: var(--tp-text-dark-muted);">TECHNICAL PERFORMANCE</div>
              <div style="font-size: 1.75rem; font-weight: 800; color: #fff;">${report.technical_performance}%</div>
              <p style="font-size: 0.75rem; color: var(--tp-text-dark-secondary); margin: 0.25rem 0 0 0;">Engineering principles & constraints</p>
            </div>
            <div class="tp-card" style="text-align: center; padding: 1rem;">
              <div style="font-size: 0.75rem; color: var(--tp-text-dark-muted);">COMMUNICATION & STRUCTURE</div>
              <div style="font-size: 1.75rem; font-weight: 800; color: #fff;">${report.communication_score}%</div>
              <p style="font-size: 0.75rem; color: var(--tp-text-dark-secondary); margin: 0.25rem 0 0 0;">Clarity, flow, and terminology</p>
            </div>
            <div class="tp-card" style="text-align: center; padding: 1rem;">
              <div style="font-size: 0.75rem; color: var(--tp-text-dark-muted);">TARGET READINESS</div>
              <div style="font-size: 1.75rem; font-weight: 800; color: var(--tp-success);">${report.overall_score >= 75 ? 'READY' : 'DEVELOPING'}</div>
              <p style="font-size: 0.75rem; color: var(--tp-text-dark-secondary); margin: 0.25rem 0 0 0;">Placements & technical drives</p>
            </div>
          </div>

          <!-- Strengths & Weaknesses Breakdown -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">
            <div class="tp-card" style="background: rgba(16,185,129,0.03); border: 1px solid rgba(16,185,129,0.2);">
              <h3 class="headline-md" style="font-size: 1rem; color: var(--tp-success); margin: 0 0 0.5rem 0;">✓ Strong Areas</h3>
              <ul style="margin: 0 0 0 16px; padding: 0; font-size: 0.85rem; color: #fff;">
                ${report.strong_areas.length > 0 ? report.strong_areas.map(s => `<li style="margin-bottom: 0.35rem;">${s}</li>`).join('') : '<li>Core conceptual understanding</li>'}
              </ul>
            </div>

            <div class="tp-card" style="background: rgba(225,29,72,0.03); border: 1px solid rgba(225,29,72,0.2);">
              <h3 class="headline-md" style="font-size: 1rem; color: var(--tp-primary); margin: 0 0 0.5rem 0;">⚡ Areas for Improvement & Topics to Revise</h3>
              <ul style="margin: 0 0 0 16px; padding: 0; font-size: 0.85rem; color: #fff;">
                ${report.topics_to_revise.map(t => `<li style="margin-bottom: 0.35rem;">${t}</li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- Recommended Next Steps & Learning Resources -->
          <div class="tp-card">
            <h3 class="headline-md" style="font-size: 1rem; color: #fff; margin: 0 0 0.75rem 0;">Personalized Recommendations</h3>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="#/learnhub" class="tp-btn tp-btn-secondary tp-btn-sm">
                📖 Watch Curated Videos on LearnHub
              </a>
              <a href="#/projects" class="tp-btn tp-btn-secondary tp-btn-sm">
                🔨 Build Recommended Project
              </a>
              <a href="#/skills" class="tp-btn tp-btn-secondary tp-btn-sm">
                ⚡ View Skill Evidence
              </a>
            </div>
          </div>

          <!-- Footer Actions -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--tp-border-dark); padding-top: 1rem; flex-wrap: wrap; gap: 0.75rem;">
            <button id="btn-retry-interview" class="tp-btn tp-btn-primary">
              🔄 Retry / Start New Interview Drill
            </button>
            <button id="btn-export-dossier" class="tp-btn tp-btn-secondary">
              📥 Export Dossier (.MD)
            </button>
          </div>
        </div>
      `;

      slot.querySelector('#btn-retry-interview').addEventListener('click', () => {
        currentStep = 1;
        renderInterviewStep(slot);
      });

      slot.querySelector('#btn-export-dossier').addEventListener('click', () => {
        let md = `# TECHPATH INTERVIEW PERFORMANCE REPORT\n\n`;
        md += `**Candidate:** ${extractedResume.personal.name}\n`;
        md += `**Target Role:** ${activeSession.target_role}\n`;
        md += `**Score:** ${report.overall_score}/100\n\n`;
        sessionAnswers.forEach((a, i) => {
          md += `### Q${i + 1}: ${a.question}\n**Answer:** ${a.answer}\n**Feedback:** ${a.eval?.feedback}\n\n`;
        });
        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview_report_${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    async function renderHistoryView(slot) {
      slot.innerHTML = `
        <div class="tp-card tp-card-glass" style="max-width: 950px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem;">
            <div>
              <h2 class="headline-md" style="margin: 0;">Interview Session History</h2>
              <p style="color: var(--tp-text-dark-secondary); font-size: 0.85rem; margin-top: 0.25rem;">
                Historical drill sessions, rubric ratings, and saved question/answer logs.
              </p>
            </div>
            <button id="history-new-drill-btn" class="tp-btn tp-btn-primary tp-btn-sm">
              + New Interview Drill
            </button>
          </div>

          <div id="history-list-slot">
            <p style="color: var(--tp-text-dark-muted); font-size: 0.88rem;">Loading past sessions...</p>
          </div>
        </div>
      `;

      slot.querySelector('#history-new-drill-btn').addEventListener('click', () => {
        activeTab = 'interview';
        currentStep = 1;
        renderShell();
      });

      const listSlot = slot.querySelector('#history-list-slot');
      const sessions = await InterviewEngine.getHistory(user?.id || 'usr_guest');

      if (!sessions || sessions.length === 0) {
        listSlot.innerHTML = `
          <div style="text-align: center; padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📜</div>
            <h3 class="headline-sm">No Recorded Sessions Yet</h3>
            <p style="color: var(--tp-text-dark-secondary); font-size: 0.85rem; max-width: 450px; margin: 0.5rem auto 1rem auto;">
              Complete your first interview drill to track your scoring progression and review past answers.
            </p>
          </div>
        `;
        return;
      }

      listSlot.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${sessions.map(s => {
            const score = s.final_score || (s.scores && s.scores.length > 0 ? Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length) : 75);
            const dateStr = s.created_at ? new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';

            return `
              <div class="tp-card" style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark);">
                <div>
                  <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.25rem;">
                    <span class="telemetry-chip" style="font-size: 0.72rem;">${(s.branch || branch).toUpperCase()}</span>
                    <strong style="color: #fff; font-size: 0.92rem;">${s.target_role || 'Engineering Drill'}</strong>
                  </div>
                  <div style="font-size: 0.78rem; color: var(--tp-text-dark-muted);">
                    Type: ${s.interview_type || 'Technical'} &bull; Status: ${s.status} &bull; ${dateStr}
                  </div>
                </div>

                <div style="text-align: right;">
                  <div style="font-size: 1.35rem; font-weight: 800; color: ${score >= 75 ? 'var(--tp-success)' : 'var(--tp-primary)'};">
                    ${score}/100
                  </div>
                  <span style="font-size: 0.68rem; color: var(--tp-text-dark-muted);">SCORE</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    renderShell();
  }
}
