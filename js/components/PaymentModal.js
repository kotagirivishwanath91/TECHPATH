/**
 * TECHPATH — SECURE PAYMENT MODAL
 * Transparent fee auditing (Class Fee + Platform Fee = Total),
 * zero-credential storage, sandbox/live gateway execution, and anti-bypass signature verification.
 */

import { PaymentGatewayEngine } from '../services/PaymentGatewayEngine.js';
import { Toast } from './Toast.js';

export class PaymentModal {
  static open({ booking, order, classDetail, slot, onComplete }) {
    // Remove existing if any
    const existing = document.getElementById('tp-payment-modal-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'tp-payment-modal-root';
    root.style.cssText = `
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem; opacity: 0; transition: opacity 0.25s ease;
    `;

    root.innerHTML = `
      <div class="tp-card tp-card-glass" style="max-width: 520px; width: 100%; border: 1px solid rgba(225,29,72,0.3); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); position: relative; max-height: 90vh; overflow-y: auto;">
        <!-- Modal Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.3rem;">🔒</span>
            <div>
              <h3 class="headline-md" style="color: #fff; font-size: 1.2rem; margin: 0;">Secure Checkout Gateway</h3>
              <span class="mono-chip" style="font-size: 0.7rem; color: var(--tp-success); border-color: rgba(16,185,129,0.3);">PCI-DSS // ZERO-CREDENTIAL SAFE</span>
            </div>
          </div>
          <button id="pay-modal-close-btn" style="background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; padding: 0.2rem 0.5rem;">&times;</button>
        </div>

        <!-- Class & Slot Summary -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.25rem;">
          <h4 style="color: #fff; font-size: 1rem; font-weight: 600; margin-bottom: 0.35rem;">${classDetail.title}</h4>
          <div style="display: flex; gap: 0.75rem; font-size: 0.82rem; color: var(--tp-text-dark-secondary); flex-wrap: wrap;">
            <span>👨‍🏫 Teacher: <strong style="color: #fff;">${classDetail.teacher_name}</strong></span>
            <span>📅 Schedule: <strong style="color: #fff;">${slot.date} (${slot.start_time} - ${slot.end_time} IST)</strong></span>
            <span>⏱️ Duration: <strong style="color: #fff;">${classDetail.duration || 60} Mins</strong></span>
          </div>
        </div>

        <!-- Transparent Price Breakdown (Zero Platform / Service / External Fees) -->
        <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.4rem;">
            <span>Class price:</span>
            <span style="color: #fff; font-weight: 500;">₹${order.amount}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.4rem;">
            <span>Platform fee:</span>
            <span style="color: #10b981; font-weight: 500;">₹0</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.4rem;">
            <span>Service fee:</span>
            <span style="color: #10b981; font-weight: 500;">₹0</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.4rem;">
            <span>Convenience fee:</span>
            <span style="color: #10b981; font-weight: 500;">₹0</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.4rem;">
            <span>External fee:</span>
            <span style="color: #10b981; font-weight: 500;">₹0</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.4rem;">
            <span>Additional fees:</span>
            <span style="color: #10b981; font-weight: 500;">₹0</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.05rem; font-weight: 700; color: #fff; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.6rem; margin-top: 0.6rem;">
            <span>Total payable:</span>
            <span style="color: var(--tp-primary);">₹${order.total}</span>
          </div>
        </div>

        <!-- Payment Method Selector -->
        <div style="margin-bottom: 1.25rem;">
          <label class="tp-form-label" style="margin-bottom: 0.5rem;">Select Payment Method</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem;">
            <label class="pay-method-option" style="padding: 0.65rem; border: 1px solid var(--tp-border-dark); border-radius: 8px; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; background: rgba(255,255,255,0.02);">
              <input type="radio" name="pay-method" value="UPI" checked style="accent-color: var(--tp-primary);" />
              <div>
                <strong style="display: block; font-size: 0.85rem; color: #fff;">Instant UPI / QR</strong>
                <span style="font-size: 0.72rem; color: var(--tp-text-dark-secondary);">GPay, PhonePe, Paytm</span>
              </div>
            </label>

            <label class="pay-method-option" style="padding: 0.65rem; border: 1px solid var(--tp-border-dark); border-radius: 8px; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; background: rgba(255,255,255,0.02);">
              <input type="radio" name="pay-method" value="NetBanking" style="accent-color: var(--tp-primary);" />
              <div>
                <strong style="display: block; font-size: 0.85rem; color: #fff;">NetBanking / Cards</strong>
                <span style="font-size: 0.72rem; color: var(--tp-text-dark-secondary);">All Major Indian Banks</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Cancellation Terms Checkbox -->
        <div style="margin-bottom: 1.25rem; font-size: 0.8rem; color: var(--tp-text-dark-secondary);">
          <label style="display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer;">
            <input type="checkbox" id="pay-terms-checkbox" checked style="margin-top: 0.2rem; accent-color: var(--tp-primary);" />
            <span>
              I acknowledge the <strong style="color: #fff;">Class Cancellation Policy</strong>: Full refund eligible up to 4 hours before session start.
            </span>
          </label>
        </div>

        <!-- Live Status / Message -->
        <div id="pay-status-message" style="display: none; padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem; font-size: 0.85rem;"></div>

        <!-- Actions -->
        <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
          <button type="button" id="pay-cancel-btn" class="tp-btn tp-btn-secondary" style="font-size: 0.88rem;">Cancel</button>
          <button type="button" id="pay-submit-btn" class="tp-btn tp-btn-primary" style="font-size: 0.92rem; padding: 0.65rem 1.75rem;">
            Pay ₹${order.total} Securely →
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    requestAnimationFrame(() => root.style.opacity = '1');

    // Bind event listeners
    const closeBtn = root.querySelector('#pay-modal-close-btn');
    const cancelBtn = root.querySelector('#pay-cancel-btn');
    const submitBtn = root.querySelector('#pay-submit-btn');
    const termsCheckbox = root.querySelector('#pay-terms-checkbox');
    const msgBox = root.querySelector('#pay-status-message');

    const closeModal = () => {
      root.style.opacity = '0';
      setTimeout(() => root.remove(), 250);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    submitBtn.addEventListener('click', async () => {
      if (!termsCheckbox.checked) {
        msgBox.style.display = 'block';
        msgBox.style.background = 'rgba(239, 68, 68, 0.15)';
        msgBox.style.border = '1px solid var(--tp-error)';
        msgBox.style.color = '#fca5a5';
        msgBox.textContent = 'Please accept the cancellation terms to proceed with payment.';
        return;
      }

      const method = root.querySelector('input[name="pay-method"]:checked')?.value || 'UPI';

      submitBtn.disabled = true;
      cancelBtn.disabled = true;
      closeBtn.disabled = true;
      submitBtn.innerHTML = `<span class="pulse-beacon"></span> Processing Payment...`;

      msgBox.style.display = 'block';
      msgBox.style.background = 'rgba(56, 189, 248, 0.1)';
      msgBox.style.border = '1px solid var(--tp-info)';
      msgBox.style.color = '#7dd3fc';
      msgBox.textContent = 'Contacting payment gateway sandbox... Please do not close this window.';

      try {
        // Step 1: Execute checkout simulation (conforming to Razorpay standard flow)
        const checkoutRes = await PaymentGatewayEngine.executeSecureCheckout({
          orderId: order.orderId,
          amount: order.total,
          classTitle: classDetail.title,
          studentName: booking.student_name,
          studentEmail: booking.student_email,
          paymentMethod: method
        });

        // Step 2: Confirm signature on server/engine layer (anti-bypass rule)
        const confirmation = await PaymentGatewayEngine.confirmPayment({
          orderId: checkoutRes.orderId,
          paymentId: checkoutRes.paymentId,
          signature: checkoutRes.signature,
          bookingId: booking.id,
          paymentMethod: method
        });

        // Step 3: Success state
        msgBox.style.background = 'rgba(16, 185, 129, 0.15)';
        msgBox.style.border = '1px solid var(--tp-success)';
        msgBox.style.color = '#86efac';
        msgBox.innerHTML = `
          <strong>Payment Verified Successfully! 🎉</strong><br>
          <span style="font-size: 0.78rem;">Transaction ID: ${checkoutRes.paymentId}</span><br>
          Your seat is confirmed and your classroom is now unlocked.
        `;

        submitBtn.style.display = 'none';
        cancelBtn.style.display = 'none';

        const enterBtn = document.createElement('button');
        enterBtn.className = 'tp-btn tp-btn-primary';
        enterBtn.textContent = 'Enter Classroom Now →';
        enterBtn.style.padding = '0.65rem 1.5rem';
        enterBtn.addEventListener('click', () => {
          closeModal();
          window.location.hash = `#/classes/${classDetail.id}/classroom`;
        });
        root.querySelector('.tp-card > div:last-child').appendChild(enterBtn);

        Toast.success('Payment verified! Booking confirmed.');

        if (typeof onComplete === 'function') {
          onComplete(confirmation);
        }
      } catch (err) {
        console.error('Payment failure:', err);
        await PaymentGatewayEngine.recordPaymentFailure({
          orderId: order.orderId,
          bookingId: booking.id,
          reason: err.message
        });

        msgBox.style.background = 'rgba(239, 68, 68, 0.15)';
        msgBox.style.border = '1px solid var(--tp-error)';
        msgBox.style.color = '#fca5a5';
        msgBox.textContent = 'Payment was not completed. Your booking has not been confirmed.';

        submitBtn.disabled = false;
        cancelBtn.disabled = false;
        closeBtn.disabled = false;
        submitBtn.textContent = 'Retry Payment';
      }
    });
  }
}
