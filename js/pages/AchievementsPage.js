/**
 * TECHPATH — ACHIEVEMENTS & GAMIFIED MASTERY
 * Unlocked badges, level progression (XP), streak milestones, and engineering honors
 */
import { AchievementEngine } from '../services/AchievementEngine.js';

export class AchievementsPage {
  static activeFilter = 'all';

  static async render(container) {
    // Grant welcome achievement if none granted yet
    await AchievementEngine.trigger('login');
    const achievements = await AchievementEngine.getAll();
    const earned = achievements.filter(a => a.earned);
    const unearned = achievements.filter(a => !a.earned);

    // XP calculation: 250 XP per earned badge + 50 XP base
    const totalXP = earned.length * 250 + 1200;
    const currentLevel = Math.floor(totalXP / 1000) + 1;
    const nextLevelXP = currentLevel * 1000;
    const currentLevelBaseXP = (currentLevel - 1) * 1000;
    const levelProgress = Math.round(((totalXP - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100);

    const levelTitles = [
      'Freshman Cadet',
      'Junior Technologist',
      'Apprentice Engineer',
      'Systems Architect in Training',
      'Senior Capstone Fellow',
      'Distinguished Master Builder'
    ];
    const rankTitle = levelTitles[Math.min(currentLevel - 1, levelTitles.length - 1)];

    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1100px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom:0.5rem">
              <span class="pulse-beacon"></span> COGNITIVE MASTERY LEVEL
            </div>
            <h1 class="display-lg">Engineering Honors & Achievements</h1>
            <p style="color:var(--tp-text-dark-secondary)">Earn verified credentials, streak trophies, and rank badges as you advance through the engineering curriculum.</p>
          </div>
          <div class="tp-dashboard-streak-badge">
            <span class="tp-streak-flame">🏆</span>
            <span class="tp-streak-number">${earned.length}</span>
            <span class="tp-streak-label">EARNED BADGES</span>
          </div>
        </div>

        <!-- Level & XP Progression Card -->
        <div class="tp-card tp-card-glass" style="border:1.5px solid rgba(225,29,72,0.3);padding:1.5rem 2rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1rem">
            <div style="display:flex;align-items:center;gap:1rem">
              <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg, var(--tp-primary), #fb7185);display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;color:#fff;box-shadow:0 0 20px rgba(225,29,72,0.4)">
                ${currentLevel}
              </div>
              <div>
                <div style="display:flex;align-items:center;gap:0.5rem">
                  <span class="mono-chip" style="color:var(--tp-primary)">RANK LEVEL ${currentLevel}</span>
                  <span style="font-size:0.8rem;color:var(--tp-text-dark-muted)">${rankTitle}</span>
                </div>
                <h2 class="headline-md" style="margin:0.25rem 0">${rankTitle}</h2>
              </div>
            </div>
            <div style="text-align:right">
              <span style="font-size:1.5rem;font-weight:700;color:var(--tp-primary)">${totalXP}</span>
              <span style="font-size:0.9rem;color:var(--tp-text-dark-muted)"> / ${nextLevelXP} XP</span>
              <div style="font-size:0.75rem;color:var(--tp-text-dark-secondary)">${nextLevelXP - totalXP} XP to Level ${currentLevel + 1}</div>
            </div>
          </div>

          <div class="tp-progress-bar" style="height:12px;border-radius:6px">
            <div class="tp-progress-fill" style="width:${levelProgress}%;background:linear-gradient(90deg, var(--tp-primary), #fb7185)"></div>
          </div>
        </div>

        <!-- Filter Chips -->
        <div style="display:flex;gap:0.5rem;border-bottom:1px solid var(--tp-border-dark);padding-bottom:0.5rem">
          <button class="tp-btn ${this.activeFilter === 'all' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm tp-ach-filter" data-f="all">
            All (${achievements.length})
          </button>
          <button class="tp-btn ${this.activeFilter === 'earned' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm tp-ach-filter" data-f="earned">
            Earned (${earned.length})
          </button>
          <button class="tp-btn ${this.activeFilter === 'unearned' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm tp-ach-filter" data-f="unearned">
            In Progress (${unearned.length})
          </button>
        </div>

        <!-- Badges Grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));gap:1.25rem;">
          ${(this.activeFilter === 'earned' ? earned : this.activeFilter === 'unearned' ? unearned : achievements).map(a => `
            <div class="tp-card" style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.5rem;border:1px solid ${a.earned ? 'rgba(34,197,94,0.3)' : 'var(--tp-border-dark)'};background:${a.earned ? 'rgba(34,197,94,0.03)' : 'rgba(255,255,255,0.01)'};position:relative;opacity:${a.earned ? '1' : '0.65'}">
              <div style="width:72px;height:72px;border-radius:50%;background:${a.earned ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)'};display:flex;align-items:center;justify-content:center;font-size:2.2rem;margin-bottom:1rem;box-shadow:${a.earned ? '0 0 20px rgba(34,197,94,0.2)' : 'none'}">
                ${a.icon}
              </div>
              <h3 style="font-size:1.05rem;font-weight:700;margin:0 0 0.35rem 0;color:${a.earned ? '#fff' : 'var(--tp-text-dark-secondary)'}">${a.title}</h3>
              <p style="font-size:0.82rem;color:var(--tp-text-dark-muted);margin:0 0 1rem 0;line-height:1.4">${a.desc}</p>
              
              <div style="margin-top:auto">
                ${a.earned ? `
                  <span class="mono-chip" style="color:var(--tp-success);background:rgba(34,197,94,0.1)">
                    ✓ EARNED (${a.grantedAt ? new Date(a.grantedAt).toLocaleDateString() : 'Active'})
                  </span>
                ` : `
                  <span class="mono-chip" style="color:var(--tp-text-dark-muted)">
                    🔒 INCOMPLETE
                  </span>
                `}
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    container.querySelectorAll('.tp-ach-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeFilter = e.currentTarget.dataset.f;
        AchievementsPage.render(container);
      });
    });
  }
}
