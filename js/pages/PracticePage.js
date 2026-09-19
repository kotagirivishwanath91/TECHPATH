/**
 * TECHPATH — PRACTICE CENTER
 * Comprehensive engineering practice suite covering Subject, Topic, MCQs, PYQs,
 * Coding, Engineering Problems, Aptitude, Reasoning, Quantitative, Technical,
 * Interview, and Exam drills with live timer, question navigation, scoring, and review.
 */

import { learningContext } from '../context/LearningContext.js';
import { PracticeEngine, PRACTICE_CATEGORIES } from '../services/PracticeEngine.js';
import { Toast } from '../components/Toast.js';

export class PracticePage {
  static async render(container) {
    const ctx = learningContext.get();
    let currentCategory = 'all';
    let currentBranch = ctx.branch_id || 'cse';
    let currentSemester = ctx.semester_id || 'all';
    let currentDifficulty = 'all';
    let searchQuery = '';

    // Session State
    let sessionMode = 'browse'; // 'browse' | 'active_drill' | 'result' | 'history'
    let sessionQuestions = [];
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let markedForReview = {};
    let timerInterval = null;
    let elapsedSeconds = 0;
    let evaluationReport = null;

    async function loadDataAndRender() {
      if (sessionMode === 'active_drill') {
        renderActiveDrill();
        return;
      }
      if (sessionMode === 'result' && evaluationReport) {
        renderResultView();
        return;
      }
      if (sessionMode === 'history') {
        await renderHistoryView();
        return;
      }

      const questions = await PracticeEngine.getQuestions({
        category: currentCategory,
        branchId: currentBranch,
        semesterId: currentSemester,
        difficulty: currentDifficulty,
        search: searchQuery
      });

      container.innerHTML = `
        <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1200px;">
          <!-- Header -->
          <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom:0.5rem">
                <span class="pulse-beacon"></span> ENGINEERING PRACTICE CENTER // REVISION MATRIX
              </div>
              <h1 class="display-lg">Practice Center</h1>
              <p style="color:var(--tp-text-dark-secondary)">
                Rigorous question bank across subject drills, engineering problems, aptitude, and competitive qualifiers.
              </p>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <button id="btn-view-history" class="tp-btn tp-btn-secondary">
                📊 Attempt History
              </button>
              <button id="btn-start-drill-top" class="tp-btn tp-btn-primary" ${questions.length === 0 ? 'disabled' : ''}>
                ⚡ Start Timed Practice Drill (${questions.length} Qs)
              </button>
            </div>
          </div>

          <!-- Category Filter Bar (12 Categories) -->
          <div style="display:flex;gap:0.4rem;overflow-x:auto;padding-bottom:0.35rem;">
            ${PRACTICE_CATEGORIES.map(cat => `
              <button class="tp-btn ${currentCategory === cat.id ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm practice-cat-btn" data-cat="${cat.id}" style="white-space:nowrap;">
                <span>${cat.icon}</span> ${cat.label}
              </button>
            `).join('')}
          </div>

          <!-- Secondary Filters & Search -->
          <div class="tp-card" style="padding:1rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
            <div style="flex:1;min-width:220px;position:relative;">
              <input type="search" id="practice-search-input" class="tp-input" placeholder="Search questions by keyword or topic..." value="${searchQuery}" style="padding-left:2.25rem;" />
              <span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:var(--tp-text-dark-muted);">🔍</span>
            </div>

            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <select id="filter-branch" class="tp-input" style="width:auto;padding:0.5rem 1rem;">
                <option value="all" ${currentBranch === 'all' ? 'selected' : ''}>All Branches</option>
                <option value="cse" ${currentBranch === 'cse' ? 'selected' : ''}>CSE (Computer Science)</option>
                <option value="ece" ${currentBranch === 'ece' ? 'selected' : ''}>ECE (Electronics)</option>
                <option value="eee" ${currentBranch === 'eee' ? 'selected' : ''}>EEE (Electrical)</option>
                <option value="mech" ${currentBranch === 'mech' ? 'selected' : ''}>MECH (Mechanical)</option>
                <option value="civil" ${currentBranch === 'civil' ? 'selected' : ''}>CIVIL (Infrastructure)</option>
                <option value="aiml" ${currentBranch === 'aiml' ? 'selected' : ''}>AI/ML</option>
              </select>

              <select id="filter-semester" class="tp-input" style="width:auto;padding:0.5rem 1rem;">
                <option value="all" ${currentSemester === 'all' ? 'selected' : ''}>All Semesters</option>
                ${[1,2,3,4,5,6,7,8].map(s => `
                  <option value="sem_${s}" ${currentSemester === `sem_${s}` ? 'selected' : ''}>Sem ${s}</option>
                `).join('')}
              </select>

              <select id="filter-difficulty" class="tp-input" style="width:auto;padding:0.5rem 1rem;">
                <option value="all" ${currentDifficulty === 'all' ? 'selected' : ''}>All Difficulties</option>
                <option value="easy" ${currentDifficulty === 'easy' ? 'selected' : ''}>🟢 Easy</option>
                <option value="medium" ${currentDifficulty === 'medium' ? 'selected' : ''}>🟡 Medium</option>
                <option value="hard" ${currentDifficulty === 'hard' ? 'selected' : ''}>🔴 Hard</option>
              </select>
            </div>
          </div>

          <!-- Question Cards Container -->
          ${questions.length === 0 ? `
            <div class="tp-empty-state" style="border:1px solid var(--tp-border-dark);border-radius:var(--radius-md);padding:4rem 2rem;text-align:center;">
              <div style="font-size:3rem;margin-bottom:1rem">📚</div>
              <h2 class="headline-lg">No questions match the selected filter criteria</h2>
              <p class="tp-empty-desc">Adjust the category, branch, or difficulty filter above to view questions.</p>
              <button id="reset-filters-btn" class="tp-btn tp-btn-secondary" style="margin-top:1rem">Reset All Filters</button>
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:1.25rem;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:0.85rem;color:var(--tp-text-dark-secondary);">
                  Showing <strong>${questions.length}</strong> authenticated practice questions
                </span>
                <button id="btn-start-drill-body" class="tp-btn tp-btn-primary tp-btn-sm">
                  ⚡ Attempt All in Drill Mode
                </button>
              </div>

              ${questions.map((q, idx) => `
                <div class="tp-card" style="display:flex;flex-direction:column;gap:0.75rem;">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;">
                    <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
                      <span class="mono-chip" style="color:var(--tp-primary);">Q${idx + 1}</span>
                      <span class="telemetry-chip">${(q.branch_id || 'ALL').toUpperCase()}</span>
                      <span class="telemetry-chip">${q.subject || 'Engineering'}</span>
                      <span class="mono-chip" style="color:var(--tp-text-dark-muted);">${q.topic || ''}</span>
                    </div>
                    <span class="telemetry-chip" style="
                      color:${q.difficulty === 'hard' ? 'var(--tp-error)' : q.difficulty === 'easy' ? 'var(--tp-success)' : 'var(--tp-accent)'};
                      border-color:${q.difficulty === 'hard' ? 'var(--tp-error)' : q.difficulty === 'easy' ? 'var(--tp-success)' : 'var(--tp-accent)'};
                    ">
                      ${(q.difficulty || 'medium').toUpperCase()}
                    </span>
                  </div>

                  <div style="font-size:1.05rem;font-weight:600;color:#fff;line-height:1.5;">
                    ${q.question}
                  </div>

                  <!-- Options List -->
                  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:0.5rem;margin-top:0.5rem;">
                    ${(q.options || []).map((opt, optIdx) => `
                      <div class="practice-opt-preview" style="padding:0.65rem 0.85rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);font-size:0.9rem;display:flex;gap:0.5rem;align-items:center;">
                        <span style="color:var(--tp-text-dark-muted);font-weight:700;">${String.fromCharCode(65 + optIdx)}.</span>
                        <span>${opt}</span>
                      </div>
                    `).join('')}
                  </div>

                  <!-- Expandable Solution Accordion -->
                  <details style="margin-top:0.5rem;border-top:1px solid rgba(255,255,255,0.04);padding-top:0.5rem;">
                    <summary style="font-size:0.85rem;color:var(--tp-primary);cursor:pointer;font-weight:600;user-select:none;">
                      💡 View Explanation & Answer Key
                    </summary>
                    <div style="margin-top:0.75rem;padding:0.75rem 1rem;background:rgba(99,102,241,0.06);border-left:3px solid var(--tp-primary);border-radius:var(--radius-sm);font-size:0.85rem;color:var(--tp-text-dark-secondary);">
                      <p style="margin-bottom:0.25rem;"><strong style="color:var(--tp-success);">Correct Option:</strong> ${String.fromCharCode(65 + (q.correct_option !== undefined ? q.correct_option : 0))} (${(q.options || [])[q.correct_option !== undefined ? q.correct_option : 0]})</p>
                      <p style="line-height:1.5;">${q.explanation || 'Referenced directly from standard core engineering curricula.'}</p>
                    </div>
                  </details>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;

      bindBrowseEvents(questions);
    }

    function bindBrowseEvents(questions) {
      // Category tabs
      container.querySelectorAll('.practice-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentCategory = btn.dataset.cat;
          loadDataAndRender();
        });
      });

      // Filter selects
      const branchSel = container.querySelector('#filter-branch');
      if (branchSel) branchSel.addEventListener('change', (e) => { currentBranch = e.target.value; loadDataAndRender(); });

      const semSel = container.querySelector('#filter-semester');
      if (semSel) semSel.addEventListener('change', (e) => { currentSemester = e.target.value; loadDataAndRender(); });

      const diffSel = container.querySelector('#filter-difficulty');
      if (diffSel) diffSel.addEventListener('change', (e) => { currentDifficulty = e.target.value; loadDataAndRender(); });

      // Search input
      const searchInput = container.querySelector('#practice-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value;
          // Debounce re-render slightly
          clearTimeout(window._practiceSearchTimer);
          window._practiceSearchTimer = setTimeout(() => loadDataAndRender(), 250);
        });
      }

      // Reset filters button
      const resetBtn = container.querySelector('#reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          currentBranch = 'all';
          currentSemester = 'all';
          currentDifficulty = 'all';
          searchQuery = '';
          loadDataAndRender();
        });
      }

      // View History button
      const histBtn = container.querySelector('#btn-view-history');
      if (histBtn) histBtn.addEventListener('click', () => { sessionMode = 'history'; loadDataAndRender(); });

      // Start Drill buttons
      const startTop = container.querySelector('#btn-start-drill-top');
      const startBody = container.querySelector('#btn-start-drill-body');
      const startHandler = () => {
        if (questions.length === 0) return;
        sessionQuestions = [...questions];
        currentQuestionIndex = 0;
        userAnswers = {};
        markedForReview = {};
        elapsedSeconds = 0;
        sessionMode = 'active_drill';
        loadDataAndRender();
      };
      if (startTop) startTop.addEventListener('click', startHandler);
      if (startBody) startBody.addEventListener('click', startHandler);
    }

    // --- ACTIVE DRILL RUNNER VIEW ---
    function renderActiveDrill() {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        elapsedSeconds++;
        const timerEl = container.querySelector('#drill-timer-display');
        if (timerEl) {
          const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
          const secs = String(elapsedSeconds % 60).padStart(2, '0');
          timerEl.textContent = `⏱️ ${mins}:${secs}`;
        }
      }, 1000);

      const q = sessionQuestions[currentQuestionIndex];
      const selected = userAnswers[q.id];
      const isMarked = !!markedForReview[q.id];

      const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
      const secs = String(elapsedSeconds % 60).padStart(2, '0');

      container.innerHTML = `
        <div class="tp-page" style="display:flex;flex-direction:column;gap:1.5rem;max-width:1100px;">
          <!-- Drill Header & Sticky Timer -->
          <div style="display:flex;justify-content:space-between;align-items:center;padding:1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-md);position:sticky;top:1rem;z-index:10;backdrop-filter:blur(8px);">
            <div style="display:flex;gap:0.75rem;align-items:center;">
              <span class="mono-chip" style="color:var(--tp-primary);font-size:1rem;font-weight:700;">
                Question ${currentQuestionIndex + 1} of ${sessionQuestions.length}
              </span>
              <span class="telemetry-chip">${(q.branch_id || 'CORE').toUpperCase()}</span>
            </div>
            <div style="display:flex;gap:1rem;align-items:center;">
              <div id="drill-timer-display" style="font-family:monospace;font-size:1.1rem;font-weight:700;color:var(--tp-accent);">
                ⏱️ ${mins}:${secs}
              </div>
              <button id="btn-submit-drill" class="tp-btn tp-btn-primary tp-btn-sm" style="background:var(--tp-success);border-color:var(--tp-success);">
                ✓ Finish & Submit Drill
              </button>
            </div>
          </div>

          <!-- Question Body Card -->
          <div class="tp-card" style="display:flex;flex-direction:column;gap:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.85rem;color:var(--tp-text-dark-secondary);">
                ${q.subject || 'Engineering Subject'} • <strong>${q.topic || 'General Domain'}</strong>
              </span>
              <button id="btn-mark-review" class="tp-btn ${isMarked ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-xs">
                ${isMarked ? '★ Marked for Review' : '☆ Mark for Review'}
              </button>
            </div>

            <h2 class="headline-md" style="line-height:1.5;color:#fff;">
              ${q.question}
            </h2>

            <!-- Interactive Answer Options -->
            <div style="display:flex;flex-direction:column;gap:0.75rem;margin-top:0.5rem;">
              ${(q.options || []).map((opt, idx) => {
                const isChecked = selected !== undefined && Number(selected) === idx;
                return `
                  <label class="practice-option-row" style="
                    display:flex;align-items:center;gap:1rem;padding:1rem 1.25rem;border-radius:var(--radius-sm);
                    background:${isChecked ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)'};
                    border:1px solid ${isChecked ? 'var(--tp-primary)' : 'var(--tp-border-dark)'};
                    cursor:pointer;transition:all 0.2s;
                  ">
                    <input type="radio" name="opt-${q.id}" value="${idx}" ${isChecked ? 'checked' : ''} style="width:1.25rem;height:1.25rem;accent-color:var(--tp-primary);" />
                    <span style="font-weight:700;color:${isChecked ? 'var(--tp-primary)' : 'var(--tp-text-dark-muted)'};font-size:1rem;">
                      ${String.fromCharCode(65 + idx)}.
                    </span>
                    <span style="font-size:0.95rem;color:#fff;">${opt}</span>
                  </label>
                `;
              }).join('')}
            </div>

            <!-- Navigation Controls -->
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--tp-border-dark);padding-top:1rem;margin-top:1rem;">
              <button id="btn-prev-q" class="tp-btn tp-btn-secondary" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                ← Previous
              </button>
              <button id="btn-clear-choice" class="tp-btn tp-btn-secondary tp-btn-xs" style="color:var(--tp-text-dark-muted)">
                Clear Choice
              </button>
              <button id="btn-next-q" class="tp-btn tp-btn-primary">
                ${currentQuestionIndex === sessionQuestions.length - 1 ? 'Go to Review / Submit →' : 'Next Question →'}
              </button>
            </div>
          </div>

          <!-- Question Palette Matrix -->
          <div class="tp-card" style="padding:1rem;">
            <div style="font-size:0.85rem;font-weight:700;margin-bottom:0.75rem;color:var(--tp-text-dark-secondary);">
              QUESTION NAVIGATION PALETTE
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              ${sessionQuestions.map((sq, i) => {
                const ans = userAnswers[sq.id] !== undefined;
                const mrk = !!markedForReview[sq.id];
                const active = i === currentQuestionIndex;
                let bg = 'rgba(255,255,255,0.04)';
                let color = 'var(--tp-text-dark-muted)';
                let border = 'var(--tp-border-dark)';

                if (active) { border = '#fff'; }
                if (ans) { bg = 'rgba(16,185,129,0.2)'; color = 'var(--tp-success)'; border = 'var(--tp-success)'; }
                if (mrk) { bg = 'rgba(245,158,11,0.2)'; color = '#f59e0b'; border = '#f59e0b'; }

                return `
                  <button class="tp-btn tp-btn-xs jump-q-btn" data-index="${i}" style="
                    width:36px;height:36px;padding:0;background:${bg};color:${color};border-color:${border};font-weight:700;
                  ">
                    ${i + 1}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      `;

      // Event handlers for active drill
      container.querySelectorAll(`input[name="opt-${q.id}"]`).forEach(radio => {
        radio.addEventListener('change', (e) => {
          userAnswers[q.id] = parseInt(e.target.value, 10);
          renderActiveDrill();
        });
      });

      container.querySelector('#btn-mark-review')?.addEventListener('click', () => {
        markedForReview[q.id] = !markedForReview[q.id];
        renderActiveDrill();
      });

      container.querySelector('#btn-clear-choice')?.addEventListener('click', () => {
        delete userAnswers[q.id];
        renderActiveDrill();
      });

      container.querySelector('#btn-prev-q')?.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          renderActiveDrill();
        }
      });

      container.querySelector('#btn-next-q')?.addEventListener('click', () => {
        if (currentQuestionIndex < sessionQuestions.length - 1) {
          currentQuestionIndex++;
          renderActiveDrill();
        } else {
          // Confirm submit
          triggerSubmit();
        }
      });

      container.querySelectorAll('.jump-q-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentQuestionIndex = parseInt(btn.dataset.index, 10);
          renderActiveDrill();
        });
      });

      container.querySelector('#btn-submit-drill')?.addEventListener('click', triggerSubmit);
    }

    async function triggerSubmit() {
      if (confirm('Are you sure you want to submit your practice drill? Answers will be evaluated instantly.')) {
        if (timerInterval) clearInterval(timerInterval);
        evaluationReport = await PracticeEngine.evaluatePracticeAttempt({
          category: currentCategory,
          questions: sessionQuestions,
          userAnswers,
          markedForReview,
          timeSpentSeconds: elapsedSeconds
        });
        sessionMode = 'result';
        loadDataAndRender();
      }
    }

    // --- RESULT DOSSIER VIEW ---
    function renderResultView() {
      const rep = evaluationReport;
      const mins = Math.floor(rep.timeSpentSeconds / 60);
      const secs = rep.timeSpentSeconds % 60;

      container.innerHTML = `
        <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1100px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom:0.5rem;color:var(--tp-success);border-color:var(--tp-success);">
                ✓ DRILL COMPLETED & GRADED
              </div>
              <h1 class="display-lg">Performance Assessment</h1>
              <p style="color:var(--tp-text-dark-secondary)">Detailed question review, accuracy metrics, and recommended remediation topics.</p>
            </div>
            <div style="display:flex;gap:0.5rem;">
              <button id="btn-return-browse" class="tp-btn tp-btn-secondary">
                ← Return to Practice Center
              </button>
              <button id="btn-retry-drill" class="tp-btn tp-btn-primary">
                🔄 Re-Attempt This Drill
              </button>
            </div>
          </div>

          <!-- Scorecard Ribbon -->
          <div class="tp-metrics-grid">
            <div class="tp-metric-card tp-card">
              <div class="tp-metric-icon" style="color:var(--tp-primary)">🎯</div>
              <div class="tp-metric-value">${rep.score} / ${rep.total}</div>
              <div class="tp-metric-label">Total Score</div>
              <div class="tp-metric-sub">${rep.accuracy}% Accuracy Rate</div>
            </div>
            <div class="tp-metric-card tp-card">
              <div class="tp-metric-icon" style="color:var(--tp-success)">✅</div>
              <div class="tp-metric-value">${rep.attempt.correct_count}</div>
              <div class="tp-metric-label">Correct Solutions</div>
              <div class="tp-metric-sub">Verified against key</div>
            </div>
            <div class="tp-metric-card tp-card">
              <div class="tp-metric-icon" style="color:var(--tp-error)">❌</div>
              <div class="tp-metric-value">${rep.attempt.incorrect_count}</div>
              <div class="tp-metric-label">Incorrect Answers</div>
              <div class="tp-metric-sub">${rep.attempt.unanswered_count} Unanswered</div>
            </div>
            <div class="tp-metric-card tp-card">
              <div class="tp-metric-icon" style="color:var(--tp-accent)">⏱️</div>
              <div class="tp-metric-value">${mins}m ${secs}s</div>
              <div class="tp-metric-label">Total Time Spent</div>
              <div class="tp-metric-sub">Avg ~${Math.round(rep.timeSpentSeconds / (rep.total || 1))}s per question</div>
            </div>
          </div>

          <!-- Weak Topics Diagnostic -->
          ${rep.weakTopics.length > 0 ? `
            <div class="tp-card" style="border-left:4px solid var(--tp-error);">
              <h3 class="headline-sm" style="color:var(--tp-error);margin-bottom:0.25rem;">
                ⚠️ Identified Revision Topics
              </h3>
              <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin-bottom:0.75rem;">
                Based on incorrect selections, we recommend revising these specific engineering topics in LearnHub:
              </p>
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                ${rep.weakTopics.map(wt => `
                  <span class="telemetry-chip" style="color:var(--tp-error);border-color:var(--tp-error);">
                    ${wt}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="tp-card" style="border-left:4px solid var(--tp-success);">
              <h3 class="headline-sm" style="color:var(--tp-success);margin-bottom:0.25rem;">
                🌟 Flawless Accuracy
              </h3>
              <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);">
                Zero concept gaps detected in this practice session. Excellent command of syllabus fundamentals!
              </p>
            </div>
          `}

          <!-- Question-by-Question Review -->
          <div style="display:flex;flex-direction:column;gap:1rem;">
            <h2 class="headline-md">Step-by-Step Question Audit</h2>
            ${rep.details.map((d, i) => `
              <div class="tp-card" style="display:flex;flex-direction:column;gap:0.75rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
                  <div style="display:flex;gap:0.5rem;align-items:center;">
                    <span class="mono-chip" style="color:var(--tp-primary);">Q${d.questionIndex}</span>
                    <span class="telemetry-chip">${d.topic || 'Concept'}</span>
                  </div>
                  <span class="telemetry-chip" style="
                    color:${d.isCorrect ? 'var(--tp-success)' : !d.isAnswered ? 'var(--tp-text-dark-muted)' : 'var(--tp-error)'};
                    border-color:${d.isCorrect ? 'var(--tp-success)' : !d.isAnswered ? 'var(--tp-text-dark-muted)' : 'var(--tp-error)'};
                  ">
                    ${d.isCorrect ? '✓ CORRECT' : !d.isAnswered ? '○ UNANSWERED' : '✗ INCORRECT'}
                  </span>
                </div>

                <div style="font-size:1rem;font-weight:600;color:#fff;">
                  ${d.question}
                </div>

                <div style="font-size:0.85rem;color:var(--tp-text-dark-secondary);">
                  <p>
                    <strong>Your Response:</strong>
                    ${d.selectedOption !== undefined ? `Option ${String.fromCharCode(65 + d.selectedOption)}` : '<span style="color:var(--tp-text-dark-muted);">None (Skipped)</span>'}
                  </p>
                  <p style="color:var(--tp-success);margin-top:0.25rem;">
                    <strong>Correct Answer:</strong> Option ${String.fromCharCode(65 + d.correctOption)}
                  </p>
                </div>

                <div style="padding:0.75rem 1rem;background:rgba(99,102,241,0.05);border-left:3px solid var(--tp-primary);border-radius:var(--radius-sm);font-size:0.85rem;color:var(--tp-text-dark-secondary);line-height:1.5;">
                  <strong>Explanation:</strong> ${d.explanation || 'Verified from core academic derivations.'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      container.querySelector('#btn-return-browse')?.addEventListener('click', () => {
        sessionMode = 'browse';
        evaluationReport = null;
        loadDataAndRender();
      });

      container.querySelector('#btn-retry-drill')?.addEventListener('click', () => {
        currentQuestionIndex = 0;
        userAnswers = {};
        markedForReview = {};
        elapsedSeconds = 0;
        sessionMode = 'active_drill';
        loadDataAndRender();
      });
    }

    // --- ATTEMPT HISTORY VIEW ---
    async function renderHistoryView() {
      const history = await PracticeEngine.getAttemptHistory();

      container.innerHTML = `
        <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1100px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom:0.5rem">
                <span class="pulse-beacon"></span> ATTEMPT TELEMETRY LOGS
              </div>
              <h1 class="display-lg">Practice Attempt History</h1>
              <p style="color:var(--tp-text-dark-secondary)">Historical log of all timed practice drills, scores, and accuracy percentages.</p>
            </div>
            <button id="btn-back-to-practice" class="tp-btn tp-btn-secondary">
              ← Return to Practice Center
            </button>
          </div>

          ${history.length === 0 ? `
            <div class="tp-empty-state" style="border:1px solid var(--tp-border-dark);border-radius:var(--radius-md);padding:4rem 2rem;text-align:center;">
              <div style="font-size:3rem;margin-bottom:1rem">⏱️</div>
              <h2 class="headline-lg">No Practice Attempts Recorded Yet</h2>
              <p class="tp-empty-desc">Start a timed practice drill above to record your performance history.</p>
            </div>
          ` : `
            <div class="tp-card" style="padding:0;overflow:hidden;">
              <div style="overflow-x:auto">
                <table class="tp-table" style="width:100%;font-size:0.85rem;border-collapse:collapse;">
                  <thead>
                    <tr style="border-bottom:1px solid var(--tp-border-dark);text-align:left;color:var(--tp-text-dark-muted);">
                      <th style="padding:0.75rem 1rem">Date & Time</th>
                      <th style="padding:0.75rem 1rem">Category</th>
                      <th style="padding:0.75rem 1rem">Score</th>
                      <th style="padding:0.75rem 1rem">Accuracy</th>
                      <th style="padding:0.75rem 1rem">Duration</th>
                      <th style="padding:0.75rem 1rem">Weak Areas Identified</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${history.map(att => `
                      <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                        <td style="padding:0.75rem 1rem;font-size:0.8rem;color:var(--tp-text-dark-secondary);">
                          ${new Date(att.created_at).toLocaleString()}
                        </td>
                        <td style="padding:0.75rem 1rem;">
                          <span class="telemetry-chip">${(att.category || 'PRACTICE').toUpperCase()}</span>
                        </td>
                        <td style="padding:0.75rem 1rem;font-weight:700;color:#fff;">
                          ${att.score} / ${att.total_questions}
                        </td>
                        <td style="padding:0.75rem 1rem;">
                          <span class="telemetry-chip" style="
                            color:${att.accuracy_percentage >= 80 ? 'var(--tp-success)' : att.accuracy_percentage >= 50 ? 'var(--tp-accent)' : 'var(--tp-error)'};
                            border-color:${att.accuracy_percentage >= 80 ? 'var(--tp-success)' : att.accuracy_percentage >= 50 ? 'var(--tp-accent)' : 'var(--tp-error)'};
                          ">
                            ${att.accuracy_percentage}%
                          </span>
                        </td>
                        <td style="padding:0.75rem 1rem;font-family:monospace;color:var(--tp-text-dark-muted);">
                          ${Math.floor(att.time_spent_seconds / 60)}m ${att.time_spent_seconds % 60}s
                        </td>
                        <td style="padding:0.75rem 1rem;font-size:0.8rem;color:var(--tp-text-dark-secondary);">
                          ${(att.weak_topics && att.weak_topics.length > 0) ? att.weak_topics.join(', ') : 'None (Mastered)'}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `}
        </div>
      `;

      container.querySelector('#btn-back-to-practice')?.addEventListener('click', () => {
        sessionMode = 'browse';
        loadDataAndRender();
      });
    }

    await loadDataAndRender();
  }
}
