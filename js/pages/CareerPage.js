/**
 * TECHPATH — CAREER TRAJECTORIES & INDUSTRY PATHWAYS
 * Grounded in user's academic department, branch, specialization, semester, and skill gaps.
 * Renders an interactive 5-stage progression timeline with real progress tracking.
 */

import { learningContext } from '../context/LearningContext.js';
import { authContext } from '../context/AuthContext.js';
import { CareerEngine } from '../services/CareerEngine.js';
import { dbStore } from '../db/store.js';
import { Toast } from '../components/Toast.js';
import { supabase } from '../lib/supabase.js';

export class CareerPage {
  static async render(container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; gap: 1rem;">
        <div style="width: 42px; height: 42px; border: 3px solid rgba(225,29,72,0.2); border-top-color: var(--tp-primary); border-radius: 50%; animation: tp-spin 0.8s linear infinite;"></div>
        <p style="color: var(--tp-text-dark-secondary); font-size: 0.95rem;">Synthesizing your personalized career trajectory...</p>
      </div>
    `;

    try {
      const ctx = learningContext.get();
      const user = authContext.getUser();
      const profile = user?.profile || ctx;
      const branchId = profile.branch_id || ctx.branch_id || 'cse';

      const roles = await CareerEngine.getRolesForBranch(branchId);
      const activeRoleId = ctx.target_role || profile.target_role || profile.career_goal || roles[0]?.id || 'role_swe';

      // Load trajectory and telemetry in parallel
      const [trajectory, telemetry, internships] = await Promise.all([
        CareerEngine.buildPersonalizedTrajectory(profile, activeRoleId, user?.id || 'usr_guest'),
        CareerEngine.getRoleTelemetry(activeRoleId, user?.id || 'usr_guest', branchId),
        dbStore.getAll('internships')
      ]);

      const branchInternships = (internships || []).filter(i =>
        (i.branch_relevance || []).includes(branchId.toLowerCase())
      );

      const activeRole = telemetry?.role || roles.find(r => r.id === activeRoleId) || { title: activeRoleId };

      container.innerHTML = `
        <div class="tp-page" style="display: flex; flex-direction: column; gap: 2rem; max-width: 1200px; width: 100%;">
          
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <span class="pulse-beacon"></span>
                <span>${branchId.toUpperCase()} • SEMESTER ${(profile.semester_id || 'sem_3').replace('sem_', '')}</span>
                <span style="color: var(--tp-text-dark-muted);">&bull;</span>
                <span style="color: #fff;">${profile.specialization || 'Core Specialization'}</span>
              </div>
              <h1 class="display-lg">Career Trajectory: ${activeRole.title}</h1>
              <p style="color: var(--tp-text-dark-secondary); max-width: 780px;">
                Structured, competency-grounded progression roadmap mapping your current academic position directly to ${activeRole.title} industry benchmarks.
              </p>
            </div>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="#/skills" class="tp-btn tp-btn-secondary tp-btn-sm">⚡ Skills Matrix</a>
              <a href="#/mock-interview" class="tp-btn tp-btn-primary tp-btn-sm">🎤 Launch Role Mock Interview</a>
            </div>
          </div>

          <!-- Role Readiness Scorecard -->
          <div class="tp-card tp-card-glass tp-career-scorecard" style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1.5rem; padding: 1.5rem; border: 1px solid var(--tp-border-dark);">
            <div>
              <span class="mono-chip" style="color: var(--tp-primary); font-size: 0.75rem;">TARGET INDUSTRY ROLE</span>
              <h2 class="headline-lg" style="margin-top: 0.35rem; color: #fff;">${activeRole.title}</h2>
              <p style="font-size: 0.9rem; color: var(--tp-text-dark-secondary); margin-top: 0.35rem; line-height: 1.5;">
                ${activeRole.description || 'Target engineering role with verified competencies.'}
              </p>
              <div style="display: flex; gap: 0.5rem; margin-top: 0.85rem; flex-wrap: wrap;">
                <span class="mono-chip" style="color: var(--tp-text-dark-muted);">COMPENSATION: ${activeRole.salary_range || '₹8L–₹26L / $90k–$160k'}</span>
                <span class="mono-chip" style="color: var(--tp-success);">MARKET DEMAND: ${activeRole.market_demand || 'High Growth'}</span>
              </div>
            </div>

            <div style="text-align: center; border-left: 1px solid var(--tp-border-dark); padding: 0.5rem 1rem; display: flex; flex-direction: column; justify-content: center;">
              <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.75rem;">SKILL READINESS</span>
              <div style="font-size: 2.5rem; font-weight: 800; color: var(--tp-primary); margin-top: 0.25rem;">
                ${trajectory.stats.readinessScore}%
              </div>
              <span style="font-size: 0.75rem; color: var(--tp-text-dark-secondary);">Role Skills Verified</span>
            </div>

            <div style="text-align: center; border-left: 1px solid var(--tp-border-dark); padding: 0.5rem 1rem; display: flex; flex-direction: column; justify-content: center;">
              <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.75rem;">TRAJECTORY PROGRESS</span>
              <div style="font-size: 2.5rem; font-weight: 800; color: var(--tp-success); margin-top: 0.25rem;">
                ${trajectory.stats.overallProgress}%
              </div>
              <span style="font-size: 0.75rem; color: var(--tp-text-dark-secondary);">
                ${trajectory.stats.totalCompleted} of ${trajectory.stats.totalItems} Milestones Completed
              </span>
            </div>
          </div>

          <!-- Target Role Switcher -->
          <div class="tp-card" style="padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 class="headline-md" style="margin: 0; font-size: 1.05rem;">
                Switch Target Role (${branchId.toUpperCase()} Career Tracks)
              </h3>
              <span style="font-size: 0.8rem; color: var(--tp-text-dark-muted);">Recalculates Trajectory & Skill Gaps Immediately</span>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${roles.map(r => `
                <button class="tp-btn ${r.id === activeRoleId || r.title.toLowerCase() === (activeRoleId || '').toLowerCase() ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm role-select-btn" data-id="${r.id}" data-title="${r.title}">
                  ${r.title}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Trajectory Progression Timeline (5 Stages) -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <h2 class="headline-lg" style="margin: 0;">5-Stage Career Progression Timeline</h2>
                <p style="color: var(--tp-text-dark-secondary); font-size: 0.9rem; margin: 0.25rem 0 0 0;">
                  Click milestone checkmarks to record progress. Your Skills Matrix and Readiness Score update immediately.
                </p>
              </div>
              <span class="telemetry-chip">CANONICAL ACADEMIC TRAJECTORY</span>
            </div>

            <div style="position: relative; display: flex; flex-direction: column; gap: 2rem; padding-left: 2rem; border-left: 2px solid var(--tp-border-dark);">
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

                    <!-- Stage Header -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.85rem; margin-bottom: 1rem;">
                      <div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                          <span class="mono-chip" style="color: ${isCompleted ? 'var(--tp-success)' : isInProgress ? 'var(--tp-primary)' : 'var(--tp-text-dark-muted)'}; font-size: 0.75rem;">
                            STAGE 0${st.stage_number} // ${st.type.toUpperCase()}
                          </span>
                          <span style="font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: var(--radius-pill); font-weight: 700; background: ${isCompleted ? 'rgba(16,185,129,0.15)' : isInProgress ? 'rgba(225,29,72,0.15)' : 'rgba(255,255,255,0.05)'}; color: ${isCompleted ? '#86efac' : isInProgress ? '#fda4af' : '#94a3b8'};">
                            ${st.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <h3 class="headline-md" style="margin: 0; color: #fff;">${st.title}</h3>
                        <p style="color: var(--tp-text-dark-secondary); font-size: 0.88rem; margin: 0.35rem 0 0 0; line-height: 1.45;">
                          ${st.description}
                        </p>
                      </div>

                      <div style="text-align: right; font-size: 0.82rem; color: var(--tp-text-dark-muted);">
                        <div>Est. Effort: <strong>${st.estimated_hours} hrs</strong></div>
                        <div style="margin-top: 0.2rem;">Prerequisite: <em>${st.prerequisites}</em></div>
                        <div style="margin-top: 0.4rem; font-weight: 700; color: ${isCompleted ? 'var(--tp-success)' : 'var(--tp-primary)'};">
                          ${st.progress_percentage}% Stage Complete
                        </div>
                      </div>
                    </div>

                    <!-- Stage Progress Bar -->
                    <div style="height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; margin-bottom: 1.25rem;">
                      <div style="width: ${st.progress_percentage}%; height: 100%; background: ${isCompleted ? 'var(--tp-success)' : 'var(--tp-primary)'}; transition: width 0.3s ease;"></div>
                    </div>

                    <!-- Items Checklist -->
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                      ${st.items.map(item => {
                        const isItemCompleted = item.status === 'completed';
                        const isInProg = item.status === 'in_progress';
                        return `
                          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-sm); flex-wrap: wrap; gap: 0.75rem;">
                            <div style="display: flex; align-items: flex-start; gap: 0.75rem; flex: 1; min-width: 260px;">
                              <button class="trajectory-toggle-btn" data-stage="${st.id}" data-item="${item.id}" data-type="${item.type}" data-completed="${isItemCompleted}" style="background: none; border: none; cursor: pointer; padding: 0; font-size: 1.25rem; line-height: 1;" title="${isItemCompleted ? 'Mark incomplete' : 'Mark complete'}">
                                ${isItemCompleted ? '✅' : isInProg ? '⏳' : '⬜'}
                              </button>
                              <div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                  <strong style="color: ${isItemCompleted ? '#94a3b8' : '#fff'}; font-size: 0.95rem; ${isItemCompleted ? 'text-decoration: line-through;' : ''}">
                                    ${item.title}
                                  </strong>
                                  <span class="mono-chip" style="font-size: 0.7rem; padding: 0.1rem 0.4rem;">${item.type.toUpperCase()}</span>
                                  ${item.priority ? `<span style="font-size:0.7rem; color:${item.priority === 'Critical' ? '#fda4af' : '#fde047'}; font-weight:700;">${item.priority}</span>` : ''}
                                </div>
                                <p style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin: 0.25rem 0 0 0; line-height: 1.4;">
                                  ${item.description}
                                </p>
                                ${item.why_it_matters ? `<div style="font-size: 0.78rem; color: #94a3b8; font-style: italic; margin-top: 0.2rem;">Why it matters: ${item.why_it_matters}</div>` : ''}
                              </div>
                            </div>

                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                              ${item.actionUrl ? `
                                <a href="${item.actionUrl}" class="tp-btn tp-btn-ghost tp-btn-xs" style="font-size: 0.78rem; border: 1px solid var(--tp-border-dark);">
                                  ${item.actionLabel || 'Action'} &rarr;
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

          <!-- Verified Industry Internships -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <h3 class="headline-md">Verified Industry Internship Listings</h3>
                <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.75rem;">FILTERED STRICTLY FOR ${branchId.toUpperCase()}</span>
              </div>
            </div>

            ${branchInternships.length === 0 ? `
              <div class="tp-card tp-empty-state" style="padding: 2.5rem; text-align: center;">
                <p style="color: var(--tp-text-dark-muted);">No verified listings currently posted for ${branchId.toUpperCase()}. Only legitimate, vetted postings are displayed.</p>
              </div>
            ` : `
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
                ${branchInternships.map((intn) => `
                  <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; justify-content: space-between; gap: 1rem; border: 1px solid var(--tp-border-dark); padding: 1.25rem;">
                    <div>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span class="telemetry-chip">${intn.company_name}</span>
                        <span class="mono-chip" style="color: var(--tp-success);">${intn.stipend || 'Competitive'}</span>
                      </div>
                      <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.35rem; color: #fff;">${intn.role_title}</h4>
                      <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary); line-height: 1.5;">
                        Location: ${intn.location} | Deadline: ${intn.deadline || 'Rolling'}
                      </p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                      <a href="${intn.application_url}" target="_blank" rel="noopener noreferrer" class="tp-btn tp-btn-primary tp-btn-sm" style="flex: 1; text-align: center;">Apply Directly</a>
                      <button class="tp-btn tp-btn-secondary tp-btn-sm track-intn-btn" data-id="${intn.id}">Track</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

        </div>
      `;

      this._bindEvents(container, activeRoleId, branchId);

    } catch (err) {
      console.error('[CareerPage] Render error:', err);
      container.innerHTML = `
        <div class="tp-card tp-empty-state" style="max-width: 650px; margin: 3rem auto; text-align: center; padding: 3rem 1.5rem;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚠️</div>
          <h2 class="headline-md">Could not load Career Trajectory</h2>
          <p style="color: var(--tp-text-dark-secondary); margin: 0.75rem 0 1.5rem 0;">
            ${err.message || 'An unexpected error occurred while calculating your career progression.'}
          </p>
          <button id="retry-career-btn" class="tp-btn tp-btn-primary">🔄 Retry Calculation</button>
        </div>
      `;
      container.querySelector('#retry-career-btn')?.addEventListener('click', () => {
        CareerPage.render(container);
      });
    }
  }

  static _bindEvents(container, currentRoleId, branchId) {
    const user = authContext.getUser();

    // Target role switcher
    container.querySelectorAll('.role-select-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const roleId = e.currentTarget.dataset.id;
        const roleTitle = e.currentTarget.dataset.title || roleId;

        // 1. Synchronize learningContext
        learningContext.setTargetRole(roleId);

        // 2. Synchronize Supabase profile and local profile
        if (user?.id) {
          try {
            await supabase.from('profiles').update({
              target_role: roleTitle,
              updated_at: new Date().toISOString()
            }).eq('id', user.id);
            await authContext.updateProfile({ target_role: roleTitle });
          } catch { /* proceed */ }
        }

        Toast.info(`Target role switched to ${roleTitle}. Recalculating trajectory...`);
        CareerPage.render(container);
      });
    });

    // Milestone completion toggle
    container.querySelectorAll('.trajectory-toggle-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const stageId = e.currentTarget.dataset.stage;
        const itemId = e.currentTarget.dataset.item;
        const itemType = e.currentTarget.dataset.type;
        const isCurrentlyCompleted = e.currentTarget.dataset.completed === 'true';
        const newStatus = !isCurrentlyCompleted;

        try {
          await CareerEngine.updateTrajectoryItem(
            user?.id || 'usr_guest',
            currentRoleId,
            stageId,
            itemId,
            itemType,
            newStatus
          );

          Toast.success(newStatus ? 'Milestone marked completed! Trajectory updated.' : 'Milestone marked incomplete.');
          CareerPage.render(container);
        } catch (err) {
          Toast.error('Could not update milestone: ' + err.message);
        }
      });
    });

    // Internship tracking
    container.querySelectorAll('.track-intn-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.textContent = 'Tracked ✓';
        e.target.style.background = 'var(--tp-success)';
        e.target.style.borderColor = 'var(--tp-success)';
        Toast.show('Application added to your Career Tracker!', 'success');
      });
    });
  }
}

