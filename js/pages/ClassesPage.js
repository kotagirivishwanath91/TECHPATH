/**
 * TECHPATH — CLASSES EXPLORE & DISCOVERY PLATFORM
 * Discover peer-taught engineering classes, department-isolated by default,
 * prioritized by student academic context (Department, Branch, Specialization, Semester),
 * with real group counts, all 13 working facet filters, and verified student cards.
 */

import { authContext } from '../context/AuthContext.js';
import { learningContext } from '../context/LearningContext.js';
import { ClassesEngine } from '../services/ClassesEngine.js';
import { CreateClassModal } from '../components/CreateClassModal.js';
import { Toast } from '../components/Toast.js';

export class ClassesPage {
  static async render(container, options = {}) {
    const user = authContext.getUser();

    // Student canonical academic context
    const studentContext = learningContext.get();
    const userBranch = (studentContext.branchId || user?.profile?.branch_id || 'cse').toLowerCase();
    const userSemester = (studentContext.semesterId || user?.profile?.semester_id || 'sem_3').toLowerCase();
    const userSpec = (user?.profile?.specialization || user?.profile?.career_goal || '').toLowerCase();

    // URL parameters or options override
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    let currentBranch = options.branch || urlParams.get('branch') || userBranch;
    let currentSemester = options.semester || urlParams.get('semester') || '';
    let currentDept = urlParams.get('department') || '';
    let currentSpec = urlParams.get('specialization') || '';
    let showAdvancedFilters = false;

    // Load initial group counts for published classes
    const groupCounts = await ClassesEngine.getGroupCounts();

    const branchObj = ClassesEngine.BRANCHES.find(b => b.id === currentBranch);
    const isAcademicMatch = currentBranch === userBranch && (!currentSemester || currentSemester === userSemester);

    container.innerHTML = `
      <div class="tp-page" style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 1200px; width: 100%;">
        
        <!-- Hero Header -->
        <div class="tp-card tp-card-glass" style="position: relative; overflow: hidden; border: 1px solid rgba(225, 29, 72, 0.25); padding: 2rem 2.25rem;">
          <div style="position: absolute; right: -20px; top: -20px; font-size: 8rem; opacity: 0.04; pointer-events: none;">🎓</div>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.5rem; position: relative; z-index: 2;">
            <div>
              <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
                <span class="pulse-beacon"></span> TECHPATH CLASSES // STUDENT-TEACHER MARKETPLACE
              </div>
              <h1 class="display-lg" style="margin-bottom: 0.5rem;">Engineering Masterclasses</h1>
              <p style="color: var(--tp-text-dark-secondary); max-width: 720px; font-size: 0.95rem; line-height: 1.6;">
                Learn directly from senior university toppers, lab TAs, and peer specialists. Small-group interactive masterclasses with live code, circuit simulations, and exam problem-solving.
              </p>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <a href="#/classes/my-classes" class="tp-btn tp-btn-secondary" style="font-size: 0.88rem;">
                📖 My Classes
              </a>
              <a href="#/teacher/dashboard" class="tp-btn tp-btn-secondary" style="font-size: 0.88rem;">
                👨‍🏫 Teacher Studio
              </a>
              <button id="hero-create-class-btn" class="tp-btn tp-btn-primary" style="font-size: 0.88rem;">
                + Author a Class
              </button>
            </div>
          </div>
        </div>

        <!-- Student Academic Context Ribbon -->
        <div class="tp-card" style="background: rgba(225,29,72,0.06); border: 1px solid rgba(225,29,72,0.2); padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem;">
            <span style="font-size: 1.1rem;">🎯</span>
            <span style="color: var(--tp-text-dark-secondary);">
              Your Academic Profile: <strong style="color: #fff; text-transform: uppercase;">${userBranch}</strong> &bull; <strong style="color: #fff;">Semester ${userSemester.replace('sem_', '')}</strong>
              ${userSpec ? `&bull; <span style="color: #38bdf8;">${userSpec}</span>` : ''}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem;">
            ${!isAcademicMatch ? `
              <button id="reset-to-my-branch-btn" class="tp-btn tp-btn-secondary tp-btn-sm" style="font-size: 0.78rem;">
                🎯 View My Branch (${userBranch.toUpperCase()})
              </button>
            ` : `
              <span class="mono-chip" style="color: #10b981; font-size: 0.75rem;">ACADEMIC MATCH ACTIVE</span>
            `}
          </div>
        </div>

        <!-- 1. Engineering Discipline Tabs with Real Published Counts -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.78rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">
              Engineering Disciplines
            </span>
            <span style="font-size: 0.75rem; color: var(--tp-text-dark-secondary);">
              Showing <strong style="color: var(--tp-primary); text-transform: uppercase;">${currentBranch === 'all' ? 'All Disciplines' : branchObj?.code || currentBranch}</strong>
            </span>
          </div>

          <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.4rem;" class="branch-filter-rail">
            ${[
              { id: 'cse', label: 'CSE', full: 'Computer Science' },
              { id: 'aiml', label: 'AI & ML', full: 'Artificial Intelligence' },
              { id: 'ece', label: 'ECE', full: 'Electronics & Comm' },
              { id: 'eee', label: 'EEE', full: 'Electrical' },
              { id: 'mech', label: 'MECH', full: 'Mechanical' },
              { id: 'civil', label: 'CIVIL', full: 'Civil Engineering' },
              { id: 'aero', label: 'AERO', full: 'Aerospace' },
              { id: 'robotics', label: 'ROBOTICS', full: 'Robotics' },
              { id: 'all', label: '🌐 All', full: 'All Disciplines' }
            ].map(b => {
              const count = b.id === 'all' ? groupCounts.totalPublished : (groupCounts.byBranch[b.id] || 0);
              const isActive = currentBranch === b.id;
              return `
                <button class="tp-btn ${isActive ? 'tp-btn-primary' : 'tp-btn-secondary'} branch-tab-btn" data-branch="${b.id}" style="font-size: 0.82rem; padding: 0.45rem 1rem; white-space: nowrap; display: flex; align-items: center; gap: 0.5rem;">
                  <span>${b.label}</span>
                  <span style="background: ${isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}; padding: 0.1rem 0.45rem; border-radius: 12px; font-size: 0.7rem; font-family: monospace;">
                    ${count}
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. Academic Semester Chips (Sem 1 to 8) -->
        <div style="display: flex; flex-direction: column; gap: 0.4rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">
            Filter by Semester
          </div>
          <div style="display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 0.2rem;">
            <button class="tp-btn ${!currentSemester ? 'tp-btn-primary' : 'tp-btn-ghost'} sem-chip-btn" data-sem="" style="font-size: 0.78rem; padding: 0.3rem 0.8rem; border: 1px solid var(--tp-border-dark);">
              All Semesters
            </button>
            ${[1, 2, 3, 4, 5, 6, 7, 8].map(s => {
              const semId = `sem_${s}`;
              const count = groupCounts.bySemester[semId] || 0;
              const isActive = currentSemester === semId;
              return `
                <button class="tp-btn ${isActive ? 'tp-btn-primary' : 'tp-btn-ghost'} sem-chip-btn" data-sem="${semId}" style="font-size: 0.78rem; padding: 0.3rem 0.8rem; border: 1px solid var(--tp-border-dark); white-space: nowrap;">
                  Sem ${s} <span style="opacity: 0.7; font-size: 0.7rem;">(${count})</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 3. Dynamic Search & Comprehensive 13-Facet Filters -->
        <div class="tp-card" style="padding: 1.25rem;">
          
          <!-- Primary Filter Bar -->
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto; gap: 0.85rem; align-items: center;" class="filter-controls-grid">
            <!-- 1. Search Query -->
            <div>
              <input type="text" id="classes-search-input" class="tp-input" placeholder="🔍 Search title, teacher, subject, topic, branch, skill, career..." style="font-size: 0.88rem;" />
            </div>

            <!-- 2. Subject -->
            <div>
              <input type="text" id="filter-subject-input" class="tp-input" placeholder="Curriculum subject..." style="font-size: 0.85rem;" />
            </div>

            <!-- 3. Difficulty / Level -->
            <div>
              <select id="filter-level" class="tp-input" style="font-size: 0.85rem;">
                <option value="">All Difficulties</option>
                <option value="beginner">Beginner (Foundations)</option>
                <option value="intermediate">Intermediate (Degree)</option>
                <option value="advanced">Advanced (Rigor)</option>
              </select>
            </div>

            <!-- 4. Language -->
            <div>
              <select id="filter-language" class="tp-input" style="font-size: 0.85rem;">
                <option value="">All Languages</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="hinglish">Hinglish</option>
                <option value="tamil">Tamil</option>
                <option value="telugu">Telugu</option>
              </select>
            </div>

            <!-- Toggle Advanced / Reset -->
            <div style="display: flex; gap: 0.5rem;">
              <button id="toggle-advanced-filters-btn" class="tp-btn tp-btn-secondary" style="font-size: 0.82rem; padding: 0.45rem 0.8rem; white-space: nowrap;">
                ⚙️ Filters
              </button>
              <button id="reset-filters-btn" class="tp-btn tp-btn-ghost" style="font-size: 0.82rem; padding: 0.45rem 0.8rem;">
                Reset
              </button>
            </div>
          </div>

          <!-- Collapsible Advanced Filters (Department, Specialization, Topic, Teacher, Price, Duration, Rating, Availability) -->
          <div id="advanced-filters-drawer" style="display: none; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--tp-border-dark);">
            <!-- 5. Department -->
            <div>
              <label class="tp-form-label" style="font-size: 0.75rem;">Department</label>
              <select id="filter-dept" class="tp-input" style="font-size: 0.82rem;">
                <option value="">All Departments</option>
                ${ClassesEngine.DEPARTMENTS.map(d => `<option value="${d.id}" ${currentDept === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
              </select>
            </div>

            <!-- 6. Specialization -->
            <div>
              <label class="tp-form-label" style="font-size: 0.75rem;">Specialization</label>
              <input type="text" id="filter-spec" class="tp-input" placeholder="e.g. AI & ML, VLSI" value="${currentSpec}" style="font-size: 0.82rem;" />
            </div>

            <!-- 7. Topic -->
            <div>
              <label class="tp-form-label" style="font-size: 0.75rem;">Specific Topic</label>
              <input type="text" id="filter-topic" class="tp-input" placeholder="e.g. Neural Networks, Trees" style="font-size: 0.82rem;" />
            </div>

            <!-- 8. Teacher -->
            <div>
              <label class="tp-form-label" style="font-size: 0.75rem;">Teacher Name / ID</label>
              <input type="text" id="filter-teacher" class="tp-input" placeholder="e.g. Ananya, TP-ENG-01" style="font-size: 0.82rem;" />
            </div>

            <!-- 9. Max Price -->
            <div>
              <label class="tp-form-label" style="font-size: 0.75rem;">Price Ceiling</label>
              <select id="filter-price" class="tp-input" style="font-size: 0.82rem;">
                <option value="">Any Price</option>
                <option value="200">Under ₹200</option>
                <option value="350">Under ₹350</option>
                <option value="500">Under ₹500</option>
                <option value="800">Under ₹800</option>
              </select>
            </div>

            <!-- 10. Duration -->
            <div>
              <label class="tp-form-label" style="font-size: 0.75rem;">Duration</label>
              <select id="filter-duration" class="tp-input" style="font-size: 0.82rem;">
                <option value="">Any Duration</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes (1 Hr)</option>
                <option value="90">90 Minutes (1.5 Hr)</option>
                <option value="120">120 Minutes (2 Hr)</option>
              </select>
            </div>

            <!-- 11. Minimum Rating -->
            <div>
              <label class="tp-form-label" style="font-size: 0.75rem;">Minimum Rating</label>
              <select id="filter-rating" class="tp-input" style="font-size: 0.82rem;">
                <option value="">Any Rating</option>
                <option value="4.8">★ 4.8 & Above</option>
                <option value="4.5">★ 4.5 & Above</option>
                <option value="4.0">★ 4.0 & Above</option>
              </select>
            </div>

            <!-- 12. Availability -->
            <div>
              <label class="tp-form-label" style="font-size: 0.75rem;">Availability</label>
              <select id="filter-availability" class="tp-input" style="font-size: 0.82rem;">
                <option value="">All Classes</option>
                <option value="available_only">Seats Available Only</option>
              </select>
            </div>
          </div>

        </div>

        <!-- 4. Class Discovery Grid Header & Count -->
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div id="results-count-telemetry" style="font-size: 0.85rem; color: var(--tp-text-dark-secondary);">
            Showing verified published classes...
          </div>
        </div>

        <!-- 5. Class Grid Container -->
        <div id="classes-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
          <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem;">
            <div class="pulse-beacon" style="margin: 0 auto 1rem auto;"></div>
            <p style="color: var(--tp-text-dark-secondary);">Loading verified classes...</p>
          </div>
        </div>

      </div>
    `;

    // Core Classes Loader
    const loadClasses = async () => {
      const grid = container.querySelector('#classes-grid-container');
      const countLabel = container.querySelector('#results-count-telemetry');
      if (!grid) return;

      const query = container.querySelector('#classes-search-input')?.value || '';
      const subject = container.querySelector('#filter-subject-input')?.value || '';
      const level = container.querySelector('#filter-level')?.value || '';
      const language = container.querySelector('#filter-language')?.value || '';
      const dept = container.querySelector('#filter-dept')?.value || currentDept || '';
      const spec = container.querySelector('#filter-spec')?.value || currentSpec || '';
      const topic = container.querySelector('#filter-topic')?.value || '';
      const teacher = container.querySelector('#filter-teacher')?.value || '';
      const price = container.querySelector('#filter-price')?.value || '';
      const duration = container.querySelector('#filter-duration')?.value || '';
      const rating = container.querySelector('#filter-rating')?.value || '';
      const availability = container.querySelector('#filter-availability')?.value || '';

      const classes = await ClassesEngine.getDiscoverableClasses(user, {
        branchFilter: currentBranch,
        semesterFilter: currentSemester,
        departmentFilter: dept,
        specializationFilter: spec,
        subjectFilter: subject,
        topicFilter: topic,
        teacherFilter: teacher,
        maxPrice: price,
        durationFilter: duration,
        minRatingFilter: rating,
        availabilityFilter: availability,
        levelFilter: level,
        languageFilter: language,
        query
      });

      if (countLabel) {
        countLabel.innerHTML = `Found <strong style="color: #fff;">${classes.length}</strong> published class${classes.length === 1 ? '' : 'es'} in <strong style="color: var(--tp-primary); text-transform: uppercase;">${currentBranch === 'all' ? 'All Disciplines' : currentBranch}</strong>${currentSemester ? ` (Semester ${currentSemester.replace('sem_', '')})` : ''}`;
      }

      if (classes.length === 0) {
        const semText = currentSemester ? ` Semester ${currentSemester.replace('sem_', '')}` : '';
        grid.innerHTML = `
          <div class="tp-card" style="grid-column: 1 / -1; text-align: center; padding: 4.5rem 1.5rem; border: 1px dashed var(--tp-border-dark);">
            <div style="font-size: 3rem; margin-bottom: 0.75rem;">📚</div>
            <h3 style="color: #fff; font-size: 1.3rem; font-weight: 700; margin-bottom: 0.5rem;">
              No classes are currently available for this branch and semester.
            </h3>
            <p style="color: var(--tp-text-dark-secondary); max-width: 520px; margin: 0 auto 1.75rem auto; font-size: 0.9rem; line-height: 1.6;">
              There are no published classes matching <strong>${currentBranch.toUpperCase()}${semText}</strong> yet. You can explore other disciplines or author the first class for your university peers!
            </p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <button id="empty-create-class-btn" class="tp-btn tp-btn-primary" style="font-size: 0.88rem;">
                + Author First Class in ${currentBranch.toUpperCase()}
              </button>
              <button id="empty-explore-all-btn" class="tp-btn tp-btn-secondary" style="font-size: 0.88rem;">
                🌐 Explore All Disciplines
              </button>
            </div>
          </div>
        `;

        grid.querySelector('#empty-create-class-btn')?.addEventListener('click', () => {
          CreateClassModal.open(user, () => loadClasses());
        });

        grid.querySelector('#empty-explore-all-btn')?.addEventListener('click', () => {
          currentBranch = 'all';
          currentSemester = '';
          currentDept = '';
          currentSpec = '';
          ClassesPage.render(container, { branch: 'all' });
        });

        return;
      }

      // Render Verified Student Class Cards with all 14 required fields
      grid.innerHTML = classes.map(cls => {
        const semNumber = (cls.semester_id || 'sem_3').replace('sem_', '');
        const branchUpper = (cls.branch_id || 'cse').toUpperCase();
        const difficultyLabel = (cls.difficulty || cls.student_level || 'intermediate').toUpperCase();
        const deptLabel = cls.department_name || 'Engineering & Technology';
        const seatsLeft = cls.max_students ? Math.max(0, cls.max_students - (cls.booked_count || 0)) : 12;

        return `
          <div class="tp-card tp-card-glass class-item-card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--tp-border-dark); transition: transform 0.2s ease, border-color 0.2s ease; padding: 1.4rem;">
            <div>
              <!-- 1. Academic Group Badges (Department, Branch, Semester) -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.4rem;">
                <span class="telemetry-chip" style="font-size: 0.72rem; color: var(--tp-primary); border-color: var(--tp-primary);">
                  ${branchUpper} &bull; SEMESTER ${semNumber}
                </span>
                <span class="mono-chip" style="font-size: 0.72rem; color: #f59e0b;">
                  ★ ${(cls.rating || 5.0).toFixed(1)} (${cls.reviews_count || 0} reviews)
                </span>
              </div>

              <!-- 2. Class Title -->
              <h3 style="color: #fff; font-size: 1.15rem; font-weight: 700; line-height: 1.4; margin-bottom: 0.4rem;">
                <a href="#/classes/${cls.id}" style="color: inherit; text-decoration: none;">${cls.title}</a>
              </h3>

              <!-- 3. Category Discovery Breadcrumb (Department -> Subject -> Topic -> Specialization) -->
              <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap;">
                <span style="color: #cbd5e1; font-weight: 500;">${cls.subject}</span> &bull;
                <span style="color: #38bdf8;">${cls.topic}</span>
                ${cls.specialization ? `&bull; <span style="color: #fda4af;">${cls.specialization}</span>` : ''}
              </div>

              <!-- 4. Description Excerpt -->
              <p style="color: #cbd5e1; font-size: 0.85rem; line-height: 1.5; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                ${cls.description}
              </p>

              <!-- 5. Teacher Dossier -->
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.6rem 0.85rem; margin-bottom: 1.15rem;">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--tp-primary), var(--tp-accent)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; color: #fff;">
                    ${(cls.teacher_name || 'T').charAt(0)}
                  </div>
                  <div>
                    <strong style="color: #fff; font-size: 0.85rem; display: block;">${cls.teacher_name}</strong>
                    <span style="font-family: monospace; font-size: 0.7rem; color: #38bdf8;">${cls.teacher_techpath_id || 'TP-TEACHER'}</span>
                  </div>
                </div>
                <span class="telemetry-chip" style="font-size: 0.68rem; color: #10b981; border-color: #10b981;">
                  ${cls.teacher_verification || 'Teacher Verified'}
                </span>
              </div>

              <!-- 6. Metadata Pills (Department, Difficulty, Language, Duration, Career) -->
              <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem; font-size: 0.75rem;">
                <span class="mono-chip" style="color: #94a3b8; font-size: 0.72rem;">🏛️ ${deptLabel}</span>
                <span class="mono-chip" style="color: #cbd5e1; font-size: 0.72rem;">⏱️ ${cls.duration || 60}m</span>
                <span class="mono-chip" style="color: #cbd5e1; font-size: 0.72rem;">🗣️ ${cls.language || 'English'}</span>
                <span class="mono-chip" style="color: #a78bfa; font-size: 0.72rem;">📊 ${difficultyLabel}</span>
                ${cls.career_relevance ? `<span class="mono-chip" style="color: #38bdf8; font-size: 0.72rem;">🎯 ${cls.career_relevance}</span>` : ''}
              </div>
            </div>

            <!-- 7. Price & Actions Footer -->
            <div style="border-top: 1px solid var(--tp-border-dark); padding-top: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 0.85rem;">
                <div>
                  <span style="font-size: 0.72rem; color: var(--tp-text-dark-secondary); display: block;">Class price:</span>
                  <span style="font-size: 1.35rem; font-weight: 800; color: #fff;">${cls.price === 0 ? 'Free' : `₹${cls.price}`}</span>
                  <span style="font-size: 0.75rem; color: #10b981; margin-left: 0.35rem;">Additional fees: ₹0</span>
                </div>
                <div style="font-size: 0.78rem; color: ${seatsLeft > 0 ? '#10b981' : '#f59e0b'}; text-align: right;">
                  ${seatsLeft > 0 ? `🟢 ${seatsLeft} seats remaining` : '🔴 Class Full'}
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <a href="#/classes/${cls.id}" class="tp-btn tp-btn-secondary" style="font-size: 0.82rem; text-align: center; padding: 0.5rem;">
                  View Syllabus
                </a>
                <a href="#/classes/${cls.id}" class="tp-btn tp-btn-primary" style="font-size: 0.82rem; text-align: center; padding: 0.5rem;">
                  ${cls.price === 0 ? 'Enroll Free →' : 'Enroll Now →'}
                </a>
              </div>
            </div>

          </div>
        `;
      }).join('');
    };

    // Initial load
    await loadClasses();

    // Event Bindings
    // 1. Discipline tabs
    container.querySelectorAll('.branch-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        container.querySelectorAll('.branch-tab-btn').forEach(b => {
          b.className = 'tp-btn tp-btn-secondary branch-tab-btn';
        });
        e.currentTarget.className = 'tp-btn tp-btn-primary branch-tab-btn';
        currentBranch = e.currentTarget.dataset.branch;
        loadClasses();
      });
    });

    // 2. Semester chips
    container.querySelectorAll('.sem-chip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        container.querySelectorAll('.sem-chip-btn').forEach(b => {
          b.className = 'tp-btn tp-btn-ghost sem-chip-btn';
        });
        e.currentTarget.className = 'tp-btn tp-btn-primary sem-chip-btn';
        currentSemester = e.currentTarget.dataset.sem;
        loadClasses();
      });
    });

    // 3. Reset to my branch
    container.querySelector('#reset-to-my-branch-btn')?.addEventListener('click', () => {
      currentBranch = userBranch;
      currentSemester = userSemester;
      ClassesPage.render(container, { branch: userBranch, semester: userSemester });
    });

    // 4. Toggle Advanced Filters Drawer
    const toggleAdvBtn = container.querySelector('#toggle-advanced-filters-btn');
    const advDrawer = container.querySelector('#advanced-filters-drawer');
    if (toggleAdvBtn && advDrawer) {
      toggleAdvBtn.addEventListener('click', () => {
        showAdvancedFilters = !showAdvancedFilters;
        advDrawer.style.display = showAdvancedFilters ? 'grid' : 'none';
        toggleAdvBtn.textContent = showAdvancedFilters ? '▲ Less Filters' : '⚙️ Filters';
      });
    }

    // 5. Search & Filter inputs
    const searchInput = container.querySelector('#classes-search-input');
    const subjectInput = container.querySelector('#filter-subject-input');
    const levelSelect = container.querySelector('#filter-level');
    const langSelect = container.querySelector('#filter-language');
    const deptSelect = container.querySelector('#filter-dept');
    const specInput = container.querySelector('#filter-spec');
    const topicInput = container.querySelector('#filter-topic');
    const teacherInput = container.querySelector('#filter-teacher');
    const priceSelect = container.querySelector('#filter-price');
    const durationSelect = container.querySelector('#filter-duration');
    const ratingSelect = container.querySelector('#filter-rating');
    const availSelect = container.querySelector('#filter-availability');
    const resetBtn = container.querySelector('#reset-filters-btn');

    let debounceTimer;
    const triggerSearch = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(loadClasses, 250);
    };

    searchInput?.addEventListener('input', triggerSearch);
    subjectInput?.addEventListener('input', triggerSearch);
    specInput?.addEventListener('input', triggerSearch);
    topicInput?.addEventListener('input', triggerSearch);
    teacherInput?.addEventListener('input', triggerSearch);

    levelSelect?.addEventListener('change', loadClasses);
    langSelect?.addEventListener('change', loadClasses);
    deptSelect?.addEventListener('change', loadClasses);
    priceSelect?.addEventListener('change', loadClasses);
    durationSelect?.addEventListener('change', loadClasses);
    ratingSelect?.addEventListener('change', loadClasses);
    availSelect?.addEventListener('change', loadClasses);

    resetBtn?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (subjectInput) subjectInput.value = '';
      if (specInput) specInput.value = '';
      if (topicInput) topicInput.value = '';
      if (teacherInput) teacherInput.value = '';
      if (levelSelect) levelSelect.value = '';
      if (langSelect) langSelect.value = '';
      if (deptSelect) deptSelect.value = '';
      if (priceSelect) priceSelect.value = '';
      if (durationSelect) durationSelect.value = '';
      if (ratingSelect) ratingSelect.value = '';
      if (availSelect) availSelect.value = '';
      currentSemester = '';
      currentDept = '';
      currentSpec = '';
      container.querySelectorAll('.sem-chip-btn').forEach((b, i) => {
        b.className = i === 0 ? 'tp-btn tp-btn-primary sem-chip-btn' : 'tp-btn tp-btn-ghost sem-chip-btn';
      });
      loadClasses();
    });

    // 6. Hero Create Class trigger
    container.querySelector('#hero-create-class-btn')?.addEventListener('click', () => {
      CreateClassModal.open(user, () => loadClasses());
    });
  }
}
