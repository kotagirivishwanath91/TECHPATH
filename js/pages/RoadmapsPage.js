/**
 * TECHPATH — ROADMAPS & PREPARATION AI STUDIO
 * Supports TWO Major Modes:
 * 1. [Career Roadmap] — Synchronized with personalized 5-stage career milestones
 * 2. [Exam Preparation AI] — Personalized, date-aware roadmaps for Language (IELTS, TOEFL, PTE, GRE, GMAT),
 *    Government/Competitive (UPSC, SSC, Banking, Railways, Defence), and Academic (GATE, CAT, Semester, AWS) exams.
 */

import { learningContext } from '../context/LearningContext.js';
import { authContext } from '../context/AuthContext.js';
import { CareerEngine } from '../services/CareerEngine.js';
import { ExamRoadmapEngine } from '../services/ExamRoadmapEngine.js';
import { Toast } from '../components/Toast.js';

export class RoadmapsPage {
  static activeMode = 'career'; // 'career' | 'exam'
  static selectedExamId = 'exam_ielts';
  static isConfiguringNew = false;

  static async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; gap: 1rem;">
        <div style="width: 42px; height: 42px; border: 3px solid rgba(225,29,72,0.2); border-top-color: var(--tp-primary); border-radius: 50%; animation: tp-spin 0.8s linear infinite;"></div>
        <p style="color: var(--tp-text-dark-secondary); font-size: 0.95rem;">Loading your personalized preparation roadmaps...</p>
      </div>
    `;

    try {
      const user = authContext.getUser();
      const ctx = learningContext.get();
      const profile = user?.profile || ctx;
      const branchId = profile.branch_id || ctx.branch_id || 'cse';

      // Load reference data
      const [trajectory, availableExams, activeExamRoadmap] = await Promise.all([
        CareerEngine.buildPersonalizedTrajectory(profile, profile.target_role, user?.id || 'usr_guest'),
        ExamRoadmapEngine.getAvailableExams(),
        ExamRoadmapEngine.getActiveRoadmap(user?.id || 'usr_guest')
      ]);

      const isCareer = this.activeMode === 'career';

      container.innerHTML = `
        <div class="tp-page" style="display: flex; flex-direction: column; gap: 2rem; max-width: 1200px; width: 100%;">
          
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <span class="pulse-beacon"></span>
                <span>PATHWAY TELEMETRY // ${branchId.toUpperCase()}</span>
                <span style="color: var(--tp-text-dark-muted);">&bull;</span>
                <span style="color: #fff;">COMPETENCY BENCHMARK</span>
              </div>
              <h1 class="display-lg">Personalized Preparation Roadmaps</h1>
              <p style="color: var(--tp-text-dark-secondary); max-width: 780px;">
                Goal-oriented milestones connecting academic fundamentals, industry roles, and high-stakes competitive examinations.
              </p>
            </div>

            <!-- Mode Selector Switcher -->
            <div style="display: flex; background: rgba(0,0,0,0.3); padding: 0.25rem; border-radius: var(--radius-sm); border: 1px solid var(--tp-border-dark); gap: 0.25rem;">
              <button id="mode-career-btn" class="tp-btn ${isCareer ? 'tp-btn-primary' : 'tp-btn-ghost'} tp-btn-sm" style="font-weight: 700;">
                🚀 Career Roadmap
              </button>
              <button id="mode-exam-btn" class="tp-btn ${!isCareer ? 'tp-btn-primary' : 'tp-btn-ghost'} tp-btn-sm" style="font-weight: 700;">
                🎯 Exam Preparation AI
              </button>
            </div>
          </div>

          <!-- Main Mode Content Area -->
          <div id="roadmap-mode-content">
            ${isCareer ? this._renderCareerRoadmapView(trajectory, branchId) : this._renderExamRoadmapView(availableExams, activeExamRoadmap, user)}
          </div>

        </div>
      `;

      this._bindGlobalEvents(container, trajectory, availableExams, activeExamRoadmap, user);

    } catch (err) {
      console.error('[RoadmapsPage] Render error:', err);
      container.innerHTML = `
        <div class="tp-card tp-empty-state" style="max-width: 650px; margin: 3rem auto; text-align: center; padding: 3rem 1.5rem;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚠️</div>
          <h2 class="headline-md">Could not load Roadmap</h2>
          <p style="color: var(--tp-text-dark-secondary); margin: 0.75rem 0 1.5rem 0;">
            ${err.message || 'An unexpected error occurred while generating your roadmap.'}
          </p>
          <button id="retry-roadmap-btn" class="tp-btn tp-btn-primary">🔄 Retry</button>
        </div>
      `;
      container.querySelector('#retry-roadmap-btn')?.addEventListener('click', () => {
        RoadmapsPage.render(container);
      });
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // MODE 1: CAREER ROADMAP VIEW
  // ────────────────────────────────────────────────────────────────────────────
  static _renderCareerRoadmapView(trajectory, branchId) {
    return `
      <div style="display: flex; flex-direction: column; gap: 1.75rem;">
        
        <!-- Telemetry Summary Card -->
        <div class="tp-card tp-card-glass" style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1.5rem; padding: 1.5rem; border: 1px solid var(--tp-border-dark);">
          <div>
            <span class="mono-chip" style="color: var(--tp-primary); font-size: 0.75rem;">ACTIVE CAREER TRACK</span>
            <h2 class="headline-lg" style="margin-top: 0.35rem; color: #fff;">${trajectory.role_title}</h2>
            <p style="font-size: 0.9rem; color: var(--tp-text-dark-secondary); margin-top: 0.35rem; line-height: 1.5;">
              Personalized trajectory aligned with your ${branchId.toUpperCase()} specialization and evaluated against industry requirements.
            </p>
            <div style="margin-top: 1rem;">
              <a href="#/career" class="tp-btn tp-btn-secondary tp-btn-xs">View Full Career & Internships &rarr;</a>
            </div>
          </div>

          <div style="text-align: center; border-left: 1px solid var(--tp-border-dark); padding: 0.5rem 1rem; display: flex; flex-direction: column; justify-content: center;">
            <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.75rem;">ROLE READINESS</span>
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--tp-primary); margin-top: 0.25rem;">
              ${trajectory.stats.readinessScore}%
            </div>
            <span style="font-size: 0.75rem; color: var(--tp-text-dark-secondary);">Skills Verified</span>
          </div>

          <div style="text-align: center; border-left: 1px solid var(--tp-border-dark); padding: 0.5rem 1rem; display: flex; flex-direction: column; justify-content: center;">
            <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.75rem;">MILESTONE PROGRESS</span>
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--tp-success); margin-top: 0.25rem;">
              ${trajectory.stats.overallProgress}%
            </div>
            <span style="font-size: 0.75rem; color: var(--tp-text-dark-secondary);">
              ${trajectory.stats.totalCompleted} / ${trajectory.stats.totalItems} Completed
            </span>
          </div>
        </div>

        <!-- Vertical Interactive Timeline -->
        <div style="position: relative; display: flex; flex-direction: column; gap: 1.75rem; padding-left: 2rem; border-left: 2px solid var(--tp-border-dark);">
          ${trajectory.stages.map((st) => {
            const isCompleted = st.status === 'completed';
            const isInProgress = st.status === 'in_progress';
            const nodeColor = isCompleted ? 'var(--tp-success)' : isInProgress ? 'var(--tp-primary)' : 'var(--tp-surface-dark)';
            const nodeBorder = isCompleted ? 'var(--tp-success)' : isInProgress ? 'var(--tp-primary)' : 'var(--tp-border-dark)';

            return `
              <div class="tp-card tp-card-glass" style="position: relative; margin-left: 0.75rem; padding: 1.5rem; border: 1px solid ${isInProgress ? 'rgba(225,29,72,0.4)' : 'var(--tp-border-dark)'};">
                <!-- Node Marker -->
                <div style="
                  position: absolute;
                  left: -2.85rem;
                  top: 1.5rem;
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  background: ${nodeColor};
                  border: 3px solid ${nodeBorder};
                  box-shadow: ${isInProgress ? '0 0 12px var(--tp-primary)' : 'none'};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 0.7rem;
                  color: #fff;
                  font-weight: 700;
                ">
                  ${isCompleted ? '✓' : st.stage_number}
                </div>

                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <div>
                    <span class="mono-chip" style="color: ${isCompleted ? 'var(--tp-success)' : isInProgress ? 'var(--tp-primary)' : 'var(--tp-text-dark-muted)'}; font-size: 0.75rem;">
                      MILESTONE 0${st.stage_number} // ${st.type.toUpperCase()}
                    </span>
                    <h3 class="headline-md" style="margin: 0.25rem 0 0 0; color: #fff;">${st.title}</h3>
                  </div>
                  <span style="font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: var(--radius-pill); font-weight: 700; background: ${isCompleted ? 'rgba(16,185,129,0.15)' : isInProgress ? 'rgba(225,29,72,0.15)' : 'rgba(255,255,255,0.05)'}; color: ${isCompleted ? '#86efac' : isInProgress ? '#fda4af' : '#94a3b8'};">
                    ${st.status.replace('_', ' ').toUpperCase()} (${st.progress_percentage}%)
                  </span>
                </div>

                <p style="font-size: 0.88rem; color: var(--tp-text-dark-secondary); margin: 0 0 1rem 0; line-height: 1.45;">
                  ${st.description}
                </p>

                <!-- Milestone Tasks Checklist -->
                <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                  ${st.items.map(item => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.85rem; background: rgba(255,255,255,0.02); border-radius: 4px; font-size: 0.88rem;">
                      <div style="display: flex; align-items: center; gap: 0.6rem;">
                        <span>${item.status === 'completed' ? '✅' : item.status === 'in_progress' ? '⏳' : '⬜'}</span>
                        <span style="color: ${item.status === 'completed' ? '#94a3b8' : '#fff'}; ${item.status === 'completed' ? 'text-decoration: line-through;' : ''}">
                          ${item.title}
                        </span>
                      </div>
                      ${item.actionUrl ? `<a href="${item.actionUrl}" class="tp-btn tp-btn-ghost tp-btn-xs" style="font-size: 0.75rem;">Launch &rarr;</a>` : ''}
                    </div>
                  `).join('')}
                </div>

                <div style="display: flex; gap: 0.75rem; font-size: 0.8rem; color: var(--tp-text-dark-muted);">
                  <span>Estimated: <strong>${st.estimated_hours} Hours</strong></span>
                  <span>&bull;</span>
                  <span>Prerequisite: <em>${st.prerequisites}</em></span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // MODE 2: EXAM PREPARATION AI VIEW
  // ────────────────────────────────────────────────────────────────────────────
  static _renderExamRoadmapView(availableExams, activeRoadmap, user) {
    if (!activeRoadmap || this.isConfiguringNew) {
      return this._renderExamConfigurator(availableExams, user);
    }
    return this._renderActiveExamRoadmap(activeRoadmap);
  }

  static _renderExamConfigurator(availableExams, user) {
    const categories = [
      { id: 'language', label: 'Language & Study Abroad (IELTS, TOEFL, GRE, GMAT, DET)' },
      { id: 'government', label: 'Government & Competitive (UPSC, SSC, Banking, Railways, Defence)' },
      { id: 'academic', label: 'Academic & Professional (GATE, CAT, Semester, AWS, Cloud)' }
    ];

    return `
      <div class="tp-card tp-card-glass" style="max-width: 900px; margin: 0 auto; padding: 2rem; border: 1px solid var(--tp-border-dark);">
        <div style="border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
            EXAM PREPARATION AI // HIGH-STAKES ROADMAP SYNTHESIZER
          </div>
          <h2 class="headline-xl" style="color: #fff; margin: 0;">Configure Your Exam Preparation Goal</h2>
          <p style="color: var(--tp-text-dark-secondary); margin-top: 0.35rem; font-size: 0.95rem;">
            Generate genuinely useful, date-aware, exam-specific preparation roadmaps with authentic syllabus rubrics.
          </p>
        </div>

        <form id="exam-roadmap-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- Exam Selection -->
          <div>
            <label class="tp-form-label">Select Target Examination</label>
            <select id="exam-select-input" class="tp-input" style="font-size: 1rem; padding: 0.75rem 1rem;">
              ${categories.map(cat => `
                <optgroup label="${cat.label}">
                  ${availableExams.filter(e => e.category === cat.id).map(e => `
                    <option value="${e.id}" ${e.id === this.selectedExamId ? 'selected' : ''}>${e.name}</option>
                  `).join('')}
                </optgroup>
              `).join('')}
            </select>
          </div>

          <!-- Target Score & Exam Date -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
            <div>
              <label class="tp-form-label">Target Score / Rank / Band</label>
              <input type="text" id="target-score-input" class="tp-input" placeholder="e.g. Band 7.5+, 110/120, AIR < 100, 99.5%ile" value="" required />
              <span style="font-size: 0.78rem; color: var(--tp-text-dark-muted);">Benchmark threshold calibrated to conducting body standards</span>
            </div>

            <div>
              <label class="tp-form-label">Scheduled Exam Date</label>
              <input type="date" id="exam-date-input" class="tp-input" required />
              <span style="font-size: 0.78rem; color: var(--tp-text-dark-muted);">Used to calculate exact weeks remaining and phase pacing</span>
            </div>
          </div>

          <!-- Current Diagnostic Level & Daily Hours -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;">
            <div>
              <label class="tp-form-label">Current Level / Diagnostic Baseline</label>
              <select id="current-level-input" class="tp-input">
                <option value="beginner">Beginner (Starting fresh with fundamentals)</option>
                <option value="intermediate" selected>Intermediate (Familiar with syllabus, need structured practice)</option>
                <option value="advanced">Advanced (Targeting top percentile / score perfection)</option>
              </select>
            </div>

            <div>
              <label class="tp-form-label">Available Study Time Per Day</label>
              <select id="daily-hours-input" class="tp-input">
                <option value="2">2 Hours / Day (Working Professional / Busy Term)</option>
                <option value="3" selected>3 Hours / Day (Balanced Regular Track)</option>
                <option value="4">4 Hours / Day (Accelerated Dedicated Track)</option>
                <option value="6">6+ Hours / Day (Intensive Full-Time Preparation)</option>
              </select>
            </div>
          </div>

          <!-- Weak Areas for High-Priority Triage -->
          <div>
            <label class="tp-form-label">Primary Areas for Improvement / Weak Areas (Comma Separated)</label>
            <input type="text" id="weak-areas-input" class="tp-input" placeholder="e.g. Writing Task 2, CSAT Mathematics, Engineering Mathematics, Reading Passage 3" />
            <span style="font-size: 0.78rem; color: var(--tp-text-dark-muted);">The engine will prioritize study blocks and drills for these subjects</span>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
            ${RoadmapsPage.isConfiguringNew ? `
              <button type="button" id="cancel-config-btn" class="tp-btn tp-btn-secondary">Cancel</button>
            ` : ''}
            <button type="submit" id="generate-roadmap-btn" class="tp-btn tp-btn-primary" style="font-size: 1rem; padding: 0.75rem 1.75rem;">
              🚀 Synthesize Personalized Preparation Roadmap &rarr;
            </button>
          </div>

        </form>
      </div>
    `;
  }

  static _renderActiveExamRoadmap(roadmap) {
    return `
      <div style="display: flex; flex-direction: column; gap: 1.75rem;">
        
        <!-- Telemetry Banner -->
        <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; gap: 1.25rem; padding: 1.75rem; border: 1px solid var(--tp-border-dark);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                <span class="telemetry-chip">${roadmap.category.toUpperCase()} PREPARATION TRACK</span>
                ${roadmap.days_remaining ? `<span class="mono-chip" style="color: #f59e0b;">⏳ ${roadmap.days_remaining} DAYS REMAINING</span>` : ''}
              </div>
              <h2 class="display-sm" style="color: #fff; margin: 0;">${roadmap.exam_name}</h2>
              <p style="color: var(--tp-text-dark-secondary); margin-top: 0.25rem; font-size: 0.95rem;">
                Target Goal: <strong>${roadmap.target_score}</strong> | Pacing: <strong>${roadmap.daily_study_hours}h daily</strong> (~${roadmap.total_estimated_hours} total hours across ${roadmap.calculated_weeks} weeks)
              </p>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button id="reconfigure-exam-btn" class="tp-btn tp-btn-secondary tp-btn-sm">⚙️ Reconfigure Goal</button>
              <button id="regenerate-exam-btn" class="tp-btn tp-btn-primary tp-btn-sm">🔄 Regenerate Roadmap</button>
            </div>
          </div>

          <!-- Overall Progress Bar -->
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.4rem;">
              <span style="color: var(--tp-text-dark-secondary);">Preparation Progression</span>
              <strong style="color: var(--tp-success);">${roadmap.overall_progress}% Complete (${roadmap.completed_tasks || 0} / ${roadmap.total_tasks} Tasks)</strong>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
              <div style="width: ${roadmap.overall_progress}%; height: 100%; background: var(--tp-success); transition: width 0.3s ease;"></div>
            </div>
          </div>

          <!-- Strategy Insights -->
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-sm); padding: 0.85rem 1rem;">
            <strong style="font-size: 0.82rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">AI Preparation Strategy Guidelines:</strong>
            <ul style="margin: 0.35rem 0 0 1.25rem; padding: 0; font-size: 0.85rem; color: var(--tp-text-dark-secondary); line-height: 1.5;">
              ${(roadmap.strategy_notes || []).map(sn => `<li>${sn}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Phases List -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${roadmap.phases.map((ph) => {
            const isPhaseDone = ph.progress === 100;
            return `
              <div class="tp-card tp-card-glass" style="padding: 1.5rem; border: 1px solid ${isPhaseDone ? 'rgba(16,185,129,0.3)' : 'var(--tp-border-dark)'};">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <div>
                    <span class="mono-chip" style="color: ${isPhaseDone ? 'var(--tp-success)' : 'var(--tp-primary)'}; font-size: 0.75rem;">
                      PHASE 0${ph.phase_number} // ${ph.duration_weeks} WEEKS
                    </span>
                    <h3 class="headline-md" style="color: #fff; margin: 0.2rem 0 0 0;">${ph.title}</h3>
                    <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin: 0.2rem 0 0 0;">
                      Focus: ${ph.focus}
                    </p>
                  </div>

                  <div style="text-align: right;">
                    <span style="font-size: 0.82rem; font-weight: 700; color: ${isPhaseDone ? 'var(--tp-success)' : 'var(--tp-primary)'};">
                      ${ph.progress || 0}% Complete
                    </span>
                  </div>
                </div>

                <!-- Phase Progress Bar -->
                <div style="height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; margin-bottom: 1.25rem;">
                  <div style="width: ${ph.progress || 0}%; height: 100%; background: ${isPhaseDone ? 'var(--tp-success)' : 'var(--tp-primary)'}; transition: width 0.3s ease;"></div>
                </div>

                <!-- Actionable Tasks Checklist -->
                <div style="display: flex; flex-direction: column; gap: 0.65rem;">
                  ${ph.tasks.map(t => {
                    const isDone = t.status === 'completed';
                    const isInProg = t.status === 'in_progress';
                    return `
                      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-sm); flex-wrap: wrap; gap: 0.5rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1; min-width: 250px;">
                          <button class="exam-task-toggle-btn" data-roadmap="${roadmap.id}" data-task="${t.id}" data-status="${t.status}" style="background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0; line-height: 1;" title="${isDone ? 'Mark uncompleted' : 'Mark completed'}">
                            ${isDone ? '✅' : isInProg ? '⏳' : '⬜'}
                          </button>
                          <div>
                            <span style="font-size: 0.92rem; color: ${isDone ? '#94a3b8' : '#fff'}; ${isDone ? 'text-decoration: line-through;' : ''}">
                              ${t.title}
                            </span>
                            <div style="font-size: 0.75rem; color: var(--tp-text-dark-muted); margin-top: 0.15rem;">
                              Est. Effort: ${t.est_hours || 3} Hours &bull; Type: ${t.type.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                          ${t.resourceUrl ? `
                            <a href="${t.resourceUrl}" class="tp-btn tp-btn-ghost tp-btn-xs" style="font-size: 0.75rem; border: 1px solid var(--tp-border-dark);">
                              Study & Practice &rarr;
                            </a>
                          ` : ''}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // EVENT BINDINGS
  // ────────────────────────────────────────────────────────────────────────────
  static _bindGlobalEvents(container, trajectory, availableExams, activeExamRoadmap, user) {
    // Mode switcher
    container.querySelector('#mode-career-btn')?.addEventListener('click', () => {
      RoadmapsPage.activeMode = 'career';
      RoadmapsPage.render(container);
    });

    container.querySelector('#mode-exam-btn')?.addEventListener('click', () => {
      RoadmapsPage.activeMode = 'exam';
      RoadmapsPage.render(container);
    });

    // Form submission for new exam roadmap
    const form = container.querySelector('#exam-roadmap-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const examId = form.querySelector('#exam-select-input').value;
        const targetScore = form.querySelector('#target-score-input').value.trim();
        const examDate = form.querySelector('#exam-date-input').value;
        const currentLevel = form.querySelector('#current-level-input').value;
        const dailyHours = parseInt(form.querySelector('#daily-hours-input').value, 10);
        const weakAreas = (form.querySelector('#weak-areas-input').value || '').split(',').map(s => s.trim()).filter(Boolean);

        const btn = form.querySelector('#generate-roadmap-btn');
        btn.disabled = true;
        btn.textContent = 'Synthesizing Structured Roadmap...';

        try {
          await ExamRoadmapEngine.generateExamRoadmap({
            examId,
            targetScore,
            examDate: examDate || null,
            currentLevel,
            dailyHours,
            weakAreas,
            userId: user?.id || 'usr_guest',
            branch: user?.profile?.branch_id || 'cse'
          });

          RoadmapsPage.isConfiguringNew = false;
          Toast.success('Exam roadmap generated successfully!');
          RoadmapsPage.render(container);
        } catch (err) {
          Toast.error('Could not generate roadmap: ' + err.message);
          btn.disabled = false;
          btn.textContent = '🚀 Synthesize Personalized Preparation Roadmap →';
        }
      });

      container.querySelector('#cancel-config-btn')?.addEventListener('click', () => {
        RoadmapsPage.isConfiguringNew = false;
        RoadmapsPage.render(container);
      });
    }

    // Reconfigure exam roadmap
    container.querySelector('#reconfigure-exam-btn')?.addEventListener('click', () => {
      RoadmapsPage.isConfiguringNew = true;
      RoadmapsPage.render(container);
    });

    // Regenerate exam roadmap
    container.querySelector('#regenerate-exam-btn')?.addEventListener('click', async () => {
      if (!activeExamRoadmap) return;
      try {
        await ExamRoadmapEngine.generateExamRoadmap({
          examId: activeExamRoadmap.exam_id,
          targetScore: activeExamRoadmap.target_score,
          examDate: activeExamRoadmap.exam_date,
          currentLevel: activeExamRoadmap.current_level,
          dailyHours: activeExamRoadmap.daily_study_hours,
          weakAreas: activeExamRoadmap.weak_areas,
          userId: user?.id || 'usr_guest',
          branch: user?.profile?.branch_id || 'cse'
        });
        Toast.success('Exam roadmap regenerated!');
        RoadmapsPage.render(container);
      } catch (err) {
        Toast.error('Regeneration failed: ' + err.message);
      }
    });

    // Task completion toggle in Exam view
    container.querySelectorAll('.exam-task-toggle-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const roadmapId = e.currentTarget.dataset.roadmap;
        const taskId = e.currentTarget.dataset.task;
        const currentStatus = e.currentTarget.dataset.status;
        const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';

        try {
          await ExamRoadmapEngine.updateTaskStatus(
            user?.id || 'usr_guest',
            roadmapId,
            taskId,
            newStatus
          );
          Toast.success(newStatus === 'completed' ? 'Task marked complete! Overall progress updated.' : 'Task marked incomplete.');
          RoadmapsPage.render(container);
        } catch (err) {
          Toast.error('Could not update task: ' + err.message);
        }
      });
    });
  }
}

