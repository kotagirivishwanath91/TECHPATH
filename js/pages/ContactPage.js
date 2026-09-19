/**
 * TECHPATH — ACADEMIC HELP DESK & CONTACT PORTAL
 * Dedicated communication channel for technical support, syllabus inquiries,
 * partnership discussions, and support ticket issuance.
 */

import { dbStore } from '../db/store.js';
import { authContext } from '../context/AuthContext.js';
import { Toast } from '../components/Toast.js';

export class ContactPage {
  static async render(container) {
    const user = authContext.getUser();

    container.innerHTML = `
      <div class="tp-page" style="display: flex; flex-direction: column; gap: 2rem; max-width: 960px; margin: 0 auto;">
        <!-- Header -->
        <div style="text-align: center;">
          <div class="telemetry-chip" style="margin-bottom: 0.5rem; display: inline-block;">
            <span class="pulse-beacon"></span> ACADEMIC HELP DESK // OFFICIAL LIAISON
          </div>
          <h1 class="display-lg">Contact TechPath Support</h1>
          <p style="color: var(--tp-text-dark-secondary); max-width: 600px; margin: 0.5rem auto 0;">
            Have a syllabus recommendation, technical question, or partnership inquiry? Our academic operations team is here to assist.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem;" class="tp-contact-grid">
          <!-- Left: Contact Form -->
          <div class="tp-card tp-card-glass">
            <h2 class="headline-md" style="margin-bottom: 0.25rem;">Submit an Academic Inquiry</h2>
            <p style="font-size: 0.85rem; color: var(--tp-text-dark-muted); margin-bottom: 1.25rem;">
              Tickets are reviewed within 24 hours. A verified tracking receipt will be issued upon submission.
            </p>

            <form id="contact-support-form" style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="display: block; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">Your Name *</label>
                  <input type="text" id="contact-name" class="tp-input" value="${user?.full_name || ''}" placeholder="Full Name" required />
                </div>

                <div>
                  <label style="display: block; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">Email Address *</label>
                  <input type="email" id="contact-email" class="tp-input" value="${user?.email || ''}" placeholder="email@university.edu" required />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="display: block; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">Inquiry Category *</label>
                  <select id="contact-category" class="tp-input">
                    <option value="curriculum">Academic Curriculum & Syllabus</option>
                    <option value="technical">Technical Bug / Platform Issue</option>
                    <option value="3d_models">3D Models & Visualization Request</option>
                    <option value="ai_tutor">AI Notes & PDF Analyzer</option>
                    <option value="partnership">University / Industry Partnership</option>
                    <option value="privacy">Privacy & GDPR Data Request</option>
                  </select>
                </div>

                <div>
                  <label style="display: block; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">Urgency Level</label>
                  <select id="contact-priority" class="tp-input">
                    <option value="standard">Standard (within 24 hours)</option>
                    <option value="high">High (Exam / Project Deadline)</option>
                    <option value="critical">Critical (Account / Security Issue)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">Subject *</label>
                <input type="text" id="contact-subject" class="tp-input" placeholder="e.g. Requesting additional VLSI CMOS 3D models for ECE Sem 5" required />
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">Detailed Message *</label>
                <textarea id="contact-message" class="tp-input" style="height: 130px; padding: 0.75rem; resize: vertical;" placeholder="Please provide specific details regarding your inquiry, course code, or technical query..." required></textarea>
              </div>

              <div>
                <label style="display: block; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">Optional Attachment (Screenshots, Syllabus PDF)</label>
                <input type="file" id="contact-attachment" accept=".pdf,.png,.jpg,.jpeg,.txt" class="tp-input" style="padding: 0.4rem;" />
              </div>

              <div id="contact-form-status" style="display: none; padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.85rem;"></div>

              <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
                <button type="submit" id="submit-ticket-btn" class="tp-btn tp-btn-primary" style="padding: 0.6rem 1.5rem;">
                  Dispatch Support Ticket
                </button>
              </div>
            </form>
          </div>

          <!-- Right: Official Help Desk Info -->
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <!-- Help Desk Card -->
            <div class="tp-card" style="border: 1px solid var(--tp-border-dark);">
              <span class="mono-chip" style="color: var(--tp-primary); font-size: 0.75rem;">OFFICIAL HELP DESK</span>
              <h3 class="headline-md" style="font-size: 1.1rem; margin-top: 0.35rem;">Direct Communications</h3>
              
              <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1rem; font-size: 0.85rem;">
                <div>
                  <strong style="color: #fff; display: block;">Official Liaison Email:</strong>
                  <a href="mailto:kotagirivishanath91@gmail.com" style="color: var(--tp-primary); word-break: break-all;">
                    kotagirivishanath91@gmail.com
                  </a>
                </div>

                <div style="border-top: 1px solid var(--tp-border-dark); padding-top: 0.75rem;">
                  <strong style="color: #fff; display: block;">Operational Hours:</strong>
                  <span style="color: var(--tp-text-dark-secondary);">Monday – Saturday (08:00 – 20:00 IST)</span>
                </div>

                <div style="border-top: 1px solid var(--tp-border-dark); padding-top: 0.75rem;">
                  <strong style="color: #fff; display: block;">Standard SLA:</strong>
                  <span style="color: var(--tp-success);">First response within 4 hours</span>
                </div>
              </div>
            </div>

            <!-- Zero Unnecessary Data Card -->
            <div class="tp-card tp-card-glass" style="border-left: 3px solid var(--tp-info);">
              <span class="mono-chip" style="color: var(--tp-info); font-size: 0.75rem;">SECURITY PLEDGE</span>
              <p style="font-size: 0.8rem; color: var(--tp-text-dark-secondary); margin-top: 0.35rem; line-height: 1.5;">
                TechPath will NEVER request passwords, payment credentials, or government identity numbers over support tickets or email.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Form submission
    const form = container.querySelector('#contact-support-form');
    const statusBox = container.querySelector('#contact-form-status');
    const submitBtn = container.querySelector('#submit-ticket-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = container.querySelector('#contact-name').value;
      const email = container.querySelector('#contact-email').value;
      const category = container.querySelector('#contact-category').value;
      const priority = container.querySelector('#contact-priority').value;
      const subject = container.querySelector('#contact-subject').value;
      const message = container.querySelector('#contact-message').value;

      if (!name || !email || !subject || !message) {
        alert('Please fill out all required fields.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Dispatching Ticket...';

      const ticketId = 'TCK-' + Math.floor(100000 + Math.random() * 900000);

      try {
        await dbStore.insert('support_tickets', {
          id: ticketId,
          user_id: user?.id || 'usr_guest',
          user_name: name,
          user_email: email,
          category,
          priority,
          subject,
          message,
          official_email: 'kotagirivishanath91@gmail.com',
          status: 'open',
          created_at: new Date().toISOString()
        });

        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(16,185,129,0.15)';
        statusBox.style.border = '1px solid var(--tp-success)';
        statusBox.style.color = 'var(--tp-success)';
        statusBox.innerHTML = `
          <strong>✓ Support Ticket Logged: ${ticketId}</strong><br/>
          A notification has been dispatched to <em>kotagirivishanath91@gmail.com</em>. Redirecting to confirmation receipt...
        `;

        form.reset();
        Toast.show(`Ticket ${ticketId} logged successfully!`, 'success');
        setTimeout(() => {
          window.location.hash = `#/contact/thank-you?ticketId=${ticketId}`;
        }, 800);
      } catch (err) {
        statusBox.style.display = 'block';
        statusBox.style.background = 'rgba(239,68,68,0.15)';
        statusBox.style.border = '1px solid var(--tp-error)';
        statusBox.style.color = 'var(--tp-error)';
        statusBox.textContent = 'Failed to submit ticket. Please email directly to kotagirivishanath91@gmail.com.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Dispatch Support Ticket';
      }
    });
  }
}
