/**
 * TECHPATH — SUPPORT, HELP DESK & SYSTEM HEALTH
 * Real-time diagnostic telemetry, ticket submission, issue tracking, and contact center
 */
import { Toast } from '../components/Toast.js';

export class SupportPage {
  static tickets = [
    {
      id: 'TICK-8041',
      subject: 'Clarification on GATE 2026 Virtual Calculator keyboard shortcuts',
      category: 'Exams',
      priority: 'Normal',
      status: 'Resolved',
      created: '2026-03-12',
      response: 'The GATE virtual calculator complies with TCS iON standards. Only mouse clicks are enabled during real exams.'
    }
  ];

  static async render(container) {
    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1100px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom:0.5rem">
              <span class="pulse-beacon"></span> 24/7 ENGINEERING HELP DESK
            </div>
            <h1 class="display-lg">Technical Support & Status</h1>
            <p style="color:var(--tp-text-dark-secondary)">Submit academic or platform queries, review past tickets, and inspect real-time system health.</p>
          </div>
          <div style="display:flex;align-items:center;gap:0.75rem">
            <span class="telemetry-chip" style="color:var(--tp-success);border-color:var(--tp-success)">
              <span class="pulse-beacon" style="background:var(--tp-success)"></span> ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>

        <!-- System Diagnostic Health Bar -->
        <div class="tp-card tp-card-glass" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;">
          <div>
            <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);margin-bottom:0.25rem">INDEXEDDB STORAGE ENGINE</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--tp-success)">ONLINE (HEALTHY)</div>
          </div>
          <div>
            <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);margin-bottom:0.25rem">THREE.JS WEBGL RENDERER</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--tp-success)">HARDWARE ACCELERATED</div>
          </div>
          <div>
            <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);margin-bottom:0.25rem">SERVICE WORKER CACHE</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--tp-success)">ACTIVE (v3.0.1)</div>
          </div>
          <div>
            <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);margin-bottom:0.25rem">AVERAGE RESOLUTION TIME</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--tp-primary)">&lt; 2.4 HOURS</div>
          </div>
        </div>

        <!-- Grid: Submit Ticket Form + Ticket History -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
          
          <!-- Submit Form -->
          <div class="tp-card">
            <h2 class="headline-md" style="margin-bottom:1rem">Submit Support Ticket</h2>
            <form id="support-ticket-form" style="display:flex;flex-direction:column;gap:1rem">
              <div>
                <label class="tp-label">Category *</label>
                <select id="ticket-category" class="tp-input" required>
                  <option value="Curriculum & Syllabus">Curriculum & Syllabus Query</option>
                  <option value="3D Hardware Lab">3D Hardware Lab Simulation</option>
                  <option value="Mock Interview / Resume">Mock Interview / Resume Engine</option>
                  <option value="GATE / Exam Preparation">GATE / Exam Preparation</option>
                  <option value="Account & Privacy">Account, Data & Privacy</option>
                  <option value="Bug Report">Technical Bug Report</option>
                </select>
              </div>

              <div>
                <label class="tp-label">Priority Level</label>
                <select id="ticket-priority" class="tp-input">
                  <option value="Normal">Normal — Standard Inquiry</option>
                  <option value="High">High — Exam / Mock Test Blocker</option>
                  <option value="Urgent">Urgent — Account or Data Integrity</option>
                </select>
              </div>

              <div>
                <label class="tp-label">Subject / Issue Summary *</label>
                <input type="text" id="ticket-subject" class="tp-input" placeholder="e.g. Issue viewing Cache Controller in 3D Lab" required />
              </div>

              <div>
                <label class="tp-label">Detailed Description & Steps to Reproduce *</label>
                <textarea id="ticket-desc" class="tp-input" rows="4" placeholder="Provide complete context to assist our engineering team..." required></textarea>
              </div>

              <div style="display:flex;justify-content:flex-end">
                <button type="submit" class="tp-btn tp-btn-primary">Dispatch Support Ticket</button>
              </div>
            </form>
          </div>

          <!-- Existing Tickets -->
          <div class="tp-card">
            <div class="tp-section-header" style="margin-bottom:1rem">
              <h2 class="headline-md">Your Support History</h2>
              <span class="mono-chip" style="color:var(--tp-primary)">${this.tickets.length} TICKETS</span>
            </div>

            <div style="display:flex;flex-direction:column;gap:1rem">
              ${this.tickets.map(t => `
                <div style="padding:1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-md)">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem">
                    <span class="mono-chip" style="color:var(--tp-primary)">${t.id}</span>
                    <span class="telemetry-chip" style="color:${t.status === 'Resolved' ? 'var(--tp-success)' : 'var(--tp-warning)'};border-color:${t.status === 'Resolved' ? 'var(--tp-success)' : 'var(--tp-warning)'}">
                      ${t.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 style="font-size:0.95rem;margin:0.25rem 0">${t.subject}</h4>
                  <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);margin-bottom:0.5rem">
                    ${t.category} · Priority: ${t.priority} · Date: ${t.created}
                  </div>
                  ${t.response ? `
                    <div style="padding:0.6rem 0.75rem;background:rgba(34,197,94,0.06);border-left:2px solid var(--tp-success);font-size:0.82rem;color:var(--tp-text-light);line-height:1.4">
                      <strong>Support Response:</strong> ${t.response}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    `;

    const form = container.querySelector('#support-ticket-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const subject = container.querySelector('#ticket-subject').value.trim();
      const category = container.querySelector('#ticket-category').value;
      const priority = container.querySelector('#ticket-priority').value;

      const newId = `TICK-${Math.floor(1000 + Math.random() * 9000)}`;
      this.tickets.unshift({
        id: newId,
        subject,
        category,
        priority,
        status: 'Open',
        created: new Date().toISOString().split('T')[0],
        response: 'Ticket received by engineering support queue. Typical response within 2 hours.'
      });

      Toast.show({ message: `Support Ticket ${newId} created successfully!`, type: 'success' });
      SupportPage.render(container);
    });
  }
}
