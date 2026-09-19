/**
 * TECHPATH — CLASS REVIEW MODAL
 * Gated review submission for students who have booked and attended a class.
 */

import { ClassesEngine } from '../services/ClassesEngine.js';
import { Toast } from './Toast.js';

export class ClassReviewModal {
  static open({ classId, classTitle, teacherName, user, onSubmitted }) {
    const existing = document.getElementById('tp-class-review-modal-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'tp-class-review-modal-root';
    root.style.cssText = `
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem; opacity: 0; transition: opacity 0.25s ease;
    `;

    root.innerHTML = `
      <div class="tp-card tp-card-glass" style="max-width: 500px; width: 100%; border: 1px solid rgba(225,29,72,0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div>
            <h3 class="headline-md" style="color: #fff; margin: 0; font-size: 1.2rem;">Leave Student Review</h3>
            <p style="font-size: 0.8rem; color: var(--tp-text-dark-secondary); margin-top: 0.2rem;">For ${classTitle} &bull; ${teacherName}</p>
          </div>
          <button id="rev-modal-close-btn" style="background: none; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; padding: 0.2rem 0.5rem;">&times;</button>
        </div>

        <form id="class-review-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- Star Rating -->
          <div>
            <label class="tp-form-label">Overall Rating (1 to 5 Stars) *</label>
            <div id="star-rating-picker" style="display: flex; gap: 0.5rem; font-size: 1.8rem; cursor: pointer;">
              <span data-val="1" style="color: #f59e0b;">★</span>
              <span data-val="2" style="color: #f59e0b;">★</span>
              <span data-val="3" style="color: #f59e0b;">★</span>
              <span data-val="4" style="color: #f59e0b;">★</span>
              <span data-val="5" style="color: #f59e0b;">★</span>
            </div>
            <input type="hidden" id="rev-rating" value="5" />
          </div>

          <!-- Written Review -->
          <div>
            <label class="tp-form-label">Your Feedback & Experience *</label>
            <textarea id="rev-text" class="tp-input" rows="4" placeholder="How clearly did the teacher explain concepts? Did you find the exercises and Q&A helpful?" required></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" id="rev-cancel-btn" class="tp-btn tp-btn-secondary">Cancel</button>
            <button type="submit" id="rev-submit-btn" class="tp-btn tp-btn-primary">Submit Verified Review</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(root);
    requestAnimationFrame(() => root.style.opacity = '1');

    const closeModal = () => {
      root.style.opacity = '0';
      setTimeout(() => root.remove(), 250);
    };

    root.querySelector('#rev-modal-close-btn').addEventListener('click', closeModal);
    root.querySelector('#rev-cancel-btn').addEventListener('click', closeModal);

    // Interactive star picker
    const stars = root.querySelectorAll('#star-rating-picker span');
    const ratingInput = root.querySelector('#rev-rating');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.dataset.val, 10);
        ratingInput.value = val;
        stars.forEach(s => {
          const sVal = parseInt(s.dataset.val, 10);
          s.style.color = sVal <= val ? '#f59e0b' : 'rgba(255,255,255,0.2)';
        });
      });
    });

    const form = root.querySelector('#class-review-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const rating = parseInt(ratingInput.value, 10);
      const text = root.querySelector('#rev-text').value.trim();

      if (!text) {
        Toast.error('Please write a short review.');
        return;
      }

      try {
        await ClassesEngine.submitReview({
          classId,
          studentId: user.id,
          studentName: user.name || user.profile?.full_name,
          studentTechPathId: user.profile?.techpath_id,
          rating,
          reviewText: text
        });

        Toast.success('Review submitted successfully! Thank you for your feedback.');
        closeModal();
        if (typeof onSubmitted === 'function') onSubmitted();
      } catch (err) {
        Toast.error(err.message || 'Failed to submit review.');
      }
    });
  }
}
