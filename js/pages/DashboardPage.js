/**
 * TECHPATH — DASHBOARD PAGE
 * Real data: streak, metrics, quick actions, progress, goals, recent activity, notifications
 */
import { learningContext }  from '../context/LearningContext.js';
import { authContext }      from '../context/AuthContext.js';
import { dbStore }          from '../db/store.js';
import { ProgressEngine }   from '../services/ProgressEngine.js';
import { GoalEngine }       from '../services/GoalEngine.js';
import { NotificationEngine } from '../services/NotificationEngine.js';
import { APP_CONFIG }       from '../config.js';

export class DashboardPage {
  static async render(container) {
    const ctx  = learningContext.get();
    const auth = authContext.get();
    const user = auth.user || { name: 'Student', profile: {} };

    // Fetch real data in parallel
    const [metrics, goals, notifications, subjects, recentProgress] = await Promise.all([
      ProgressEngine.getOverviewMetrics(),
      GoalEngine.getActive(),
      NotificationEngine.getUnread(),
      dbStore.filter('subjects', s => s.branch_id === ctx.branch_id && s.semester_id === ctx.semester_id),
      dbStore.filter('learning_progress', r => r.user_id === (user.id || 'usr_guest')),
    ]);

    await GoalEngine.syncFromProgress();
    const branch = APP_CONFIG.branches.find(b => b.id === ctx.branch_id);
    const sem = APP_CONFIG.semesters.find(s => s.id === ctx.semester_id);
    const topGoals = goals.slice(0, 3);
    const recentNotifs = notifications.slice(0, 5);

    container.innerHTML = `
      <div class="tp-page">

        <!-- Welcome Header -->
        <div class="tp-dashboard-welcome">
          <div>
            <div class="telemetry-chip" style="margin-bottom:0.5rem">
              <span class="pulse-beacon"></span>
              ${branch?.code || 'Engineering'} — ${sem?.name || 'Semester'}
            </div>
            <h1 class="display-lg">Good ${this._timeOfDay()}, ${user.name?.split(' ')[0] || 'Student'} 👋</h1>
            <p style="color:var(--tp-text-dark-secondary);margin-top:0.25rem">
              ${this._motivationalQuote()}
            </p>
          </div>
          <div class="tp-dashboard-streak-badge" title="${metrics.currentStreakDays}-day streak">
            <span class="tp-streak-flame">🔥</span>
            <span class="tp-streak-number">${metrics.currentStreakDays}</span>
            <span class="tp-streak-label">DAY STREAK</span>
          </div>
        </div>

        <!-- Key Metrics Row -->
        <div class="tp-metrics-grid">
          ${[
            { label: 'Hours Learned', value: metrics.totalHoursLearned, sub: metrics.velocityDelta, icon: '⏱️', color: 'var(--tp-primary)' },
            { label: 'Avg Quiz Score', value: metrics.avgQuizScore, sub: 'All attempts', icon: '📝', color: 'var(--tp-info)' },
            { label: 'Skills Mastered', value: metrics.skillsMastered, sub: 'Level 4+', icon: '⚡', color: 'var(--tp-success)' },
            { label: 'Items Completed', value: metrics.totalCompleted, sub: 'Topics, videos, quizzes', icon: '✅', color: 'var(--tp-warning)' },
          ].map(m => `
            <div class="tp-metric-card tp-card">
              <div class="tp-metric-icon" style="color:${m.color}">${m.icon}</div>
              <div class="tp-metric-value">${m.value}</div>
              <div class="tp-metric-label">${m.label}</div>
              <div class="tp-metric-sub">${m.sub}</div>
            </div>
          `).join('')}
        </div>

        <!-- Two-column: Subjects + Sidebar -->
        <div class="tp-dashboard-grid">

          <!-- Left: Current Subjects -->
          <div>
            <div class="tp-section-header">
              <h2 class="headline-md">📖 Current Subjects</h2>
              <a href="#/learning" class="tp-link">View all →</a>
            </div>
            ${subjects.length === 0 ? `
              <div class="tp-card tp-empty-state">
                <p>Content for ${branch?.name || ctx.branch_id} ${sem?.name || ctx.semester_id} is currently being prepared.</p>
                <a href="#/learning" class="tp-btn tp-btn-secondary" style="margin-top:1rem">Browse All Learning</a>
              </div>
            ` : subjects.map(s => `
              <a href="#/learning?subject=${s.id}" class="tp-card tp-subject-card" style="display:block;text-decoration:none;margin-bottom:0.75rem">
                <div class="tp-subject-card-inner">
                  <div class="tp-subject-meta">
                    <span class="mono-chip">${s.code}</span>
                    <span style="font-size:0.75rem;color:var(--tp-text-dark-muted)">${s.credits} credits</span>
                  </div>
                  <h3 style="font-size:1rem;font-weight:600;margin:0.35rem 0">${s.title}</h3>
                  <p style="font-size:0.82rem;color:var(--tp-text-dark-secondary);margin:0;line-height:1.5">${s.description}</p>
                  <div class="tp-subject-actions">
                    <span class="tp-tag">📖 Learn</span>
                    <span class="tp-tag">🧪 Quiz</span>
                    <span class="tp-tag">🧊 3D</span>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>

          <!-- Right: Sidebar -->
          <div class="tp-dashboard-sidebar">

            <!-- Quick Actions -->
            <div class="tp-card" style="margin-bottom:1.5rem">
              <h2 class="headline-sm" style="margin-bottom:1rem">⚡ Quick Actions</h2>
              <div class="tp-quick-actions">
                ${[
                  { icon:'📖', label:'Continue Learning', href:'#/learning' },
                  { icon:'🧪', label:'Practice Quiz', href:'#/practice' },
                  { icon:'🎤', label:'Mock Interview', href:'#/interview' },
                  { icon:'🧊', label:'3D Lab', href:'#/3d' },
                  { icon:'📄', label:'PDF Analyzer', href:'#/pdf' },
                  { icon:'⚡', label:'Skill Gap', href:'#/skills' },
                ].map(a => `
                  <a href="${a.href}" class="tp-quick-action-btn">
                    <span>${a.icon}</span>
                    <span>${a.label}</span>
                  </a>
                `).join('')}
              </div>
            </div>

            <!-- Active Goals -->
            <div class="tp-card" style="margin-bottom:1.5rem">
              <div class="tp-section-header" style="margin-bottom:0.75rem">
                <h2 class="headline-sm">🎯 Active Goals</h2>
                <a href="#/goals" class="tp-link">Manage →</a>
              </div>
              ${topGoals.length === 0 ? `
                <p style="font-size:0.85rem;color:var(--tp-text-dark-muted)">No active goals yet.</p>
                <a href="#/goals" class="tp-btn tp-btn-secondary tp-btn-sm" style="margin-top:0.75rem">Set a Goal</a>
              ` : topGoals.map(g => {
                const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
                return `
                  <div style="margin-bottom:0.75rem">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem">
                      <span style="font-size:0.88rem;font-weight:500">${g.title}</span>
                      <span class="mono-chip" style="color:var(--tp-primary)">${g.currentValue}/${g.targetValue} ${g.unit}</span>
                    </div>
                    <div class="tp-progress-bar">
                      <div class="tp-progress-fill" style="width:${pct}%;background:var(--tp-primary)"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Notifications -->
            <div class="tp-card">
              <div class="tp-section-header" style="margin-bottom:0.75rem">
                <h2 class="headline-sm">🔔 Notifications</h2>
                <a href="#/notifications" class="tp-link">All →</a>
              </div>
              ${recentNotifs.length === 0 ? `
                <p style="font-size:0.85rem;color:var(--tp-text-dark-muted)">No new notifications.</p>
              ` : recentNotifs.map(n => `
                <div class="tp-notif-item ${n.read ? '' : 'tp-notif-unread'}">
                  <div class="tp-notif-dot"></div>
                  <div>
                    <p style="font-size:0.88rem;font-weight:600;margin:0">${n.title}</p>
                    <p style="font-size:0.8rem;color:var(--tp-text-dark-secondary);margin:0">${n.message}</p>
                  </div>
                </div>
              `).join('')}
            </div>

          </div>
        </div>

        <!-- Learning Path Preview -->
        <div class="tp-card" style="margin-top:1.5rem">
          <div class="tp-section-header" style="margin-bottom:1rem">
            <h2 class="headline-md">🗺️ Learning Roadmaps</h2>
            <a href="#/roadmaps" class="tp-link">Explore all →</a>
          </div>
          <div class="tp-roadmap-preview-grid">
            ${[
              { icon:'📚', title:'Semester Roadmap', desc:`Complete ${branch?.code} ${sem?.name}`, href:'#/roadmaps?type=semester', color:'var(--tp-primary)' },
              { icon:'⚡', title:'Skill Roadmap', desc:'Close skill gaps for your target role', href:'#/roadmaps?type=skill', color:'var(--tp-info)' },
              { icon:'🎯', title:'Exam Roadmap', desc:'GATE / Campus Placement prep', href:'#/roadmaps?type=exam', color:'var(--tp-success)' },
              { icon:'🚀', title:'Career Roadmap', desc:'Path from student to professional', href:'#/roadmaps?type=career', color:'var(--tp-warning)' },
            ].map(r => `
              <a href="${r.href}" class="tp-roadmap-preview-card" style="border-left:3px solid ${r.color}">
                <span style="font-size:1.5rem">${r.icon}</span>
                <div>
                  <div style="font-weight:600;font-size:0.9rem">${r.title}</div>
                  <div style="font-size:0.8rem;color:var(--tp-text-dark-secondary)">${r.desc}</div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>

      </div>
    `;
  }

  static _timeOfDay() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  }

  static _motivationalQuote() {
    const quotes = [
      'Every expert was once a beginner. Keep going.',
      'Consistency beats talent when talent doesn\'t work consistently.',
      'Engineering is built problem by problem. Solve one today.',
      'The best engineers are relentless learners.',
      'Push your limits. Your future self will thank you.',
    ];
    return quotes[new Date().getDay() % quotes.length];
  }
}
