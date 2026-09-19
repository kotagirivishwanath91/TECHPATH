/**
 * TECHPATH — ENTERPRISE ADMINISTRATION & GOVERNANCE CONSOLE
 * Authorized access for academic curriculum oversight, user role management, security audit logs, and DB diagnostics
 */
import { authContext } from '../context/AuthContext.js';
import { dbStore } from '../db/store.js';
import { Toast } from '../components/Toast.js';
import { PaymentGatewayEngine } from '../services/PaymentGatewayEngine.js';
import { QuizLeagueEngine } from '../services/QuizLeagueEngine.js';
import { ExamRoadmapEngine } from '../services/ExamRoadmapEngine.js';

export class AdminPage {
  static activeTab = 'overview';

  static async render(container) {
    // Strict Admin Authorization Guard: Accessible ONLY to kotagirivishwanath@gmail.com
    if (!authContext.isAdminUser()) {
      window.location.hash = '#/dashboard';
      return;
    }

    const [branches, subjects, projects, skills, reports, classes, teacherVerifications, payments, refunds, teachingProfiles, quizEvents, exams] = await Promise.all([
      dbStore.getAll('branches'),
      dbStore.getAll('subjects'),
      dbStore.getAll('projects'),
      dbStore.getAll('skills'),
      dbStore.getAll('user_reports'),
      dbStore.getAll('classes'),
      dbStore.getAll('teacher_verifications'),
      dbStore.getAll('payments'),
      dbStore.getAll('refunds'),
      dbStore.getAll('teaching_profiles'),
      dbStore.getAll('quiz_events'),
      ExamRoadmapEngine.getAvailableExams()
    ]);

    const users = JSON.parse(localStorage.getItem('TP_USERS_DB') || '[]');
    const auditLogs = JSON.parse(localStorage.getItem('TP_ERASURE_REQUESTS') || '[]');

    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1200px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom:0.5rem;background:rgba(239,68,68,0.15);color:var(--tp-error);border-color:var(--tp-error);">
              <span class="pulse-beacon" style="background:var(--tp-error)"></span> SECURE GOVERNANCE ENVIRONMENT // ELEVATED PERMISSIONS
            </div>
            <h1 class="display-lg">Platform Administration Console</h1>
            <p style="color:var(--tp-text-dark-secondary)">Supervise canonical academic catalogs, user access control, security logs, and marketplace transactions.</p>
          </div>
          <button id="reseed-db-btn" class="tp-btn tp-btn-secondary">
            🔄 Reseed Canonical DB
          </button>
        </div>

        <!-- Metric KPI Ribbon -->
        <div class="tp-metrics-grid">
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-primary)">🏛️</div>
            <div class="tp-metric-value">${branches.length}</div>
            <div class="tp-metric-label">Active Branches</div>
            <div class="tp-metric-sub">Strict Isolation Active</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-info)">📖</div>
            <div class="tp-metric-value">${subjects.length}</div>
            <div class="tp-metric-label">Curriculum Subjects</div>
            <div class="tp-metric-sub">Across 8 Semesters</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-accent)">🎓</div>
            <div class="tp-metric-value">${classes.length}</div>
            <div class="tp-metric-label">Marketplace Classes</div>
            <div class="tp-metric-sub">${payments.filter(p => p.status === 'Paid').length} Paid Transactions</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:#ef4444">🚨</div>
            <div class="tp-metric-value">${reports.filter(r => r.status === 'pending').length}</div>
            <div class="tp-metric-label">Pending Reports</div>
            <div class="tp-metric-sub">${teacherVerifications.filter(v => v.status === 'pending').length} Verif Requests</div>
          </div>
        </div>

        <!-- Admin Navigation Tabs -->
        <div style="display:flex;gap:0.5rem;border-bottom:1px solid var(--tp-border-dark);padding-bottom:0.5rem;overflow-x:auto;">
          ${[
            { id: 'overview', label: '🏛️ Branches & Catalog' },
            { id: 'subjects', label: '📖 Subjects Manager' },
            { id: 'marketplace', label: `🎓 Marketplace & Classes (${classes.length})` },
            { id: 'quiz_scheduler', label: `🏆 Quiz League Scheduler (${quizEvents.length})` },
            { id: 'exams', label: `🎯 Exam Catalog (${exams.length})` },
            { id: 'users', label: '👥 User Accounts' },
            { id: 'reports', label: `🚨 Reports & Moderation (${reports.filter(r => r.status === 'pending').length})` },
            { id: 'audit', label: '🛡️ Audit & Privacy Logs' },
            { id: 'system', label: '⚙️ System Telemetry' }
          ].map(t => `
            <button class="tp-btn ${this.activeTab === t.id ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm admin-tab-btn" data-tab="${t.id}" style="white-space:nowrap">
              ${t.label}
            </button>
          `).join('')}
        </div>

        <!-- Tab Body -->
        <div id="admin-tab-content">
          ${this._renderAdminTab(this.activeTab, {
            branches, subjects, users, auditLogs, projects, skills, reports,
            classes, teacherVerifications, payments, refunds, teachingProfiles,
            quizEvents, exams
          })}
        </div>

      </div>
    `;

    // Event handlers
    container.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.dataset.tab;
        AdminPage.render(container);
      });
    });

    container.querySelector('#reseed-db-btn')?.addEventListener('click', async () => {
      if (confirm('Re-run idempotent database seeder? Existing user custom data will be preserved.')) {
        await dbStore.seedAll();
        Toast.show({ message: 'Database refreshed and re-seeded successfully!', type: 'success' });
        await AdminPage.render(container);
      }
    });

    this._bindTabEvents(container, {
      users, reports, classes, teacherVerifications, payments, refunds, teachingProfiles,
      quizEvents, exams
    });
  }

  static _renderAdminTab(tab, {
    branches, subjects, users, auditLogs, projects, skills, reports,
    classes = [], teacherVerifications = [], payments = [], refunds = [], teachingProfiles = [],
    quizEvents = [], exams = []
  }) {
    switch (tab) {
      case 'quiz_scheduler':
        return `
          <div style="display:flex;flex-direction:column;gap:1.5rem;">
            <!-- Quiz Schedule Creation Form -->
            <div class="tp-card">
              <div class="tp-section-header" style="margin-bottom:1rem;">
                <div>
                  <h2 class="headline-md">Schedule New Monthly Quiz Event</h2>
                  <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Configure branch championship, date/time window, question count, and duration.</p>
                </div>
              </div>

              <form id="form-create-quiz-event" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;">
                <div>
                  <label class="tp-label">Event Title</label>
                  <input type="text" id="sched-title" class="tp-input" placeholder="e.g. Week 1 ECE Championship" required />
                </div>
                <div>
                  <label class="tp-label">Assigned Branch</label>
                  <select id="sched-branch" class="tp-input">
                    <option value="cse">CSE (Computer Science)</option>
                    <option value="ece">ECE (Electronics)</option>
                    <option value="eee">EEE (Electrical)</option>
                    <option value="mech">MECH (Mechanical)</option>
                    <option value="civil">CIVIL (Infrastructure)</option>
                  </select>
                </div>
                <div>
                  <label class="tp-label">Week Number (1-4)</label>
                  <select id="sched-week" class="tp-input">
                    <option value="1">Week 1</option>
                    <option value="2">Week 2</option>
                    <option value="3">Week 3</option>
                    <option value="4">Week 4</option>
                  </select>
                </div>
                <div>
                  <label class="tp-label">Month</label>
                  <input type="text" id="sched-month" class="tp-input" value="September 2026" required />
                </div>
                <div>
                  <label class="tp-label">Scheduled Start Time</label>
                  <input type="datetime-local" id="sched-start" class="tp-input" required />
                </div>
                <div>
                  <label class="tp-label">Scheduled End Time</label>
                  <input type="datetime-local" id="sched-end" class="tp-input" required />
                </div>
                <div>
                  <label class="tp-label">Duration (Minutes)</label>
                  <input type="number" id="sched-duration" class="tp-input" value="30" min="10" max="180" required />
                </div>
                <div>
                  <label class="tp-label">Total Questions</label>
                  <input type="number" id="sched-questions" class="tp-input" value="15" min="5" max="50" required />
                </div>
                <div style="grid-column:1 / -1;display:flex;justify-content:flex-end;margin-top:0.5rem;">
                  <button type="submit" id="btn-save-quiz-event" class="tp-btn tp-btn-primary">
                    📅 Publish Scheduled Quiz Event
                  </button>
                </div>
              </form>
            </div>

            <!-- Existing Scheduled Quiz Events -->
            <div class="tp-card">
              <div class="tp-section-header" style="margin-bottom:1rem;">
                <div>
                  <h2 class="headline-md">Scheduled Monthly Events (${quizEvents.length})</h2>
                  <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Server-enforced start time, branch isolation, and participation telemetry.</p>
                </div>
              </div>

              <div style="overflow-x:auto;">
                <table class="tp-table" style="width:100%;font-size:0.85rem;border-collapse:collapse;">
                  <thead>
                    <tr style="border-bottom:1px solid var(--tp-border-dark);text-align:left;color:var(--tp-text-dark-muted);">
                      <th style="padding:0.75rem 0.5rem">Week / Title</th>
                      <th style="padding:0.75rem 0.5rem">Branch</th>
                      <th style="padding:0.75rem 0.5rem">Start Time</th>
                      <th style="padding:0.75rem 0.5rem">End Time</th>
                      <th style="padding:0.75rem 0.5rem">Duration</th>
                      <th style="padding:0.75rem 0.5rem">Status</th>
                      <th style="padding:0.75rem 0.5rem;text-align:right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${quizEvents.map(evt => {
                      const s = QuizLeagueEngine.evaluateState(evt);
                      return `
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                          <td style="padding:0.75rem 0.5rem">
                            <strong style="color:#fff;">Week ${evt.week_number}: ${evt.title}</strong>
                            <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);font-family:monospace;">${evt.id}</div>
                          </td>
                          <td style="padding:0.75rem 0.5rem"><span class="telemetry-chip">${(evt.branch_id || 'ALL').toUpperCase()}</span></td>
                          <td style="padding:0.75rem 0.5rem;font-size:0.8rem;color:var(--tp-text-dark-secondary);">${new Date(evt.start_at).toLocaleString()}</td>
                          <td style="padding:0.75rem 0.5rem;font-size:0.8rem;color:var(--tp-text-dark-secondary);">${new Date(evt.end_at).toLocaleString()}</td>
                          <td style="padding:0.75rem 0.5rem">${evt.duration_minutes || 30}m</td>
                          <td style="padding:0.75rem 0.5rem">
                            <span class="telemetry-chip" style="
                              color:${s.state === 'LIVE' ? 'var(--tp-success)' : s.state === 'SCHEDULED' ? '#f59e0b' : 'var(--tp-text-dark-muted)'};
                              border-color:${s.state === 'LIVE' ? 'var(--tp-success)' : s.state === 'SCHEDULED' ? '#f59e0b' : 'var(--tp-text-dark-muted)'};
                            ">
                              ${s.state}
                            </span>
                          </td>
                          <td style="padding:0.75rem 0.5rem;text-align:right">
                            <button class="tp-btn tp-btn-xs tp-btn-secondary btn-delete-quiz-event" data-id="${evt.id}" style="color:var(--tp-error);">
                              🗑️ Cancel
                            </button>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;

      case 'marketplace':
        return `
          <div style="display:flex;flex-direction:column;gap:1.5rem;">
            <!-- Teacher Verification Applications -->
            <div class="tp-card">
              <div class="tp-section-header" style="margin-bottom:1rem">
                <div>
                  <h2 class="headline-md">Teacher Verification Queue (${teacherVerifications.filter(v => v.status === 'pending').length} Pending)</h2>
                  <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Verify academic credentials and grant official "Teacher Verified" badges to instructors.</p>
                </div>
              </div>

              ${teacherVerifications.length === 0 ? `
                <p style="font-size:0.85rem;color:var(--tp-text-dark-muted)">No teacher verification applications found.</p>
              ` : `
                <div style="overflow-x:auto">
                  <table class="tp-table" style="width:100%;font-size:0.85rem;border-collapse:collapse;">
                    <thead>
                      <tr style="border-bottom:1px solid var(--tp-border-dark);text-align:left;color:var(--tp-text-dark-muted);">
                        <th style="padding:0.75rem 0.5rem">Teacher / User ID</th>
                        <th style="padding:0.75rem 0.5rem">Branch</th>
                        <th style="padding:0.75rem 0.5rem">Specialization</th>
                        <th style="padding:0.75rem 0.5rem">Status</th>
                        <th style="padding:0.75rem 0.5rem">Applied</th>
                        <th style="padding:0.75rem 0.5rem;text-align:right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${teacherVerifications.map(v => {
                        const prof = teachingProfiles.find(p => p.user_id === v.user_id) || {};
                        return `
                          <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                            <td style="padding:0.75rem 0.5rem">
                              <strong>${prof.teacher_name || v.user_id}</strong>
                              <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);font-family:monospace;">${v.user_id}</div>
                            </td>
                            <td style="padding:0.75rem 0.5rem"><span class="telemetry-chip">${prof.branch_id ? prof.branch_id.toUpperCase() : 'N/A'}</span></td>
                            <td style="padding:0.75rem 0.5rem">${prof.specialization || 'Engineering Faculty'}</td>
                            <td style="padding:0.75rem 0.5rem">
                              <span class="telemetry-chip" style="
                                color: ${v.status === 'approved' ? 'var(--tp-success)' : v.status === 'rejected' ? 'var(--tp-error)' : 'var(--tp-accent)'};
                                border-color: ${v.status === 'approved' ? 'var(--tp-success)' : v.status === 'rejected' ? 'var(--tp-error)' : 'var(--tp-accent)'};
                              ">
                                ${v.status.toUpperCase()}
                              </span>
                            </td>
                            <td style="padding:0.75rem 0.5rem;font-size:0.75rem;color:var(--tp-text-dark-muted);">${new Date(v.created_at).toLocaleDateString()}</td>
                            <td style="padding:0.75rem 0.5rem;text-align:right">
                              ${v.status === 'pending' ? `
                                <button class="tp-btn tp-btn-xs tp-btn-primary btn-approve-verif" data-id="${v.id}" data-uid="${v.user_id}" style="margin-right:0.35rem">
                                  ✅ Approve
                                </button>
                                <button class="tp-btn tp-btn-xs tp-btn-secondary btn-reject-verif" data-id="${v.id}" data-uid="${v.user_id}">
                                  ❌ Reject
                                </button>
                              ` : `
                                <button class="tp-btn tp-btn-xs tp-btn-secondary btn-toggle-verif" data-id="${v.id}" data-uid="${v.user_id}" data-curr="${v.status}">
                                  Reset Status
                                </button>
                              `}
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              `}
            </div>

            <!-- Active Classes Governance -->
            <div class="tp-card">
              <div class="tp-section-header" style="margin-bottom:1rem">
                <div>
                  <h2 class="headline-md">Classes & Marketplace Catalog (${classes.length})</h2>
                  <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Monitor all listed classes, review academic quality, and pause/suspend listings if necessary.</p>
                </div>
              </div>

              <div style="overflow-x:auto">
                <table class="tp-table" style="width:100%;font-size:0.85rem;border-collapse:collapse;">
                  <thead>
                    <tr style="border-bottom:1px solid var(--tp-border-dark);text-align:left;color:var(--tp-text-dark-muted);">
                      <th style="padding:0.75rem 0.5rem">Class Title</th>
                      <th style="padding:0.75rem 0.5rem">Branch</th>
                      <th style="padding:0.75rem 0.5rem">Teacher</th>
                      <th style="padding:0.75rem 0.5rem">Tuition Price</th>
                      <th style="padding:0.75rem 0.5rem">Enrollment</th>
                      <th style="padding:0.75rem 0.5rem">Status</th>
                      <th style="padding:0.75rem 0.5rem;text-align:right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${classes.map(c => `
                      <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                        <td style="padding:0.75rem 0.5rem">
                          <a href="#/classes/${c.id}" style="color:#fff;text-decoration:none;font-weight:600;">${c.title}</a>
                          <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);">${c.subject || ''} • Sem ${c.semester || 'All'}</div>
                        </td>
                        <td style="padding:0.75rem 0.5rem"><span class="telemetry-chip">${(c.branch_id || 'CSE').toUpperCase()}</span></td>
                        <td style="padding:0.75rem 0.5rem">${c.teacher_name || 'Instructor'}</td>
                        <td style="padding:0.75rem 0.5rem;color:var(--tp-accent);font-weight:700;">₹${c.price}</td>
                        <td style="padding:0.75rem 0.5rem">${c.current_students_count || 0} / ${c.max_students || '∞'}</td>
                        <td style="padding:0.75rem 0.5rem">
                          <span class="telemetry-chip" style="
                            color: ${c.status === 'active' ? 'var(--tp-success)' : 'var(--tp-error)'};
                            border-color: ${c.status === 'active' ? 'var(--tp-success)' : 'var(--tp-error)'};
                          ">
                            ${(c.status || 'active').toUpperCase()}
                          </span>
                        </td>
                        <td style="padding:0.75rem 0.5rem;text-align:right">
                          <button class="tp-btn tp-btn-xs ${c.status === 'active' ? 'tp-btn-secondary' : 'tp-btn-primary'} btn-toggle-class-status" data-id="${c.id}" data-curr="${c.status || 'active'}">
                            ${c.status === 'active' ? '⏸️ Pause Listing' : '▶️ Activate'}
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Financial Transactions & Dispute Ledger -->
            <div class="tp-card">
              <div class="tp-section-header" style="margin-bottom:1rem">
                <div>
                  <h2 class="headline-md">Financial Settlement & Payments Ledger (${payments.length})</h2>
                  <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Auditable payment records with cryptographic signatures, transparent fees, and administrative refund controls.</p>
                </div>
              </div>

              ${payments.length === 0 ? `
                <p style="font-size:0.85rem;color:var(--tp-text-dark-muted)">No payment transactions recorded yet.</p>
              ` : `
                <div style="overflow-x:auto">
                  <table class="tp-table" style="width:100%;font-size:0.85rem;border-collapse:collapse;">
                    <thead>
                      <tr style="border-bottom:1px solid var(--tp-border-dark);text-align:left;color:var(--tp-text-dark-muted);">
                        <th style="padding:0.75rem 0.5rem">Order ID</th>
                        <th style="padding:0.75rem 0.5rem">Student ID</th>
                        <th style="padding:0.75rem 0.5rem">Class Price</th>
                        <th style="padding:0.75rem 0.5rem">Additional Fees</th>
                        <th style="padding:0.75rem 0.5rem">Total Paid</th>
                        <th style="padding:0.75rem 0.5rem">Gateway Status</th>
                        <th style="padding:0.75rem 0.5rem">Timestamp</th>
                        <th style="padding:0.75rem 0.5rem;text-align:right">Admin Controls</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${payments.map(p => `
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                          <td style="padding:0.75rem 0.5rem">
                            <span style="font-family:monospace;color:var(--tp-primary);font-size:0.8rem;">${p.id}</span>
                          </td>
                          <td style="padding:0.75rem 0.5rem;font-family:monospace;font-size:0.75rem;color:var(--tp-text-dark-secondary);">${p.student_id}</td>
                          <td style="padding:0.75rem 0.5rem">₹${p.amount}</td>
                          <td style="padding:0.75rem 0.5rem;color:var(--tp-text-dark-muted)">₹${p.platform_fee || 0}</td>
                          <td style="padding:0.75rem 0.5rem;font-weight:700;color:#fff;">₹${p.total_paid || p.amount}</td>
                          <td style="padding:0.75rem 0.5rem">
                            <span class="telemetry-chip" style="
                              color: ${p.status === 'Paid' ? 'var(--tp-success)' : p.status === 'Refunded' ? '#f59e0b' : 'var(--tp-error)'};
                              border-color: ${p.status === 'Paid' ? 'var(--tp-success)' : p.status === 'Refunded' ? '#f59e0b' : 'var(--tp-error)'};
                            ">
                              ${p.status}
                            </span>
                          </td>
                          <td style="padding:0.75rem 0.5rem;font-size:0.75rem;color:var(--tp-text-dark-muted);">${new Date(p.created_at).toLocaleString()}</td>
                          <td style="padding:0.75rem 0.5rem;text-align:right">
                            ${p.status === 'Paid' ? `
                              <button class="tp-btn tp-btn-xs tp-btn-secondary btn-admin-refund" data-order-id="${p.id}" style="color:var(--tp-error);border-color:rgba(239,68,68,0.3)">
                                💸 Issue Refund
                              </button>
                            ` : `
                              <span style="font-size:0.75rem;color:var(--tp-text-dark-muted);">Settled</span>
                            `}
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              `}
            </div>
          </div>
        `;

      case 'overview':
        return `
          <div class="tp-card">
            <div class="tp-section-header" style="margin-bottom:1rem">
              <div>
                <h2 class="headline-md">Departmental Branches & Isolation Status</h2>
                <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Canonical branches configured in system store.</p>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:0.75rem">
              ${branches.map(b => `
                <div style="padding:0.75rem 1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);display:flex;justify-content:space-between;align-items:center">
                  <div>
                    <strong>${b.name} (${b.code})</strong>
                    <span class="mono-chip" style="margin-left:0.5rem;color:var(--tp-primary)">ID: ${b.id}</span>
                  </div>
                  <span class="telemetry-chip" style="color:var(--tp-success);border-color:var(--tp-success)">STRICT ISOLATION ACTIVE</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'subjects':
        return `
          <div class="tp-card">
            <div class="tp-section-header" style="margin-bottom:1.25rem">
              <div>
                <h2 class="headline-md">Academic Subjects Directory (${subjects.length})</h2>
                <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Verified curricula mapped by branch and semester.</p>
              </div>
            </div>
            <div style="max-height:500px;overflow-y:auto;display:flex;flex-direction:column;gap:0.5rem">
              ${subjects.map(s => `
                <div style="padding:0.75rem 1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);display:flex;justify-content:space-between;align-items:center;gap:1rem">
                  <div style="flex:1">
                    <span class="mono-chip" style="color:var(--tp-primary)">${s.code || 'ENG'}</span>
                    <strong style="margin-left:0.5rem">${s.title}</strong>
                    <span style="font-size:0.8rem;color:var(--tp-text-dark-muted);margin-left:0.75rem">Branch: ${s.branch_id?.toUpperCase()} // ${s.semester_id}</span>
                  </div>
                  <span class="mono-chip" style="color:var(--tp-text-light)">${s.credits || 4} Credits</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'users':
        return `
          <div class="tp-card">
            <div class="tp-section-header" style="margin-bottom:1.25rem">
              <div>
                <h2 class="headline-md">Registered Platform Accounts (${users.length})</h2>
                <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Manage user identities, security status, and role elevation.</p>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:0.75rem">
              ${users.map(u => `
                <div style="padding:1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
                  <div>
                    <div style="display:flex;align-items:center;gap:0.5rem">
                      <strong>${u.name}</strong>
                      <span class="mono-chip" style="color:${u.role === 'admin' ? 'var(--tp-error)' : 'var(--tp-primary)'}">${u.role.toUpperCase()}</span>
                      ${u.isVerified ? '<span class="telemetry-chip" style="color:var(--tp-success);border-color:var(--tp-success)">VERIFIED</span>' : '<span class="telemetry-chip" style="color:var(--tp-warning)">UNVERIFIED</span>'}
                    </div>
                    <div style="font-size:0.8rem;color:var(--tp-text-dark-secondary);margin-top:0.25rem">
                      Email: ${u.email} · Branch: ${u.profile?.branch_id?.toUpperCase() || 'Not set'} · Created: ${new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button class="tp-btn tp-btn-secondary tp-btn-sm toggle-role-btn" data-id="${u.id}">
                    ${u.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      case 'reports':
        return `
          <div class="tp-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
              <div>
                <h2 class="headline-md" style="margin-bottom:0.25rem;color:#fff;">TechPath Connect Moderation & Safety Queue</h2>
                <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);">
                  Review student community reports regarding spam, harassment, inappropriate content, or impersonation.
                </p>
              </div>
              <span class="mono-chip" style="color:#ef4444;">${reports.filter(r => r.status === 'pending').length} PENDING ACTION</span>
            </div>

            ${reports.length === 0 ? `
              <div style="text-align:center;padding:3rem 1rem;color:var(--tp-text-dark-muted);">
                <div style="font-size:2.5rem;margin-bottom:0.5rem;">🕊️</div>
                <h3 style="color:#fff;font-size:1.1rem;margin-bottom:0.25rem;">Moderation Queue is Clean</h3>
                <p style="font-size:0.85rem;">No student conduct reports have been submitted.</p>
              </div>
            ` : `
              <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:0.85rem;text-align:left;">
                  <thead>
                    <tr style="border-bottom:1px solid var(--tp-border-dark);color:var(--tp-text-dark-muted);">
                      <th style="padding:0.75rem 0.5rem;">Incident ID & Date</th>
                      <th style="padding:0.75rem 0.5rem;">Reported User</th>
                      <th style="padding:0.75rem 0.5rem;">Category</th>
                      <th style="padding:0.75rem 0.5rem;">Details</th>
                      <th style="padding:0.75rem 0.5rem;">Status</th>
                      <th style="padding:0.75rem 0.5rem;text-align:right;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${reports.map(r => `
                      <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                        <td style="padding:0.75rem 0.5rem;">
                          <span style="font-family:monospace;color:var(--tp-primary);font-size:0.75rem;">${r.id.slice(0, 8)}</span>
                          <div style="font-size:0.72rem;color:var(--tp-text-dark-muted);">${new Date(r.created_at || Date.now()).toLocaleDateString()}</div>
                        </td>
                        <td style="padding:0.75rem 0.5rem;">
                          <span style="font-weight:600;color:#fff;">${r.reported_id}</span>
                        </td>
                        <td style="padding:0.75rem 0.5rem;">
                          <span class="telemetry-chip" style="font-size:0.72rem;color:#ef4444;border-color:rgba(239,68,68,0.4);">
                            ${(r.category || 'Other').toUpperCase()}
                          </span>
                        </td>
                        <td style="padding:0.75rem 0.5rem;max-width:300px;color:var(--tp-text-dark-secondary);">
                          ${r.reason || 'No description provided.'}
                        </td>
                        <td style="padding:0.75rem 0.5rem;">
                          <span class="mono-chip" style="font-size:0.72rem;color:${r.status === 'resolved' ? 'var(--tp-success)' : r.status === 'dismissed' ? 'var(--tp-text-dark-muted)' : '#f59e0b'};">
                            ${(r.status || 'pending').toUpperCase()}
                          </span>
                        </td>
                        <td style="padding:0.75rem 0.5rem;text-align:right;">
                          ${r.status === 'pending' ? `
                            <button class="tp-btn tp-btn-secondary tp-btn-sm report-dismiss-btn" data-id="${r.id}" style="margin-right:0.35rem;font-size:0.75rem;padding:0.25rem 0.6rem;">
                              Dismiss
                            </button>
                            <button class="tp-btn tp-btn-primary tp-btn-sm report-resolve-btn" data-id="${r.id}" style="font-size:0.75rem;padding:0.25rem 0.6rem;background:#ef4444;">
                              Flag / Action
                            </button>
                          ` : `
                            <span style="font-size:0.75rem;color:var(--tp-text-dark-muted);">${r.status}</span>
                          `}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        `;

      case 'audit':
        return `
          <div class="tp-card">
            <h2 class="headline-md" style="margin-bottom:0.5rem">Security & GDPR Erasure Audit Trail</h2>
            <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin-bottom:1rem">
              Mandatory legal audit logging under GDPR Article 30 and institutional security guidelines.
            </p>
            ${auditLogs.length === 0 ? `
              <p style="font-size:0.85rem;color:var(--tp-text-dark-muted)">No data deletion or security incidents logged.</p>
            ` : `
              <div style="display:flex;flex-direction:column;gap:0.5rem">
                ${auditLogs.map(l => `
                  <div style="padding:0.75rem 1rem;background:rgba(239,68,68,0.04);border-left:3px solid var(--tp-error);border-radius:var(--radius-sm)">
                    <div style="display:flex;justify-content:space-between">
                      <strong style="color:var(--tp-error)">${l.reason}</strong>
                      <span style="font-size:0.75rem;color:var(--tp-text-dark-muted)">${new Date(l.timestamp).toLocaleString()}</span>
                    </div>
                    <div style="font-size:0.8rem;color:var(--tp-text-dark-secondary);margin-top:0.25rem">
                      User: ${l.email} (ID: ${l.userId})
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        `;

      case 'exams':
        return `
          <div style="display:flex;flex-direction:column;gap:1.5rem;">
            <!-- Register New Exam Form -->
            <div class="tp-card">
              <div class="tp-section-header" style="margin-bottom:1rem;">
                <div>
                  <h2 class="headline-md">Register New Standardized Exam into AI Catalog</h2>
                  <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Configure national/global standardized exams, competitive syllabi, and section blueprints for AI Roadmaps.</p>
                </div>
              </div>

              <form id="form-create-exam" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;">
                <div>
                  <label class="tp-label">Exam Full Title</label>
                  <input type="text" id="exam-new-name" class="tp-input" placeholder="e.g. AWS Certified Solutions Architect" required />
                </div>
                <div>
                  <label class="tp-label">Short Name / Code</label>
                  <input type="text" id="exam-new-short" class="tp-input" placeholder="e.g. AWS SAA-C03" required />
                </div>
                <div>
                  <label class="tp-label">Category</label>
                  <select id="exam-new-category" class="tp-input">
                    <option value="language">Language / Study Abroad (IELTS, GRE, etc.)</option>
                    <option value="government">Government / Competitive (UPSC, SSC, Banking)</option>
                    <option value="academic">Academic & University (GATE, CAT, Semester)</option>
                    <option value="certification">Professional Certification (AWS, GCP, Azure)</option>
                  </select>
                </div>
                <div>
                  <label class="tp-label">Conducting Organization</label>
                  <input type="text" id="exam-new-org" class="tp-input" placeholder="e.g. Amazon Web Services / NTA" required />
                </div>
                <div>
                  <label class="tp-label">Default Target Score</label>
                  <input type="text" id="exam-new-target" class="tp-input" placeholder="e.g. 720+ / 1000 or Band 7.5+" required />
                </div>
                <div>
                  <label class="tp-label">Scoring Metric Type</label>
                  <input type="text" id="exam-new-metric" class="tp-input" placeholder="e.g. Scaled Score (100 - 1000)" required />
                </div>
                <div>
                  <label class="tp-label">Recommended Prep (Weeks)</label>
                  <input type="number" id="exam-new-weeks" class="tp-input" value="8" min="2" max="52" required />
                </div>
                <div>
                  <label class="tp-label">Syllabus Sections (Comma Separated)</label>
                  <input type="text" id="exam-new-sections" class="tp-input" placeholder="e.g. Resilient Architectures, Security, Cost Optimization" required />
                </div>
                <div style="grid-column:1 / -1;">
                  <label class="tp-label">Syllabus Scope & Description</label>
                  <textarea id="exam-new-desc" class="tp-input" rows="2" placeholder="Official examination blueprint and syllabus summary..." required></textarea>
                </div>
                <div style="grid-column:1 / -1;display:flex;justify-content:flex-end;margin-top:0.5rem;">
                  <button type="submit" id="btn-save-exam" class="tp-btn tp-btn-primary">
                    💾 Publish Exam to AI Catalog
                  </button>
                </div>
              </form>
            </div>

            <!-- Existing Catalog Table -->
            <div class="tp-card">
              <div class="tp-section-header" style="margin-bottom:1rem;">
                <div>
                  <h2 class="headline-md">Active Standardized Exam Catalog (${exams.length})</h2>
                  <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">National & international competitive exam targets available for Roadmaps AI.</p>
                </div>
              </div>

              <div style="overflow-x:auto;">
                <table class="tp-table" style="width:100%;font-size:0.85rem;border-collapse:collapse;">
                  <thead>
                    <tr style="border-bottom:1px solid var(--tp-border-dark);text-align:left;color:var(--tp-text-dark-muted);">
                      <th style="padding:0.75rem 0.5rem">Exam / Title</th>
                      <th style="padding:0.75rem 0.5rem">Category</th>
                      <th style="padding:0.75rem 0.5rem">Conducting Org</th>
                      <th style="padding:0.75rem 0.5rem">Target Metric</th>
                      <th style="padding:0.75rem 0.5rem">Syllabus Sections</th>
                      <th style="padding:0.75rem 0.5rem">Duration</th>
                      <th style="padding:0.75rem 0.5rem">Status</th>
                      <th style="padding:0.75rem 0.5rem;text-align:right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${exams.map(ex => `
                      <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                        <td style="padding:0.75rem 0.5rem">
                          <strong style="color:#fff;">${ex.name}</strong>
                          <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);font-family:monospace;">${ex.id}</div>
                        </td>
                        <td style="padding:0.75rem 0.5rem">
                          <span class="telemetry-chip" style="text-transform:uppercase;">${ex.category || 'ACADEMIC'}</span>
                        </td>
                        <td style="padding:0.75rem 0.5rem;font-size:0.8rem;color:var(--tp-text-dark-secondary);">${ex.conducting_org || 'Standard Authority'}</td>
                        <td style="padding:0.75rem 0.5rem;font-size:0.8rem;color:var(--tp-primary);">${ex.default_target || 'High Score'}</td>
                        <td style="padding:0.75rem 0.5rem;font-size:0.8rem;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                          ${(ex.sections || []).join(', ')}
                        </td>
                        <td style="padding:0.75rem 0.5rem">${ex.recommended_duration_weeks || 8}w</td>
                        <td style="padding:0.75rem 0.5rem">
                          <span class="telemetry-chip" style="
                            color:${ex.is_active !== false ? 'var(--tp-success)' : 'var(--tp-text-dark-muted)'};
                            border-color:${ex.is_active !== false ? 'var(--tp-success)' : 'var(--tp-text-dark-muted)'};
                          ">
                            ${ex.is_active !== false ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td style="padding:0.75rem 0.5rem;text-align:right;white-space:nowrap;">
                          <button class="tp-btn tp-btn-xs tp-btn-secondary btn-toggle-exam-status" data-id="${ex.id}" data-active="${ex.is_active !== false}">
                            ${ex.is_active !== false ? '⏸️ Deactivate' : '▶️ Activate'}
                          </button>
                          ${ex.id.startsWith('exam_custom_') ? `
                            <button class="tp-btn tp-btn-xs tp-btn-secondary btn-delete-exam" data-id="${ex.id}" style="color:var(--tp-error);margin-left:0.25rem;">
                              🗑️
                            </button>
                          ` : ''}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;

      case 'system':
        return `
          <div class="tp-card">
            <h2 class="headline-md" style="margin-bottom:1rem">Runtime Engine Diagnostics</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:1rem">
              <div style="padding:1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm)">
                <span class="mono-chip" style="color:var(--tp-text-dark-muted)">APPLICATION BUILD</span>
                <div style="font-size:1.2rem;font-weight:700;color:#fff;margin-top:0.25rem">TechPath v3.0 Native ES</div>
              </div>
              <div style="padding:1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm)">
                <span class="mono-chip" style="color:var(--tp-text-dark-muted)">STORAGE ARCHITECTURE</span>
                <div style="font-size:1.2rem;font-weight:700;color:var(--tp-success);margin-top:0.25rem">IndexedDB ObjectStore</div>
              </div>
              <div style="padding:1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm)">
                <span class="mono-chip" style="color:var(--tp-text-dark-muted)">ROUTER SCHEME</span>
                <div style="font-size:1.2rem;font-weight:700;color:var(--tp-primary);margin-top:0.25rem">Client Hash SPA (280+ views)</div>
              </div>
            </div>
          </div>
        `;

      default:
        return '';
    }
  }

  static _bindTabEvents(container, {
    users, reports = [], classes = [], teacherVerifications = [], payments = [], refunds = [], teachingProfiles = [],
    quizEvents = [], exams = []
  }) {
    container.querySelectorAll('.toggle-role-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const u = users.find(user => user.id === id);
        if (u) {
          u.role = u.role === 'admin' ? 'student' : 'admin';
          localStorage.setItem('TP_USERS_DB', JSON.stringify(users));
          Toast.show({ message: `Role updated to ${u.role}!`, type: 'info' });
          AdminPage.render(container);
        }
      });
    });

    // Dismiss report
    container.querySelectorAll('.report-dismiss-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const reportId = btn.dataset.id;
        const rep = reports.find(r => r.id === reportId);
        if (rep) {
          rep.status = 'dismissed';
          rep.resolved_at = new Date().toISOString();
          await dbStore.put('user_reports', rep);
          Toast.info('Report dismissed.');
          AdminPage.render(container);
        }
      });
    });

    // Resolve report
    container.querySelectorAll('.report-resolve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const reportId = btn.dataset.id;
        const rep = reports.find(r => r.id === reportId);
        if (rep) {
          rep.status = 'resolved';
          rep.resolved_at = new Date().toISOString();
          await dbStore.put('user_reports', rep);
          Toast.success('Report resolved and incident flagged.');
          AdminPage.render(container);
        }
      });
    });

    // Teacher Verification Approvals
    container.querySelectorAll('.btn-approve-verif').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const uid = btn.dataset.uid;
        const v = teacherVerifications.find(item => item.id === id);
        if (v) {
          v.status = 'approved';
          v.reviewed_at = new Date().toISOString();
          await dbStore.put('teacher_verifications', v);

          const profile = (await dbStore.getAll('teaching_profiles')).find(p => p.user_id === uid);
          if (profile) {
            profile.verification_status = 'Teacher Verified';
            profile.updated_at = new Date().toISOString();
            await dbStore.put('teaching_profiles', profile);
          }
          Toast.success(`Teacher ${uid} officially verified! Verification badge granted.`);
          AdminPage.render(container);
        }
      });
    });

    // Teacher Verification Rejection
    container.querySelectorAll('.btn-reject-verif').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const uid = btn.dataset.uid;
        const v = teacherVerifications.find(item => item.id === id);
        if (v) {
          v.status = 'rejected';
          v.reviewed_at = new Date().toISOString();
          await dbStore.put('teacher_verifications', v);

          const profile = (await dbStore.getAll('teaching_profiles')).find(p => p.user_id === uid);
          if (profile) {
            profile.verification_status = 'Unverified';
            profile.updated_at = new Date().toISOString();
            await dbStore.put('teaching_profiles', profile);
          }
          Toast.info(`Teacher verification for ${uid} rejected.`);
          AdminPage.render(container);
        }
      });
    });

    // Class Pause/Activate Toggle
    container.querySelectorAll('.btn-toggle-class-status').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const current = btn.dataset.curr;
        const cls = classes.find(c => c.id === id);
        if (cls) {
          cls.status = current === 'active' ? 'paused' : 'active';
          cls.updated_at = new Date().toISOString();
          await dbStore.put('classes', cls);
          Toast.info(`Class status updated to "${cls.status}".`);
          AdminPage.render(container);
        }
      });
    });

    // Administrative Refund Issuer
    container.querySelectorAll('.btn-admin-refund').forEach(btn => {
      btn.addEventListener('click', async () => {
        const orderId = btn.dataset.orderId;
        if (confirm(`Authorize full administrative refund for Order #${orderId}? This will reverse the transaction and revoke classroom access.`)) {
          try {
            await PaymentGatewayEngine.processRefund(orderId, 'Admin initiated refund from Governance Console');
            Toast.success(`Order #${orderId} successfully refunded.`);
            AdminPage.render(container);
          } catch (err) {
            Toast.error(err.message || 'Refund processing failed.');
          }
        }
      });
    });

    // Quiz Scheduler: Create Scheduled Quiz Event
    const quizForm = container.querySelector('#form-create-quiz-event');
    if (quizForm) {
      quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = quizForm.querySelector('#btn-save-quiz-event');
        btn.disabled = true;
        btn.textContent = 'Publishing Event...';

        try {
          const title = quizForm.querySelector('#sched-title').value.trim();
          const branch_id = quizForm.querySelector('#sched-branch').value;
          const week_number = quizForm.querySelector('#sched-week').value;
          const month = quizForm.querySelector('#sched-month').value.trim();
          const start_at = new Date(quizForm.querySelector('#sched-start').value).toISOString();
          const end_at = new Date(quizForm.querySelector('#sched-end').value).toISOString();
          const duration_minutes = parseInt(quizForm.querySelector('#sched-duration').value, 10);
          const total_questions = parseInt(quizForm.querySelector('#sched-questions').value, 10);

          await QuizLeagueEngine.createQuizEvent({
            title,
            branch_id,
            week_number,
            month,
            start_at,
            end_at,
            duration_minutes,
            total_questions
          });

          Toast.success(`Weekly Quiz "${title}" successfully scheduled and published!`);
          AdminPage.render(container);
        } catch (err) {
          Toast.error(err.message || 'Failed to schedule quiz event.');
        } finally {
          btn.disabled = false;
          btn.textContent = '📅 Publish Scheduled Quiz Event';
        }
      });
    }

    // Exam Catalog: Register New Exam Form
    const examForm = container.querySelector('#form-create-exam');
    if (examForm) {
      examForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = examForm.querySelector('#btn-save-exam');
        btn.disabled = true;
        btn.textContent = 'Publishing Exam...';

        try {
          const name = examForm.querySelector('#exam-new-name').value.trim();
          const short_name = examForm.querySelector('#exam-new-short').value.trim();
          const category = examForm.querySelector('#exam-new-category').value;
          const conducting_org = examForm.querySelector('#exam-new-org').value.trim();
          const default_target = examForm.querySelector('#exam-new-target').value.trim();
          const score_metric = examForm.querySelector('#exam-new-metric').value.trim();
          const recommended_duration_weeks = parseInt(examForm.querySelector('#exam-new-weeks').value, 10) || 8;
          const sectionsRaw = examForm.querySelector('#exam-new-sections').value.trim();
          const sections = sectionsRaw ? sectionsRaw.split(',').map(s => s.trim()).filter(Boolean) : ['Section 1', 'Section 2'];
          const description = examForm.querySelector('#exam-new-desc').value.trim();

          await ExamRoadmapEngine.createOrUpdateExam({
            name,
            short_name,
            category,
            conducting_org,
            default_target,
            score_metric,
            recommended_duration_weeks,
            sections,
            description,
            is_active: true
          });

          Toast.success(`Standardized Exam "${name}" registered into canonical AI Catalog!`);
          AdminPage.render(container);
        } catch (err) {
          Toast.error(err.message || 'Failed to save exam to catalog.');
        } finally {
          btn.disabled = false;
          btn.textContent = '💾 Publish Exam to AI Catalog';
        }
      });
    }

    // Exam Catalog: Toggle Active / Inactive
    container.querySelectorAll('.btn-toggle-exam-status').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const currentActive = btn.dataset.active === 'true';
        const targetExam = exams.find(ex => ex.id === id);
        if (targetExam) {
          targetExam.is_active = !currentActive;
          await ExamRoadmapEngine.createOrUpdateExam(targetExam);
          Toast.info(`Exam status toggled to ${targetExam.is_active ? 'ACTIVE' : 'INACTIVE'}.`);
          AdminPage.render(container);
        }
      });
    });

    // Exam Catalog: Delete Custom Exam
    container.querySelectorAll('.btn-delete-exam').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (confirm('Permanently remove this custom exam from the AI Roadmap catalog?')) {
          await ExamRoadmapEngine.deleteCustomExam(id);
          Toast.info('Exam removed from catalog.');
          AdminPage.render(container);
        }
      });
    });
  }
}

