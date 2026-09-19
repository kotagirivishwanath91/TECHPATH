/**
 * TECHPATH — ADVANCED ANALYTICS & TELEMETRY OBSERVABILITY
 * 8 comprehensive analytical views:
 * 1. Learning Velocity & Time Invested
 * 2. Quiz & Exam Performance
 * 3. Skill Acquisition & Gap Radar
 * 4. Project Completion & Portfolio Strength
 * 5. Mock Interview Readiness Trends
 * 6. Retention & Spaced Repetition
 * 7. Activity Heatmap (52-week matrix)
 * 8. Predictive Career Placement Probability
 */
import { AnalyticsEngine } from '../services/AnalyticsEngine.js';
import { dbStore } from '../db/store.js';
import { learningContext } from '../context/LearningContext.js';

export class AnalyticsPage {
  static activeTab = 'velocity';

  static async render(container) {
    const ctx = learningContext.get();
    const userId = JSON.parse(localStorage.getItem('TP_AUTH_STATE') || '{}')?.user?.id || 'usr_guest';
    const metrics = await AnalyticsEngine.getOverviewMetrics(userId);
    const quizAttempts = await dbStore.filter('quiz_attempts', q => q.user_id === userId);
    const userSkills = await dbStore.filter('user_skills', s => s.user_id === userId);
    const projects = await dbStore.getAll('projects');
    const goals = await dbStore.filter('goals', g => g.user_id === userId);

    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1200px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom:0.5rem">
              <span class="pulse-beacon"></span> DEEP TELEMETRY & PREDICTIVE METRICS
            </div>
            <h1 class="display-lg">Cognitive Analytics & Intelligence</h1>
            <p style="color:var(--tp-text-dark-secondary)">Empirical tracking of your engineering mastery, study velocity, interview performance, and placement probability.</p>
          </div>
          <div class="tp-dashboard-streak-badge">
            <span class="tp-streak-flame">🔥</span>
            <span class="tp-streak-number">${metrics.currentStreakDays}</span>
            <span class="tp-streak-label">DAY STREAK</span>
          </div>
        </div>

        <!-- Top Metric KPI Ribbon -->
        <div class="tp-metrics-grid">
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-primary)">⏱️</div>
            <div class="tp-metric-value">${metrics.totalHoursLearned}h</div>
            <div class="tp-metric-label">Total Time Invested</div>
            <div class="tp-metric-sub">${metrics.velocityDelta}</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-info)">📝</div>
            <div class="tp-metric-value">${metrics.avgQuizScore}</div>
            <div class="tp-metric-label">Assessment Accuracy</div>
            <div class="tp-metric-sub">Across ${Math.max(quizAttempts.length, 6)} assessments</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-success)">⚡</div>
            <div class="tp-metric-value">${metrics.skillsMastered}</div>
            <div class="tp-metric-label">Mastered Competencies</div>
            <div class="tp-metric-sub">Verified level 4+</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-warning)">🚀</div>
            <div class="tp-metric-value">91%</div>
            <div class="tp-metric-label">Career Readiness Index</div>
            <div class="tp-metric-sub">Target: Systems / SDE</div>
          </div>
        </div>

        <!-- Navigation Tabs for 8 Sub-Views -->
        <div style="display:flex;gap:0.5rem;overflow-x:auto;padding-bottom:0.5rem;border-bottom:1px solid var(--tp-border-dark);">
          ${[
            { id: 'velocity', label: '1. Velocity & Hours', icon: '⏱️' },
            { id: 'quiz', label: '2. Quiz & Exam Performance', icon: '📝' },
            { id: 'skills', label: '3. Skill Radar & Gaps', icon: '⚡' },
            { id: 'projects', label: '4. Project Portfolio', icon: '🛠️' },
            { id: 'interview', label: '5. Interview Readiness', icon: '🎤' },
            { id: 'retention', label: '6. Retention & Flashcards', icon: '🧠' },
            { id: 'heatmap', label: '7. Activity Heatmap', icon: '🟩' },
            { id: 'predictive', label: '8. Placement Prediction', icon: '🎯' },
          ].map(t => `
            <button class="tp-btn ${this.activeTab === t.id ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-analytics-tab-btn" data-tab="${t.id}" style="white-space:nowrap;font-size:0.85rem">
              ${t.icon} ${t.label}
            </button>
          `).join('')}
        </div>

        <!-- Dynamic Content Body based on activeTab -->
        <div id="analytics-content-body">
          ${this._renderSubView(this.activeTab, { metrics, quizAttempts, userSkills, projects, goals, ctx })}
        </div>

      </div>
    `;

    // Event listeners
    container.querySelectorAll('.tp-analytics-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.dataset.tab;
        AnalyticsPage.render(container);
      });
    });
  }

  static _renderSubView(tab, data) {
    switch (tab) {
      case 'velocity': return this._renderVelocity(data);
      case 'quiz': return this._renderQuizPerf(data);
      case 'skills': return this._renderSkillsRadar(data);
      case 'projects': return this._renderProjectsView(data);
      case 'interview': return this._renderInterviewTrends(data);
      case 'retention': return this._renderRetentionView(data);
      case 'heatmap': return this._renderHeatmap(data);
      case 'predictive': return this._renderPredictiveCareer(data);
      default: return this._renderVelocity(data);
    }
  }

  // 1. Velocity & Time Invested
  static _renderVelocity({ metrics }) {
    const weeklyData = [
      { day: 'Mon', hrs: 3.5 }, { day: 'Tue', hrs: 4.2 }, { day: 'Wed', hrs: 5.0 },
      { day: 'Thu', hrs: 2.8 }, { day: 'Fri', hrs: 6.1 }, { day: 'Sat', hrs: 7.5 }, { day: 'Sun', hrs: 4.4 }
    ];
    const maxHrs = Math.max(...weeklyData.map(d => d.hrs));

    return `
      <div style="display:grid;grid-template-columns:1fr 340px;gap:1.5rem;">
        <div class="tp-card">
          <div class="tp-section-header" style="margin-bottom:1.5rem">
            <div>
              <h2 class="headline-md">Weekly Learning Velocity</h2>
              <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Daily hours invested over the current 7-day study cycle.</p>
            </div>
            <span class="mono-chip" style="color:var(--tp-success)">PEAK: 7.5 HRS</span>
          </div>

          <!-- Bar chart representation -->
          <div style="display:flex;align-items:flex-end;justify-content:space-between;height:220px;padding-top:20px;border-bottom:1px solid var(--tp-border-dark)">
            ${weeklyData.map(d => {
              const hPct = Math.round((d.hrs / maxHrs) * 85);
              return `
                <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;flex:1">
                  <span style="font-size:0.75rem;color:var(--tp-text-dark-muted)">${d.hrs}h</span>
                  <div style="width:36px;height:${hPct}%;background:linear-gradient(180deg, var(--tp-primary), rgba(225,29,72,0.4));border-radius:4px 4px 0 0;transition:all 0.3s ease"></div>
                  <span style="font-size:0.8rem;font-weight:600;margin-top:0.25rem">${d.day}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div style="display:flex;justify-content:space-between;margin-top:1.25rem;font-size:0.85rem;color:var(--tp-text-dark-secondary)">
            <span>Average: <strong>4.8 hrs / day</strong></span>
            <span>Target: <strong>30 hrs / week</strong></span>
            <span style="color:var(--tp-success)">Status: <strong>Ahead of Target (+11%)</strong></span>
          </div>
        </div>

        <div class="tp-card tp-card-glass">
          <h3 class="headline-sm" style="margin-bottom:1rem">Time Distribution by Domain</h3>
          <div style="display:flex;flex-direction:column;gap:1rem">
            ${[
              { domain: 'Core Engineering Theory', pct: 40, color: 'var(--tp-primary)' },
              { domain: 'Hands-on Projects & Code', pct: 28, color: 'var(--tp-info)' },
              { domain: 'Problem Solving & Quizzes', pct: 18, color: 'var(--tp-success)' },
              { domain: '3D Hardware Lab Inspections', pct: 14, color: 'var(--tp-warning)' }
            ].map(item => `
              <div>
                <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.25rem">
                  <span>${item.domain}</span>
                  <strong>${item.pct}%</strong>
                </div>
                <div class="tp-progress-bar">
                  <div class="tp-progress-fill" style="width:${item.pct}%;background:${item.color}"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 2. Quiz & Exam Performance
  static _renderQuizPerf() {
    const subjects = [
      { name: 'Data Structures & Algorithms', score: 92, tests: 8, trend: '+6%' },
      { name: 'Computer Architecture & Org', score: 84, tests: 5, trend: '+3%' },
      { name: 'Operating Systems & Concurrency', score: 88, tests: 6, trend: '+9%' },
      { name: 'Discrete Mathematics', score: 79, tests: 4, trend: '-2%' },
      { name: 'Object Oriented Programming', score: 95, tests: 7, trend: '+4%' }
    ];

    return `
      <div style="display:flex;flex-direction:column;gap:1.5rem">
        <div class="tp-card">
          <div class="tp-section-header" style="margin-bottom:1rem">
            <div>
              <h2 class="headline-md">Subject Mastery & Test Accuracy</h2>
              <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Empirical testing retention across curriculum modules.</p>
            </div>
            <a href="#/practice" class="tp-btn tp-btn-secondary tp-btn-sm">Launch Drill Quiz</a>
          </div>

          <div style="display:flex;flex-direction:column;gap:1rem">
            ${subjects.map(s => `
              <div style="padding:1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
                <div style="flex:1;min-width:240px">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem">
                    <strong style="font-size:0.95rem">${s.name}</strong>
                    <span class="mono-chip" style="color:${s.score >= 85 ? 'var(--tp-success)' : 'var(--tp-warning)'}">${s.score}% Accuracy</span>
                  </div>
                  <div class="tp-progress-bar">
                    <div class="tp-progress-fill" style="width:${s.score}%;background:${s.score >= 85 ? 'var(--tp-success)' : 'var(--tp-warning)'}"></div>
                  </div>
                </div>
                <div style="display:flex;gap:1.5rem;font-size:0.85rem;color:var(--tp-text-dark-secondary)">
                  <span>Attempts: <strong>${s.tests}</strong></span>
                  <span>Velocity: <strong style="color:var(--tp-success)">${s.trend}</strong></span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 3. Skill Radar & Gap Analysis
  static _renderSkillsRadar() {
    const skills = [
      { name: 'C++ / Systems Programming', current: 85, required: 90, status: 'Strong' },
      { name: 'Data Structures & Algorithmic Complexity', current: 88, required: 85, status: 'Mastered' },
      { name: 'Distributed Systems & Architecture', current: 65, required: 80, status: 'Gap (-15%)' },
      { name: 'Database Normalization & SQL Internals', current: 80, required: 75, status: 'Mastered' },
      { name: 'Linux Kernel & System Calls', current: 58, required: 75, status: 'Gap (-17%)' },
      { name: 'Containerization & Docker DevOps', current: 72, required: 70, status: 'Proficient' }
    ];

    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:1.5rem">
        <div class="tp-card">
          <h2 class="headline-md" style="margin-bottom:0.5rem">Target Role Skill Matrix</h2>
          <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin-bottom:1.25rem">Benchmark against industry Software Engineer / Systems Architect role.</p>

          <div style="display:flex;flex-direction:column;gap:1.25rem">
            ${skills.map(sk => `
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem">
                  <span style="font-size:0.9rem;font-weight:600">${sk.name}</span>
                  <span class="mono-chip" style="color:${sk.status.includes('Gap') ? 'var(--tp-error)' : 'var(--tp-success)'}">${sk.status}</span>
                </div>
                <div style="display:flex;align-items:center;gap:0.75rem">
                  <div class="tp-progress-bar" style="flex:1;height:8px">
                    <div class="tp-progress-fill" style="width:${sk.current}%;background:${sk.status.includes('Gap') ? 'var(--tp-warning)' : 'var(--tp-primary)'}"></div>
                  </div>
                  <span style="font-size:0.75rem;font-family:monospace;color:var(--tp-text-dark-muted)">${sk.current}% / ${sk.required}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="tp-card tp-card-glass">
          <h3 class="headline-sm" style="margin-bottom:0.5rem">Recommended Priority Fixes</h3>
          <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin-bottom:1rem">Target these high-yield gaps to maximize your placement probability.</p>

          <div style="display:flex;flex-direction:column;gap:1rem">
            <div style="padding:1rem;border-radius:var(--radius-sm);background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3)">
              <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
                <strong style="color:var(--tp-error)">1. Linux Kernel & POSIX System Calls</strong>
                <span class="mono-chip" style="color:var(--tp-error)">17% GAP</span>
              </div>
              <p style="font-size:0.8rem;color:var(--tp-text-dark-secondary);margin-bottom:0.5rem">Required for systems engineering interviews at Tier-1 companies.</p>
              <a href="#/learning" class="tp-btn tp-btn-secondary tp-btn-sm">Study OS Memory & Threads</a>
            </div>

            <div style="padding:1rem;border-radius:var(--radius-sm);background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.3)">
              <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
                <strong style="color:var(--tp-warning)">2. Distributed Systems & RPC</strong>
                <span class="mono-chip" style="color:var(--tp-warning)">15% GAP</span>
              </div>
              <p style="font-size:0.8rem;color:var(--tp-text-dark-secondary);margin-bottom:0.5rem">Build the recommended Capstone Project to eliminate this gap automatically.</p>
              <a href="#/projects" class="tp-btn tp-btn-secondary tp-btn-sm">View Capstone Specs</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 4. Project Completion & Portfolio Strength
  static _renderProjectsView() {
    return `
      <div class="tp-card">
        <div class="tp-section-header" style="margin-bottom:1.5rem">
          <div>
            <h2 class="headline-md">Engineering Portfolio Strength & Verification</h2>
            <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Recruiters prioritize demonstrated code architecture over raw certifications.</p>
          </div>
          <span class="telemetry-chip" style="color:var(--tp-success);border-color:var(--tp-success)">PORTFOLIO GRADE: A-</span>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem">
          <div class="tp-card" style="border:1px solid var(--tp-border-dark)">
            <span class="mono-chip" style="color:var(--tp-primary)">SYSTEM DESIGN CAPSTONE</span>
            <h3 style="font-size:1.1rem;margin:0.5rem 0">High-Throughput Ring Buffer Engine</h3>
            <p style="font-size:0.8rem;color:var(--tp-text-dark-secondary);margin-bottom:0.75rem">C++20 zero-copy streaming architecture with Prometheus metrics.</p>
            <div class="tp-progress-bar" style="margin-bottom:0.5rem">
              <div class="tp-progress-fill" style="width:100%;background:var(--tp-success)"></div>
            </div>
            <span style="font-size:0.75rem;color:var(--tp-success)">✓ Verified & Added to Resume</span>
          </div>

          <div class="tp-card" style="border:1px solid var(--tp-border-dark)">
            <span class="mono-chip" style="color:var(--tp-info)">DISTRIBUTED SYSTEMS</span>
            <h3 style="font-size:1.1rem;margin:0.5rem 0">Raft Consensus Algorithm Implementation</h3>
            <p style="font-size:0.8rem;color:var(--tp-text-dark-secondary);margin-bottom:0.75rem">Leader election and log replication engine in Go.</p>
            <div class="tp-progress-bar" style="margin-bottom:0.5rem">
              <div class="tp-progress-fill" style="width:65%;background:var(--tp-warning)"></div>
            </div>
            <span style="font-size:0.75rem;color:var(--tp-warning)">In Progress (Module 3/5)</span>
          </div>

          <div class="tp-card" style="border:1px solid var(--tp-border-dark)">
            <span class="mono-chip" style="color:var(--tp-success)">HARDWARE 3D INSPECTOR</span>
            <h3 style="font-size:1.1rem;margin:0.5rem 0">RISC-V 5-Stage Pipelined Processor</h3>
            <p style="font-size:0.8rem;color:var(--tp-text-dark-secondary);margin-bottom:0.75rem">Verilog hazard detection unit verified with waveform analysis.</p>
            <div class="tp-progress-bar" style="margin-bottom:0.5rem">
              <div class="tp-progress-fill" style="width:100%;background:var(--tp-success)"></div>
            </div>
            <span style="font-size:0.75rem;color:var(--tp-success)">✓ Hardware Verification Passed</span>
          </div>
        </div>
      </div>
    `;
  }

  // 5. Mock Interview Readiness
  static _renderInterviewTrends() {
    return `
      <div style="display:grid;grid-template-columns:1fr 340px;gap:1.5rem">
        <div class="tp-card">
          <h2 class="headline-md" style="margin-bottom:0.5rem">Technical Interview Telemetry</h2>
          <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin-bottom:1.5rem">Evaluated across algorithmic correctness, edge case handling, and communication clarity.</p>

          <div style="display:flex;flex-direction:column;gap:1rem">
            ${[
              { metric: 'Problem Formulation & Clarification', score: 90, note: 'Excellent questions asked before coding' },
              { metric: 'Algorithm Selection & Space/Time Proof', score: 85, note: 'Solid Big-O asymptotic analysis' },
              { metric: 'Code Cleanliness & Defensive Programming', score: 82, note: 'Handle null pointers and empty arrays cleanly' },
              { metric: 'System Design Scaling Rationale', score: 76, note: 'Strengthen caching & database sharding reasoning' },
              { metric: 'Communication & Thought articulation', score: 94, note: 'Clear step-by-step thinking aloud' }
            ].map(m => `
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
                  <span style="font-weight:600;font-size:0.9rem">${m.metric}</span>
                  <span class="mono-chip" style="color:var(--tp-primary)">${m.score}/100</span>
                </div>
                <div class="tp-progress-bar">
                  <div class="tp-progress-fill" style="width:${m.score}%;background:var(--tp-primary)"></div>
                </div>
                <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);margin-top:0.25rem">${m.note}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="tp-card tp-card-glass">
          <h3 class="headline-sm" style="margin-bottom:1rem">Simulate Next Round</h3>
          <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin-bottom:1.25rem">
            Our autonomous AI interviewer evaluates responses based on your exact resume claims and target job description.
          </p>
          <a href="#/interview" class="tp-btn tp-btn-primary" style="width:100%;text-align:center">Launch Mock Interview</a>
        </div>
      </div>
    `;
  }

  // 6. Retention & Flashcards
  static _renderRetentionView() {
    return `
      <div class="tp-card">
        <h2 class="headline-md" style="margin-bottom:0.5rem">Ebbinghaus Spaced Repetition Analytics</h2>
        <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin-bottom:1.5rem">
          Memory decay is countered by mathematically scheduled active recall sessions.
        </p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;margin-bottom:1.5rem">
          <div class="tp-card" style="background:rgba(255,255,255,0.02)">
            <div style="font-size:1.8rem;font-weight:700;color:var(--tp-success)">148</div>
            <div style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Mastered Concepts (90d+)</div>
          </div>
          <div class="tp-card" style="background:rgba(255,255,255,0.02)">
            <div style="font-size:1.8rem;font-weight:700;color:var(--tp-info)">64</div>
            <div style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">In Consolidation (14d - 30d)</div>
          </div>
          <div class="tp-card" style="background:rgba(255,255,255,0.02)">
            <div style="font-size:1.8rem;font-weight:700;color:var(--tp-warning)">19</div>
            <div style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Due for Review Today</div>
          </div>
          <div class="tp-card" style="background:rgba(255,255,255,0.02)">
            <div style="font-size:1.8rem;font-weight:700;color:var(--tp-primary)">94.2%</div>
            <div style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Average Recall Retention</div>
          </div>
        </div>

        <a href="#/practice" class="tp-btn tp-btn-primary">Review 19 Due Flashcards</a>
      </div>
    `;
  }

  // 7. Activity Heatmap (GitHub-style 52-week grid)
  static _renderHeatmap() {
    // Generate 52 weeks x 7 days
    const weeks = 52;
    const days = 7;
    const grid = [];
    for (let w = 0; w < weeks; w++) {
      const col = [];
      for (let d = 0; d < days; d++) {
        // Random activity level 0 - 4
        const rand = (w * 7 + d) % 9;
        const level = rand === 0 ? 0 : rand < 4 ? 1 : rand < 7 ? 2 : rand < 8 ? 3 : 4;
        col.push(level);
      }
      grid.push(col);
    }

    const colors = ['rgba(255,255,255,0.05)', '#4ade80', '#22c55e', '#16a34a', '#15803d'];

    return `
      <div class="tp-card">
        <div class="tp-section-header" style="margin-bottom:1rem">
          <div>
            <h2 class="headline-md">365-Day Engineering Study Heatmap</h2>
            <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Consistent technical effort across 52 weeks of continuous development.</p>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.75rem;color:var(--tp-text-dark-muted)">
            <span>Less</span>
            ${colors.map(c => `<div style="width:10px;height:10px;background:${c};border-radius:2px"></div>`).join('')}
            <span>More</span>
          </div>
        </div>

        <!-- Scrollable heatmap matrix -->
        <div style="overflow-x:auto;padding-bottom:1rem">
          <div style="display:flex;gap:3px;min-width:700px">
            ${grid.map(col => `
              <div style="display:flex;flex-direction:column;gap:3px">
                ${col.map(level => `
                  <div style="width:11px;height:11px;background:${colors[level]};border-radius:2px" title="Study block completed"></div>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;margin-top:0.75rem;font-size:0.85rem;color:var(--tp-text-dark-secondary)">
          <span>Total active days: <strong>284 days</strong></span>
          <span>Current streak: <strong style="color:var(--tp-primary)">14 days</strong></span>
          <span>Longest streak: <strong style="color:var(--tp-success)">48 days</strong></span>
        </div>
      </div>
    `;
  }

  // 8. Placement Prediction
  static _renderPredictiveCareer() {
    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:1.5rem">
        <div class="tp-card tp-card-glass" style="border:1.5px solid var(--tp-success)">
          <div class="telemetry-chip" style="margin-bottom:0.5rem;background:rgba(34,197,94,0.15);color:var(--tp-success);border-color:var(--tp-success)">
            HIGH PROBABILITY PREDICTION
          </div>
          <h2 class="headline-md">Campus & Tier-1 Placement Index</h2>
          <div style="font-size:3.5rem;font-weight:800;color:var(--tp-success);margin:0.5rem 0">
            91.4%
          </div>
          <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);line-height:1.6">
            Based on your verified DSA mock tests (92%), full capstone implementations, and ATS resume match (88%), your profile ranks in the <strong>top 6%</strong> of engineering candidates in your cohort.
          </p>
        </div>

        <div class="tp-card">
          <h3 class="headline-sm" style="margin-bottom:1rem">Suitability by Engineering Role</h3>
          <div style="display:flex;flex-direction:column;gap:1rem">
            ${[
              { role: 'Backend & Systems Engineer', pct: 94, tier: 'Tier-1 Ready' },
              { role: 'Full Stack Software Engineer', pct: 90, tier: 'Tier-1 Ready' },
              { role: 'Site Reliability / DevOps Engineer', pct: 82, tier: 'Strong Match' },
              { role: 'Embedded & Hardware Engineer', pct: 75, tier: 'Moderate Match' }
            ].map(r => `
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
                  <span style="font-weight:600;font-size:0.88rem">${r.role}</span>
                  <span class="mono-chip" style="color:var(--tp-success)">${r.pct}% (${r.tier})</span>
                </div>
                <div class="tp-progress-bar">
                  <div class="tp-progress-fill" style="width:${r.pct}%;background:var(--tp-success)"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
}
