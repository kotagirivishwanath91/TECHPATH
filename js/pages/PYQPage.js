/**
 * TECHPATH — PREVIOUS YEAR QUESTIONS (PYQ) PLATFORM
 * Route: #/exams/pyqs
 * Search, filter, attempt, bookmark, add personal study notes, and inspect official source citations.
 */

import { dbStore } from '../db/store.js';
import { Toast } from '../components/Toast.js';

export class PYQPage {
  static async render(container) {
    const papers = await dbStore.getAll('exam_papers');
    const exams = await dbStore.getAll('exams');

    // Filter states
    let selectedExam = 'all';
    let selectedYear = 'all';
    let selectedBranch = 'all';
    let searchQuery = '';

    // Active Attempt State
    let activePaper = null;
    let paperAnswers = {};
    let isGraded = false;

    async function loadView() {
      if (activePaper) {
        renderPaperAttempt();
        return;
      }

      let filtered = papers;
      if (selectedExam !== 'all') filtered = filtered.filter(p => p.exam_id === selectedExam);
      if (selectedYear !== 'all') filtered = filtered.filter(p => String(p.year) === String(selectedYear));
      if (selectedBranch !== 'all') filtered = filtered.filter(p => p.branch_id === selectedBranch || p.branch_id === 'all');
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.subject.toLowerCase().includes(q) ||
          (p.legal_notice || '').toLowerCase().includes(q)
        );
      }

      container.innerHTML = `
        <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1150px;">
          <!-- Header -->
          <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom:0.5rem">
                <span class="pulse-beacon"></span> AUTHENTIC QUESTION REPOSITORY
              </div>
              <h1 class="display-lg">Previous-Year Question Papers (PYQs)</h1>
              <p style="color:var(--tp-text-dark-secondary)">
                Legally cited past examination papers, official source references, and original TechPath problem drills.
              </p>
            </div>
            <a href="#/exams" class="tp-btn tp-btn-secondary">
              ← Return to Exam Center
            </a>
          </div>

          <!-- Legal & Compliance Notice -->
          <div style="padding:0.85rem 1.25rem;background:rgba(99,102,241,0.05);border-left:4px solid var(--tp-primary);border-radius:var(--radius-sm);font-size:0.85rem;color:var(--tp-text-dark-secondary);line-height:1.5;">
            <strong>Copyright & Attribution Notice:</strong> Full authentic examination papers are subject to ownership by their respective organizing authorities (e.g., IIT/IISc, IDP/British Council, UPSC, Universities). TechPath provides direct verified links to official portals alongside original, inspired pedagogical problem sets and step-by-step mathematical explanations.
          </div>

          <!-- Filter Toolbar -->
          <div class="tp-card" style="padding:1rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
            <div style="flex:1;min-width:220px;position:relative;">
              <input type="search" id="pyq-search-input" class="tp-input" placeholder="Search papers by exam, subject, or year..." value="${searchQuery}" style="padding-left:2.25rem;" />
              <span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:var(--tp-text-dark-muted);">🔍</span>
            </div>

            <select id="filter-pyq-exam" class="tp-input" style="width:auto;padding:0.5rem 1rem;">
              <option value="all" ${selectedExam === 'all' ? 'selected' : ''}>All Exams</option>
              ${exams.map(e => `
                <option value="${e.id}" ${selectedExam === e.id ? 'selected' : ''}>${e.code || e.title}</option>
              `).join('')}
            </select>

            <select id="filter-pyq-year" class="tp-input" style="width:auto;padding:0.5rem 1rem;">
              <option value="all" ${selectedYear === 'all' ? 'selected' : ''}>All Years</option>
              <option value="2025" ${selectedYear === '2025' ? 'selected' : ''}>2025</option>
              <option value="2024" ${selectedYear === '2024' ? 'selected' : ''}>2024</option>
              <option value="2023" ${selectedYear === '2023' ? 'selected' : ''}>2023</option>
              <option value="2022" ${selectedYear === '2022' ? 'selected' : ''}>2022</option>
            </select>

            <select id="filter-pyq-branch" class="tp-input" style="width:auto;padding:0.5rem 1rem;">
              <option value="all" ${selectedBranch === 'all' ? 'selected' : ''}>All Disciplines</option>
              <option value="cse" ${selectedBranch === 'cse' ? 'selected' : ''}>CSE</option>
              <option value="ece" ${selectedBranch === 'ece' ? 'selected' : ''}>ECE</option>
              <option value="mech" ${selectedBranch === 'mech' ? 'selected' : ''}>MECH</option>
              <option value="civil" ${selectedBranch === 'civil' ? 'selected' : ''}>CIVIL</option>
            </select>
          </div>

          <!-- Paper Cards Grid -->
          ${filtered.length === 0 ? `
            <div class="tp-empty-state" style="border:1px solid var(--tp-border-dark);border-radius:var(--radius-md);padding:4rem 2rem;text-align:center;">
              <h2 class="headline-lg">No Question Papers Match Filter</h2>
              <p class="tp-empty-desc">Try clearing your search query or selecting a different examination.</p>
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:1.25rem;">
              ${filtered.map(paper => `
                <div class="tp-card" style="display:flex;flex-direction:column;gap:1rem;">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.75rem;">
                    <div>
                      <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.35rem;">
                        <span class="mono-chip" style="color:var(--tp-primary);font-weight:700;">${paper.year}</span>
                        <span class="telemetry-chip">${(paper.branch_id || 'ALL').toUpperCase()}</span>
                        <span class="telemetry-chip">${paper.subject}</span>
                      </div>
                      <h2 class="headline-md" style="margin:0.25rem 0;">${paper.title}</h2>
                      <p style="font-size:0.8rem;color:var(--tp-text-dark-muted);">
                        ${paper.legal_notice}
                      </p>
                    </div>

                    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                      ${paper.official_source_url ? `
                        <a href="${paper.official_source_url}" target="_blank" rel="noopener noreferrer" class="tp-btn tp-btn-secondary tp-btn-sm">
                          Official Source ↗
                        </a>
                      ` : ''}
                      <button class="tp-btn tp-btn-primary tp-btn-sm btn-attempt-paper" data-id="${paper.id}">
                        ⚡ Attempt Questions (${(paper.sample_questions || []).length})
                      </button>
                    </div>
                  </div>

                  <!-- Questions Preview List -->
                  <div style="border-top:1px solid rgba(255,255,255,0.04);padding-top:0.75rem;">
                    <strong style="font-size:0.85rem;color:var(--tp-text-dark-secondary);">Question Excerpts & Drills:</strong>
                    <div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.5rem;">
                      ${(paper.sample_questions || []).map(sq => `
                        <div style="padding:0.65rem 0.85rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);font-size:0.85rem;color:#fff;">
                          <strong style="color:var(--tp-primary);">Q${sq.q_num}.</strong> ${sq.question}
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `;

      bindEvents(filtered);
    }

    function bindEvents(filtered) {
      container.querySelector('#filter-pyq-exam')?.addEventListener('change', (e) => { selectedExam = e.target.value; loadView(); });
      container.querySelector('#filter-pyq-year')?.addEventListener('change', (e) => { selectedYear = e.target.value; loadView(); });
      container.querySelector('#filter-pyq-branch')?.addEventListener('change', (e) => { selectedBranch = e.target.value; loadView(); });

      const searchInp = container.querySelector('#pyq-search-input');
      if (searchInp) {
        searchInp.addEventListener('input', (e) => {
          searchQuery = e.target.value;
          clearTimeout(window._pyqTimer);
          window._pyqTimer = setTimeout(() => loadView(), 200);
        });
      }

      container.querySelectorAll('.btn-attempt-paper').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          activePaper = papers.find(p => p.id === id);
          paperAnswers = {};
          isGraded = false;
          loadView();
        });
      });
    }

    function renderPaperAttempt() {
      const qList = activePaper.sample_questions || [];

      container.innerHTML = `
        <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1050px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom:0.5rem;">ACTIVE PYQ DRILL</div>
              <h1 class="headline-xl">${activePaper.title}</h1>
              <p style="color:var(--tp-text-dark-secondary);">${activePaper.legal_notice}</p>
            </div>
            <button id="btn-exit-pyq" class="tp-btn tp-btn-secondary">
              ← Return to Papers
            </button>
          </div>

          <!-- Questions Container -->
          <div style="display:flex;flex-direction:column;gap:1.5rem;">
            ${qList.map((q, idx) => {
              const selected = paperAnswers[idx];
              const isSubmitted = isGraded;
              const isCorrect = isSubmitted && selected === q.correct_option;

              return `
                <div class="tp-card" style="display:flex;flex-direction:column;gap:1rem;">
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="mono-chip" style="color:var(--tp-primary)">Question ${q.q_num}</span>
                    ${isSubmitted ? `
                      <span class="telemetry-chip" style="
                        color:${isCorrect ? 'var(--tp-success)' : 'var(--tp-error)'};
                        border-color:${isCorrect ? 'var(--tp-success)' : 'var(--tp-error)'};
                      ">
                        ${isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                      </span>
                    ` : ''}
                  </div>

                  <div style="font-size:1.05rem;font-weight:600;color:#fff;line-height:1.5;">
                    ${q.question}
                  </div>

                  <!-- Options -->
                  <div style="display:flex;flex-direction:column;gap:0.5rem;">
                    ${(q.options || []).map((opt, optIdx) => {
                      const isChosen = selected === optIdx;
                      return `
                        <label style="
                          display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;
                          background:${isChosen ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)'};
                          border:1px solid ${isChosen ? 'var(--tp-primary)' : 'var(--tp-border-dark)'};
                          border-radius:var(--radius-sm);cursor:pointer;
                        ">
                          <input type="radio" name="pyq-opt-${idx}" value="${optIdx}" ${isChosen ? 'checked' : ''} ${isSubmitted ? 'disabled' : ''} style="accent-color:var(--tp-primary);" />
                          <span style="font-weight:700;color:var(--tp-text-dark-muted);">${String.fromCharCode(65 + optIdx)}.</span>
                          <span style="color:#fff;">${opt}</span>
                        </label>
                      `;
                    }).join('')}
                  </div>

                  <!-- Explanation after grading -->
                  ${isSubmitted ? `
                    <div style="padding:0.85rem 1rem;background:rgba(99,102,241,0.05);border-left:3px solid var(--tp-primary);border-radius:var(--radius-sm);font-size:0.85rem;color:var(--tp-text-dark-secondary);">
                      <strong>Verified Explanation:</strong> ${q.explanation}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>

          <!-- Actions -->
          <div style="display:flex;justify-content:flex-end;gap:1rem;margin-top:1rem;">
            ${!isGraded ? `
              <button id="btn-grade-pyq" class="tp-btn tp-btn-primary" style="padding:0.75rem 2rem;">
                ✓ Submit & Grade PYQ Drill
              </button>
            ` : `
              <button id="btn-reset-pyq" class="tp-btn tp-btn-secondary">
                🔄 Re-Attempt Drill
              </button>
            `}
          </div>
        </div>
      `;

      // Answer radio handler
      qList.forEach((_, idx) => {
        container.querySelectorAll(`input[name="pyq-opt-${idx}"]`).forEach(radio => {
          radio.addEventListener('change', (e) => {
            paperAnswers[idx] = parseInt(e.target.value, 10);
          });
        });
      });

      container.querySelector('#btn-grade-pyq')?.addEventListener('click', () => {
        isGraded = true;
        renderPaperAttempt();
        Toast.success('PYQ drill evaluated against verified solutions!');
      });

      container.querySelector('#btn-reset-pyq')?.addEventListener('click', () => {
        paperAnswers = {};
        isGraded = false;
        renderPaperAttempt();
      });

      container.querySelector('#btn-exit-pyq')?.addEventListener('click', () => {
        activePaper = null;
        loadView();
      });
    }

    await loadView();
  }
}
