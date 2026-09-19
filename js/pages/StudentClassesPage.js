/**
 * TECHPATH — STUDENT CLASSES PAGE (MY CLASSES)
 * Personal dashboard for booked classes: Upcoming sessions, completed reviews,
 * refund cancellation requests, and direct access to interactive classrooms.
 */

import { authContext } from '../context/AuthContext.js';
import { ClassesEngine } from '../services/ClassesEngine.js';
import { PaymentGatewayEngine } from '../services/PaymentGatewayEngine.js';
import { ClassReviewModal } from '../components/ClassReviewModal.js';
import { PaymentModal } from '../components/PaymentModal.js';
import { Toast } from '../components/Toast.js';

export class StudentClassesPage {
  static activeTab = 'upcoming';

  static async render(container) {
    const user = authContext.getUser();
    if (!user) {
      container.innerHTML = `
        <div class="tp-card" style="text-align: center; padding: 4rem 1rem; max-width: 500px; margin: 2rem auto;">
          <h2>Please Sign In</h2>
          <p style="color: var(--tp-text-dark-secondary); margin: 1rem 0;">You need to be logged in to view your enrolled classes.</p>
          <a href="#/signin" class="tp-btn tp-btn-primary">Sign In</a>
        </div>
      `;
      return;
    }

    const bookingsData = await ClassesEngine.getStudentBookings(user.id);

    container.innerHTML = `
      <div class="tp-page" style="display: flex; flex-direction: column; gap: 1.75rem; max-width: 1100px; width: 100%;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
              STUDENT DOSSIER // MY ENGINEERING CLASSES
            </div>
            <h1 class="display-lg">My Enrolled Classes</h1>
            <p style="color: var(--tp-text-dark-secondary);">
              Manage your upcoming live sessions, access private classrooms, and leave verified teacher reviews.
            </p>
          </div>
          <a href="#/classes" class="tp-btn tp-btn-primary" style="font-size: 0.88rem;">
            + Explore More Classes
          </a>
        </div>

        <!-- Navigation Sub-tabs -->
        <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.5rem;">
          <button class="tp-btn ${this.activeTab === 'upcoming' ? 'tp-btn-primary' : 'tp-btn-secondary'} sc-tab-btn" data-tab="upcoming" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
            📅 Upcoming (${bookingsData.upcoming.length})
          </button>
          <button class="tp-btn ${this.activeTab === 'completed' ? 'tp-btn-primary' : 'tp-btn-secondary'} sc-tab-btn" data-tab="completed" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
            ✓ Completed (${bookingsData.completed.length})
          </button>
          <button class="tp-btn ${this.activeTab === 'cancelled' ? 'tp-btn-primary' : 'tp-btn-secondary'} sc-tab-btn" data-tab="cancelled" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
            💸 Refunded & Cancelled (${bookingsData.cancelled.length})
          </button>
          <button class="tp-btn ${this.activeTab === 'pending' ? 'tp-btn-primary' : 'tp-btn-secondary'} sc-tab-btn" data-tab="pending" style="font-size: 0.85rem; padding: 0.4rem 1rem;">
            ⏳ Pending Payment (${bookingsData.pending.length})
          </button>
        </div>

        <!-- Tab Body Content -->
        <div id="student-classes-tab-body">
          ${this._renderBookingsList(bookingsData[this.activeTab] || [], this.activeTab, user)}
        </div>
      </div>
    `;

    // Tab Switching Handlers
    container.querySelectorAll('.sc-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.dataset.tab;
        StudentClassesPage.render(container);
      });
    });

    this._bindActions(container, user);
  }

  static _renderBookingsList(list, tab, user) {
    if (list.length === 0) {
      return `
        <div class="tp-card" style="text-align: center; padding: 3.5rem 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📖</div>
          <h3 style="color: #fff; font-size: 1.15rem; margin-bottom: 0.35rem;">No ${tab} classes found</h3>
          <p style="color: var(--tp-text-dark-secondary); font-size: 0.85rem; max-width: 450px; margin: 0 auto 1.25rem auto;">
            ${tab === 'upcoming' ? 'You have no upcoming live sessions scheduled. Discover classes taught by peer toppers.' : `No sessions in ${tab} state.`}
          </p>
          <a href="#/classes" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem;">Explore Marketplace</a>
        </div>
      `;
    }

    return `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        ${list.map(b => `
          <div class="tp-card tp-card-glass" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem; border: 1px solid var(--tp-border-dark); padding: 1.25rem 1.5rem;">
            <div style="flex: 1; min-width: 280px;">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem;">
                <span class="telemetry-chip" style="font-size: 0.7rem; color: var(--tp-primary); border-color: var(--tp-primary);">
                  ${b.branch_id ? b.branch_id.toUpperCase() : 'ENG'}
                </span>
                <span class="mono-chip" style="font-size: 0.7rem; color: ${b.status === 'paid' ? '#10b981' : b.status === 'refunded' ? '#94a3b8' : '#f59e0b'};">
                  ${b.status.toUpperCase()}
                </span>
              </div>

              <h3 style="color: #fff; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.35rem;">
                <a href="#/classes/${b.class_id}" style="color: inherit; text-decoration: none;">${b.class_title}</a>
              </h3>

              <div style="display: flex; gap: 1rem; font-size: 0.82rem; color: var(--tp-text-dark-secondary); flex-wrap: wrap;">
                <span>👨‍🏫 Teacher: <strong style="color: #fff;">${b.teacher_name}</strong></span>
                <span>📅 Date: <strong style="color: #fff;">${b.date}</strong></span>
                <span>⏰ Time: <strong style="color: #fff;">${b.start_time} - ${b.end_time} IST</strong></span>
                <span>💰 Paid: <strong style="color: #fff;">${(b.total_amount ?? b.amount) === 0 ? 'Free' : `₹${b.total_amount ?? b.amount}`}</strong></span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
              ${b.status === 'paid' ? `
                <a href="#/classes/${b.class_id}/classroom" class="tp-btn tp-btn-primary" style="font-size: 0.85rem; padding: 0.45rem 1.25rem;">
                  Enter Classroom →
                </a>
                <button class="tp-btn tp-btn-secondary cancel-booking-btn" data-id="${b.id}" style="font-size: 0.82rem; padding: 0.45rem 0.85rem; color: #fca5a5;">
                  Request Refund
                </button>
              ` : ''}

              ${b.status === 'completed' ? `
                <a href="#/classes/${b.class_id}/classroom" class="tp-btn tp-btn-secondary" style="font-size: 0.82rem; padding: 0.45rem 0.85rem;">
                  View Materials
                </a>
                <button class="tp-btn tp-btn-primary review-class-btn" data-class-id="${b.class_id}" data-class-title="${b.class_title}" data-teacher="${b.teacher_name}" style="font-size: 0.82rem; padding: 0.45rem 1rem;">
                  ★ Leave Review
                </button>
              ` : ''}

              ${b.status === 'pending' || b.status === 'failed' ? `
                <a href="#/classes/${b.class_id}" class="tp-btn tp-btn-primary" style="font-size: 0.85rem; padding: 0.45rem 1.25rem;">
                  Retry Payment →
                </a>
              ` : ''}

              <a href="#/classes/${b.class_id}" class="tp-btn tp-btn-ghost" style="font-size: 0.82rem;">
                Class Details
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  static _bindActions(container, user) {
    // 1. Leave Review trigger
    container.querySelectorAll('.review-class-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ClassReviewModal.open({
          classId: btn.dataset.classId,
          classTitle: btn.dataset.classTitle,
          teacherName: btn.dataset.teacher,
          user,
          onSubmitted: () => StudentClassesPage.render(container)
        });
      });
    });

    // 2. Cancellation and Refund request
    container.querySelectorAll('.cancel-booking-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const bookingId = btn.dataset.id;
        const confirmRefund = confirm('Are you sure you want to cancel this booking? A refund will be processed to your original payment method.');
        if (!confirmRefund) return;

        try {
          await PaymentGatewayEngine.processRefund({
            bookingId,
            reason: 'Student requested cancellation before class start',
            initiatedBy: 'student'
          });
          Toast.success('Booking cancelled and refund processed successfully!');
          StudentClassesPage.render(container);
        } catch (err) {
          Toast.error(err.message || 'Refund processing failed.');
        }
      });
    });
  }
}
