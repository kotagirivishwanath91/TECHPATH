/**
 * TECHPATH — AI DOUBT SOLVER STUDIO
 * Multi-Modal Engineering Doubt Solver: Text, Diagram/Image, Step-by-Step Derivations,
 * Code Generation in C, C++, Java, Python with Complexity Analysis and Multi-Language Explanations.
 */

import { learningContext } from '../context/LearningContext.js';
import { AIService } from '../services/AIService.js';
import { I18nEngine } from '../services/I18nEngine.js';
import { dbStore } from '../db/store.js';
import { Toast } from '../components/Toast.js';

export class DoubtSolverPage {
  static async render(container) {
    const ctx = learningContext.get();
    const branch = ctx.branch_id || 'cse';

    // Local State
    let activeCodeLang = 'cpp'; // 'cpp' | 'python' | 'java' | 'c'
    let activeMode = 'step_by_step'; // 'step_by_step' | 'simple' | 'detailed' | 'beginner' | 'exam' | 'interview' | 'code'
    let selectedImageFile = null;
    let selectedImageData = null;
    let currentResult = null;

    function renderUI() {
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 1100px; margin: 0 auto; width: 100%;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
                BRANCH: ${branch.toUpperCase()} // AI ENGINEERING DOUBT SOLVER
              </div>
              <h1 class="display-lg">${I18nEngine.t('doubt_solver_title')}</h1>
              <p style="color: var(--tp-text-dark-secondary); max-width: 700px;">
                ${I18nEngine.t('doubt_solver_sub')}
              </p>
            </div>
          </div>

          <!-- Main Input Studio Card -->
          <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Configuration Strip: Programming Language & Explanation Mode -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem;">
              <!-- Code Language Tabs -->
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="mono-chip" style="font-size: 0.75rem;">TARGET CODE:</span>
                <div style="display: flex; gap: 0.35rem; background: rgba(255,255,255,0.03); padding: 0.25rem; border-radius: var(--radius-sm); border: 1px solid var(--tp-border-dark);">
                  <button class="tp-btn ${activeCodeLang === 'cpp' ? 'tp-btn-primary' : 'tp-btn-ghost'} code-lang-btn" data-lang="cpp" style="padding: 0.25rem 0.65rem; font-size: 0.8rem;">C++</button>
                  <button class="tp-btn ${activeCodeLang === 'python' ? 'tp-btn-primary' : 'tp-btn-ghost'} code-lang-btn" data-lang="python" style="padding: 0.25rem 0.65rem; font-size: 0.8rem;">Python</button>
                  <button class="tp-btn ${activeCodeLang === 'java' ? 'tp-btn-primary' : 'tp-btn-ghost'} code-lang-btn" data-lang="java" style="padding: 0.25rem 0.65rem; font-size: 0.8rem;">Java</button>
                  <button class="tp-btn ${activeCodeLang === 'c' ? 'tp-btn-primary' : 'tp-btn-ghost'} code-lang-btn" data-lang="c" style="padding: 0.25rem 0.65rem; font-size: 0.8rem;">C</button>
                </div>
              </div>

              <!-- Explanation Mode Selector -->
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="mono-chip" style="font-size: 0.75rem;">EXPLANATION MODE:</span>
                <select id="doubt-mode-select" class="tp-select tp-select-compact" style="font-size: 0.82rem;">
                  <option value="step_by_step" ${activeMode === 'step_by_step' ? 'selected' : ''}>Step-by-Step Derivation</option>
                  <option value="detailed" ${activeMode === 'detailed' ? 'selected' : ''}>Detailed Technical</option>
                  <option value="simple" ${activeMode === 'simple' ? 'selected' : ''}>Simple Explanation</option>
                  <option value="beginner" ${activeMode === 'beginner' ? 'selected' : ''}>Beginner Mode (Intuitive)</option>
                  <option value="exam" ${activeMode === 'exam' ? 'selected' : ''}>Exam Mode (IS/IEEE Standards)</option>
                  <option value="interview" ${activeMode === 'interview' ? 'selected' : ''}>Interview Mode (Trade-offs)</option>
                  <option value="code" ${activeMode === 'code' ? 'selected' : ''}>Code Architecture Only</option>
                </select>
              </div>
            </div>

            <!-- Question Textarea -->
            <div>
              <label class="tp-spec-label">Engineering Problem / Algorithmic Statement</label>
              <textarea id="doubt-input-text" class="tp-input" style="height: 120px; font-size: 0.95rem; line-height: 1.5; padding: 0.85rem; resize: vertical;" placeholder="${I18nEngine.t('doubt_input_placeholder')}"></textarea>
            </div>

            <!-- Image Upload & Preview Strip -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label class="tp-spec-label" style="margin-bottom: 0;">Upload Problem Screenshot, Handwritten Notes, Circuit, or Diagram</label>
                <span style="font-size: 0.75rem; color: var(--tp-text-dark-muted);">PNG, JPG, WEBP (Max 10MB)</span>
              </div>

              <!-- Drag & Drop Zone -->
              <div id="image-drop-zone" style="border: 2px dashed var(--tp-border-dark); border-radius: var(--radius-sm); padding: 1.25rem; text-align: center; background: rgba(255,255,255,0.01); cursor: pointer; transition: border-color 0.2s;">
                <input type="file" id="image-file-input" accept="image/png,image/jpeg,image/webp" style="display: none;" />
                <div id="drop-zone-prompt" style="display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
                  <span style="font-size: 1.5rem;">📷</span>
                  <span style="font-size: 0.85rem; color: #fff;">Click to select an image, paste from clipboard, or drag & drop</span>
                </div>

                <!-- Preview (Hidden until image selected) -->
                <div id="image-preview-container" style="display: none; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--tp-border-dark); margin-top: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img id="image-preview-thumb" src="" alt="Question Preview" style="width: 48px; height: 48px; object-fit: cover; border-radius: var(--radius-xs); border: 1px solid var(--tp-border-dark);" />
                    <div style="text-align: left;">
                      <div id="image-preview-name" style="font-size: 0.85rem; font-weight: 600; color: #fff;"></div>
                      <div id="image-preview-size" style="font-size: 0.75rem; color: var(--tp-text-dark-muted);"></div>
                    </div>
                  </div>
                  <button id="remove-image-btn" type="button" class="tp-btn tp-btn-ghost" style="color: var(--tp-primary); font-size: 0.8rem; padding: 0.3rem 0.6rem;">
                    ✕ Remove Image
                  </button>
                </div>
              </div>
            </div>

            <!-- Error Banner -->
            <div id="doubt-error-banner" style="display: none; background: rgba(225,29,72,0.1); border: 1px solid var(--tp-primary); border-radius: var(--radius-sm); padding: 0.85rem 1rem; color: #fff; font-size: 0.88rem;"></div>

            <!-- Action Controls Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-top: 1px solid var(--tp-border-dark); padding-top: 1rem;">
              <button id="clear-doubt-btn" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem;">
                ${I18nEngine.t('clear')}
              </button>

              <div style="display: flex; gap: 0.75rem;">
                <button id="solve-doubt-btn" class="tp-btn tp-btn-primary" style="padding: 0.65rem 1.75rem; font-size: 0.95rem; font-weight: 600;">
                  ✨ ${I18nEngine.t('solve')}
                </button>
              </div>
            </div>
          </div>

          <!-- Loading State (Hidden initially) -->
          <div id="doubt-loading-state" style="display: none; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-md); padding: 2.5rem; text-align: center;">
            <div class="pulse-beacon" style="margin: 0 auto 1rem auto; width: 24px; height: 24px;"></div>
            <h3 class="headline-md" style="margin-bottom: 0.5rem;" id="loading-stage-text">Analyzing Question & Telemetry...</h3>
            <p style="color: var(--tp-text-dark-secondary); font-size: 0.85rem;">Synthesizing boundary equations, verifying edge cases, and compiling optimal implementation.</p>
          </div>

          <!-- Results Container (Hidden initially) -->
          <div id="doubt-results-container" style="display: none; flex-direction: column; gap: 1.5rem;"></div>
        </div>
      `;

      attachEventListeners();
    }

    function attachEventListeners() {
      // Code language tabs
      container.querySelectorAll('.code-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCodeLang = btn.getAttribute('data-lang');
          container.querySelectorAll('.code-lang-btn').forEach(b => {
            b.className = `tp-btn ${b.getAttribute('data-lang') === activeCodeLang ? 'tp-btn-primary' : 'tp-btn-ghost'} code-lang-btn`;
          });
          if (currentResult && currentResult.isCodeQuestion) {
            triggerSolve();
          }
        });
      });

      // Explanation mode
      const modeSelect = container.querySelector('#doubt-mode-select');
      modeSelect.addEventListener('change', (e) => {
        activeMode = e.target.value;
        if (currentResult) triggerSolve();
      });

      // Image upload
      const dropZone = container.querySelector('#image-drop-zone');
      const fileInput = container.querySelector('#image-file-input');
      const previewBox = container.querySelector('#image-preview-container');
      const dropPrompt = container.querySelector('#drop-zone-prompt');
      const thumb = container.querySelector('#image-preview-thumb');
      const nameEl = container.querySelector('#image-preview-name');
      const sizeEl = container.querySelector('#image-preview-size');
      const removeBtn = container.querySelector('#remove-image-btn');

      dropZone.addEventListener('click', (e) => {
        if (e.target !== removeBtn && !removeBtn.contains(e.target)) {
          fileInput.click();
        }
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        handleImageSelection(file);
      });

      // Paste from clipboard support
      window.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (const item of items) {
          if (item.kind === 'file' && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            handleImageSelection(file);
            break;
          }
        }
      });

      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedImageFile = null;
        selectedImageData = null;
        fileInput.value = '';
        previewBox.style.display = 'none';
        dropPrompt.style.display = 'flex';
      });

      function handleImageSelection(file) {
        if (file.size > 10 * 1024 * 1024) {
          showError('File size exceeds 10MB limit. Please upload a smaller image.');
          return;
        }

        selectedImageFile = file;
        nameEl.textContent = file.name;
        sizeEl.textContent = `${(file.size / 1024).toFixed(1)} KB`;

        const reader = new FileReader();
        reader.onload = (event) => {
          selectedImageData = event.target.result;
          thumb.src = selectedImageData;
          dropPrompt.style.display = 'none';
          previewBox.style.display = 'flex';
          clearError();
        };
        reader.readAsDataURL(file);
      }

      // Clear button
      container.querySelector('#clear-doubt-btn').addEventListener('click', () => {
        container.querySelector('#doubt-input-text').value = '';
        selectedImageFile = null;
        selectedImageData = null;
        fileInput.value = '';
        previewBox.style.display = 'none';
        dropPrompt.style.display = 'flex';
        clearError();
        container.querySelector('#doubt-results-container').style.display = 'none';
      });

      // Solve button
      container.querySelector('#solve-doubt-btn').addEventListener('click', () => {
        triggerSolve();
      });
    }

    async function triggerSolve() {
      const questionText = container.querySelector('#doubt-input-text').value.trim();
      if (!questionText && !selectedImageData) {
        showError('Please type a technical question or upload an image to solve.');
        return;
      }

      clearError();
      const loadingBox = container.querySelector('#doubt-loading-state');
      const resultsBox = container.querySelector('#doubt-results-container');
      const solveBtn = container.querySelector('#solve-doubt-btn');

      solveBtn.disabled = true;
      loadingBox.style.display = 'block';
      resultsBox.style.display = 'none';

      try {
        const result = await AIService.solveDoubtComprehensive({
          question: questionText,
          imageData: selectedImageData,
          fileName: selectedImageFile ? selectedImageFile.name : '',
          programmingLanguage: activeCodeLang,
          explanationMode: activeMode,
          branch,
          semester: ctx.semester_id || 'sem_3',
          language: ctx.preferred_language || 'en'
        });

        currentResult = result;
        loadingBox.style.display = 'none';
        renderResults(result, resultsBox);
      } catch (err) {
        loadingBox.style.display = 'none';
        showError(err.message || 'An error occurred during doubt analysis.');
      } finally {
        solveBtn.disabled = false;
      }
    }

    function renderResults(result, resultsBox) {
      resultsBox.style.display = 'flex';
      resultsBox.innerHTML = `
        <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- Telemetry Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <span class="telemetry-chip">${result.subject.toUpperCase()}</span>
              <h2 class="headline-md" style="margin-top: 0.25rem;">${result.topic}</h2>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span class="mono-chip" style="color: var(--tp-success);">VERIFIED PROOF</span>
              <button id="save-doubt-library-btn" class="tp-btn tp-btn-secondary" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">
                📥 ${I18nEngine.t('save_library')}
              </button>
            </div>
          </div>

          <!-- Step-by-Step Derivations -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <h3 class="headline-sm" style="color: var(--tp-text-dark-primary);">Step-by-Step Engineering Derivation</h3>
            ${result.steps.map(s => `
              <div style="border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm); padding: 1.15rem; background: rgba(255,255,255,0.01);">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                  <span class="mono-chip" style="color: var(--tp-primary); font-size: 0.72rem;">STEP 0${s.stepNumber}</span>
                  <strong style="color: #fff; font-size: 0.95rem;">${s.title}</strong>
                </div>
                <p style="font-size: 0.9rem; color: var(--tp-text-dark-secondary); line-height: 1.5;">${s.content}</p>
              </div>
            `).join('')}
          </div>

          <!-- Code Generation Box (if code question) -->
          ${result.isCodeQuestion && result.code ? `
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <span class="mono-chip" style="color: var(--tp-primary);">${result.programmingLanguage.toUpperCase()} IMPLEMENTATION</span>
                  <span class="mono-chip" style="color: var(--tp-text-dark-muted);">${result.timeComplexity}</span>
                  <span class="mono-chip" style="color: var(--tp-text-dark-muted);">${result.spaceComplexity}</span>
                </div>
                <button id="copy-code-btn" class="tp-btn tp-btn-secondary" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">
                  📋 ${I18nEngine.t('copy_code')}
                </button>
              </div>

              <!-- Code pre block -->
              <pre style="background: #090d16; border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm); padding: 1.25rem; overflow-x: auto; font-family: var(--font-mono); font-size: 0.88rem; line-height: 1.5; color: #38bdf8;"><code id="doubt-code-block">${escapeHtml(result.code)}</code></pre>

              <!-- Expected Output -->
              <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm); padding: 0.75rem 1rem; font-family: var(--font-mono); font-size: 0.82rem; color: var(--tp-text-dark-secondary);">
                <strong style="color: #fff;">Expected Execution Output:</strong> ${result.expectedOutput}
              </div>
            </div>
          ` : ''}

          <!-- Final Answer Card -->
          <div style="background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.3); border-radius: var(--radius-sm); padding: 1.25rem;">
            <span class="mono-chip" style="color: var(--tp-success); font-size: 0.75rem;">FINAL CONCLUSION & OUTCOME</span>
            <p style="font-size: 1rem; font-weight: 600; color: #fff; margin-top: 0.35rem; line-height: 1.5;">
              ${result.finalAnswer}
            </p>
          </div>

          <!-- Common Pitfalls & Traps -->
          ${result.commonMistakes && result.commonMistakes.length > 0 ? `
            <div style="border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm); padding: 1.15rem; background: rgba(255,255,255,0.01);">
              <span class="mono-chip" style="color: var(--tp-warning); font-size: 0.72rem;">CRITICAL EDGE CASES & MISTAKES TO AVOID</span>
              <ul style="margin: 0.5rem 0 0 1.25rem; font-size: 0.88rem; color: var(--tp-text-dark-secondary); line-height: 1.5;">
                ${result.commonMistakes.map(m => `<li>${m}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- Concept & Related Topics -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-top: 1px solid var(--tp-border-dark); padding-top: 1rem;">
            <div>
              <span class="mono-chip" style="color: var(--tp-text-dark-muted); font-size: 0.72rem;">CORE UNDERLYING CONCEPT</span>
              <p style="font-size: 0.88rem; color: #fff; margin-top: 0.25rem;">${result.explanation}</p>
            </div>

            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${result.relatedConcepts.map(rc => `<span class="mono-chip" style="font-size: 0.72rem;">${rc}</span>`).join('')}
            </div>
          </div>
        </div>
      `;

      // Copy Code handler
      const copyBtn = resultsBox.querySelector('#copy-code-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(result.code);
          copyBtn.textContent = '✓ Copied!';
          Toast.success('Code copied to clipboard!');
          setTimeout(() => { copyBtn.textContent = `📋 ${I18nEngine.t('copy_code')}`; }, 2000);
        });
      }

      // Save to Library handler
      const saveBtn = resultsBox.querySelector('#save-doubt-library-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
          try {
            await dbStore.insert('library_items', {
              id: 'item_doubt_' + Date.now(),
              user_id: 'usr_guest',
              title: `${result.topic} — ${result.isCodeQuestion ? activeCodeLang.toUpperCase() : 'Solution'}`,
              category: 'notes',
              branch_id: branch,
              semester_id: ctx.semester_id || 'sem_3',
              tags: [branch, result.subject, activeCodeLang],
              content_preview: result.finalAnswer,
              created_at: new Date().toISOString()
            });
            saveBtn.textContent = '✓ Saved in Library';
            saveBtn.disabled = true;
            Toast.success('Saved to your Resource Library!');
          } catch (e) {
            Toast.error(`Could not save: ${e.message}`);
          }
        });
      }

      resultsBox.scrollIntoView({ behavior: 'smooth' });
    }

    function showError(msg) {
      const banner = container.querySelector('#doubt-error-banner');
      if (banner) {
        banner.style.display = 'block';
        banner.textContent = msg;
      }
    }

    function clearError() {
      const banner = container.querySelector('#doubt-error-banner');
      if (banner) {
        banner.style.display = 'none';
        banner.textContent = '';
      }
    }

    function escapeHtml(text) {
      return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    renderUI();

    const pendingDoubt = sessionStorage.getItem('TP_PENDING_DOUBT');
    if (pendingDoubt) {
      sessionStorage.removeItem('TP_PENDING_DOUBT');
      const textInput = container.querySelector('#doubt-input-text');
      if (textInput) {
        textInput.value = pendingDoubt;
        triggerSolve();
      }
    }
  }
}
