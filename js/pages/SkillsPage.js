/**
 * TECHPATH — SKILLS MATRIX & SKILL GAP ENGINE
 * Real-time competency assessment, role-mapping, gap analysis (Already Have, Need to Learn, Need to Improve, Optional),
 * and actionable interactive progress tracking.
 */

import { learningContext } from '../context/LearningContext.js';
import { authContext } from '../context/AuthContext.js';
import { SkillsEngine } from '../services/SkillsEngine.js';
import { dbStore } from '../db/store.js';
import { Toast } from '../components/Toast.js';

export class SkillsPage {
  static async render(container) {
    const ctx = learningContext.get();
    const user = authContext.getUser();
    const userId = user?.id || 'usr_guest';

    // Retrieve all career roles from database
    const roles = await dbStore.getAll('career_roles');
    if (!roles || roles.length === 0) {
      container.innerHTML = `
        <div class="tp-empty-state" style="padding: 4rem 2rem; text-align: center;">
          <h2 class="headline-md">Career Roles Initializing...</h2>
          <p style="color: var(--tp-text-dark-secondary);">Please wait while system career matrices synchronize.</p>
        </div>
      `;
      return;
    }

    // Determine initial active role
    let activeRoleId = ctx.target_role || user?.profile?.target_role;
    if (!activeRoleId || !roles.some(r => r.id === activeRoleId)) {
      // Find role matching user's branch
      const branchRole = roles.find(r => r.branch_id === ctx.branch_id);
      activeRoleId = branchRole ? branchRole.id : roles[0].id;
    }

    let activeFilter = 'all'; // 'all' | 'already_have' | 'need_to_learn' | 'need_to_improve' | 'optional'

    async function updateView() {
      const evaluation = await SkillsEngine.evaluateRoleSkills(activeRoleId, userId);
      const { role, skills, alreadyHave, needToLearn, needToImprove, optionalSkills, stats } = evaluation;

      container.innerHTML = `
        <div class="tp-page" style="display: flex; flex-direction: column; gap: 2rem; max-width: 1100px; margin: 0 auto; width: 100%;">
          
          <!-- Header & Role Selector -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
                <span class="pulse-beacon"></span>
                COMPETENCY MATRIX // ${role ? role.title.toUpperCase() : 'CAREER SKILLS'}
              </div>
              <h1 class="display-lg">Skills Matrix & Gap Analysis</h1>
              <p style="color: var(--tp-text-dark-secondary); max-width: 700px; font-size: 0.95rem;">
                “What skills do I need to learn to qualify for the selected career role?”
                Compare industry benchmarks directly against your verified proficiency.
              </p>
            </div>

            <!-- Role Selector Dropdown -->
            <div style="display: flex; flex-direction: column; gap: 0.35rem;">
              <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.72rem;">TARGET CAREER ROLE:</span>
              <select id="skills-role-select" class="tp-select" style="min-width: 280px; font-weight: 600; font-size: 0.92rem; padding: 0.55rem 1rem;">
                ${roles.map((r) => `
                  <option value="${r.id}" ${r.id === activeRoleId ? 'selected' : ''}>
                    ${r.title} (${(r.branch_id || 'core').toUpperCase()})
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Role Summary & Readiness Benchmark Card -->
          <div class="tp-card tp-card-glass" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; align-items: center; border-left: 4px solid var(--tp-primary);">
            <div style="grid-column: span 2;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <h3 class="headline-md" style="margin: 0;">${role ? role.title : 'Engineering Role'}</h3>
                <span class="telemetry-chip">${(role?.branch_id || ctx.branch_id || 'CSE').toUpperCase()} TRACK</span>
              </div>
              <p style="color: var(--tp-text-dark-secondary); font-size: 0.9rem; margin: 0.5rem 0 0.75rem 0;">
                ${role?.description || 'Industry-standard technical skill benchmarks.'}
              </p>
              <div style="display: flex; gap: 1rem; font-size: 0.82rem; color: #cbd5e1;">
                <span>Market Salary: <strong style="color: #fff;">${role?.salary_range || 'Competitive'}</strong></span>
                <span>•</span>
                <span>Demand: <strong style="color: #38bdf8;">${role?.market_demand || 'High'}</strong></span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; background: rgba(0,0,0,0.25); padding: 1rem 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--tp-border-dark);">
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
                <span style="color: var(--tp-text-dark-muted);">Role Qualification:</span>
                <strong style="color: ${stats.readinessPercent >= 75 ? 'var(--tp-success)' : stats.readinessPercent >= 40 ? 'var(--tp-warning)' : 'var(--tp-primary)'};">${stats.readinessPercent}%</strong>
              </div>
              <div style="height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
                <div style="width: ${stats.readinessPercent}%; height: 100%; background: ${stats.readinessPercent >= 75 ? 'var(--tp-success)' : stats.readinessPercent >= 40 ? 'var(--tp-warning)' : 'var(--tp-primary)'}; transition: width 0.4s ease;"></div>
              </div>
              <div style="font-size: 0.75rem; color: var(--tp-text-dark-muted); text-align: right;">
                ${stats.masteredCount} of ${stats.totalRequired} Competencies Qualified
              </div>
            </div>
          </div>

          <!-- Gap Breakdown Metric Tabs -->
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem;">
            <button class="tp-btn ${activeFilter === 'all' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm" data-filter="all">
              All Role Skills (${skills.length})
            </button>
            <button class="tp-btn ${activeFilter === 'need_to_learn' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm" data-filter="need_to_learn" style="${activeFilter !== 'need_to_learn' ? 'color:#fda4af;' : ''}">
              ❌ Need to Learn (${needToLearn.length})
            </button>
            <button class="tp-btn ${activeFilter === 'need_to_improve' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm" data-filter="need_to_improve" style="${activeFilter !== 'need_to_improve' ? 'color:#fde047;' : ''}">
              ⚡ Need to Improve (${needToImprove.length})
            </button>
            <button class="tp-btn ${activeFilter === 'already_have' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm" data-filter="already_have" style="${activeFilter !== 'already_have' ? 'color:#86efac;' : ''}">
              ✓ Already Have (${alreadyHave.length})
            </button>
            <button class="tp-btn ${activeFilter === 'optional' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm" data-filter="optional" style="${activeFilter !== 'optional' ? 'color:#93c5fd;' : ''}">
              💡 Optional / Nice to Have (${optionalSkills.length})
            </button>
          </div>

          <!-- Main Skills Display -->
          <div id="skills-items-container" style="display: flex; flex-direction: column; gap: 1rem;">
            ${renderSkillsList(evaluation, activeFilter, userId)}
          </div>

        </div>
      `;

      bindViewEvents(container, updateView, evaluation, userId);
    }

    function renderSkillsList(evaluation, filter, uId) {
      let displayedSkills = [];
      if (filter === 'all') displayedSkills = evaluation.skills;
      else if (filter === 'already_have') displayedSkills = evaluation.alreadyHave;
      else if (filter === 'need_to_learn') displayedSkills = evaluation.needToLearn;
      else if (filter === 'need_to_improve') displayedSkills = evaluation.needToImprove;
      else if (filter === 'optional') displayedSkills = evaluation.optionalSkills;

      if (displayedSkills.length === 0) {
        return `
          <div class="tp-card" style="text-align: center; padding: 3rem 1rem; color: var(--tp-text-dark-muted);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎉</div>
            <h4 style="color: #fff; margin-bottom: 0.25rem;">No skills found in this category</h4>
            <p style="font-size: 0.85rem;">All requirements for this filter have been satisfied.</p>
          </div>
        `;
      }

      return displayedSkills.map((s) => {
        let badgeBg = 'rgba(239, 68, 68, 0.15)';
        let badgeColor = '#fca5a5';
        let badgeText = 'NEED TO LEARN';

        if (s.status === 'Already Have') {
          badgeBg = 'rgba(16, 185, 129, 0.15)';
          badgeColor = '#86efac';
          badgeText = 'ALREADY HAVE';
        } else if (s.status === 'Need to Improve') {
          badgeBg = 'rgba(245, 158, 11, 0.15)';
          badgeColor = '#fde047';
          badgeText = 'NEED TO IMPROVE';
        } else if (s.status === 'Optional') {
          badgeBg = 'rgba(56, 189, 248, 0.15)';
          badgeColor = '#93c5fd';
          badgeText = 'NICE TO HAVE';
        }

        return `
          <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem 1.5rem;">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
                  <strong style="color: #fff; font-size: 1.1rem;">${s.name}</strong>
                  <span class="mono-chip" style="font-size: 0.75rem;">${s.category}</span>
                  <span style="font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: var(--radius-pill); background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeColor};">
                    ${badgeText}
                  </span>
                  ${s.priority === 'Critical' ? `<span style="font-size:0.75rem; font-weight:700; color:#fda4af;">🔥 Critical Priority</span>` : ''}
                  ${s.priority === 'High' ? `<span style="font-size:0.75rem; font-weight:700; color:#fde047;">⚡ High Priority</span>` : ''}
                </div>
                <p style="color: var(--tp-text-dark-secondary); font-size: 0.88rem; margin: 0.35rem 0 0.25rem 0;">
                  ${s.description}
                </p>
                <div style="font-size: 0.8rem; color: #94a3b8; font-style: italic;">
                  Why it matters: ${s.why_it_matters}
                </div>
              </div>

              <!-- Interactive Proficiency Level Controls -->
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem;">
                <div style="font-size: 0.78rem; color: var(--tp-text-dark-muted);">
                  Required: <strong>L${s.required_level}</strong> (${s.target_proficiency.split('(')[1]?.replace(')', '') || 'Mastery'})
                </div>
                
                <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.3); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--tp-border-dark);">
                  <span style="font-size: 0.75rem; color: var(--tp-text-dark-muted); margin-right: 0.25rem;">My Level:</span>
                  <button class="tp-btn tp-btn-xs tp-btn-ghost btn-level-down" data-skill="${s.skill_id}" data-level="${s.current_level}" style="padding: 0.1rem 0.4rem; font-weight: bold;">−</button>
                  <strong style="color: #fff; min-width: 24px; text-align: center; font-family: monospace;">L${s.current_level}</strong>
                  <button class="tp-btn tp-btn-xs tp-btn-ghost btn-level-up" data-skill="${s.skill_id}" data-level="${s.current_level}" style="padding: 0.1rem 0.4rem; font-weight: bold;">+</button>
                  
                  ${s.current_level < s.required_level ? `
                    <button class="tp-btn tp-btn-xs tp-btn-secondary btn-mark-complete" data-skill="${s.skill_id}" data-target="${s.required_level}" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;">
                      ✓ Mark Mastered
                    </button>
                  ` : `
                    <button class="tp-btn tp-btn-xs tp-btn-ghost btn-mark-reset" data-skill="${s.skill_id}" style="font-size: 0.72rem; padding: 0.2rem 0.5rem; color: var(--tp-text-dark-muted);">
                      Reset
                    </button>
                  `}
                </div>
              </div>
            </div>

            <!-- Recommended Learning Pathways -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <span style="font-size: 0.78rem; color: var(--tp-text-dark-muted);">
                Remediation Pathways:
              </span>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <a href="#/learnhub" class="tp-btn tp-btn-secondary tp-btn-xs">📖 Study LearnHub</a>
                <a href="#/practice" class="tp-btn tp-btn-secondary tp-btn-xs">🎯 Quiz Drill</a>
                <a href="#/projects" class="tp-btn tp-btn-secondary tp-btn-xs">🛠️ Build Project</a>
                <a href="#/interview" class="tp-btn tp-btn-secondary tp-btn-xs">🎙️ Mock Interview</a>
              </div>
            </div>

          </div>
        `;
      }).join('');
    }

    function bindViewEvents(container, updateView, evaluation, uId) {
      // Role selection change
      const roleSelect = container.querySelector('#skills-role-select');
      if (roleSelect) {
        roleSelect.addEventListener('change', async (e) => {
          activeRoleId = e.target.value;
          learningContext.setTargetRole(activeRoleId);
          // Sync with profile
          await authContext.updateProfile({ target_role: activeRoleId });
          await updateView();
        });
      }

      // Filter tabs
      container.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          activeFilter = e.currentTarget.getAttribute('data-filter');
          updateView();
        });
      });

      // Interactive Level Up
      container.querySelectorAll('.btn-level-up').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const skillId = e.currentTarget.getAttribute('data-skill');
          const current = parseInt(e.currentTarget.getAttribute('data-level'), 10) || 0;
          const newLevel = Math.min(5, current + 1);
          await SkillsEngine.updateUserSkillProgress(uId, skillId, newLevel, 'Self-Assessment');
          Toast.success(`Updated ${skillId.replace('skill_', '').replace(/_/g, ' ')} to Level ${newLevel}!`);
          await updateView();
        });
      });

      // Interactive Level Down
      container.querySelectorAll('.btn-level-down').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const skillId = e.currentTarget.getAttribute('data-skill');
          const current = parseInt(e.currentTarget.getAttribute('data-level'), 10) || 0;
          const newLevel = Math.max(0, current - 1);
          await SkillsEngine.updateUserSkillProgress(uId, skillId, newLevel, 'Self-Assessment');
          await updateView();
        });
      });

      // Mark Mastered
      container.querySelectorAll('.btn-mark-complete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const skillId = e.currentTarget.getAttribute('data-skill');
          const target = parseInt(e.currentTarget.getAttribute('data-target'), 10) || 4;
          await SkillsEngine.updateUserSkillProgress(uId, skillId, target, 'Self-Assessment Mastery');
          Toast.success('Skill marked as Mastered!');
          await updateView();
        });
      });

      // Mark Reset
      container.querySelectorAll('.btn-mark-reset').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const skillId = e.currentTarget.getAttribute('data-skill');
          await SkillsEngine.updateUserSkillProgress(uId, skillId, 0, 'Self-Assessment Reset');
          Toast.info('Skill proficiency reset.');
          await updateView();
        });
      });
    }

    await updateView();
  }
}
