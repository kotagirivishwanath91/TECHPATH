/**
 * TECHPATH — 3D ENGINEERING VISUALIZER & MODEL ENGINE
 * Interactive Three.js WebGL Viewport with Precision Telemetry HUD
 * Supports Explode, Cross-Section, Hotspot Telemetry, and 2D Accessible Alternative
 */

export class ThreeDEngine {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.modelGroup = null;
    this.components = [];
    this.explodeFactor = 0;
    this.animationId = null;
    this.isPaused = false;
    this.clippingPlane = null;
    this.isCrossSectionActive = false;

    this.init();
  }

  init() {
    if (!window.THREE) {
      console.warn('Three.js not loaded, rendering accessible 2D fallback');
      return;
    }

    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 500;

    // 1. Scene
    this.scene = new window.THREE.Scene();
    this.scene.background = new window.THREE.Color(0x0b0d12); // Deep Obsidian

    // 2. Camera
    this.camera = new window.THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 5, 12);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer with antialiasing and clipping planes enabled
    this.renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.localClippingEnabled = true;
    this.renderer.shadowMap.enabled = true;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting (Engineering Studio Rig)
    const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight1 = new window.THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(10, 15, 10);
    this.scene.add(dirLight1);

    const accentLight = new window.THREE.PointLight(0xe11d48, 2, 20); // Crimson telemetry light
    accentLight.position.set(-5, 4, 2);
    this.scene.add(accentLight);

    // 5. Grid Helper
    const grid = new window.THREE.GridHelper(20, 20, 0xe11d48, 0x1f2937);
    grid.position.y = -2;
    this.scene.add(grid);

    // 6. Model Group
    this.modelGroup = new window.THREE.Group();
    this.scene.add(this.modelGroup);

    // Clipping plane for cross section
    this.clippingPlane = new window.THREE.Plane(new window.THREE.Vector3(0, -1, 0), 10);

    this.setupInteraction();
    this.animate();
  }

  loadModel(modelMeta) {
    if (!this.modelGroup) return;

    // Clear previous model meshes
    while (this.modelGroup.children.length > 0) {
      this.modelGroup.remove(this.modelGroup.children[0]);
    }
    this.components = [];

    const THREE = window.THREE;

    if (modelMeta.id.includes('cpu')) {
      // Build Procedural Multi-Core CPU
      const baseGeo = new THREE.BoxGeometry(6, 0.4, 6);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.userData = { name: 'Silicon Substrate & Package Interposer', explodeDir: new THREE.Vector3(0, -1, 0) };
      this.modelGroup.add(base);
      this.components.push(base);

      // Cores
      const coreOffsets = [
        { x: -1.5, z: -1.5, name: 'Core #0 (ALU / L1 D-Cache)' },
        { x: 1.5, z: -1.5, name: 'Core #1 (ALU / L1 D-Cache)' },
        { x: -1.5, z: 1.5, name: 'Core #2 (ALU / L1 D-Cache)' },
        { x: 1.5, z: 1.5, name: 'Core #3 (ALU / L1 D-Cache)' }
      ];

      coreOffsets.forEach((pos) => {
        const coreGeo = new THREE.BoxGeometry(2.4, 0.5, 2.4);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.6, roughness: 0.3, emissive: 0x4c0519 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        core.position.set(pos.x, 0.45, pos.z);
        core.userData = { name: pos.name, explodeDir: new THREE.Vector3(pos.x * 0.8, 1.2, pos.z * 0.8) };
        this.modelGroup.add(core);
        this.components.push(core);
      });

      // Integrated Heat Spreader (IHS)
      const ihsGeo = new THREE.BoxGeometry(6.2, 0.3, 6.2);
      const ihsMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.85 });
      const ihs = new THREE.Mesh(ihsGeo, ihsMat);
      ihs.position.set(0, 1.2, 0);
      ihs.userData = { name: 'Integrated Copper Heat Spreader (IHS)', explodeDir: new THREE.Vector3(0, 3.5, 0) };
      this.modelGroup.add(ihs);
      this.components.push(ihs);
    } else if (modelMeta.id.includes('mosfet') || modelMeta.id.includes('finfet')) {
      // Build Procedural FinFET Semiconductor
      const subGeo = new THREE.BoxGeometry(6, 0.6, 5);
      const subMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.4 });
      const sub = new THREE.Mesh(subGeo, subMat);
      sub.userData = { name: 'Silicon Substrate & Buried Oxide', explodeDir: new THREE.Vector3(0, -1, 0) };
      this.modelGroup.add(sub);
      this.components.push(sub);

      // Fin Channel
      const finGeo = new THREE.BoxGeometry(0.8, 2.2, 4);
      const finMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.2 });
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(0, 1.1, 0);
      fin.userData = { name: '3D Silicon Channel Fin', explodeDir: new THREE.Vector3(0, 0.5, 0) };
      this.modelGroup.add(fin);
      this.components.push(fin);

      // Wrap-Around Gate
      const gateGeo = new THREE.BoxGeometry(2.4, 2.5, 1.5);
      const gateMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.85 });
      const gate = new THREE.Mesh(gateGeo, gateMat);
      gate.position.set(0, 1.4, 0);
      gate.userData = { name: 'Tri-Gate High-k Dielectric & Metal Gate', explodeDir: new THREE.Vector3(0, 3.0, 0) };
      this.modelGroup.add(gate);
      this.components.push(gate);
    } else if (modelMeta.id.includes('transformer')) {
      // Build Procedural Three-Phase Transformer
      const coreGeo = new THREE.BoxGeometry(6, 4.5, 1.2);
      const coreMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.userData = { name: 'Laminated E-I Silicon Steel Core', explodeDir: new THREE.Vector3(0, 0, -1) };
      this.modelGroup.add(core);
      this.components.push(core);

      // 3 Phase Copper Coils
      [-2, 0, 2].forEach((x, i) => {
        const coilGeo = new THREE.CylinderGeometry(0.9, 0.9, 3.2, 24);
        const coilMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
        const coil = new THREE.Mesh(coilGeo, coilMat);
        coil.position.set(x, 0, 0);
        coil.userData = { name: `Phase ${String.fromCharCode(65+i)} Primary & Secondary Copper Windings`, explodeDir: new THREE.Vector3(x * 0.8, 1.5, 1.5) };
        this.modelGroup.add(coil);
        this.components.push(coil);
      });

      // Bushings
      [-2, 0, 2].forEach((x, i) => {
        const bushGeo = new THREE.ConeGeometry(0.3, 1.5, 16);
        const bushMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.3, roughness: 0.6 });
        const bush = new THREE.Mesh(bushGeo, bushMat);
        bush.position.set(x, 3.0, 0);
        bush.userData = { name: `High-Voltage Bushing ${i+1}`, explodeDir: new THREE.Vector3(0, 2.5, 0) };
        this.modelGroup.add(bush);
        this.components.push(bush);
      });
    } else if (modelMeta.id.includes('bridge') || modelMeta.id.includes('truss')) {
      // Build Procedural Pratt Truss Bridge
      const deckGeo = new THREE.BoxGeometry(8, 0.4, 3);
      const deckMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.4, roughness: 0.6 });
      const deck = new THREE.Mesh(deckGeo, deckMat);
      deck.position.y = -1;
      deck.userData = { name: 'Reinforced Concrete Bridge Deck Plate', explodeDir: new THREE.Vector3(0, -1.5, 0) };
      this.modelGroup.add(deck);
      this.components.push(deck);

      const topChordGeo = new THREE.BoxGeometry(6, 0.3, 0.3);
      const trussMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.8, roughness: 0.2 });
      const topChord = new THREE.Mesh(topChordGeo, trussMat);
      topChord.position.set(0, 2, 1.3);
      topChord.userData = { name: 'Compression Top Chord (Span Resistor)', explodeDir: new THREE.Vector3(0, 2.5, 0) };
      this.modelGroup.add(topChord);
      this.components.push(topChord);

      [-3, -1, 1, 3].forEach((x, i) => {
        const strutGeo = new THREE.CylinderGeometry(0.12, 0.12, 3, 12);
        const strut = new THREE.Mesh(strutGeo, trussMat);
        strut.position.set(x, 0.5, 1.3);
        strut.userData = { name: `Vertical Strut Post #${i+1}`, explodeDir: new THREE.Vector3(x*0.4, 0, 1.5) };
        this.modelGroup.add(strut);
        this.components.push(strut);
      });
    } else if (modelMeta.id.includes('nn') || modelMeta.id.includes('neural')) {
      // Build Procedural Neural Network Pipeline
      const inputGeo = new THREE.BoxGeometry(0.4, 3.5, 3.5);
      const inputMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.4, roughness: 0.4, transparent: true, opacity: 0.75 });
      const inputMesh = new THREE.Mesh(inputGeo, inputMat);
      inputMesh.position.set(-3, 0, 0);
      inputMesh.userData = { name: 'Input Feature Tensor [B, C, H, W]', explodeDir: new THREE.Vector3(-2, 0, 0) };
      this.modelGroup.add(inputMesh);
      this.components.push(inputMesh);

      const convGeo = new THREE.BoxGeometry(0.8, 2.4, 2.4);
      const convMat = new THREE.MeshStandardMaterial({ color: 0xec4899, metalness: 0.7, roughness: 0.2 });
      const convMesh = new THREE.Mesh(convGeo, convMat);
      convMesh.position.set(-0.5, 0, 0);
      convMesh.userData = { name: 'Conv2D Feature Extractor Volume', explodeDir: new THREE.Vector3(0, 1.5, 0) };
      this.modelGroup.add(convMesh);
      this.components.push(convMesh);

      const headGeo = new THREE.BoxGeometry(0.5, 1.2, 1.2);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.9, roughness: 0.1 });
      const headMesh = new THREE.Mesh(headGeo, headMat);
      headMesh.position.set(2.5, 0, 0);
      headMesh.userData = { name: 'Dense Classification & Softmax Head', explodeDir: new THREE.Vector3(2, 0, 0) };
      this.modelGroup.add(headMesh);
      this.components.push(headMesh);
    } else if (modelMeta.id.includes('biomed') || modelMeta.id.includes('ecg')) {
      // Build Procedural 12-Lead ECG Biomedical Sensor Unit
      const casingGeo = new THREE.BoxGeometry(5, 1.2, 4);
      const casingMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.3, roughness: 0.4 });
      const casing = new THREE.Mesh(casingGeo, casingMat);
      casing.userData = { name: 'Hermetic Medical-Grade Casing & Shielding', explodeDir: new THREE.Vector3(0, -1, 0) };
      this.modelGroup.add(casing);
      this.components.push(casing);

      const afeGeo = new THREE.BoxGeometry(2, 0.4, 2);
      const afeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.8, roughness: 0.2 });
      const afe = new THREE.Mesh(afeGeo, afeMat);
      afe.position.set(0, 0.8, 0);
      afe.userData = { name: 'Analog Front-End (AFE) Low-Noise Differential Bio-Amplifier', explodeDir: new THREE.Vector3(0, 1.5, 0) };
      this.modelGroup.add(afe);
      this.components.push(afe);

      [-1.5, 0, 1.5].forEach((x, i) => {
        const leadGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
        const leadMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.1 });
        const lead = new THREE.Mesh(leadGeo, leadMat);
        lead.position.set(x, 0.5, 1.8);
        lead.rotation.x = Math.PI / 2;
        lead.userData = { name: `Wilson Central Terminal Lead Pin #${i+1}`, explodeDir: new THREE.Vector3(x*0.5, 0, 2) };
        this.modelGroup.add(lead);
        this.components.push(lead);
      });
    } else if (modelMeta.id.includes('aero') || modelMeta.id.includes('turbofan')) {
      // Build Procedural High-Bypass Turbofan Engine
      const nacelleGeo = new THREE.CylinderGeometry(2.4, 2.0, 6, 32, 1, true);
      const nacelleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });
      const nacelle = new THREE.Mesh(nacelleGeo, nacelleMat);
      nacelle.rotation.x = Math.PI / 2;
      nacelle.userData = { name: 'Acoustic Nacelle & Bypass Duct Cowl', explodeDir: new THREE.Vector3(0, 2.5, 0) };
      this.modelGroup.add(nacelle);
      this.components.push(nacelle);

      const shaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 6.5, 24);
      const shaftMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.1 });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      shaft.rotation.x = Math.PI / 2;
      shaft.userData = { name: 'Dual-Spool High-Pressure Turbine Drive Shaft', explodeDir: new THREE.Vector3(0, -1, 0) };
      this.modelGroup.add(shaft);
      this.components.push(shaft);

      // Fan Rotor Blades
      const fanGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.4, 16);
      const fanMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.9, roughness: 0.1 });
      const fan = new THREE.Mesh(fanGeo, fanMat);
      fan.position.set(0, 0, -2.5);
      fan.rotation.x = Math.PI / 2;
      fan.userData = { name: 'Titanium-Alloy Wide-Chord Fan Blisk', explodeDir: new THREE.Vector3(0, 0, -2.5) };
      this.modelGroup.add(fan);
      this.components.push(fan);
    } else if (modelMeta.id.includes('motor') || modelMeta.id.includes('bldc')) {
      // Build Procedural BLDC / Synchronous Motor
      const statorGeo = new THREE.CylinderGeometry(2.4, 2.4, 3.5, 32, 1, true);
      const statorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide });
      const stator = new THREE.Mesh(statorGeo, statorMat);
      stator.userData = { name: 'Laminated Slotted Stator Core', explodeDir: new THREE.Vector3(0, 1.5, 0) };
      this.modelGroup.add(stator);
      this.components.push(stator);

      const rotorGeo = new THREE.CylinderGeometry(1.6, 1.6, 4.2, 24);
      const rotorMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.2 });
      const rotor = new THREE.Mesh(rotorGeo, rotorMat);
      rotor.userData = { name: 'Neodymium Permanent Magnet Rotor & Shaft', explodeDir: new THREE.Vector3(0, 0, 2) };
      this.modelGroup.add(rotor);
      this.components.push(rotor);
    } else if (modelMeta.id.includes('robot') || modelMeta.id.includes('arm')) {
      // Build Procedural 6-DOF Articulated Robotic Arm
      const basePedestal = new THREE.CylinderGeometry(2.5, 3.0, 1.2, 32);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
      const baseMesh = new THREE.Mesh(basePedestal, baseMat);
      baseMesh.userData = { name: 'Rigid Cast-Iron Base & Azimuth Turntable', explodeDir: new THREE.Vector3(0, -1.5, 0) };
      this.modelGroup.add(baseMesh);
      this.components.push(baseMesh);

      const shoulderGeo = new THREE.BoxGeometry(1.6, 3.5, 1.6);
      const armMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.3 });
      const shoulder = new THREE.Mesh(shoulderGeo, armMat);
      shoulder.position.set(0, 2.2, 0);
      shoulder.userData = { name: 'Shoulder Joint & Harmonic Drive Actuator', explodeDir: new THREE.Vector3(0, 1.2, 0) };
      this.modelGroup.add(shoulder);
      this.components.push(shoulder);

      const forearmGeo = new THREE.CylinderGeometry(0.6, 0.6, 3.2, 24);
      const forearmMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.2 });
      const forearm = new THREE.Mesh(forearmGeo, forearmMat);
      forearm.position.set(1.2, 3.6, 0);
      forearm.rotation.z = Math.PI / 4;
      forearm.userData = { name: 'Forearm Linkage & Brushless Servo Motor', explodeDir: new THREE.Vector3(1.5, 1.5, 0) };
      this.modelGroup.add(forearm);
      this.components.push(forearm);

      const gripperGeo = new THREE.BoxGeometry(0.8, 1.0, 1.4);
      const gripperMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.9, roughness: 0.1 });
      const gripper = new THREE.Mesh(gripperGeo, gripperMat);
      gripper.position.set(2.4, 4.8, 0);
      gripper.userData = { name: 'Pneumatic Parallel End-Effector Gripper', explodeDir: new THREE.Vector3(2.5, 2.0, 0) };
      this.modelGroup.add(gripper);
      this.components.push(gripper);
    } else if (modelMeta.id.includes('gearbox') || modelMeta.id.includes('transmission')) {
      // Build Procedural Epicyclic Planetary Gearbox
      const ringGeo = new THREE.CylinderGeometry(3.0, 3.0, 1.2, 32, 1, true);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.userData = { name: 'Internal Annulus Ring Gear (Stationary)', explodeDir: new THREE.Vector3(0, 0, -1.5) };
      this.modelGroup.add(ring);
      this.components.push(ring);

      const sunGeo = new THREE.CylinderGeometry(0.9, 0.9, 1.4, 24);
      const sunMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.9, roughness: 0.1 });
      const sun = new THREE.Mesh(sunGeo, sunMat);
      sun.userData = { name: 'High-Speed Input Sun Gear', explodeDir: new THREE.Vector3(0, 0, 2.5) };
      this.modelGroup.add(sun);
      this.components.push(sun);

      [-1.8, 1.8].forEach((x, i) => {
        const planetGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.3, 20);
        const planetMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 });
        const planet = new THREE.Mesh(planetGeo, planetMat);
        planet.position.set(x, 0, 0);
        planet.userData = { name: `Planetary Gear Mesh #${i+1}`, explodeDir: new THREE.Vector3(x*1.2, 1.2, 0) };
        this.modelGroup.add(planet);
        this.components.push(planet);
      });
    } else if (modelMeta.id.includes('distillation') || modelMeta.id.includes('column')) {
      // Build Procedural Continuous Distillation Tower & Sieve Trays
      const columnGeo = new THREE.CylinderGeometry(1.8, 1.8, 7.5, 32, 1, true);
      const columnMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
      const column = new THREE.Mesh(columnGeo, columnMat);
      column.userData = { name: 'Stainless Steel Column Shell & Insulation', explodeDir: new THREE.Vector3(0, 0, -2) };
      this.modelGroup.add(column);
      this.components.push(column);

      [-2.5, -1.2, 0, 1.2, 2.5].forEach((y, idx) => {
        const trayGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.15, 24);
        const trayMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1 });
        const tray = new THREE.Mesh(trayGeo, trayMat);
        tray.position.set(0, y, 0);
        tray.userData = { name: `Perforated Sieve Tray #${idx + 1} & Downcomer`, explodeDir: new THREE.Vector3(0, y * 0.5, 1.8) };
        this.modelGroup.add(tray);
        this.components.push(tray);
      });

      const reboilerGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.2, 24);
      const reboilerMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });
      const reboiler = new THREE.Mesh(reboilerGeo, reboilerMat);
      reboiler.position.set(2.4, -3.2, 0);
      reboiler.rotation.z = Math.PI / 2;
      reboiler.userData = { name: 'Thermosyphon Reboiler & Vapor Return', explodeDir: new THREE.Vector3(2.5, -1, 0) };
      this.modelGroup.add(reboiler);
      this.components.push(reboiler);
    } else if (modelMeta.id.includes('auto') || modelMeta.id.includes('ev') || modelMeta.id.includes('powertrain')) {
      // Build Procedural 800V EV Skateboard & Battery Pack
      const trayGeo = new THREE.BoxGeometry(6.5, 0.6, 4.5);
      const trayMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
      const tray = new THREE.Mesh(trayGeo, trayMat);
      tray.position.set(0, -0.5, 0);
      tray.userData = { name: 'Structural Aluminum Battery Enclosure & Lower Shield', explodeDir: new THREE.Vector3(0, -1.5, 0) };
      this.modelGroup.add(tray);
      this.components.push(tray);

      [-1.8, 0, 1.8].forEach((x, idx) => {
        const modGeo = new THREE.BoxGeometry(1.5, 0.5, 3.8);
        const modMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6, roughness: 0.2 });
        const module = new THREE.Mesh(modGeo, modMat);
        module.position.set(x, 0.1, 0);
        module.userData = { name: `800V Li-Ion Prismatic Cell Module #${idx + 1}`, explodeDir: new THREE.Vector3(x * 0.5, 1.5, 0) };
        this.modelGroup.add(module);
        this.components.push(module);
      });

      const invGeo = new THREE.BoxGeometry(2.0, 0.8, 1.5);
      const invMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.9, roughness: 0.1 });
      const inv = new THREE.Mesh(invGeo, invMat);
      inv.position.set(-2.2, 0.8, 0);
      inv.userData = { name: 'Dual Silicon Carbide (SiC) Traction Inverter', explodeDir: new THREE.Vector3(-2.0, 2.0, 0) };
      this.modelGroup.add(inv);
      this.components.push(inv);
    } else if (modelMeta.id.includes('antenna') || modelMeta.id.includes('pcb')) {
      // Build Procedural Microstrip Patch Antenna
      const subGeo = new THREE.BoxGeometry(6, 0.4, 5);
      const subMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, metalness: 0.3, roughness: 0.5 });
      const sub = new THREE.Mesh(subGeo, subMat);
      sub.userData = { name: 'High-Frequency Dielectric Substrate (Rogers 4350B)', explodeDir: new THREE.Vector3(0, -0.8, 0) };
      this.modelGroup.add(sub);
      this.components.push(sub);

      const patchGeo = new THREE.BoxGeometry(3.2, 0.1, 2.8);
      const patchMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.1 });
      const patch = new THREE.Mesh(patchGeo, patchMat);
      patch.position.set(0, 0.26, 0);
      patch.userData = { name: 'Quarter-Wave Resonant Copper Patch (5.8 GHz)', explodeDir: new THREE.Vector3(0, 2.0, 0) };
      this.modelGroup.add(patch);
      this.components.push(patch);

      const feedGeo = new THREE.BoxGeometry(0.5, 0.1, 1.8);
      const feed = new THREE.Mesh(feedGeo, patchMat);
      feed.position.set(0, 0.26, 1.8);
      feed.userData = { name: '50-Ohm Inset Impedance Matching Feedline', explodeDir: new THREE.Vector3(0, 1.5, 1.0) };
      this.modelGroup.add(feed);
      this.components.push(feed);
    } else if (modelMeta.id.includes('server')) {
      // Build Procedural Cloud Server Rack
      const frameGeo = new THREE.BoxGeometry(3.5, 6.5, 3.5);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2, wireframe: true });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.userData = { name: '42U Industrial Steel Server Rack Enclosure', explodeDir: new THREE.Vector3(0, 0, -2) };
      this.modelGroup.add(frame);
      this.components.push(frame);

      [-1.8, -0.6, 0.6, 1.8].forEach((y, idx) => {
        const bladeGeo = new THREE.BoxGeometry(3.2, 0.8, 3.2);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3 });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.set(0, y, 0);
        blade.userData = { name: `Compute Blade Sled #${idx + 1} (Dual 64-Core EPYC + 512GB ECC)`, explodeDir: new THREE.Vector3(0, y * 0.4, 2.5) };
        this.modelGroup.add(blade);
        this.components.push(blade);
      });
    } else {
      // Generic Engineering Mechanism (Reciprocating Piston / Engine / Shaft)
      const mainGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
      const mainMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.3 });
      const main = new THREE.Mesh(mainGeo, mainMat);
      main.userData = { name: 'Cylinder Bore & Sleeve Assembly', explodeDir: new THREE.Vector3(0, -1, 0) };
      this.modelGroup.add(main);
      this.components.push(main);

      const pistonGeo = new THREE.CylinderGeometry(1.8, 1.8, 1.4, 24);
      const pistonMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
      const piston = new THREE.Mesh(pistonGeo, pistonMat);
      piston.position.y = 0.8;
      piston.userData = { name: 'High-Compression Piston Crown & Rings', explodeDir: new THREE.Vector3(0, 2.5, 0) };
      this.modelGroup.add(piston);
      this.components.push(piston);
    }

    // Save default component positions
    this.components.forEach((c) => {
      c.userData.initialPos = c.position.clone();
    });
  }

  setExplode(factor) {
    this.explodeFactor = Math.max(0, Math.min(1, factor));
    this.components.forEach((c) => {
      if (c.userData.initialPos && c.userData.explodeDir) {
        const offset = c.userData.explodeDir.clone().multiplyScalar(this.explodeFactor * 2.5);
        c.position.copy(c.userData.initialPos).add(offset);
      }
    });
  }

  toggleCrossSection() {
    this.isCrossSectionActive = !this.isCrossSectionActive;
    if (!this.renderer) return;

    if (this.isCrossSectionActive) {
      this.clippingPlane.constant = 0.5;
      this.renderer.clippingPlanes = [this.clippingPlane];
    } else {
      this.renderer.clippingPlanes = [];
    }
    return this.isCrossSectionActive;
  }

  resetView() {
    this.setExplode(0);
    if (this.camera) {
      this.camera.position.set(0, 5, 12);
      this.camera.lookAt(0, 0, 0);
    }
  }

  setupInteraction() {
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const dom = this.renderer.domElement;

    dom.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    dom.addEventListener('mousemove', (e) => {
      if (!isDragging || !this.modelGroup) return;
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;

      this.modelGroup.rotation.y += deltaX * 0.008;
      this.modelGroup.rotation.x += deltaY * 0.008;

      prevX = e.clientX;
      prevY = e.clientY;
    });

    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (!this.camera) return;
      this.camera.position.z += e.deltaY * 0.01;
      this.camera.position.z = Math.max(4, Math.min(25, this.camera.position.z));
    }, { passive: false });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (!this.isPaused && this.renderer && this.scene && this.camera) {
      if (this.modelGroup && this.explodeFactor === 0) {
        this.modelGroup.rotation.y += 0.003; // Gentle telemetry idle rotation
      }
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) {
      this.renderer.dispose();
      this.container.innerHTML = '';
    }
  }
}
