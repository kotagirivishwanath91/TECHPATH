/**
 * TECHPATH — MONTHLY QUIZ LEAGUE COMPETITION PLATFORM
 * Route: #/quiz-league
 * 4 Monthly Scheduled Events, Strict Date/Time Lock, Branch+Semester Isolated Questions,
 * Single-Attempt Enforcement, and Deterministic Leaderboards.
 */

import { authContext } from '../context/AuthContext.js';
import { learningContext } from '../context/LearningContext.js';
import { QuizLeagueEngine } from '../services/QuizLeagueEngine.js';
import { Toast } from '../components/Toast.js';

export class QuizLeaguePage {
  static async render(container, params = {}) {
    const user = authContext.getUser() || { id: 'usr_guest', email: 'student@techpath.edu' };
    const ctx = learningContext.get();
    const userBranch = ctx.branch_id || 'cse';
    const userSemester = ctx.semester_id || 'sem_3';

    let events = await QuizLeagueEngine.getEvents();
    let selectedEventId = params.eventId || (events.find(e => e.dynamicStatus === 'LIVE') || events[0])?.id;
    let selectedEvent = events.find(e => e.id === selectedEventId) || events[0];

    // Page Tab: 'events' | 'live_runner' | 'result' | 'leaderboard' | 'monthly_standings'
    let currentTab = 'events';
    let runnerQuestions = [];
    let currentQuestionIdx = 0;
    let userAnswers = {};
    let markedForReview = {};
    let timerInterval = null;
    let remainingTimeSeconds = 0;
    let resultDossier = null;
    let countdownInterval = null;

    async function loadShell() {
      if (countdownInterval) clearInterval(countdownInterval);

      if (currentTab === 'live_runner') {
        renderLiveRunner();
        return;
      }
      if (currentTab === 'result' && resultDossier) {
        renderResultView();
        return;
      }

      events = await QuizLeagueEngine.getEvents();
      selectedEvent = events.find(e => e.id === selectedEventId) || events[0];
      const stateMeta = QuizLeagueEngine.evaluateState(selectedEvent);

      container.innerHTML = `
        <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1150px;">
          <!-- Header -->
          <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom:0.5rem">
                <span class="pulse-beacon"></span> RECURRING SCHEDULED COMPETITION // 4 WEEKS PER MONTH
              </div>
              <h1 class="display-lg">TechPath Monthly Quiz League</h1>
              <p style="color:var(--tp-text-dark-secondary)">
                Official scheduled engineering championship with branch + semester-isolated question sets and live deterministic leaderboards.
              </p>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <button id="btn-view-monthly-league" class="tp-btn tp-btn-secondary">
                🏆 September League Standings
              </button>
            </div>
          </div>

          <!-- Monthly 4-Week Schedule Grid -->
          <div>
            <div style="font-size:0.85rem;font-weight:700;color:var(--tp-text-dark-muted);margin-bottom:0.5rem;">
              SEPTEMBER 2026 CALENDAR (4 SCHEDULED QUIZ EVENTS)
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:0.75rem;">
              ${events.map(evt => {
                const s = QuizLeagueEngine.evaluateState(evt);
                const isSelected = evt.id === selectedEventId;
                let badgeColor = 'var(--tp-accent)';
                let badgeText = s.state;
                if (s.state === 'LIVE') { badgeColor = 'var(--tp-success)'; badgeText = '🟢 LIVE NOW'; }
                else if (s.state === 'ENDED') { badgeColor = 'var(--tp-text-dark-muted)'; badgeText = 'CLOSED'; }
                else { badgeColor = '#f59e0b'; badgeText = '🔒 LOCKED'; }

                return `
                  <div class="tp-card event-selector-card" data-id="${evt.id}" style="
                    cursor:pointer;padding:1rem;border:1px solid ${isSelected ? 'var(--tp-primary)' : 'var(--tp-border-dark)'};
                    background:${isSelected ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)'};
                    transition:all 0.2s;
                  ">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">
                      <span class="mono-chip" style="color:var(--tp-primary);font-weight:700;">WEEK ${evt.week_number}</span>
                      <span class="telemetry-chip" style="color:${badgeColor};border-color:${badgeColor};font-size:0.75rem;">
                        ${badgeText}
                      </span>
                    </div>
                    <strong style="color:#fff;font-size:0.95rem;display:block;margin:0.25rem 0;">
                      ${(evt.branch_id || 'ALL').toUpperCase()} Championship
                    </strong>
                    <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);">
                      ${new Date(evt.start_at).toLocaleDateString(undefined, { month:'short', day:'numeric' })}, 7:00 PM IST
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Featured Event Spotlight Card -->
          <div class="tp-card tp-card-glass" style="display:flex;flex-direction:column;gap:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;">
              <div>
                <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;">
                  <span class="mono-chip" style="color:var(--tp-primary);font-weight:700;">WEEK ${selectedEvent.week_number}</span>
                  <span class="telemetry-chip">${(selectedEvent.branch_id || 'CORE').toUpperCase()} GROUP</span>
                  <span class="telemetry-chip">Your Semester: ${userSemester.replace('sem_','')}</span>
                </div>
                <h2 class="headline-lg" style="margin:0 0 0.35rem 0;">${selectedEvent.title}</h2>
                <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);">
                  Questions are uniquely selected for your branch (<strong>${userBranch.toUpperCase()}</strong>) and current semester (<strong>Sem ${userSemester.replace('sem_','')}</strong>).
                </p>
              </div>

              <!-- State-Specific Launch Action -->
              <div style="text-align:right;">
                ${stateMeta.state === 'SCHEDULED' ? `
                  <div style="padding:0.75rem 1.25rem;background:rgba(245,158,11,0.1);border:1px solid #f59e0b;border-radius:var(--radius-sm);display:flex;flex-direction:column;align-items:center;gap:0.25rem;">
                    <span style="font-size:0.8rem;color:#f59e0b;font-weight:700;">🔒 QUIZ LOCKED</span>
                    <div id="countdown-timer-live" style="font-family:monospace;font-size:1.15rem;font-weight:700;color:#fff;">
                      Calculating...
                    </div>
                    <button class="tp-btn tp-btn-secondary tp-btn-xs" disabled style="opacity:0.6;cursor:not-allowed;margin-top:0.25rem;">
                      Locked Until Start Time
                    </button>
                  </div>
                ` : stateMeta.state === 'LIVE' ? `
                  <button id="btn-start-live-quiz" class="tp-btn tp-btn-primary" style="padding:0.85rem 2rem;font-size:1.05rem;background:var(--tp-success);border-color:var(--tp-success);">
                    ⚡ Start Official Quiz (${selectedEvent.total_questions || 15} Qs)
                  </button>
                ` : `
                  <div style="display:flex;gap:0.5rem;">
                    <button id="btn-view-ended-lb" class="tp-btn tp-btn-secondary">
                      🏆 View Final Leaderboard
                    </button>
                  </div>
                `}
              </div>
            </div>

            <!-- Event Specs Breakdown -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:0.75rem;border-top:1px solid var(--tp-border-dark);padding-top:1rem;">
              <div>
                <span class="tp-spec-label">Duration Allowance</span>
                <p style="font-size:0.9rem;color:#fff;margin-top:0.2rem;">⏱️ ${selectedEvent.duration_minutes || 30} Minutes</p>
              </div>
              <div>
                <span class="tp-spec-label">Scheduled Window</span>
                <p style="font-size:0.9rem;color:#fff;margin-top:0.2rem;">${new Date(selectedEvent.start_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })} – ${new Date(selectedEvent.end_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</p>
              </div>
              <div>
                <span class="tp-spec-label">Attempt Policy</span>
                <p style="font-size:0.9rem;color:var(--tp-accent);margin-top:0.2rem;">Strictly 1 Attempt per Candidate</p>
              </div>
              <div>
                <span class="tp-spec-label">Ranking Algorithm</span>
                <p style="font-size:0.9rem;color:var(--tp-success);margin-top:0.2rem;">Score → Accuracy → Submission Time</p>
              </div>
            </div>
          </div>

          <!-- Event Leaderboard & Semester Tabs -->
          <div class="tp-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.75rem;">
              <div>
                <h2 class="headline-md">Official Competition Leaderboard</h2>
                <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);">
                  Deterministic ranking verified against server-authoritative submission timestamps.
                </p>
              </div>

              <!-- Semester Filter -->
              <div style="display:flex;gap:0.5rem;align-items:center;">
                <span style="font-size:0.8rem;color:var(--tp-text-dark-muted);">Semester Filter:</span>
                <select id="leaderboard-semester-select" class="tp-input" style="width:auto;padding:0.35rem 0.75rem;font-size:0.85rem;">
                  <option value="all">Overall Branch Standings</option>
                  ${[1,2,3,4,5,6,7,8].map(s => `
                    <option value="${s}">Semester ${s}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div id="leaderboard-table-container">
              Loading verified standings...
            </div>
          </div>
        </div>
      `;

      bindEvents(stateMeta);
      await loadLeaderboardTable();
    }

    async function loadLeaderboardTable(semesterFilter = null) {
      const lbContainer = container.querySelector('#leaderboard-table-container');
      if (!lbContainer) return;

      const entries = await QuizLeagueEngine.getLeaderboard(selectedEvent.id, semesterFilter);

      if (entries.length === 0) {
        lbContainer.innerHTML = `
          <div style="padding:2rem;text-align:center;color:var(--tp-text-dark-muted);font-size:0.85rem;">
            No attempts recorded for this event yet. Verified rankings appear immediately upon submission.
          </div>
        `;
        return;
      }

      lbContainer.innerHTML = `
        <div style="overflow-x:auto;">
          <table class="tp-table" style="width:100%;font-size:0.85rem;border-collapse:collapse;">
            <thead>
              <tr style="border-bottom:1px solid var(--tp-border-dark);text-align:left;color:var(--tp-text-dark-muted);">
                <th style="padding:0.75rem 0.5rem;">Rank</th>
                <th style="padding:0.75rem 0.5rem;">Student / Public ID</th>
                <th style="padding:0.75rem 0.5rem;">Branch</th>
                <th style="padding:0.75rem 0.5rem;">Sem</th>
                <th style="padding:0.75rem 0.5rem;">Score</th>
                <th style="padding:0.75rem 0.5rem;">Accuracy</th>
                <th style="padding:0.75rem 0.5rem;">Time</th>
              </tr>
            </thead>
            <tbody>
              ${entries.map(e => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                  <td style="padding:0.75rem 0.5rem;font-weight:700;">
                    ${e.overall_rank === 1 ? '🥇 #1' : e.overall_rank === 2 ? '🥈 #2' : e.overall_rank === 3 ? '🥉 #3' : `#${e.overall_rank || e.rank}`}
                  </td>
                  <td style="padding:0.75rem 0.5rem;">
                    <strong>${e.student_name}</strong>
                    <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);font-family:monospace;">${e.student_techpath_id}</div>
                  </td>
                  <td style="padding:0.75rem 0.5rem;"><span class="telemetry-chip">${(e.branch || 'CORE').toUpperCase()}</span></td>
                  <td style="padding:0.75rem 0.5rem;">Sem ${e.semester}</td>
                  <td style="padding:0.75rem 0.5rem;font-weight:700;color:var(--tp-accent);">${e.score} / ${e.total_questions || 15}</td>
                  <td style="padding:0.75rem 0.5rem;">
                    <span class="telemetry-chip" style="color:var(--tp-success);border-color:var(--tp-success);">${e.accuracy}%</span>
                  </td>
                  <td style="padding:0.75rem 0.5rem;font-family:monospace;color:var(--tp-text-dark-muted);">
                    ${Math.floor((e.completion_time_seconds || 0) / 60)}m ${(e.completion_time_seconds || 0) % 60}s
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    function bindEvents(stateMeta) {
      // Event selector cards
      container.querySelectorAll('.event-selector-card').forEach(card => {
        card.addEventListener('click', () => {
          selectedEventId = card.dataset.id;
          loadShell();
        });
      });

      // Live countdown for locked events
      if (stateMeta.state === 'SCHEDULED') {
        const cdEl = container.querySelector('#countdown-timer-live');
        const updateCd = () => {
          const s = QuizLeagueEngine.evaluateState(selectedEvent);
          if (s.state === 'LIVE') {
            loadShell();
            return;
          }
          const totalSecs = Math.max(0, Math.floor(s.remainingMs / 1000));
          const h = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
          const m = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
          const sec = String(totalSecs % 60).padStart(2, '0');
          if (cdEl) cdEl.textContent = `Starts in ${h}:${m}:${sec}`;
        };
        updateCd();
        countdownInterval = setInterval(updateCd, 1000);
      }

      // Start live quiz
      const startBtn = container.querySelector('#btn-start-live-quiz');
      if (startBtn) {
        startBtn.addEventListener('click', async () => {
          try {
            startBtn.disabled = true;
            startBtn.textContent = 'Verifying Time & Eligibility...';
            const res = await QuizLeagueEngine.getEventQuestions(selectedEvent.id, user, userBranch, userSemester);

            if (res.isAlreadyAttempted) {
              Toast.error('You have already submitted an attempt for this scheduled competition.');
              return;
            }

            runnerQuestions = res.questions;
            currentQuestionIdx = 0;
            userAnswers = {};
            markedForReview = {};
            remainingTimeSeconds = (selectedEvent.duration_minutes || 30) * 60;
            currentTab = 'live_runner';
            loadShell();
          } catch (err) {
            Toast.error(err.message || 'Unable to launch quiz.');
            loadShell();
          }
        });
      }

      // Semester filter
      const semFilter = container.querySelector('#leaderboard-semester-select');
      if (semFilter) {
        semFilter.addEventListener('change', (e) => {
          loadLeaderboardTable(e.target.value);
        });
      }

      // Monthly league modal / view
      const monthBtn = container.querySelector('#btn-view-monthly-league');
      if (monthBtn) {
        monthBtn.addEventListener('click', () => {
          renderMonthlyStandingsModal();
        });
      }
    }

    // --- LIVE QUIZ RUNNER VIEW ---
    function renderLiveRunner() {
      if (timerInterval) clearInterval(timerInterval);

      timerInterval = setInterval(() => {
        remainingTimeSeconds--;
        const timerEl = container.querySelector('#quiz-runner-timer');
        if (timerEl) {
          const m = String(Math.floor(remainingTimeSeconds / 60)).padStart(2, '0');
          const s = String(remainingTimeSeconds % 60).padStart(2, '0');
          timerEl.textContent = `⏱️ ${m}:${s}`;
        }
        if (remainingTimeSeconds <= 0) {
          clearInterval(timerInterval);
          Toast.warning('Time expired! Submitting recorded answers automatically.');
          submitQuiz();
        }
      }, 1000);

      const q = runnerQuestions[currentQuestionIdx];
      const selected = userAnswers[q.id];
      const isMarked = !!markedForReview[q.id];

      const m = String(Math.floor(remainingTimeSeconds / 60)).padStart(2, '0');
      const s = String(remainingTimeSeconds % 60).padStart(2, '0');

      container.innerHTML = `
        <div class="tp-page" style="display:flex;flex-direction:column;gap:1.5rem;max-width:1100px;">
          <!-- Runner Header -->
          <div style="display:flex;justify-content:space-between;align-items:center;padding:1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-md);position:sticky;top:1rem;z-index:10;backdrop-filter:blur(8px);">
            <div>
              <span class="mono-chip" style="color:var(--tp-primary);font-weight:700;">
                Question ${currentQuestionIdx + 1} of ${runnerQuestions.length}
              </span>
              <span class="telemetry-chip" style="margin-left:0.5rem;">OFFICIAL LEAGUE DRILL</span>
            </div>
            <div style="display:flex;gap:1rem;align-items:center;">
              <div id="quiz-runner-timer" style="font-family:monospace;font-size:1.15rem;font-weight:700;color:var(--tp-accent);">
                ⏱️ ${m}:${s}
              </div>
              <button id="btn-submit-live-quiz" class="tp-btn tp-btn-primary tp-btn-sm" style="background:var(--tp-success);border-color:var(--tp-success);">
                ✓ Finalize & Submit
              </button>
            </div>
          </div>

          <!-- Question Body -->
          <div class="tp-card" style="display:flex;flex-direction:column;gap:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.85rem;color:var(--tp-text-dark-secondary);">
                ${q.subject || 'Engineering'} • <strong>${q.topic || 'Concept'}</strong>
              </span>
              <button id="btn-runner-mark-review" class="tp-btn ${isMarked ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-xs">
                ${isMarked ? '★ Marked for Review' : '☆ Mark for Review'}
              </button>
            </div>

            <h2 class="headline-md" style="line-height:1.5;color:#fff;">
              ${q.question}
            </h2>

            <!-- Options -->
            <div style="display:flex;flex-direction:column;gap:0.75rem;margin-top:0.5rem;">
              ${(q.options || []).map((opt, optIdx) => {
                const isChecked = selected !== undefined && Number(selected) === optIdx;
                return `
                  <label style="
                    display:flex;align-items:center;gap:1rem;padding:1rem 1.25rem;border-radius:var(--radius-sm);
                    background:${isChecked ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)'};
                    border:1px solid ${isChecked ? 'var(--tp-primary)' : 'var(--tp-border-dark)'};
                    cursor:pointer;
                  ">
                    <input type="radio" name="runner-opt-${q.id}" value="${optIdx}" ${isChecked ? 'checked' : ''} style="width:1.25rem;height:1.25rem;accent-color:var(--tp-primary);" />
                    <span style="font-weight:700;color:var(--tp-text-dark-muted);">${String.fromCharCode(65 + optIdx)}.</span>
                    <span style="color:#fff;font-size:0.95rem;">${opt}</span>
                  </label>
                `;
              }).join('')}
            </div>

            <!-- Controls -->
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--tp-border-dark);padding-top:1rem;margin-top:1rem;">
              <button id="btn-runner-prev" class="tp-btn tp-btn-secondary" ${currentQuestionIdx === 0 ? 'disabled' : ''}>
                ← Previous
              </button>
              <button id="btn-runner-next" class="tp-btn tp-btn-primary">
                ${currentQuestionIdx === runnerQuestions.length - 1 ? 'Go to Review / Submit →' : 'Next Question →'}
              </button>
            </div>
          </div>

          <!-- Palette -->
          <div class="tp-card" style="padding:1rem;">
            <div style="font-size:0.8rem;font-weight:700;color:var(--tp-text-dark-muted);margin-bottom:0.5rem;">
              QUESTION PALETTE
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              ${runnerQuestions.map((rq, i) => {
                const ans = userAnswers[rq.id] !== undefined;
                const mrk = !!markedForReview[rq.id];
                const active = i === currentQuestionIdx;
                let bg = 'rgba(255,255,255,0.04)';
                let color = 'var(--tp-text-dark-muted)';
                let border = 'var(--tp-border-dark)';
                if (active) border = '#fff';
                if (ans) { bg = 'rgba(16,185,129,0.2)'; color = 'var(--tp-success)'; border = 'var(--tp-success)'; }
                if (mrk) { bg = 'rgba(245,158,11,0.2)'; color = '#f59e0b'; border = '#f59e0b'; }

                return `
                  <button class="tp-btn tp-btn-xs runner-jump-btn" data-index="${i}" style="
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

      // Handlers
      container.querySelectorAll(`input[name="runner-opt-${q.id}"]`).forEach(radio => {
        radio.addEventListener('change', (e) => {
          userAnswers[q.id] = parseInt(e.target.value, 10);
          renderLiveRunner();
        });
      });

      container.querySelector('#btn-runner-mark-review')?.addEventListener('click', () => {
        markedForReview[q.id] = !markedForReview[q.id];
        renderLiveRunner();
      });

      container.querySelector('#btn-runner-prev')?.addEventListener('click', () => {
        if (currentQuestionIdx > 0) { currentQuestionIdx--; renderLiveRunner(); }
      });

      container.querySelector('#btn-runner-next')?.addEventListener('click', () => {
        if (currentQuestionIdx < runnerQuestions.length - 1) { currentQuestionIdx++; renderLiveRunner(); }
        else submitQuiz();
      });

      container.querySelectorAll('.runner-jump-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          currentQuestionIdx = parseInt(btn.dataset.index, 10);
          renderLiveRunner();
        });
      });

      container.querySelector('#btn-submit-live-quiz')?.addEventListener('click', submitQuiz);
    }

    async function submitQuiz() {
      if (confirm('Finalize and submit your official competition attempt? This event permits strictly ONE attempt.')) {
        if (timerInterval) clearInterval(timerInterval);
        const totalDuration = (selectedEvent.duration_minutes || 30) * 60;
        const timeSpent = totalDuration - remainingTimeSeconds;

        const profile = (await dbStore.getAll('profiles')).find(p => p.id === user.id) || {
          name: user.email.split('@')[0],
          branch_id: userBranch,
          semester_id: userSemester,
          techpath_id: `TP-${userBranch.toUpperCase()}-7K4M92`
        };

        try {
          resultDossier = await QuizLeagueEngine.submitQuizAttempt(
            selectedEvent.id,
            user,
            profile,
            userAnswers,
            timeSpent,
            runnerQuestions
          );
          currentTab = 'result';
          loadShell();
        } catch (err) {
          Toast.error(err.message || 'Submission failed.');
          currentTab = 'events';
          loadShell();
        }
      }
    }

    // --- RESULT DOSSIER VIEW ---
    function renderResultView() {
      const res = resultDossier;

      container.innerHTML = `
        <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1100px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom:0.5rem;color:var(--tp-success);border-color:var(--tp-success);">
                ✓ OFFICIAL ATTEMPT RECORDED
              </div>
              <h1 class="display-lg">Championship Result Dossier</h1>
              <p style="color:var(--tp-text-dark-secondary)">Performance assessment and official verified leaderboard positioning.</p>
            </div>
            <button id="btn-result-return-events" class="tp-btn tp-btn-primary">
              ← Return to Quiz League Hub
            </button>
          </div>

          <!-- Scorecard -->
          <div class="tp-metrics-grid">
            <div class="tp-metric-card tp-card">
              <div class="tp-metric-icon" style="color:var(--tp-primary)">🎯</div>
              <div class="tp-metric-value">${res.score} / ${res.total}</div>
              <div class="tp-metric-label">Final Score</div>
              <div class="tp-metric-sub">${res.accuracy}% Accuracy</div>
            </div>
            <div class="tp-metric-card tp-card">
              <div class="tp-metric-icon" style="color:var(--tp-accent)">🏆</div>
              <div class="tp-metric-value">#${res.rank}</div>
              <div class="tp-metric-label">Overall Branch Rank</div>
              <div class="tp-metric-sub">Across all semesters</div>
            </div>
            <div class="tp-metric-card tp-card">
              <div class="tp-metric-icon" style="color:var(--tp-success)">🥇</div>
              <div class="tp-metric-value">#${res.semesterRank}</div>
              <div class="tp-metric-label">Semester Rank</div>
              <div class="tp-metric-sub">In your exact semester</div>
            </div>
            <div class="tp-metric-card tp-card">
              <div class="tp-metric-icon" style="color:#38bdf8">⏱️</div>
              <div class="tp-metric-value">${Math.floor(res.attempt.completion_time_seconds / 60)}m ${res.attempt.completion_time_seconds % 60}s</div>
              <div class="tp-metric-label">Completion Time</div>
              <div class="tp-metric-sub">Tie-breaker rank priority</div>
            </div>
          </div>

          <!-- Question Review with Explanations -->
          <div class="tp-card">
            <h2 class="headline-md" style="margin-bottom:1rem;">Verified Question Key & Explanations</h2>
            <div style="display:flex;flex-direction:column;gap:1rem;">
              ${res.details.map(d => `
                <div style="padding:0.85rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">
                    <strong style="color:#fff;">Q${d.questionNumber}. ${d.question}</strong>
                    <span class="telemetry-chip" style="
                      color:${d.isCorrect ? 'var(--tp-success)' : 'var(--tp-error)'};
                      border-color:${d.isCorrect ? 'var(--tp-success)' : 'var(--tp-error)'};
                    ">
                      ${d.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                    </span>
                  </div>
                  <div style="font-size:0.85rem;color:var(--tp-text-dark-secondary);line-height:1.4;">
                    <strong>Explanation:</strong> ${d.explanation || 'Verified curriculum answer.'}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      container.querySelector('#btn-result-return-events')?.addEventListener('click', () => {
        currentTab = 'events';
        resultDossier = null;
        loadShell();
      });
    }

    // --- MONTHLY STANDINGS MODAL ---
    async function renderMonthlyStandingsModal() {
      const standings = await QuizLeagueEngine.getMonthlyLeagueStandings('September 2026');

      const modal = document.createElement('div');
      modal.className = 'tp-modal-overlay';
      modal.style.display = 'flex';
      modal.innerHTML = `
        <div class="tp-modal-content tp-card" style="max-width:750px;width:95%;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <div>
              <h2 class="headline-md">September 2026 Monthly Quiz League Standings</h2>
              <p style="font-size:0.8rem;color:var(--tp-text-dark-secondary);">Cumulative points awarded across all 4 weekly events.</p>
            </div>
            <button id="modal-close-btn" class="tp-btn tp-btn-xs tp-btn-secondary">✕</button>
          </div>

          <div style="overflow-x:auto;">
            <table class="tp-table" style="width:100%;font-size:0.85rem;border-collapse:collapse;">
              <thead>
                <tr style="border-bottom:1px solid var(--tp-border-dark);text-align:left;color:var(--tp-text-dark-muted);">
                  <th style="padding:0.5rem;">Rank</th>
                  <th style="padding:0.5rem;">Student</th>
                  <th style="padding:0.5rem;">Branch</th>
                  <th style="padding:0.5rem;">Sem</th>
                  <th style="padding:0.5rem;">Events</th>
                  <th style="padding:0.5rem;">Best</th>
                  <th style="padding:0.5rem;">Total Points</th>
                </tr>
              </thead>
              <tbody>
                ${standings.map(s => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                    <td style="padding:0.5rem;font-weight:700;">#${s.overall_rank}</td>
                    <td style="padding:0.5rem;">${s.student_name}</td>
                    <td style="padding:0.5rem;"><span class="telemetry-chip">${s.branch.toUpperCase()}</span></td>
                    <td style="padding:0.5rem;">Sem ${s.semester}</td>
                    <td style="padding:0.5rem;">${s.quizzes_participated}</td>
                    <td style="padding:0.5rem;">${s.best_score} pts</td>
                    <td style="padding:0.5rem;font-weight:700;color:var(--tp-accent);">${s.total_points} pts</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      modal.querySelector('#modal-close-btn')?.addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }

    await loadShell();
  }
}
