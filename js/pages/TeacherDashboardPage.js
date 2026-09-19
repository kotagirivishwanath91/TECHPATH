/**
 * TECHPATH — TEACHER DASHBOARD STUDIO
 * Complete management suite for student teachers:
 * Class authoring, academic hierarchy mapping, student rosters, earnings telemetry,
 * reviews, and verification badge status.
 */

import { authContext } from '../context/AuthContext.js';
import { ClassesEngine } from '../services/ClassesEngine.js';
import { CreateClassModal } from '../components/CreateClassModal.js';
import { Toast } from '../components/Toast.js';

export class TeacherDashboardPage {
  static activeTab = 'classes';

  static async render(container) {
    const user = authContext.getUser();
    if (!user) {
      container.innerHTML = `
        <div class="tp-card" style="text-align: center; padding: 4rem 1rem; max-width: 500px; margin: 2rem auto;">
          <h2>Please Sign In</h2>
          <p style="color: var(--tp-text-dark-secondary); margin: 1rem 0;">You need to be logged in to access the Teacher Studio.</p>
          <a href="#/signin" class="tp-btn tp-btn-primary">Sign In</a>
        </div>
      `;
      return;
    }

    const dashboard = await ClassesEngine.getTeacherDashboardData(user.id);

    container.innerHTML = `
      <div class="tp-page" style="display: flex; flex-direction: column; gap: 1.75rem; max-width: 1200px; width: 100%;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.25rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
              TEACHER STUDIO // PEER EDUCATION COMMAND
            </div>
            <h1 class="display-lg">Teacher Dashboard</h1>
            <p style="color: var(--tp-text-dark-secondary);">
              Manage your engineering course catalog, track student enrollments, inspect net earnings, and maintain high student ratings.
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <a href="#/classes" class="tp-btn tp-btn-secondary" style="font-size: 0.88rem;">
              🌐 View Marketplace
            </a>
            <button id="td-create-class-btn" class="tp-btn tp-btn-primary" style="font-size: 0.88rem;">
              + Create New Class
            </button>
          </div>
        </div>

        <!-- Verification Banner Card -->
        <div class="tp-card tp-card-glass" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border: 1px solid rgba(225,29,72,0.25);">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(16,185,129,0.1); border: 1px solid #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              🏅
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <h3 style="color: #fff; font-size: 1.05rem; margin: 0;">Teacher Verification Status:</h3>
                <span class="telemetry-chip" style="font-size: 0.75rem; color: ${dashboard.profile?.verification_status === 'Teacher Verified' ? '#10b981' : '#f59e0b'}; border-color: ${dashboard.profile?.verification_status === 'Teacher Verified' ? '#10b981' : '#f59e0b'};">
                  ${dashboard.profile?.verification_status || 'Teacher Verified'}
                </span>
              </div>
              <p style="color: var(--tp-text-dark-secondary); font-size: 0.82rem; margin: 0.2rem 0 0 0;">
                Verified teachers gain elevated trust badges and higher student discovery rankings.
              </p>
            </div>
          </div>

          ${dashboard.profile?.verification_status !== 'Teacher Verified' ? `
            <button id="apply-verification-btn" class="tp-btn tp-btn-secondary" style="font-size: 0.82rem;">
              Request Verification Badge →
            </button>
          ` : `
            <span class="mono-chip" style="color: #10b981;">VERIFIED FACULTY & PEER</span>
          `}
        </div>

        <!-- KPI Metric Ribbon -->
        <div class="tp-metrics-grid">
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color: var(--tp-primary);">📚</div>
            <div class="tp-metric-value">${dashboard.activeClassesCount}</div>
            <div class="tp-metric-label">Active Published Classes</div>
            <div class="tp-metric-sub">${dashboard.classes.length} Total Catalogs</div>
          </div>

          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color: var(--tp-info);">👥</div>
            <div class="tp-metric-value">${dashboard.uniqueStudentsCount}</div>
            <div class="tp-metric-label">Enrolled Students</div>
            <div class="tp-metric-sub">${dashboard.paidBookingsCount} Total Bookings</div>
          </div>

          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color: var(--tp-success);">💰</div>
            <div class="tp-metric-value">₹${dashboard.grossEarnings}</div>
            <div class="tp-metric-label">Gross Earnings</div>
            <div class="tp-metric-sub">Direct Gateway Cleared</div>
          </div>

          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color: #f59e0b;">★</div>
            <div class="tp-metric-value">${dashboard.rating}</div>
            <div class="tp-metric-label">Average Student Rating</div>
            <div class="tp-metric-sub">${dashboard.reviews.length} Verified Reviews</div>
          </div>
        </div>

        <!-- Sub Navigation Tabs -->
        <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.5rem; overflow-x: auto;">
          <button class="tp-btn ${this.activeTab === 'classes' ? 'tp-btn-primary' : 'tp-btn-secondary'} td-tab-btn" data-tab="classes" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
            📚 My Classes (${dashboard.classes.length})
          </button>
          <button class="tp-btn ${this.activeTab === 'bookings' ? 'tp-btn-primary' : 'tp-btn-secondary'} td-tab-btn" data-tab="bookings" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
            👥 Enrolled Rosters (${dashboard.bookings.length})
          </button>
          <button class="tp-btn ${this.activeTab === 'reviews' ? 'tp-btn-primary' : 'tp-btn-secondary'} td-tab-btn" data-tab="reviews" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
            ★ Student Reviews (${dashboard.reviews.length})
          </button>
        </div>

        <!-- Tab Body -->
        <div id="td-tab-content">
          ${this._renderTab(this.activeTab, dashboard, user)}
        </div>
      </div>
    `;

    // Tab buttons
    container.querySelectorAll('.td-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.dataset.tab;
        TeacherDashboardPage.render(container);
      });
    });

    // Create Class Modal
    container.querySelector('#td-create-class-btn')?.addEventListener('click', () => {
      CreateClassModal.open(user, () => TeacherDashboardPage.render(container));
    });

    // Verification button
    container.querySelector('#apply-verification-btn')?.addEventListener('click', async () => {
      await ClassesEngine.requestTeacherVerification(user.id, {
        credentials: 'Top grade in core branch subjects + peer tutoring history',
        notes: 'Submitted verification request from teacher studio'
      });
      Toast.success('Teacher verification request submitted to academic review board!');
      TeacherDashboardPage.render(container);
    });

    this._bindTabEvents(container, user, dashboard);
  }

  static _renderTab(tab, dashboard, user) {
    if (tab === 'classes') {
      if (dashboard.classes.length === 0) {
        return `
          <div class="tp-card" style="text-align: center; padding: 4rem 1rem;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">📝</div>
            <h3 style="color: #fff; font-size: 1.25rem; margin-bottom: 0.5rem;">You haven't authored any classes yet</h3>
            <p style="color: var(--tp-text-dark-secondary); max-width: 480px; margin: 0 auto 1.5rem auto;">
              Create your first class in your engineering discipline. Set your own subject, price, and schedule.
            </p>
            <button id="tab-empty-create-btn" class="tp-btn tp-btn-primary" style="font-size: 0.88rem;">
              + Create Your First Class
            </button>
          </div>
        `;
      }

      return `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${dashboard.classes.map(cls => {
            const isPublished = cls.status === 'PUBLISHED' || cls.status === 'active';
            const semNum = (cls.semester_id || 'sem_3').replace('sem_', '');
            const statusColor = isPublished ? '#10b981' : cls.status === 'PAUSED' ? '#f59e0b' : '#38bdf8';
            const statusLabel = isPublished ? 'PUBLISHED' : (cls.status || 'DRAFT').toUpperCase();

            return `
              <div class="tp-card tp-card-glass" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.25rem; border: 1px solid var(--tp-border-dark); padding: 1.25rem 1.5rem;">
                <div style="flex: 1; min-width: 290px;">
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                    <span class="telemetry-chip" style="font-size: 0.7rem; color: var(--tp-primary); border-color: var(--tp-primary);">
                      ${cls.branch_id.toUpperCase()} &bull; Semester ${semNum}
                    </span>
                    <span class="mono-chip" style="font-size: 0.7rem; color: ${statusColor}; border-color: ${statusColor};">
                      ● ${statusLabel}
                    </span>
                    <span style="font-size: 0.75rem; color: #f59e0b;">★ ${(cls.rating || 5.0).toFixed(1)} (${cls.reviews_count || 0})</span>
                  </div>

                  <h3 style="color: #fff; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">
                    <a href="#/classes/${cls.id}" style="color: inherit; text-decoration: none;">${cls.title}</a>
                  </h3>

                  <!-- Canonical Hierarchy Discovery Path -->
                  <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; padding: 0.5rem 0.75rem; margin-bottom: 0.75rem; font-size: 0.78rem; color: #94a3b8; display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                    <span style="color: #cbd5e1; font-weight: 600;">Published under:</span>
                    <span>${cls.department_name || 'Engineering'}</span> &rarr;
                    <strong style="color: var(--tp-primary);">${cls.branch_id.toUpperCase()}</strong> &rarr;
                    ${cls.specialization ? `<span>${cls.specialization} &rarr;</span>` : ''}
                    <span>Sem ${semNum}</span> &rarr;
                    <span style="color: #cbd5e1;">${cls.subject}</span> &rarr;
                    <span style="color: #38bdf8;">${cls.topic}</span>
                  </div>

                  <div style="display: flex; gap: 1.25rem; font-size: 0.82rem; color: var(--tp-text-dark-secondary); flex-wrap: wrap;">
                    <span>Price: <strong style="color: #fff;">${cls.price === 0 ? 'Free' : `₹${cls.price}`}</strong></span>
                    <span>Enrolled: <strong style="color: #fff;">${cls.booked_count || 0} / ${cls.max_students || 15}</strong></span>
                    <span>Duration: <strong style="color: #fff;">${cls.duration || 60} Mins</strong></span>
                    <span>Language: <strong style="color: #fff;">${cls.language || 'English'}</strong></span>
                  </div>
                </div>

                <!-- Action Controls -->
                <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-top: 0.25rem;">
                  <a href="#/classes/${cls.id}/classroom" class="tp-btn tp-btn-primary" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                    Host Classroom →
                  </a>
                  <button class="tp-btn tp-btn-secondary edit-class-btn" data-id="${cls.id}" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
                    ✏️ Edit Class
                  </button>
                  <button class="tp-btn tp-btn-secondary toggle-status-btn" data-id="${cls.id}" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
                    ${isPublished ? '⏸️ Pause' : '▶️ Resume'}
                  </button>
                  <a href="#/classes?branch=${cls.branch_id}&semester=${cls.semester_id}" class="tp-btn tp-btn-ghost" style="font-size: 0.82rem; color: #38bdf8;" title="View category in TechPath Classes">
                    🌐 In TechPath Classes
                  </a>
                  <a href="#/classes/${cls.id}" class="tp-btn tp-btn-ghost" style="font-size: 0.82rem;">
                    Preview
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    if (tab === 'bookings') {
      if (dashboard.bookings.length === 0) {
        return `
          <div class="tp-card" style="text-align: center; padding: 3.5rem 1rem;">
            <p style="color: var(--tp-text-dark-secondary);">No student enrollments logged yet.</p>
          </div>
        `;
      }

      return `
        <div class="tp-card">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 1px solid var(--tp-border-dark); color: var(--tp-text-dark-muted);">
                  <th style="padding: 0.75rem 0.5rem;">Student Name</th>
                  <th style="padding: 0.75rem 0.5rem;">Class Title</th>
                  <th style="padding: 0.75rem 0.5rem;">Schedule</th>
                  <th style="padding: 0.75rem 0.5rem;">Payment</th>
                  <th style="padding: 0.75rem 0.5rem;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${dashboard.bookings.map(b => `
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 0.75rem 0.5rem;">
                      <strong style="color: #fff;">${b.student_name}</strong>
                      <div style="font-size: 0.75rem; color: var(--tp-text-dark-muted);">${b.student_email}</div>
                    </td>
                    <td style="padding: 0.75rem 0.5rem; color: #cbd5e1;">${b.class_title}</td>
                    <td style="padding: 0.75rem 0.5rem; color: #94a3b8;">${b.date} &bull; ${b.start_time} - ${b.end_time}</td>
                    <td style="padding: 0.75rem 0.5rem;">
                      <strong style="color: #10b981;">₹${b.amount}</strong>
                    </td>
                    <td style="padding: 0.75rem 0.5rem;">
                      <span class="telemetry-chip" style="font-size: 0.7rem; color: ${b.status === 'paid' ? '#10b981' : '#f59e0b'}; border-color: ${b.status === 'paid' ? '#10b981' : '#f59e0b'};">
                        ${b.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'reviews') {
      if (dashboard.reviews.length === 0) {
        return `
          <div class="tp-card" style="text-align: center; padding: 3.5rem 1rem;">
            <p style="color: var(--tp-text-dark-secondary);">No reviews received yet. Verified reviews appear once students complete classes.</p>
          </div>
        `;
      }

      return `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${dashboard.reviews.map(r => `
            <div class="tp-card" style="padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <div>
                  <strong style="color: #fff; font-size: 0.92rem;">${r.student_name}</strong>
                  <span style="font-size: 0.75rem; color: var(--tp-text-dark-muted); margin-left: 0.4rem;">${r.student_techpath_id}</span>
                </div>
                <span style="color: #f59e0b; font-size: 0.85rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p style="color: #cbd5e1; font-size: 0.88rem; line-height: 1.5; margin: 0 0 0.4rem 0;">“${r.review}”</p>
              <span style="font-size: 0.72rem; color: var(--tp-text-dark-muted);">${new Date(r.created_at).toLocaleDateString()}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    return '';
  }

  static _bindTabEvents(container, user, dashboard) {
    // Empty state create class trigger
    container.querySelector('#tab-empty-create-btn')?.addEventListener('click', () => {
      CreateClassModal.open(user, () => TeacherDashboardPage.render(container));
    });

    // Edit Class button
    container.querySelectorAll('.edit-class-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const classId = btn.dataset.id;
        const targetClass = dashboard.classes.find(c => c.id === classId);
        if (targetClass) {
          CreateClassModal.open(user, () => TeacherDashboardPage.render(container), targetClass);
        }
      });
    });

    // Pause/resume class toggle
    container.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const classId = btn.dataset.id;
        btn.disabled = true;
        try {
          const next = await ClassesEngine.toggleClassStatus(classId, user.id);
          Toast.info(`Class status updated to ${next.toUpperCase()}.`);
          TeacherDashboardPage.render(container);
        } catch (err) {
          Toast.error(err.message);
          btn.disabled = false;
        }
      });
    });
  }
}
