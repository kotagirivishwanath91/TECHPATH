/**
 * TECHPATH — EXAM DETAIL & ADAPTIVE ROADMAP DOSSIER
 * Route: #/exams/:id
 * Overview, Eligibility, Sections, Dynamic Exam-Specific Roadmap, Resources, PYQs, and Mock Drills.
 */

import { dbStore } from '../db/store.js';
import { Toast } from '../components/Toast.js';

export class ExamDetailPage {
  static async render(container, { examId }) {
    if (!examId) {
      window.location.hash = '#/exams';
      return;
    }

    const exams = await dbStore.getAll('exams');
    const exam = exams.find(e => e.id === examId) || exams[0];

    if (!exam) {
      container.innerHTML = `
        <div class="tp-empty-state" style="padding:5rem 2rem;text-align:center;">
          <h1 class="headline-lg">Exam Record Not Found</h1>
          <p class="tp-empty-desc">The requested examination dossier could not be located in the database.</p>
          <a href="#/exams" class="tp-btn tp-btn-primary" style="margin-top:1.5rem">Return to Exam Center</a>
        </div>
      `;
      return;
    }

    // Load related roadmap and PYQs
    const roadmaps = await dbStore.getAll('exam_roadmaps');
    const roadmap = roadmaps.find(r => r.exam_id === exam.id || (exam.id.includes('gate') && r.id === 'rm_gate') || (exam.id.includes('ielts') && r.id === 'rm_ielts') || (exam.id.includes('btech') && r.id === 'rm_btech')) || roadmaps[0];

    const papers = await dbStore.getAll('exam_papers');
    const relatedPapers = papers.filter(p => p.exam_id === exam.id || (exam.target_branch_id && p.branch_id === exam.target_branch_id));

    // Check saved status
    const savedItems = await dbStore.getAll('saved_exams');
    const isSaved = savedItems.some(s => s.exam_id === exam.id);

    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1100px;">
        <!-- Breadcrumb Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <div style="display:flex;gap:0.5rem;align-items:center;margin-bottom:0.5rem;">
              <a href="#/exams" style="color:var(--tp-primary);text-decoration:none;font-size:0.85rem;">← Exam Center</a>
              <span style="color:var(--tp-text-dark-muted);font-size:0.85rem;">/</span>
              <span class="telemetry-chip">${exam.exam_type.toUpperCase()} SPECIFICATION</span>
            </div>
            <h1 class="display-lg" style="margin-top:0.25rem;">${exam.title}</h1>
            <p style="color:var(--tp-text-dark-secondary);">
              Conducted by <strong>${exam.organizing_body || 'Independent Examination Authority'}</strong> • Code: <span class="mono-chip" style="color:var(--tp-primary)">${exam.code || exam.id}</span>
            </p>
          </div>

          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <button id="btn-save-exam" class="tp-btn ${isSaved ? 'tp-btn-secondary' : 'tp-btn-primary'}">
              ${isSaved ? '★ Saved to My Exams' : '☆ Save Exam Goal'}
            </button>
            <a href="#/practice" class="tp-btn tp-btn-secondary">
              ⚡ Practice Questions
            </a>
          </div>
        </div>

        <!-- Official Disclaimer Banner -->
        <div style="padding:0.85rem 1.25rem;background:rgba(245,158,11,0.06);border-left:4px solid #f59e0b;border-radius:var(--radius-sm);font-size:0.85rem;color:var(--tp-text-dark-secondary);line-height:1.5;">
          <strong>Official Information Notice:</strong> TechPath is an independent engineering learning and revision platform. TechPath does not claim official affiliation, partnership, or sponsorship by ${exam.organizing_body || 'the examination board'}. Official brochures and schedules can be verified at:
          ${exam.official_source_url ? `<a href="${exam.official_source_url}" target="_blank" rel="noopener noreferrer" style="color:#f59e0b;font-weight:600;margin-left:0.35rem;">${exam.official_source_url} ↗</a>` : 'Official Portal'}
        </div>

        <!-- Metric Structure Ribbon -->
        <div class="tp-metrics-grid">
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-primary)">⏱️</div>
            <div class="tp-metric-value">${exam.duration_minutes} Mins</div>
            <div class="tp-metric-label">Total Duration</div>
            <div class="tp-metric-sub">Strict Timer Enforced</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-success)">🎯</div>
            <div class="tp-metric-value">${exam.total_marks} Marks</div>
            <div class="tp-metric-label">Maximum Marks</div>
            <div class="tp-metric-sub">${exam.total_questions} Questions</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-accent)">🏛️</div>
            <div class="tp-metric-value">${(exam.sections || []).length}</div>
            <div class="tp-metric-label">Examination Sections</div>
            <div class="tp-metric-sub">Modular Weightage</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:#38bdf8">🎓</div>
            <div class="tp-metric-value">${relatedPapers.length}</div>
            <div class="tp-metric-label">Available PYQs</div>
            <div class="tp-metric-sub">Verified Sourced Papers</div>
          </div>
        </div>

        <!-- 2-Column Overview Dossier -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:1.5rem;">
          <!-- Eligibility & Career Pathway -->
          <div class="tp-card" style="display:flex;flex-direction:column;gap:1rem;">
            <h2 class="headline-md">Eligibility & Qualification Criteria</h2>
            <p style="font-size:0.9rem;color:var(--tp-text-dark-secondary);line-height:1.5;">
              ${exam.eligibility_criteria || 'Consult the official examination gazette for specific departmental eligibility guidelines.'}
            </p>

            <div style="border-top:1px solid var(--tp-border-dark);padding-top:1rem;margin-top:0.5rem;">
              <h3 class="headline-sm" style="margin-bottom:0.35rem;">Career & Postgraduate Trajectory</h3>
              <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);line-height:1.5;">
                ${exam.career_pathway || 'Enables direct eligibility for premier industry roles and accredited postgraduate engineering degrees.'}
              </p>
            </div>
          </div>

          <!-- Section Weightage Breakdown -->
          <div class="tp-card" style="display:flex;flex-direction:column;gap:1rem;">
            <h2 class="headline-md">Section Structure & Marks Distribution</h2>
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              ${(exam.sections || []).map(sec => `
                <div style="padding:0.75rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);display:flex;justify-content:space-between;align-items:center;">
                  <div>
                    <strong style="color:#fff;font-size:0.9rem;">${sec.name}</strong>
                    <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);">${sec.questions_count || '~'} Questions</div>
                  </div>
                  <span class="telemetry-chip" style="color:var(--tp-primary);border-color:var(--tp-primary);">
                    ${sec.marks} Marks
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Syllabus Domains & Important Topics -->
        <div class="tp-card">
          <h2 class="headline-md" style="margin-bottom:0.5rem;">Curriculum Scope & Syllabus Summary</h2>
          <p style="font-size:0.9rem;color:var(--tp-text-dark-secondary);line-height:1.5;margin-bottom:1rem;">
            ${exam.syllabus_summary}
          </p>

          <h3 class="headline-sm" style="margin-bottom:0.5rem;">High-Weightage Target Topics</h3>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            ${(exam.important_topics || []).map(topic => `
              <span class="telemetry-chip" style="color:var(--tp-accent);border-color:var(--tp-accent);padding:0.4rem 0.75rem;">
                ★ ${topic}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Exam-Specific Adaptive Roadmap -->
        ${roadmap ? `
          <div class="tp-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
              <div>
                <h2 class="headline-md">${roadmap.title}</h2>
                <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);">Customized chronological progression designed specifically for ${exam.title}.</p>
              </div>
              <span class="mono-chip" style="color:var(--tp-success)">PHASED CURRICULUM</span>
            </div>

            <div style="display:flex;flex-direction:column;gap:0.75rem;position:relative;">
              ${roadmap.phases.map((p, i) => `
                <div style="display:flex;gap:1rem;align-items:flex-start;padding:0.85rem 1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);">
                  <div style="width:32px;height:32px;border-radius:50%;background:var(--tp-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;flex-shrink:0;">
                    ${p.phase || (i + 1)}
                  </div>
                  <div style="flex:1;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <strong style="color:#fff;font-size:0.95rem;">${p.name}</strong>
                      <span style="font-size:0.75rem;color:var(--tp-text-dark-muted);">${p.duration_days || p.durationDays || 7} Days</span>
                    </div>
                    <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin-top:0.25rem;line-height:1.4;">
                      ${p.focus}
                    </p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Related PYQs and Mock Papers -->
        <div class="tp-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
            <div>
              <h2 class="headline-md">Previous-Year Question Papers & Practice Sets</h2>
              <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary)">Legally cited papers and original inspired problem drills.</p>
            </div>
            <a href="#/exams/pyqs" class="tp-btn tp-btn-secondary tp-btn-sm">
              View All Question Papers →
            </a>
          </div>

          ${relatedPapers.length === 0 ? `
            <p style="font-size:0.85rem;color:var(--tp-text-dark-muted);">No dedicated question papers currently cataloged for this specific examination.</p>
          ` : `
            <div style="display:flex;flex-direction:column;gap:0.75rem;">
              ${relatedPapers.map(paper => `
                <div style="padding:1rem;background:rgba(255,255,255,0.02);border:1px solid var(--tp-border-dark);border-radius:var(--radius-sm);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;">
                  <div>
                    <strong style="color:#fff;font-size:0.95rem;">${paper.title} (${paper.year})</strong>
                    <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);margin-top:0.2rem;">
                      ${paper.subject} • ${paper.total_questions} Questions • ${paper.legal_notice}
                    </div>
                  </div>
                  <div style="display:flex;gap:0.5rem;">
                    ${paper.official_source_url ? `
                      <a href="${paper.official_source_url}" target="_blank" rel="noopener noreferrer" class="tp-btn tp-btn-xs tp-btn-secondary">
                        Official Source ↗
                      </a>
                    ` : ''}
                    <a href="#/exams/pyqs" class="tp-btn tp-btn-xs tp-btn-primary">
                      Solve Paper Questions →
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Preparation Strategy & Tips -->
        <div class="tp-card" style="border-left:4px solid var(--tp-primary);">
          <h2 class="headline-md" style="margin-bottom:0.35rem;">Time Management & Strategic Revision Guidance</h2>
          <p style="font-size:0.9rem;color:var(--tp-text-dark-secondary);line-height:1.5;">
            ${exam.preparation_tips || 'Establish a daily schedule solving high-frequency numerical derivations followed by timed mock tests.'}
          </p>
        </div>
      </div>
    `;

    // Save exam goal toggle
    const saveBtn = container.querySelector('#btn-save-exam');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        try {
          if (isSaved) {
            const saved = (await dbStore.getAll('saved_exams')).find(s => s.exam_id === exam.id);
            if (saved) await dbStore.delete('saved_exams', saved.id);
            Toast.info(`Removed ${exam.title} from My Exams.`);
          } else {
            await dbStore.insert('saved_exams', {
              id: `save_${exam.id}_${Date.now()}`,
              exam_id: exam.id,
              exam_title: exam.title,
              target_date: '2027-02-15',
              created_at: new Date().toISOString()
            });
            Toast.success(`Saved ${exam.title} to My Exams dashboard!`);
          }
          ExamDetailPage.render(container, { examId: exam.id });
        } catch (err) {
          Toast.error(err.message || 'Action failed.');
        }
      });
    }
  }
}
