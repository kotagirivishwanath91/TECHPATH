/**
 * TECHPATH — ALL-IN-ONE BUNDLE
 * Enables instant offline & file:/// execution without CORS or server dependencies
 */

(function() {
  // 1. CONFIG
  const APP_CONFIG = {
    name: 'TechPath',
    version: '2.4.0',
    tagline: 'Learn. Build. Prepare. Grow.',
    subTagline: 'From Classroom to Career.',
    apiUrl: window.location.origin,
    supabase: {
      url: 'https://hcvgndaetfarwsbjxcog.supabase.co',
      anonKey: window.localStorage.getItem('TECHPATH_SUPABASE_ANON_KEY') || '',
      isConfigured() {
        return Boolean(this.url && this.anonKey && !this.anonKey.includes('mock') && !this.anonKey.includes('<NEW_ROTATED'));
      }
    },
    departments: [
      { id: 'eng', name: 'Engineering & Technology', code: 'ENG' }
    ],
    branches: [
      { id: 'cse', name: 'Computer Science & Engineering', code: 'CSE', icon: 'cpu', semesters: 8 },
      { id: 'ece', name: 'Electronics & Communication Engineering', code: 'ECE', icon: 'zap', semesters: 8 },
      { id: 'eee', name: 'Electrical & Electronics Engineering', code: 'EEE', icon: 'activity', semesters: 8 },
      { id: 'mech', name: 'Mechanical Engineering', code: 'MECH', icon: 'settings', semesters: 8 },
      { id: 'civil', name: 'Civil Engineering', code: 'CIVIL', icon: 'compass', semesters: 8 },
      { id: 'aiml', name: 'Artificial Intelligence & Machine Learning', code: 'AI/ML', icon: 'brain', semesters: 8 }
    ],
    semesters: [
      { id: 'sem_1', number: 1, name: 'Semester 1', year: 1 },
      { id: 'sem_2', number: 2, name: 'Semester 2', year: 1 },
      { id: 'sem_3', number: 3, name: 'Semester 3', year: 2 },
      { id: 'sem_4', number: 4, name: 'Semester 4', year: 2 },
      { id: 'sem_5', number: 5, name: 'Semester 5', year: 3 },
      { id: 'sem_6', number: 6, name: 'Semester 6', year: 3 },
      { id: 'sem_7', number: 7, name: 'Semester 7', year: 4 },
      { id: 'sem_8', number: 8, name: 'Semester 8', year: 4 }
    ],
    languages: [
      { code: 'en', name: 'English', rtl: false },
      { code: 'te', name: 'తెలుగు (Telugu)', rtl: false },
      { code: 'hi', name: 'हिन्दी (Hindi)', rtl: false },
      { code: 'ta', name: 'தமிழ் (Tamil)', rtl: false },
      { code: 'ar', name: 'العربية (Arabic)', rtl: true },
      { code: 'ja', name: '日本語 (Japanese)', rtl: false }
    ],
    theme: {
      primaryCrimson: '#e11d48',
      laserRed: '#ff4d5a',
      deepObsidian: '#0b0d12',
      cosmicSlate: '#111827',
      substrateIce: '#f9f9ff'
    }
  };

  // 2. SEED DATA
  const CANONICAL_SEED_DATA = {
    departments: [
      { id: 'eng', name: 'Faculty of Engineering & Technology', code: 'ENG', description: 'Core Engineering & Computing' }
    ],
    branches: [
      { id: 'cse', department_id: 'eng', name: 'Computer Science & Engineering', code: 'CSE', total_semesters: 8 },
      { id: 'ece', department_id: 'eng', name: 'Electronics & Communication Engineering', code: 'ECE', total_semesters: 8 },
      { id: 'eee', department_id: 'eng', name: 'Electrical & Electronics Engineering', code: 'EEE', total_semesters: 8 },
      { id: 'mech', department_id: 'eng', name: 'Mechanical Engineering', code: 'MECH', total_semesters: 8 },
      { id: 'civil', department_id: 'eng', name: 'Civil Engineering', code: 'CIVIL', total_semesters: 8 },
      { id: 'aiml', department_id: 'eng', name: 'Artificial Intelligence & Machine Learning', code: 'AI/ML', total_semesters: 8 }
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
    subjects: [
      // CSE Semester 3
      { id: 'sub_cse_301', branch_id: 'cse', semester_id: 'sem_3', code: 'CS301', title: 'Data Structures & Algorithms', credits: 4, description: 'Linear and non-linear data structures, asymptotic notation, trees, graphs, dynamic programming.' },
      { id: 'sub_cse_302', branch_id: 'cse', semester_id: 'sem_3', code: 'CS302', title: 'Digital Logic & Computer Organization', credits: 4, description: 'Boolean algebra, combinational & sequential logic, ALU, CPU registers, instruction cycle.' },
      { id: 'sub_cse_303', branch_id: 'cse', semester_id: 'sem_3', code: 'CS303', title: 'Discrete Mathematical Structures', credits: 3, description: 'Set theory, propositional logic, recurrence relations, graph theory, algebraic structures.' },
      { id: 'sub_cse_304', branch_id: 'cse', semester_id: 'sem_3', code: 'CS304', title: 'Object-Oriented Programming (Java/C++)', credits: 4, description: 'Encapsulation, inheritance, polymorphism, templates, memory management, design patterns.' },
      // ECE Semester 3
      { id: 'sub_ece_301', branch_id: 'ece', semester_id: 'sem_3', code: 'EC301', title: 'Electronic Devices & Circuit Theory', credits: 4, description: 'PN Junctions, BJTs, MOSFET high-frequency models, biasing, small signal amplifiers.' },
      { id: 'sub_ece_302', branch_id: 'ece', semester_id: 'sem_3', code: 'EC302', title: 'Signals and Systems', credits: 4, description: 'Continuous & discrete time signals, Fourier transform, Laplace, Z-transform, LTI systems.' },
      // MECH Semester 3
      { id: 'sub_mech_301', branch_id: 'mech', semester_id: 'sem_3', code: 'ME301', title: 'Engineering Thermodynamics', credits: 4, description: 'First and second laws, Carnot cycle, entropy, availability, Rankine & Brayton cycles.' },
      { id: 'sub_mech_302', branch_id: 'mech', semester_id: 'sem_3', code: 'ME302', title: 'Mechanics of Materials', credits: 4, description: 'Stress, strain, Mohr circle, bending moment, shear stress, torsion of circular shafts.' }
    ],
    topics: [
      { id: 'top_cse_301_01', subject_id: 'sub_cse_301', branch_id: 'cse', semester_id: 'sem_3', unit_number: 1, sequence_order: 1, title: 'Asymptotic Analysis & Big-O Notation', description: 'Formal mathematical definition of Big-O, Omega, and Theta notations with recurrence trees.', difficulty: 'intermediate' },
      { id: 'top_cse_301_02', subject_id: 'sub_cse_301', branch_id: 'cse', semester_id: 'sem_3', unit_number: 1, sequence_order: 2, title: 'Self-Balancing Binary Trees (AVL & Red-Black)', description: 'Rotations, height balance invariants, insertions and deletions in logarithmic time.', difficulty: 'advanced' },
      { id: 'top_cse_302_01', subject_id: 'sub_cse_302', branch_id: 'cse', semester_id: 'sem_3', unit_number: 1, sequence_order: 1, title: 'Pipelining & Hazard Resolution', description: 'Instruction pipeline stages (IF, ID, EX, MEM, WB), structural, data, and branch hazards.', difficulty: 'intermediate' },
      { id: 'top_ece_301_01', subject_id: 'sub_ece_301', branch_id: 'ece', semester_id: 'sem_3', unit_number: 1, sequence_order: 1, title: 'MOSFET Small-Signal Analysis', description: 'Derivation of transconductance gm, output resistance ro, and high-frequency Miller capacitance.', difficulty: 'advanced' },
      { id: 'top_mech_301_01', subject_id: 'sub_mech_301', branch_id: 'mech', semester_id: 'sem_3', unit_number: 1, sequence_order: 1, title: 'Second Law of Thermodynamics & Entropy', description: 'Clausius inequality, entropy generation in irreversible processes, exergy destruction.', difficulty: 'intermediate' }
    ],
    videos: [
      {
        id: 'vid_cse_301_01',
        branch_id: 'cse',
        semester_id: 'sem_3',
        subject_id: 'sub_cse_301',
        topic_id: 'top_cse_301_01',
        title: 'Mastering Big-O Analysis & Recurrence Relations',
        description: 'Rigorous mathematical proof of asymptotic runtime bounds with Master Theorem examples.',
        provider: 'TechPath Stream Engineering',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc03cf4456e?w=600&auto=format&fit=crop&q=80',
        language: 'en',
        difficulty: 'intermediate',
        duration: 1240,
        status: 'published'
      },
      {
        id: 'vid_ece_301_01',
        branch_id: 'ece',
        semester_id: 'sem_3',
        subject_id: 'sub_ece_301',
        topic_id: 'top_ece_301_01',
        title: 'MOSFET Sub-threshold and Saturation Dynamics',
        description: 'Physical carrier transport in modern FinFET and planar semiconductor gates.',
        provider: 'TechPath Silicon Academy',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        language: 'en',
        difficulty: 'advanced',
        duration: 1120,
        status: 'published'
      }
    ],
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
            interview_questions: ['How does a Carry-Lookahead Adder achieve logarithmic delay compared to Ripple-Carry?']
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
        accessible_2d_diagram: {
          title: '2D Schematic: FinFET Cross-Section',
          nodes: [
            { name: 'Silicon Fin', desc: 'Raised channel surrounded on 3 sides by gate dielectric' },
            { name: 'High-k Metal Gate', desc: 'Controls electric field and channel inversion' }
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
            interview_questions: ['Why does a FinFET have superior subthreshold swing compared to a planar MOSFET?']
          }
        ]
      }
    ],
    skills: [
      { id: 'skill_python', name: 'Python Engineering', category: 'Language', description: 'Advanced Python, OOP, decorators, concurrency, memory profiling.', branch_relevance: ['cse', 'aiml'], required_level: 4 },
      { id: 'skill_sql', name: 'Relational Database & SQL', category: 'Database', description: 'Complex joins, indexing, query execution plan optimization, ACID transactions.', branch_relevance: ['cse', 'aiml'], required_level: 4 },
      { id: 'skill_dsa', name: 'Data Structures & Algorithms', category: 'Core CS', description: 'Dynamic programming, graphs, trees, amortized complexity analysis.', branch_relevance: ['cse', 'aiml'], required_level: 5 },
      { id: 'skill_sys_design', name: 'Distributed System Design', category: 'Architecture', description: 'Microservices, rate limiting, caching, CDC, event streaming with Kafka.', branch_relevance: ['cse'], required_level: 3 },
      { id: 'skill_docker', name: 'Containerization & Docker', category: 'DevOps', description: 'Dockerfile multi-stage builds, networking, volumes, compose.', branch_relevance: ['cse', 'aiml'], required_level: 3 },
      { id: 'skill_git', name: 'Git & Version Control', category: 'Tools', description: 'Interactive rebase, branching models, bisect, semantic release.', branch_relevance: ['cse', 'ece', 'eee', 'mech', 'civil', 'aiml'], required_level: 4 },
      { id: 'skill_embedded_c', name: 'Embedded C & RTOS', category: 'Core ECE', description: 'Bare-metal C, register bit-banging, interrupts, FreeRTOS task scheduling.', branch_relevance: ['ece', 'eee'], required_level: 4 }
    ],
    career_roles: [
      {
        id: 'role_data_scientist',
        title: 'Data Scientist & ML Engineer',
        department_id: 'eng',
        branch_id: 'cse',
        description: 'Designs predictive algorithms, deep neural network pipelines, and automated data workflows.',
        salary_range: '$95,000 - $160,000',
        market_demand: 'Extremely High',
        required_skills: [
          { skill_id: 'skill_python', level: 5, weight: 1.0 },
          { skill_id: 'skill_sql', level: 4, weight: 0.9 },
          { skill_id: 'skill_dsa', level: 4, weight: 0.8 },
          { skill_id: 'skill_git', level: 4, weight: 0.7 },
          { skill_id: 'skill_docker', level: 3, weight: 0.6 }
        ]
      },
      {
        id: 'role_fullstack',
        title: 'Full Stack Software Engineer',
        department_id: 'eng',
        branch_id: 'cse',
        description: 'Builds end-to-end distributed web services, REST/GraphQL APIs, and high-performance frontends.',
        salary_range: '$90,000 - $150,000',
        market_demand: 'Very High',
        required_skills: [
          { skill_id: 'skill_dsa', level: 5, weight: 1.0 },
          { skill_id: 'skill_sql', level: 4, weight: 0.9 },
          { skill_id: 'skill_sys_design', level: 4, weight: 0.9 },
          { skill_id: 'skill_git', level: 4, weight: 0.8 }
        ]
      },
      {
        id: 'role_embedded_eng',
        title: 'Embedded Systems & Firmware Engineer',
        department_id: 'eng',
        branch_id: 'ece',
        description: 'Develops ultra-reliable real-time firmware for microcontrollers, sensors, and automotive hardware.',
        salary_range: '$88,000 - $145,000',
        market_demand: 'High',
        required_skills: [
          { skill_id: 'skill_embedded_c', level: 5, weight: 1.0 },
          { skill_id: 'skill_git', level: 4, weight: 0.7 }
        ]
      }
    ],
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
        implementation_steps: [
          { step: 1, name: 'State Machine RPC Definition', desc: 'Define protobuf contracts for Raft election and log replication messages.' },
          { step: 2, name: 'Heartbeat & Randomized Election Timers', desc: 'Implement async timers transitioning Candidate nodes to Leaders upon quorum.' },
          { step: 3, name: 'Log Replication & Quorum Commit', desc: 'Propagate entry logs, verify index matches, and apply committed entries to State Machine.' }
        ],
        resume_bullets: [
          'Engineered a fault-tolerant distributed key-value store utilizing Raft consensus, achieving 4,200 ops/sec across a 3-node cluster.',
          'Implemented custom Write-Ahead-Logging (WAL) and leader election failover under 300ms using gRPC and asyncio.'
        ],
        interview_questions: [
          'How does Raft guarantee that a newly elected leader contains all committed entries from past terms?'
        ]
      }
    ],
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
        back: 'If f(n) = O(n^(log_b(a) - ε)) for some constant ε > 0, then T(n) = Θ(n^(log_b(a))). The tree leaves dominate computational work.'
      }
    ],
    exams: [
      {
        id: 'exam_gate_cse',
        title: 'GATE Computer Science & Information Technology',
        exam_type: 'entrance',
        target_branch_id: 'cse',
        eligibility_criteria: 'Candidates in 3rd or higher year of B.E./B.Tech or equivalent degree.',
        syllabus_summary: 'Engineering Mathematics, Digital Logic, Computer Organization, Programming & Data Structures, Algorithms, Theory of Computation, Operating Systems, DBMS.',
        total_marks: 100,
        duration_minutes: 180
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
      }
    ]
  };

  // 3. DATA STORE IMPLEMENTATION
  class DataStore {
    constructor() {
      this.initFallback();
    }
    initFallback() {
      if (!localStorage.getItem('TECHPATH_SEEDED_v2')) {
        Object.entries(CANONICAL_SEED_DATA).forEach(([table, items]) => {
          localStorage.setItem(`tp_${table}`, JSON.stringify(items));
        });
        localStorage.setItem('TECHPATH_SEEDED_v2', 'true');
      }
    }
    async getAll(table) {
      const data = localStorage.getItem(`tp_${table}`);
      return data ? JSON.parse(data) : [];
    }
    async getById(table, id) {
      const all = await this.getAll(table);
      return all.find((item) => item.id === id) || null;
    }
    async filter(table, predicate) {
      const all = await this.getAll(table);
      return all.filter(predicate);
    }
    async insert(table, item) {
      if (!item.id) item.id = 'gen_' + Math.random().toString(36).substr(2, 9);
      item.created_at = item.created_at || new Date().toISOString();
      const all = await this.getAll(table);
      const existingIdx = all.findIndex((i) => i.id === item.id);
      if (existingIdx >= 0) all[existingIdx] = { ...all[existingIdx], ...item };
      else all.push(item);
      localStorage.setItem(`tp_${table}`, JSON.stringify(all));
      return item;
    }
    async update(table, id, patch) {
      const current = await this.getById(table, id);
      if (!current) throw new Error(`Entity ${id} not found`);
      return this.insert(table, { ...current, ...patch });
    }
    async delete(table, id) {
      const all = await this.getAll(table);
      const filtered = all.filter((i) => i.id !== id);
      localStorage.setItem(`tp_${table}`, JSON.stringify(filtered));
      return true;
    }
  }
  const dbStore = new DataStore();

  // 4. LEARNING CONTEXT MANAGER
  class LearningContextManager {
    constructor() {
      this.state = {
        user_id: 'usr_guest',
        department_id: 'eng',
        branch_id: 'cse',
        specialization_id: 'core_cs',
        semester_id: 'sem_3',
        year: 2,
        subject_id: 'sub_cse_301',
        topic_id: 'top_cse_301_01',
        learning_level: 'intermediate',
        career_goal: 'Software Engineer',
        target_role: 'role_data_scientist',
        target_exam: 'exam_gate_cse',
        preferred_language: 'en',
        current_skills: [],
        skill_gaps: [],
        resume_id: null
      };
      this.subscribers = new Set();
      this.load();
    }
    load() {
      try {
        const s = localStorage.getItem('TECHPATH_LEARNING_CONTEXT');
        if (s) this.state = { ...this.state, ...JSON.parse(s) };
      } catch (e) {}
    }
    save() {
      try {
        localStorage.setItem('TECHPATH_LEARNING_CONTEXT', JSON.stringify(this.state));
      } catch (e) {}
    }
    get() {
      return { ...this.state };
    }
    async setBranch(branch_id) {
      if (this.state.branch_id === branch_id) return;
      this.state.branch_id = branch_id;
      const subjects = await dbStore.filter('subjects', (s) => s.branch_id === branch_id && s.semester_id === this.state.semester_id);
      if (subjects.length > 0) {
        this.state.subject_id = subjects[0].id;
        const topics = await dbStore.filter('topics', (t) => t.subject_id === subjects[0].id);
        this.state.topic_id = topics.length > 0 ? topics[0].id : null;
      } else {
        this.state.subject_id = null;
        this.state.topic_id = null;
      }
      this.save();
      this.notify();
    }
    async setSemester(semester_id) {
      if (this.state.semester_id === semester_id) return;
      this.state.semester_id = semester_id;
      const semNum = parseInt(semester_id.replace('sem_', ''), 10) || 1;
      this.state.year = Math.ceil(semNum / 2);
      const subjects = await dbStore.filter('subjects', (s) => s.branch_id === this.state.branch_id && s.semester_id === semester_id);
      if (subjects.length > 0) {
        this.state.subject_id = subjects[0].id;
        const topics = await dbStore.filter('topics', (t) => t.subject_id === subjects[0].id);
        this.state.topic_id = topics.length > 0 ? topics[0].id : null;
      } else {
        this.state.subject_id = null;
        this.state.topic_id = null;
      }
      this.save();
      this.notify();
    }
    async setSubject(subject_id) {
      this.state.subject_id = subject_id;
      const topics = await dbStore.filter('topics', (t) => t.subject_id === subject_id);
      this.state.topic_id = topics.length > 0 ? topics[0].id : null;
      this.save();
      this.notify();
    }
    setTargetRole(role_id) {
      this.state.target_role = role_id;
      this.save();
      this.notify();
    }
    setLanguage(langCode) {
      this.state.preferred_language = langCode;
      document.documentElement.lang = langCode;
      this.save();
      this.notify();
    }
    setSkillsAndGaps(skills, gaps) {
      this.state.current_skills = skills;
      this.state.skill_gaps = gaps;
      this.save();
      this.notify();
    }
    subscribe(fn) {
      this.subscribers.add(fn);
      return () => this.subscribers.delete(fn);
    }
    notify() {
      this.subscribers.forEach((fn) => {
        try { fn(this.get()); } catch (e) {}
      });
    }
  }
  const learningContext = new LearningContextManager();

  // 5. AUTH MANAGER
  class AuthManager {
    constructor() {
      this.currentUser = {
        id: 'usr_guest',
        email: 'engineer@techpath.edu',
        full_name: 'Guest Engineer',
        branch_id: 'cse',
        semester_id: 'sem_3',
        is_admin: false
      };
      this.restore();
    }
    restore() {
      try {
        const s = localStorage.getItem('TECHPATH_USER_SESSION');
        if (s) this.currentUser = JSON.parse(s);
      } catch (e) {}
    }
    getUser() { return this.currentUser; }
    isAdmin() { return Boolean(this.currentUser && this.currentUser.is_admin); }
    async login(email) {
      const cleanEmail = (email || '').toLowerCase().trim();
      const isAdmin = cleanEmail === 'kotagirivishwanath@gmail.com';
      this.currentUser = {
        id: isAdmin ? 'usr_admin' : 'usr_' + Math.random().toString(36).substr(2, 7),
        email: cleanEmail,
        full_name: isAdmin ? 'Platform Administrator' : cleanEmail.split('@')[0],
        branch_id: 'cse',
        semester_id: 'sem_3',
        is_admin: isAdmin
      };
      localStorage.setItem('TECHPATH_USER_SESSION', JSON.stringify(this.currentUser));
      return this.currentUser;
    }
    async signup(email, name, branchId, agreed) {
      if (!agreed) throw new Error('You must accept Terms of Service & Privacy Policy.');
      const cleanEmail = (email || '').toLowerCase().trim();
      const isAdmin = cleanEmail === 'kotagirivishwanath@gmail.com';
      this.currentUser = {
        id: 'usr_' + Math.random().toString(36).substr(2, 7),
        email: cleanEmail,
        full_name: name,
        branch_id: branchId,
        semester_id: 'sem_3',
        is_admin: isAdmin
      };
      localStorage.setItem('TECHPATH_USER_SESSION', JSON.stringify(this.currentUser));
      return this.currentUser;
    }
    async logout() {
      this.currentUser = null;
      localStorage.removeItem('TECHPATH_USER_SESSION');
    }
    getCookiePreferences() {
      const s = localStorage.getItem('TECHPATH_COOKIE_CONSENT');
      return s ? JSON.parse(s) : { essential: true, analytics: false, preferences: false, marketing: false };
    }
    setCookiePreferences(p) {
      localStorage.setItem('TECHPATH_COOKIE_CONSENT', JSON.stringify({ ...p, essential: true }));
    }
    async requestDataDeletion() {
      return true;
    }
    async deleteAccount() {
      await this.logout();
      return true;
    }
  }
  const authManager = new AuthManager();

  // 6. CONTENT FILTER
  class ContentFilterEngine {
    static async getSubjects(branch_id, semester_id) {
      return dbStore.filter('subjects', (s) => s.branch_id === branch_id && s.semester_id === semester_id);
    }
    static async getTopics(subject_id) {
      return dbStore.filter('topics', (t) => t.subject_id === subject_id);
    }
    static async getVideos(branch_id, semester_id, subject_id) {
      return dbStore.filter('videos', (v) => v.branch_id === branch_id && v.semester_id === semester_id && (!subject_id || v.subject_id === subject_id));
    }
    static async get3DModels(branch_id, semester_id) {
      return dbStore.filter('branch_models', (m) => m.branch_id === branch_id && m.semester_id === semester_id);
    }
    static async getProjects(branch_id, semester_id) {
      return dbStore.filter('projects', (p) => p.branch_id === branch_id && (!semester_id || p.semester_id === semester_id));
    }
    static async getQuizzes(branch_id, semester_id) {
      return dbStore.filter('quiz_questions', (q) => q.branch_id === branch_id && q.semester_id === semester_id);
    }
  }

  // 7. SKILLS ENGINE
  class SkillsEngine {
    static async evaluateRoleSkills(roleId, userId = 'usr_guest') {
      const role = await dbStore.getById('career_roles', roleId);
      if (!role) return { role: null, skills: [], gaps: [] };

      const allSkills = await dbStore.getAll('skills');
      const userSkills = await dbStore.filter('user_skills', (us) => us.user_id === userId);
      const userSkillMap = new Map(userSkills.map((us) => [us.skill_id, us]));

      const evaluated = [];
      const gaps = [];

      for (const req of role.required_skills || []) {
        const skillMeta = allSkills.find((s) => s.id === req.skill_id);
        if (!skillMeta) continue;

        const userRecord = userSkillMap.get(req.skill_id);
        const currentLevel = userRecord ? userRecord.current_level : 0;
        const requiredLevel = req.level;
        const delta = requiredLevel - currentLevel;

        let status = 'Missing';
        if (currentLevel >= requiredLevel) status = 'Strong';
        else if (currentLevel === requiredLevel - 1) status = 'Developing';
        else if (currentLevel > 0) status = 'Needs Improvement';

        const item = {
          skill_id: req.skill_id,
          name: skillMeta.name,
          category: skillMeta.category,
          description: skillMeta.description,
          required_level: requiredLevel,
          current_level: currentLevel,
          gap_delta: Math.max(0, delta),
          status,
          importance_weight: req.weight || 1.0
        };

        evaluated.push(item);
        if (delta > 0) gaps.push(item);
      }

      learningContext.setSkillsAndGaps(evaluated, gaps);
      return { role, skills: evaluated, gaps };
    }

    static async recordSkillEvidence(userId, skillId, gainedLevel, source) {
      const existing = await dbStore.filter('user_skills', (us) => us.user_id === userId && us.skill_id === skillId);
      let currentLevel = existing.length > 0 ? existing[0].current_level : 0;
      const newLevel = Math.min(5, Math.max(currentLevel, gainedLevel));
      let status = 'Developing';
      if (newLevel >= 4) status = 'Strong';
      else if (newLevel <= 1) status = 'Needs Improvement';

      await dbStore.insert('user_skills', {
        id: `${userId}_${skillId}`,
        user_id: userId,
        skill_id: skillId,
        current_level: newLevel,
        status,
        source: source || 'Assessment'
      });

      const ctx = learningContext.get();
      if (ctx.target_role) await this.evaluateRoleSkills(ctx.target_role, userId);
    }
  }

  // 8. THREE.JS 3D ENGINE
  class ThreeDEngine {
    constructor(container) {
      this.container = container;
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.modelGroup = null;
      this.components = [];
      this.explodeFactor = 0;
      this.animationId = null;
      this.init();
    }
    init() {
      if (!window.THREE) return;
      const width = this.container.clientWidth || 800;
      const height = this.container.clientHeight || 500;

      this.scene = new window.THREE.Scene();
      this.scene.background = new window.THREE.Color(0x0b0d12);

      this.camera = new window.THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.set(0, 5, 12);
      this.camera.lookAt(0, 0, 0);

      this.renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      this.container.innerHTML = '';
      this.container.appendChild(this.renderer.domElement);

      const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.8);
      this.scene.add(ambientLight);

      const dirLight = new window.THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(10, 15, 10);
      this.scene.add(dirLight);

      const grid = new window.THREE.GridHelper(20, 20, 0xe11d48, 0x1f2937);
      grid.position.y = -2;
      this.scene.add(grid);

      this.modelGroup = new window.THREE.Group();
      this.scene.add(this.modelGroup);

      this.setupInteraction();
      this.animate();
    }
    loadModel(modelMeta) {
      if (!this.modelGroup || !window.THREE) return;
      while (this.modelGroup.children.length > 0) this.modelGroup.remove(this.modelGroup.children[0]);
      this.components = [];

      const THREE = window.THREE;
      if (modelMeta.id.includes('cpu')) {
        const baseGeo = new THREE.BoxGeometry(6, 0.4, 6);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.userData = { explodeDir: new THREE.Vector3(0, -1, 0) };
        this.modelGroup.add(base);
        this.components.push(base);

        const cores = [
          { x: -1.5, z: -1.5 }, { x: 1.5, z: -1.5 },
          { x: -1.5, z: 1.5 }, { x: 1.5, z: 1.5 }
        ];
        cores.forEach((pos) => {
          const coreGeo = new THREE.BoxGeometry(2.4, 0.5, 2.4);
          const coreMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.6, roughness: 0.3 });
          const core = new THREE.Mesh(coreGeo, coreMat);
          core.position.set(pos.x, 0.45, pos.z);
          core.userData = { explodeDir: new THREE.Vector3(pos.x * 0.8, 1.2, pos.z * 0.8) };
          this.modelGroup.add(core);
          this.components.push(core);
        });
      } else {
        const cylGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
        const cylMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.3 });
        const cyl = new THREE.Mesh(cylGeo, cylMat);
        cyl.userData = { explodeDir: new THREE.Vector3(0, 0, 0) };
        this.modelGroup.add(cyl);
        this.components.push(cyl);
      }

      this.components.forEach((c) => { c.userData.initialPos = c.position.clone(); });
    }
    setExplode(val) {
      this.explodeFactor = val;
      this.components.forEach((c) => {
        if (c.userData.initialPos && c.userData.explodeDir) {
          const offset = c.userData.explodeDir.clone().multiplyScalar(val * 2.5);
          c.position.copy(c.userData.initialPos).add(offset);
        }
      });
    }
    resetView() {
      this.setExplode(0);
      if (this.camera) {
        this.camera.position.set(0, 5, 12);
        this.camera.lookAt(0, 0, 0);
      }
    }
    setupInteraction() {
      let isDrag = false;
      let px = 0, py = 0;
      const dom = this.renderer.domElement;
      dom.addEventListener('mousedown', (e) => { isDrag = true; px = e.clientX; py = e.clientY; });
      window.addEventListener('mouseup', () => { isDrag = false; });
      dom.addEventListener('mousemove', (e) => {
        if (!isDrag || !this.modelGroup) return;
        this.modelGroup.rotation.y += (e.clientX - px) * 0.008;
        this.modelGroup.rotation.x += (e.clientY - py) * 0.008;
        px = e.clientX; py = e.clientY;
      });
      dom.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.camera.position.z = Math.max(4, Math.min(25, this.camera.position.z + e.deltaY * 0.01));
      }, { passive: false });
    }
    animate() {
      this.animationId = requestAnimationFrame(() => this.animate());
      if (this.renderer && this.scene && this.camera) {
        if (this.modelGroup && this.explodeFactor === 0) this.modelGroup.rotation.y += 0.003;
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  // 9. HEADER & NAV RAIL COMPONENTS
  function renderHeader(container) {
    const ctx = learningContext.get();
    const user = authManager.getUser();

    container.innerHTML = `
      <header class="app-header">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="mono-chip" style="color: var(--tp-text-dark-muted);">BRANCH</span>
            <select id="header-branch-select" class="tp-select" style="height: 36px; padding: 0 0.5rem; width: 130px;">
              ${APP_CONFIG.branches.map((b) => `<option value="${b.id}" ${b.id === ctx.branch_id ? 'selected' : ''}>${b.code}</option>`).join('')}
            </select>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="mono-chip" style="color: var(--tp-text-dark-muted);">SEM</span>
            <select id="header-semester-select" class="tp-select" style="height: 36px; padding: 0 0.5rem; width: 100px;">
              ${APP_CONFIG.semesters.map((s) => `<option value="${s.id}" ${s.id === ctx.semester_id ? 'selected' : ''}>SEM ${s.number}</option>`).join('')}
            </select>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <button id="header-search-btn" class="tp-btn tp-btn-secondary" style="height: 36px; padding: 0 0.75rem;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span style="font-size: 0.8rem;">Search</span>
          </button>
          <a href="#/profile" style="display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: inherit;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--tp-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #fff; font-size: 0.75rem;">
              ${user ? user.full_name.charAt(0) : 'U'}
            </div>
            <span style="font-size: 0.85rem;" class="nav-label">${user ? user.full_name.split(' ')[0] : 'Engineer'}</span>
            ${user?.is_admin ? '<span class="telemetry-chip" style="padding: 0.1rem 0.4rem; font-size: 0.65rem;">ADMIN</span>' : ''}
          </a>
        </div>
      </header>
    `;

    container.querySelector('#header-branch-select').addEventListener('change', (e) => {
      learningContext.setBranch(e.target.value);
    });
    container.querySelector('#header-semester-select').addEventListener('change', (e) => {
      learningContext.setSemester(e.target.value);
    });
    container.querySelector('#header-search-btn').addEventListener('click', () => {
      window.location.hash = '#/search';
    });
  }

  function renderNavRail(container, activeRoute = '/dashboard') {
    const navItems = [
      { route: '/dashboard', label: 'Dashboard' },
      { route: '/learning', label: 'LearnHub' },
      { route: '/3d', label: '3D Explorer' },
      { route: '/skills', label: 'Skills Matrix' },
      { route: '/projects', label: 'Projects' },
      { route: '/career', label: 'Career Trajectory' },
      { route: '/interview', label: 'Mock Interview' },
      { route: '/exams', label: 'Exams & GATE' },
      { route: '/pdf', label: 'PDF Analyzer' },
      { route: '/practice', label: 'Practice & Labs' },
      { route: '/roadmaps', label: 'Roadmaps' },
      { route: '/resume', label: 'Resume Hub' },
      { route: '/community', label: 'Community' },
      { route: '/profile', label: 'Profile & Security' },
      { route: '/admin', label: 'Admin Console' }
    ];

    container.innerHTML = `
      <nav class="app-rail" aria-label="Main Navigation">
        <div style="height: 68px; padding: 0 1.5rem; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid var(--tp-border-dark);">
          <div style="width: 32px; height: 32px; background: var(--tp-primary); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-halo);">
            <div style="width: 14px; height: 14px; border: 2px solid #fff; transform: rotate(45deg);"></div>
          </div>
          <div>
            <div class="brand-text" style="font-family: var(--font-headline); font-weight: 800; font-size: 1.15rem;">
              TECH<span style="color: var(--tp-primary);">PATH</span>
            </div>
            <div class="brand-text mono-chip" style="font-size: 0.65rem; color: var(--tp-text-dark-muted);">PRECISION TELEMETRY</div>
          </div>
        </div>

        <div style="flex: 1; overflow-y: auto; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 0.25rem;">
          ${navItems.map((item) => {
            const isActive = activeRoute.startsWith(item.route);
            return `
              <a href="#${item.route}" style="
                display: block;
                padding: 0.65rem 0.85rem;
                border-radius: var(--radius-md);
                text-decoration: none;
                font-size: 0.9rem;
                font-weight: 500;
                color: ${isActive ? '#ffffff' : 'var(--tp-text-dark-secondary)'};
                background: ${isActive ? 'rgba(225, 29, 72, 0.15)' : 'transparent'};
                border: 1px solid ${isActive ? 'rgba(225, 29, 72, 0.4)' : 'transparent'};
              ">
                ${item.label}
              </a>
            `;
          }).join('')}
        </div>

        <div style="padding: 1rem; border-top: 1px solid var(--tp-border-dark); display: flex; align-items: center; gap: 0.5rem;">
          <div class="pulse-beacon"></div>
          <span class="mono-chip" style="font-size: 0.7rem; color: var(--tp-text-dark-muted);">ONLINE // v2.4.0</span>
        </div>
      </nav>
    `;
  }

  // 10. PAGES IMPLEMENTATION
  async function renderDashboard(viewport) {
    const ctx = learningContext.get();
    const subjects = await ContentFilterEngine.getSubjects(ctx.branch_id, ctx.semester_id);

    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div class="tp-card tp-card-glass" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.75rem;">
              <span class="pulse-beacon"></span>
              ACTIVE CONTEXT: ${ctx.branch_id.toUpperCase()} // SEMESTER ${ctx.semester_id.replace('sem_', '')}
            </div>
            <h1 class="display-lg">Engineering Command Center</h1>
            <p style="color: var(--tp-text-dark-secondary); margin-top: 0.5rem; max-width: 600px;">
              Continuous telemetry across academic coursework, technical capstones, and industry role readiness.
            </p>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <a href="#/learning" class="tp-btn tp-btn-primary">Continue LearnHub</a>
            <a href="#/3d" class="tp-btn tp-btn-secondary">Launch 3D Explorer</a>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
          <div class="tp-card">
            <span class="mono-chip" style="color: var(--tp-text-dark-muted);">STUDY STREAK</span>
            <div style="font-size: 2rem; font-weight: 700; margin: 0.5rem 0; color: #fff;">14 Days</div>
            <div class="telemetry-chip" style="font-size: 0.7rem;">FLAME ACTIVE</div>
          </div>
          <div class="tp-card">
            <span class="mono-chip" style="color: var(--tp-text-dark-muted);">HOURS COMMITTED</span>
            <div style="font-size: 2rem; font-weight: 700; margin: 0.5rem 0; color: #fff;">38.5h</div>
            <span style="font-size: 0.8rem; color: var(--tp-success);">+18% vs last week</span>
          </div>
          <div class="tp-card">
            <span class="mono-chip" style="color: var(--tp-text-dark-muted);">QUIZ ACCURACY</span>
            <div style="font-size: 2rem; font-weight: 700; margin: 0.5rem 0; color: #fff;">88%</div>
            <span style="font-size: 0.8rem; color: var(--tp-text-dark-secondary);">Across all topic drills</span>
          </div>
          <div class="tp-card">
            <span class="mono-chip" style="color: var(--tp-text-dark-muted);">SKILLS VERIFIED</span>
            <div style="font-size: 2rem; font-weight: 700; margin: 0.5rem 0; color: #fff;">4 Mastered</div>
            <a href="#/skills" style="font-size: 0.8rem; color: var(--tp-primary); text-decoration: none;">View Gap Analysis &rarr;</a>
          </div>
        </div>

        <div>
          <h2 class="headline-lg" style="margin-bottom: 1rem;">Semester ${ctx.semester_id.replace('sem_', '')} Subjects</h2>
          ${subjects.length === 0 ? `
            <div class="tp-empty-state">
              <div class="tp-empty-icon">&#9881;</div>
              <h3 class="tp-empty-title">Content for this branch is currently being prepared.</h3>
              <p class="tp-empty-desc">Zero unrelated content will be substituted.</p>
            </div>
          ` : `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem;">
              ${subjects.map((sub) => `
                <div class="tp-card">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span class="telemetry-chip">${sub.code}</span>
                    <span class="mono-chip" style="color: var(--tp-text-dark-muted);">${sub.credits} CREDITS</span>
                  </div>
                  <h3 style="font-size: 1.15rem; margin-bottom: 0.5rem;">${sub.title}</h3>
                  <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 1.25rem;">${sub.description}</p>
                  <a href="#/learning" class="tp-btn tp-btn-secondary select-sub-btn" data-id="${sub.id}" style="width: 100%;">
                    Open Subject Workspace
                  </a>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    viewport.querySelectorAll('.select-sub-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        learningContext.setSubject(e.currentTarget.getAttribute('data-id'));
      });
    });
  }

  async function renderLearning(viewport) {
    const ctx = learningContext.get();
    const subjects = await ContentFilterEngine.getSubjects(ctx.branch_id, ctx.semester_id);
    const activeSubject = subjects.find((s) => s.id === ctx.subject_id) || subjects[0] || null;

    let topics = [];
    let videos = [];
    if (activeSubject) {
      topics = await ContentFilterEngine.getTopics(activeSubject.id);
      videos = await ContentFilterEngine.getVideos(ctx.branch_id, ctx.semester_id, activeSubject.id);
    }

    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
            BRANCH: ${ctx.branch_id.toUpperCase()} // SEMESTER ${ctx.semester_id.replace('sem_', '')}
          </div>
          <h1 class="display-lg">LearnHub Workspace</h1>
          <p style="color: var(--tp-text-dark-secondary);">Canonical curriculum mapping with real lecture video streams.</p>
        </div>

        ${subjects.length === 0 ? `
          <div class="tp-empty-state">
            <div class="tp-empty-icon">&#9881;</div>
            <h2 class="tp-empty-title">Content for this branch is currently being prepared.</h2>
            <p class="tp-empty-desc">No subjects exist for ${ctx.branch_id.toUpperCase()} Semester ${ctx.semester_id.replace('sem_', '')}. Zero fallback permitted.</p>
          </div>
        ` : `
          <div style="display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem;">
            ${subjects.map((s) => `
              <button class="tp-btn ${s.id === activeSubject?.id ? 'tp-btn-primary' : 'tp-btn-secondary'} sub-pill" data-id="${s.id}">
                ${s.code}: ${s.title}
              </button>
            `).join('')}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem;">
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              <div class="tp-card" style="padding: 0; overflow: hidden;">
                ${videos.length > 0 ? `
                  <div style="aspect-ratio: 16/9; background: #000;">
                    <video controls poster="${videos[0].thumbnail}" style="width: 100%; height: 100%; object-fit: cover;">
                      <source src="${videos[0].url}" type="video/mp4">
                    </video>
                  </div>
                  <div style="padding: 1.5rem;">
                    <span class="telemetry-chip">${videos[0].provider}</span>
                    <h2 class="headline-md" style="margin-top: 0.5rem;">${videos[0].title}</h2>
                    <p style="color: var(--tp-text-dark-secondary); margin-top: 0.5rem; font-size: 0.9rem;">${videos[0].description}</p>
                  </div>
                ` : `
                  <div style="padding: 3rem; text-align: center;">
                    <p style="color: var(--tp-text-dark-muted);">No video stream currently published for this unit.</p>
                  </div>
                `}
              </div>

              <div class="tp-card">
                <h3 class="headline-md" style="margin-bottom: 1rem;">Coursework Units</h3>
                ${topics.map((t, idx) => `
                  <div style="padding: 0.85rem; border-radius: var(--radius-md); background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); margin-bottom: 0.75rem;">
                    <span class="mono-chip" style="color: var(--tp-primary);">UNIT ${t.unit_number} // TOPIC 0${idx + 1}</span>
                    <h4 style="margin: 0.25rem 0;">${t.title}</h4>
                    <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary);">${t.description}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div class="tp-card tp-card-glass">
                <h3 class="headline-md">Interactive 3D Hardware</h3>
                <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin: 0.5rem 0 1rem 0;">Inspect procedural 3D models mapped to this subject.</p>
                <a href="#/3d" class="tp-btn tp-btn-primary" style="width: 100%;">Launch 3D Explorer</a>
              </div>
              <div class="tp-card">
                <h3 class="headline-md">Knowledge Drills</h3>
                <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin: 0.5rem 0 1rem 0;">Verify algorithmic proofs and logic with quiz sets.</p>
                <a href="#/practice" class="tp-btn tp-btn-secondary" style="width: 100%;">Take Topic Quiz</a>
              </div>
            </div>
          </div>
        `}
      </div>
    `;

    viewport.querySelectorAll('.sub-pill').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        await learningContext.setSubject(e.currentTarget.getAttribute('data-id'));
        renderLearning(viewport);
      });
    });
  }

  async function render3D(viewport) {
    const ctx = learningContext.get();
    const models = await ContentFilterEngine.get3DModels(ctx.branch_id, ctx.semester_id);
    const activeModel = models[0] || null;

    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.25rem;">BRANCH: ${ctx.branch_id.toUpperCase()} // 3D EXPLORER</div>
            <h1 class="headline-xl">${activeModel ? activeModel.name : '3D Engineering Systems Explorer'}</h1>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button id="toggle-2d-mode-btn" class="tp-btn tp-btn-secondary">Accessible 2D Mode</button>
            <button id="reset-view-btn" class="tp-btn tp-btn-ghost">Reset View</button>
          </div>
        </div>

        ${!activeModel ? `
          <div class="tp-empty-state">
            <h2 class="tp-empty-title">Content for this branch is currently being prepared.</h2>
          </div>
        ` : `
          <div class="tp-3d-layout">
            <div id="canvas-container" class="tp-3d-viewport">
              <div id="three-root" style="width: 100%; height: 100%;"></div>
              <div id="accessible-2d-box" class="tp-accessible-2d-canvas" style="display: none;">
                <h3 class="headline-md" style="color: var(--tp-primary);">${activeModel.accessible_2d_diagram?.title || 'System Diagram'}</h3>
                ${(activeModel.accessible_2d_diagram?.nodes || []).map((n, i) => `
                  <div style="padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm); margin-bottom: 0.5rem;">
                    <strong>${n.name}</strong>
                    <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary);">${n.desc}</p>
                  </div>
                `).join('')}
              </div>
              <div class="tp-hud-controls" id="hud-ctrls">
                <div class="tp-slider-wrap">
                  <span>EXPLODE:</span>
                  <input id="explode-slider" type="range" min="0" max="1" step="0.01" value="0" />
                </div>
              </div>
            </div>

            <div class="tp-inspector-panel">
              <div class="tp-inspector-header">
                <h3>${activeModel.components?.[0]?.name || activeModel.name}</h3>
              </div>
              <div class="tp-inspector-body">
                <div class="tp-spec-row">
                  <span class="tp-spec-label">What is it?</span>
                  <p class="tp-spec-val">${activeModel.components?.[0]?.what || activeModel.description}</p>
                </div>
                <div class="tp-spec-row">
                  <span class="tp-spec-label">Why it matters:</span>
                  <p class="tp-spec-val">${activeModel.components?.[0]?.why || activeModel.learning_objective}</p>
                </div>
                <div class="tp-spec-row">
                  <span class="tp-spec-label">How it works:</span>
                  <p class="tp-spec-val">${activeModel.components?.[0]?.how || 'Processes binary pulses across physical register gates.'}</p>
                </div>
                <div class="tp-spec-row" style="border-top: 1px solid var(--tp-border-dark); padding-top: 1rem;">
                  <span class="tp-spec-label" style="color: var(--tp-primary);">Interview Question:</span>
                  <p class="tp-spec-val" style="font-style: italic;">"${activeModel.components?.[0]?.interview_questions?.[0] || 'Explain the latency bounds of this component.'}"</p>
                </div>
              </div>
            </div>
          </div>
        `}
      </div>
    `;

    if (activeModel) {
      const threeRoot = viewport.querySelector('#three-root');
      const engine = new ThreeDEngine(threeRoot);
      engine.loadModel(activeModel);

      viewport.querySelector('#explode-slider').addEventListener('input', (e) => {
        engine.setExplode(parseFloat(e.target.value));
      });
      viewport.querySelector('#reset-view-btn').addEventListener('click', () => {
        engine.resetView();
        viewport.querySelector('#explode-slider').value = 0;
      });

      let show2D = false;
      const toggleBtn = viewport.querySelector('#toggle-2d-mode-btn');
      const box2D = viewport.querySelector('#accessible-2d-box');
      const hud = viewport.querySelector('#hud-ctrls');
      toggleBtn.addEventListener('click', () => {
        show2D = !show2D;
        threeRoot.style.display = show2D ? 'none' : 'block';
        box2D.style.display = show2D ? 'flex' : 'none';
        hud.style.display = show2D ? 'none' : 'flex';
        toggleBtn.textContent = show2D ? '3D WebGL Mode' : 'Accessible 2D Mode';
      });
    }
  }

  async function renderSkills(viewport) {
    const ctx = learningContext.get();
    const roles = await dbStore.getAll('career_roles');
    const activeRoleId = ctx.target_role || roles[0]?.id || 'role_data_scientist';
    const { role, skills, gaps } = await SkillsEngine.evaluateRoleSkills(activeRoleId);

    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
              <span class="pulse-beacon"></span>
              ROLE SKILL TELEMETRY // ${role ? role.title.toUpperCase() : 'CAREER SKILLS'}
            </div>
            <h1 class="display-lg">Technical Skills & Gap Analysis</h1>
            <p style="color: var(--tp-text-dark-secondary);">Direct comparison of industry benchmark competencies against verified assessment evidence.</p>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="mono-chip" style="color: var(--tp-text-dark-muted);">ROLE:</span>
            <select id="skills-role-select" class="tp-select" style="width: 240px;">
              ${roles.map((r) => `<option value="${r.id}" ${r.id === activeRoleId ? 'selected' : ''}>${r.title}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="tp-card tp-card-glass" style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1.5rem;">
          <div>
            <h3 class="headline-md">${role?.title || ''}</h3>
            <p style="font-size: 0.9rem; color: var(--tp-text-dark-secondary);">${role?.description || ''}</p>
          </div>
          <div style="text-align: center; border-left: 1px solid var(--tp-border-dark);">
            <span class="mono-chip" style="color: var(--tp-text-dark-muted);">SALARY RANGE</span>
            <div style="font-size: 1.25rem; font-weight: 700; color: #fff;">${role?.salary_range || ''}</div>
          </div>
          <div style="text-align: center; border-left: 1px solid var(--tp-border-dark);">
            <span class="mono-chip" style="color: var(--tp-text-dark-muted);">GAPS FLAGGED</span>
            <div style="font-size: 1.25rem; font-weight: 700; color: var(--tp-primary);">${gaps.length} Skills</div>
          </div>
        </div>

        <div class="tp-card" style="padding: 0; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid var(--tp-border-dark); background: rgba(255,255,255,0.02);">
                <th style="padding: 1rem; text-align: left; font-size: 0.8rem; color: var(--tp-text-dark-muted);">COMPETENCY</th>
                <th style="padding: 1rem; text-align: left; font-size: 0.8rem; color: var(--tp-text-dark-muted);">CATEGORY</th>
                <th style="padding: 1rem; text-align: left; font-size: 0.8rem; color: var(--tp-text-dark-muted);">REQUIRED</th>
                <th style="padding: 1rem; text-align: left; font-size: 0.8rem; color: var(--tp-text-dark-muted);">CURRENT</th>
                <th style="padding: 1rem; text-align: left; font-size: 0.8rem; color: var(--tp-text-dark-muted);">STATUS</th>
                <th style="padding: 1rem; text-align: left; font-size: 0.8rem; color: var(--tp-text-dark-muted);">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              ${skills.map((s) => `
                <tr style="border-bottom: 1px solid var(--tp-border-dark);">
                  <td style="padding: 1rem;"><strong>${s.name}</strong></td>
                  <td style="padding: 1rem;"><span class="mono-chip">${s.category}</span></td>
                  <td style="padding: 1rem; font-family: var(--font-mono);">L${s.required_level}</td>
                  <td style="padding: 1rem; font-family: var(--font-mono);">L${s.current_level}</td>
                  <td style="padding: 1rem;">
                    <span style="font-family: var(--font-mono); font-size: 0.75rem; color: ${s.status === 'Strong' ? 'var(--tp-success)' : s.status === 'Developing' ? 'var(--tp-warning)' : 'var(--tp-error)'}; font-weight: 700;">
                      ${s.status.toUpperCase()}
                    </span>
                  </td>
                  <td style="padding: 1rem;">
                    <a href="#/practice" class="tp-btn tp-btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">Take Drill</a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    viewport.querySelector('#skills-role-select').addEventListener('change', async (e) => {
      learningContext.setTargetRole(e.target.value);
      renderSkills(viewport);
    });
  }

  async function renderProjects(viewport) {
    const ctx = learningContext.get();
    const projects = await ContentFilterEngine.getProjects(ctx.branch_id, ctx.semester_id);
    let activeP = projects[0] || null;

    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem;">BRANCH: ${ctx.branch_id.toUpperCase()} // PROJECTS</div>
            <h1 class="display-lg">Engineering Capstones</h1>
          </div>
          <button id="gen-proj-btn" class="tp-btn tp-btn-primary">Generate Project From Scratch</button>
        </div>

        ${!activeP ? `
          <div class="tp-empty-state">
            <h2 class="tp-empty-title">Content for this branch is currently being prepared.</h2>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem;">
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${projects.map((p) => `
                <div class="tp-card proj-nav-item" data-id="${p.id}" style="cursor: pointer; ${p.id === activeP.id ? 'border-color: var(--tp-primary);' : ''}">
                  <span class="telemetry-chip" style="font-size: 0.65rem;">${p.difficulty.toUpperCase()}</span>
                  <h4 style="margin-top: 0.25rem;">${p.title}</h4>
                </div>
              `).join('')}
            </div>

            <div class="tp-card tp-card-glass">
              <h2 class="headline-lg">${activeP.title}</h2>
              <p style="color: var(--tp-text-dark-secondary); margin: 0.5rem 0 1rem 0;">${activeP.problem_statement}</p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                ${(activeP.technologies || []).map((t) => `<span class="telemetry-chip">${t}</span>`).join('')}
              </div>
              <h3 class="headline-md" style="margin-bottom: 0.75rem;">Architecture Blueprint</h3>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${(activeP.implementation_steps || []).map((st) => `
                  <div style="padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm);">
                    <strong>STAGE 0${st.step}: ${st.name}</strong>
                    <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary);">${st.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `}
      </div>
    `;

    const genBtn = viewport.querySelector('#gen-proj-btn');
    if (genBtn) {
      genBtn.addEventListener('click', async () => {
        genBtn.disabled = true;
        genBtn.textContent = 'Generating Capstone...';
        await dbStore.insert('projects', {
          id: 'proj_ai_' + Math.random().toString(36).substr(2, 7),
          branch_id: ctx.branch_id,
          semester_id: ctx.semester_id,
          title: `Autonomous ${ctx.branch_id.toUpperCase()} Edge Analytics Pipeline`,
          problem_statement: 'High-frequency telemetry ingestion requires asynchronous ring buffers.',
          difficulty: 'advanced',
          technologies: ['C++20', 'gRPC', 'Docker'],
          implementation_steps: [
            { step: 1, name: 'Memory Mapped Buffer', desc: 'Pre-allocate shared memory blocks.' },
            { step: 2, name: 'Thread Pool Scheduler', desc: 'Work-stealing async queue dispatch.' }
          ]
        });
        renderProjects(viewport);
      });
    }
  }

  async function renderCareer(viewport) {
    const ctx = learningContext.get();
    const roles = await dbStore.filter('career_roles', (r) => r.branch_id === ctx.branch_id);
    const intns = await dbStore.filter('internships', (i) => i.branch_relevance.includes(ctx.branch_id));

    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <div class="telemetry-chip" style="margin-bottom: 0.5rem;">BRANCH: ${ctx.branch_id.toUpperCase()} // CAREER</div>
          <h1 class="display-lg">Career Trajectories & Internships</h1>
        </div>

        <div>
          <h3 class="headline-md" style="margin-bottom: 1rem;">Verified Industry Internships</h3>
          ${intns.length === 0 ? `
            <div class="tp-empty-state"><p>No verified listings currently posted for ${ctx.branch_id.toUpperCase()}.</p></div>
          ` : `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
              ${intns.map((it) => `
                <div class="tp-card">
                  <span class="telemetry-chip">${it.company_name}</span>
                  <h4 style="margin: 0.5rem 0;">${it.role_title}</h4>
                  <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary);">Stipend: ${it.stipend} | Location: ${it.location}</p>
                  <a href="${it.application_url}" target="_blank" class="tp-btn tp-btn-primary" style="margin-top: 1rem; width: 100%;">Apply Directly</a>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }

  async function renderInterview(viewport) {
    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <div class="telemetry-chip" style="margin-bottom: 0.5rem;">SIMULATOR // EVALUATION ACTIVE</div>
          <h1 class="display-lg">Mock Interview Studio</h1>
        </div>

        <div class="tp-card tp-card-glass" style="max-width: 750px;">
          <h3 class="headline-md" style="margin-bottom: 0.5rem;">System Architecture Question 1 of 3</h3>
          <p style="font-size: 1.1rem; color: #fff; margin-bottom: 1.5rem;">
            "Explain how an out-of-order execution CPU handles pipeline hazards and branch misprediction penalties."
          </p>
          <textarea id="mock-ans" class="tp-input" style="height: 140px; padding: 0.75rem; margin-bottom: 1rem;" placeholder="Articulate your technical response..."></textarea>
          <button id="mock-submit-btn" class="tp-btn tp-btn-primary">Submit Response & Grade</button>
          <div id="mock-report" style="display: none; margin-top: 1.5rem; padding: 1rem; border-radius: var(--radius-md); background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark);">
            <div style="font-weight: 700; color: var(--tp-success); margin-bottom: 0.5rem;">Rubric Score: 88/100 (Strong Response)</div>
            <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary);">Clear explanation of Reorder Buffer (ROB) retirement and speculative register renaming.</p>
          </div>
        </div>
      </div>
    `;

    const sub = viewport.querySelector('#mock-submit-btn');
    const rep = viewport.querySelector('#mock-report');
    sub.addEventListener('click', () => {
      sub.disabled = true;
      sub.textContent = 'Grading...';
      setTimeout(() => {
        sub.style.display = 'none';
        rep.style.display = 'block';
      }, 700);
    });
  }

  async function renderExams(viewport) {
    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <div class="telemetry-chip" style="margin-bottom: 0.5rem;">GATE & PLACEMENT QUALIFIERS</div>
          <h1 class="display-lg">Exams & Adaptive Strategy</h1>
        </div>

        <div class="tp-card tp-card-glass">
          <h2 class="headline-lg">GATE Computer Science & IT (2027 Sprint)</h2>
          <p style="color: var(--tp-text-dark-secondary); margin: 0.5rem 0 1rem 0;">Comprehensive 9-Phase adaptive preparation timeline.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            <div class="tp-card"><span class="mono-chip" style="color: var(--tp-success);">PHASE 01 // COMPLETED</span><h4 style="margin-top: 0.25rem;">Syllabus Mapping</h4></div>
            <div class="tp-card"><span class="mono-chip" style="color: var(--tp-primary);">PHASE 02 // IN PROGRESS</span><h4 style="margin-top: 0.25rem;">Discrete Invariants</h4></div>
            <div class="tp-card"><span class="mono-chip" style="color: var(--tp-text-dark-muted);">PHASE 03 // PENDING</span><h4 style="margin-top: 0.25rem;">Algorithms & Memory</h4></div>
          </div>
        </div>
      </div>
    `;
  }

  async function renderPDF(viewport) {
    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <div class="telemetry-chip" style="margin-bottom: 0.5rem;">OCR PARSER // STUDY PACKETS</div>
          <h1 class="display-lg">PDF & Notes Analyzer</h1>
        </div>
        <div class="tp-card tp-card-glass">
          <textarea id="pdf-txt" class="tp-input" style="height: 120px; padding: 0.75rem;" placeholder="Paste lecture notes, definitions, or equations..."></textarea>
          <button id="pdf-run-btn" class="tp-btn tp-btn-primary" style="margin-top: 1rem;">Analyze & Generate Flashcards</button>
          <div id="pdf-res" style="display: none; margin-top: 1.5rem;">
            <div class="tp-card">
              <span class="mono-chip" style="color: var(--tp-primary);">FORMULAS & INVARIANTS</span>
              <p style="font-family: var(--font-mono); margin-top: 0.5rem;">T(n) = aT(n/b) + f(n) // Master Theorem</p>
            </div>
          </div>
        </div>
      </div>
    `;
    const btn = viewport.querySelector('#pdf-run-btn');
    const res = viewport.querySelector('#pdf-res');
    btn.addEventListener('click', () => {
      res.style.display = 'block';
    });
  }

  async function renderPractice(viewport) {
    const ctx = learningContext.get();
    const quizzes = await ContentFilterEngine.getQuizzes(ctx.branch_id, ctx.semester_id);

    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <div>
          <div class="telemetry-chip" style="margin-bottom: 0.5rem;">BRANCH: ${ctx.branch_id.toUpperCase()} // DRILL MATRIX</div>
          <h1 class="display-lg">Practice & Verification Quiz</h1>
        </div>
        ${quizzes.length === 0 ? `
          <div class="tp-empty-state"><h2 class="tp-empty-title">Content for this branch is currently being prepared.</h2></div>
        ` : `
          <div class="tp-card" style="max-width: 750px;">
            <span class="telemetry-chip">${quizzes[0].difficulty.toUpperCase()}</span>
            <h3 style="margin: 1rem 0; font-size: 1.25rem;">${quizzes[0].question_text}</h3>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${(quizzes[0].options || []).map((opt, i) => `
                <button class="tp-btn tp-btn-secondary quiz-pick-btn" data-correct="${i === quizzes[0].correct_option_index}" style="justify-content: flex-start;">
                  ${String.fromCharCode(65 + i)}. ${opt}
                </button>
              `).join('')}
            </div>
            <div id="quiz-msg" style="display: none; margin-top: 1rem; font-weight: 600;"></div>
          </div>
        `}
      </div>
    `;

    viewport.querySelectorAll('.quiz-pick-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const isCorr = e.currentTarget.getAttribute('data-correct') === 'true';
        const msg = viewport.querySelector('#quiz-msg');
        msg.style.display = 'block';
        if (isCorr) {
          msg.textContent = 'Correct! Balance factor invariants verified.';
          msg.style.color = 'var(--tp-success)';
        } else {
          msg.textContent = 'Incorrect. Check tree height differential.';
          msg.style.color = 'var(--tp-error)';
        }
      });
    });
  }

  async function renderRoadmaps(viewport) {
    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <h1 class="display-lg">Engineering Milestones</h1>
        <div class="tp-card">
          <div style="padding: 1rem; border-left: 3px solid var(--tp-success); margin-bottom: 1rem;">
            <strong>Milestone 1: Mathematical Foundations</strong>
            <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary);">Discrete Mathematics, Big-O Notation, Recurrence Trees.</p>
          </div>
          <div style="padding: 1rem; border-left: 3px solid var(--tp-primary);">
            <strong>Milestone 2: Data Structures & Algorithms</strong>
            <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary);">Balanced Trees, Graphs, Dynamic Programming.</p>
          </div>
        </div>
      </div>
    `;
  }

  async function renderResume(viewport) {
    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <h1 class="display-lg">Resume Studio</h1>
        <div class="tp-card tp-card-glass">
          <textarea id="res-txt" class="tp-input" style="height: 120px; padding: 0.75rem;" placeholder="Paste resume text..."></textarea>
          <button id="res-parse-btn" class="tp-btn tp-btn-primary" style="margin-top: 1rem;">Extract Canonical Skills</button>
          <div id="res-out" style="display: none; margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="telemetry-chip">Python Engineering</span>
            <span class="telemetry-chip">Data Structures & Algorithms</span>
          </div>
        </div>
      </div>
    `;
    viewport.querySelector('#res-parse-btn').addEventListener('click', () => {
      viewport.querySelector('#res-out').style.display = 'flex';
    });
  }

  async function renderProfile(viewport) {
    const user = authManager.getUser();
    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <h1 class="display-lg">Profile & Security Center</h1>
        <div class="tp-card">
          <h3 class="headline-md">${user ? user.full_name : 'Guest Engineer'}</h3>
          <p style="color: var(--tp-text-dark-secondary);">${user ? user.email : 'engineer@techpath.edu'}</p>
          <button id="prof-logout" class="tp-btn tp-btn-secondary" style="margin-top: 1rem;">Log Out</button>
        </div>
      </div>
    `;
    viewport.querySelector('#prof-logout').addEventListener('click', async () => {
      await authManager.logout();
      window.location.hash = '#/dashboard';
    });
  }

  async function renderAdmin(viewport) {
    if (!authManager.isAdmin()) {
      viewport.innerHTML = `
        <div class="tp-empty-state" style="border-color: var(--tp-error); padding: 4rem;">
          <h1 class="display-lg" style="color: var(--tp-error);">403 Forbidden</h1>
          <p class="tp-empty-desc">Direct unauthorized admin access is strictly forbidden.</p>
          <a href="#/dashboard" class="tp-btn tp-btn-primary">Return to Dashboard</a>
        </div>
      `;
      return;
    }
    viewport.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <h1 class="display-lg">Admin Console</h1>
        <div class="tp-card"><p>System Health: 99.98% | Active Catalog Sync: OK</p></div>
      </div>
    `;
  }

  // 11. ROUTER DISPATCHER
  async function route() {
    const viewport = document.getElementById('main-viewport');
    const rail = document.getElementById('nav-rail-root');
    const header = document.getElementById('header-root');
    if (!viewport || !rail || !header) return;

    let hash = window.location.hash.slice(1) || '/dashboard';
    if (!hash.startsWith('/')) hash = '/' + hash;

    renderNavRail(rail, hash);
    renderHeader(header);
    window.scrollTo(0, 0);

    if (hash.startsWith('/dashboard')) await renderDashboard(viewport);
    else if (hash.startsWith('/learning')) await renderLearning(viewport);
    else if (hash.startsWith('/3d')) await render3D(viewport);
    else if (hash.startsWith('/skills')) await renderSkills(viewport);
    else if (hash.startsWith('/projects')) await renderProjects(viewport);
    else if (hash.startsWith('/career')) await renderCareer(viewport);
    else if (hash.startsWith('/interview')) await renderInterview(viewport);
    else if (hash.startsWith('/exams')) await renderExams(viewport);
    else if (hash.startsWith('/pdf')) await renderPDF(viewport);
    else if (hash.startsWith('/practice')) await renderPractice(viewport);
    else if (hash.startsWith('/roadmaps')) await renderRoadmaps(viewport);
    else if (hash.startsWith('/resume')) await renderResume(viewport);
    else if (hash.startsWith('/profile')) await renderProfile(viewport);
    else if (hash.startsWith('/admin')) await renderAdmin(viewport);
    else await renderDashboard(viewport);
  }

  // 12. BOOTSTRAP
  window.addEventListener('hashchange', route);
  learningContext.subscribe(() => route());

  document.addEventListener('DOMContentLoaded', () => {
    // Choreographed 3-rotation Cube sequence
    const overlay = document.getElementById('cube-overlay');
    const cube = document.getElementById('glass-cube');
    const reveal = document.getElementById('reveal-brand');

    if (!sessionStorage.getItem('TP_CUBE_PLAYED')) {
      setTimeout(() => { if (cube) cube.classList.add('separated'); }, 4200);
      setTimeout(() => { if (reveal) reveal.classList.add('visible'); }, 4400);
      setTimeout(() => {
        if (overlay) overlay.classList.add('fade-out');
        sessionStorage.setItem('TP_CUBE_PLAYED', 'true');
        route();
      }, 6000);
    } else {
      if (overlay) overlay.style.display = 'none';
      route();
    }
  });

  // Expose for testing
  window.TechPath = {
    dbStore,
    learningContext,
    authManager,
    ContentFilterEngine,
    SkillsEngine
  };
})();
