/**
 * TECHPATH — 3D ENGINEERING MODELS & ENRICHED CLASSES SEED DATA
 * Complete 11-Branch Coverage with Procedural 3D Geometry, 2D Accessible SVG Schematics,
 * Components, Technical Signal Flows, and Official YouTube Embed Data.
 */

export const MODELS_AND_CLASSES_SEED_DATA = {
  branch_models: [
    // ── 1. COMPUTER SCIENCE & ENGINEERING (CSE) ───────────────────────────
    {
      id: 'mod_cse_cpu',
      branch_id: 'cse',
      semester_id: 'sem_3',
      subject_id: 'sub_cse_302',
      subject_code: 'CS302',
      topic: 'Computer Architecture & Processor Pipelines',
      specialization: 'Core Systems Engineering',
      model_type: 'cpu',
      name: 'Multi-Core Microprocessor Architecture & Pipeline',
      title: 'Multi-Core Microprocessor Architecture & Pipeline',
      description: 'Interactive structural telemetry model of a quad-core superscalar microprocessor showing ALU, L1/L2 cache banks, out-of-order execution pipeline, and integrated heat spreader.',
      learning_objective: 'Understand physical floorplanning, cache hierarchy latency, register forwarding, and thermal dissipation in modern superscalar CPUs.',
      difficulty: 'Intermediate',
      career_relevance: 'Hardware Architecture Engineer, Firmware Engineer, OS Kernel Developer at Intel, AMD, NVIDIA, Apple.',
      real_world_applications: [
        'High-performance data center server compute clusters',
        'Real-time automotive safety controllers (ISO 26262)',
        'Edge AI neural accelerators and smartphone SOCs'
      ],
      signal_flow: 'Instruction Fetch (IF) → Instruction Decode (ID) → Out-of-Order Reservation Station → Parallel ALU/FPU Execution (EX) → Reorder Buffer Commit & Memory Write-Back (WB).',
      components: [
        {
          name: 'Core #0 (ALU & L1 Data Cache)',
          what: '32/64-bit Arithmetic Logic Unit coupled to 32KB ultra-low-latency L1 Harvard Cache.',
          why: 'Enables single-cycle integer arithmetic and operand buffering without incurring memory bus wait states.',
          how: 'Combinational full adders, barrel shifters, and SRAM cells triggered on rising clock edge.',
          inputs: 'Opcode, Operands A & B, Clock Edge (3.8 GHz)',
          outputs: 'ALU Result, Condition Flags (Zero, Carry, Overflow)',
          interview_questions: [
            'How does register renaming solve Write-After-Read (WAR) hazards in superscalar out-of-order execution?',
            'What is the difference between direct-mapped and 8-way set-associative cache hit rates?'
          ]
        },
        {
          name: 'Integrated Copper Heat Spreader (IHS)',
          what: 'Nickel-plated electrolytic copper plate bonded to the silicon die via indium solder.',
          why: 'Maximizes thermal surface area to dissipate ~125W TDP heat load into liquid or air cooler.',
          how: 'High thermal conductivity (385 W/m·K) draws heat rapidly from the concentrated 100 mm² silicon hotspots.',
          inputs: 'Thermal flux from CPU Cores',
          outputs: 'Distributed heat flux to heatsink cooling block',
          interview_questions: [
            'Explain the trade-offs between thermal grease and Liquid Metal TIM in thermal interface resistance.'
          ]
        },
        {
          name: 'L2 Shared Cache & Ring Interconnect',
          what: 'Unified SRAM multi-megabyte cache connected via high-speed bidirectional ring bus.',
          why: 'Provides coherent memory sharing across cores and avoids accessing high-latency external DDR5 DRAM.',
          how: 'MESI cache coherence snooping protocol over inter-core crossbar bus.',
          inputs: 'L1 Cache Miss requests, Core memory reads/writes',
          outputs: 'Coherent cache lines, Snoop responses',
          interview_questions: [
            'Explain how the MESI protocol handles concurrent writes to the same memory address across Core 0 and Core 1.'
          ]
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">MICROPROCESSOR ARCHITECTURE BLOCK SCHEMATIC</text>
        <rect x="50" y="80" width="220" height="100" rx="6" fill="#1e293b" stroke="#e11d48" stroke-width="2"/>
        <text x="65" y="110" fill="#fff" font-size="14" font-weight="bold">Core 0 (ALU / L1 D-Cache)</text>
        <text x="65" y="135" fill="#94a3b8" font-size="12">Superscalar 4-Wide Issue</text>
        <rect x="330" y="80" width="220" height="100" rx="6" fill="#1e293b" stroke="#e11d48" stroke-width="2"/>
        <text x="345" y="110" fill="#fff" font-size="14" font-weight="bold">Core 1 (ALU / L1 D-Cache)</text>
        <text x="345" y="135" fill="#94a3b8" font-size="12">Out-of-Order Scheduler</text>
        <rect x="50" y="210" width="500" height="60" rx="6" fill="#1e293b" stroke="#0ea5e9" stroke-width="2"/>
        <text x="180" y="245" fill="#38bdf8" font-size="14" font-weight="bold">L2 / L3 Shared Unified Cache & Crossbar Interconnect</text>
        <line x1="160" y1="180" x2="160" y2="210" stroke="#f59e0b" stroke-width="3"/>
        <line x1="440" y1="180" x2="440" y2="210" stroke="#f59e0b" stroke-width="3"/>
        <text x="50" y="305" fill="#64748b" font-size="11">TechPath Academic 2D Precision Technical Blueprint &bull; CS302 Core Architecture</text>
      </svg>`,
      quiz: [
        {
          question: 'What is the primary function of the Reorder Buffer (ROB) in modern out-of-order CPUs?',
          options: ['To ensure in-order retirement and precise interrupt handling', 'To compress cache lines', 'To regulate clock frequencies', 'To generate RAM addresses'],
          correct_option: 0,
          explanation: 'The Reorder Buffer allows speculative execution while guaranteeing instructions commit their architectural registers in the original program order.'
        }
      ]
    },
    {
      id: 'mod_cse_server',
      branch_id: 'cse',
      semester_id: 'sem_5',
      subject_id: 'sub_cse_602',
      subject_code: 'CS602',
      topic: 'Cloud Infrastructure & High-Density Rack Compute',
      specialization: 'Cloud & Distributed Systems',
      model_type: 'server_rack',
      name: 'High-Density Cloud Server Rack & Top-of-Rack Switch',
      title: 'High-Density Cloud Server Rack & Top-of-Rack Switch',
      description: 'Interactive 3D model of a 42U cloud data center rack featuring dual 100GbE Top-of-Rack (ToR) switches, hot-swappable NVMe compute sleds, and redundant N+1 power distribution units.',
      learning_objective: 'Understand horizontal scalability, non-blocking leaf-spine networking, thermal hot-aisle containment, and hyperconverged infrastructure design.',
      difficulty: 'Advanced',
      career_relevance: 'Cloud Solutions Architect, DevOps / Site Reliability Engineer at AWS, Microsoft Azure, Google Cloud.',
      real_world_applications: ['Global hyperscale cloud availability zones', 'AI training clusters with NVLink interconnects'],
      signal_flow: 'Leaf Switch Packet Ingress → 100GbE QSFP28 Fiber Interface → PCIe Gen 5 Host Bus Adapter → Kernel NVMe-over-Fabrics Storage Queue.',
      components: [
        {
          name: 'Top-of-Rack (ToR) Spine Switch (100GbE)',
          what: '32-port QSFP28 low-latency ASIC packet routing switch.',
          why: 'Provides non-blocking wire-speed east-west traffic between compute nodes within the rack.',
          how: 'Cut-through packet switching with hardware BGP EVPN / VXLAN overlay encapsulation.',
          inputs: 'Optical fiber uplinks from leaf/spine fabric',
          outputs: 'Direct-attach copper twinax to compute sleds',
          interview_questions: ['What causes microburst buffer overflows in high-concurrency ToR switches, and how does ECN solve it?']
        },
        {
          name: '1U Blade Compute Sled (Dual Xeon/EPYC)',
          what: 'Modular server chassis containing dual sockets, 512GB DDR5 ECC RAM, and redundant hot-swap fans.',
          why: 'Delivers high compute density per square foot of data center raised floor.',
          how: 'BMC out-of-band management via IPMI/Redfish with redundant 12V bus-bar DC power.',
          inputs: '230V AC or 48V DC bus-bar, Ethernet data',
          outputs: 'Microservice API responses, low-latency database queries',
          interview_questions: ['Explain the difference between RAID 10 and erasure coding in distributed cloud storage clusters.']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">42U HYPERSCALE SERVER RACK TELEMETRY</text>
        <rect x="80" y="80" width="440" height="40" rx="4" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
        <text x="180" y="105" fill="#fff" font-size="13" font-weight="bold">Dual 100GbE Top-of-Rack (ToR) Switch</text>
        <rect x="80" y="135" width="440" height="45" rx="4" fill="#1e293b" stroke="#e11d48" stroke-width="1.5"/>
        <text x="140" y="162" fill="#f43f5e" font-size="13" font-weight="bold">Blade Sled #1: Dual 64-Core EPYC + 512GB DDR5 ECC</text>
        <rect x="80" y="190" width="440" height="45" rx="4" fill="#1e293b" stroke="#e11d48" stroke-width="1.5"/>
        <text x="140" y="217" fill="#f43f5e" font-size="13" font-weight="bold">Blade Sled #2: Dual 64-Core EPYC + 512GB DDR5 ECC</text>
        <rect x="80" y="250" width="440" height="40" rx="4" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>
        <text x="210" y="275" fill="#34d399" font-size="13" font-weight="bold">Dual Redundant 3000W N+1 Platinum PDU</text>
      </svg>`,
      quiz: [
        {
          question: 'In modern cloud architectures, what is the primary advantage of a Leaf-Spine Clos topology over traditional 3-tier hierarchical networks?',
          options: ['Predictable, consistent low latency for East-West server traffic', 'Lower cost of cabling', 'Zero need for IP routing', 'Eliminates server power supplies'],
          correct_option: 0,
          explanation: 'In a Leaf-Spine topology, every leaf is connected to every spine, guaranteeing that every server node is equidistant with exactly two switch hops.'
        }
      ]
    },

    // ── 2. ELECTRONICS & COMMUNICATION ENGINEERING (ECE) ──────────────────
    {
      id: 'mod_ece_finfet',
      branch_id: 'ece',
      semester_id: 'sem_3',
      subject_id: 'sub_ece_301',
      subject_code: 'EC301',
      topic: 'Semiconductor Device Physics & Sub-10nm VLSI',
      specialization: 'VLSI & Microelectronics',
      model_type: 'finfet',
      name: '3D FinFET Transistor (Tri-Gate Semiconductor)',
      title: '3D FinFET Transistor (Tri-Gate Semiconductor)',
      description: '3D physical visualization of a sub-7nm Fin Field-Effect Transistor showing the 3-sided wrap-around gate, high-k dielectric oxide layer, and vertical silicon conducting channel fin.',
      learning_objective: 'Understand how electrostatic gate control over three surfaces suppresses Short Channel Effects (SCE) and Drain-Induced Barrier Lowering (DIBL).',
      difficulty: 'Intermediate',
      career_relevance: 'VLSI Design Engineer, Semiconductor Process Engineer at TSMC, Intel, Qualcomm, Texas Instruments.',
      real_world_applications: ['5nm/3nm Smartphone processor fabrication', 'Ultra-low-power biomedical analog ICs'],
      signal_flow: 'Gate Voltage Exceeds Threshold (V_GS > V_th) → Inversion Layer Forms on 3 Surfaces of Fin → Electrons Drift from Source to Drain via Drift-Diffusion Current.',
      components: [
        {
          name: 'Vertical Silicon Fin Channel',
          what: 'Thin vertical 3D silicon fin (width ~5-7 nm) bridging Source and Drain.',
          why: 'Provides the conducting path for electron transport between source and drain.',
          how: 'Extruded vertically using self-aligned quadruple patterning (SAQP) lithography.',
          inputs: 'Source electrons at potential V_S',
          outputs: 'Drain current I_D',
          interview_questions: ['Explain why subthreshold swing approaches the theoretical 60 mV/decade limit more closely in FinFETs than planar MOSFETs.']
        },
        {
          name: 'Tri-Gate Wrap-Around High-k Dielectric',
          what: 'Hafnium dioxide (HfO2) insulating layer and work-function metal gate surrounding the fin on top and both sides.',
          why: 'Suppresses gate leakage tunneling while maximizing capacitive coupling to channel.',
          how: 'Atomic layer deposition (ALD) ensures conformal pinhole-free coverage down to 1 nm EOT.',
          inputs: 'Gate potential V_GS',
          outputs: 'Electrostatic field vector across fin',
          interview_questions: ['What is Equivalent Oxide Thickness (EOT), and why was SiO2 replaced by High-k metal gate materials?']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">3D FINFET TRI-GATE SEMICONDUCTOR STRUCTURE</text>
        <rect x="60" y="240" width="480" height="50" fill="#334155" rx="4"/>
        <text x="210" y="270" fill="#94a3b8" font-size="13">Silicon Substrate & Buried Oxide (BOX)</text>
        <rect x="260" y="110" width="80" height="130" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
        <text x="270" y="175" fill="#fff" font-size="12" font-weight="bold">3D Fin</text>
        <rect x="200" y="100" width="200" height="50" fill="#e11d48" opacity="0.85" rx="4"/>
        <text x="230" y="130" fill="#fff" font-size="13" font-weight="bold">Wrap-Around Metal Gate</text>
        <rect x="80" y="140" width="120" height="100" fill="#10b981" opacity="0.7" rx="4"/>
        <text x="120" y="195" fill="#fff" font-size="13" font-weight="bold">Source</text>
        <rect x="400" y="140" width="120" height="100" fill="#10b981" opacity="0.7" rx="4"/>
        <text x="445" y="195" fill="#fff" font-size="13" font-weight="bold">Drain</text>
      </svg>`,
      quiz: [
        {
          question: 'What is the primary physical reason 3D FinFETs suppress short-channel effects compared to planar MOSFETs?',
          options: ['Gate wraps around the channel on 3 sides, providing superior electrostatic control', 'They use thicker gate dielectric', 'They operate on alternating current', 'They eliminate doping in the source and drain'],
          correct_option: 0,
          explanation: 'Wrapping the gate on three sides of the fin channel allows the gate electric field to dominate over the drain field, severely mitigating Drain-Induced Barrier Lowering (DIBL).'
        }
      ]
    },
    {
      id: 'mod_ece_antenna',
      branch_id: 'ece',
      semester_id: 'sem_5',
      subject_id: 'sub_ece_501',
      subject_code: 'EC501',
      topic: 'Electromagnetics & RF Antenna Design',
      specialization: 'RF & Wireless Communication',
      model_type: 'pcb_antenna',
      name: 'Microstrip Patch Antenna & RF Feedline (5.8 GHz)',
      title: 'Microstrip Patch Antenna & RF Feedline (5.8 GHz)',
      description: 'Interactive high-frequency PCB antenna demonstrating quarter-wave resonant patch geometry, fringing electromagnetic E-fields, microstrip feedline matching, and ground plane return current.',
      learning_objective: 'Analyze input impedance matching, radiation pattern directivity, return loss (S11), and dielectric substrate permittivity effects.',
      difficulty: 'Intermediate',
      career_relevance: 'RF Systems Engineer, Antenna Engineer at Apple, Qualcomm, ISRO, Collins Aerospace.',
      real_world_applications: ['5G phased-array wireless base stations', 'Automotive 77 GHz collision radar sensors'],
      signal_flow: 'Transceiver Output → 50-Ohm Coaxial Microstrip Trace → Resonant Microstrip Patch → Fringing Electric Fields Radiate TEM Wave into Free Space.',
      components: [
        {
          name: 'Resonant Copper Radiating Patch',
          what: 'Rectangular copper foil patch dimensioned to approximately half the guided wavelength (λ_g / 2).',
          why: 'Acts as an open-circuit resonant cavity where edge fringe fields radiate electromagnetic energy into space.',
          how: 'Chemical etching on low-loss Rogers or FR-4 laminate.',
          inputs: 'RF power from 50-ohm microstrip feed',
          outputs: 'Radiated electromagnetic field (Far-Field Radiation Pattern)',
          interview_questions: ['How do substrate dielectric constant (ε_r) and thickness (h) affect antenna bandwidth and radiation efficiency?']
        },
        {
          name: 'Ground Plane & Substrate Dielectric',
          what: 'Solid continuous copper plane separated from patch by a low-loss dielectric substrate.',
          why: 'Provides RF return current path and shields rear radiation to achieve directional hemisphere beam.',
          how: 'Continuous sheet of copper foil with minimal discontinuities.',
          inputs: 'Displacement current from radiating patch',
          outputs: 'Low-impedance return to ground',
          interview_questions: ['What is the significance of the Voltage Standing Wave Ratio (VSWR) and S11 < -10 dB in RF antenna qualification?']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">MICROSTRIP PATCH ANTENNA RF RADIATION SCHEMATIC</text>
        <rect x="50" y="240" width="500" height="20" fill="#d97706" rx="2"/>
        <text x="210" y="255" fill="#fff" font-size="12" font-weight="bold">Continuous Copper Ground Plane</text>
        <rect x="50" y="160" width="500" height="80" fill="#0f766e" opacity="0.6" rx="2"/>
        <text x="220" y="205" fill="#5eead4" font-size="13" font-weight="bold">Dielectric Substrate (Rogers/FR4)</text>
        <rect x="150" y="140" width="300" height="20" fill="#d97706" rx="2"/>
        <text x="235" y="155" fill="#fff" font-size="13" font-weight="bold">Radiating Patch (λ_g / 2)</text>
        <path d="M 130 140 C 110 100, 110 60, 150 40" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4" fill="none"/>
        <path d="M 470 140 C 490 100, 490 60, 450 40" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4" fill="none"/>
        <text x="180" y="80" fill="#f59e0b" font-size="13">Fringing Electric E-Fields (Radiation)</text>
      </svg>`,
      quiz: [
        {
          question: 'What is the standard acceptable threshold of Return Loss (S11) for a matched antenna in engineering practice?',
          options: ['Less than or equal to -10 dB', 'Greater than +10 dB', 'Exactly 0 dB', '+3 dB'],
          correct_option: 0,
          explanation: 'S11 ≤ -10 dB signifies that 90% or more of incident RF power is delivered to the antenna and less than 10% is reflected back.'
        }
      ]
    },

    // ── 3. ELECTRICAL & ELECTRONICS ENGINEERING (EEE) ─────────────────────
    {
      id: 'mod_eee_transformer',
      branch_id: 'eee',
      semester_id: 'sem_3',
      subject_id: 'sub_eee_301',
      subject_code: 'EE301',
      topic: 'Electrical Machines & Magnetic Circuits',
      specialization: 'Power Systems & Energy',
      model_type: 'transformer',
      name: 'Three-Phase Core-Type Power Transformer (11kV / 415V)',
      title: 'Three-Phase Core-Type Power Transformer (11kV / 415V)',
      description: 'Interactive high-voltage transformer model featuring laminated silicon steel core limbs, concentric primary and secondary copper windings, porcelain oil-filled bushings, and conservator tank.',
      learning_objective: 'Understand Faraday’s Law of electromagnetic induction, core eddy current loss mitigation through laminations, and transformer vector group phase shifts.',
      difficulty: 'Intermediate',
      career_relevance: 'Power Grid Engineer, Substation Design Engineer at Siemens, ABB, GE Vernova, PowerGrid.',
      real_world_applications: ['Step-down distribution substations in electrical utility grids', 'Renewable solar inverter step-up stations'],
      signal_flow: '11 kV AC Primary Voltage Applied → Mutual Alternating Magnetic Flux Generated in Core → Induced EMF in Secondary Winding According to Turns Ratio (N_p / N_s) → 415V AC Output Delivered to Load.',
      components: [
        {
          name: 'Laminated Grain-Oriented (CRGO) Steel Core',
          what: 'E-I shaped cold-rolled grain-oriented silicon steel laminations coated with insulating varnish.',
          why: 'Provides high magnetic permeability path while restricting core eddy currents and hysteresis loss.',
          how: 'Stacked 0.27mm thin sheets clamped tightly to avoid acoustic hum.',
          inputs: 'Primary magnetizing current',
          outputs: 'Alternating magnetic flux Φ (Tesla)',
          interview_questions: ['Why is the transformer core grounded at only one single point instead of multiple points?']
        },
        {
          name: 'Concentric Copper Windings (HV & LV)',
          what: 'Insulated copper conductors wrapped around each core limb, with Low-Voltage windings placed closest to the core.',
          why: 'Minimizes electrical insulation thickness requirement and reduces leakage flux.',
          how: 'Enameled rectangular copper strips immersed in mineral transformer dielectric oil.',
          inputs: 'Primary 11 kV AC supply',
          outputs: 'Secondary 415V three-phase output',
          interview_questions: ['Explain why the open-circuit test is conducted on the LV side while the short-circuit test is performed on the HV side.']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">THREE-PHASE CORE TRANSFORMER MAGNETIC CIRCUIT</text>
        <rect x="100" y="90" width="400" height="200" rx="8" fill="none" stroke="#64748b" stroke-width="24"/>
        <rect x="280" y="90" width="40" height="200" fill="#64748b"/>
        <rect x="140" y="120" width="60" height="140" rx="4" fill="#d97706"/>
        <rect x="270" y="120" width="60" height="140" rx="4" fill="#d97706"/>
        <rect x="400" y="120" width="60" height="140" rx="4" fill="#d97706"/>
        <text x="145" y="195" fill="#fff" font-size="13" font-weight="bold">Phase A</text>
        <text x="275" y="195" fill="#fff" font-size="13" font-weight="bold">Phase B</text>
        <text x="405" y="195" fill="#fff" font-size="13" font-weight="bold">Phase C</text>
      </svg>`,
      quiz: [
        {
          question: 'What is the primary function of adding 3% to 4% silicon to transformer core steel?',
          options: ['Increases electrical resistivity to reduce eddy current loss', 'Makes the core mechanically flexible', 'Increases thermal expansion', 'Decreases saturation flux density'],
          correct_option: 0,
          explanation: 'Silicon increases the electrical resistivity of the steel, significantly limiting the circulation of induced eddy currents and reducing heating losses.'
        }
      ]
    },
    {
      id: 'mod_eee_bldc',
      branch_id: 'eee',
      semester_id: 'sem_4',
      subject_id: 'sub_eee_401',
      subject_code: 'EE401',
      topic: 'Power Electronics & Inverter Motor Drives',
      specialization: 'Electric Drives & Vehicles',
      model_type: 'bldc_motor',
      name: 'Brushless DC (BLDC) Motor & Electronic Inverter',
      title: 'Brushless DC (BLDC) Motor & Electronic Inverter',
      description: '3D model of an inner-rotor permanent magnet brushless DC motor showing slotted three-phase stator windings, neodymium rare-earth rotor magnets, Hall-effect commutation sensors, and heavy-duty ball bearings.',
      learning_objective: 'Understand trapezoidal back-EMF generation, six-step inverter commutation, torque ripple reduction, and field-oriented control (FOC).',
      difficulty: 'Intermediate',
      career_relevance: 'EV Motor Drive Engineer, Robotics Actuator Specialist at Tesla, Bosch, Schneider Electric.',
      real_world_applications: ['Electric vehicle traction motors', 'Industrial drone propulsion and robotic joints'],
      signal_flow: 'Hall Sensors Detect Rotor Angle → Microcontroller Switches Six-Step MOSFET Inverter Bridge → Stator Magnetic Field Rotates at Synchronous Speed → Permanent Magnet Rotor Follows Field Producing Mechanical Torque.',
      components: [
        {
          name: 'Slotted Stator & Copper Coils',
          what: 'Laminated stator core wound with 3-phase concentrated copper windings.',
          why: 'Generates rotating magnetic field when energized by the power electronics inverter bridge.',
          how: 'Wound in star or delta configuration with 120-degree spatial displacement.',
          inputs: 'PWM-modulated 3-phase AC currents (U, V, W)',
          outputs: 'Synchronously rotating magnetic stator field',
          interview_questions: ['Explain the key differences between Field-Oriented Control (FOC) and Six-Step trapezoidal commutation in BLDC motors.']
        },
        {
          name: 'Permanent Magnet Rotor & Shaft',
          what: 'High-grade Neodymium-Iron-Boron (NdFeB) surface-mount permanent magnets on steel shaft.',
          why: 'Provides constant rotor magnetic flux without incurring rotor resistive I²R copper losses.',
          how: 'Even number of alternating North and South magnetic poles bonded with carbon-fiber sleeve.',
          inputs: 'Interaction with stator rotating field',
          outputs: 'Output mechanical shaft torque and rotational kinetic energy',
          interview_questions: ['What causes cogging torque in permanent magnet motors, and how do motor designers minimize it?']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">BLDC MOTOR RADIAL CROSS-SECTION SCHEMATIC</text>
        <circle cx="300" cy="190" r="110" fill="#1e293b" stroke="#64748b" stroke-width="12"/>
        <circle cx="300" cy="190" r="65" fill="#0284c7" stroke="#38bdf8" stroke-width="3"/>
        <circle cx="300" cy="190" r="25" fill="#94a3b8"/>
        <text x="270" y="195" fill="#fff" font-size="12" font-weight="bold">Shaft</text>
        <text x="280" y="150" fill="#e11d48" font-size="14" font-weight="bold">N</text>
        <text x="280" y="240" fill="#38bdf8" font-size="14" font-weight="bold">S</text>
        <text x="35" y="325" fill="#94a3b8" font-size="12">Stator Limbs & Copper Coils Energized Sequentially Every 60 Electrical Degrees</text>
      </svg>`,
      quiz: [
        {
          question: 'Why do BLDC motors have higher reliability and lower maintenance compared to brushed DC motors?',
          options: ['They eliminate mechanical carbon brushes and commutator rings that spark and wear out', 'They do not use magnetic fields', 'They operate without a rotor', 'They require no power electronics'],
          correct_option: 0,
          explanation: 'By replacing mechanical brushes with solid-state transistor commutation, BLDC motors eliminate friction, arcing, and brush degradation.'
        }
      ]
    },

    // ── 4. MECHANICAL ENGINEERING (MECH) ──────────────────────────────────
    {
      id: 'mod_mech_engine',
      branch_id: 'mech',
      semester_id: 'sem_3',
      subject_id: 'sub_mech_301',
      subject_code: 'ME301',
      topic: 'Internal Combustion Engines & Thermodynamics',
      specialization: 'Thermal & Energy Systems',
      model_type: 'piston_engine',
      name: 'Four-Stroke Internal Combustion Engine & Slider-Crank',
      title: 'Four-Stroke Internal Combustion Engine & Slider-Crank',
      description: '3D reciprocating mechanism showing the piston cylinder, connecting rod, counterweighted crankshaft, overhead valves, spark plug, and thermodynamic cycle indicators.',
      learning_objective: 'Understand the Otto and Diesel cycles, kinematic slider-crank velocity/acceleration derivations, and volumetric efficiency.',
      difficulty: 'Intermediate',
      career_relevance: 'Powertrain Engineer, Thermal Systems Specialist at Tata Motors, Mahindra, Cummins, Caterpillar.',
      real_world_applications: ['Automotive internal combustion engines', 'Industrial standby diesel generation units'],
      signal_flow: 'Suction Stroke (Air-Fuel Intake) → Compression Stroke (Work In) → Power Stroke (Combustion Expansion Work Out) → Exhaust Stroke (Burned Gases Discharged).',
      components: [
        {
          name: 'Aluminum Alloy Piston & Piston Rings',
          what: 'Lightweight cylindrical slider with compression and oil scraper rings.',
          why: 'Transfers high combustion gas pressure force to connecting rod while maintaining cylinder seal.',
          how: 'Cast or forged aluminum alloy with silicone content to minimize thermal expansion.',
          inputs: 'High-pressure gas explosion from combustion chamber',
          outputs: 'Reciprocating linear thrust to connecting rod wrist pin',
          interview_questions: ['What is the purpose of piston skirt ovality and taper in internal combustion engines?']
        },
        {
          name: 'Drop-Forged Steel Crankshaft',
          what: 'Rotating shaft with precision-machined crankpins, journals, and counterweights.',
          why: 'Converts reciprocating linear piston motion into uniform rotational shaft torque.',
          how: 'Forged high-strength alloy steel induction-hardened on bearing journals.',
          inputs: 'Linear connecting rod force',
          outputs: 'Brake torque delivered to flywheel (N·m)',
          interview_questions: ['How do engine designers calculate crankshaft balancing to cancel out primary and secondary reciprocating inertia forces?']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">SLIDER-CRANK RECIPROCATING ENGINE MECHANISM</text>
        <rect x="230" y="80" width="140" height="160" fill="none" stroke="#64748b" stroke-width="6"/>
        <rect x="245" y="100" width="110" height="60" fill="#e2e8f0" stroke="#0284c7" stroke-width="2"/>
        <text x="275" y="135" fill="#0b0f19" font-size="13" font-weight="bold">Piston</text>
        <line x1="300" y1="160" x2="300" y2="240" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/>
        <circle cx="300" cy="270" r="35" fill="#334155" stroke="#e11d48" stroke-width="3"/>
        <circle cx="300" cy="240" r="6" fill="#fff"/>
        <text x="260" y="275" fill="#fff" font-size="12" font-weight="bold">Crankshaft</text>
      </svg>`,
      quiz: [
        {
          question: 'In an ideal four-stroke Otto cycle, how many crankshaft revolutions are required to complete one full thermodynamic power cycle?',
          options: ['Two full revolutions (720 degrees)', 'One revolution (360 degrees)', 'Four revolutions', 'Half revolution'],
          correct_option: 0,
          explanation: 'In a 4-stroke engine, each stroke corresponds to 180° of crankshaft rotation, requiring 4 × 180° = 720° (2 complete revolutions).'
        }
      ]
    },
    {
      id: 'mod_mech_gearbox',
      branch_id: 'mech',
      semester_id: 'sem_5',
      subject_id: 'sub_mech_501',
      subject_code: 'ME501',
      topic: 'Design of Machine Elements & Gear Trains',
      specialization: 'Automotive & Mechanical Design',
      model_type: 'planetary_gearbox',
      name: 'Epicyclic Planetary Gearbox & Speed Reducer',
      title: 'Epicyclic Planetary Gearbox & Speed Reducer',
      description: 'Coaxial planetary gear assembly with central sun gear, multiple planet gears mounted on a rigid carrier, and outer internal ring annulus gear.',
      learning_objective: 'Derive gear train velocity ratios using tabular method, calculate tooth contact stress via Lewis formula, and analyze torque multiplication.',
      difficulty: 'Intermediate',
      career_relevance: 'Gearbox Systems Engineer, Transmission Engineer at ZF, Dana, Allison Transmission, L&T.',
      real_world_applications: ['Automatic transmissions in passenger cars', 'Wind turbine main speed step-up gearboxes'],
      signal_flow: 'High-Speed Low-Torque Input to Sun Gear → Planet Gears Revolve Around Carrier Within Stationary Ring → Low-Speed High-Torque Output Delivered by Carrier.',
      components: [
        {
          name: 'High-Speed Sun Gear',
          what: 'Central external spur/helical gear driven by input motor shaft.',
          why: 'Transmits power equally to all planet gears, splitting the load across multiple tooth meshes.',
          how: 'Case-hardened 8620 alloy steel with ground tooth profile.',
          inputs: 'High-speed motor rotation',
          outputs: 'Mesh torque to planet gears',
          interview_questions: ['Explain why epicyclic planetary gearboxes achieve higher power density than standard parallel-axis gear trains.']
        },
        {
          name: 'Planet Carrier & Annulus Ring',
          what: 'Rigid cast spider housing planet gear pins inside stationary internal ring gear.',
          why: 'Collects orbital rotation of planet gears and transfers high mechanical torque to output shaft.',
          how: 'Precision CNC machined ductile iron.',
          inputs: 'Orbital motion of planet gear cluster',
          outputs: 'High-torque low-speed output shaft rotation',
          interview_questions: ['How do you use the tabular relative velocity method to find the overall gear ratio when the ring gear is fixed?']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">EPICYCLIC PLANETARY GEAR TRAIN CROSS-SECTION</text>
        <circle cx="300" cy="190" r="110" fill="none" stroke="#475569" stroke-width="16"/>
        <text x="210" y="95" fill="#94a3b8" font-size="12">Internal Ring (Annulus) Gear</text>
        <circle cx="300" cy="190" r="30" fill="#e11d48"/>
        <text x="285" y="195" fill="#fff" font-size="12" font-weight="bold">Sun</text>
        <circle cx="230" cy="190" r="28" fill="#0284c7"/>
        <circle cx="370" cy="190" r="28" fill="#0284c7"/>
        <text x="215" y="195" fill="#fff" font-size="11" font-weight="bold">Planet</text>
        <text x="355" y="195" fill="#fff" font-size="11" font-weight="bold">Planet</text>
      </svg>`,
      quiz: [
        {
          question: 'In a planetary gear set where the ring gear (Z_r = 60 teeth) is held stationary and the sun gear (Z_s = 20 teeth) is the input, what is the gear ratio to the planet carrier?',
          options: ['4 : 1 (1 + 60/20)', '3 : 1 (60/20)', '2 : 1', '5 : 1'],
          correct_option: 0,
          explanation: 'When the ring gear is fixed, the carrier speed ratio is 1 + (Z_ring / Z_sun) = 1 + (60 / 20) = 4:1.'
        }
      ]
    },

    // ── 5. CIVIL ENGINEERING (CIVIL) ──────────────────────────────────────
    {
      id: 'mod_civil_bridge',
      branch_id: 'civil',
      semester_id: 'sem_3',
      subject_id: 'sub_civ_301',
      subject_code: 'CE301',
      topic: 'Structural Analysis & Steel Truss Systems',
      specialization: 'Structural & Infrastructure Engineering',
      model_type: 'truss_bridge',
      name: 'Pratt Steel Highway Truss Bridge & Deck System',
      title: 'Pratt Steel Highway Truss Bridge & Deck System',
      description: '3D structural model showing vertical compression posts, tension diagonal chords, bottom chord tension ties, gusset plate connections, and reinforced concrete roadway deck plate.',
      learning_objective: 'Master Method of Joints and Method of Sections, calculate influence lines for moving vehicular live loads, and verify buckling stability under Euler-Johnson criteria.',
      difficulty: 'Intermediate',
      career_relevance: 'Structural Bridge Engineer, Infrastructure Consultant at AECOM, WSP, L&T Construction, Afcons.',
      real_world_applications: ['Railway river crossings', 'Heavy highway corridor infrastructure'],
      signal_flow: 'Vehicular Wheel Load on Deck → Transferred to Transverse Floor Beams → Distributed to Lower Chord Panel Joints → Resolved into Pure Axial Tension & Compression Member Forces.',
      components: [
        {
          name: 'Top Compression Chord',
          what: 'Heavy box-girder steel member running longitudinally along top of truss.',
          why: 'Resists global bending moment by carrying massive axial compressive forces across span.',
          how: 'Fabricated structural steel with lateral bracing to prevent out-of-plane lateral buckling.',
          inputs: 'Global sagging bending moment from bridge deck',
          outputs: 'Axial compression force P (Kilonewtons)',
          interview_questions: ['How do structural engineers design against Euler column buckling in long top chord truss members?']
        },
        {
          name: 'Gusset Plate Joint Connectors',
          what: 'High-strength steel plates bolted or welded where diagonal and vertical chords intersect.',
          why: 'Concentrates and safely redistributes axial forces without inducing secondary bending moments.',
          how: 'High-strength friction grip (HSFG) bolts torqued to specified clamping tension.',
          inputs: 'Multiple converging member axial force vectors',
          outputs: 'Zero moment equilibrium at the panel node',
          interview_questions: ['What critical design flaw in gusset plate thickness contributed to the I-35W Mississippi River bridge collapse in 2007?']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">PRATT STEEL TRUSS FORCE RESOLUTION BLUEPRINT</text>
        <line x1="80" y1="120" x2="520" y2="120" stroke="#6366f1" stroke-width="5"/>
        <text x="210" y="110" fill="#818cf8" font-size="12" font-weight="bold">Top Chord (Compression: C)</text>
        <line x1="80" y1="240" x2="520" y2="240" stroke="#10b981" stroke-width="5"/>
        <text x="210" y="265" fill="#34d399" font-size="12" font-weight="bold">Bottom Chord (Tension: T)</text>
        <line x1="80" y1="240" x2="160" y2="120" stroke="#f59e0b" stroke-width="3"/>
        <line x1="160" y1="120" x2="240" y2="240" stroke="#f59e0b" stroke-width="3"/>
        <line x1="240" y1="240" x2="320" y2="120" stroke="#f59e0b" stroke-width="3"/>
        <line x1="320" y1="120" x2="400" y2="240" stroke="#f59e0b" stroke-width="3"/>
        <line x1="400" y1="240" x2="480" y2="120" stroke="#f59e0b" stroke-width="3"/>
        <line x1="480" y1="120" x2="520" y2="240" stroke="#f59e0b" stroke-width="3"/>
        <line x1="160" y1="120" x2="160" y2="240" stroke="#94a3b8" stroke-width="2"/>
        <line x1="320" y1="120" x2="320" y2="240" stroke="#94a3b8" stroke-width="2"/>
        <line x1="480" y1="120" x2="480" y2="240" stroke="#94a3b8" stroke-width="2"/>
      </svg>`,
      quiz: [
        {
          question: 'In a standard Pratt truss under downward gravitational loading, what state of stress are the internal diagonal web members subjected to?',
          options: ['Tension', 'Compression', 'Torsion', 'Pure Bending'],
          correct_option: 0,
          explanation: 'In a Pratt truss, the diagonal web members slant down toward the center of the span and are in tension, while the vertical members are in compression.'
        }
      ]
    },

    // ── 6. ARTIFICIAL INTELLIGENCE & MACHINE LEARNING (AIML) ───────────────
    {
      id: 'mod_aiml_attention',
      branch_id: 'aiml',
      semester_id: 'sem_5',
      subject_id: 'sub_aiml_501',
      subject_code: 'AI501',
      topic: 'Deep Learning & Transformer Architectures',
      specialization: 'Natural Language Processing & Generative AI',
      model_type: 'nn',
      name: 'Transformer Multi-Head Self-Attention Pipeline',
      title: 'Transformer Multi-Head Self-Attention Pipeline',
      description: '3D architectural visualization of Scaled Dot-Product Attention showing Query (Q), Key (K), and Value (V) matrix multiplications, Softmax scaling layer, causal masking, and linear projection heads.',
      learning_objective: 'Derive attention complexity O(N²), understand dimensional normalization sqrt(d_k), and visualize how semantic context vectors are dynamically computed.',
      difficulty: 'Advanced',
      career_relevance: 'AI Research Scientist, Large Language Model Engineer at OpenAI, Google DeepMind, Anthropic, Meta.',
      real_world_applications: ['Generative LLMs (GPT-4, Gemini, Claude)', 'Vision Transformers (ViT) for autonomous navigation'],
      signal_flow: 'Input Token Embeddings X → Multiply by W_Q, W_K, W_V → Compute Q·K^T / sqrt(d_k) → Apply Softmax Weights to Value Matrix V → Multi-Head Concatenation & LayerNorm.',
      components: [
        {
          name: 'Scaled Dot-Product Attention Core',
          what: 'Tensor compute kernel executing Attention(Q,K,V) = Softmax(Q·K^T / sqrt(d_k))·V.',
          why: 'Enables every token in the sequence to attend to every other token regardless of distance.',
          how: 'Accelerated matrix multiply (GEMM) executed on GPU Tensor Cores.',
          inputs: 'Query Tensor [B, H, S, d_k], Key Tensor [B, H, S, d_k]',
          outputs: 'Context-weighted Representation Tensor [B, H, S, d_k]',
          interview_questions: ['Why do we divide by the square root of d_k before taking the Softmax in self-attention?']
        },
        {
          name: 'Multi-Head Projection & Residual Add/Norm',
          what: 'Linear projection layer followed by skip connection and Layer Normalization.',
          why: 'Permits the model to jointly attend to information from different representation subspaces simultaneously.',
          how: 'Concatenates h heads and multiplies by projection weight matrix W_O with post-LayerNorm.',
          inputs: 'Outputs from h parallel attention heads',
          outputs: 'Normalized token context vectors ready for Feed-Forward Network',
          interview_questions: ['What is the difference between Pre-LN and Post-LN architectures in stabilizing very deep Transformer training?']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">TRANSFORMER SELF-ATTENTION TENSOR PIPELINE</text>
        <rect x="60" y="240" width="100" height="40" rx="4" fill="#0284c7"/>
        <text x="80" y="265" fill="#fff" font-size="13" font-weight="bold">Query (Q)</text>
        <rect x="200" y="240" width="100" height="40" rx="4" fill="#0284c7"/>
        <text x="225" y="265" fill="#fff" font-size="13" font-weight="bold">Key (K)</text>
        <rect x="340" y="240" width="100" height="40" rx="4" fill="#0284c7"/>
        <text x="360" y="265" fill="#fff" font-size="13" font-weight="bold">Value (V)</text>
        <rect x="100" y="160" width="200" height="45" rx="6" fill="#e11d48"/>
        <text x="120" y="188" fill="#fff" font-size="13" font-weight="bold">MatMul & Scale (1 / √d_k)</text>
        <rect x="100" y="90" width="200" height="45" rx="6" fill="#10b981"/>
        <text x="145" y="118" fill="#fff" font-size="13" font-weight="bold">Softmax Weights</text>
      </svg>`,
      quiz: [
        {
          question: 'What is the primary motivation for dividing the dot product Q·K^T by the square root of the key dimension (√d_k)?',
          options: ['To prevent dot products from growing large and pushing the Softmax function into regions with extremely small gradients', 'To reduce memory consumption', 'To make the matrix symmetric', 'To enforce causal masking'],
          correct_option: 0,
          explanation: 'For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients, leading to vanishing gradient issues during backpropagation.'
        }
      ]
    },

    // ── 7. BIOMEDICAL ENGINEERING (BIOMED) ────────────────────────────────
    {
      id: 'mod_biomed_ecg',
      branch_id: 'biomed',
      semester_id: 'sem_4',
      subject_id: 'sub_bmd_401',
      subject_code: 'BM401',
      topic: 'Biomedical Instrumentation & Biosensors',
      specialization: 'Medical Devices & Diagnostics',
      model_type: 'biomed',
      name: '12-Lead Diagnostic ECG Front-End & Instrumentation Amplifier',
      title: '12-Lead Diagnostic ECG Front-End & Instrumentation Amplifier',
      description: '3D model of an ultra-low-noise medical ECG acquisition unit with Wilson Central Terminal, isolated differential instrumentation amplifier, 50/60Hz notch filter, and defibrillator protection circuit.',
      learning_objective: 'Understand biopotential electrode-skin interface impedance, Common-Mode Rejection Ratio (CMRR > 110 dB), and baseline wander suppression.',
      difficulty: 'Intermediate',
      career_relevance: 'Biomedical Device Engineer, Clinical Systems Specialist at Medtronic, Philips Healthcare, GE Healthcare.',
      real_world_applications: ['Hospital cardiac ICU patient monitors', 'Wearable arrhythmia detection Holter monitors'],
      signal_flow: 'Myocardial Action Potential Dipole → Ag/AgCl Gel Electrodes → High-Voltage Defibrillation Clamping Diodes → High-CMRR Differential In-Amp → 24-bit Delta-Sigma ADC.',
      components: [
        {
          name: 'Differential Instrumentation Amplifier (In-Amp)',
          what: 'Three-op-amp instrumentation topology with precision laser-trimmed feedback resistors.',
          why: 'Extracts sub-millivolt (0.5 mV - 4 mV) cardiac signals while rejecting tens of volts of 50/60Hz common-mode mains noise.',
          how: 'Provides CMRR > 120 dB and gigaohm input impedance to avoid loading skin.',
          inputs: 'RA, LA, LL, V1-V6 biopotential lead wires',
          outputs: 'Clean amplified cardiac voltage waveform',
          interview_questions: ['Why is the Right Leg Drive (RLD) circuit used in clinical ECG monitors instead of simply grounding the patient?']
        },
        {
          name: 'Wilson Central Terminal (WCT) Reference',
          what: 'Resistive averaging network connecting RA, LA, and LL patient leads.',
          why: 'Creates a stable synthetic virtual ground reference point representing the center of the heart vector.',
          how: 'Three equal 50 kΩ precision resistors joined at a central node.',
          inputs: 'Limb lead potential potentials (RA, LA, LL)',
          outputs: 'Reference potential for unipolar precordial leads (V1 - V6)',
          interview_questions: ['Explain Einthoven’s Triangle Law and how Lead II is mathematically related to Lead I and Lead III.']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">12-LEAD CLINICAL ECG INSTRUMENTATION SCHEMATIC</text>
        <rect x="50" y="100" width="120" height="180" rx="6" fill="#1e293b" stroke="#0ea5e9" stroke-width="2"/>
        <text x="65" y="130" fill="#fff" font-size="13" font-weight="bold">Lead Inputs</text>
        <text x="65" y="160" fill="#94a3b8" font-size="12">RA, LA, LL</text>
        <text x="65" y="190" fill="#94a3b8" font-size="12">V1 - V6 Leads</text>
        <rect x="230" y="120" width="160" height="140" rx="6" fill="#1e293b" stroke="#e11d48" stroke-width="2"/>
        <text x="250" y="150" fill="#fff" font-size="13" font-weight="bold">Instrumentation</text>
        <text x="260" y="175" fill="#f43f5e" font-size="13" font-weight="bold">Amplifier</text>
        <text x="255" y="210" fill="#34d399" font-size="12">CMRR > 120 dB</text>
        <rect x="440" y="140" width="100" height="100" rx="6" fill="#065f46" stroke="#10b981" stroke-width="2"/>
        <text x="460" y="180" fill="#fff" font-size="13" font-weight="bold">24-Bit ADC</text>
        <text x="450" y="210" fill="#a7f3d0" font-size="11">DSP Filter</text>
      </svg>`,
      quiz: [
        {
          question: 'What is the primary role of the Right Leg Drive (RLD) circuit in clinical electrocardiography?',
          options: ['Actively cancels 50/60 Hz common-mode mains interference on the patient’s body', 'Injects pacing pulses into the myocardium', 'Measures skin temperature', 'Powers the wireless telemetry radio'],
          correct_option: 0,
          explanation: 'The Right Leg Drive senses the common-mode voltage on the patient, inverts it through an operational amplifier, and feeds it back to the right leg to actively cancel interference.'
        }
      ]
    },

    // ── 8. AEROSPACE ENGINEERING (AERO) ───────────────────────────────────
    {
      id: 'mod_aero_turbofan',
      branch_id: 'aero',
      semester_id: 'sem_5',
      subject_id: 'sub_aero_501',
      subject_code: 'AE501',
      topic: 'Aircraft Propulsion & Gas Turbine Engines',
      specialization: 'Propulsion & Aerodynamics',
      model_type: 'aero',
      name: 'High-Bypass Commercial Turbofan Jet Engine (Bypass Ratio 10:1)',
      title: 'High-Bypass Commercial Turbofan Jet Engine (Bypass Ratio 10:1)',
      description: 'Interactive cutaway model of a dual-spool high-bypass turbofan jet engine showing the wide-chord titanium fan, low/high-pressure axial compressors, annular combustor, and turbine stages.',
      learning_objective: 'Understand the Brayton cycle, bypass ratio thrust efficiency, thermal and propulsive efficiency trade-offs, and compressor stall/surge aerodynamics.',
      difficulty: 'Advanced',
      career_relevance: 'Propulsion Engineer, Gas Turbine Aerodynamicist at Rolls-Royce, GE Aerospace, Pratt & Whitney, ISRO.',
      real_world_applications: ['Modern commercial airliners (A350, Boeing 787)', 'Military supersonic propulsion systems'],
      signal_flow: 'Air Ingested by Front Fan → 90% Bypasses Core Generating Cold Propulsive Thrust → 10% Compressed via HP Compressor → Fuel Injected & Burned in Annular Combustor → Expands Through Turbines Driving Fan & Compressor.',
      components: [
        {
          name: 'Wide-Chord Titanium Fan Blisk',
          what: 'Solid or hollow titanium alloy forward rotor blades with aerodynamic twist.',
          why: 'Accelerates massive mass flow of ambient air around the core to generate ~80% of total takeoff thrust.',
          how: 'Diffusion bonded and superplastically formed (SPF/DB) titanium.',
          inputs: 'Rotational kinetic power from Low-Pressure Turbine shaft',
          outputs: 'High-mass-flow bypass thrust (Kilonewtons)',
          interview_questions: ['Why does high bypass ratio yield superior specific fuel consumption (SFC) at subsonic cruise speeds?']
        },
        {
          name: 'High-Pressure Turbine & Thermal Barrier Coating',
          what: 'Single-crystal nickel superalloy turbine blades directly exposed to 1,600°C combustion gases.',
          why: 'Extracts energy from expanding hot gases to drive the upstream HP compressor spool.',
          how: 'Single-crystal casting eliminates grain boundaries; internal serpentine cooling air holes bleed compressor air.',
          inputs: 'High-pressure 1,600°C gas from combustion chamber',
          outputs: 'Shaft mechanical power driving HP compressor',
          interview_questions: ['Explain why single-crystal turbine blades resist creep failure significantly better than conventionally cast equiaxed blades.']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">HIGH-BYPASS DUAL-SPOOL TURBOFAN ENGINE SCHEMATIC</text>
        <path d="M 60 100 L 120 180 L 60 260 Z" fill="#e11d48"/>
        <text x="75" y="185" fill="#fff" font-size="12" font-weight="bold">Fan</text>
        <rect x="140" y="140" width="100" height="80" fill="#0284c7" rx="4"/>
        <text x="150" y="185" fill="#fff" font-size="11" font-weight="bold">HP Compressor</text>
        <rect x="260" y="145" width="80" height="70" fill="#f59e0b" rx="4"/>
        <text x="270" y="185" fill="#fff" font-size="11" font-weight="bold">Combustor</text>
        <rect x="360" y="140" width="90" height="80" fill="#dc2626" rx="4"/>
        <text x="375" y="185" fill="#fff" font-size="11" font-weight="bold">HP Turbine</text>
        <path d="M 40 80 Q 300 60 540 80 L 540 120 Q 300 110 40 120 Z" fill="#38bdf8" opacity="0.3"/>
        <text x="230" y="100" fill="#38bdf8" font-size="12" font-weight="bold">Cold Bypass Air (80% Thrust)</text>
      </svg>`,
      quiz: [
        {
          question: 'What thermodynamic cycle forms the theoretical foundation for all gas turbine aircraft propulsion engines?',
          options: ['Brayton Cycle', 'Rankine Cycle', 'Carnot Cycle', 'Stirling Cycle'],
          correct_option: 0,
          explanation: 'The Brayton cycle (comprising isentropic compression, isobaric heat addition, isentropic expansion, and isobaric heat rejection) models gas turbine and jet engine operation.'
        }
      ]
    },

    // ── 9. ROBOTICS & AUTOMATION (ROBOTICS) ───────────────────────────────
    {
      id: 'mod_robot_arm',
      branch_id: 'robotics',
      semester_id: 'sem_4',
      subject_id: 'sub_rob_401',
      subject_code: 'RO401',
      topic: 'Kinematics & Industrial Robotics Control',
      specialization: 'Robotic Manipulation & Autonomous Systems',
      model_type: 'robot',
      name: '6-DOF Articulated Industrial Robotic Arm & End-Effector',
      title: '6-DOF Articulated Industrial Robotic Arm & End-Effector',
      description: 'Interactive kinematic model of a 6-axis industrial manipulator showing revolute joints, harmonic drive reduction gearboxes, optical absolute encoders, and pneumatic parallel end-effector.',
      learning_objective: 'Understand forward kinematics using Denavit-Hartenberg (D-H) convention, inverse kinematics singularities, Jacobian velocity mapping, and trajectory planning.',
      difficulty: 'Intermediate',
      career_relevance: 'Robotics Software Engineer, Automation Specialist at ABB Robotics, KUKA, FANUC, Boston Dynamics.',
      real_world_applications: ['Automotive high-precision spot welding', 'Semiconductor wafer fab pick-and-place robots'],
      signal_flow: 'Cartesian Trajectory Goal Input → Inverse Kinematics Calculates 6 Joint Angles (θ1 - θ6) → Joint Trajectory Generator Computes Velocity Profiles → Servo Drives Energize Motors.',
      components: [
        {
          name: 'Shoulder & Elbow Harmonic Drive Joints',
          what: 'Zero-backlash strain wave gearing integrated with brushless frameless torque motor.',
          why: 'Provides high reduction ratios (up to 160:1) with zero backlash for sub-millimeter positional repeatability.',
          how: 'Flexspline, wave generator, and circular spline interaction.',
          inputs: 'High-speed motor rotation',
          outputs: 'Zero-backlash high-torque joint rotation',
          interview_questions: ['What causes kinematic singularities in a 6-axis serial robot arm, and how does the Jacobian matrix identify them?']
        },
        {
          name: 'Pneumatic Parallel Motion Gripper',
          what: 'Double-acting pneumatic cylinder with rack-and-pinion synchronized gripper jaws.',
          why: 'Applies controlled gripping force to reliably grasp industrial payloads.',
          how: 'Pressurized air (6 bar) drives dual pistons with magnetic reed position sensors.',
          inputs: 'Solenoid valve pilot signals',
          outputs: 'Clamping gripping force (Newtons)',
          interview_questions: ['Explain the difference between impedance control and admittance control in robotic manipulation when interacting with rigid contact surfaces.']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">6-DOF ARTICULATED MANIPULATOR D-H KINEMATIC CHAIN</text>
        <rect x="80" y="270" width="100" height="40" rx="4" fill="#334155"/>
        <text x="95" y="295" fill="#fff" font-size="12" font-weight="bold">Base (J1)</text>
        <line x1="130" y1="270" x2="180" y2="180" stroke="#f59e0b" stroke-width="12" stroke-linecap="round"/>
        <circle cx="180" cy="180" r="14" fill="#e11d48"/>
        <text x="135" y="165" fill="#fca5a5" font-size="11" font-weight="bold">Shoulder (J2)</text>
        <line x1="180" y1="180" x2="300" y2="120" stroke="#0284c7" stroke-width="10" stroke-linecap="round"/>
        <circle cx="300" cy="120" r="12" fill="#e11d48"/>
        <text x="310" y="115" fill="#fca5a5" font-size="11" font-weight="bold">Elbow (J3)</text>
        <line x1="300" y1="120" x2="420" y2="150" stroke="#10b981" stroke-width="8" stroke-linecap="round"/>
        <circle cx="420" cy="150" r="10" fill="#e11d48"/>
        <text x="435" y="145" fill="#fca5a5" font-size="11" font-weight="bold">Wrist (J4-J6)</text>
        <rect x="430" y="160" width="30" height="20" fill="#94a3b8" rx="2"/>
      </svg>`,
      quiz: [
        {
          question: 'In robotics kinematics, what mathematical condition indicates that a serial manipulator has entered a kinematic singularity?',
          options: ['The determinant of the Jacobian matrix equals zero (det(J) = 0)', 'The motor torque reaches zero', 'The robot speed exceeds the speed of light', 'The joint angles are all 90 degrees'],
          correct_option: 0,
          explanation: 'A kinematic singularity occurs when the determinant of the Jacobian matrix is zero, meaning the robot loses one or more degrees of freedom and cannot produce Cartesian velocity in that direction.'
        }
      ]
    },

    // ── 10. AUTOMOBILE ENGINEERING (AUTOMOBILE) ───────────────────────────
    {
      id: 'mod_auto_powertrain',
      branch_id: 'automobile',
      semester_id: 'sem_5',
      subject_id: 'sub_aut_501',
      subject_code: 'AU501',
      topic: 'Electric Vehicle Powertrain Architecture',
      specialization: 'EV Systems & Vehicle Dynamics',
      model_type: 'ev',
      name: '800V EV Powertrain & Liquid-Cooled Battery Pack',
      title: '800V EV Powertrain & Liquid-Cooled Battery Pack',
      description: '3D structural model of an 800-volt high-voltage electric vehicle skateboard chassis showing lithium-ion prismatic battery modules, bidirectional Silicon Carbide (SiC) inverter, and regenerative brake integration.',
      learning_objective: 'Understand battery state-of-charge (SOC) estimation, thermal runaway prevention, SiC inverter efficiency, and regenerative braking power curves.',
      difficulty: 'Advanced',
      career_relevance: 'EV Powertrain Engineer, Battery Management System (BMS) Specialist at Tesla, Porsche, Rivian, Lucid.',
      real_world_applications: ['Next-generation 800V fast-charging passenger EVs', 'Heavy commercial electric haul trucks'],
      signal_flow: 'Throttle Pedal Input → BMS Authorizes Current → 800V DC Bus Delivers Power to SiC Inverter → High-Frequency PWM Synthesizes AC → Motor Generates Instantaneous Wheel Torque.',
      components: [
        {
          name: 'Liquid-Cooled Battery Pack (100 kWh)',
          what: 'Structural aluminum battery tray containing prismatic Li-ion cells with bottom cooling ribbon plates.',
          why: 'Provides high volumetric energy density while keeping cell temperatures within optimum 25°C - 35°C range.',
          how: 'Ethylene glycol coolant circulation connected to refrigeration chiller loop.',
          inputs: 'DC charging current, ambient temperature',
          outputs: '800V DC bus voltage at up to 500A peak discharge',
          interview_questions: ['Why does an 800V EV architecture allow faster DC fast-charging (up to 350 kW) with reduced cable copper weight compared to 400V systems?']
        },
        {
          name: 'Silicon Carbide (SiC) Traction Inverter',
          what: 'Bidirectional three-phase power inverter utilizing wide-bandgap SiC MOSFET switches.',
          why: 'Operates at up to 99% conversion efficiency and higher switching frequencies, cutting inverter losses by 50%.',
          how: 'Direct liquid-cooled pin-fin heat sink with low-inductance bus-bars.',
          inputs: '800V DC high-voltage supply, motor torque command',
          outputs: 'Sinusoidal 3-phase AC voltage up to 400 kW power',
          interview_questions: ['Explain the physical advantages of Silicon Carbide (SiC) over standard Silicon IGBTs in electric vehicle power electronics.']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">800V HIGH-VOLTAGE EV POWERTRAIN BLUEPRINT</text>
        <rect x="80" y="100" width="220" height="180" rx="8" fill="#1e293b" stroke="#0ea5e9" stroke-width="2"/>
        <text x="100" y="135" fill="#38bdf8" font-size="14" font-weight="bold">800V Battery Pack</text>
        <text x="100" y="160" fill="#94a3b8" font-size="12">100 kWh Prismatic Cells</text>
        <text x="100" y="185" fill="#34d399" font-size="12">Liquid Cooling Ribbon</text>
        <rect x="360" y="110" width="160" height="80" rx="6" fill="#1e293b" stroke="#e11d48" stroke-width="2"/>
        <text x="380" y="145" fill="#f43f5e" font-size="13" font-weight="bold">SiC Inverter</text>
        <text x="380" y="170" fill="#94a3b8" font-size="11">99% Peak Efficiency</text>
        <circle cx="440" cy="250" r="35" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
        <text x="415" y="255" fill="#fff" font-size="12" font-weight="bold">Drive Motor</text>
      </svg>`,
      quiz: [
        {
          question: 'What is the primary physical benefit of doubling electric vehicle system voltage from 400V to 800V for the same power level?',
          options: ['Current is cut in half, reducing I²R heat losses in cabling by a factor of 4', 'Batteries no longer require cooling', 'AC motors can be eliminated', 'Tire wear is reduced'],
          correct_option: 0,
          explanation: 'Power = Voltage × Current. Doubling the voltage halves the current needed to deliver the same power. Since thermal resistive losses scale with I²R, halving current cuts copper resistive losses by 75%.'
        }
      ]
    },

    // ── 11. CHEMICAL ENGINEERING (CHEMICAL) ───────────────────────────────
    {
      id: 'mod_chem_distillation',
      branch_id: 'chemical',
      semester_id: 'sem_4',
      subject_id: 'sub_chm_401',
      subject_code: 'CH401',
      topic: 'Mass Transfer & Separation Processes',
      specialization: 'Process Engineering & Refining',
      model_type: 'distillation',
      name: 'Continuous Fractionation Distillation Column & Sieve Trays',
      title: 'Continuous Fractionation Distillation Column & Sieve Trays',
      description: '3D model of a continuous binary distillation tower showing sieve trays, downcomers, reboiler vapor return, reflux distributor, and vapor-liquid equilibrium (VLE) mass transfer stages.',
      learning_objective: 'Master the McCabe-Thiele graphical method for minimum theoretical stages, calculate reflux ratio, and analyze flooding and weeping tray hydraulics.',
      difficulty: 'Intermediate',
      career_relevance: 'Process Design Engineer, Chemical Plant Lead at ExxonMobil, Shell, Reliance, Dow Chemical.',
      real_world_applications: ['Petroleum crude oil refining', 'Bio-ethanol fuel distillation and air separation units'],
      signal_flow: 'Continuous Feed Enters at Optimum Feed Stage → Vapor Rises Through Perforated Sieve Trays → Liquid Descends via Downcomers → Condenser Splits Overhead Vapor into Distillate & Reflux.',
      components: [
        {
          name: 'Perforated Sieve Trays & Downcomers',
          what: 'Horizontal stainless-steel plates with circular perforations and vertical liquid overflow downcomers.',
          why: 'Provides intimate contact area between upward vapor and downward liquid for mass transfer equilibrium.',
          how: 'Vapor bubbles through liquid pool on tray; liquid overflows weir down to next lower stage.',
          inputs: 'Upward vapor, downward reflux liquid',
          outputs: 'Enriched vapor (more volatile component) and stripped liquid',
          interview_questions: ['Explain the causes and operational consequences of "weeping" and "flooding" inside a sieve-tray distillation column.']
        },
        {
          name: 'Thermosyphon Reboiler & Overhead Reflux Drum',
          what: 'Heat exchanger at column base and reflux splitter at column top.',
          why: 'Provides thermal vapor drive at base and high-purity liquid return at top to enforce separation gradient.',
          how: 'Steam heating tubes vaporize bottom mixture generating continuous boil-up.',
          inputs: 'Bottom liquid effluent, condensing steam',
          outputs: 'Stripped bottoms product and vapor boilup return',
          interview_questions: ['How does increasing the reflux ratio (R) affect the number of theoretical stages required and operating utility costs?']
        }
      ],
      svg_diagram: `<svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; font-family:system-ui,sans-serif; width:100%; border-radius:8px;">
        <rect x="20" y="20" width="560" height="320" rx="10" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <text x="40" y="55" fill="#38bdf8" font-size="16" font-weight="bold">CONTINUOUS BINARY FRACTIONATION COLUMN SCHEMATIC</text>
        <rect x="240" y="80" width="120" height="200" rx="10" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
        <line x1="250" y1="120" x2="350" y2="120" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3"/>
        <line x1="250" y1="160" x2="350" y2="160" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3"/>
        <line x1="250" y1="200" x2="350" y2="200" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3"/>
        <line x1="250" y1="240" x2="350" y2="240" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3"/>
        <text x="260" y="155" fill="#fff" font-size="11" font-weight="bold">Sieve Trays</text>
        <path d="M 160 180 L 240 180" stroke="#10b981" stroke-width="3"/>
        <text x="170" y="170" fill="#34d399" font-size="12" font-weight="bold">Feed Stage</text>
        <path d="M 300 80 L 300 60 L 450 60 L 450 90" stroke="#0ea5e9" stroke-width="2" fill="none"/>
        <text x="350" y="55" fill="#38bdf8" font-size="11">Overhead Vapor to Condenser</text>
      </svg>`,
      quiz: [
        {
          question: 'According to the McCabe-Thiele method, what occurs to the operating lines when a distillation column operates at "Total Reflux" (R = ∞)?',
          options: ['The operating lines coincide with the 45° diagonal line (y = x), requiring the minimum number of stages', 'The column floods immediately', 'The distillate purity drops to zero', 'No boil-up is required'],
          correct_option: 0,
          explanation: 'At total reflux, no product is withdrawn. The operating lines become y = x (the 45-degree diagonal), which results in the minimum number of theoretical stages required for that separation.'
        }
      ]
    }
  ],

  // ── ENRICHED TECHPATH CLASSES DATA ─────────────────────────────────────────
  // Adds official YouTube video metadata, 3D model links, materials, and quizzes
  enriched_classes: [
    {
      id: 'cls_cse_01',
      model_3d_id: 'mod_cse_cpu',
      youtube_videos: [
        {
          id: 'yt_cse_01',
          video_id: '8hly31xKli0',
          url: 'https://www.youtube.com/watch?v=8hly31xKli0',
          embed_url: 'https://www.youtube.com/embed/8hly31xKli0',
          title: 'Algorithms and Data Structures Tutorial - Full Course',
          description: 'Comprehensive video lecture on algorithmic complexity, pointer manipulation, and dynamic self-balancing trees.',
          duration: '5hr 20min',
          captions: 'Available (EN, HI)',
          language: 'English',
          branch_id: 'cse',
          specialization: 'Core Algorithms & Systems',
          semester_id: 'sem_3',
          subject: 'Data Structures & Algorithms',
          topic: 'Self-Balancing Trees & Big-O',
          difficulty: 'Intermediate',
          thumbnail_url: 'https://img.youtube.com/vi/8hly31xKli0/hqdefault.jpg'
        },
        {
          id: 'yt_cse_02',
          video_id: 'v4cd1O4zkGw',
          url: 'https://www.youtube.com/watch?v=v4cd1O4zkGw',
          embed_url: 'https://www.youtube.com/embed/v4cd1O4zkGw',
          title: 'AVL Tree - Insertion and Rotations with Animations',
          description: 'Step-by-step visual animation demonstrating Left-Left, Right-Right, Left-Right, and Right-Left AVL rotations.',
          duration: '22min',
          captions: 'Available (EN)',
          language: 'English',
          branch_id: 'cse',
          specialization: 'Core Algorithms & Systems',
          semester_id: 'sem_3',
          subject: 'Data Structures & Algorithms',
          topic: 'AVL Rotations & Balance Factors',
          difficulty: 'Intermediate',
          thumbnail_url: 'https://img.youtube.com/vi/v4cd1O4zkGw/hqdefault.jpg'
        }
      ],
      materials: [
        { title: 'AVL Trees & Red-Black Invariant Proofs (PDF)', type: 'Lecture Notes', size: '2.4 MB', author: 'Ananya Sharma' },
        { title: 'Clean C++20 Header-Only AVL Implementation (.hpp)', type: 'Source Code', size: '14 KB', author: 'Ananya Sharma' }
      ],
      practice_questions: [
        { question: 'Calculate the maximum number of nodes in an AVL tree of height 5.', answer: 'Max nodes = 2^(h+1) - 1 = 2^6 - 1 = 63 nodes.' },
        { question: 'What rotation is performed when an insertion occurs in the right subtree of the left child?', answer: 'Left-Right (LR) double rotation.' }
      ]
    },
    {
      id: 'cls_ece_01',
      model_3d_id: 'mod_ece_finfet',
      youtube_videos: [
        {
          id: 'yt_ece_01',
          video_id: '6zE5TzW6z6c',
          url: 'https://www.youtube.com/watch?v=6zE5TzW6z6c',
          embed_url: 'https://www.youtube.com/embed/6zE5TzW6z6c',
          title: 'Embedded Systems & Bare-Metal Firmware Architecture',
          description: 'Deep dive into ARM Cortex-M architecture, register memory mapping, and writing custom peripheral drivers from scratch.',
          duration: '1hr 45min',
          captions: 'Available (EN)',
          language: 'English',
          branch_id: 'ece',
          specialization: 'Embedded Systems & Firmware',
          semester_id: 'sem_4',
          subject: 'Microcontrollers & Embedded Systems',
          topic: 'Bare-Metal STM32 Register Programming',
          difficulty: 'Intermediate',
          thumbnail_url: 'https://img.youtube.com/vi/6zE5TzW6z6c/hqdefault.jpg'
        }
      ],
      materials: [
        { title: 'STM32F401RE Register Map Cheat Sheet', type: 'Hardware Reference', size: '1.8 MB', author: 'Rahul Varma' },
        { title: 'Bare-Metal GPIO & UART Driver Code (C99)', type: 'Source Code', size: '28 KB', author: 'Rahul Varma' }
      ],
      practice_questions: [
        { question: 'Why must you enable the peripheral clock in the RCC register before writing to a GPIO control register?', answer: 'Without the RCC peripheral clock enabled, the bus clock to that peripheral logic is gated off to save power, so register writes will have no effect.' }
      ]
    },
    {
      id: 'cls_mech_01',
      model_3d_id: 'mod_mech_gearbox',
      youtube_videos: [
        {
          id: 'yt_mech_01',
          video_id: 'aircAruvnKk',
          url: 'https://www.youtube.com/watch?v=aircAruvnKk',
          embed_url: 'https://www.youtube.com/embed/aircAruvnKk',
          title: 'Finite Element Analysis (FEA) Foundations & Simulation',
          description: 'Mathematical derivation of stiffness matrices, shape functions, and element stress recovery in structural simulation.',
          duration: '1hr 15min',
          captions: 'Available (EN)',
          language: 'English',
          branch_id: 'mech',
          specialization: 'Computational Mechanics',
          semester_id: 'sem_5',
          subject: 'Solid Mechanics & Simulation',
          topic: 'FEA Mesh Convergence & Stress',
          difficulty: 'Intermediate',
          thumbnail_url: 'https://img.youtube.com/vi/aircAruvnKk/hqdefault.jpg'
        }
      ],
      materials: [
        { title: 'ANSYS FEA Mesh Convergence Methodology Guide', type: 'Lab Manual', size: '3.1 MB', author: 'Aditya Kulkarni' }
      ],
      practice_questions: [
        { question: 'What is the physical significance of the von Mises yield criterion?', answer: 'It states that yielding begins when the second deviatoric stress invariant J2 reaches a critical value corresponding to distortion energy density.' }
      ]
    },
    {
      id: 'cls_aiml_01',
      model_3d_id: 'mod_aiml_attention',
      youtube_videos: [
        {
          id: 'yt_aiml_01',
          video_id: 'kCc8FmEb1nY',
          url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
          embed_url: 'https://www.youtube.com/embed/kCc8FmEb1nY',
          title: 'Let’s build GPT: from scratch, in code, spelled out',
          description: 'World-renowned step-by-step engineering masterclass building a Transformer language model in PyTorch from the ground up.',
          duration: '1hr 56min',
          captions: 'Available (EN)',
          language: 'English',
          branch_id: 'aiml',
          specialization: 'Deep Learning & Natural Language Processing',
          semester_id: 'sem_5',
          subject: 'Deep Learning',
          topic: 'Transformers & Self-Attention',
          difficulty: 'Advanced',
          thumbnail_url: 'https://img.youtube.com/vi/kCc8FmEb1nY/hqdefault.jpg'
        }
      ],
      materials: [
        { title: 'Self-Attention Tensor Shapes & PyTorch Implementation Notes', type: 'Technical Paper', size: '1.2 MB', author: 'Sneha Patel' }
      ],
      practice_questions: [
        { question: 'In autoregressive generation, what mask value is used before softmax to prevent attending to future tokens?', answer: '-Infinity (or -1e9), causing softmax output for future positions to evaluate to 0.' }
      ]
    },
    {
      id: 'cls_civil_01',
      model_3d_id: 'mod_civil_bridge',
      youtube_videos: [
        {
          id: 'yt_civil_01',
          video_id: 'p7_yU4GqMsk',
          url: 'https://www.youtube.com/watch?v=p7_yU4GqMsk',
          embed_url: 'https://www.youtube.com/embed/p7_yU4GqMsk',
          title: 'Reinforced Concrete Design - Singly & Doubly Reinforced Beams',
          description: 'Limit state design according to standard codes, neutral axis computation, and shear stirrup detailing.',
          duration: '52min',
          captions: 'Available (EN)',
          language: 'English',
          branch_id: 'civil',
          specialization: 'Structural Engineering',
          semester_id: 'sem_5',
          subject: 'Structural Analysis & Design',
          topic: 'Limit State RCC Design',
          difficulty: 'Intermediate',
          thumbnail_url: 'https://img.youtube.com/vi/p7_yU4GqMsk/hqdefault.jpg'
        }
      ],
      materials: [
        { title: 'IS 456 Structural Reinforcement Calculation Tables', type: 'Code Reference', size: '2.0 MB', author: 'Rohan Deshmukh' }
      ],
      practice_questions: [
        { question: 'What is the limiting depth of neutral axis (x_u,max / d) for Fe 415 grade steel?', answer: '0.48 d' }
      ]
    }
  ]
};
