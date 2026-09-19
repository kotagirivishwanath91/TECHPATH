/**
 * TECHPATH — MASTER EXAM PREPARATION PLATFORM (EXAM CENTER)
 * Route: #/exams
 * Multi-Category Architecture: University, National (GATE/JEE/UPSC/SSC/CAT), and International (IELTS/TOEFL/GRE/GMAT).
 * Integrated with Exam Detail, Adaptive Roadmaps, PYQ Repository, and My Exams Dashboard.
 */

import { learningContext } from '../context/LearningContext.js';
import { dbStore } from '../db/store.js';

export class ExamsPage {
  static async render(container) {
    const ctx = learningContext.get();
    const exams = await dbStore.getAll('exams');
    const categories = await dbStore.getAll('exam_categories');

    let activeCategory = 'all'; // 'all' | 'univ' | 'nat' | 'intl'
    let selectedBranch = ctx.branch_id || 'all';
    let searchQuery = '';

    function renderView() {
      let filtered = exams;
      if (activeCategory !== 'all') {
        filtered = filtered.filter(e => e.category_id === activeCategory);
      }
      if (selectedBranch !== 'all') {
        filtered = filtered.filter(e => !e.target_branch_id || e.target_branch_id === 'all' || e.target_branch_id === selectedBranch);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(e =>
          e.title.toLowerCase().includes(q) ||
          (e.code || '').toLowerCase().includes(q) ||
          (e.syllabus_summary || '').toLowerCase().includes(q) ||
          (e.organizing_body || '').toLowerCase().includes(q)
        );
      }

      container.innerHTML = `
        <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1200px;">
          <!-- Header -->
          <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom:0.5rem">
                <span class="pulse-beacon"></span> COMPREHENSIVE EXAMINATION MATRIX
              </div>
              <h1 class="display-lg">TechPath Exam Center</h1>
              <p style="color:var(--tp-text-dark-secondary)">
                Verified syllabus roadmaps, official guidance, and previous-year question sets across university, national, and international qualifiers.
              </p>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <a href="#/exams/my-exams" class="tp-btn tp-btn-secondary">
                🎯 My Exams Dashboard
              </a>
              <a href="#/exams/pyqs" class="tp-btn tp-btn-primary">
                📜 Previous-Year Questions (PYQs)
              </a>
            </div>
          </div>

          <!-- Official Disclosure -->
          <div style="padding:0.75rem 1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);font-size:0.8rem;color:var(--tp-text-dark-muted);line-height:1.4;">
            ℹ️ <strong>Independent Prep Platform:</strong> TechPath is an independent academic revision resource. Examination names, acronyms, and marks patterns are referenced under fair-use educational guidance. TechPath does not claim official sponsorship, affiliation, or testing authority.
          </div>

          <!-- Category Tabs -->
          <div style="display:flex;gap:0.5rem;border-bottom:1px solid var(--tp-border-dark);padding-bottom:0.5rem;overflow-x:auto;">
            <button class="tp-btn ${activeCategory === 'all' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm exam-cat-btn" data-cat="all">
              🌟 All Examinations (${exams.length})
            </button>
            <button class="tp-btn ${activeCategory === 'univ' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm exam-cat-btn" data-cat="univ">
              🏛️ University & College Exams
            </button>
            <button class="tp-btn ${activeCategory === 'nat' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm exam-cat-btn" data-cat="nat">
              🇮🇳 National (GATE / JEE / UPSC / CAT)
            </button>
            <button class="tp-btn ${activeCategory === 'intl' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm exam-cat-btn" data-cat="intl">
              🌐 International (IELTS / TOEFL / GRE / GMAT)
            </button>
          </div>

          <!-- Search & Branch Filter -->
          <div class="tp-card" style="padding:1rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
            <div style="flex:1;min-width:240px;position:relative;">
              <input type="search" id="exam-search-input" class="tp-input" placeholder="Search exams by title, code, or subject..." value="${searchQuery}" style="padding-left:2.25rem;" />
              <span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:var(--tp-text-dark-muted);">🔍</span>
            </div>

            <select id="filter-exam-branch" class="tp-input" style="width:auto;padding:0.5rem 1rem;">
              <option value="all" ${selectedBranch === 'all' ? 'selected' : ''}>All Engineering Disciplines</option>
              <option value="cse" ${selectedBranch === 'cse' ? 'selected' : ''}>CSE (Computer Science)</option>
              <option value="ece" ${selectedBranch === 'ece' ? 'selected' : ''}>ECE (Electronics)</option>
              <option value="eee" ${selectedBranch === 'eee' ? 'selected' : ''}>EEE (Electrical)</option>
              <option value="mech" ${selectedBranch === 'mech' ? 'selected' : ''}>MECH (Mechanical)</option>
              <option value="civil" ${selectedBranch === 'civil' ? 'selected' : ''}>CIVIL (Infrastructure)</option>
            </select>
          </div>

          <!-- Exam Cards Grid -->
          ${filtered.length === 0 ? `
            <div class="tp-empty-state" style="border:1px solid var(--tp-border-dark);border-radius:var(--radius-md);padding:4rem 2rem;text-align:center;">
              <h2 class="headline-lg">No Examinations Found</h2>
              <p class="tp-empty-desc">No examination matches the current search or filter combination.</p>
            </div>
          ` : `
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(340px, 1fr));gap:1.5rem;">
              ${filtered.map(ex => `
                <div class="tp-card tp-card-glass" style="display:flex;flex-direction:column;justify-content:space-between;gap:1.25rem;">
                  <div>
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem;">
                      <span class="mono-chip" style="color:var(--tp-primary);font-weight:700;">${ex.code || ex.id}</span>
                      <span class="telemetry-chip">${ex.exam_type.toUpperCase()}</span>
                    </div>

                    <h2 class="headline-md" style="margin:0 0 0.35rem 0;line-height:1.3;">
                      <a href="#/exams/${ex.id}" style="color:#fff;text-decoration:none;">${ex.title}</a>
                    </h2>

                    <p style="font-size:0.8rem;color:var(--tp-text-dark-muted);margin-bottom:0.75rem;">
                      ${ex.organizing_body || 'National Board'}
                    </p>

                    <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                      ${ex.syllabus_summary}
                    </p>

                    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.75rem;">
                      <span class="telemetry-chip">⏱️ ${ex.duration_minutes} Mins</span>
                      <span class="telemetry-chip">🎯 ${ex.total_marks} Marks</span>
                      <span class="telemetry-chip">📝 ${(ex.sections || []).length} Sections</span>
                    </div>
                  </div>

                  <div style="display:flex;gap:0.5rem;border-top:1px solid var(--tp-border-dark);padding-top:1rem;">
                    <a href="#/exams/${ex.id}" class="tp-btn tp-btn-primary tp-btn-sm" style="flex:1;justify-content:center;">
                      View Roadmap & Dossier →
                    </a>
                    <a href="#/practice" class="tp-btn tp-btn-secondary tp-btn-sm">
                      ⚡ Practice
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;

      bindEvents();
    }

    function bindEvents() {
      container.querySelectorAll('.exam-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategory = btn.dataset.cat;
          renderView();
        });
      });

      const branchSel = container.querySelector('#filter-exam-branch');
      if (branchSel) {
        branchSel.addEventListener('change', (e) => {
          selectedBranch = e.target.value;
          renderView();
        });
      }

      const searchInp = container.querySelector('#exam-search-input');
      if (searchInp) {
        searchInp.addEventListener('input', (e) => {
          searchQuery = e.target.value;
          clearTimeout(window._examSearchTimer);
          window._examSearchTimer = setTimeout(() => renderView(), 200);
        });
      }
    }

    renderView();
  }
}
