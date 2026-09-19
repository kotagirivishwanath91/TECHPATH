/**
 * TECHPATH — MY EXAMS DASHBOARD
 * Route: #/exams/my-exams
 * Tracks saved target exams, active preparation milestones, mock scores telemetry, and revision progress.
 */

import { dbStore } from '../db/store.js';
import { Toast } from '../components/Toast.js';

export class MyExamsPage {
  static async render(container) {
    const savedExams = await dbStore.getAll('saved_exams');
    const allExams = await dbStore.getAll('exams');
    const examAttempts = await dbStore.getAll('exam_attempts');
    const practiceAttempts = await dbStore.getAll('practice_attempts');

    // Mapped saved exams
    const targetExams = savedExams.map(s => {
      const match = allExams.find(e => e.id === s.exam_id) || {};
      return { ...s, ...match };
    });

    const averageMockScore = examAttempts.length > 0
      ? Math.round(examAttempts.reduce((acc, a) => acc + (a.score || 0), 0) / examAttempts.length)
      : 0;

    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1150px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom:0.5rem">
              <span class="pulse-beacon"></span> CANDIDATE PREPARATION DASHBOARD
            </div>
            <h1 class="display-lg">My Exam Command Hub</h1>
            <p style="color:var(--tp-text-dark-secondary)">
              Manage targeted examination goals, study milestones, mock drill scores, and adaptive revision progress.
            </p>
          </div>
          <div style="display:flex;gap:0.5rem;">
            <a href="#/exams" class="tp-btn tp-btn-secondary">
              Browse All Exams
            </a>
            <a href="#/practice" class="tp-btn tp-btn-primary">
              ⚡ Start Daily Revision
            </a>
          </div>
        </div>

        <!-- Telemetry Ribbon -->
        <div class="tp-metrics-grid">
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-primary)">🎯</div>
            <div class="tp-metric-value">${targetExams.length}</div>
            <div class="tp-metric-label">Target Exams</div>
            <div class="tp-metric-sub">Active Goals Tracked</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-success)">📊</div>
            <div class="tp-metric-value">${practiceAttempts.length}</div>
            <div class="tp-metric-label">Practice Drills</div>
            <div class="tp-metric-sub">Completed Sessions</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-accent)">🏆</div>
            <div class="tp-metric-value">${averageMockScore}%</div>
            <div class="tp-metric-label">Avg Mock Score</div>
            <div class="tp-metric-sub">Across All Qualifiers</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:#38bdf8">📅</div>
            <div class="tp-metric-value">4 Phases</div>
            <div class="tp-metric-label">Avg Roadmap Depth</div>
            <div class="tp-metric-sub">Adaptive Progression</div>
          </div>
        </div>

        <!-- Active Target Exams List -->
        <div class="tp-card">
          <div class="tp-section-header" style="margin-bottom:1rem;">
            <div>
              <h2 class="headline-md">Saved Target Examinations (${targetExams.length})</h2>
              <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Current examinations pinned for intensive preparation.</p>
            </div>
            <a href="#/exams" class="tp-btn tp-btn-xs tp-btn-secondary">+ Add Target Exam</a>
          </div>

          ${targetExams.length === 0 ? `
            <div class="tp-empty-state" style="padding:2.5rem 1rem;text-align:center;">
              <div style="font-size:2.5rem;margin-bottom:0.75rem;">🎯</div>
              <h3 class="headline-sm">No Target Exams Pinned</h3>
              <p class="tp-empty-desc">Pin target exams like GATE, IELTS, or B.Tech End-Sem to track deadlines and roadmaps here.</p>
              <a href="#/exams" class="tp-btn tp-btn-primary tp-btn-sm" style="margin-top:1rem">Explore Exam Catalog</a>
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              ${targetExams.map(te => `
                <div style="padding:1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
                  <div>
                    <div style="display:flex;gap:0.5rem;align-items:center;">
                      <strong style="color:#fff;font-size:1rem;">${te.title || te.exam_title}</strong>
                      <span class="telemetry-chip">${(te.exam_type || 'EXAM').toUpperCase()}</span>
                    </div>
                    <div style="font-size:0.8rem;color:var(--tp-text-dark-secondary);margin-top:0.25rem;">
                      ${te.organizing_body || 'National Examination Board'} • Target: ${te.target_date || '2027'}
                    </div>
                  </div>

                  <div style="display:flex;gap:0.5rem;align-items:center;">
                    <a href="#/exams/${te.exam_id}" class="tp-btn tp-btn-sm tp-btn-primary">
                      View Roadmap & Dossier →
                    </a>
                    <button class="tp-btn tp-btn-sm tp-btn-secondary btn-remove-saved" data-id="${te.id}" style="color:var(--tp-error);">
                      ✕
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Preparation Milestones & Mock Simulator Results -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:1.5rem;">
          <!-- Study Milestones -->
          <div class="tp-card">
            <h3 class="headline-md" style="margin-bottom:1rem;">Upcoming Study Milestones</h3>
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              <div style="padding:0.75rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <strong style="color:var(--tp-primary);font-size:0.85rem;">Phase 1: Syllabus Decomposition</strong>
                  <span class="telemetry-chip" style="color:var(--tp-success);border-color:var(--tp-success);">COMPLETED</span>
                </div>
                <p style="font-size:0.8rem;color:var(--tp-text-dark-secondary);margin-top:0.25rem;">
                  High-weightage units identified across Engineering Mathematics & Algorithms.
                </p>
              </div>

              <div style="padding:0.75rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <strong style="color:#fff;font-size:0.85rem;">Phase 2: Core Foundation Numericals</strong>
                  <span class="telemetry-chip" style="color:var(--tp-accent);border-color:var(--tp-accent);">IN PROGRESS</span>
                </div>
                <p style="font-size:0.8rem;color:var(--tp-text-dark-secondary);margin-top:0.25rem;">
                  Daily problem sets on Discrete Structures, Differential Calculus, and Circuits.
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Practice Links -->
          <div class="tp-card">
            <h3 class="headline-md" style="margin-bottom:1rem;">Quick Revision Launchpad</h3>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              <a href="#/exams/pyqs" class="tp-btn tp-btn-secondary" style="justify-content:flex-start;">
                📜 Solve 10-Year Previous Year Questions (PYQs)
              </a>
              <a href="#/practice" class="tp-btn tp-btn-secondary" style="justify-content:flex-start;">
                ⚡ Daily Engineering MCQ & Numerical Drills
              </a>
              <a href="#/quiz-league" class="tp-btn tp-btn-secondary" style="justify-content:flex-start;">
                🏆 Monthly Quiz League Championship
              </a>
              <a href="#/interview/prep" class="tp-btn tp-btn-secondary" style="justify-content:flex-start;">
                🎤 Technical & Campus Placement Interview Studio
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove saved exam handler
    container.querySelectorAll('.btn-remove-saved').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await dbStore.delete('saved_exams', id);
        Toast.info('Removed from My Exams.');
        MyExamsPage.render(container);
      });
    });
  }
}
