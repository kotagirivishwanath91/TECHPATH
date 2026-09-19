/**
 * TECHPATH — 3D ENGINEERING VISUALIZER & COMPONENT INSPECTOR
 * Interactive Three.js WebGL Viewport with Exploded View, Cross-Section,
 * Dynamic Component Switcher, AI Doubt Solver Integration, Mini-Quiz, and Accessible 2D Fallback.
 */

import { learningContext } from '../context/LearningContext.js';
import { ContentFilterEngine } from '../services/ContentFilter.js';
import { ThreeDEngine } from '../services/ThreeDEngine.js';
import { I18nEngine } from '../services/I18nEngine.js';
import { Toast } from '../components/Toast.js';

export class ThreeDPage {
  static async render(container) {
    const ctx = learningContext.get();
    const models = await ContentFilterEngine.get3DModels(ctx.branch_id, ctx.semester_id);
    let activeModelIndex = 0;
    let activeComponentIndex = 0;
    let activeModel = models[activeModelIndex] || null;
    let show2D = false;
    let showQuiz = false;
    let engine = null;

    function renderPage() {
      if (!activeModel) {
        container.innerHTML = `
          <div class="tp-page" style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 1100px;">
            <div class="telemetry-chip">BRANCH: ${ctx.branch_id.toUpperCase()} // 3D PRECISION TELEMETRY</div>
            <div class="tp-empty-state" style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-md); padding: 3.5rem 1.5rem; text-align: center;">
              <div class="tp-empty-icon" style="font-size: 3rem; margin-bottom: 1rem;">🔬</div>
              <h2 class="tp-empty-title" style="color: #fff; font-size: 1.3rem; margin-bottom: 0.5rem;">3D Engineering In Preparation</h2>
              <p class="tp-empty-desc" style="color: var(--tp-text-dark-secondary); max-width: 550px; margin: 0 auto 1.5rem auto; line-height: 1.6;">
                Content for this branch and semester is currently being prepared.
              </p>
              <a href="#/learning" class="tp-btn tp-btn-secondary">Explore Branch Subjects in LearnHub</a>
            </div>
          </div>
        `;
        return;
      }

      const activeComp = activeModel.components?.[activeComponentIndex] || activeModel.components?.[0] || {
        name: 'Core Architectural Component',
        what: activeModel.description,
        why: activeModel.learning_objective,
        how: 'Operates through physical state transitions and synchronized timing edges.',
        inputs: 'System Potential & Clock Signal',
        outputs: 'Telemetry Telemetry States',
        interview_questions: ['Explain the primary performance bottleneck of this component.']
      };

      container.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- Header Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div class="telemetry-chip" style="margin-bottom: 0.25rem;">
                BRANCH: ${ctx.branch_id.toUpperCase()} // 3D PRECISION TELEMETRY
              </div>
              <h1 class="headline-xl">${activeModel.name}</h1>
            </div>

            <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
              ${models.length > 1 ? `
                <select id="model-select-dropdown" class="tp-select tp-select-compact" style="font-size: 0.82rem; max-width: 240px;">
                  ${models.map((m, idx) => `
                    <option value="${idx}" ${idx === activeModelIndex ? 'selected' : ''}>${m.name}</option>
                  `).join('')}
                </select>
              ` : ''}

              <button id="toggle-quiz-btn" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem;">
                🎯 <span>${showQuiz ? 'Hide Mini-Quiz' : 'Component Mini-Quiz'}</span>
              </button>

              <button id="toggle-2d-btn" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                <span>${show2D ? '3D WebGL Mode' : 'Accessible 2D Mode'}</span>
              </button>

              <button id="reset-cam-btn" class="tp-btn tp-btn-ghost" style="font-size: 0.85rem;">Reset Camera</button>
            </div>
          </div>

          <!-- Component Selection Ribbon -->
          ${(activeModel.components && activeModel.components.length > 0) ? `
            <div style="display: flex; align-items: center; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.25rem;">
              <span class="mono-chip" style="font-size: 0.75rem; white-space: nowrap;">INSPECT COMPONENT:</span>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${activeModel.components.map((c, i) => `
                  <button class="tp-btn ${i === activeComponentIndex ? 'tp-btn-primary' : 'tp-btn-ghost'} comp-tab-btn" data-index="${i}" style="padding: 0.3rem 0.75rem; font-size: 0.8rem; border-radius: 9999px;">
                    ${c.name}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Mini-Quiz Container (Collapsible) -->
          <div id="tp-mini-quiz-box" style="display: ${showQuiz ? 'block' : 'none'}; background: rgba(225,29,72,0.06); border: 1px solid rgba(225,29,72,0.3); border-radius: var(--radius-md); padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <div>
                <span class="mono-chip" style="color: var(--tp-primary);">TELEMETRY VERIFICATION // MINI QUIZ</span>
                <h3 style="font-size: 1.1rem; color: #fff; margin-top: 0.25rem;">Test Your Understanding: ${activeComp.name}</h3>
              </div>
              <button id="close-quiz-btn" class="tp-btn tp-btn-ghost" style="padding: 0.25rem 0.5rem; font-size: 0.85rem;">✕ Close</button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <p style="font-size: 0.95rem; color: #fff;">
                <strong>Question:</strong> ${activeComp.interview_questions?.[0] || `Explain the core physical operating principles and primary failure modes of ${activeComp.name}.`}
              </p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                <button class="tp-btn tp-btn-ghost quiz-opt-btn" data-correct="true" style="justify-content: flex-start; text-align: left; padding: 0.75rem 1rem; border: 1px solid var(--tp-border-dark);">
                  A) Governed by: ${activeComp.how ? activeComp.how.slice(0, 75) + '...' : 'Fundamental transfer dynamics.'}
                </button>
                <button class="tp-btn tp-btn-ghost quiz-opt-btn" data-correct="false" style="justify-content: flex-start; text-align: left; padding: 0.75rem 1rem; border: 1px solid var(--tp-border-dark);">
                  B) Operates with unconstrained unbounded latency disregarding physical laws.
                </button>
              </div>
              <div id="quiz-feedback-box" style="display: none; padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.88rem;"></div>
            </div>
          </div>

          <!-- 3D & Inspector Layout -->
          <div class="tp-3d-layout">
            <!-- Left Viewport -->
            <div id="tp-viewport-wrapper" class="tp-3d-viewport">
              <div id="three-canvas-root" style="width: 100%; height: 100%; display: ${show2D ? 'none' : 'block'};"></div>

              <!-- 2D Accessible View Container -->
              <div id="two-d-root" class="tp-accessible-2d-canvas" style="display: ${show2D ? 'flex' : 'none'}; flex-direction: column; gap: 1rem; padding: 1.25rem; background: rgba(15,23,42,0.7); overflow-y: auto; max-height: 520px; border-radius: var(--radius-md);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h3 class="headline-md" style="color: var(--tp-primary); font-size: 1.15rem; margin-bottom: 0.2rem;">${activeModel.name}</h3>
                    <p style="color: var(--tp-text-dark-secondary); font-size: 0.82rem; margin: 0;">Accessible 2D structural schematic with component callouts and signal flows.</p>
                  </div>
                  <span class="mono-chip" style="color: var(--tp-info);">2D TECHNICAL SCHEMATIC</span>
                </div>
                ${activeModel.svg_diagram ? `
                  <div style="width: 100%; border-radius: 8px; overflow: hidden; border: 1px solid var(--tp-border-dark);">
                    ${activeModel.svg_diagram}
                  </div>
                ` : ''}
              </div>

              <!-- Floating Telemetry HUD -->
              <div class="tp-3d-hud" style="display: ${show2D ? 'none' : 'flex'};">
                <span class="telemetry-chip">
                  <span class="pulse-beacon"></span>
                  LOD: LEVEL_01 // 60 FPS
                </span>
                <span class="mono-chip" style="color: var(--tp-text-dark-muted);">TOUCH / DRAG TO ROTATE & PINCH ZOOM</span>
              </div>

              <!-- Bottom HUD Controls -->
              <div id="viewport-bottom-hud" class="tp-hud-controls" style="display: ${show2D ? 'none' : 'flex'};">
                <div class="tp-slider-wrap">
                  <span>EXPLODE:</span>
                  <input id="explode-range" type="range" min="0" max="1" step="0.01" value="0" style="width: 110px;" />
                </div>
                <div style="height: 18px; width: 1px; background: var(--tp-border-dark);"></div>
                <button id="cross-sec-btn" class="tp-btn tp-btn-ghost" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">
                  Cross-Section
                </button>
              </div>
            </div>

            <!-- Right Inspector Panel -->
            <div class="tp-inspector-panel">
              <div class="tp-inspector-header">
                <div>
                  <span class="mono-chip" style="color: var(--tp-text-dark-muted);">COMPONENT INSPECTION</span>
                  <h3 id="inspector-comp-name" style="font-size: 1.15rem; margin-top: 0.25rem; color: #fff;">
                    ${activeComp.name}
                  </h3>
                </div>
              </div>

              <div class="tp-inspector-body">
                <div class="tp-spec-row">
                  <span class="tp-spec-label">What is it?</span>
                  <p id="inspector-what" class="tp-spec-val">${activeComp.what || activeModel.description}</p>
                </div>

                <div class="tp-spec-row">
                  <span class="tp-spec-label">Why it matters:</span>
                  <p id="inspector-why" class="tp-spec-val">${activeComp.why || activeModel.learning_objective}</p>
                </div>

                <div class="tp-spec-row">
                  <span class="tp-spec-label">How it works:</span>
                  <p id="inspector-how" class="tp-spec-val">${activeComp.how || 'Executes through physical bus states and clock edge synchronizations.'}</p>
                </div>

                <div class="tp-spec-row">
                  <span class="tp-spec-label">Inputs / Outputs:</span>
                  <p id="inspector-io" class="tp-spec-val">
                    <strong>In:</strong> ${activeComp.inputs || 'System Voltage & Reference Clock'}<br/>
                    <strong>Out:</strong> ${activeComp.outputs || 'Telemetry Bus Data & Physical Displacement'}
                  </p>
                </div>

                <div class="tp-spec-row" style="border-top: 1px solid var(--tp-border-dark); padding-top: 1rem;">
                  <span class="tp-spec-label" style="color: var(--tp-primary);">Interview Question Trigger:</span>
                  <p id="inspector-iq" class="tp-spec-val" style="font-size: 0.85rem; font-style: italic; color: #fff;">
                    "${activeComp.interview_questions?.[0] || 'Explain the latency penalty and thermal failure modes of this component under peak load.'}"
                  </p>
                </div>

                <!-- Ask AI Button -->
                <button id="ask-ai-comp-btn" class="tp-btn tp-btn-primary" style="width: 100%; margin-top: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.88rem; font-weight: 600;">
                  <span>✨ Ask AI Doubt Solver About This Component</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      bindEvents();
    }

    function bindEvents() {
      // Initialize 3D Engine on canvas
      const canvasRoot = container.querySelector('#three-canvas-root');
      if (canvasRoot && !show2D) {
        engine = new ThreeDEngine(canvasRoot);
        engine.loadModel(activeModel);
      }

      // Model Switcher Dropdown
      const modelDropdown = container.querySelector('#model-select-dropdown');
      if (modelDropdown) {
        modelDropdown.addEventListener('change', (e) => {
          activeModelIndex = parseInt(e.target.value, 10);
          activeComponentIndex = 0;
          activeModel = models[activeModelIndex];
          renderPage();
        });
      }

      // Component Tabs
      container.querySelectorAll('.comp-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeComponentIndex = parseInt(btn.getAttribute('data-index'), 10);
          renderPage();
        });
      });

      // Explode Slider
      const explodeSlider = container.querySelector('#explode-range');
      if (explodeSlider && engine) {
        explodeSlider.addEventListener('input', (e) => {
          engine.setExplode(parseFloat(e.target.value));
        });
      }

      // Cross-section button
      const crossBtn = container.querySelector('#cross-sec-btn');
      if (crossBtn && engine) {
        crossBtn.addEventListener('click', () => {
          const isActive = engine.toggleCrossSection();
          crossBtn.style.color = isActive ? 'var(--tp-primary)' : 'inherit';
        });
      }

      // Reset Camera
      const resetBtn = container.querySelector('#reset-cam-btn');
      if (resetBtn && engine) {
        resetBtn.addEventListener('click', () => {
          engine.resetView();
          if (explodeSlider) explodeSlider.value = 0;
        });
      }

      // Toggle 2D mode
      const toggle2DBtn = container.querySelector('#toggle-2d-btn');
      if (toggle2DBtn) {
        toggle2DBtn.addEventListener('click', () => {
          show2D = !show2D;
          renderPage();
        });
      }

      // Toggle Quiz
      const toggleQuizBtn = container.querySelector('#toggle-quiz-btn');
      if (toggleQuizBtn) {
        toggleQuizBtn.addEventListener('click', () => {
          showQuiz = !showQuiz;
          renderPage();
        });
      }

      const closeQuizBtn = container.querySelector('#close-quiz-btn');
      if (closeQuizBtn) {
        closeQuizBtn.addEventListener('click', () => {
          showQuiz = false;
          renderPage();
        });
      }

      // Quiz Answer selection
      container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const isCorrect = btn.getAttribute('data-correct') === 'true';
          const feedback = container.querySelector('#quiz-feedback-box');
          if (feedback) {
            feedback.style.display = 'block';
            if (isCorrect) {
              feedback.style.background = 'rgba(16,185,129,0.15)';
              feedback.style.border = '1px solid #10b981';
              feedback.style.color = '#10b981';
              feedback.innerHTML = '<strong>✓ Correct!</strong> Exceptional engineering deduction.';
              Toast.success('Correct answer!');
            } else {
              feedback.style.background = 'rgba(225,29,72,0.15)';
              feedback.style.border = '1px solid var(--tp-primary)';
              feedback.style.color = '#fff';
              feedback.innerHTML = '<strong>✕ Incorrect.</strong> Physical boundary constraints violate that hypothesis.';
            }
          }
        });
      });

      // Ask AI Doubt Solver button
      const askAiBtn = container.querySelector('#ask-ai-comp-btn');
      if (askAiBtn) {
        askAiBtn.addEventListener('click', () => {
          const activeComp = activeModel.components?.[activeComponentIndex] || activeModel.components?.[0];
          const query = `In ${activeModel.name} (${ctx.branch_id.toUpperCase()}), explain the exact mathematical operation, physical function, and real-world failure modes of ${activeComp.name}.`;
          sessionStorage.setItem('TP_PENDING_DOUBT', query);
          window.location.hash = '#/doubt-solver';
        });
      }
    }

    renderPage();
  }
}
