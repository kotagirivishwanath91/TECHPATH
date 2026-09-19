/**
 * TECHPATH — 3D BRAND IDENTITY CUBE & AUTHENTICATION TRANSITION ENGINE
 * 
 * Design & Architecture:
 * - Pure White + TechPath Red (#e11d48) Brand Identity
 * - Premium glossy 3D cube with frosted glass edges & deep-red illuminated inner edges
 * - ZERO educational icons (no graduation cap, book, pencil, bulb, or flat images)
 * - Clean geometric 8-quadrant slicing & reassembly mechanics
 * - Initial Loading: Smooth compound rotation -> Geometric slice separation -> Seamless transition to Sign In
 * - Post-Login: Fragments appear -> Smooth reassembly -> ONE elegant 360° spin -> Stops centered -> Welcome text -> Dashboard
 * - Ultra-lightweight WebGL with capped DPI, mobile optimization, and CSS 3D fallback
 */

export class CubeLoader {
  static _hasRunInitial = false;
  static _activeAnimId = null;
  static _activeRenderer = null;

  /**
   * Initial Opening Sequence:
   * 1. Clean background
   * 2. Cube appears in center
   * 3. Rotates smoothly
   * 4. Slices into clean geometric sections
   * 5. Sliced cube dissolves smoothly into Sign In / Sign Up
   */
  static playInitialAnimation(onComplete = () => {}) {
    const isCallback = window.location.hash.includes('access_token=') ||
                       window.location.search.includes('code=') ||
                       window.location.hash.includes('error=');
    const hasSession = localStorage.getItem('TP_AUTH_STATE')?.includes('"isAuthenticated":true');

    // If already seen in this session, already executed, during OAuth callback, or already authenticated, proceed immediately
    if (sessionStorage.getItem('TP_INTRO_SEEN') === 'true' || this._hasRunInitial || isCallback || hasSession) {
      this._dismissOverlay();
      onComplete();
      return;
    }

    this._hasRunInitial = true;
    sessionStorage.setItem('TP_INTRO_SEEN', 'true');

    const overlay = document.getElementById('cube-overlay');
    if (!overlay) {
      onComplete();
      return;
    }

    // Set clean premium backdrop
    overlay.style.display = 'flex';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '999999';
    overlay.style.background = 'radial-gradient(circle at center, #111420 0%, #07090e 100%)';
    overlay.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s ease';
    overlay.style.opacity = '1';
    overlay.style.overflow = 'hidden';

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTimeout(() => {
        this._fadeAndClose(overlay, onComplete);
      }, 350);
      return;
    }

    overlay.innerHTML = `
      <div id="tp-cube-stage-container" style="width: 100vw; height: 100vh; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden;"></div>
      <div id="tp-intro-brand" style="position: absolute; bottom: 8vh; left: 0; right: 0; text-align: center; opacity: 0; transition: opacity 0.4s ease; pointer-events: none;">
        <div style="font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
          TECH<span style="color: #e11d48;">PATH</span>
        </div>
        <div style="font-size: 0.88rem; font-weight: 600; color: #94a3b8; letter-spacing: 0.15em; text-transform: uppercase; margin-top: 0.25rem;">
          Learn &bull; Build &bull; Prepare &bull; Grow
        </div>
      </div>
    `;

    const container = document.getElementById('tp-cube-stage-container');
    const brandEl = document.getElementById('tp-intro-brand');

    if (typeof window.THREE !== 'undefined' && container) {
      try {
        this._runWebGLInitialSequence(container, brandEl, overlay, onComplete);
        return;
      } catch (err) {
        console.warn('[CubeLoader] WebGL fallback:', err);
      }
    }

    this._runCSSFallbackInitial(overlay, onComplete);
  }

  /**
   * Post-Authentication Sequence:
   * Called ONLY after successful login/signup/Google OAuth:
   * 1. Cube fragments appear
   * 2. Fragments smoothly reassemble
   * 3. Cube performs ONE elegant 360° spin
   * 4. Cube stops perfectly in center
   * 5. Welcome text appears briefly
   * 6. Smoothly opens Dashboard
   */
  static playLoginSuccessAnimation(userName = 'Engineer', onComplete = () => {}) {
    let overlay = document.getElementById('cube-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'cube-overlay';
      document.body.appendChild(overlay);
    }

    overlay.style.display = 'flex';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '999999';
    overlay.style.background = 'radial-gradient(circle at center, #111420 0%, #07090e 100%)';
    overlay.style.transition = 'opacity 0.45s ease';
    overlay.style.opacity = '1';
    overlay.style.overflow = 'hidden';

    // Reduced motion skip
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._fadeAndClose(overlay, onComplete);
      return;
    }

    overlay.innerHTML = `
      <div id="tp-cube-stage-container" style="width: 100vw; height: 100vh; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden;"></div>
      <div id="tp-welcome-brand" style="position: absolute; bottom: 10vh; left: 0; right: 0; text-align: center; opacity: 0; transform: translateY(12px); transition: opacity 0.4s ease, transform 0.4s ease; pointer-events: none;">
        <div style="font-family: 'Space Grotesk', sans-serif; font-size: 2.2rem; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
          Welcome to <span style="color: #e11d48;">TechPath</span>
        </div>
        <div style="font-size: 0.95rem; font-weight: 600; color: #cbd5e1; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 0.35rem;">
          Learn. Build. Prepare. Grow.
        </div>
        ${userName ? `
          <div style="font-size: 0.85rem; color: #38bdf8; font-family: monospace; margin-top: 0.5rem; letter-spacing: 0.05em;">
            AUTHENTICATED // ${userName.toUpperCase()}
          </div>
        ` : ''}
      </div>
    `;

    const container = document.getElementById('tp-cube-stage-container');
    const brandEl = document.getElementById('tp-welcome-brand');

    if (typeof window.THREE !== 'undefined' && container) {
      try {
        this._runWebGLLoginSuccess(container, brandEl, overlay, onComplete);
        return;
      } catch (err) {
        console.warn('[CubeLoader] WebGL success fallback:', err);
      }
    }

    this._runCSSFallbackSuccess(brandEl, overlay, onComplete);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WEBGL IMPLEMENTATION (PURE THREE.JS, ZERO EXTERNAL TEXTURES / ASSETS)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Constructs the 8-quadrant sliced TechPath cube:
   * White glossy exterior + Deep TechPath Red illuminated inner faces + glowing crimson beacon core
   */
  static _createBrandCube(THREE) {
    const rootGroup = new THREE.Group();
    const quadrantBlocks = [];

    // Dimensions for the 2x2x2 quadrant blocks
    const blockSize = 1.08;
    const baseOffset = blockSize / 2 + 0.02;

    // Materials
    // 1. Pristine white glossy outer shell
    const whiteGlossMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.12,
      metalness: 0.15
    });

    // 2. Deep TechPath red illuminated inner slice faces
    const redInnerMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      emissive: 0xbe123c,
      emissiveIntensity: 0.75,
      roughness: 0.2
    });

    // 3. Red edge wireframes for crisp high-tech definition
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xe11d48,
      transparent: true,
      opacity: 0.9,
      linewidth: 2
    });

    // 8 Quadrants in 3D Space (±1, ±1, ±1)
    const signs = [-1, 1];
    for (const sx of signs) {
      for (const sy of signs) {
        for (const sz of signs) {
          const blockGeo = new THREE.BoxGeometry(blockSize, blockSize, blockSize);

          // Multi-material setup: outer faces get white gloss, inner faces get illuminated red
          const materials = [
            sx > 0 ? whiteGlossMat : redInnerMat, // +X face
            sx < 0 ? whiteGlossMat : redInnerMat, // -X face
            sy > 0 ? whiteGlossMat : redInnerMat, // +Y face
            sy < 0 ? whiteGlossMat : redInnerMat, // -Y face
            sz > 0 ? whiteGlossMat : redInnerMat, // +Z face
            sz < 0 ? whiteGlossMat : redInnerMat  // -Z face
          ];

          const mesh = new THREE.Mesh(blockGeo, materials);
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          // Add crisp red edge highlights
          const edges = new THREE.LineSegments(new THREE.EdgesGeometry(blockGeo), edgeMat);
          mesh.add(edges);

          // Store initial base position and slice expansion direction
          const basePos = new THREE.Vector3(sx * baseOffset, sy * baseOffset, sz * baseOffset);
          const dir = new THREE.Vector3(sx, sy, sz).normalize();

          mesh.position.copy(basePos);
          rootGroup.add(mesh);

          quadrantBlocks.push({
            mesh,
            basePos,
            dir
          });
        }
      }
    }

    // Inner glowing core beacon
    const coreGeo = new THREE.OctahedronGeometry(0.55, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      emissive: 0xff1e56,
      emissiveIntensity: 1.2,
      roughness: 0.1
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Minimal floating micro-particles (25 particles, red and white sparks)
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 18 : 28;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      posArray[i * 3]     = radius * Math.cos(theta) * Math.cos(phi);
      posArray[i * 3 + 1] = radius * Math.sin(phi);
      posArray[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xe11d48,
      size: 0.08,
      transparent: true,
      opacity: 0.8
    });
    const particlePoints = new THREE.Points(partGeo, partMat);
    rootGroup.add(particlePoints);

    return {
      rootGroup,
      quadrantBlocks,
      coreMesh,
      particlePoints,
      setSlice(factor) {
        for (const q of quadrantBlocks) {
          q.mesh.position.set(
            q.basePos.x + q.dir.x * factor * 1.35,
            q.basePos.y + q.dir.y * factor * 1.35,
            q.basePos.z + q.dir.z * factor * 1.35
          );
        }
        coreMat.emissiveIntensity = 1.0 + factor * 1.2;
      },
      dispose() {
        whiteGlossMat.dispose();
        redInnerMat.dispose();
        edgeMat.dispose();
        coreMat.dispose();
        partMat.dispose();
        coreGeo.dispose();
        partGeo.dispose();
        for (const q of quadrantBlocks) {
          q.mesh.geometry.dispose();
        }
      }
    };
  }

  /**
   * Initial Opening Sequence WebGL Runner:
   * Assembled cube rotates -> Slices into geometric sections -> Dissolves into Sign In
   */
  static _runWebGLInitialSequence(container, brandEl, overlay, onComplete) {
    const THREE = window.THREE;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    const isMobile = width < 768;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    this._activeRenderer = renderer;

    // Cinematic Lighting: Crisp white key + Crimson ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const redLight = new THREE.PointLight(0xe11d48, 2.2, 18);
    redLight.position.set(0, 0, 1.5);
    scene.add(redLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(-5, -4, -3);
    scene.add(fillLight);

    const cube = this._createBrandCube(THREE);
    scene.add(cube.rootGroup);

    // Timing Choreography
    // Total: ~1800ms
    // 0ms - 900ms: Smooth compound rotation (assembled solid cube)
    // 900ms - 1500ms: Cube slices cleanly into geometric sections (sliceFactor 0 -> 1)
    // 1500ms - 1800ms: Slices disperse smoothly and fade into Sign In
    const totalDuration = 1800;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDuration);

      // Phase 1: Rotation (0 -> 0.65)
      if (progress < 0.5) {
        const p = progress / 0.5;
        const easedP = p * p * (3 - 2 * p); // smoothstep
        cube.rootGroup.rotation.y = easedP * Math.PI * 2;
        cube.rootGroup.rotation.x = Math.sin(easedP * Math.PI) * 0.35;
        cube.setSlice(0);
      } else {
        // Phase 2: Slicing into geometric sections (0.5 -> 1.0)
        const pSlice = (progress - 0.5) / 0.5;
        const easeOut = Math.sin((pSlice * Math.PI) / 2);
        cube.rootGroup.rotation.y = Math.PI * 2 + pSlice * 0.5;
        cube.rootGroup.rotation.x = Math.sin(Math.PI) * 0.35 * (1 - pSlice);
        cube.setSlice(easeOut);

        if (brandEl && pSlice > 0.3) {
          brandEl.style.opacity = '1';
        }
      }

      cube.coreMesh.rotation.y -= 0.03;
      cube.particlePoints.rotation.y += 0.01;

      renderer.render(scene, camera);

      if (progress < 1) {
        this._activeAnimId = requestAnimationFrame(animate);
      } else {
        // Complete! Smoothly dissolve into Sign In
        setTimeout(() => {
          this._cleanupAndClose(overlay, renderer, cube, onComplete);
        }, 150);
      }
    };

    this._activeAnimId = requestAnimationFrame(animate);
  }

  /**
   * Post-Login Success Sequence WebGL Runner:
   * Separated fragments appear -> Smoothly reassemble -> ONE 360° spin -> Stops centered -> Welcome -> Dashboard
   */
  static _runWebGLLoginSuccess(container, brandEl, overlay, onComplete) {
    const THREE = window.THREE;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.0);

    const isMobile = width < 768;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    this._activeRenderer = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const redLight = new THREE.PointLight(0xe11d48, 2.5, 18);
    redLight.position.set(0, 0, 1.5);
    scene.add(redLight);

    const cube = this._createBrandCube(THREE);
    scene.add(cube.rootGroup);

    // Initial state: fragments appear separated
    cube.setSlice(0.85);
    cube.rootGroup.rotation.y = 0.3;
    cube.rootGroup.rotation.x = 0.2;

    // Timing Choreography:
    // Total: ~1300ms (fast, responsive, zero unnecessary delay)
    // 0ms - 350ms: Fragments smoothly reassemble (slice 0.85 -> 0.0)
    // 350ms - 850ms: Assembled cube performs ONE elegant 360° spin
    // 850ms - 900ms: Stops centered
    // 900ms - 1300ms: Welcome text shines, then transitions into Dashboard
    const totalDuration = 1250;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDuration);

      if (progress < 0.3) {
        // 1. Reassembly Phase
        const pReassemble = progress / 0.3;
        const easeIn = pReassemble * pReassemble;
        const currentSlice = 0.85 * (1 - easeIn);
        cube.setSlice(currentSlice);
        cube.rootGroup.rotation.y = 0.3 * (1 - pReassemble);
      } else if (progress < 0.75) {
        // 2. ONE Elegant 360° Spin
        cube.setSlice(0);
        const pSpin = (progress - 0.3) / 0.45;
        // Smooth deceleration into center
        const spinEase = Math.sin((pSpin * Math.PI) / 2);
        cube.rootGroup.rotation.y = spinEase * Math.PI * 2;
        cube.rootGroup.rotation.x = Math.sin(pSpin * Math.PI) * 0.25;

        if (brandEl && pSpin > 0.4) {
          brandEl.style.opacity = '1';
          brandEl.style.transform = 'translateY(0)';
        }
      } else {
        // 3. Perfect Centered Stop
        cube.setSlice(0);
        cube.rootGroup.rotation.y = Math.PI * 2;
        cube.rootGroup.rotation.x = 0;
        if (brandEl) {
          brandEl.style.opacity = '1';
          brandEl.style.transform = 'translateY(0)';
        }
      }

      cube.coreMesh.rotation.y -= 0.03;
      renderer.render(scene, camera);

      if (progress < 1) {
        this._activeAnimId = requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          this._cleanupAndClose(overlay, renderer, cube, onComplete);
        }, 180);
      }
    };

    this._activeAnimId = requestAnimationFrame(animate);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RESILIENT CSS FALLBACKS (NO WEBGL DEPENDENCY)
  // ──────────────────────────────────────────────────────────────────────────

  static _runCSSFallbackInitial(overlay, onComplete) {
    if (!overlay) { onComplete(); return; }
    overlay.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem;">
        <div class="tp-glass-cube" style="width: 100px; height: 100px; transform-style: preserve-3d; animation: tp-cube-three-rotations 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;">
          <div class="cube-face cube-face-front" style="background: rgba(255,255,255,0.9); border: 2px solid #e11d48;"></div>
          <div class="cube-face cube-face-back" style="background: rgba(255,255,255,0.9); border: 2px solid #e11d48;"></div>
          <div class="cube-face cube-face-right" style="background: rgba(255,255,255,0.9); border: 2px solid #e11d48;"></div>
          <div class="cube-face cube-face-left" style="background: rgba(255,255,255,0.9); border: 2px solid #e11d48;"></div>
          <div class="cube-face cube-face-top" style="background: rgba(255,255,255,0.9); border: 2px solid #e11d48;"></div>
          <div class="cube-face cube-face-bottom" style="background: rgba(255,255,255,0.9); border: 2px solid #e11d48;"></div>
        </div>
        <div style="font-family: 'Space Grotesk', sans-serif; font-size: 2rem; font-weight: 800; color: #fff;">
          TECH<span style="color: #e11d48;">PATH</span>
        </div>
      </div>
    `;

    setTimeout(() => {
      this._fadeAndClose(overlay, onComplete);
    }, 1600);
  }

  static _runCSSFallbackSuccess(brandEl, overlay, onComplete) {
    if (brandEl) {
      brandEl.style.opacity = '1';
      brandEl.style.transform = 'translateY(0)';
    }
    setTimeout(() => {
      this._fadeAndClose(overlay, onComplete);
    }, 900);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CLEANUP & DISMISSAL HELPERS
  // ──────────────────────────────────────────────────────────────────────────

  static _cleanupAndClose(overlay, renderer, cube, onComplete) {
    if (this._activeAnimId) {
      cancelAnimationFrame(this._activeAnimId);
      this._activeAnimId = null;
    }
    if (cube && typeof cube.dispose === 'function') {
      cube.dispose();
    }
    if (renderer) {
      renderer.dispose();
      this._activeRenderer = null;
    }
    this._fadeAndClose(overlay, onComplete);
  }

  static _fadeAndClose(overlay, onComplete) {
    if (!overlay) { onComplete(); return; }
    overlay.style.opacity = '0';
    overlay.style.transform = 'scale(1.02)';
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
      onComplete();
    }, 450);
  }

  static _dismissOverlay() {
    const overlay = document.getElementById('cube-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
    }
  }

  /**
   * Ultra-lightweight route transition indicator (2px TechPath red/white line)
   */
  static showRouteTransition() {
    let mini = document.getElementById('tp-route-mini-loader');
    if (!mini) {
      mini = document.createElement('div');
      mini.id = 'tp-route-mini-loader';
      mini.style.position = 'fixed';
      mini.style.top = '0';
      mini.style.left = '0';
      mini.style.width = '100%';
      mini.style.height = '3px';
      mini.style.background = 'linear-gradient(90deg, #ffffff, #e11d48, #be123c)';
      mini.style.zIndex = '99999';
      mini.style.transform = 'translateX(-100%)';
      mini.style.transition = 'transform 0.2s ease-out';
      document.body.appendChild(mini);
    }
    mini.style.display = 'block';
    requestAnimationFrame(() => {
      mini.style.transform = 'translateX(-25%)';
    });
  }

  static hideRouteTransition() {
    const mini = document.getElementById('tp-route-mini-loader');
    if (mini) {
      mini.style.transform = 'translateX(0%)';
      setTimeout(() => {
        mini.style.display = 'none';
        mini.style.transform = 'translateX(-100%)';
      }, 150);
    }
  }
}
