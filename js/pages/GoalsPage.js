/**
 * TECHPATH — GOALS & MILESTONES PAGE
 * Create, track, update, and celebrate engineering study & career goals
 */
import { GoalEngine } from '../services/GoalEngine.js';
import { Toast } from '../components/Toast.js';

export class GoalsPage {
  static async render(container) {
    await GoalEngine.syncFromProgress();
    const allGoals = await GoalEngine.getAll();
    const active = allGoals.filter(g => g.status === 'active');
    const completed = allGoals.filter(g => g.status === 'completed');

    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1100px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom:0.5rem">
              <span class="pulse-beacon"></span> TARGET VELOCITY ENGINE
            </div>
            <h1 class="display-lg">Engineering Goals & Milestones</h1>
            <p style="color:var(--tp-text-dark-secondary)">Set concrete learning benchmarks, track real progress, and systematically conquer your engineering targets.</p>
          </div>
          <button id="tp-new-goal-btn" class="tp-btn tp-btn-primary" style="display:flex;align-items:center;gap:0.5rem">
            <span>+</span> Set New Goal
          </button>
        </div>

        <!-- Goal Metrics -->
        <div class="tp-metrics-grid">
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-primary)">🎯</div>
            <div class="tp-metric-value">${active.length}</div>
            <div class="tp-metric-label">Active Targets</div>
            <div class="tp-metric-sub">In progress</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-success)">🏆</div>
            <div class="tp-metric-value">${completed.length}</div>
            <div class="tp-metric-label">Completed</div>
            <div class="tp-metric-sub">Milestones reached</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-warning)">⚡</div>
            <div class="tp-metric-value">${allGoals.length > 0 ? Math.round((completed.length / allGoals.length) * 100) : 0}%</div>
            <div class="tp-metric-label">Success Rate</div>
            <div class="tp-metric-sub">Across all goals</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-info)">🔥</div>
            <div class="tp-metric-value">${Math.max(active.length, 1)}</div>
            <div class="tp-metric-label">Weekly Focus</div>
            <div class="tp-metric-sub">High priority tasks</div>
          </div>
        </div>

        <!-- Goal Creation Modal / Drawer (Hidden by default) -->
        <div id="tp-goal-form-card" class="tp-card" style="display:none;border-color:var(--tp-primary);padding:1.5rem;">
          <h2 class="headline-md" style="margin-bottom:1rem">Create Engineering Goal</h2>
          <form id="tp-goal-form" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:1rem;">
            <div>
              <label class="tp-label">Goal Title *</label>
              <input type="text" id="goal-title-input" class="tp-input" placeholder="e.g. Master 5 Topics in Data Structures" required />
            </div>
            <div>
              <label class="tp-label">Goal Type</label>
              <select id="goal-type-select" class="tp-input">
                <option value="topics">Topics Mastered</option>
                <option value="videos">Lecture Videos Completed</option>
                <option value="quiz_score">Quiz Score Benchmark (%)</option>
                <option value="study_hours">Study Hours Invested</option>
                <option value="project">Capstone Project Completion</option>
              </select>
            </div>
            <div>
              <label class="tp-label">Target Quantity *</label>
              <input type="number" id="goal-target-input" class="tp-input" min="1" value="5" required />
            </div>
            <div>
              <label class="tp-label">Target Deadline</label>
              <input type="date" id="goal-deadline-input" class="tp-input" value="${new Date(Date.now() + 7*86400000).toISOString().split('T')[0]}" />
            </div>
            <div style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:0.75rem;margin-top:0.5rem">
              <button type="button" id="cancel-goal-btn" class="tp-btn tp-btn-secondary">Cancel</button>
              <button type="submit" class="tp-btn tp-btn-primary">Save Target</button>
            </div>
          </form>
        </div>

        <!-- Quick Recommended Goals -->
        <div class="tp-card tp-card-glass">
          <div class="tp-section-header" style="margin-bottom:0.75rem">
            <h2 class="headline-sm">⚡ Recommended High-Impact Goals</h2>
            <span style="font-size:0.8rem;color:var(--tp-text-dark-muted)">Click to quickly adopt</span>
          </div>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
            ${[
              { title: 'Complete 5 Core Theory Topics', type: 'topics', target: 5, unit: 'topics' },
              { title: 'Score 85%+ on Practice Quiz', type: 'quiz_score', target: 85, unit: '%' },
              { title: 'Watch 4 Technical Video Streams', type: 'videos', target: 4, unit: 'videos' },
              { title: 'Invest 10 Study Hours This Week', type: 'study_hours', target: 10, unit: 'hrs' },
              { title: 'Build 1 System Architecture Project', type: 'project', target: 1, unit: 'project' }
            ].map(p => `
              <button class="tp-btn tp-btn-secondary tp-btn-sm tp-preset-goal-btn" 
                data-title="${p.title}" data-type="${p.type}" data-target="${p.target}" data-unit="${p.unit}">
                + ${p.title}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Active Goals Section -->
        <div>
          <div class="tp-section-header" style="margin-bottom:1rem">
            <h2 class="headline-md">🎯 Active Goals (${active.length})</h2>
          </div>

          ${active.length === 0 ? `
            <div class="tp-card tp-empty-state">
              <div class="tp-empty-icon">🎯</div>
              <h3 class="tp-empty-title">No active goals currently set</h3>
              <p class="tp-empty-desc">Engineers make 3x faster progress when tracking specific measurable goals. Select a recommended target above or create your custom target.</p>
            </div>
          ` : `
            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:1.25rem;">
              ${active.map(g => {
                const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
                return `
                  <div class="tp-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:1rem;">
                    <div>
                      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;margin-bottom:0.5rem">
                        <span class="mono-chip" style="color:var(--tp-primary);text-transform:uppercase">${g.type.replace('_',' ')}</span>
                        ${g.deadline ? `<span style="font-size:0.75rem;color:var(--tp-text-dark-muted)">Due: ${g.deadline}</span>` : ''}
                      </div>
                      <h3 style="font-size:1.05rem;font-weight:600;margin:0 0 0.5rem 0">${g.title}</h3>
                      <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.35rem">
                        <span style="color:var(--tp-text-dark-secondary)">Current Progress</span>
                        <strong style="color:var(--tp-text-light)">${g.currentValue} / ${g.targetValue} ${g.unit || ''} (${pct}%)</strong>
                      </div>
                      <div class="tp-progress-bar" style="height:8px">
                        <div class="tp-progress-fill" style="width:${pct}%;background:var(--tp-primary)"></div>
                      </div>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--tp-border-dark);padding-top:0.75rem;">
                      <button class="tp-btn tp-btn-secondary tp-btn-sm tp-increment-goal-btn" data-id="${g.id}" data-current="${g.currentValue}">
                        + 1 Progress
                      </button>
                      <button class="tp-btn tp-btn-ghost tp-btn-sm tp-delete-goal-btn" data-id="${g.id}" style="color:var(--tp-error)">
                        Delete
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

        <!-- Completed Goals Section -->
        ${completed.length > 0 ? `
          <div style="margin-top:1rem">
            <div class="tp-section-header" style="margin-bottom:1rem">
              <h2 class="headline-md" style="color:var(--tp-success)">🏆 Conquered Targets (${completed.length})</h2>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:1rem;">
              ${completed.map(g => `
                <div class="tp-card" style="border-left:3px solid var(--tp-success);opacity:0.85">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
                    <span class="mono-chip" style="color:var(--tp-success)">COMPLETED</span>
                    <span style="font-size:0.75rem;color:var(--tp-text-dark-muted)">100% Achieved</span>
                  </div>
                  <h4 style="font-size:1rem;margin:0 0 0.25rem 0">${g.title}</h4>
                  <p style="font-size:0.8rem;color:var(--tp-text-dark-secondary);margin:0">Target: ${g.targetValue} ${g.unit || ''}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;

    // Bind event handlers
    const toggleBtn = container.querySelector('#tp-new-goal-btn');
    const formCard = container.querySelector('#tp-goal-form-card');
    const cancelBtn = container.querySelector('#cancel-goal-btn');
    const goalForm = container.querySelector('#tp-goal-form');

    toggleBtn?.addEventListener('click', () => {
      formCard.style.display = formCard.style.display === 'none' ? 'block' : 'none';
      if (formCard.style.display === 'block') {
        container.querySelector('#goal-title-input')?.focus();
      }
    });

    cancelBtn?.addEventListener('click', () => {
      formCard.style.display = 'none';
    });

    goalForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = container.querySelector('#goal-title-input').value.trim();
      const type = container.querySelector('#goal-type-select').value;
      const targetValue = container.querySelector('#goal-target-input').value;
      const deadline = container.querySelector('#goal-deadline-input').value;

      let unit = 'items';
      if (type === 'topics') unit = 'topics';
      else if (type === 'videos') unit = 'videos';
      else if (type === 'quiz_score') unit = '%';
      else if (type === 'study_hours') unit = 'hrs';
      else if (type === 'project') unit = 'projects';

      await GoalEngine.createGoal({ title, type, targetValue, unit, deadline });
      Toast.show({ message: 'Target milestone added successfully!', type: 'success' });
      await GoalsPage.render(container);
    });

    container.querySelectorAll('.tp-preset-goal-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const title = btn.dataset.title;
        const type = btn.dataset.type;
        const targetValue = btn.dataset.target;
        const unit = btn.dataset.unit;
        const deadline = new Date(Date.now() + 7*86400000).toISOString().split('T')[0];

        await GoalEngine.createGoal({ title, type, targetValue, unit, deadline });
        Toast.show({ message: `Added "${title}"!`, type: 'success' });
        await GoalsPage.render(container);
      });
    });

    container.querySelectorAll('.tp-increment-goal-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const curr = Number(btn.dataset.current) || 0;
        await GoalEngine.updateProgress(id, curr + 1);
        Toast.show({ message: 'Progress updated! Keep pushing.', type: 'info' });
        await GoalsPage.render(container);
      });
    });

    container.querySelectorAll('.tp-delete-goal-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (confirm('Delete this goal?')) {
          await GoalEngine.deleteGoal(id);
          Toast.show({ message: 'Goal removed', type: 'info' });
          await GoalsPage.render(container);
        }
      });
    });
  }
}
