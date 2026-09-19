/**
 * TECHPATH — ABOUT TECHPATH & COMPREHENSIVE FEATURES SHOWCASE
 * Premium futuristic dark engineering environment with interactive 3D core,
 * grid depth, holographic accent glows, and responsive layout across all devices.
 */

import { APP_CONFIG } from '../config.js';
import { authContext } from '../context/AuthContext.js';

export class AboutPage {
  static async render(container) {
    const isAuth = authContext.isLoggedIn();

    container.innerHTML = `
      <div class="tp-about-container" style="display: flex; flex-direction: column; gap: 4.5rem; max-width: 1200px; margin: 0 auto; padding-bottom: 5rem;">

        <!-- 1. HERO SECTION -->
        <section class="tp-about-hero" style="position: relative; padding: 3rem 1.5rem 2rem; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 2.5rem; align-items: center; border-radius: var(--radius-xl); background: radial-gradient(circle at top right, rgba(139, 92, 246, 0.15), rgba(37, 99, 235, 0.08) 45%, transparent 70%); border: 1px solid rgba(255, 255, 255, 0.07); overflow: hidden;">
          
          <!-- Background Grid Accent -->
          <div style="position: absolute; inset: 0; background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px); background-size: 32px 32px; pointer-events: none;"></div>

          <div style="position: relative; z-index: 2; display: flex; flex-direction: column; gap: 1.25rem;">
            <div class="telemetry-chip" style="align-self: flex-start; background: rgba(139, 92, 246, 0.15); border-color: rgba(139, 92, 246, 0.35); color: #c4b5fd;">
              <span class="pulse-beacon" style="background: #a855f7;"></span>
              NEXT-GEN ENGINEERING PLATFORM // V3.0
            </div>

            <h1 style="font-family: var(--font-headline); font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; color: #fff;">
              From Classroom <br/>
              <span style="background: linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                to High-Impact Career.
              </span>
            </h1>

            <p style="font-size: 1.15rem; line-height: 1.6; color: var(--tp-text-dark-secondary); max-width: 580px;">
              TechPath is the complete engineering education ecosystem designed to replace fragmented textbooks with interactive 3D visualizations, branch-specific video curriculums, real-world capstone projects, and rigorous placement training.
            </p>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem;">
              <a href="${isAuth ? '#/dashboard' : '#/signup'}" class="tp-btn tp-btn-primary" style="font-size: 1rem; padding: 0.85rem 1.75rem; box-shadow: 0 8px 24px rgba(225, 29, 72, 0.35);">
                ${isAuth ? 'Go to Dashboard →' : 'Start Free Account →'}
              </a>
              <a href="#/3d" class="tp-btn tp-btn-secondary" style="font-size: 1rem; padding: 0.85rem 1.75rem;">
                🧊 Explore 3D Models
              </a>
              <a href="#/learning" class="tp-btn tp-btn-ghost" style="font-size: 1rem; padding: 0.85rem 1.25rem;">
                📖 LearnHub Catalog
              </a>
            </div>

            <!-- Quick Metrics Strip -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.08);">
              <div>
                <div style="font-family: var(--font-headline); font-size: 1.6rem; font-weight: 700; color: #fff;">10+</div>
                <div style="font-size: 0.8rem; color: var(--tp-text-dark-muted); text-transform: uppercase; letter-spacing: 0.05em;">Branches Supported</div>
              </div>
              <div>
                <div style="font-family: var(--font-headline); font-size: 1.6rem; font-weight: 700; color: #38bdf8;">100%</div>
                <div style="font-size: 0.8rem; color: var(--tp-text-dark-muted); text-transform: uppercase; letter-spacing: 0.05em;">Branch-Isolated</div>
              </div>
              <div>
                <div style="font-family: var(--font-headline); font-size: 1.6rem; font-weight: 700; color: #a855f7;">51</div>
                <div style="font-size: 0.8rem; color: var(--tp-text-dark-muted); text-transform: uppercase; letter-spacing: 0.05em;">Global Languages</div>
              </div>
            </div>
          </div>

          <!-- Hero 3D Interactive Visualizer Canvas -->
          <div style="position: relative; width: 100%; height: 380px; display: flex; align-items: center; justify-content: center;">
            <div id="tp-hero-3d-canvas" style="width: 100%; height: 100%; border-radius: var(--radius-lg); background: radial-gradient(circle, rgba(17, 24, 39, 0.8) 0%, rgba(10, 13, 20, 0.95) 100%); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); overflow: hidden; position: relative;">
              <!-- 3D Canvas mounts here via Three.js -->
            </div>
            <div style="position: absolute; bottom: 12px; right: 16px; font-size: 0.75rem; color: var(--tp-text-dark-muted); background: rgba(0,0,0,0.6); padding: 0.25rem 0.6rem; border-radius: 4px; pointer-events: none;">
              ✨ Real-Time WebGL Core
            </div>
          </div>

        </section>

        <!-- 2. WHAT IS TECHPATH -->
        <section style="display: flex; flex-direction: column; gap: 1.5rem; text-align: center; max-width: 820px; margin: 0 auto;">
          <div class="telemetry-chip" style="align-self: center;">
            THE ENGINEERING IMPERATIVE
          </div>
          <h2 class="display-lg">Why TechPath Was Built</h2>
          <p style="font-size: 1.1rem; line-height: 1.7; color: var(--tp-text-dark-secondary);">
            Traditional engineering education is plagued by disconnected theory, static 2D textbook drawings, and zero alignment with hiring benchmarks. TechPath solves this with a unified, branch-specific learning engine that links every semester lecture directly to working software/hardware prototypes, skill evaluations, and industry requirements.
          </p>
        </section>

        <!-- 3. FOUR CORE PILLARS -->
        <section id="features-overview" style="display: flex; flex-direction: column; gap: 2rem;">
          <div style="text-align: center;">
            <h2 class="headline-xl">The Four Pillars of Mastery</h2>
            <p style="color: var(--tp-text-dark-secondary); margin-top: 0.5rem;">
              Every module in TechPath is organized into our four continuous engineering loops.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            
            <!-- Pillar 1: Learn -->
            <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; gap: 1rem; border-top: 3px solid #3b82f6;">
              <div style="font-size: 2.2rem;">📖</div>
              <h3 style="font-size: 1.3rem; color: #fff;">1. Learn</h3>
              <p style="font-size: 0.92rem; color: var(--tp-text-dark-secondary); line-height: 1.6;">
                Curated university-grade video lectures from MIT, Stanford, and NPTEL. Branch-isolated so CSE never sees Mech, and Mech never sees ECE.
              </p>
              <ul style="font-size: 0.85rem; color: var(--tp-text-dark-muted); padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.4rem;">
                <li>LearnHub Video System</li>
                <li>Curriculum topic roadmaps</li>
                <li>Formula cheat sheets & notes</li>
              </ul>
            </div>

            <!-- Pillar 2: Build -->
            <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; gap: 1rem; border-top: 3px solid #10b981;">
              <div style="font-size: 2.2rem;">🔨</div>
              <h3 style="font-size: 1.3rem; color: #fff;">2. Build</h3>
              <p style="font-size: 0.92rem; color: var(--tp-text-dark-secondary); line-height: 1.6;">
                Real capstones and production-grade projects. Step-by-step engineering blueprints with system architecture diagrams and code repos.
              </p>
              <ul style="font-size: 0.85rem; color: var(--tp-text-dark-muted); padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.4rem;">
                <li>Capstones across all 10 branches</li>
                <li>Architecture & circuit diagrams</li>
                <li>One-click resume integration</li>
              </ul>
            </div>

            <!-- Pillar 3: Prepare -->
            <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; gap: 1rem; border-top: 3px solid #f59e0b;">
              <div style="font-size: 2.2rem;">🎯</div>
              <h3 style="font-size: 1.3rem; color: #fff;">3. Prepare</h3>
              <p style="font-size: 0.92rem; color: var(--tp-text-dark-secondary); line-height: 1.6;">
                Comprehensive competitive exam prep (GATE, ISRO, IES) and live Mock Interview studios covering both technical code and behavioral competencies.
              </p>
              <ul style="font-size: 0.85rem; color: var(--tp-text-dark-muted); padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.4rem;">
                <li>Timed GATE & PSU mock tests</li>
                <li>Technical & HR interview studio</li>
                <li>ATS-optimized resume builder</li>
              </ul>
            </div>

            <!-- Pillar 4: Grow -->
            <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; gap: 1rem; border-top: 3px solid #a855f7;">
              <div style="font-size: 2.2rem;">🚀</div>
              <h3 style="font-size: 1.3rem; color: #fff;">4. Grow</h3>
              <p style="font-size: 0.92rem; color: var(--tp-text-dark-secondary); line-height: 1.6;">
                Continuous feedback loop powered by real Gemini AI Doubt Solving, interactive PDF analysis, personalized study planners, and gap analytics.
              </p>
              <ul style="font-size: 0.85rem; color: var(--tp-text-dark-muted); padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.4rem;">
                <li>Gemini AI Doubt Solver</li>
                <li>PDF & diagram vector analyzer</li>
                <li>52-week study streak analytics</li>
              </ul>
            </div>

          </div>
        </section>

        <!-- 4. ENGINEERING BRANCHES SHOWCASE -->
        <section class="tp-card tp-card-glass" style="padding: 2.5rem; display: flex; flex-direction: column; gap: 1.75rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem;">STRICT BRANCH ISOLATION</div>
            <h2 class="headline-lg">Every Engineering Discipline Handled Personally</h2>
            <p style="color: var(--tp-text-dark-secondary); max-width: 700px; margin-top: 0.25rem;">
              TechPath avoids generic tutorials. When you pick your branch and semester, your entire dashboard, video feed, and 3D models adapt to your exact university curriculum.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
            ${APP_CONFIG.branches.map(b => `
              <div style="padding: 1rem; border-radius: var(--radius-md); background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 0.35rem;">
                <span class="mono-chip" style="color: var(--tp-primary);">${b.code}</span>
                <strong style="font-size: 0.95rem; color: #fff;">${b.name}</strong>
                <span style="font-size: 0.78rem; color: var(--tp-text-dark-muted);">${b.semesters?.length || 8} Semesters &bull; Curated</span>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- 5. 3D ENGINEERING MODELS SHOWCASE -->
        <section style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; align-items: center;" class="tp-3d-showcase-grid">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem;">PROCEDURAL WEBGL ENGINES</div>
            <h2 class="display-lg">Inspect Systems in Full 3D Space</h2>
            <p style="color: var(--tp-text-dark-secondary); line-height: 1.7; margin: 1rem 0 1.5rem;">
              Textbooks show flat cross-sections. TechPath renders interactive 3D procedural geometries: multi-core CPUs, FinFET semiconductors, turbofans, 6-DOF robotic arms, and four-stroke internal combustion engines.
            </p>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem;">
                <span style="color: #10b981;">✓</span> 360° Rotational examination & component isolation
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem;">
                <span style="color: #10b981;">✓</span> Interactive sub-component quizzes with immediate feedback
              </div>
              <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.95rem;">
                <span style="color: #10b981;">✓</span> "Ask AI" bridge pre-fills doubted parts directly into the solver
              </div>
            </div>
            <div style="margin-top: 1.75rem;">
              <a href="#/3d" class="tp-btn tp-btn-primary">Launch 3D Explorer →</a>
            </div>
          </div>

          <div class="tp-card tp-card-glass" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; border: 1px solid rgba(139, 92, 246, 0.3);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="mono-chip" style="color: #a855f7;">LIVE PREVIEW // CPU PIPELINE</span>
              <span class="telemetry-chip" style="font-size: 0.72rem;">60 FPS // HARDWARE ACCELERATED</span>
            </div>
            <div id="tp-about-secondary-3d" style="width: 100%; height: 260px; border-radius: var(--radius-md); background: #07090e; overflow: hidden; position: relative;"></div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--tp-text-dark-muted);">
              <span>Click & Drag to rotate</span>
              <span>Available in CSE, ECE, MECH, CIVIL & AERO</span>
            </div>
          </div>
        </section>

        <!-- 6. HOW TECHPATH WORKS (4 STEPS) -->
        <section style="display: flex; flex-direction: column; gap: 2rem;">
          <div style="text-align: center;">
            <div class="telemetry-chip" style="align-self: center;">EXECUTION WORKFLOW</div>
            <h2 class="headline-xl">How TechPath Works</h2>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.5rem;">
            <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; gap: 0.75rem;">
              <span style="font-family: var(--font-mono); font-size: 1.75rem; font-weight: 800; color: var(--tp-primary);">01</span>
              <h4 style="font-size: 1.1rem; color: #fff;">Select Context</h4>
              <p style="font-size: 0.88rem; color: var(--tp-text-dark-secondary); line-height: 1.5;">
                Choose your university engineering branch and semester. Your entire feed adapts to your syllabus.
              </p>
            </div>

            <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; gap: 0.75rem;">
              <span style="font-family: var(--font-mono); font-size: 1.75rem; font-weight: 800; color: #3b82f6;">02</span>
              <h4 style="font-size: 1.1rem; color: #fff;">Master Concepts</h4>
              <p style="font-size: 0.88rem; color: var(--tp-text-dark-secondary); line-height: 1.5;">
                Watch verified lectures, inspect 3D hardware components, and use our AI Doubt Solver for instant code.
              </p>
            </div>

            <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; gap: 0.75rem;">
              <span style="font-family: var(--font-mono); font-size: 1.75rem; font-weight: 800; color: #10b981;">03</span>
              <h4 style="font-size: 1.1rem; color: #fff;">Build Capstones</h4>
              <p style="font-size: 0.88rem; color: var(--tp-text-dark-secondary); line-height: 1.5;">
                Create full-scale projects with system architectures and add verified skills directly to your profile.
              </p>
            </div>

            <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; gap: 0.75rem;">
              <span style="font-family: var(--font-mono); font-size: 1.75rem; font-weight: 800; color: #a855f7;">04</span>
              <h4 style="font-size: 1.1rem; color: #fff;">Land the Role</h4>
              <p style="font-size: 0.88rem; color: var(--tp-text-dark-secondary); line-height: 1.5;">
                Practice mock interviews, compile an ATS-proven resume, and track placement readiness metrics.
              </p>
            </div>
          </div>
        </section>

        <!-- 7. GLOBAL MULTILINGUAL LOCALIZATION BANNER -->
        <section class="tp-card tp-card-glass" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; background: linear-gradient(135deg, rgba(37,99,235,0.1), rgba(139,92,246,0.1)); border: 1px solid rgba(59, 130, 246, 0.3);">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="font-size: 2.5rem;">🌍</div>
            <div>
              <h3 style="font-size: 1.2rem; color: #fff; margin-bottom: 0.25rem;">Engineered for 51 Global Languages & RTL</h3>
              <p style="font-size: 0.9rem; color: var(--tp-text-dark-secondary); max-width: 620px;">
                Learn in Telugu, Hindi, Tamil, Kannada, Marathi, Spanish, French, German, Arabic, Japanese, or English with instant typography and RTL text adaptation.
              </p>
            </div>
          </div>
          <div>
            <a href="#/preferences" class="tp-btn tp-btn-secondary">Language Settings →</a>
          </div>
        </section>

        <!-- 8. FINAL CALL TO ACTION (CTA) -->
        <section class="tp-card" style="padding: 4rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; background: radial-gradient(circle at center, rgba(225,29,72,0.15) 0%, rgba(13,17,23,0.95) 75%); border: 1px solid rgba(225,29,72,0.3); border-radius: var(--radius-xl);">
          <div class="telemetry-chip" style="background: rgba(225,29,72,0.15); border-color: rgba(225,29,72,0.4); color: #fda4af;">
            READY TO ELEVATE YOUR ENGINEERING JOURNEY?
          </div>
          <h2 style="font-family: var(--font-headline); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; color: #fff; max-width: 700px;">
            Join Thousands of Engineers Accelerating on TechPath
          </h2>
          <p style="font-size: 1.1rem; color: var(--tp-text-dark-secondary); max-width: 580px;">
            Experience 3D visualization, branch-isolated curriculums, and full placement prep today. Free forever for students.
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-top: 0.5rem;">
            <a href="${isAuth ? '#/dashboard' : '#/signup'}" class="tp-btn tp-btn-primary" style="font-size: 1.05rem; padding: 0.9rem 2.2rem;">
              ${isAuth ? 'Enter Dashboard →' : 'Create Free Account →'}
            </a>
            <a href="#/contact" class="tp-btn tp-btn-secondary" style="font-size: 1.05rem; padding: 0.9rem 1.8rem;">
              Contact Operations
            </a>
          </div>
        </section>

      </div>
    `;

    // Mount interactive WebGL 3D preview in hero
    this._mountHero3D();
  }

  static _mountHero3D() {
    const container = document.getElementById('tp-hero-3d-canvas');
    if (!container || typeof window.THREE === 'undefined') return;

    try {
      const THREE = window.THREE;
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 380;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 5.5);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const ambient = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambient);

      const pLight1 = new THREE.PointLight(0xa855f7, 2.5, 20);
      pLight1.position.set(3, 3, 3);
      scene.add(pLight1);

      const pLight2 = new THREE.PointLight(0x06b6d4, 2.0, 20);
      pLight2.position.set(-3, -3, 3);
      scene.add(pLight2);

      // Rotating Futuristic Geometric Crystal / TechPath Cube
      const group = new THREE.Group();
      scene.add(group);

      const boxGeo = new THREE.BoxGeometry(2, 2, 2);
      const boxMat = new THREE.MeshPhysicalMaterial({
        color: 0x3b82f6,
        roughness: 0.2,
        metalness: 0.2,
        transmission: 0.6,
        thickness: 0.8,
        transparent: true,
        opacity: 0.85
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      group.add(box);

      const edgesGeo = new THREE.EdgesGeometry(boxGeo);
      const edgesMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, linewidth: 2 });
      const edges = new THREE.LineSegments(edgesGeo, edgesMat);
      group.add(edges);

      // Inner Glowing Core
      const coreGeo = new THREE.OctahedronGeometry(0.8, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x9333ea,
        emissiveIntensity: 0.7,
        roughness: 0.3
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      // Drag controls
      let isDragging = false;
      let prevMouse = { x: 0, y: 0 };

      renderer.domElement.addEventListener('mousedown', e => {
        isDragging = true;
        prevMouse = { x: e.clientX, y: e.clientY };
      });

      window.addEventListener('mouseup', () => { isDragging = false; });

      renderer.domElement.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMouse.x;
        const deltaY = e.clientY - prevMouse.y;
        group.rotation.y += deltaX * 0.01;
        group.rotation.x += deltaY * 0.01;
        prevMouse = { x: e.clientX, y: e.clientY };
      });

      let frameId;
      const animate = () => {
        if (!isDragging) {
          group.rotation.y += 0.008;
          group.rotation.x += 0.004;
          core.rotation.y -= 0.012;
        }
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();

      // Clean up when navigating away
      window.addEventListener('hashchange', () => {
        cancelAnimationFrame(frameId);
        renderer.dispose();
      }, { once: true });

    } catch (e) {
      console.warn('[AboutPage] 3D Hero Canvas note:', e);
    }
  }
}
