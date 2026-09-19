/**
 * TECHPATH — CREATE & EDIT CLASS MODAL
 * Comprehensive class authoring wizard for student teachers with complete academic metadata:
 * Department, Branch, Specialization, Semester, Subject, Topic, Difficulty, Class Type,
 * Language, Career Relevance, transparent live fee calculation, and atomic publishing.
 */

import { ClassesEngine } from '../services/ClassesEngine.js';
import { PaymentGatewayEngine } from '../services/PaymentGatewayEngine.js';
import { Toast } from './Toast.js';

export class CreateClassModal {
  static open(user, onSaved, existingClass = null) {
    const existing = document.getElementById('tp-create-class-modal-root');
    if (existing) existing.remove();

    const root = document.createElement('div');
    root.id = 'tp-create-class-modal-root';
    root.style.cssText = `
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      padding: 1rem; opacity: 0; transition: opacity 0.25s ease;
    `;

    const isEdit = Boolean(existingClass && existingClass.id);
    const userBranch = (existingClass?.branch_id || user?.profile?.branch_id || 'cse').toLowerCase();
    const currentSem = existingClass?.semester_id || 'sem_3';

    root.innerHTML = `
      <div class="tp-card tp-card-glass" style="max-width: 820px; width: 100%; border: 1px solid rgba(225,29,72,0.3); max-height: 92vh; overflow-y: auto;">
        
        <!-- Modal Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.35rem;">
              TEACHER STUDIO // ${isEdit ? 'EDIT CLASS' : 'AUTHOR CLASS'}
            </div>
            <h3 class="headline-md" style="color: #fff; margin: 0;">
              ${isEdit ? 'Edit Engineering Class Listing' : 'Author & Publish a New Engineering Class'}
            </h3>
            <p style="color: var(--tp-text-dark-secondary); font-size: 0.82rem; margin: 0.2rem 0 0 0;">
              Classes automatically map into all related TechPath discovery groups upon publishing.
            </p>
          </div>
          <button id="create-modal-close-btn" style="background: none; border: none; color: #94a3b8; font-size: 1.6rem; cursor: pointer; padding: 0.2rem 0.5rem;" aria-label="Close modal">&times;</button>
        </div>

        <form id="create-class-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
          
          <!-- 1. ACADEMIC TAXONOMY & METADATA -->
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-size: 0.85rem; font-weight: 700; color: #fda4af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">
              1. Academic Taxonomy & Classification
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              
              <!-- Department -->
              <div>
                <label class="tp-form-label">Department *</label>
                <select id="cc-dept" class="tp-input" required>
                  ${ClassesEngine.DEPARTMENTS.map(d => `
                    <option value="${d.id}" ${(existingClass?.department_id || 'eng') === d.id ? 'selected' : ''}>
                      ${d.name} (${d.code})
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Branch -->
              <div>
                <label class="tp-form-label">Engineering Branch *</label>
                <select id="cc-branch" class="tp-input" required>
                  ${ClassesEngine.BRANCHES.map(b => `
                    <option value="${b.id}" ${userBranch === b.id ? 'selected' : ''}>
                      ${b.name} (${b.code})
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Specialization -->
              <div>
                <label class="tp-form-label">Specialization / Track</label>
                <input type="text" id="cc-specialization" class="tp-input" placeholder="e.g. AI & Machine Learning, VLSI, Data Science" value="${existingClass?.specialization || ''}" />
              </div>

              <!-- Semester -->
              <div>
                <label class="tp-form-label">Academic Semester *</label>
                <select id="cc-semester" class="tp-input" required>
                  ${ClassesEngine.SEMESTERS.map(s => `
                    <option value="${s.id}" ${currentSem === s.id ? 'selected' : ''}>
                      Semester ${s.number}
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Subject -->
              <div>
                <label class="tp-form-label">Curriculum Subject *</label>
                <input type="text" id="cc-subject" class="tp-input" placeholder="e.g. Machine Learning, Data Structures" value="${existingClass?.subject || ''}" required />
              </div>

              <!-- Topic -->
              <div>
                <label class="tp-form-label">Specific Unit / Topic *</label>
                <input type="text" id="cc-topic" class="tp-input" placeholder="e.g. Neural Networks & Backprop" value="${existingClass?.topic || ''}" required />
              </div>

              <!-- Difficulty -->
              <div>
                <label class="tp-form-label">Difficulty / Level *</label>
                <select id="cc-difficulty" class="tp-input" required>
                  <option value="beginner" ${(existingClass?.difficulty || existingClass?.student_level) === 'beginner' ? 'selected' : ''}>Beginner (Foundations)</option>
                  <option value="intermediate" ${!(existingClass?.difficulty || existingClass?.student_level) || (existingClass?.difficulty || existingClass?.student_level) === 'intermediate' ? 'selected' : ''}>Intermediate (Core Degree)</option>
                  <option value="advanced" ${(existingClass?.difficulty || existingClass?.student_level) === 'advanced' ? 'selected' : ''}>Advanced (Exam & Industry Rigor)</option>
                </select>
              </div>

              <!-- Class Type -->
              <div>
                <label class="tp-form-label">Class Type *</label>
                <select id="cc-class-type" class="tp-input" required>
                  <option value="live_online" ${(existingClass?.class_type || 'live_online') === 'live_online' ? 'selected' : ''}>Live Interactive Online</option>
                  <option value="workshop" ${existingClass?.class_type === 'workshop' ? 'selected' : ''}>Intensive Workshop</option>
                  <option value="interactive_lab" ${existingClass?.class_type === 'interactive_lab' ? 'selected' : ''}>Interactive Lab / Simulation</option>
                  <option value="exam_crash_course" ${existingClass?.class_type === 'exam_crash_course' ? 'selected' : ''}>Exam Crash Course</option>
                  <option value="1on1_tutoring" ${existingClass?.class_type === '1on1_tutoring' ? 'selected' : ''}>1-on-1 Mentorship Session</option>
                </select>
              </div>

              <!-- Language -->
              <div>
                <label class="tp-form-label">Taught Language *</label>
                <input type="text" id="cc-language" class="tp-input" placeholder="e.g. English, Hindi, Hinglish, Tamil" value="${existingClass?.language || 'English'}" required />
              </div>

              <!-- Career Relevance -->
              <div>
                <label class="tp-form-label">Career Target / Relevance</label>
                <input type="text" id="cc-career" class="tp-input" placeholder="e.g. ML Engineer, Software Engineer" value="${existingClass?.career_relevance || ''}" />
              </div>

            </div>
          </div>

          <!-- 2. TITLE, DESCRIPTION & OUTCOMES -->
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-size: 0.85rem; font-weight: 700; color: #fda4af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">
              2. Class Details & Learning Syllabus
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div>
                <label class="tp-form-label">Class Title *</label>
                <input type="text" id="cc-title" class="tp-input" placeholder="e.g. Introduction to Neural Networks & Backpropagation" value="${existingClass?.title || ''}" required />
              </div>

              <div>
                <label class="tp-form-label">Course Description *</label>
                <textarea id="cc-description" class="tp-input" rows="3" placeholder="Describe the topics covered, pedagogical approach, and who should attend..." required>${existingClass?.description || ''}</textarea>
              </div>

              <div>
                <label class="tp-form-label">What Students Will Learn (One per line) *</label>
                <textarea id="cc-outcomes" class="tp-input" rows="3" placeholder="Neural activation functions & gradient descent&#10;Feedforward network architecture&#10;Hands-on implementation of backpropagation in Python" required>${Array.isArray(existingClass?.what_will_learn) ? existingClass.what_will_learn.join('\n') : (existingClass?.what_will_learn || '')}</textarea>
              </div>

              <div>
                <label class="tp-form-label">Prerequisites</label>
                <input type="text" id="cc-prereq" class="tp-input" placeholder="e.g. Basic Calculus and Python familiarity" value="${existingClass?.prerequisites || ''}" />
              </div>
            </div>
          </div>

          <!-- 3. LOGISTICS, DURATION & PRICING -->
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-size: 0.85rem; font-weight: 700; color: #fda4af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">
              3. Logistics, Duration & Pricing
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <div>
                <label class="tp-form-label">Session Duration (Mins) *</label>
                <select id="cc-duration" class="tp-input">
                  <option value="45" ${existingClass?.duration === 45 ? 'selected' : ''}>45 Minutes</option>
                  <option value="60" ${!existingClass?.duration || existingClass?.duration === 60 ? 'selected' : ''}>60 Minutes (1 Hour)</option>
                  <option value="75" ${existingClass?.duration === 75 ? 'selected' : ''}>75 Minutes</option>
                  <option value="90" ${existingClass?.duration === 90 ? 'selected' : ''}>90 Minutes (1.5 Hours)</option>
                  <option value="120" ${existingClass?.duration === 120 ? 'selected' : ''}>120 Minutes (2 Hours)</option>
                </select>
              </div>

              <div>
                <label class="tp-form-label">Max Students *</label>
                <input type="number" id="cc-max-students" class="tp-input" value="${existingClass?.max_students || 15}" min="1" max="60" required />
              </div>

              <div>
                <label class="tp-form-label">Your Tuition (₹ INR) *</label>
                <input type="number" id="cc-price" class="tp-input" value="${existingClass?.price !== undefined ? existingClass.price : 300}" min="0" step="10" required />
              </div>
            </div>

            <!-- Single Source of Truth Price Preview (Zero Platform Fees) -->
            <div id="cc-fee-preview" style="font-size: 0.82rem; color: var(--tp-text-dark-secondary); background: rgba(0,0,0,0.3); padding: 0.75rem 0.9rem; border-radius: 6px; border: 1px solid var(--tp-border-dark); margin-top: 1rem;">
              <div>Class price: <strong>₹${existingClass?.price !== undefined ? existingClass.price : 300}</strong> &bull; Additional fees: <strong>₹0</strong> &bull; Student pays: <strong style="color: var(--tp-primary);">₹${existingClass?.price !== undefined ? existingClass.price : 300}</strong></div>
              <div style="font-size: 0.76rem; color: #10b981; margin-top: 0.35rem;">Students will be charged the published class price. TechPath does not add an additional platform fee.</div>
            </div>
          </div>

          <!-- 4. SCHEDULE AVAILABILITY (If creating new class) -->
          ${!isEdit ? `
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: var(--radius-md); padding: 1.25rem;">
              <div style="font-size: 0.85rem; font-weight: 700; color: #fda4af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">
                4. Initial Session Slot
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem;">
                <div>
                  <label class="tp-form-label">Date *</label>
                  <input type="date" id="cc-slot-date" class="tp-input" required />
                </div>
                <div>
                  <label class="tp-form-label">Start Time *</label>
                  <input type="time" id="cc-slot-start" class="tp-input" value="18:00" required />
                </div>
                <div>
                  <label class="tp-form-label">End Time *</label>
                  <input type="time" id="cc-slot-end" class="tp-input" value="19:00" required />
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Form Actions -->
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem;">
            <button type="button" id="cc-cancel-btn" class="tp-btn tp-btn-secondary">Cancel</button>
            <button type="submit" id="cc-submit-btn" class="tp-btn tp-btn-primary" style="padding: 0.75rem 2rem; font-weight: 600;">
              ${isEdit ? '💾 Save & Update Mappings' : '🚀 Publish Class'}
            </button>
          </div>

        </form>
      </div>
    `;

    document.body.appendChild(root);
    requestAnimationFrame(() => root.style.opacity = '1');

    // Default slot date to tomorrow
    if (!isEdit) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateInput = root.querySelector('#cc-slot-date');
      if (dateInput) dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    // Fee calculation preview
    const priceInput = root.querySelector('#cc-price');
    const feePreview = root.querySelector('#cc-fee-preview');
    if (priceInput && feePreview) {
      priceInput.addEventListener('input', () => {
        const fees = PaymentGatewayEngine.calculateFees(priceInput.value);
        feePreview.innerHTML = `
          <div>Class price: <strong>₹${fees.classFee}</strong> &bull; Additional fees: <strong>₹0</strong> &bull; Student pays: <strong style="color: var(--tp-primary);">₹${fees.totalAmount}</strong></div>
          <div style="font-size: 0.76rem; color: #10b981; margin-top: 0.35rem;">Students will be charged the published class price. TechPath does not add an additional platform fee.</div>
        `;
      });
    }

    const closeModal = () => {
      root.style.opacity = '0';
      setTimeout(() => root.remove(), 250);
    };

    root.querySelector('#create-modal-close-btn').addEventListener('click', closeModal);
    root.querySelector('#cc-cancel-btn').addEventListener('click', closeModal);

    // Form Submission
    const form = root.querySelector('#create-class-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = root.querySelector('#cc-submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = isEdit ? 'Saving Updates...' : 'Publishing Class...';

      try {
        const classData = {
          title: root.querySelector('#cc-title').value.trim(),
          department_id: root.querySelector('#cc-dept').value,
          department_name: root.querySelector('#cc-dept').options[root.querySelector('#cc-dept').selectedIndex].text.split('(')[0].trim(),
          branch_id: root.querySelector('#cc-branch').value,
          semester_id: root.querySelector('#cc-semester').value,
          specialization: root.querySelector('#cc-specialization').value.trim(),
          subject: root.querySelector('#cc-subject').value.trim(),
          topic: root.querySelector('#cc-topic').value.trim(),
          difficulty: root.querySelector('#cc-difficulty').value,
          student_level: root.querySelector('#cc-difficulty').value,
          class_type: root.querySelector('#cc-class-type').value,
          language: root.querySelector('#cc-language').value.trim(),
          career_relevance: root.querySelector('#cc-career').value.trim(),
          description: root.querySelector('#cc-description').value.trim(),
          what_will_learn: root.querySelector('#cc-outcomes').value.split('\n').map(s => s.trim()).filter(Boolean),
          prerequisites: root.querySelector('#cc-prereq').value.trim(),
          duration: parseInt(root.querySelector('#cc-duration').value, 10),
          max_students: parseInt(root.querySelector('#cc-max-students').value, 10),
          price: parseFloat(root.querySelector('#cc-price').value),
          currency: 'INR'
        };

        let resultClass;
        if (isEdit) {
          resultClass = await ClassesEngine.updateClass(existingClass.id, user.id, classData);
          Toast.success('Class updated and group mappings recalculated!');
          closeModal();
          if (typeof onSaved === 'function') onSaved(resultClass);
        } else {
          const initialSlot = {
            date: root.querySelector('#cc-slot-date').value,
            start_time: root.querySelector('#cc-slot-start').value,
            end_time: root.querySelector('#cc-slot-end').value,
            timezone: 'IST'
          };

          resultClass = await ClassesEngine.createClass(user.id, classData, [initialSlot]);
          Toast.success('Class published successfully into TechPath Classes!');
          
          // Render the post-publish confirmation view
          this._renderPublishedConfirmation(root, resultClass, user, onSaved);
        }
      } catch (err) {
        console.error('Error in class publish:', err);
        Toast.error(err.message || 'Failed to save class.');
        submitBtn.disabled = false;
        submitBtn.textContent = isEdit ? '💾 Save & Update Mappings' : '🚀 Publish Class';
      }
    });
  }

  /**
   * Requirement 11: Dedicated post-publish confirmation modal displaying the
   * exact discovery hierarchy where the class is published with fast action buttons.
   */
  static _renderPublishedConfirmation(modalRoot, publishedClass, user, onSaved) {
    const semNumber = publishedClass.semester_id.replace('sem_', '');
    const branchUpper = publishedClass.branch_id.toUpperCase();

    modalRoot.innerHTML = `
      <div class="tp-card tp-card-glass" style="max-width: 650px; width: 100%; border: 1px solid rgba(16,185,129,0.4); padding: 2.25rem; text-align: center;">
        
        <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(16,185,129,0.15); border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1.25rem auto;">
          ✅
        </div>

        <h2 style="color: #fff; font-size: 1.6rem; font-weight: 800; margin-bottom: 0.35rem;">
          Published Successfully!
        </h2>
        <p style="color: var(--tp-text-dark-secondary); font-size: 0.95rem; margin-bottom: 1.5rem;">
          Your class is live and discoverable through all related TechPath Classes categories.
        </p>

        <!-- Class Meta Badge -->
        <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-md); padding: 1.25rem; text-align: left; margin-bottom: 1.75rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #38bdf8; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.35rem;">
            Class Title
          </div>
          <h3 style="color: #fff; font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">
            ${publishedClass.title}
          </h3>

          <div style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 0.5rem;">
            Published Under Related Groups:
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.85rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span style="color: #94a3b8; width: 110px;">Department:</span>
              <strong style="color: #fff;">${publishedClass.department_name || 'Engineering & Technology'}</strong>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span style="color: #94a3b8; width: 110px;">Branch:</span>
              <span class="telemetry-chip" style="font-size: 0.72rem; color: var(--tp-primary); border-color: var(--tp-primary);">${branchUpper}</span>
            </div>
            ${publishedClass.specialization ? `
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <span style="color: #94a3b8; width: 110px;">Specialization:</span>
                <strong style="color: #cbd5e1;">${publishedClass.specialization}</strong>
              </div>
            ` : ''}
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span style="color: #94a3b8; width: 110px;">Semester:</span>
              <strong style="color: #cbd5e1;">Semester ${semNumber}</strong>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span style="color: #94a3b8; width: 110px;">Subject:</span>
              <strong style="color: #cbd5e1;">${publishedClass.subject}</strong>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span style="color: #94a3b8; width: 110px;">Topic:</span>
              <strong style="color: #38bdf8;">${publishedClass.topic}</strong>
            </div>
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem;">
          <a href="#/classes/${publishedClass.id}" id="confirm-view-class-btn" class="tp-btn tp-btn-secondary" style="font-size: 0.88rem; padding: 0.65rem;">
            🔍 View Class Page
          </a>
          <a href="#/classes?branch=${publishedClass.branch_id}&semester=${publishedClass.semester_id}" id="confirm-view-tp-btn" class="tp-btn tp-btn-primary" style="font-size: 0.88rem; padding: 0.65rem;">
            🌐 View in TechPath Classes
          </a>
        </div>

        <div style="display: flex; justify-content: center; gap: 1rem;">
          <button id="confirm-edit-btn" class="tp-btn tp-btn-ghost" style="font-size: 0.82rem;">
            ✏️ Edit Class
          </button>
          <button id="confirm-pause-btn" class="tp-btn tp-btn-ghost" style="font-size: 0.82rem;">
            ⏸️ Pause Class
          </button>
          <button id="confirm-done-btn" class="tp-btn tp-btn-ghost" style="font-size: 0.82rem; color: #94a3b8;">
            Done &times;
          </button>
        </div>

      </div>
    `;

    const close = () => {
      modalRoot.style.opacity = '0';
      setTimeout(() => modalRoot.remove(), 250);
      if (typeof onSaved === 'function') onSaved(publishedClass);
    };

    modalRoot.querySelector('#confirm-done-btn')?.addEventListener('click', close);
    modalRoot.querySelector('#confirm-view-class-btn')?.addEventListener('click', close);
    modalRoot.querySelector('#confirm-view-tp-btn')?.addEventListener('click', close);

    modalRoot.querySelector('#confirm-edit-btn')?.addEventListener('click', () => {
      CreateClassModal.open(user, onSaved, publishedClass);
    });

    modalRoot.querySelector('#confirm-pause-btn')?.addEventListener('click', async () => {
      const pauseBtn = modalRoot.querySelector('#confirm-pause-btn');
      pauseBtn.disabled = true;
      try {
        const nextStatus = await ClassesEngine.toggleClassStatus(publishedClass.id, user.id);
        Toast.success(`Class is now ${nextStatus.toUpperCase()}`);
        pauseBtn.textContent = nextStatus === 'PAUSED' ? '▶️ Resume Class' : '⏸️ Pause Class';
        pauseBtn.disabled = false;
      } catch (err) {
        Toast.error(err.message);
        pauseBtn.disabled = false;
      }
    });
  }
}
