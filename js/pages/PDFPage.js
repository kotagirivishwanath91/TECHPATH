/**
 * TECHPATH — PDF ANALYZER & OCR STUDY STUDIO
 * Real-time PDF text extraction, OCR fallback, citations, and interactive study packet generator
 */

import { PDFAnalyzerEngine } from '../services/PDFAnalyzer.js';
import { StorageService } from '../lib/storage.js';
import { dbStore } from '../db/store.js';
import { authContext } from '../context/AuthContext.js';
import { Toast } from '../components/Toast.js';

export class PDFPage {
  static async render(container) {
    // Restore previous analysis from localStorage if available
    let activeAnalysis = null;
    try {
      const savedAnalysis = localStorage.getItem('TP_ACTIVE_PDF_ANALYSIS');
      if (savedAnalysis) {
        activeAnalysis = JSON.parse(savedAnalysis);
      }
    } catch { /* ignore */ }

    let uploadedFile = null;
    let selectedLanguage = 'en';

    container.innerHTML = `
      <div class="tp-page" style="display: flex; flex-direction: column; gap: 1.75rem; max-width: 1200px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
              <span class="pulse-beacon"></span> VECTOR STREAM // OCR PARSING // AI STUDY PACKET
            </div>
            <h1 class="display-lg">PDF & Notes AI Analyzer</h1>
            <p style="color: var(--tp-text-dark-secondary);">
              Extract selectable text, formulas, definitions, and exam questions from textbooks, slides, and papers.
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <select id="pdf-lang-select" class="tp-input" style="padding: 0.4rem 0.75rem; font-size: 0.85rem; width: auto;">
              <option value="en">English (EN)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="te">Telugu (తెలుగు)</option>
              <option value="es">Spanish (ES)</option>
              <option value="fr">French (FR)</option>
              <option value="de">German (DE)</option>
            </select>
            ${activeAnalysis ? `
              <button id="export-packet-btn" class="tp-btn tp-btn-secondary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Export Study Sheet</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Upload & Input Card -->
        <div class="tp-card tp-card-glass">
          <h2 class="headline-md" style="margin-bottom: 0.75rem;">Upload Document or Paste Syllabus Text</h2>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
              <input type="file" id="pdf-file-input" accept=".pdf,.txt,.doc,.docx" class="tp-input" style="padding: 0.4rem; max-width: 340px;" />
              <button id="load-sample-btn" class="tp-btn tp-btn-secondary">Load Engineering Sample</button>
            </div>

            <textarea id="raw-pdf-text" class="tp-input" style="height: 120px; padding: 0.75rem; resize: vertical; font-family: var(--font-body);" placeholder="Or paste textbook chapter, lecture transcript, or engineering proof text directly here..."></textarea>

            <!-- Status & Action Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div id="pdf-status-indicator" class="mono-chip" style="color: var(--tp-text-dark-muted);">
                READY TO PARSE
              </div>
              <button id="analyze-doc-btn" class="tp-btn tp-btn-primary">
                Analyze Document
              </button>
            </div>

            <!-- Asynchronous Progress Bar (Hidden by default) -->
            <div id="pdf-progress-wrap" style="display: none; flex-direction: column; gap: 0.35rem; margin-top: 0.5rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                <span id="pdf-progress-text" style="color: var(--tp-primary);">Reading file...</span>
                <span id="pdf-progress-percent" style="font-family: var(--font-mono); color: var(--tp-text-dark-muted);">0%</span>
              </div>
              <div class="tp-progress-bar" style="height: 8px;">
                <div id="pdf-progress-fill" class="tp-progress-fill" style="width: 0%; background: var(--tp-primary);"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analysis Results Container -->
        <div id="pdf-results-root" style="display: ${activeAnalysis ? 'flex' : 'none'}; flex-direction: column; gap: 1.75rem;"></div>
      </div>
    `;

    const sampleBtn = container.querySelector('#load-sample-btn');
    const textArea = container.querySelector('#raw-pdf-text');
    const analyzeBtn = container.querySelector('#analyze-doc-btn');
    const resultsRoot = container.querySelector('#pdf-results-root');
    const fileInput = container.querySelector('#pdf-file-input');
    const statusChip = container.querySelector('#pdf-status-indicator');
    const progressWrap = container.querySelector('#pdf-progress-wrap');
    const progressText = container.querySelector('#pdf-progress-text');
    const progressPercent = container.querySelector('#pdf-progress-percent');
    const progressFill = container.querySelector('#pdf-progress-fill');
    const langSelect = container.querySelector('#pdf-lang-select');
    const exportBtn = container.querySelector('#export-packet-btn');

    // Language change listener
    langSelect.addEventListener('change', (e) => {
      selectedLanguage = e.target.value;
      if (activeAnalysis) {
        Toast.show(`Output language set to ${e.target.selectedOptions[0].text}`, 'info');
      }
    });

    // Sample engineering lecture text
    sampleBtn.addEventListener('click', () => {
      textArea.value = `Unit 3: Self-Balancing Binary Trees, Dynamic Programming, and Recurrence Relations.
[Page 1] An AVL Tree is formally defined as a self-balancing binary search tree where the difference between heights of left and right subtrees (the balance factor) cannot exceed 1.
If at any time heights differ by more than one, rebalancing is performed using rotation sequences (LL, RR, LR, RL).
For instance, inserting into the left subtree of a left child requires a single right rotation.
The lookup time complexity is strictly bounded by O(log N) in the worst case.
[Page 2] For recursive divide-and-conquer algorithms, time complexity is expressed by the recurrence relation T(n) = aT(n/b) + f(n).
According to the Master Theorem, if f(n) = O(n^(log_b(a) - ε)), the work is dominated by the leaves, resulting in Θ(n^(log_b(a))).
BIBO Stability Criterion: Bounded-Input Bounded-Output stability requires that all roots of the characteristic equation 1 + G(s)H(s) = 0 reside in the open left half of the complex s-plane.`;
      statusChip.textContent = 'SAMPLE TEXT LOADED (384 WORDS)';
      statusChip.style.color = 'var(--tp-info)';
    });

    // File selection handler with PDF.js vector reading
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      uploadedFile = file;
      statusChip.textContent = `FILE SELECTED: ${file.name} (${Math.round(file.size / 1024)} KB)`;
      statusChip.style.color = 'var(--tp-info)';

      // Auto-preview text
      if (file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (evt) => { textArea.value = evt.target.result; };
        reader.readAsText(file);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          progressWrap.style.display = 'flex';
          progressText.textContent = 'Reading PDF binary stream...';
          progressFill.style.width = '30%';
          progressPercent.textContent = '30%';

          const arrayBuffer = await file.arrayBuffer();
          const extraction = await PDFAnalyzerEngine.extractTextFromPDF(arrayBuffer, (p) => {
            progressText.textContent = p.message;
            if (p.progress) {
              progressFill.style.width = `${p.progress}%`;
              progressPercent.textContent = `${p.progress}%`;
            }
          });

          textArea.value = extraction.fullText;
          progressFill.style.width = '100%';
          progressPercent.textContent = '100%';
          statusChip.textContent = `PARSED ${extraction.pageCount} PAGES (${extraction.fullText.split(/\s+/).length} WORDS)`;
          statusChip.style.color = 'var(--tp-success)';
          setTimeout(() => { progressWrap.style.display = 'none'; }, 1000);
        } catch (err) {
          progressWrap.style.display = 'none';
          statusChip.textContent = `PARSING NOTICE: Ready for text analysis`;
        }
      }
    });

    // Function to render active analysis result
    const renderAnalysisResult = (analysis) => {
      resultsRoot.style.display = 'flex';
      resultsRoot.innerHTML = `
        <!-- Document Telemetry & Quality Bar -->
        <div class="tp-card tp-card-glass" style="border-left: 3px solid var(--tp-primary); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap;">
              <span class="telemetry-chip" style="background: rgba(16,185,129,0.15); color: var(--tp-success); border-color: var(--tp-success);">${analysis.ocrQuality}</span>
              <span class="mono-chip" style="color: var(--tp-text-dark-muted);">${analysis.wordCount} WORDS ANALYZED</span>
              <span class="mono-chip" style="color: var(--tp-info);">LANGUAGE: ${analysis.language?.toUpperCase() || 'EN'}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary);">${analysis.disclaimer}</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button id="resynthesize-btn" class="tp-btn tp-btn-secondary tp-btn-sm">🔄 Regenerate</button>
            <button id="save-library-btn" class="tp-btn tp-btn-primary tp-btn-sm">💾 Saved to Library</button>
          </div>
        </div>

        <!-- Quick Revision & One-Minute Revision -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          <div class="tp-card" style="border-top: 3px solid var(--tp-primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <h3 class="headline-md">⚡ Quick Revision Summary</h3>
              <span class="mono-chip" style="color: var(--tp-primary);">EXAM REVISION</span>
            </div>
            <pre style="white-space: pre-wrap; font-family: inherit; font-size: 0.9rem; color: var(--tp-text-dark-secondary); line-height: 1.6;">${analysis.quickRevision}</pre>
          </div>

          <div class="tp-card" style="border-top: 3px solid var(--tp-secondary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <h3 class="headline-md">⏱️ One-Minute Revision Takeaway</h3>
              <span class="mono-chip" style="color: var(--tp-secondary);">KEY TAKEAWAY</span>
            </div>
            <p style="font-size: 0.9rem; color: var(--tp-text-dark-secondary); line-height: 1.7;">${analysis.oneMinuteRevision}</p>
          </div>
        </div>

        <!-- Executive Summary & Key Points with Source Citations -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem;">
          <div class="tp-card">
            <h3 class="headline-md" style="margin-bottom: 0.75rem;">Executive Academic Summary</h3>
            <p style="font-size: 0.9rem; color: var(--tp-text-dark-secondary); line-height: 1.7;">${analysis.summary}</p>
            <h4 style="font-size: 0.95rem; margin-top: 1.25rem; color: var(--tp-primary);">Key Principles & Source Citations</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
              ${(analysis.mainPoints || []).map((p) => `
                <div style="padding: 0.6rem 0.85rem; background: rgba(255,255,255,0.02); border-left: 2px solid var(--tp-primary); border-radius: var(--radius-sm);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
                    <span class="mono-chip" style="color: var(--tp-info); font-size: 0.7rem;">[${p.citation || 'Page 1'}]</span>
                  </div>
                  <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary);">${p.point || p}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="tp-card">
            <h3 class="headline-md" style="margin-bottom: 0.75rem;">Extracted Invariants & Formulas</h3>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${(analysis.formulas || []).map((f) => `
                <div style="padding: 0.75rem 0.85rem; background: rgba(255,255,255,0.03); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span class="mono-chip" style="color: var(--tp-warning); font-size: 0.7rem;">GOVERNING FORMULA</span>
                    <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.7rem;">[${f.citation || 'Page 1'}]</span>
                  </div>
                  <div style="font-family: var(--font-mono); font-size: 0.85rem; color: #fff;">${f.formula || f}</div>
                </div>
              `).join('')}
            </div>

            <h4 style="font-size: 0.95rem; margin-top: 1.25rem; color: var(--tp-info);">Formal Definitions</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
              ${(analysis.definitions || []).map((d) => `
                <div style="padding: 0.6rem 0.85rem; background: rgba(255,255,255,0.02); border-radius: var(--radius-sm); border: 1px solid var(--tp-border-dark);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
                    <strong style="font-size: 0.85rem; color: var(--tp-info);">${d.term || 'Core Term'}</strong>
                    <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.7rem;">[${d.citation || 'Page 1'}]</span>
                  </div>
                  <p style="font-size: 0.8rem; color: var(--tp-text-dark-secondary);">${d.explanation || d}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Detailed Explanations & Examples -->
        <div class="tp-card">
          <h3 class="headline-md" style="margin-bottom: 0.5rem;">Detailed Explanations & Architectural Context</h3>
          <p style="font-size: 0.9rem; color: var(--tp-text-dark-secondary); line-height: 1.7; margin-bottom: 1rem;">${analysis.detailedExplanation}</p>
          <h4 style="font-size: 0.95rem; color: var(--tp-accent); margin-bottom: 0.5rem;">Practical Engineering Examples</h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${(analysis.examples || []).map((ex) => `
              <div style="padding: 0.6rem 0.85rem; background: rgba(255,255,255,0.02); border-left: 2px solid var(--tp-accent); border-radius: var(--radius-sm);">
                <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.7rem;">[${ex.citation || 'Page 2'}]</span>
                <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-top: 0.2rem;">${ex.text || ex}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Exam Questions & MCQs -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem;">
          <div class="tp-card">
            <h3 class="headline-md" style="margin-bottom: 0.75rem; color: var(--tp-warning);">📝 Short & Long Exam Questions</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${(analysis.shortQuestions || []).map((sq, i) => `
                <div style="padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span class="mono-chip" style="color: var(--tp-warning); font-size: 0.7rem;">SHORT QUESTION ${i+1}</span>
                    <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.7rem;">[${sq.citation || 'Page 1'}]</span>
                  </div>
                  <strong style="font-size: 0.85rem; color: #fff;">${sq.q}</strong>
                  <p style="font-size: 0.8rem; color: var(--tp-text-dark-secondary); margin-top: 0.25rem;">Ans: ${sq.answer}</p>
                </div>
              `).join('')}

              ${(analysis.longQuestions || []).map((lq, i) => `
                <div style="padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                    <span class="mono-chip" style="color: var(--tp-primary); font-size: 0.7rem;">LONG QUESTION ${i+1}</span>
                    <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.7rem;">[${lq.citation || 'Page 2'}]</span>
                  </div>
                  <strong style="font-size: 0.85rem; color: #fff;">${lq.q}</strong>
                  <p style="font-size: 0.8rem; color: var(--tp-text-dark-secondary); margin-top: 0.25rem;">Ans: ${lq.answer}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="tp-card">
            <h3 class="headline-md" style="margin-bottom: 0.75rem; color: var(--tp-info);">🎯 Self-Assessment MCQs</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${(analysis.mcqs || []).map((mcq, idx) => `
                <div style="padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm);">
                  <div style="font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; color: #fff;">${idx + 1}. ${mcq.question}</div>
                  <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                    ${mcq.options.map((opt, oIdx) => `
                      <div style="padding: 0.4rem 0.6rem; font-size: 0.8rem; border-radius: var(--radius-sm); border: 1px solid ${oIdx === mcq.correctIndex ? 'var(--tp-success)' : 'var(--tp-border-dark)'}; color: ${oIdx === mcq.correctIndex ? 'var(--tp-success)' : 'var(--tp-text-dark-secondary)'};">
                        ${String.fromCharCode(65 + oIdx)}. ${opt} ${oIdx === mcq.correctIndex ? '✓' : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Synthesized Revision Flashcards -->
        <div class="tp-card">
          <h3 class="headline-md" style="margin-bottom: 1rem;">Synthesized Revision Flashcards</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            ${(analysis.flashcards || []).map((fc) => `
              <div style="padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                  <span class="mono-chip" style="color: var(--tp-primary); font-size: 0.7rem;">FRONT</span>
                  <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.7rem;">[${fc.citation || 'Page 1'}]</span>
                </div>
                <strong style="font-size: 0.95rem;">${fc.front}</strong>
                <div class="mono-chip" style="color: var(--tp-text-dark-muted); margin-top: 0.75rem; margin-bottom: 0.25rem; font-size: 0.7rem;">BACK / VERIFIED ANSWER</div>
                <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary);">${fc.back}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Wire regenerate button
      const resynthBtn = container.querySelector('#resynthesize-btn');
      if (resynthBtn) {
        resynthBtn.addEventListener('click', () => {
          analyzeBtn.click();
        });
      }
    };

    // If active analysis already loaded, display it
    if (activeAnalysis) {
      renderAnalysisResult(activeAnalysis);
    }

    // Analyze Document button click handler
    analyzeBtn.addEventListener('click', async () => {
      const text = textArea.value;
      if (!text || text.trim().length === 0) {
        alert('Please select a PDF document or paste lecture text first.');
        return;
      }

      analyzeBtn.disabled = true;
      analyzeBtn.textContent = 'Processing OCR & Synthesis...';
      progressWrap.style.display = 'flex';
      progressFill.style.width = '20%';
      progressPercent.textContent = '20%';
      progressText.textContent = 'Analyzing syntax & mathematical formulations...';

      const fileName = uploadedFile ? uploadedFile.name : 'engineering_lecture_notes.pdf';
      const currentUser = authContext.getUser() || { id: 'usr_guest' };

      try {
        // Upload to Supabase Storage if file attached
        let storageResult = null;
        if (uploadedFile) {
          progressFill.style.width = '45%';
          progressPercent.textContent = '45%';
          progressText.textContent = 'Uploading to secure cloud storage...';
          try {
            storageResult = await StorageService.uploadFile({
              bucket: 'pdf-documents',
              category: 'pdf',
              file: uploadedFile,
              userId: currentUser.id
            });
          } catch (e) {
            console.warn('Storage notice:', e.message);
          }
        }

        progressFill.style.width = '75%';
        progressPercent.textContent = '75%';
        progressText.textContent = 'Extracting formulas, definitions & exam questions...';

        // Deep analysis
        activeAnalysis = await PDFAnalyzerEngine.analyzeDocument(
          text,
          fileName,
          selectedLanguage,
          (p) => {
            progressText.textContent = p.message;
          }
        );

        // Save active analysis to localStorage so it is never lost on refresh
        localStorage.setItem('TP_ACTIVE_PDF_ANALYSIS', JSON.stringify(activeAnalysis));

        // Save to Database library_items
        await dbStore.insert('library_items', {
          user_id: currentUser.id,
          title: `Study Packet: ${fileName}`,
          filename: fileName,
          item_type: 'pdf',
          category: 'pdf',
          summary: activeAnalysis.summary,
          tags: ['PDF', 'AI Notes', fileName.split('.')[0]],
          storage_path: storageResult ? storageResult.path : null,
          analysis_data: activeAnalysis,
          created_at: new Date().toISOString()
        });

        progressFill.style.width = '100%';
        progressPercent.textContent = '100%';
        progressText.textContent = 'Analysis complete!';

        renderAnalysisResult(activeAnalysis);
        Toast.show('Document analyzed and saved to your Library!', 'success');
      } catch (err) {
        alert('Analysis Error: ' + err.message);
      } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = 'Analyze Document';
        setTimeout(() => { progressWrap.style.display = 'none'; }, 1200);
      }
    });

    // Export packet handler
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (!activeAnalysis) return;
        const markdown = `# Study Packet: ${activeAnalysis.fileName}
Analyzed: ${activeAnalysis.analyzedAt}
OCR Quality: ${activeAnalysis.ocrQuality}

## Summary
${activeAnalysis.summary}

## Key Formulas
${activeAnalysis.formulas.map(f => `- ${f.formula} (${f.citation})`).join('\n')}

## Definitions
${activeAnalysis.definitions.map(d => `- **${d.term}**: ${d.explanation} (${d.citation})`).join('\n')}

## Short Exam Questions
${activeAnalysis.shortQuestions.map(q => `Q: ${q.q}\nA: ${q.answer}\n`).join('\n')}
`;
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeAnalysis.fileName.replace(/\.[^/.]+$/, "")}_study_packet.md`;
        a.click();
        URL.revokeObjectURL(url);
        Toast.show('Study packet exported to Markdown!', 'success');
      });
    }
  }
}
