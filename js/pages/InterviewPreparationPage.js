/**
 * TECHPATH — INTERVIEW PREPARATION & PREVIOUS QUESTIONS SYSTEM
 * Route: #/interview/prep and #/interview/questions
 * Categories: Technical, HR, Behavioral, Branch-Specific (CSE, ECE, EEE, MECH, CIVIL),
 * Role-Specific, Internship, Placement, Graduate, and International University interviews.
 */

import { learningContext } from '../context/LearningContext.js';
import { dbStore } from '../db/store.js';

export const INTERVIEW_CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'Technical Interview', label: 'Technical Interview' },
  { id: 'HR Interview', label: 'HR Interview' },
  { id: 'Behavioral Interview', label: 'Behavioral & Leadership' },
  { id: 'Branch-specific', label: 'Branch-Specific Core' },
  { id: 'Role-specific', label: 'Role-Specific' },
  { id: 'Internship Interview', label: 'Internship Qualifier' },
  { id: 'Placement Interview', label: 'Campus Placement' },
  { id: 'Graduate Interview', label: 'Graduate Technical' }
];

export class InterviewPreparationPage {
  static async render(container) {
    const ctx = learningContext.get();
    const branch = ctx.branch_id || 'cse';
    const allQuestions = await dbStore.getAll('interview_question_bank');
    const roles = await dbStore.getAll('interview_roles');

    let activeCategory = 'all';
    let selectedBranch = branch;
    let searchQuery = '';

    function renderView() {
      let filtered = allQuestions;

      if (activeCategory !== 'all') {
        if (activeCategory === 'Branch-specific') {
          filtered = filtered.filter(q => q.branch === selectedBranch);
        } else {
          filtered = filtered.filter(q => q.category === activeCategory);
        }
      }

      if (selectedBranch !== 'all') {
        filtered = filtered.filter(q => q.branch === selectedBranch || q.branch === 'all');
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(item =>
          item.question.toLowerCase().includes(q) ||
          (item.related_skill || '').toLowerCase().includes(q) ||
          (item.preparation_topic || '').toLowerCase().includes(q) ||
          (item.role || '').toLowerCase().includes(q)
        );
      }

      container.innerHTML = `
        <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1150px;">
          <!-- Header -->
          <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom:0.5rem">
                <span class="pulse-beacon"></span> CAREER & INTERVIEW INTELLIGENCE
              </div>
              <h1 class="display-lg">Interview Preparation & Question Bank</h1>
              <p style="color:var(--tp-text-dark-secondary)">
                Comprehensive question bank organized by engineering discipline, technical role, and interview category.
              </p>
            </div>
            <a href="#/interview" class="tp-btn tp-btn-primary">
              🎤 Launch Interactive Mock Interview Studio
            </a>
          </div>

          <!-- Category Filter Ribbon -->
          <div style="display:flex;gap:0.4rem;overflow-x:auto;padding-bottom:0.35rem;">
            ${INTERVIEW_CATEGORIES.map(cat => `
              <button class="tp-btn ${activeCategory === cat.id ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm interview-cat-btn" data-cat="${cat.id}" style="white-space:nowrap;">
                ${cat.label}
              </button>
            `).join('')}
          </div>

          <!-- Toolbar -->
          <div class="tp-card" style="padding:1rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
            <div style="flex:1;min-width:240px;position:relative;">
              <input type="search" id="interview-search-input" class="tp-input" placeholder="Search questions by skill, keyword, or role..." value="${searchQuery}" style="padding-left:2.25rem;" />
              <span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:var(--tp-text-dark-muted);">🔍</span>
            </div>

            <select id="filter-interview-branch" class="tp-input" style="width:auto;padding:0.5rem 1rem;">
              <option value="all" ${selectedBranch === 'all' ? 'selected' : ''}>All Engineering Branches</option>
              <option value="cse" ${selectedBranch === 'cse' ? 'selected' : ''}>CSE (Software & Computing)</option>
              <option value="ece" ${selectedBranch === 'ece' ? 'selected' : ''}>ECE (Embedded & Hardware)</option>
              <option value="eee" ${selectedBranch === 'eee' ? 'selected' : ''}>EEE (Electrical & Power)</option>
              <option value="mech" ${selectedBranch === 'mech' ? 'selected' : ''}>MECH (Design & Thermal)</option>
              <option value="civil" ${selectedBranch === 'civil' ? 'selected' : ''}>CIVIL (Structural & Concrete)</option>
            </select>
          </div>

          <!-- Branch Domains Mapping Info Bar -->
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;padding:0.75rem 1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);font-size:0.85rem;">
            <strong style="color:var(--tp-primary);">Branch Core Focus:</strong>
            ${selectedBranch === 'cse' ? '<span class="telemetry-chip">DSA</span><span class="telemetry-chip">OS Paging</span><span class="telemetry-chip">DBMS B+ Trees</span><span class="telemetry-chip">Networks</span><span class="telemetry-chip">OOP</span>' :
              selectedBranch === 'ece' ? '<span class="telemetry-chip">Embedded C</span><span class="telemetry-chip">MOSFET Saturation</span><span class="telemetry-chip">Verilog RTOS</span><span class="telemetry-chip">Signals & Z-Transform</span>' :
              selectedBranch === 'mech' ? '<span class="telemetry-chip">Von Mises Yielding</span><span class="telemetry-chip">Carnot Efficiency</span><span class="telemetry-chip">Mohr Circle</span><span class="telemetry-chip">FEA Simulation</span>' :
              selectedBranch === 'civil' ? '<span class="telemetry-chip">RCC Limit State</span><span class="telemetry-chip">Section Modulus</span><span class="telemetry-chip">Soil Shear Strength</span><span class="telemetry-chip">BOD Kinetics</span>' :
              '<span class="telemetry-chip">Core Engineering Fundamentals</span><span class="telemetry-chip">STAR Behavioral Protocol</span>'
            }
          </div>

          <!-- Question Cards -->
          ${filtered.length === 0 ? `
            <div class="tp-empty-state" style="border:1px solid var(--tp-border-dark);border-radius:var(--radius-md);padding:4rem 2rem;text-align:center;">
              <h2 class="headline-lg">No Questions Match Filter</h2>
              <p class="tp-empty-desc">Clear your search query or select another category above.</p>
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:1.25rem;">
              ${filtered.map((item, idx) => `
                <div class="tp-card" style="display:flex;flex-direction:column;gap:0.75rem;">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;">
                    <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
                      <span class="mono-chip" style="color:var(--tp-primary);font-weight:700;">#${idx + 1}</span>
                      <span class="telemetry-chip">${item.category}</span>
                      <span class="telemetry-chip">${item.branch.toUpperCase()}</span>
                      <span class="mono-chip" style="color:var(--tp-text-dark-muted);">${item.role}</span>
                    </div>
                    <span class="telemetry-chip" style="color:var(--tp-accent);border-color:var(--tp-accent);">
                      ★ ${item.related_skill || 'Core Skill'}
                    </span>
                  </div>

                  <h2 class="headline-sm" style="color:#fff;line-height:1.4;margin:0.25rem 0;">
                    ${item.question}
                  </h2>

                  <div style="display:flex;gap:1rem;font-size:0.85rem;color:var(--tp-text-dark-secondary);flex-wrap:wrap;">
                    <div><strong>Preparation Topic:</strong> ${item.preparation_topic || 'Engineering Theory'}</div>
                    <div><strong>Suggested Practice:</strong> ${item.suggested_practice || 'Derive on whiteboard under timed conditions.'}</div>
                  </div>

                  <!-- Expandable Answer & Evaluation Framework -->
                  <details style="margin-top:0.5rem;border-top:1px solid rgba(255,255,255,0.04);padding-top:0.5rem;">
                    <summary style="font-size:0.85rem;color:var(--tp-primary);cursor:pointer;font-weight:600;user-select:none;">
                      💡 View Interviewer's Evaluation Framework & Model Answer
                    </summary>
                    <div style="margin-top:0.75rem;padding:0.85rem 1.25rem;background:rgba(99,102,241,0.05);border-left:3px solid var(--tp-primary);border-radius:var(--radius-sm);font-size:0.85rem;color:var(--tp-text-dark-secondary);line-height:1.5;">
                      <strong style="color:var(--tp-success);">Key Concepts Expected:</strong>
                      <p style="margin-top:0.25rem;">${item.sample_answer_framework || 'Direct mathematical derivation, edge case consideration, and practical industrial context.'}</p>
                    </div>
                  </details>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;

      bindEvents();
    }

    function bindEvents() {
      container.querySelectorAll('.interview-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategory = btn.dataset.cat;
          renderView();
        });
      });

      const branchSel = container.querySelector('#filter-interview-branch');
      if (branchSel) {
        branchSel.addEventListener('change', (e) => {
          selectedBranch = e.target.value;
          renderView();
        });
      }

      const searchInp = container.querySelector('#interview-search-input');
      if (searchInp) {
        searchInp.addEventListener('input', (e) => {
          searchQuery = e.target.value;
          clearTimeout(window._interviewSearchTimer);
          window._interviewSearchTimer = setTimeout(() => renderView(), 200);
        });
      }
    }

    renderView();
  }
}
