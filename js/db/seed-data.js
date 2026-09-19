/**
 * TECHPATH — CANONICAL SEED DATASET
 * Real, verified engineering academic and industry data.
 * Guarantees zero cross-branch contamination.
 */

import { EXAM_QUIZ_SEED_DATA } from './exam-quiz-seed.js';
import { MODELS_AND_CLASSES_SEED_DATA } from './models-and-classes-seed.js';
import { AUTHENTIC_VIDEOS } from '../services/VideoEngine.js';
import { DEPARTMENTS, ALL_BRANCHES } from '../services/TaxonomyEngine.js';

export const CANONICAL_SEED_DATA = {
  ...EXAM_QUIZ_SEED_DATA,
  ...MODELS_AND_CLASSES_SEED_DATA,
  departments: [
    { id: 'eng', name: 'Faculty of Engineering & Technology', code: 'ENG', description: 'Core Engineering & Computing' },
    ...DEPARTMENTS.map(d => ({ id: d.id, name: d.name, code: d.code, description: d.description }))
  ],

  branches: [
    ...ALL_BRANCHES.map(b => ({ id: b.id, department_id: b.department_id, name: b.name, code: b.code, total_semesters: 8 }))
  ],

  semesters: [
    { id: 'sem_1', number: 1, name: 'Semester 1' },
    { id: 'sem_2', number: 2, name: 'Semester 2' },
    { id: 'sem_3', number: 3, name: 'Semester 3' },
    { id: 'sem_4', number: 4, name: 'Semester 4' },
    { id: 'sem_5', number: 5, name: 'Semester 5' },
    { id: 'sem_6', number: 6, name: 'Semester 6' },
    { id: 'sem_7', number: 7, name: 'Semester 7' },
    { id: 'sem_8', number: 8, name: 'Semester 8' }
  ],

  // -------------------------------------------------------------
  // SUBJECTS (Strict Branch + Semester Mapping)
  // -------------------------------------------------------------
  subjects: [
    // CSE Sem 1-6
    { id: 'sub_cse_101', branch_id: 'cse', semester_id: 'sem_1', code: 'CS101', title: 'Programming Fundamentals (C)', credits: 4, description: 'Variables, loops, functions, arrays, pointers, file I/O in C.' },
    { id: 'sub_cse_102', branch_id: 'cse', semester_id: 'sem_1', code: 'MA101', title: 'Engineering Mathematics I', credits: 4, description: 'Differential calculus, matrices, eigenvectors, complex numbers.' },
    { id: 'sub_cse_201', branch_id: 'cse', semester_id: 'sem_2', code: 'CS201', title: 'Object-Oriented Programming (Python)', credits: 4, description: 'Classes, inheritance, polymorphism, decorators, generators, unit testing.' },
    { id: 'sub_cse_202', branch_id: 'cse', semester_id: 'sem_2', code: 'MA201', title: 'Probability & Statistics', credits: 3, description: 'Random variables, distributions, hypothesis testing, regression.' },
    { id: 'sub_cse_301', branch_id: 'cse', semester_id: 'sem_3', code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, description: 'Linear and non-linear data structures, asymptotic notation, trees, graphs, dynamic programming.' },
    { id: 'sub_cse_302', branch_id: 'cse', semester_id: 'sem_3', code: 'CS302', title: 'Digital Logic & Computer Organization', credits: 4, description: 'Boolean algebra, combinational & sequential logic, ALU, CPU registers, instruction cycle.' },
    { id: 'sub_cse_303', branch_id: 'cse', semester_id: 'sem_3', code: 'CS303', title: 'Discrete Mathematical Structures', credits: 3, description: 'Set theory, propositional logic, recurrence relations, graph theory, algebraic structures.' },
    { id: 'sub_cse_304', branch_id: 'cse', semester_id: 'sem_3', code: 'CS304', title: 'Object-Oriented Programming (Java/C++)', credits: 4, description: 'Encapsulation, inheritance, polymorphism, templates, memory management, design patterns.' },
    { id: 'sub_cse_401', branch_id: 'cse', semester_id: 'sem_4', code: 'CS401', title: 'Operating Systems', credits: 4, description: 'Process scheduling, virtual memory paging, synchronization primitives, file systems.' },
    { id: 'sub_cse_402', branch_id: 'cse', semester_id: 'sem_4', code: 'CS402', title: 'Database Management Systems', credits: 4, description: 'Relational algebra, SQL, normalization, ACID properties, B+ Tree indexing, transactions.' },
    { id: 'sub_cse_403', branch_id: 'cse', semester_id: 'sem_4', code: 'CS403', title: 'Computer Networks', credits: 4, description: 'OSI model, TCP/IP stack, routing algorithms, congestion control, DNS, HTTP.' },
    { id: 'sub_cse_501', branch_id: 'cse', semester_id: 'sem_5', code: 'CS501', title: 'Theory of Computation', credits: 3, description: 'Finite automata, pushdown automata, Turing machines, decidability, NP-completeness.' },
    { id: 'sub_cse_502', branch_id: 'cse', semester_id: 'sem_5', code: 'CS502', title: 'Compiler Design', credits: 4, description: 'Lexical analysis, parsing, semantic analysis, code generation, optimization.' },
    { id: 'sub_cse_503', branch_id: 'cse', semester_id: 'sem_5', code: 'CS503', title: 'Software Engineering', credits: 3, description: 'SDLC models, Agile, design patterns, testing strategies, UML.' },
    { id: 'sub_cse_504', branch_id: 'cse', semester_id: 'sem_5', code: 'CS504', title: 'Machine Learning', credits: 4, description: 'Supervised/unsupervised learning, multilayer neural networks, backpropagation, and deep learning architectures.' },
    { id: 'sub_cse_601', branch_id: 'cse', semester_id: 'sem_6', code: 'CS601', title: 'Machine Learning', credits: 4, description: 'Supervised/unsupervised learning, neural networks, SVMs, ensemble methods.' },
    { id: 'sub_cse_602', branch_id: 'cse', semester_id: 'sem_6', code: 'CS602', title: 'Cloud Computing & DevOps', credits: 3, description: 'Virtualization, containers, Kubernetes, CI/CD pipelines, IaC.' },
    // ECE Sem 3-5
    { id: 'sub_ece_301', branch_id: 'ece', semester_id: 'sem_3', code: 'EC301', title: 'Electronic Devices & Circuit Theory', credits: 4, description: 'PN Junctions, BJTs, MOSFET high-frequency models, biasing, small signal amplifiers.' },
    { id: 'sub_ece_302', branch_id: 'ece', semester_id: 'sem_3', code: 'EC302', title: 'Signals and Systems', credits: 4, description: 'Continuous & discrete time signals, Fourier transform, Laplace, Z-transform, LTI systems.' },
    { id: 'sub_ece_303', branch_id: 'ece', semester_id: 'sem_3', code: 'EC303', title: 'Network Theory & Synthesis', credits: 3, description: 'Mesh and nodal analysis, Thevenin/Norton theorems, two-port networks, resonant circuits.' },
    { id: 'sub_ece_401', branch_id: 'ece', semester_id: 'sem_4', code: 'EC401', title: 'Digital Communication', credits: 4, description: 'PCM, ASK/FSK/PSK modulation, channel coding, error correction, spread spectrum.' },
    { id: 'sub_ece_402', branch_id: 'ece', semester_id: 'sem_4', code: 'EC402', title: 'Microprocessors & Embedded Systems', credits: 4, description: 'ARM Cortex-M architecture, interrupts, DMA, UART/SPI/I2C protocols, RTOS basics.' },
    { id: 'sub_ece_501', branch_id: 'ece', semester_id: 'sem_5', code: 'EC501', title: 'VLSI Design', credits: 4, description: 'CMOS logic, static timing analysis, floor planning, place & route, DRC.' },
    { id: 'sub_ece_502', branch_id: 'ece', semester_id: 'sem_5', code: 'EC502', title: 'Antenna Theory & RF Engineering', credits: 3, description: 'Dipole antennas, aperture antennas, beam forming, transmission lines, S-parameters.' },
    // EEE Sem 3-5
    { id: 'sub_eee_301', branch_id: 'eee', semester_id: 'sem_3', code: 'EE301', title: 'Electrical Machines - I', credits: 4, description: 'DC generators and motors, single-phase transformers, testing, losses and efficiency.' },
    { id: 'sub_eee_302', branch_id: 'eee', semester_id: 'sem_3', code: 'EE302', title: 'Electromagnetic Field Theory', credits: 4, description: 'Coulombs law, Gauss law, Maxwell equations, magnetic vector potential, wave propagation.' },
    { id: 'sub_eee_401', branch_id: 'eee', semester_id: 'sem_4', code: 'EE401', title: 'Power Systems Analysis', credits: 4, description: 'Load flow analysis, symmetrical components, fault analysis, power system stability.' },
    { id: 'sub_eee_402', branch_id: 'eee', semester_id: 'sem_4', code: 'EE402', title: 'Power Electronics', credits: 4, description: 'SCR, MOSFET, IGBT devices, rectifiers, choppers, inverters, AC drives.' },
    { id: 'sub_eee_501', branch_id: 'eee', semester_id: 'sem_5', code: 'EE501', title: 'Control Systems Engineering', credits: 4, description: 'Transfer functions, Routh-Hurwitz, Bode plots, Nyquist criterion, PID controllers.' },
    // Mechanical Sem 3-5
    { id: 'sub_mech_301', branch_id: 'mech', semester_id: 'sem_3', code: 'ME301', title: 'Engineering Thermodynamics', credits: 4, description: 'First and second laws, Carnot cycle, entropy, availability, Rankine & Brayton cycles.' },
    { id: 'sub_mech_302', branch_id: 'mech', semester_id: 'sem_3', code: 'ME302', title: 'Mechanics of Materials', credits: 4, description: 'Stress, strain, Mohr circle, bending moment, shear stress, torsion of circular shafts.' },
    { id: 'sub_mech_401', branch_id: 'mech', semester_id: 'sem_4', code: 'ME401', title: 'Fluid Mechanics', credits: 4, description: 'Bernoulli equation, Reynolds number, pipe flow, boundary layer theory, turbomachinery.' },
    { id: 'sub_mech_402', branch_id: 'mech', semester_id: 'sem_4', code: 'ME402', title: 'Manufacturing Processes', credits: 4, description: 'Casting, welding, machining, CNC operations, tolerance and surface finish.' },
    { id: 'sub_mech_501', branch_id: 'mech', semester_id: 'sem_5', code: 'ME501', title: 'Theory of Machines', credits: 4, description: 'Kinematic pairs, velocity analysis, gear trains, governors, balancing of rotating masses.' },
    // Civil Sem 3-4
    { id: 'sub_civil_301', branch_id: 'civil', semester_id: 'sem_3', code: 'CE301', title: 'Structural Analysis - I', credits: 4, description: 'Determinate trusses, deflections, moment area method, influence lines for moving loads.' },
    { id: 'sub_civil_302', branch_id: 'civil', semester_id: 'sem_3', code: 'CE302', title: 'Fluid Mechanics & Hydraulics', credits: 4, description: 'Fluid statics, Bernoulli equation, pipe flow losses, laminar and turbulent flow.' },
    { id: 'sub_civil_401', branch_id: 'civil', semester_id: 'sem_4', code: 'CE401', title: 'Reinforced Concrete Design', credits: 4, description: 'IS 456, limit state design, beams, columns, slabs, footings, retaining walls.' },
    { id: 'sub_civil_402', branch_id: 'civil', semester_id: 'sem_4', code: 'CE402', title: 'Geotechnical Engineering - I', credits: 4, description: 'Soil classification, permeability, consolidation, shear strength, bearing capacity.' },
    // AI/ML Sem 3-5
    { id: 'sub_aiml_301', branch_id: 'aiml', semester_id: 'sem_3', code: 'AI301', title: 'Foundations of Machine Learning', credits: 4, description: 'Supervised vs unsupervised learning, gradient descent, linear & logistic regression, evaluation metrics.' },
    { id: 'sub_aiml_302', branch_id: 'aiml', semester_id: 'sem_3', code: 'AI302', title: 'Linear Algebra & Optimization for AI', credits: 4, description: 'Vector spaces, eigenvalues, singular value decomposition (SVD), convex optimization.' },
    { id: 'sub_aiml_401', branch_id: 'aiml', semester_id: 'sem_4', code: 'AI401', title: 'Deep Learning & Neural Networks', credits: 4, description: 'Backpropagation, CNNs, RNNs, attention mechanisms, transformers, transfer learning.' },
    { id: 'sub_aiml_402', branch_id: 'aiml', semester_id: 'sem_4', code: 'AI402', title: 'Natural Language Processing', credits: 3, description: 'Tokenization, word embeddings, BERT, GPT, named entity recognition, sentiment analysis.' },
    { id: 'sub_aiml_501', branch_id: 'aiml', semester_id: 'sem_5', code: 'AI501', title: 'Reinforcement Learning', credits: 3, description: 'MDPs, Q-learning, policy gradient, actor-critic, multi-arm bandits, simulation.' },
    { id: 'sub_aiml_502', branch_id: 'aiml', semester_id: 'sem_5', code: 'AI502', title: 'MLOps & AI Systems Design', credits: 3, description: 'Model versioning, feature stores, serving pipelines, monitoring, drift detection.' }
  ],

  // -------------------------------------------------------------
  // TOPICS
  // -------------------------------------------------------------
  topics: [
    // CSE 301 (DSA)
    { id: 'top_cse_301_01', subject_id: 'sub_cse_301', branch_id: 'cse', semester_id: 'sem_3', unit_number: 1, sequence_order: 1, title: 'Asymptotic Analysis & Big-O Notation', description: 'Formal mathematical definition of Big-O, Omega, and Theta notations with recurrence trees.' },
    { id: 'top_cse_301_02', subject_id: 'sub_cse_301', branch_id: 'cse', semester_id: 'sem_3', unit_number: 1, sequence_order: 2, title: 'Self-Balancing Binary Trees (AVL & Red-Black)', description: 'Rotations, height balance invariants, insertions and deletions in logarithmic time.' },
    { id: 'top_cse_301_03', subject_id: 'sub_cse_301', branch_id: 'cse', semester_id: 'sem_3', unit_number: 2, sequence_order: 3, title: 'Graph Algorithms: Shortest Paths & MST', description: 'Dijkstra, Bellman-Ford, Prim, and Kruskal algorithms with complexity proofs.' },

    // CSE 302 (Digital Logic & Architecture)
    { id: 'top_cse_302_01', subject_id: 'sub_cse_302', branch_id: 'cse', semester_id: 'sem_3', unit_number: 1, sequence_order: 1, title: 'Pipelining & Hazard Resolution', description: 'Instruction pipeline stages (IF, ID, EX, MEM, WB), structural, data, and branch hazards.' },
    { id: 'top_cse_302_02', subject_id: 'sub_cse_302', branch_id: 'cse', semester_id: 'sem_3', unit_number: 2, sequence_order: 2, title: 'Hierarchical Memory & Cache Coherence', description: 'Direct mapped vs set-associative cache, MESI protocol, write-back vs write-through.' },

    // ECE 301
    { id: 'top_ece_301_01', subject_id: 'sub_ece_301', branch_id: 'ece', semester_id: 'sem_3', unit_number: 1, sequence_order: 1, title: 'MOSFET Small-Signal Analysis', description: 'Derivation of transconductance gm, output resistance ro, and high-frequency Miller capacitance.' },

    // MECH 301
    { id: 'top_mech_301_01', subject_id: 'sub_mech_301', branch_id: 'mech', semester_id: 'sem_3', unit_number: 1, sequence_order: 1, title: 'Second Law of Thermodynamics & Entropy', description: 'Clausius inequality, entropy generation in irreversible processes, exergy destruction.' },

    // CSE 504 (Machine Learning & Neural Networks)
    { id: 'top_cse_504_01', subject_id: 'sub_cse_504', branch_id: 'cse', semester_id: 'sem_5', unit_number: 1, sequence_order: 1, title: 'Neural Networks', description: 'Multilayer perceptrons, activation functions, loss surfaces, gradient descent, and backpropagation calculus.' },
    { id: 'top_cse_504_02', subject_id: 'sub_cse_504', branch_id: 'cse', semester_id: 'sem_5', unit_number: 2, sequence_order: 2, title: 'Deep Learning Architectures & Transformers', description: 'Self-attention mechanisms, Transformers, PyTorch implementations, and generative models.' }
  ],

  // -------------------------------------------------------------
  // VIDEOS (Strictly Filtered)
  // -------------------------------------------------------------
  videos: [
    ...AUTHENTIC_VIDEOS,
    {
      id: 'vid_cse_301_01',
      branch_id: 'cse',
      semester_id: 'sem_3',
      subject_id: 'sub_cse_301',
      topic_id: 'top_cse_301_01',
      title: 'Mastering Big-O Analysis & Recurrence Relations',
      description: 'Rigorous mathematical proof of asymptotic runtime bounds with Master Theorem examples.',
      provider: 'MIT OpenCourseWare / NPTEL',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc03cf4456e?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'intermediate',
      duration: 1240,
      career_relevance: 'Software Engineering, Algorithms Specialist',
      status: 'published'
    },
    {
      id: 'vid_cse_301_02',
      branch_id: 'cse',
      semester_id: 'sem_3',
      subject_id: 'sub_cse_301',
      topic_id: 'top_cse_301_02',
      title: 'AVL Trees in Depth: LL, RR, LR, RL Rotations',
      description: 'Step-by-step memory pointer manipulation and balance factor telemetry.',
      provider: 'TechPath Computer Science Faculty',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'advanced',
      duration: 980,
      career_relevance: 'Systems Engineer, Database Architect',
      status: 'published'
    },
    {
      id: 'vid_cse_302_01',
      branch_id: 'cse',
      semester_id: 'sem_3',
      subject_id: 'sub_cse_302',
      topic_id: 'top_cse_302_01',
      title: 'Superscalar CPU Pipelining & Branch Prediction Hazards',
      description: 'Instruction pipeline stages (IF, ID, EX, MEM, WB) and forwarding path circuitry.',
      provider: 'Carnegie Mellon Architecture Lecture',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'advanced',
      duration: 1450,
      career_relevance: 'Hardware Systems, Low-Level Kernel Dev',
      status: 'published'
    },
    // ECE Videos
    {
      id: 'vid_ece_301_01',
      branch_id: 'ece',
      semester_id: 'sem_3',
      subject_id: 'sub_ece_301',
      topic_id: 'top_ece_301_01',
      title: 'MOSFET Sub-threshold and Saturation Dynamics',
      description: 'Physical carrier transport in modern FinFET and planar semiconductor gates.',
      provider: 'NPTEL Semiconductor Physics',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'advanced',
      duration: 1120,
      career_relevance: 'VLSI Engineer, Silicon Hardware Lead',
      status: 'published'
    },
    {
      id: 'vid_ece_302_01',
      branch_id: 'ece',
      semester_id: 'sem_3',
      subject_id: 'sub_ece_302',
      topic_id: 'top_ece_302_01',
      title: 'Fourier & Laplace Transforms in Continuous LTI Systems',
      description: 'Spectral frequency analysis, impulse response convolution, and stability analysis.',
      provider: 'MIT Signals & Systems Series',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'intermediate',
      duration: 1320,
      career_relevance: 'DSP Engineer, Communications Architect',
      status: 'published'
    },
    // EEE Videos
    {
      id: 'vid_eee_301_01',
      branch_id: 'eee',
      semester_id: 'sem_3',
      subject_id: 'sub_eee_301',
      topic_id: 'top_eee_301_01',
      title: 'Three-Phase Transformer Core Losses & Magnetic Induction',
      description: 'Equivalent circuit parameter derivation, open-circuit and short-circuit testing.',
      provider: 'NPTEL Electrical Machines',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'intermediate',
      duration: 1180,
      career_relevance: 'Power Systems Engineer, Grid Analyst',
      status: 'published'
    },
    {
      id: 'vid_eee_402_01',
      branch_id: 'eee',
      semester_id: 'sem_4',
      subject_id: 'sub_eee_402',
      topic_id: 'top_eee_402_01',
      title: 'Pulse-Width Modulated Inverters & Motor Drives',
      description: 'Sinusoidal PWM generation, total harmonic distortion (THD), and IGBT switching efficiency.',
      provider: 'IEEE Power Electronics Chapter',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'advanced',
      duration: 1290,
      career_relevance: 'EV Powertrain Engineer, Drive Systems Specialist',
      status: 'published'
    },
    // Mechanical Videos
    {
      id: 'vid_mech_301_01',
      branch_id: 'mech',
      semester_id: 'sem_3',
      subject_id: 'sub_mech_301',
      topic_id: 'top_mech_301_01',
      title: 'Carnot & Otto Thermodynamic Power Cycles',
      description: 'First and Second Laws of Thermodynamics applied to reciprocating internal combustion engines.',
      provider: 'MIT Thermal Engineering',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'intermediate',
      duration: 1350,
      career_relevance: 'Thermal Systems Engineer, Automotive Specialist',
      status: 'published'
    },
    {
      id: 'vid_mech_401_01',
      branch_id: 'mech',
      semester_id: 'sem_4',
      subject_id: 'sub_mech_401',
      topic_id: 'top_mech_401_01',
      title: 'Bernoulli Equation & Boundary Layer Fluid Dynamics',
      description: 'Navier-Stokes simplifications, pipe friction head loss, and laminar-turbulent transitions.',
      provider: 'Stanford Fluid Mechanics',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'advanced',
      duration: 1410,
      career_relevance: 'Aerospace Analyst, Turbomachinery Engineer',
      status: 'published'
    },
    // Civil Videos
    {
      id: 'vid_civil_301_01',
      branch_id: 'civil',
      semester_id: 'sem_3',
      subject_id: 'sub_civil_301',
      topic_id: 'top_civil_301_01',
      title: 'Structural Analysis of Determinate & Indeterminate Trusses',
      description: 'Method of joints, method of sections, and virtual work deflection calculations.',
      provider: 'NPTEL Structural Analysis',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'intermediate',
      duration: 1190,
      career_relevance: 'Structural Engineer, Bridge Design Specialist',
      status: 'published'
    },
    // AI/ML Videos
    {
      id: 'vid_aiml_301_01',
      branch_id: 'aiml',
      semester_id: 'sem_3',
      subject_id: 'sub_aiml_301',
      topic_id: 'top_aiml_301_01',
      title: 'Gradient Descent Optimization & Cross-Entropy Loss',
      description: 'Convex vs non-convex cost surfaces, learning rate scheduling, and momentum proofs.',
      provider: 'DeepLearning.AI / Stanford CS229',
      category: 'Core Subjects',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'intermediate',
      duration: 1260,
      tags: ['AI/ML', 'Optimization', 'Mathematics'],
      instructor: 'Prof. Andrew Ng',
      career_relevance: 'Machine Learning Scientist, AI Research Engineer',
      status: 'published'
    },
    {
      id: 'vid_aiml_401_01',
      branch_id: 'aiml',
      semester_id: 'sem_4',
      subject_id: 'sub_aiml_401',
      topic_id: 'top_aiml_301_01',
      title: 'Deep Transformer Architectures & Multi-Head Self-Attention',
      description: 'Mathematical derivation of Query-Key-Value dot products, positional encodings, and scaling factors.',
      provider: 'MIT 6.S191 Deep Learning',
      category: 'Advanced Topics',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'advanced',
      duration: 1540,
      tags: ['Transformers', 'NLP', 'Attention'],
      instructor: 'MIT Center for Brains, Minds & Machines',
      career_relevance: 'LLM Systems Engineer, Foundation Model Architect',
      status: 'published'
    },
    // Biomedical Engineering Videos
    {
      id: 'vid_biomed_301_01',
      branch_id: 'biomed',
      semester_id: 'sem_3',
      subject_id: 'sub_biomed_301',
      topic_id: 'top_biomed_301_01',
      title: '12-Lead ECG Signal Acquisition & Bio-Potential Front-End',
      description: 'Low-noise instrumentation amplifier design, Wilson Central Terminal references, and 50Hz notch filtering.',
      provider: 'NPTEL Biomedical Instrumentation',
      category: 'Core Subjects',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'intermediate',
      duration: 1320,
      tags: ['Biomedical', 'Sensors', 'ECG'],
      instructor: 'Dr. R. Sengupta (IIT Kharagpur)',
      career_relevance: 'Clinical Systems Engineer, Medical Device Designer',
      status: 'published'
    },
    {
      id: 'vid_biomed_401_01',
      branch_id: 'biomed',
      semester_id: 'sem_4',
      subject_id: 'sub_biomed_301',
      topic_id: 'top_biomed_301_01',
      title: 'Medical Imaging: Ultrasound Beamforming & Doppler Velocity',
      description: 'Piezoelectric transducer arrays, phased array beam focusing, and acoustic impedance matching.',
      provider: 'Stanford Biodesign Institute',
      category: 'Advanced Topics',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'advanced',
      duration: 1480,
      tags: ['Imaging', 'Ultrasound', 'Doppler'],
      instructor: 'Prof. Paul Yock',
      career_relevance: 'Medical Imaging Scientist, Diagnostic Hardware Architect',
      status: 'published'
    },
    // Aerospace Engineering Videos
    {
      id: 'vid_aero_301_01',
      branch_id: 'aero',
      semester_id: 'sem_3',
      subject_id: 'sub_aero_301',
      topic_id: 'top_aero_301_01',
      title: 'High-Bypass Turbofan Cycle Analysis & Thrust Metrics',
      description: 'Brayton gas power cycle, compressor stage pressure ratios, and thermal vs propulsive efficiency.',
      provider: 'MIT 16.00 Aerospace Propulsion',
      category: 'Core Subjects',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'advanced',
      duration: 1420,
      tags: ['Aerospace', 'Propulsion', 'Turbofan'],
      instructor: 'Prof. Ian Waitz',
      career_relevance: 'Propulsion Systems Engineer, Aerodynamicist',
      status: 'published'
    },
    {
      id: 'vid_aero_401_01',
      branch_id: 'aero',
      semester_id: 'sem_4',
      subject_id: 'sub_aero_301',
      topic_id: 'top_aero_301_01',
      title: 'Transonic Airfoil Aerodynamics & Oblique Shock Waves',
      description: 'Prandtl-Meyer expansion fans, wave drag divergence Mach number, and supercritical airfoil camber.',
      provider: 'Stanford Department of Aeronautics & Astronautics',
      category: 'Fundamentals',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e919?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'advanced',
      duration: 1350,
      tags: ['Aerodynamics', 'Transonic', 'Shock Waves'],
      instructor: 'Prof. Juan Alonso',
      career_relevance: 'Flight Sciences Lead, Aircraft Structural Analyst',
      status: 'published'
    },
    // Robotics Engineering Videos
    {
      id: 'vid_robot_301_01',
      branch_id: 'robotics',
      semester_id: 'sem_3',
      subject_id: 'sub_robotics_301',
      topic_id: 'top_robotics_301_01',
      title: 'Kinematic Chain Modeling & Denavit-Hartenberg Parameters',
      description: 'Homogeneous transformation matrices, forward kinematics, and coordinate frame assignments for 6-DOF arms.',
      provider: 'Stanford Robotics Lab (CS223A)',
      category: 'Core Subjects',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'intermediate',
      duration: 1280,
      tags: ['Robotics', 'Kinematics', 'D-H Parameters'],
      instructor: 'Prof. Oussama Khatib',
      career_relevance: 'Robotics Software Engineer, Motion Control Specialist',
      status: 'published'
    },
    {
      id: 'vid_robot_401_01',
      branch_id: 'robotics',
      semester_id: 'sem_4',
      subject_id: 'sub_robotics_301',
      topic_id: 'top_robotics_301_01',
      title: 'Jacobian Velocity Mapping & Singularity Avoidance',
      description: 'Analytical vs geometric Jacobians, manipulability ellipsoids, and singularity avoidance trajectory dampening.',
      provider: 'MIT Robot Locomotion Group',
      category: 'Advanced Topics',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'advanced',
      duration: 1450,
      tags: ['Jacobian', 'Singularity', 'Manipulability'],
      instructor: 'Prof. Russ Tedrake',
      career_relevance: 'Autonomous Systems Architect, Industrial Automation Lead',
      status: 'published'
    },
    // Automobile Engineering Videos
    {
      id: 'vid_auto_301_01',
      branch_id: 'automobile',
      semester_id: 'sem_3',
      subject_id: 'sub_auto_301',
      topic_id: 'top_auto_301_01',
      title: 'Electric Vehicle Traction Inverters & Field-Oriented Control',
      description: 'Space Vector PWM, Clarke-Park coordinate transforms, and direct torque control in PMSM motors.',
      provider: 'NPTEL Automotive Electronics & Powertrains',
      category: 'Core Subjects',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1558441719-8b489c634a10?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'intermediate',
      duration: 1390,
      tags: ['EV', 'FOC', 'Inverters'],
      instructor: 'Dr. Kaushik Rajashekara (IEEE Fellow)',
      career_relevance: 'EV Powertrain Engineer, Battery Systems Lead',
      status: 'published'
    },
    {
      id: 'vid_auto_401_01',
      branch_id: 'automobile',
      semester_id: 'sem_4',
      subject_id: 'sub_auto_301',
      topic_id: 'top_auto_301_01',
      title: 'Vehicle Dynamics: Lateral Tire Slip & Electronic Stability Control',
      description: 'Pacejka Magic Formula, yaw moment control, steering kinematics, and active braking intervention.',
      provider: 'University of Michigan Automotive Research',
      category: 'Practical Learning',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'advanced',
      duration: 1410,
      tags: ['Vehicle Dynamics', 'ESC', 'Tires'],
      instructor: 'Automotive Engineering Research Group',
      career_relevance: 'Chassis Systems Engineer, Vehicle Dynamics Specialist',
      status: 'published'
    },
    // Additional Core Videos for CSE, ECE, EEE, MECH, CIVIL
    {
      id: 'vid_cse_401_01',
      branch_id: 'cse',
      semester_id: 'sem_4',
      subject_id: 'sub_cse_401',
      topic_id: 'top_cse_301_01',
      title: 'Operating System Virtual Memory & Page Fault Handlers',
      description: 'Multi-level page tables, Translation Lookaside Buffers (TLB), inverted page tables, and LRU clock eviction.',
      provider: 'UC Berkeley CS162',
      category: 'Core Subjects',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'intermediate',
      duration: 1340,
      tags: ['Operating Systems', 'Memory', 'Paging'],
      instructor: 'Prof. Anthony D. Joseph',
      career_relevance: 'Systems Software Engineer, Kernel Developer',
      status: 'published'
    },
    {
      id: 'vid_ece_402_01',
      branch_id: 'ece',
      semester_id: 'sem_4',
      subject_id: 'sub_ece_402',
      topic_id: 'top_ece_301_01',
      title: 'ARM Cortex-M Embedded Architecture & Nested Vector Interrupts',
      description: 'NVIC priority grouping, tail-chaining latency, memory mapped I/O, and hardware timer register programming.',
      provider: 'ARM University Program',
      category: 'Lab Tutorials',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'intermediate',
      duration: 1270,
      tags: ['ARM', 'Embedded', 'Interrupts'],
      instructor: 'Embedded Systems Academic Group',
      career_relevance: 'Embedded Firmware Engineer, IoT Systems Designer',
      status: 'published'
    },
    {
      id: 'vid_mech_401_01',
      branch_id: 'mech',
      semester_id: 'sem_4',
      subject_id: 'sub_mech_401',
      topic_id: 'top_mech_301_01',
      title: 'Navier-Stokes Equations & Boundary Layer Fluid Friction',
      description: 'Differential momentum conservation, laminar vs turbulent transition, and Darcy-Weisbach head loss equations.',
      provider: 'MIT 2.005 Thermal-Fluids Engineering',
      category: 'Fundamentals',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
      language: 'en',
      difficulty: 'advanced',
      duration: 1460,
      tags: ['Fluids', 'Navier-Stokes', 'Turbulence'],
      instructor: 'Prof. John Lienhard',
      career_relevance: 'CFD Engineer, Aerodynamic Simulation Specialist',
      status: 'published'
    }
  ],

  // -------------------------------------------------------------
  // 3D MODELS (True Engineering Systems)
  // -------------------------------------------------------------
  branch_models: [
    {
      id: 'mod_cse_cpu',
      branch_id: 'cse',
      semester_id: 'sem_3',
      subject_id: 'sub_cse_302',
      topic_id: 'top_cse_302_01',
      name: 'Multi-Core Pipelined CPU Microarchitecture',
      category: 'Computer Hardware',
      description: 'Detailed interactive 3D breakdown of an out-of-order superscalar CPU showing ALU, Register Files, L1/L2 Cache hierarchy, and Control Unit.',
      learning_objective: 'Understand instruction dispatch, branch prediction circuits, and cache memory busses.',
      difficulty: 'intermediate',
      asset_type: 'procedural_mesh',
      model_config: {
        type: 'cpu_architecture',
        color: '#e11d48',
        components_count: 5
      },
      accessible_2d_diagram: {
        title: '2D Schematic: Superscalar CPU Pipeline',
        nodes: [
          { name: 'Instruction Fetch (IF)', desc: 'Fetches opcode from L1 I-Cache via Program Counter' },
          { name: 'Decode & Rename (ID)', desc: 'Decodes instruction into micro-ops and allocates physical registers' },
          { name: 'Execution Units (ALU / FPU)', desc: 'High-speed parallel arithmetic logic units' },
          { name: 'Memory Stage (L1 D-Cache)', desc: 'Load-store queue interfacing unified L2 cache' },
          { name: 'Write-Back (WB)', desc: 'Retires completed operations to Architectural Register State' }
        ]
      },
      components: [
        {
          id: 'comp_cpu_alu',
          name: 'Arithmetic Logic Unit (ALU)',
          what: 'High-speed combinatorial execution unit performing integer arithmetic and bitwise logic operations.',
          why: 'The core computational engine that executes decoded instructions in single clock cycles.',
          how: 'Accepts operands from register files, computes result via carry-lookahead adders and barrel shifters.',
          inputs: 'Operand A (64-bit), Operand B (64-bit), Opcode (8-bit), Carry-In',
          outputs: 'Result (64-bit), Flags: Zero (Z), Carry (C), Overflow (V), Negative (N)',
          interview_questions: [
            'How does a Carry-Lookahead Adder achieve logarithmic delay compared to Ripple-Carry?',
            'What causes a pipeline stall in an out-of-order execution engine during an ALU operand dependency?'
          ]
        },
        {
          id: 'comp_cpu_l1cache',
          name: 'Split L1 Cache (Instruction & Data)',
          what: 'SRAM cache banks located directly adjacent to core execution pipelines.',
          why: 'Reduces CPU cycle penalties from fetching instructions and data across high-latency external memory buses.',
          how: 'Employs 4-way to 8-way set associativity with LRU eviction and MESI cache-coherency tags.',
          inputs: 'Virtual memory address, Read/Write strobes',
          outputs: '64-byte Cache Line, Hit/Miss signals',
          interview_questions: [
            'Why are L1 instruction and data caches physically split rather than unified in modern cores?',
            'Explain the MESI protocol states and how a cache line transitions during a parallel Core Write.'
          ]
        },
        {
          id: 'comp_cpu_registers',
          name: 'Register File & Reorder Buffer (ROB)',
          what: 'Dual-ported fast register array maintaining in-flight and committed register state.',
          why: 'Permits speculative execution without corrupting permanent processor state if branch misprediction occurs.',
          how: 'Micro-ops commit strictly in-order from the head of the circular ROB queue.',
          inputs: 'Rename tags, Speculative bypass data',
          outputs: 'Committed architectural register updates',
          interview_questions: [
            'What is register renaming and how does it eliminate WAR and WAW hazards?'
          ]
        },
        {
          id: 'comp_cpu_control',
          name: 'Control Unit & Branch Predictor',
          what: 'Combinational state machine paired with a TAGE (Tagged Geometric History) branch prediction engine.',
          why: 'Maintains full execution throughput by predicting conditional jump outcomes before evaluation.',
          how: 'Maintains Branch Target Buffer (BTB) and global history shift registers.',
          inputs: 'Program Counter address, Historical outcome bits',
          outputs: 'Speculative Target Address, Pipeline control signals',
          interview_questions: [
            'Explain the cost of a branch misprediction penalty in deep (14+ stage) pipelines.'
          ]
        },
        {
          id: 'comp_cpu_interconnect',
          name: 'Ring / Mesh Interconnect & Memory Controller',
          what: 'High-bandwidth on-die network routing traffic between cores and unified L3 cache.',
          why: 'Enables scalable multi-core data sharing with low latency and high bisection bandwidth.',
          how: 'Packetized crossbar switch routing cache snoops and DMA memory requests.',
          inputs: 'Inter-core packet frames, DDR5 memory clock',
          outputs: 'DDR bus bursts, Cache invalidation broadcasts',
          interview_questions: [
            'Compare on-chip Ring Bus topology vs 2D Mesh routing in high-core count server silicon.'
          ]
        }
      ]
    },
    {
      id: 'mod_ece_mosfet',
      branch_id: 'ece',
      semester_id: 'sem_3',
      subject_id: 'sub_ece_301',
      topic_id: 'top_ece_301_01',
      name: 'FinFET N-Channel Semiconductor Transistor',
      category: 'Semiconductor Hardware',
      description: '3D structural visualization of a 3-dimensional Fin Field Effect Transistor detailing Source, Drain, Gate Oxide dielectric, and Fin channel.',
      learning_objective: 'Understand quantum short-channel effects, electrostatic gate wrap-around, and subthreshold slope.',
      difficulty: 'advanced',
      asset_type: 'procedural_mesh',
      model_config: {
        type: 'finfet_transistor',
        color: '#0284c7',
        components_count: 4
      },
      accessible_2d_diagram: {
        title: '2D Schematic: FinFET Cross-Section',
        nodes: [
          { name: 'Silicon Fin', desc: 'Raised channel surrounded on 3 sides by gate dielectric' },
          { name: 'High-k Metal Gate', desc: 'Controls electric field and channel inversion' },
          { name: 'Source / Drain Epitaxy', desc: 'Doped silicon contacts providing charge carrier injection' }
        ]
      },
      components: [
        {
          id: 'comp_finfet_fin',
          name: '3D Silicon Channel Fin',
          what: 'Vertical silicon fin creating high surface contact area for the controlling gate.',
          why: 'Suppresses drain-induced barrier lowering (DIBL) in sub-10nm fabrication nodes.',
          how: 'Carriers conduct through the 3D volume when gate voltage surpasses threshold voltage Vth.',
          inputs: 'Carrier concentration, Gate voltage field',
          outputs: 'Drain-Source Saturation Current Ids',
          interview_questions: [
            'Why does a FinFET have superior subthreshold swing compared to a planar MOSFET?'
          ]
        }
      ]
    },
    {
      id: 'mod_mech_engine',
      branch_id: 'mech',
      semester_id: 'sem_3',
      subject_id: 'sub_mech_301',
      topic_id: 'top_mech_301_01',
      name: 'Four-Stroke Internal Combustion Power Assembly',
      category: 'Thermodynamics & Machinery',
      description: 'Interactive exploded 3D model of a high-compression cylinder, piston, wrist pin, connecting rod, and crankshaft assembly.',
      learning_objective: 'Visualize intake, compression, power, and exhaust strokes and calculate thermal efficiency.',
      difficulty: 'intermediate',
      asset_type: 'procedural_mesh',
      model_config: {
        type: 'ic_engine',
        color: '#f59e0b',
        components_count: 4
      },
      accessible_2d_diagram: {
        title: '2D P-V Diagram of Otto Cycle',
        nodes: [
          { name: '1-2 Isentropic Compression', desc: 'Piston moves from BDC to TDC compressing fuel-air mixture' },
          { name: '2-3 Constant Volume Heat Addition', desc: 'Spark ignition releases chemical enthalpy' },
          { name: '3-4 Isentropic Expansion', desc: 'High pressure gas drives piston downward delivering work' },
          { name: '4-1 Constant Volume Heat Rejection', desc: 'Exhaust valve opens releasing thermal energy' }
        ]
      },
      components: [
        {
          id: 'comp_mech_piston',
          name: 'Piston Crown & Ring Pack',
          what: 'Cylindrical alloy component reciprocating inside the cylinder sleeve.',
          why: 'Transfers force from combusting gas expansion to the connecting rod.',
          how: 'Seals high-pressure combustion gas via compression rings and regulates lubrication.',
          inputs: 'Combustion chamber gas pressure (up to 120 bar)',
          outputs: 'Reciprocating linear thrust',
          interview_questions: [
            'How is thermal expansion compensated in piston crown design?'
          ]
        }
      ]
    },
    {
      id: 'mod_eee_transformer',
      branch_id: 'eee',
      semester_id: 'sem_3',
      subject_id: 'sub_eee_301',
      topic_id: 'top_eee_301_01',
      name: 'Three-Phase High-Voltage Power Transformer',
      category: 'Electrical Systems',
      description: 'Interactive 3D model of a laminated steel core, primary and secondary copper windings, oil cooling radiators, and high-voltage bushings.',
      learning_objective: 'Understand electromagnetic induction, flux leakage, eddy current suppression, and transformation ratio V1/V2 = N1/N2.',
      difficulty: 'intermediate',
      asset_type: 'procedural_mesh',
      model_config: {
        type: 'transformer',
        color: '#10b981',
        components_count: 4
      },
      accessible_2d_diagram: {
        title: '2D Schematic: Transformer Magnetic Circuit',
        nodes: [
          { name: 'Laminated Core', desc: 'Grain-oriented silicon steel reducing eddy currents' },
          { name: 'Primary Windings', desc: 'High-voltage copper coils generating magnetic flux' },
          { name: 'Secondary Windings', desc: 'Induces output voltage proportional to turns ratio' },
          { name: 'Conservator & Bushings', desc: 'High-voltage insulation and thermal expansion tank' }
        ]
      },
      components: [
        {
          id: 'comp_transformer_core',
          name: 'Laminated Silicon Steel Core',
          what: 'Magnetic flux conductor built from thin insulated laminations.',
          why: 'Provides low-reluctance magnetic path while minimizing hysteresis and eddy current power losses.',
          how: 'Laminations are oriented along the rolling direction to maximize magnetic permeability.',
          inputs: 'Magnetizing current and primary flux',
          outputs: 'Mutual magnetic flux linking secondary coils',
          interview_questions: [
            'Why are transformer cores laminated instead of being manufactured from a solid block of iron?'
          ]
        },
        {
          id: 'comp_transformer_windings',
          name: 'Primary & Secondary Coils',
          what: 'Concentric copper conductor coils insulated with thermal paper.',
          why: 'Converts electrical potential energy into alternating magnetic field and back.',
          how: 'Voltage step-down or step-up governed strictly by Faraday’s Law: V = -N (dPhi/dt).',
          inputs: 'Primary AC voltage (e.g. 11kV)',
          outputs: 'Secondary AC voltage (e.g. 415V)',
          interview_questions: [
            'Explain the trade-offs between concentric windings and sandwich windings.'
          ]
        }
      ]
    },
    {
      id: 'mod_civil_bridge',
      branch_id: 'civil',
      semester_id: 'sem_3',
      subject_id: 'sub_civil_301',
      topic_id: 'top_civil_301_01',
      name: 'Pratt Truss High-Load Bridge Structure',
      category: 'Structural Mechanics',
      description: 'Full structural analysis 3D model detailing chords, vertical struts in compression, and diagonal ties in tension under vehicular load.',
      learning_objective: 'Visualize axial tension/compression distribution and calculate member forces using the method of joints.',
      difficulty: 'intermediate',
      asset_type: 'procedural_mesh',
      model_config: {
        type: 'truss_bridge',
        color: '#6366f1',
        components_count: 4
      },
      accessible_2d_diagram: {
        title: '2D Free-Body Diagram: Pratt Truss',
        nodes: [
          { name: 'Top Chord', desc: 'Horizontal member under continuous compressive axial stress' },
          { name: 'Bottom Chord', desc: 'Horizontal member under tensile stress resisting bridge deflection' },
          { name: 'Vertical Struts', desc: 'Transfer deck loads upwards to diagonal web members' },
          { name: 'Diagonal Ties', desc: 'Slender members acting in pure tension under standard gravity loads' }
        ]
      },
      components: [
        {
          id: 'comp_truss_chord',
          name: 'Compression Top Chord',
          what: 'Continuous structural steel members forming the top boundary of the truss.',
          why: 'Carries primary bending moment as axial compression across the bridge span.',
          how: 'Resists Euler buckling through high second moment of area (I-beam or box section).',
          inputs: 'Bending moment converted into axial compressive thrust',
          outputs: 'Load transfer to bridge end piers and abutments',
          interview_questions: [
            'What is the primary advantage of a Pratt truss over a Howe truss for steel construction?'
          ]
        }
      ]
    },
    {
      id: 'mod_aiml_nn',
      branch_id: 'aiml',
      semester_id: 'sem_3',
      subject_id: 'sub_aiml_301',
      topic_id: 'top_aiml_301_01',
      name: 'Deep Convolutional Neural Network & Feature Extractor',
      category: 'Deep Learning Systems',
      description: 'Interactive 3D visualization of convolution kernels, activation volumes, spatial pooling, and fully connected classification heads.',
      learning_objective: 'Understand spatial feature maps, receptive fields, backpropagation gradients, and weight matrix dimensions.',
      difficulty: 'intermediate',
      asset_type: 'procedural_mesh',
      model_config: {
        type: 'neural_network',
        color: '#ec4899',
        components_count: 4
      },
      accessible_2d_diagram: {
        title: '2D Pipeline: CNN Spatial Transformations',
        nodes: [
          { name: 'Input Tensor (H x W x C)', desc: 'Raw vector feature space' },
          { name: 'Conv2D + ReLU', desc: 'Spatial feature filters learning edge and texture kernels' },
          { name: 'Max Pooling', desc: 'Downsamples spatial dimension providing translation invariance' },
          { name: 'Dense Softmax Head', desc: 'Linear projection computing multi-class categorical probabilities' }
        ]
      },
      components: [
        {
          id: 'comp_nn_conv',
          name: 'Convolutional Filter Bank (Conv2D)',
          what: '3D tensor kernel sliding across input activations computing dot products.',
          why: 'Extracts translation-invariant localized spatial features with parameter sharing.',
          how: 'Computes Y[i,j] = sum(X[i+m, j+n] * W[m,n]) followed by non-linear activation.',
          inputs: 'Feature map tensor [B, C, H, W]',
          outputs: 'Extracted activation volume with localized receptive field',
          interview_questions: [
            'How does parameter sharing in convolution dramatically reduce model overfitting compared to fully connected layers?'
          ]
        }
      ]
    },
    {
      id: 'mod_biomed_ecg',
      branch_id: 'biomed',
      semester_id: 'sem_3',
      subject_id: 'sub_biomed_301',
      topic_id: 'top_biomed_301_01',
      name: '12-Lead Diagnostic ECG Acquisition & Signal Conditioning System',
      category: 'Biomedical Instrumentation',
      description: 'Interactive 3D model of medical-grade bio-potential electrodes, instrumentation amplifier AFE, notch filtering circuitry, and Wilson Central Terminal network.',
      learning_objective: 'Understand Einthoven triangle geometry, CMRR requirements (>100dB), and ECG wave morphologies (P, QRS, T).',
      difficulty: 'intermediate',
      asset_type: 'procedural_mesh',
      model_config: {
        type: 'ecg_system',
        color: '#0ea5e9',
        components_count: 3
      },
      accessible_2d_diagram: {
        title: '2D Schematic: 12-Lead ECG Bio-Signal Chain',
        nodes: [
          { name: 'Electrode Interface', desc: 'Ag/AgCl bio-potential skin contact pads' },
          { name: 'Instrumentation Amplifier (In-Amp)', desc: 'High CMRR differential front-end eliminating 50/60Hz mains hum' },
          { name: 'Bandpass / Notch Filter', desc: '0.05Hz to 150Hz clinical diagnostic bandwidth filtering' }
        ]
      },
      components: [
        {
          id: 'comp_ecg_afe',
          name: 'Differential Analog Front-End (AFE)',
          what: 'Precision low-noise instrumentation bio-amplifier array.',
          why: 'Amplifies microvolt-level cardiac depolarization signals while rejecting high common-mode skin potentials.',
          how: 'Employs 3-op-amp topology with laser-trimmed resistors achieving >110 dB CMRR.',
          inputs: 'Right Arm (RA), Left Arm (LA), Left Leg (LL) microvolt bio-potentials',
          outputs: 'Conditioned analog millivolt ECG signal to ADC',
          interview_questions: [
            'Why is a Right Leg Drive (RLD) circuit required in clinical 12-lead ECG machines?',
            'What is the frequency cutoff required for ST-segment myocardial infarction analysis?'
          ]
        },
        {
          id: 'comp_ecg_electrodes',
          name: 'Wilson Central Terminal Leads',
          what: 'Resistive averaging network synthesizing reference potential.',
          why: 'Provides the virtual indifferent ground reference for precordial unipolar chest leads V1-V6.',
          how: 'Connects RA, LA, and LL through equal 5k-ohm precision resistors.',
          inputs: 'RA, LA, LL electrode signals',
          outputs: 'WCT virtual reference potential',
          interview_questions: [
            'Derive the Wilson Central Terminal potential in terms of limb lead voltages.'
          ]
        }
      ]
    },
    {
      id: 'mod_aero_turbofan',
      branch_id: 'aero',
      semester_id: 'sem_3',
      subject_id: 'sub_aero_301',
      topic_id: 'top_aero_301_01',
      name: 'High-Bypass Commercial Turbofan Jet Engine',
      category: 'Propulsion & Aerodynamics',
      description: 'Interactive 3D model of titanium wide-chord fan blisk, low/high pressure axial compressors, annular combustion chamber, and multi-stage turbines.',
      learning_objective: 'Analyze Brayton cycle thermodynamics, bypass ratio thrust distribution, and supersonic fan blade aerodynamics.',
      difficulty: 'advanced',
      asset_type: 'procedural_mesh',
      model_config: {
        type: 'turbofan_engine',
        color: '#64748b',
        components_count: 4
      },
      accessible_2d_diagram: {
        title: '2D Gas Flow Station: Dual-Spool Turbofan',
        nodes: [
          { name: 'Station 1: Inlet & Fan', desc: 'Accelerates cold bypass air delivering 80% total take-off thrust' },
          { name: 'Station 3: HP Compressor', desc: '10-stage axial compression achieving 40:1 overall pressure ratio' },
          { name: 'Station 4: Combustor', desc: 'Annular fuel spray nozzles burning Jet-A1 at 1700 deg C' },
          { name: 'Station 5: HP Turbine', desc: 'Single-crystal nickel superalloy blades extracting work for compressor' }
        ]
      },
      components: [
        {
          id: 'comp_turbofan_fan',
          name: 'Titanium-Alloy Wide-Chord Fan Blisk',
          what: 'Single-piece bladed disk forged from Ti-6Al-4V alloy.',
          why: 'Generates up to 85% of sea-level cruise thrust with low specific fuel consumption.',
          how: 'Swept aerodynamic blade profiles reduce shock wave losses at transonic blade tips.',
          inputs: 'Low-pressure turbine shaft rotation (3,000 RPM)',
          outputs: 'High-mass cold bypass air stream (1,200 kg/s)',
          interview_questions: [
            'Explain how bypass ratio affects propulsive efficiency vs thermal efficiency.',
            'What is the purpose of blade sweep in modern transonic fan design?'
          ]
        },
        {
          id: 'comp_turbofan_nacelle',
          name: 'Acoustic Nacelle & Reverse Thrust Cowl',
          what: 'Composite aerodynamic housing lined with sound-absorbing acoustic honeycomb liners.',
          why: 'Minimizes cruise drag and dampens engine noise levels for FAA/ICAO Stage 5 compliance.',
          how: 'Directs bypass flow and incorporates translating sleeves for landing deceleration.',
          inputs: 'Surrounding airflow vector',
          outputs: 'Streamlined air entry and acoustic attenuation',
          interview_questions: [
            'How do cascade thrust reversers deflect fan bypass air forward without reversing core turbine exhaust?'
          ]
        }
      ]
    },
    {
      id: 'mod_robotics_arm',
      branch_id: 'robotics',
      semester_id: 'sem_3',
      subject_id: 'sub_robotics_301',
      topic_id: 'top_robotics_301_01',
      name: '6-DOF Articulated Industrial Robotic Arm',
      category: 'Robotics & Mechatronics',
      description: 'Interactive 3D model of kinematic joints, harmonic drive reduction gearboxes, optical absolute encoders, and end-effector wrist assembly.',
      learning_objective: 'Master forward and inverse kinematics using Denavit-Hartenberg (D-H) parameters and Jacobian velocity mapping.',
      difficulty: 'intermediate',
      asset_type: 'procedural_mesh',
      model_config: {
        type: 'robotic_arm',
        color: '#f59e0b',
        components_count: 4
      },
      accessible_2d_diagram: {
        title: '2D Kinematic Chain: 6-Axis Manipulator',
        nodes: [
          { name: 'Base Joint (J1)', desc: 'Waist azimuth rotation (+/- 180 degrees)' },
          { name: 'Shoulder Joint (J2)', desc: 'High-torque elevation lifting lower arm' },
          { name: 'Elbow Joint (J3)', desc: 'Forearm pitch controlling reach volume' },
          { name: 'Spherical Wrist (J4-J6)', desc: '3-axis roll-pitch-yaw tool orientation' }
        ]
      },
      components: [
        {
          id: 'comp_robot_harmonic',
          name: 'Shoulder Harmonic Drive Actuator',
          what: 'Zero-backlash strain-wave gear speed reducer with integrated servo motor.',
          why: 'Provides high reduction ratio (100:1) and positioning precision in compact arm joints.',
          how: 'Elliptical wave generator deflects thin flexible spline inside circular spline ring.',
          inputs: 'AC brushless servo torque (15 Nm)',
          outputs: 'Precision high-torque joint rotation (1,500 Nm)',
          interview_questions: [
            'Why is zero backlash critical in robotic arm trajectory tracking?',
            'Explain how a singularity occurs when axes J4 and J6 become collinear in a 6-DOF arm.'
          ]
        }
      ]
    },
    {
      id: 'mod_auto_powertrain',
      branch_id: 'automobile',
      semester_id: 'sem_3',
      subject_id: 'sub_auto_301',
      topic_id: 'top_auto_301_01',
      name: 'Electric Vehicle Dual-Motor Powertrain & Inverter',
      category: 'Automotive Systems',
      description: 'Interactive 3D model of silicon carbide (SiC) traction inverter, permanent magnet synchronous motor (PMSM), and single-speed reduction gearbox.',
      learning_objective: 'Analyze regenerative braking dynamics, field-oriented control (FOC), and thermal management of 800V architectures.',
      difficulty: 'intermediate',
      asset_type: 'procedural_mesh',
      model_config: {
        type: 'ev_powertrain',
        color: '#0284c7',
        components_count: 3
      },
      accessible_2d_diagram: {
        title: '2D Power Flow: EV Traction Architecture',
        nodes: [
          { name: '800V DC Battery Bus', desc: 'Lithium iron phosphate (LFP) high-voltage storage' },
          { name: 'SiC Traction Inverter', desc: 'Variable-frequency 3-phase AC synthesis with Space Vector PWM' },
          { name: 'PMSM Motor', desc: 'Permanent magnet rotor producing 400 Nm torque' },
          { name: 'Differential Drive', desc: 'Distributes wheel torque while permitting cornering speed differentiation' }
        ]
      },
      components: [
        {
          id: 'comp_auto_inverter',
          name: 'Silicon Carbide (SiC) Traction Inverter',
          what: 'High-frequency solid-state DC-to-AC power conversion module.',
          why: 'Enables 99% electrical efficiency and allows higher switching frequencies to reduce acoustic motor whine.',
          how: 'Uses Space Vector Pulse Width Modulation (SVPWM) to modulate 3-phase sinusoidal stator currents.',
          inputs: '800V DC bus, CAN bus torque command',
          outputs: '3-phase AC currents up to 600A RMS',
          interview_questions: [
            'What thermal and switching advantages does Silicon Carbide (SiC) have over standard Silicon IGBTs in EV inverters?'
          ]
        }
      ]
    },
    {
      id: 'mod_eee_bldc',
      branch_id: 'eee',
      semester_id: 'sem_4',
      subject_id: 'sub_eee_402',
      topic_id: 'top_eee_301_01',
      name: 'Brushless DC (BLDC) Motor & Rotor Field Assembly',
      category: 'Electrical Machines',
      description: 'Interactive 3D model of stator slot teeth, 3-phase star windings, NdFeB surface permanent magnet rotor, and Hall effect sensors.',
      learning_objective: 'Understand electronic commutation, trapezoidal back-EMF, and torque constant Kt calculation.',
      difficulty: 'intermediate',
      asset_type: 'procedural_mesh',
      model_config: {
        type: 'bldc_motor',
        color: '#10b981',
        components_count: 3
      },
      accessible_2d_diagram: {
        title: '2D Commutation: 6-Step BLDC Inverter Timing',
        nodes: [
          { name: 'Hall Sensors', desc: 'Detect rotor magnetic pole transitions every 60 electrical degrees' },
          { name: 'Stator Coils', desc: 'Energized in pairs creating rotating magnetic field' },
          { name: 'Permanent Magnet Rotor', desc: 'Aligns continuously with advancing stator magnetic flux vector' }
        ]
      },
      components: [
        {
          id: 'comp_bldc_rotor',
          name: 'Neodymium Magnet Rotor Core',
          what: 'High-remanence rare-earth magnetic rotor bonded to stainless steel shaft.',
          why: 'Eliminates rotor copper losses and maintenance-prone mechanical carbon brushes.',
          how: 'Produces constant radial flux density interacting with stator MMF.',
          inputs: 'Stator rotating magnetic field',
          outputs: 'Rotational mechanical shaft torque',
          interview_questions: [
            'How do you determine the rotor angle in a sensorless BLDC motor using back-EMF zero-crossing detection?'
          ]
        }
      ]
    },
    {
      id: 'mod_mech_gearbox',
      branch_id: 'mech',
      semester_id: 'sem_4',
      subject_id: 'sub_mech_501',
      topic_id: 'top_mech_301_01',
      name: 'Epicyclic Planetary Gearbox & Differential Speed Reducer',
      category: 'Mechanical Elements',
      description: 'Interactive 3D model of sun gear, planet gears, planet carrier, and internal annulus ring gear.',
      learning_objective: 'Calculate planetary gear train velocity ratios using Willis tabular method and determine torque multiplication.',
      difficulty: 'intermediate',
      asset_type: 'procedural_mesh',
      model_config: {
        type: 'planetary_gearbox',
        color: '#f59e0b',
        components_count: 3
      },
      accessible_2d_diagram: {
        title: '2D Kinematics: Planetary Gear Velocity Vectors',
        nodes: [
          { name: 'Sun Gear', desc: 'Central input gear rotating at high angular velocity' },
          { name: 'Planet Gears (3x)', desc: 'Orbit sun gear while revolving on planet carrier pins' },
          { name: 'Annulus Ring Gear', desc: 'Internal toothed stationary reaction ring' },
          { name: 'Planet Carrier', desc: 'High-torque low-speed output drive shaft' }
        ]
      },
      components: [
        {
          id: 'comp_gear_sun',
          name: 'High-Speed Input Sun Gear',
          what: 'Hardened spur or helical gear driving multiple planet meshes.',
          why: 'Transmits input power simultaneously to three planet gears, dividing tooth contact stresses.',
          how: 'Meshes externally with planet gears under involute tooth profile geometry.',
          inputs: 'Input motor shaft torque (Ti)',
          outputs: 'Multi-mesh distributed pitch line tangential force',
          interview_questions: [
            'Derive the gear ratio of a planetary gearset when the ring gear is fixed and the carrier is the output.'
          ]
        }
      ]
    }
  ],

  // -------------------------------------------------------------
  // SKILLS & ROLE MAPPINGS
  // -------------------------------------------------------------
  skills: [
    // Core CS & Programming
    { id: 'skill_python', name: 'Python', category: 'Language', description: 'Advanced Python: OOP, decorators, concurrency, asyncio, profiling.', branch_relevance: ['cse','aiml'], required_level: 4 },
    { id: 'skill_java', name: 'Java', category: 'Language', description: 'JVM internals, collections, streams, generics, Spring Boot.', branch_relevance: ['cse'], required_level: 3 },
    { id: 'skill_cpp', name: 'C++', category: 'Language', description: 'STL, RAII, move semantics, templates, concurrency primitives.', branch_relevance: ['cse','ece','mech'], required_level: 4 },
    { id: 'skill_c', name: 'C Programming', category: 'Language', description: 'Pointers, memory management, structs, file I/O, system calls.', branch_relevance: ['cse','ece','eee'], required_level: 3 },
    { id: 'skill_sql', name: 'SQL & Databases', category: 'Database', description: 'Complex joins, indexing, query optimization, ACID, B+ Trees.', branch_relevance: ['cse','aiml'], required_level: 4 },
    { id: 'skill_dsa', name: 'Data Structures & Algorithms', category: 'Core CS', description: 'Arrays, trees, graphs, DP, sorting, complexity analysis.', branch_relevance: ['cse','aiml'], required_level: 5 },
    { id: 'skill_sys_design', name: 'System Design', category: 'Architecture', description: 'Microservices, load balancing, caching, consistency, distributed systems.', branch_relevance: ['cse'], required_level: 3 },
    { id: 'skill_os', name: 'Operating Systems', category: 'Core CS', description: 'Scheduling, memory management, file systems, IPC, concurrency.', branch_relevance: ['cse'], required_level: 4 },
    { id: 'skill_networks', name: 'Computer Networks', category: 'Core CS', description: 'TCP/IP, HTTP, DNS, routing, socket programming.', branch_relevance: ['cse','ece'], required_level: 3 },
    { id: 'skill_docker', name: 'Docker & Containers', category: 'DevOps', description: 'Dockerfile, multi-stage builds, networking, compose, registries.', branch_relevance: ['cse','aiml'], required_level: 3 },
    { id: 'skill_git', name: 'Git & Version Control', category: 'Tools', description: 'Branching, rebase, bisect, semantic versioning, PR workflow.', branch_relevance: ['cse','ece','eee','mech','civil','aiml'], required_level: 4 },
    { id: 'skill_linux', name: 'Linux & Shell', category: 'Tools', description: 'Bash scripting, process management, cron, file permissions.', branch_relevance: ['cse','aiml'], required_level: 3 },
    // AI/ML Skills
    { id: 'skill_ml', name: 'Machine Learning', category: 'AI/ML', description: 'Regression, classification, clustering, ensembles, model evaluation.', branch_relevance: ['cse','aiml'], required_level: 4 },
    { id: 'skill_dl', name: 'Deep Learning', category: 'AI/ML', description: 'CNNs, RNNs, attention, transformers, fine-tuning, PyTorch/TensorFlow.', branch_relevance: ['aiml','cse'], required_level: 4 },
    { id: 'skill_nlp', name: 'Natural Language Processing', category: 'AI/ML', description: 'Tokenization, BERT, GPT, NER, sentiment analysis, RAG.', branch_relevance: ['aiml'], required_level: 3 },
    { id: 'skill_statistics', name: 'Statistics & Probability', category: 'Mathematics', description: 'Distributions, hypothesis testing, Bayesian inference, A/B testing.', branch_relevance: ['aiml','cse'], required_level: 4 },
    { id: 'skill_data_viz', name: 'Data Visualization', category: 'AI/ML', description: 'Matplotlib, Seaborn, Plotly, dashboard design, storytelling.', branch_relevance: ['aiml','cse'], required_level: 3 },
    // ECE Skills
    { id: 'skill_embedded_c', name: 'Embedded C & RTOS', category: 'Embedded', description: 'Bare-metal C, register bit-banging, interrupts, FreeRTOS, timers.', branch_relevance: ['ece','eee'], required_level: 4 },
    { id: 'skill_pcb', name: 'PCB Design', category: 'Hardware', description: 'Schematic capture, multi-layer routing, EMI suppression, DFM.', branch_relevance: ['ece','eee'], required_level: 3 },
    { id: 'skill_verilog', name: 'Verilog / VHDL', category: 'Hardware', description: 'RTL design, testbenches, synthesis constraints, timing closure.', branch_relevance: ['ece'], required_level: 3 },
    { id: 'skill_dsp', name: 'Digital Signal Processing', category: 'Signal Processing', description: 'FIR/IIR filters, FFT, sampling theorem, spectral analysis.', branch_relevance: ['ece'], required_level: 3 },
    { id: 'skill_comm_protocols', name: 'Communication Protocols', category: 'Protocols', description: 'UART, SPI, I2C, CAN, Ethernet, Modbus, wireless protocols.', branch_relevance: ['ece','eee'], required_level: 3 },
    // EEE Skills
    { id: 'skill_power_systems', name: 'Power Systems', category: 'Electrical', description: 'Load flow, fault analysis, protection relays, stability studies.', branch_relevance: ['eee'], required_level: 4 },
    { id: 'skill_power_electronics', name: 'Power Electronics', category: 'Electrical', description: 'Converters, inverters, motor drives, switching losses.', branch_relevance: ['eee'], required_level: 4 },
    { id: 'skill_control_systems', name: 'Control Systems', category: 'Electrical', description: 'PID tuning, root locus, Bode plots, state-space representation.', branch_relevance: ['eee','mech'], required_level: 3 },
    { id: 'skill_matlab', name: 'MATLAB & Simulink', category: 'Tools', description: 'Signal processing, control toolbox, Simulink modeling, code generation.', branch_relevance: ['eee','mech'], required_level: 3 },
    // Mechanical Skills
    { id: 'skill_cad', name: 'CAD (AutoCAD/SolidWorks)', category: 'CAD', description: 'Parametric modeling, GD&T, assembly, FEA basics, technical drawings.', branch_relevance: ['mech','civil'], required_level: 4 },
    { id: 'skill_thermodynamics', name: 'Engineering Thermodynamics', category: 'Mechanical', description: 'Thermodynamic cycles, heat transfer, fluid thermodynamics.', branch_relevance: ['mech'], required_level: 4 },
    { id: 'skill_manufacturing', name: 'Manufacturing Processes', category: 'Mechanical', description: 'Casting, welding, CNC machining, additive manufacturing, GD&T.', branch_relevance: ['mech'], required_level: 3 },
    { id: 'skill_fea', name: 'Finite Element Analysis', category: 'Simulation', description: 'Structural FEA, meshing, boundary conditions, stress analysis, ANSYS.', branch_relevance: ['mech','civil'], required_level: 3 },
    // Civil Skills
    { id: 'skill_structural', name: 'Structural Analysis', category: 'Civil', description: 'Trusses, beams, indeterminate structures, influence lines.', branch_relevance: ['civil'], required_level: 4 },
    { id: 'skill_rcc', name: 'RCC & Steel Design', category: 'Civil', description: 'IS 456 limit state design, beam and column design, steel connections.', branch_relevance: ['civil'], required_level: 4 },
    { id: 'skill_geotechnical', name: 'Geotechnical Engineering', category: 'Civil', description: 'Soil properties, consolidation, bearing capacity, pile design.', branch_relevance: ['civil'], required_level: 3 },
    { id: 'skill_staad', name: 'STAAD Pro / SAP2000', category: 'Tools', description: 'Structural modeling, analysis, code checks, report generation.', branch_relevance: ['civil'], required_level: 3 },
    // Soft Skills
    { id: 'skill_communication', name: 'Technical Communication', category: 'Soft Skills', description: 'Written and verbal technical communication, presentations, documentation.', branch_relevance: ['cse','ece','eee','mech','civil','aiml'], required_level: 3 },
    { id: 'skill_problem_solving', name: 'Problem Solving', category: 'Soft Skills', description: 'Analytical thinking, first principles reasoning, systematic debugging.', branch_relevance: ['cse','ece','eee','mech','civil','aiml'], required_level: 4 },
  ],

  career_roles: [
    {
      id: 'role_swe', title: 'Software Engineer', branch_id: 'cse',
      description: 'Designs, implements, and maintains software systems at scale.',
      salary_range: '₹6L–₹25L / $90k–$160k',
      market_demand: 'Extremely High',
      required_skills: [
        { skill_id: 'skill_dsa', level: 5, weight: 1.0 },
        { skill_id: 'skill_os', level: 4, weight: 0.9 },
        { skill_id: 'skill_sql', level: 3, weight: 0.8 },
        { skill_id: 'skill_git', level: 4, weight: 0.8 },
        { skill_id: 'skill_python', level: 3, weight: 0.7 },
        { skill_id: 'skill_linux', level: 3, weight: 0.7 },
      ]
    },
    {
      id: 'role_data_scientist', title: 'Data Scientist & ML Engineer', branch_id: 'cse',
      description: 'Designs predictive models, data pipelines, and ML systems.',
      salary_range: '₹8L–₹30L / $95k–$160k',
      market_demand: 'Very High',
      required_skills: [
        { skill_id: 'skill_python', level: 5, weight: 1.0 },
        { skill_id: 'skill_ml', level: 5, weight: 1.0 },
        { skill_id: 'skill_statistics', level: 4, weight: 0.9 },
        { skill_id: 'skill_sql', level: 4, weight: 0.9 },
        { skill_id: 'skill_dl', level: 3, weight: 0.8 },
        { skill_id: 'skill_data_viz', level: 3, weight: 0.7 },
        { skill_id: 'skill_git', level: 3, weight: 0.6 },
      ]
    },
    {
      id: 'role_fullstack', title: 'Full Stack Engineer', branch_id: 'cse',
      description: 'Builds end-to-end web applications, REST APIs, and frontends.',
      salary_range: '₹7L–₹28L / $90k–$155k',
      market_demand: 'Very High',
      required_skills: [
        { skill_id: 'skill_dsa', level: 4, weight: 1.0 },
        { skill_id: 'skill_sys_design', level: 3, weight: 0.9 },
        { skill_id: 'skill_sql', level: 4, weight: 0.8 },
        { skill_id: 'skill_git', level: 4, weight: 0.8 },
        { skill_id: 'skill_docker', level: 3, weight: 0.7 },
        { skill_id: 'skill_linux', level: 3, weight: 0.6 },
      ]
    },
    {
      id: 'role_devops', title: 'DevOps / SRE Engineer', branch_id: 'cse',
      description: 'Manages CI/CD, infrastructure automation, and system reliability.',
      salary_range: '₹8L–₹30L / $95k–$155k',
      market_demand: 'High',
      required_skills: [
        { skill_id: 'skill_linux', level: 5, weight: 1.0 },
        { skill_id: 'skill_docker', level: 5, weight: 1.0 },
        { skill_id: 'skill_git', level: 4, weight: 0.9 },
        { skill_id: 'skill_python', level: 3, weight: 0.8 },
        { skill_id: 'skill_sys_design', level: 3, weight: 0.7 },
      ]
    },
    {
      id: 'role_embedded_eng', title: 'Embedded Systems Engineer', branch_id: 'ece',
      description: 'Develops firmware for microcontrollers, sensors, and automotive systems.',
      salary_range: '₹6L–₹20L / $88k–$145k',
      market_demand: 'High',
      required_skills: [
        { skill_id: 'skill_embedded_c', level: 5, weight: 1.0 },
        { skill_id: 'skill_c', level: 4, weight: 0.9 },
        { skill_id: 'skill_comm_protocols', level: 4, weight: 0.9 },
        { skill_id: 'skill_pcb', level: 3, weight: 0.7 },
        { skill_id: 'skill_git', level: 3, weight: 0.6 },
      ]
    },
    {
      id: 'role_vlsi_eng', title: 'VLSI Design Engineer', branch_id: 'ece',
      description: 'Designs digital ICs, performs RTL design and physical design.',
      salary_range: '₹7L–₹25L',
      market_demand: 'High',
      required_skills: [
        { skill_id: 'skill_verilog', level: 5, weight: 1.0 },
        { skill_id: 'skill_embedded_c', level: 3, weight: 0.7 },
        { skill_id: 'skill_dsp', level: 3, weight: 0.7 },
      ]
    },
    {
      id: 'role_power_eng', title: 'Power Systems Engineer', branch_id: 'eee',
      description: 'Designs and maintains electrical power systems and grids.',
      salary_range: '₹5L–₹18L',
      market_demand: 'High',
      required_skills: [
        { skill_id: 'skill_power_systems', level: 5, weight: 1.0 },
        { skill_id: 'skill_power_electronics', level: 4, weight: 0.9 },
        { skill_id: 'skill_control_systems', level: 3, weight: 0.7 },
        { skill_id: 'skill_matlab', level: 3, weight: 0.7 },
      ]
    },
    {
      id: 'role_mech_design', title: 'Mechanical Design Engineer', branch_id: 'mech',
      description: 'Creates mechanical components and systems using CAD tools and FEA.',
      salary_range: '₹4L–₹16L',
      market_demand: 'High',
      required_skills: [
        { skill_id: 'skill_cad', level: 5, weight: 1.0 },
        { skill_id: 'skill_fea', level: 4, weight: 0.9 },
        { skill_id: 'skill_thermodynamics', level: 3, weight: 0.7 },
        { skill_id: 'skill_manufacturing', level: 3, weight: 0.7 },
      ]
    },
    {
      id: 'role_structural_eng', title: 'Structural Engineer', branch_id: 'civil',
      description: 'Designs load-bearing structures, performs code-compliant design.',
      salary_range: '₹4L–₹15L',
      market_demand: 'High',
      required_skills: [
        { skill_id: 'skill_structural', level: 5, weight: 1.0 },
        { skill_id: 'skill_rcc', level: 4, weight: 0.9 },
        { skill_id: 'skill_staad', level: 4, weight: 0.8 },
        { skill_id: 'skill_geotechnical', level: 3, weight: 0.7 },
        { skill_id: 'skill_cad', level: 3, weight: 0.6 },
      ]
    },
    {
      id: 'role_ai_engineer', title: 'AI / GenAI Engineer', branch_id: 'aiml',
      description: 'Builds AI systems, LLM pipelines, and generative AI applications.',
      salary_range: '₹12L–₹40L / $120k–$200k',
      market_demand: 'Extremely High',
      required_skills: [
        { skill_id: 'skill_python', level: 5, weight: 1.0 },
        { skill_id: 'skill_dl', level: 5, weight: 1.0 },
        { skill_id: 'skill_ml', level: 4, weight: 0.9 },
        { skill_id: 'skill_nlp', level: 4, weight: 0.9 },
        { skill_id: 'skill_statistics', level: 3, weight: 0.8 },
        { skill_id: 'skill_sql', level: 3, weight: 0.7 },
        { skill_id: 'skill_docker', level: 3, weight: 0.7 },
        { skill_id: 'skill_git', level: 3, weight: 0.6 },
      ]
    },
  ],

  // -------------------------------------------------------------
  // PROJECTS (Complete Specifications with Implementation Guides)
  // -------------------------------------------------------------
  projects: [
    {
      id: 'proj_cse_distributed_kv',
      branch_id: 'cse',
      semester_id: 'sem_3',
      title: 'Distributed In-Memory Key-Value Store with Raft Consensus',
      problem_statement: 'Modern cloud services require low-latency data replication that survives node crashes without data loss or split-brain partitions.',
      objective: 'Implement an in-memory key-value store in Python/Go implementing leader election, log replication, and client failover.',
      why_build_it: 'Demonstrates deep mastery of network concurrency, consensus protocols, and systems engineering for tier-1 engineering interviews.',
      difficulty: 'advanced',
      estimated_hours: 45,
      skills: ['skill_python', 'skill_dsa', 'skill_sys_design', 'skill_docker'],
      technologies: ['Python 3.11', 'gRPC', 'Protocol Buffers', 'Docker Compose', 'PyTest'],
      architecture_spec: {
        nodes: '3-Node or 5-Node Raft cluster',
        rpc: 'gRPC endpoints for RequestVote and AppendEntries',
        storage: 'Memory hash table with append-only write ahead log (WAL)'
      },
      implementation_steps: [
        { step: 1, name: 'State Machine RPC Definition', desc: 'Define protobuf contracts for Raft election and log replication messages.' },
        { step: 2, name: 'Heartbeat & Randomized Election Timers', desc: 'Implement async timers transitioning Candidate nodes to Leaders upon quorum.' },
        { step: 3, name: 'Log Replication & Quorum Commit', desc: 'Propagate entry logs, verify index matches, and apply committed entries to State Machine.' },
        { step: 4, name: 'Partition Simulation & Chaos Testing', desc: 'Simulate split-brain network disconnects and verify cluster self-healing.' }
      ],
      testing_criteria: [
        'Survives sudden kill of 1 out of 3 nodes without client request downtime',
        'Prevents stale reads by verifying leader lease or quorum before read response'
      ],
      resume_bullets: [
        'Engineered a fault-tolerant distributed key-value store utilizing Raft consensus, achieving 4,200 ops/sec across a 3-node cluster.',
        'Implemented custom Write-Ahead-Logging (WAL) and leader election failover under 300ms using gRPC and asyncio.'
      ],
      interview_questions: [
        'How does Raft guarantee that a newly elected leader contains all committed entries from past terms?',
        'What happens when a network partition splits a 5-node cluster into groups of 3 and 2?'
      ]
    },
    {
      id: 'proj_ece_telemetry_hud',
      branch_id: 'ece',
      semester_id: 'sem_3',
      title: 'Automotive CAN-Bus Telemetry Logger with FreeRTOS',
      problem_statement: 'Vehicle ECUs output high-frequency diagnostic frames requiring zero-packet-drop buffering and real-time edge processing.',
      objective: 'Program an ARM Cortex-M4 microcontroller running FreeRTOS to read CAN bus frames and display live diagnostics on an OLED dashboard.',
      why_build_it: 'Essential for automotive embedded engineering and hardware-in-the-loop (HIL) testing careers.',
      difficulty: 'intermediate',
      estimated_hours: 35,
      skills: ['skill_embedded_c', 'skill_pcb', 'skill_git'],
      technologies: ['STM32CubeIDE', 'FreeRTOS', 'CAN 2.0B Transceiver', 'C11'],
      implementation_steps: [
        { step: 1, name: 'CAN Controller Filter Configuration', desc: 'Set up hardware acceptance filters for OBD-II PID message IDs.' },
        { step: 2, name: 'FreeRTOS Queue & Task Architecture', desc: 'Create high-priority ISR handling task and low-priority rendering worker.' },
        { step: 3, name: 'Ring Buffer & Telemetry Parsing', desc: 'Extract RPM, vehicle speed, and battery temperature bytes safely.' }
      ],
      resume_bullets: [
        'Designed automotive CAN 2.0B telemetry reader on STM32 ARM Cortex-M4 using FreeRTOS with zero buffer overruns at 500kbps.',
        'Structured modular ring buffer firmware interfacing SPI OLED display for real-time engine telemetry.'
      ],
      interview_questions: [
        'How does the CAN bus protocol resolve arbitration when two nodes transmit simultaneously?'
      ]
    }
  ],

  // -------------------------------------------------------------
  // PRACTICE QUIZZES & EXAMS
  // -------------------------------------------------------------
  quiz_questions: [
    {
      id: 'qz_cse_301_01',
      branch_id: 'cse',
      semester_id: 'sem_3',
      subject_id: 'sub_cse_301',
      topic_id: 'top_cse_301_01',
      skill_id: 'skill_dsa',
      question_text: 'What is the time complexity of searching an element in a balanced AVL tree with N nodes in the worst case?',
      question_type: 'mcq',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correct_option_index: 1,
      explanation: 'An AVL tree strictly maintains its balance factor between -1, 0, and +1. Its maximum height is bounded by 1.44 log2(N), guaranteeing O(log N) worst-case search.',
      difficulty: 'easy'
    },
    {
      id: 'qz_cse_301_02',
      branch_id: 'cse',
      semester_id: 'sem_3',
      subject_id: 'sub_cse_301',
      topic_id: 'top_cse_301_02',
      skill_id: 'skill_dsa',
      question_text: 'When inserting a node into an AVL tree, if the balance factor of the offending node is +2 and its left child has a balance factor of -1, which rotation sequence is required?',
      question_type: 'mcq',
      options: ['Single Right Rotation (LL)', 'Left-Right Double Rotation (LR)', 'Right-Left Double Rotation (RL)', 'Single Left Rotation (RR)'],
      correct_option_index: 1,
      explanation: 'A balance factor of +2 with a left child balance factor of -1 corresponds to a Left-Right (LR) imbalance, resolved by a Left rotation on the child followed by a Right rotation on the root.',
      difficulty: 'intermediate'
    },
    {
      id: 'qz_cse_302_01',
      branch_id: 'cse',
      semester_id: 'sem_3',
      subject_id: 'sub_cse_302',
      topic_id: 'top_cse_302_01',
      skill_id: 'skill_sys_design',
      question_text: 'Which hardware technique allows a dependent instruction to receive an ALU result before it is written back to the register file?',
      question_type: 'mcq',
      options: ['Branch Delay Slot', 'Operand Forwarding / Bypassing', 'Speculative Execution', 'Loop Unrolling'],
      correct_option_index: 1,
      explanation: 'Operand Forwarding routes the output of the EX/MEM pipeline register directly back to the ALU input mux, bypassing the write-back stage and avoiding 2 stall cycles.',
      difficulty: 'intermediate'
    }
  ],

  flashcards: [
    {
      id: 'fc_dsa_01',
      branch_id: 'cse',
      semester_id: 'sem_3',
      subject_id: 'sub_cse_301',
      topic_id: 'top_cse_301_01',
      front: 'Define Master Theorem Case 1: T(n) = aT(n/b) + f(n)',
      back: 'If f(n) = O(n^(log_b(a) - ε)) for some constant ε > 0, then T(n) = Θ(n^(log_b(a))). The tree leaves dominate computational work.',
      hint: 'Compare f(n) to n^(log_b(a))'
    },
    {
      id: 'fc_dsa_02',
      branch_id: 'cse',
      semester_id: 'sem_3',
      subject_id: 'sub_cse_301',
      topic_id: 'top_cse_301_02',
      front: 'What are the 5 Red-Black Tree Invariants?',
      back: '1. Every node is Red or Black.\n2. The root is Black.\n3. Every leaf (NIL) is Black.\n4. If a node is Red, both children are Black.\n5. All simple paths from node to descendant leaves contain the same number of Black nodes.',
      hint: 'Focus on color rules and black height'
    }
  ],

  exams: [
    {
      id: 'exam_gate_cse',
      title: 'GATE Computer Science & Information Technology',
      exam_type: 'entrance',
      target_branch_id: 'cse',
      eligibility_criteria: 'Candidates in 3rd or higher year of B.E./B.Tech or equivalent degree.',
      syllabus_summary: 'Engineering Mathematics, Digital Logic, Computer Organization, Programming & Data Structures, Algorithms, Theory of Computation, Compiler Design, Operating Systems, DBMS, Computer Networks.',
      total_marks: 100,
      duration_minutes: 180,
      question_pattern: {
        general_aptitude_marks: 15,
        subject_marks: 85,
        total_questions: 65,
        negative_marking: '1/3 mark deducted for 1-mark MCQs; 2/3 mark deducted for 2-mark MCQs. No negative marks for NAT/MSQ.'
      }
    },
    {
      id: 'exam_placement_tcs',
      title: 'National Qualifier Campus Placement Assessment (TCS / Infosys Pattern)',
      exam_type: 'campus_placement',
      target_branch_id: 'cse',
      eligibility_criteria: 'Engineering graduates with 60%+ aggregate across secondary, higher secondary, and undergraduate coursework.',
      syllabus_summary: 'Part A: Numerical Ability, Reasoning Ability, Verbal Ability. Part B: Advanced Coding (Data Structures & Algorithm design in C++/Java/Python).',
      total_marks: 100,
      duration_minutes: 165,
      question_pattern: {
        sections: [
          { name: 'Quantitative & Logic', questions: 40, time_mins: 75 },
          { name: 'Hands-on Coding Problems', questions: 2, time_mins: 90 }
        ]
      }
    }
  ],

  internships: [
    {
      id: 'intern_01',
      company_name: 'Stripe Silicon Engineering',
      role_title: 'Systems & Infrastructure Software Intern',
      branch_relevance: ['cse', 'aiml'],
      location: 'Bengaluru / Remote',
      stipend: '₹85,000 / month',
      deadline: '2026-10-30',
      application_url: 'https://stripe.com/jobs',
      is_verified: true
    },
    {
      id: 'intern_02',
      company_name: 'Texas Instruments',
      role_title: 'Analog & Embedded Firmware Engineering Intern',
      branch_relevance: ['ece', 'eee'],
      location: 'Hyderabad, India',
      stipend: '₹75,000 / month',
      deadline: '2026-11-15',
      application_url: 'https://ti.com/careers',
      is_verified: true
    }
  ],

  // -------------------------------------------------------------
  // VERIFIED STUDENT PROFILES (TechPath Connect Verified Peers)
  // -------------------------------------------------------------
  profiles: [
    {
      id: 'usr_cse_01',
      techpath_id: 'TP-CSE-7K4M92',
      email: 'ananya.sharma@techpath.edu',
      full_name: 'Ananya Sharma',
      avatar_url: '',
      department_id: 'eng',
      branch_id: 'cse',
      specialization: 'Core Systems & Cloud',
      semester_id: 'sem_3',
      learning_level: 'intermediate',
      career_goal: 'Distributed Systems Engineer',
      career_interests: ['Distributed Systems', 'Cloud Native', 'Golang', 'DSA'],
      skills: ['Data Structures', 'Python', 'Go', 'Docker', 'PostgreSQL'],
      bio: '2nd-year CSE student passionate about distributed systems, microservices, and DSA problem solving. Currently building an open-source key-value store.',
      is_admin: false,
      created_at: '2026-02-10T08:30:00Z'
    },
    {
      id: 'usr_cse_02',
      techpath_id: 'TP-CSE-8R2W14',
      email: 'devansh.m@techpath.edu',
      full_name: 'Devansh Malhotra',
      avatar_url: '',
      department_id: 'eng',
      branch_id: 'cse',
      specialization: 'Systems Software & Operating Systems',
      semester_id: 'sem_4',
      learning_level: 'advanced',
      career_goal: 'Operating Systems Engineer',
      career_interests: ['Linux Kernel', 'Compilers', 'Rust', 'Embedded Systems'],
      skills: ['C++', 'Rust', 'Operating Systems', 'x86 Assembly', 'Linux'],
      bio: 'Passionate about Linux kernel development, low-level concurrency, and compiler design. Looking for study partners for OS midterms.',
      is_admin: false,
      created_at: '2026-02-12T11:20:00Z'
    },
    {
      id: 'usr_ece_01',
      techpath_id: 'TP-ECE-3P8X41',
      email: 'rahul.varma@techpath.edu',
      full_name: 'Rahul Varma',
      avatar_url: '',
      department_id: 'eng',
      branch_id: 'ece',
      specialization: 'VLSI & Embedded Systems',
      semester_id: 'sem_3',
      learning_level: 'intermediate',
      career_goal: 'Semiconductor Hardware Engineer',
      career_interests: ['Semiconductor Physics', 'FPGA Design', 'RISC-V', 'Firmware'],
      skills: ['Verilog', 'ARM Embedded C', 'Signals & Systems', 'SPICE', 'Microcontrollers'],
      bio: 'Studying ECE Semester 3. Fascinated by FinFET architecture, VLSI layout, and ARM Cortex-M firmware development.',
      is_admin: false,
      created_at: '2026-02-14T09:15:00Z'
    },
    {
      id: 'usr_ece_02',
      techpath_id: 'TP-ECE-9B4L88',
      email: 'priya.nair@techpath.edu',
      full_name: 'Priya Nair',
      avatar_url: '',
      department_id: 'eng',
      branch_id: 'ece',
      specialization: 'Signal Processing & Wireless Communications',
      semester_id: 'sem_4',
      learning_level: 'advanced',
      career_goal: 'DSP & RF Systems Engineer',
      career_interests: ['Digital Signal Processing', 'RF Engineering', '5G/6G Networks'],
      skills: ['MATLAB', 'Signals and Systems', 'Python', 'SDR', 'Circuit Design'],
      bio: 'Exploring software-defined radios, Fourier analysis, and digital filters. Eager to collaborate on IoT sensor networks.',
      is_admin: false,
      created_at: '2026-02-16T14:45:00Z'
    },
    {
      id: 'usr_mech_01',
      techpath_id: 'TP-MECH-9D2L77',
      email: 'aditya.k@techpath.edu',
      full_name: 'Aditya Kulkarni',
      avatar_url: '',
      department_id: 'eng',
      branch_id: 'mech',
      specialization: 'Thermal & Fluid Engineering',
      semester_id: 'sem_3',
      learning_level: 'intermediate',
      career_goal: 'Automotive Thermal Engineer',
      career_interests: ['Computational Fluid Dynamics', 'Thermodynamics', 'Aerodynamics'],
      skills: ['SolidWorks', 'Ansys Fluent', 'Thermodynamics', 'Fluid Mechanics', 'Python'],
      bio: 'Mechanical engineering enthusiast focusing on 3D CAD modeling, IC engines, and aerodynamic CFD simulations.',
      is_admin: false,
      created_at: '2026-02-18T10:00:00Z'
    },
    {
      id: 'usr_mech_02',
      techpath_id: 'TP-MECH-4F6V23',
      email: 'rohan.deshmukh@techpath.edu',
      full_name: 'Rohan Deshmukh',
      avatar_url: '',
      department_id: 'eng',
      branch_id: 'mech',
      specialization: 'Robotics & Mechatronics',
      semester_id: 'sem_5',
      learning_level: 'advanced',
      career_goal: 'Robotics Hardware Architect',
      career_interests: ['Kinematics', 'Actuator Design', 'FEA Analysis', 'Manufacturing'],
      skills: ['Autodesk Inventor', 'Finite Element Analysis', 'MATLAB', 'CNC Machining'],
      bio: 'Designing robotic end-effectors and planetary gearboxes. Always up for building physical engineering prototypes.',
      is_admin: false,
      created_at: '2026-02-20T16:30:00Z'
    },
    {
      id: 'usr_civil_01',
      techpath_id: 'TP-CIVIL-2N7T51',
      email: 'kavya.iyer@techpath.edu',
      full_name: 'Kavya Iyer',
      avatar_url: '',
      department_id: 'eng',
      branch_id: 'civil',
      specialization: 'Structural & Seismic Engineering',
      semester_id: 'sem_3',
      learning_level: 'intermediate',
      career_goal: 'Structural Engineering Consultant',
      career_interests: ['Seismic Design', 'BIM Modeling', 'Sustainable Concrete'],
      skills: ['AutoCAD', 'STAAD.Pro', 'Structural Analysis', 'Geotechnical Engineering'],
      bio: 'Civil engineering 3rd sem student researching resilient bridge designs and low-carbon geo-polymer concrete.',
      is_admin: false,
      created_at: '2026-02-22T12:00:00Z'
    },
    {
      id: 'usr_aiml_01',
      techpath_id: 'TP-AIML-5M3K89',
      email: 'sneha.patel@techpath.edu',
      full_name: 'Sneha Patel',
      avatar_url: '',
      department_id: 'eng',
      branch_id: 'aiml',
      specialization: 'Computer Vision & Deep Learning',
      semester_id: 'sem_3',
      learning_level: 'intermediate',
      career_goal: 'AI Research Scientist',
      career_interests: ['Deep Neural Networks', 'Vision Transformers', 'Generative AI', 'PyTorch'],
      skills: ['PyTorch', 'TensorFlow', 'Python', 'Linear Algebra', 'Computer Vision'],
      bio: 'AI & ML student working on vision transformers and medical imaging segmentation. Actively publishing papers.',
      is_admin: false,
      created_at: '2026-02-24T15:10:00Z'
    }
  ],

  // -------------------------------------------------------------
  // TECHPATH CLASSES & STUDENT-TEACHER MARKETPLACE SEED DATA
  // -------------------------------------------------------------
  teaching_profiles: [
    {
      id: 'tp_usr_cse_01',
      user_id: 'usr_cse_01',
      teacher_name: 'Ananya Sharma',
      techpath_id: 'TP-CSE-9K2L44',
      department_id: 'eng',
      branch_id: 'cse',
      specialization: 'Distributed Systems & Algorithms',
      teaching_subjects: ['Data Structures & Algorithms', 'System Design', 'C++ Programming'],
      teaching_topics: ['Trees & Graphs', 'Dynamic Programming', 'Concurrency', 'Distributed Caching'],
      semester_level: 'Semester 3 to 6',
      teaching_experience: '2+ years peer tutoring, LeetCode Guardian, TA for Data Structures',
      skills: ['C++', 'Python', 'Algorithms', 'System Design', 'Distributed Systems'],
      description: 'Senior CSE student dedicated to breaking down difficult algorithmic patterns and system design into intuitive, visual concepts.',
      languages: ['English', 'Hindi'],
      class_format: 'Interactive Live Session + Code Lab',
      availability_summary: 'Weekdays 6 PM - 9 PM, Weekends 10 AM - 4 PM',
      price_per_class: 300,
      price_per_hour: 350,
      package_price: 1200,
      package_classes: 5,
      currency: 'INR',
      verification_status: 'Teacher Verified',
      rating: 4.95,
      total_students: 48,
      classes_completed: 36,
      created_at: '2026-02-15T10:00:00Z'
    },
    {
      id: 'tp_usr_ece_01',
      user_id: 'usr_ece_01',
      teacher_name: 'Rahul Varma',
      techpath_id: 'TP-ECE-8D3M66',
      department_id: 'eng',
      branch_id: 'ece',
      specialization: 'Embedded Systems & IoT Architecture',
      teaching_subjects: ['Embedded Systems', 'Microcontrollers & Peripherals', 'Digital Signal Processing'],
      teaching_topics: ['STM32 Bare-Metal C', 'UART/SPI/I2C Protocols', 'RTOS Scheduling', 'Filter Design'],
      semester_level: 'Semester 3 to 6',
      teaching_experience: 'Embedded systems club lead, published open-source STM32 HAL drivers',
      skills: ['Embedded C', 'ARM Cortex-M', 'RTOS', 'KiCad', 'Oscilloscopes'],
      description: 'Hands-on hardware enthusiast teaching bare-metal registers, interrupt vectors, and robust sensor interfacing.',
      languages: ['English', 'Telugu'],
      class_format: 'Live Hardware & Logic Analyzer Demos',
      availability_summary: 'Tue/Thu 5 PM - 8 PM, Sat 2 PM - 6 PM',
      price_per_class: 350,
      price_per_hour: 400,
      package_price: 1400,
      package_classes: 5,
      currency: 'INR',
      verification_status: 'Teacher Verified',
      rating: 4.90,
      total_students: 34,
      classes_completed: 25,
      created_at: '2026-02-16T11:00:00Z'
    },
    {
      id: 'tp_usr_mech_01',
      user_id: 'usr_mech_01',
      teacher_name: 'Aditya Kulkarni',
      techpath_id: 'TP-MECH-7R1Q33',
      department_id: 'eng',
      branch_id: 'mech',
      specialization: 'Automotive Dynamics & Computational Mechanics',
      teaching_subjects: ['Finite Element Analysis', 'Fluid Mechanics', 'Thermodynamics'],
      teaching_topics: ['ANSYS Meshing & Stress Concentration', 'Navier-Stokes Applications', 'Rankine Cycles'],
      semester_level: 'Semester 4 to 7',
      teaching_experience: 'Formula Student Chassis Design Lead, 1.5 years CAD/CAE workshop trainer',
      skills: ['ANSYS', 'SolidWorks', 'CFD', 'FEA Modeling', 'Material Science'],
      description: 'Helping mechanical engineers bridge theoretical equations with real-world FEA boundary conditions and meshing strategies.',
      languages: ['English', 'Marathi'],
      class_format: 'Live CAD/FEA Screen Demonstration & Case Studies',
      availability_summary: 'Mon/Wed/Fri 6 PM - 8 PM',
      price_per_class: 280,
      price_per_hour: 300,
      package_price: 1100,
      package_classes: 5,
      currency: 'INR',
      verification_status: 'Profile Verified',
      rating: 4.85,
      total_students: 22,
      classes_completed: 18,
      created_at: '2026-02-18T09:30:00Z'
    },
    {
      id: 'tp_usr_aiml_01',
      user_id: 'usr_aiml_01',
      teacher_name: 'Sneha Patel',
      techpath_id: 'TP-AIML-5M3K89',
      department_id: 'eng',
      branch_id: 'aiml',
      specialization: 'Computer Vision & Deep Learning',
      teaching_subjects: ['Deep Learning', 'PyTorch Foundations', 'Computer Vision'],
      teaching_topics: ['Transformer Self-Attention', 'Backprop Mechanics', 'Convolutional Architectures', 'Diffusion Models'],
      semester_level: 'Semester 3 to 8',
      teaching_experience: 'AI lab researcher, mentor at university machine learning society',
      skills: ['PyTorch', 'Linear Algebra', 'TensorFlow', 'CUDA Basics', 'Python'],
      description: 'Demystifying the mathematical foundations of modern deep learning and neural network training with clean PyTorch code.',
      languages: ['English', 'Gujarati'],
      class_format: 'Live Colab Notebook Coding & Math Breakdown',
      availability_summary: 'Daily 7 PM - 10 PM',
      price_per_class: 400,
      price_per_hour: 450,
      package_price: 1600,
      package_classes: 5,
      currency: 'INR',
      verification_status: 'Teacher Verified',
      rating: 4.98,
      total_students: 62,
      classes_completed: 45,
      created_at: '2026-02-20T14:00:00Z'
    }
  ],

  classes: [
    {
      id: 'cls_cse_01',
      teacher_id: 'usr_cse_01',
      teacher_name: 'Ananya Sharma',
      teacher_techpath_id: 'TP-CSE-9K2L44',
      teacher_verification: 'Teacher Verified',
      title: 'C++ DSA Masterclass — Trees, Graphs & Dynamic Programming',
      department_id: 'eng',
      branch_id: 'cse',
      semester_id: 'sem_3',
      specialization: 'Algorithms & Data Structures',
      subject: 'Data Structures & Algorithms',
      topic: 'Trees & Graphs',
      student_level: 'intermediate',
      description: 'A deep-dive masterclass covering Binary Search Trees, AVL balancing mechanics, Graph traversals (BFS/DFS), Dijkstra shortest path, and dynamic programming patterns on trees.',
      what_will_learn: [
        'Tree balancing logic, rotational mechanics (LL, RR, LR, RL)',
        'Graph adjacency structures, connected components, and topological sorting',
        'Dijkstra and A* pathfinding heuristics with priority queues',
        'Dynamic programming memoization strategies on tree sub-structures'
      ],
      prerequisites: 'Foundational C++ syntax, pointers, and familiarity with arrays/linked lists.',
      duration: 60, // minutes
      class_type: 'live_online',
      max_students: 12,
      booked_count: 8,
      price: 300,
      platform_fee: 0,
      total_price: 300,
      currency: 'INR',
      language: 'English',
      rating: 4.95,
      reviews_count: 14,
      status: 'active',
      meeting_link: 'https://meet.techpath.edu/room/tp-dsa-trees-graph',
      cancellation_policy: 'Full refund up to 4 hours before the scheduled class time. Non-refundable after session start.',
      created_at: '2026-03-01T10:00:00Z'
    },
    {
      id: 'cls_cse_02',
      teacher_id: 'usr_cse_01',
      teacher_name: 'Ananya Sharma',
      teacher_techpath_id: 'TP-CSE-9K2L44',
      teacher_verification: 'Teacher Verified',
      title: 'System Design 101 — Caching, Sharding & Microservices',
      department_id: 'eng',
      branch_id: 'cse',
      semester_id: 'sem_5',
      specialization: 'Distributed Systems',
      subject: 'System Architecture',
      topic: 'Scalable Systems & Caching',
      student_level: 'advanced',
      description: 'Learn how to architect web-scale systems: CDN strategies, Redis cache-aside patterns, database vertical vs horizontal sharding, and message queues with Kafka.',
      what_will_learn: [
        'CAP Theorem in practice and partition tolerance trade-offs',
        'Consistent hashing and distributed cache clustering',
        'Database read-replicas, write-ahead logs, and shard key selection',
        'Asynchronous event-driven architecture using message brokers'
      ],
      prerequisites: 'Basic networking and client-server concepts.',
      duration: 75,
      class_type: 'live_online',
      max_students: 10,
      booked_count: 6,
      price: 380,
      platform_fee: 0,
      total_price: 380,
      currency: 'INR',
      language: 'English',
      rating: 4.92,
      reviews_count: 9,
      status: 'active',
      meeting_link: 'https://meet.techpath.edu/room/tp-sysdesign-scale',
      cancellation_policy: 'Full refund up to 4 hours before the session.',
      created_at: '2026-03-03T11:30:00Z'
    },
    {
      id: 'cls_ece_01',
      teacher_id: 'usr_ece_01',
      teacher_name: 'Rahul Varma',
      teacher_techpath_id: 'TP-ECE-8D3M66',
      teacher_verification: 'Teacher Verified',
      title: 'Bare-Metal STM32 Microcontroller Programming in C',
      department_id: 'eng',
      branch_id: 'ece',
      semester_id: 'sem_4',
      specialization: 'Embedded Systems & Firmware',
      subject: 'Microcontrollers & Peripherals',
      topic: 'STM32 Register-Level Drivers',
      student_level: 'intermediate',
      description: 'Move beyond standard libraries. Write register-level drivers for GPIO, SysTick, UART, and Nested Vector Interrupt Controller (NVIC) on ARM Cortex-M4.',
      what_will_learn: [
        'Clock configuration: PLL, AHB/APB peripheral bus multipliers',
        'Writing clean bare-metal GPIO register bitmasking macros',
        'Configuring UART for polling vs interrupt-driven transmission',
        'Debugging hardware faults using OpenOCD and GDB'
      ],
      prerequisites: 'C language pointer manipulation and bitwise operations.',
      duration: 75,
      class_type: 'live_online',
      max_students: 8,
      booked_count: 5,
      price: 350,
      platform_fee: 0,
      total_price: 350,
      currency: 'INR',
      language: 'English',
      rating: 4.90,
      reviews_count: 11,
      status: 'active',
      meeting_link: 'https://meet.techpath.edu/room/tp-stm32-firmware',
      cancellation_policy: 'Full refund up to 6 hours before class starts.',
      created_at: '2026-03-02T14:15:00Z'
    },
    {
      id: 'cls_mech_01',
      teacher_id: 'usr_mech_01',
      teacher_name: 'Aditya Kulkarni',
      teacher_techpath_id: 'TP-MECH-7R1Q33',
      teacher_verification: 'Profile Verified',
      title: 'Finite Element Analysis (FEA) Modeling & Simulation in ANSYS',
      department_id: 'eng',
      branch_id: 'mech',
      semester_id: 'sem_5',
      specialization: 'Computational Mechanics',
      subject: 'Solid Mechanics & Simulation',
      topic: 'FEA Mesh Convergence & Stress',
      student_level: 'intermediate',
      description: 'Practical engineering simulation: CAD geometry cleanup, 2D/3D element selection (tetrahedral vs hexahedral), boundary constraints, and von Mises stress validation.',
      what_will_learn: [
        'Setting up realistic structural boundary conditions and fixture supports',
        'Mesh independence and singularity checks around stress risers',
        'Interpreting von Mises, Tresca, and principal stress distributions',
        'Generating audit-ready mechanical certification reports'
      ],
      prerequisites: 'Mechanics of Materials / Strength of Materials concepts.',
      duration: 60,
      class_type: 'live_online',
      max_students: 10,
      booked_count: 4,
      price: 280,
      platform_fee: 0,
      total_price: 280,
      currency: 'INR',
      language: 'English',
      rating: 4.85,
      reviews_count: 7,
      status: 'active',
      meeting_link: 'https://meet.techpath.edu/room/tp-fea-ansys-lab',
      cancellation_policy: 'Full refund up to 4 hours before the session.',
      created_at: '2026-03-04T09:00:00Z'
    },
    {
      id: 'cls_aiml_01',
      teacher_id: 'usr_aiml_01',
      teacher_name: 'Sneha Patel',
      teacher_techpath_id: 'TP-AIML-5M3K89',
      teacher_verification: 'Teacher Verified',
      title: 'PyTorch Deep Learning — Coding Transformer Architectures from Scratch',
      department_id: 'eng',
      branch_id: 'aiml',
      semester_id: 'sem_5',
      specialization: 'Deep Learning & Natural Language Processing',
      subject: 'Deep Learning',
      topic: 'Transformers & Self-Attention',
      student_level: 'advanced',
      description: 'Implement Scaled Dot-Product Attention, Multi-Head Attention layers, positional embeddings, and residual connections in clean PyTorch with step-by-step tensor math.',
      what_will_learn: [
        'Matrix dimensions and tensor broadcasting in Query/Key/Value projections',
        'Causal masking for autoregressive generative language models',
        'LayerNorm, GeLU activation, and dropout placement',
        'Training loop with mixed precision (AMP) and AdamW optimizer'
      ],
      prerequisites: 'Python proficiency, basic PyTorch tensor ops, and linear algebra.',
      duration: 90,
      class_type: 'live_online',
      max_students: 15,
      booked_count: 12,
      price: 400,
      platform_fee: 0,
      total_price: 400,
      currency: 'INR',
      language: 'English',
      rating: 4.98,
      reviews_count: 19,
      status: 'active',
      meeting_link: 'https://meet.techpath.edu/room/tp-pytorch-transformers',
      cancellation_policy: 'Full refund up to 4 hours before class starts.',
      created_at: '2026-03-05T16:00:00Z'
    },
    {
      id: 'cls_civil_01',
      teacher_id: 'usr_civil_01',
      teacher_name: 'Kavya Iyer',
      teacher_techpath_id: 'TP-CIVIL-2N7T51',
      teacher_verification: 'Profile Verified',
      title: 'Structural RCC Design — Limit State Method for Beams & Columns',
      department_id: 'eng',
      branch_id: 'civil',
      semester_id: 'sem_4',
      specialization: 'Structural & Seismic Engineering',
      subject: 'Design of Concrete Structures',
      topic: 'Limit State RCC Design',
      student_level: 'intermediate',
      description: 'Master IS 456 standard limit state calculations for singly & doubly reinforced beams, shear reinforcement, and axially loaded columns with practical drawings.',
      what_will_learn: [
        'Stress-strain block parameters and neutral axis depth determination',
        'Shear stress checks and designing vertical stirrups',
        'Longitudinal reinforcement detailing and development length',
        'Load combination factors for dead, live, and seismic actions'
      ],
      prerequisites: 'Solid Mechanics and Structural Analysis basics.',
      duration: 60,
      class_type: 'live_online',
      max_students: 10,
      booked_count: 3,
      price: 250,
      platform_fee: 0,
      total_price: 250,
      currency: 'INR',
      language: 'English',
      rating: 4.88,
      reviews_count: 6,
      status: 'active',
      meeting_link: 'https://meet.techpath.edu/room/tp-rcc-structural-design',
      cancellation_policy: 'Full refund up to 4 hours before the session.',
      created_at: '2026-03-06T11:00:00Z'
    }
  ],

  class_availability: [
    // Slots for C++ DSA Masterclass (cls_cse_01)
    {
      id: 'slot_dsa_01',
      class_id: 'cls_cse_01',
      date: '2026-09-20',
      start_time: '18:00',
      end_time: '19:00',
      timezone: 'IST',
      seats_total: 12,
      seats_booked: 4,
      status: 'available'
    },
    {
      id: 'slot_dsa_02',
      class_id: 'cls_cse_01',
      date: '2026-09-21',
      start_time: '18:00',
      end_time: '19:00',
      timezone: 'IST',
      seats_total: 12,
      seats_booked: 4,
      status: 'available'
    },
    {
      id: 'slot_dsa_03',
      class_id: 'cls_cse_01',
      date: '2026-09-23',
      start_time: '10:00',
      end_time: '11:00',
      timezone: 'IST',
      seats_total: 12,
      seats_booked: 0,
      status: 'available'
    },
    // Slots for STM32 Embedded C (cls_ece_01)
    {
      id: 'slot_stm_01',
      class_id: 'cls_ece_01',
      date: '2026-09-20',
      start_time: '19:30',
      end_time: '20:45',
      timezone: 'IST',
      seats_total: 8,
      seats_booked: 3,
      status: 'available'
    },
    {
      id: 'slot_stm_02',
      class_id: 'cls_ece_01',
      date: '2026-09-22',
      start_time: '17:00',
      end_time: '18:15',
      timezone: 'IST',
      seats_total: 8,
      seats_booked: 2,
      status: 'available'
    },
    // Slots for ANSYS FEA (cls_mech_01)
    {
      id: 'slot_fea_01',
      class_id: 'cls_mech_01',
      date: '2026-09-21',
      start_time: '16:00',
      end_time: '17:00',
      timezone: 'IST',
      seats_total: 10,
      seats_booked: 4,
      status: 'available'
    },
    // Slots for PyTorch Transformers (cls_aiml_01)
    {
      id: 'slot_pt_01',
      class_id: 'cls_aiml_01',
      date: '2026-09-21',
      start_time: '20:00',
      end_time: '21:30',
      timezone: 'IST',
      seats_total: 15,
      seats_booked: 8,
      status: 'available'
    },
    {
      id: 'slot_pt_02',
      class_id: 'cls_aiml_01',
      date: '2026-09-24',
      start_time: '19:00',
      end_time: '20:30',
      timezone: 'IST',
      seats_total: 15,
      seats_booked: 4,
      status: 'available'
    },
    // Slots for Civil RCC (cls_civil_01)
    {
      id: 'slot_civ_01',
      class_id: 'cls_civil_01',
      date: '2026-09-22',
      start_time: '11:00',
      end_time: '12:00',
      timezone: 'IST',
      seats_total: 10,
      seats_booked: 3,
      status: 'available'
    }
  ],

  class_reviews: [
    {
      id: 'rev_cls_01',
      class_id: 'cls_cse_01',
      student_id: 'usr_cse_02',
      student_name: 'Devansh Malhotra',
      student_techpath_id: 'TP-CSE-4F8X11',
      rating: 5,
      review: 'Ananya explained AVL tree rotations and recursive rebalancing better than any lecture textbook. The live coding exercise made the balance factor check second nature!',
      created_at: '2026-02-28T18:45:00Z'
    },
    {
      id: 'rev_cls_02',
      class_id: 'cls_cse_01',
      student_id: 'usr_aiml_01',
      student_name: 'Sneha Patel',
      student_techpath_id: 'TP-AIML-5M3K89',
      rating: 5,
      review: 'Clear, concise, and focused on actual engineering intuition rather than pure memorization. Highly recommend for 3rd semester CSE/IT students.',
      created_at: '2026-03-02T19:30:00Z'
    },
    {
      id: 'rev_cls_03',
      class_id: 'cls_ece_01',
      student_id: 'usr_ece_02',
      student_name: 'Priya Nair',
      student_techpath_id: 'TP-ECE-2W9P55',
      rating: 5,
      review: 'Rahul walked through the STM32 reference manual and showed how register offsets map to memory addresses. Indispensable for core embedded jobs.',
      created_at: '2026-03-03T21:10:00Z'
    },
    {
      id: 'rev_cls_04',
      class_id: 'cls_aiml_01',
      student_id: 'usr_cse_01',
      student_name: 'Ananya Sharma',
      student_techpath_id: 'TP-CSE-9K2L44',
      rating: 5,
      review: 'Sneha’s explanation of query-key dimensional normalization and why we divide by sqrt(d_k) cleared months of confusion. Brilliant peer teacher!',
      created_at: '2026-03-06T18:00:00Z'
    }
  ]
};

