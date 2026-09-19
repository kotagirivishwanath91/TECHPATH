/**
 * TECHPATH — INTERNSHIP ENGINE
 * Canonical verified engineering opportunities, personalized matching,
 * multi-faceted filtering, and dual Supabase / IndexedDB tracking.
 */

import { dbStore } from '../db/store.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export const CANONICAL_INTERNSHIPS = [
  {
    id: 'intn_msft_01',
    company_name: 'Microsoft',
    role_title: 'Software Engineering Intern — Core Cloud & Systems',
    branch_relevance: ['cse', 'aiml', 'ece'],
    track: 'Software Systems',
    location: 'Bengaluru / Hyderabad, India',
    work_mode: 'hybrid',
    stipend: '₹1,25,000 / month',
    duration: '2 – 6 Months (Summer / Fall 2026)',
    deadline: '2026-11-15',
    eligibility: 'B.Tech / B.E. in CSE / ECE / Allied (Semester 5 or above) with min 7.5 CGPA',
    min_semester: 5,
    required_skills: ['Data Structures & Algorithms', 'C++', 'Python', 'Operating Systems', 'Git'],
    preferred_skills: ['Distributed Systems', 'Cloud Computing', 'Docker', 'Linux Internals'],
    description: 'Join Microsoft India Development Center (IDC) to engineer hyperscale distributed services, developer tooling, and core operating system components powering Azure and Microsoft 365.',
    responsibilities: [
      'Design, implement, and benchmark resilient services handling millions of requests per second.',
      'Collaborate with global engineering teams on distributed caching, telemetry, and fault-tolerant algorithms.',
      'Write clean, modular, and unit-tested production code following modern asynchronous design patterns.'
    ],
    application_url: 'https://careers.microsoft.com',
    source: 'Microsoft Official University Careers',
    is_verified: true
  },
  {
    id: 'intn_ti_02',
    company_name: 'Texas Instruments',
    role_title: 'Analog & Embedded Firmware Engineering Intern',
    branch_relevance: ['ece', 'eee', 'cse'],
    track: 'Embedded & Hardware',
    location: 'Bengaluru, Karnataka',
    work_mode: 'onsite',
    stipend: '₹75,000 / month',
    duration: '6 Months (Jan – Jun 2026 / Jul – Dec 2026)',
    deadline: '2026-10-30',
    eligibility: 'B.Tech in ECE / EEE / Instrumentation (Semester 5+) with solid circuits foundation',
    min_semester: 5,
    required_skills: ['Embedded C', 'Microcontrollers', 'Digital Electronics', 'Circuit Analysis'],
    preferred_skills: ['RTOS', 'ARM Cortex-M', 'SPI / I2C / UART Protocols', 'Oscilloscopes & Logic Analyzers'],
    description: 'Work alongside premier semiconductor designers at TI India. Focus on board bring-up, real-time firmware architecture, sensor signal conditioning, and low-power power management ICs.',
    responsibilities: [
      'Develop embedded C drivers and test routines for next-generation TI ARM Cortex microcontrollers.',
      'Characterize analog-to-digital converters (ADCs) and high-speed operational amplifiers in laboratory testbenches.',
      'Debug hardware-firmware boundary conditions using protocol analyzers and oscilloscopes.'
    ],
    application_url: 'https://ti.com/careers',
    source: 'Texas Instruments University Talent Program',
    is_verified: true
  },
  {
    id: 'intn_nvda_03',
    company_name: 'NVIDIA',
    role_title: 'Deep Learning & Accelerated Systems Intern',
    branch_relevance: ['aiml', 'cse', 'ece'],
    track: 'AI & Data',
    location: 'Pune / Bengaluru / Hybrid',
    work_mode: 'hybrid',
    stipend: '₹1,10,000 / month',
    duration: '6 Months (Summer / Fall 2026)',
    deadline: '2026-11-20',
    eligibility: 'B.Tech / Dual Degree in AI/ML, CSE or Math & Computing (Semester 5+)',
    min_semester: 5,
    required_skills: ['Python', 'PyTorch', 'Data Structures & Algorithms', 'Linear Algebra', 'Git'],
    preferred_skills: ['CUDA', 'TensorRT', 'Transformer Architectures', 'C++'],
    description: 'Innovate with the pioneers of accelerated computing. Optimize deep learning inference, model quantization, and distributed tensor pipelines across NVIDIA Hopper and Blackwell architectures.',
    responsibilities: [
      'Profile and optimize deep learning model training and inference pipelines using NVIDIA Nsight tools.',
      'Benchmark memory bandwidth, kernel execution times, and multi-GPU communication latency.',
      'Contribute to open-source inference runtimes and high-performance neural operator kernels.'
    ],
    application_url: 'https://nvidia.com/careers',
    source: 'NVIDIA University Recruiting Portal',
    is_verified: true
  },
  {
    id: 'intn_intel_04',
    company_name: 'Intel Corporation',
    role_title: 'Silicon Architecture & VLSI Logic Verification Intern',
    branch_relevance: ['ece', 'eee', 'cse'],
    track: 'Embedded & Hardware',
    location: 'Bengaluru, Karnataka',
    work_mode: 'onsite',
    stipend: '₹70,000 / month',
    duration: '6 Months (Summer 2026)',
    deadline: '2026-10-25',
    eligibility: 'B.Tech in ECE / EEE (Semester 5+) with coursework in Computer Architecture and Digital Logic',
    min_semester: 5,
    required_skills: ['Verilog / SystemVerilog', 'Digital Design', 'Computer Architecture', 'Linux'],
    preferred_skills: ['UVM (Universal Verification Methodology)', 'Static Timing Analysis', 'Python Scripting'],
    description: 'Join Intel India hardware engineering teams designing next-generation processor cores, memory subsystem interconnects, and silicon verification environments.',
    responsibilities: [
      'Write SystemVerilog functional coverage points and constrained random testbenches.',
      'Simulate RTL designs and resolve timing violations across corner process variations.',
      'Automate verification regressions using Python and Makefile tooling on high-performance compute clusters.'
    ],
    application_url: 'https://jobs.intel.com',
    source: 'Intel Global University Portal',
    is_verified: true
  },
  {
    id: 'intn_lt_05',
    company_name: 'Larsen & Toubro (L&T Construction)',
    role_title: 'Structural Design & Smart Infrastructure Engineering Intern',
    branch_relevance: ['civil', 'mech'],
    track: 'Civil & Infrastructure',
    location: 'Chennai / Mumbai / On-Site Project Hubs',
    work_mode: 'onsite',
    stipend: '₹45,000 / month',
    duration: '3 – 6 Months (Summer / Fall 2026)',
    deadline: '2026-11-05',
    eligibility: 'B.Tech in Civil Engineering or Structural Engineering (Semester 5+) with min 7.0 CGPA',
    min_semester: 5,
    required_skills: ['Structural Analysis', 'AutoCAD', 'Reinforced Concrete Design', 'Strength of Materials'],
    preferred_skills: ['STAAD.Pro', 'ETABS', 'BIM (Building Information Modeling)', 'Geotechnical Engineering'],
    description: 'Work with India’s leading infrastructure builder on iconic transport corridors, high-rise structural foundations, and mega smart-city civil engineering projects.',
    responsibilities: [
      'Assist senior structural consultants with 3D structural analysis models using STAAD.Pro and ETABS.',
      'Verify load combinations, shear wall reinforcement schedules, and seismic resistance parameters.',
      'Participate in on-site quality assurance, concrete mix batching verifications, and digital BIM inspections.'
    ],
    application_url: 'https://larsentoubro.com/careers',
    source: 'L&T Campus Talent Program',
    is_verified: true
  },
  {
    id: 'intn_tata_06',
    company_name: 'Tata Motors',
    role_title: 'Electric Vehicle Powertrain & Mechanical CAE Intern',
    branch_relevance: ['mech', 'eee', 'ece'],
    track: 'Mechanical & Automotive',
    location: 'Pune, Maharashtra',
    work_mode: 'onsite',
    stipend: '₹50,000 / month',
    duration: '6 Months (Summer / Fall 2026)',
    deadline: '2026-11-10',
    eligibility: 'B.Tech in Mechanical / Electrical / Automobile Engineering (Semester 5+) with CAD foundations',
    min_semester: 5,
    required_skills: ['SolidWorks / CATIA', 'Thermodynamics', 'Mechanics of Materials', 'Finite Element Analysis'],
    preferred_skills: ['ANSYS Mechanical / Fluent', 'Thermal Management', 'Battery Pack Design', 'MATLAB/Simulink'],
    description: 'Shape the future of electric mobility at Tata Motors Passenger Electric Mobility (TPEM). Engage in battery enclosure thermal simulation, chassis fatigue analysis, and powertrain packaging.',
    responsibilities: [
      'Perform FEA structural and vibration simulations on automotive chassis and suspension sub-assemblies.',
      'Model conjugate heat transfer for EV battery packs under rigorous Indian thermal ambient conditions.',
      'Validate physical test rig results against simulation predictions and propose weight-saving material optimizations.'
    ],
    application_url: 'https://tatamotors.com/careers',
    source: 'Tata Motors Technical Centre (ERC)',
    is_verified: true
  },
  {
    id: 'intn_bosch_07',
    company_name: 'Robert Bosch Engineering (BGSW)',
    role_title: 'Automotive IoT & Embedded Systems Intern',
    branch_relevance: ['ece', 'eee', 'cse', 'aiml'],
    track: 'Embedded & Hardware',
    location: 'Coimbatore / Bengaluru, India',
    work_mode: 'hybrid',
    stipend: '₹55,000 / month',
    duration: '6 Months (Summer 2026)',
    deadline: '2026-11-25',
    eligibility: 'B.Tech in ECE / EEE / CSE (Semester 5+) with keen interest in automotive IoT and microcontrollers',
    min_semester: 5,
    required_skills: ['C / Embedded C', 'CAN Bus Protocol', 'Microcontrollers', 'Linux'],
    preferred_skills: ['AUTOSAR Architecture', 'Python for Hardware In Loop (HIL)', 'MQTT / IoT Protocols'],
    description: 'Develop connected vehicle mobility platforms, body control modules, and smart sensor interfaces powering international automotive OEMs.',
    responsibilities: [
      'Implement CAN/LIN communication stacks for automotive electronic control units (ECUs).',
      'Construct automated test sequences in Python for Hardware-in-the-Loop (HIL) simulators.',
      'Ensure software compliance with ISO 26262 functional safety guidelines.'
    ],
    application_url: 'https://careers.bosch.com',
    source: 'Bosch Global Software Technologies (BGSW)',
    is_verified: true
  },
  {
    id: 'intn_isro_08',
    company_name: 'ISRO / National Aerospace Labs',
    role_title: 'Space Robotics & Guidance Controls Research Fellow',
    branch_relevance: ['ece', 'mech', 'eee', 'cse'],
    track: 'Aerospace & Robotics',
    location: 'Bengaluru / Thiruvananthapuram',
    work_mode: 'onsite',
    stipend: '₹40,000 / month',
    duration: '6 – 12 Months Research Fellowship',
    deadline: '2026-10-31',
    eligibility: 'B.Tech / B.E. (Semester 5+) in ECE, Mech, or EEE with minimum 8.0 CGPA and Indian Citizenship',
    min_semester: 5,
    required_skills: ['Control Systems', 'MATLAB / Simulink', 'Differential Equations', 'C++'],
    preferred_skills: ['State-Space Controls', 'ROS (Robot Operating System)', 'Kalman Filtering', 'Orbital Mechanics'],
    description: 'Conduct foundational research on attitude determination, autonomous docking kinematics, and trajectory simulation for interplanetary and satellite payload systems.',
    responsibilities: [
      'Formulate mathematical models for multi-axis attitude control thrusters and reaction wheel assemblies.',
      'Implement extended Kalman filter (EKF) sensor fusion combining star trackers, IMUs, and sun sensors.',
      'Document simulation benchmarks and publish research reports reviewed by ISRO senior scientists.'
    ],
    application_url: 'https://isro.gov.in/Careers.html',
    source: 'ISRO Research Fellowship Directorate',
    is_verified: true
  },
  {
    id: 'intn_stripe_09',
    company_name: 'Stripe',
    role_title: 'Systems & Infrastructure Software Intern',
    branch_relevance: ['cse', 'aiml'],
    track: 'Software Systems',
    location: 'Bengaluru / Remote',
    work_mode: 'remote',
    stipend: '₹1,30,000 / month',
    duration: '3 – 6 Months (Summer / Fall 2026)',
    deadline: '2026-11-12',
    eligibility: 'B.Tech in CSE / IT / Software Engineering (Semester 5+) with experience in systems programming',
    min_semester: 5,
    required_skills: ['Go', 'Python', 'Distributed Systems', 'SQL', 'Git'],
    preferred_skills: ['Kubernetes', 'gRPC', 'Database Internals', 'Linux Networking'],
    description: 'Engineer economic infrastructure for the internet. Work on high-reliability ledger engines, multi-region database failover, and global payment routing with 99.999% availability.',
    responsibilities: [
      'Implement idempotent transactional services processing millions of financial events securely.',
      'Instrument distributed tracing and latency breakdown across microservices using OpenTelemetry.',
      'Participate in high-volume architecture design reviews and automated chaos engineering tests.'
    ],
    application_url: 'https://stripe.com/jobs',
    source: 'Stripe Engineering Careers',
    is_verified: true
  },
  {
    id: 'intn_schneider_10',
    company_name: 'Schneider Electric',
    role_title: 'Smart Grid Automation & Power Systems Intern',
    branch_relevance: ['eee', 'ece'],
    track: 'Power Systems',
    location: 'Bengaluru / Vadodara, India',
    work_mode: 'onsite',
    stipend: '₹50,000 / month',
    duration: '6 Months (Summer 2026)',
    deadline: '2026-11-18',
    eligibility: 'B.Tech in Electrical & Electronics Engineering (Semester 5+) with power systems coursework',
    min_semester: 5,
    required_skills: ['Power Systems Analysis', 'Circuit Theory', 'MATLAB', 'Electrical Machines'],
    preferred_skills: ['SCADA / PLC', 'IEC 61850 Protocol', 'Renewable Energy Grid Inverters', 'ETAP'],
    description: 'Design digital substation architectures, renewable grid interconnection relays, and microgrid energy management algorithms promoting sustainable net-zero power distribution.',
    responsibilities: [
      'Model load flow, short circuit current distributions, and protection coordination using ETAP software.',
      'Configure smart protection relays communicating over IEC 61850 substation Ethernet buses.',
      'Test solar inverter islanding detection routines against national grid electrical compliance standards.'
    ],
    application_url: 'https://se.com/careers',
    source: 'Schneider Electric University Program',
    is_verified: true
  },
  {
    id: 'intn_qualcomm_11',
    company_name: 'Qualcomm',
    role_title: 'Wireless Modem & Digital Signal Processing Intern',
    branch_relevance: ['ece', 'eee', 'cse'],
    track: 'Embedded & Hardware',
    location: 'Hyderabad / Bengaluru, India',
    work_mode: 'hybrid',
    stipend: '₹85,000 / month',
    duration: '6 Months (Summer / Fall 2026)',
    deadline: '2026-11-30',
    eligibility: 'B.Tech / M.Tech in ECE / EE / Telecommunications (Semester 5+) with signals & systems mastery',
    min_semester: 5,
    required_skills: ['Digital Signal Processing', 'C / C++', 'Signals & Systems', 'Probability & Random Processes'],
    preferred_skills: ['5G / LTE Physical Layer', 'MIMO Channel Estimation', 'Fixed-Point DSP Math', 'MATLAB'],
    description: 'Work on the cutting edge of 5G Advanced and 6G cellular modem algorithms. Prototype physical layer receiver pipelines, channel decoders, and beamforming matrix calculations.',
    responsibilities: [
      'Simulate multi-user MIMO beamforming algorithms under challenging multipath fading channel models.',
      'Translate floating-point algorithm specifications into cycle-accurate fixed-point C/C++ simulations.',
      'Validate modem throughput across hardware emulator test vectors and test chambers.'
    ],
    application_url: 'https://qualcomm.com/company/careers',
    source: 'Qualcomm University Relations',
    is_verified: true
  },
  {
    id: 'intn_amazon_12',
    company_name: 'Amazon Web Services (AWS)',
    role_title: 'Software Development Engineer Intern — Cloud Platforms',
    branch_relevance: ['cse', 'aiml', 'ece'],
    track: 'Software Systems',
    location: 'Bengaluru / Hyderabad, India',
    work_mode: 'hybrid',
    stipend: '₹1,20,000 / month',
    duration: '3 – 6 Months (Summer 2026)',
    deadline: '2026-11-22',
    eligibility: 'B.Tech in CSE / IT / ECE (Semester 5+) with strong problem-solving and algorithmic skills',
    min_semester: 5,
    required_skills: ['Java / C++', 'Data Structures & Algorithms', 'Object-Oriented Design', 'SQL / NoSQL', 'Git'],
    preferred_skills: ['AWS Services (EC2, S3, Lambda)', 'Distributed Systems', 'System Design', 'CI/CD'],
    description: 'Build planet-scale services powering AWS cloud computing infrastructure. Work on storage reliability, serverless execution runtimes, and high-throughput network load balancers.',
    responsibilities: [
      'Implement scalable REST and gRPC service endpoints with strict SLA latency guarantees.',
      'Deploy automated canary pipelines, integration tests, and CloudWatch operational metrics dashboards.',
      'Collaborate with principal engineers to review architecture specifications and solve distributed consensus problems.'
    ],
    application_url: 'https://amazon.jobs',
    source: 'Amazon Student Programs',
    is_verified: true
  }
];

export class InternshipEngine {
  /**
   * Initializes and syncs canonical internships into the local store
   */
  static async initInternships() {
    try {
      const existing = await dbStore.getAll('internships');
      if (!existing || existing.length === 0) {
        for (const intn of CANONICAL_INTERNSHIPS) {
          await dbStore.insert('internships', intn);
        }
      } else {
        // Sync any new canonical postings
        const existingIds = new Set(existing.map(i => i.id));
        for (const intn of CANONICAL_INTERNSHIPS) {
          if (!existingIds.has(intn.id)) {
            await dbStore.insert('internships', intn);
          }
        }
      }
    } catch (err) {
      console.warn('Could not initialize local internships store:', err);
    }
  }

  /**
   * Calculates a personalized relevance score (0–100%) based on candidate's profile
   */
  static calculateRelevance(internship, profile = {}) {
    let score = 0;
    const userBranch = (profile.branch_id || profile.branch || 'cse').toLowerCase();
    const userSkills = (profile.skills || []).map(s => s.toLowerCase());
    const userRole = (profile.target_role || profile.career_goal || '').toLowerCase();
    const userSem = parseInt(String(profile.semester_id || profile.semester || 'sem_5').replace('sem_', ''), 10) || 5;

    // 1. Branch Relevance (Up to 35 points)
    const relBranches = (internship.branch_relevance || []).map(b => b.toLowerCase());
    if (relBranches.includes(userBranch)) {
      score += 35;
    } else {
      // Allied engineering bonus
      const alliedMap = {
        cse: ['aiml', 'ece'],
        aiml: ['cse', 'ece'],
        ece: ['eee', 'cse'],
        eee: ['ece', 'mech'],
        mech: ['civil', 'eee'],
        civil: ['mech']
      };
      const allied = alliedMap[userBranch] || [];
      if (relBranches.some(b => allied.includes(b))) {
        score += 18;
      } else {
        score += 5;
      }
    }

    // 2. Target Role & Career Goal (Up to 25 points)
    const titleLower = internship.role_title.toLowerCase();
    const trackLower = (internship.track || '').toLowerCase();
    if (userRole) {
      const roleKeywords = userRole.split(/\s+/).filter(w => w.length > 3);
      const matchesKeyword = roleKeywords.some(k => titleLower.includes(k) || trackLower.includes(k));
      if (matchesKeyword) {
        score += 25;
      } else if (titleLower.includes('software') && userRole.includes('engineer')) {
        score += 18;
      } else {
        score += 8;
      }
    } else {
      score += 15;
    }

    // 3. Required Skills Match (Up to 25 points)
    const reqSkills = internship.required_skills || [];
    if (reqSkills.length > 0 && userSkills.length > 0) {
      let matchedCount = 0;
      reqSkills.forEach(rs => {
        const rsLower = rs.toLowerCase();
        if (userSkills.some(us => us.includes(rsLower) || rsLower.includes(us))) {
          matchedCount++;
        }
      });
      const skillRatio = matchedCount / reqSkills.length;
      score += Math.round(skillRatio * 25);
    } else {
      score += 12;
    }

    // 4. Semester Eligibility (Up to 10 points)
    if (userSem >= (internship.min_semester || 3)) {
      score += 10;
    } else {
      score += 3;
    }

    // 5. Work Mode / Preferred Match (Up to 5 points)
    const prefMode = (profile.internship_pref || 'remote_or_hybrid').toLowerCase();
    if (prefMode.includes(internship.work_mode) || (prefMode.includes('hybrid') && internship.work_mode === 'remote')) {
      score += 5;
    } else {
      score += 2;
    }

    return Math.min(Math.max(score, 10), 99);
  }

  /**
   * Retrieves all internships enriched with user's tracking state and calculated relevance
   */
  static async getPersonalizedInternships(profile = {}, filters = {}, userId = 'usr_guest') {
    await this.initInternships();

    let allInternships = [];
    try {
      allInternships = await dbStore.getAll('internships');
    } catch {
      allInternships = CANONICAL_INTERNSHIPS;
    }

    if (!allInternships || allInternships.length === 0) {
      allInternships = CANONICAL_INTERNSHIPS;
    }

    // Load user tracking records
    const userTracking = await this.getUserInternships(userId);
    const trackingMap = new Map();
    userTracking.forEach(t => {
      trackingMap.set(t.internship_id, t);
    });

    // Enrich with relevance and tracking info
    const enriched = allInternships.map(intn => {
      const relevance = this.calculateRelevance(intn, profile);
      const tracking = trackingMap.get(intn.id) || null;
      
      // Determine which required skills the user has
      const userSkills = (profile.skills || []).map(s => s.toLowerCase());
      const skillsStatus = (intn.required_skills || []).map(sk => ({
        name: sk,
        hasSkill: userSkills.some(us => us.includes(sk.toLowerCase()) || sk.toLowerCase().includes(us))
      }));

      return {
        ...intn,
        relevance,
        trackingStatus: tracking ? tracking.status : null,
        trackingNotes: tracking ? tracking.notes : '',
        appliedDate: tracking ? tracking.applied_date : null,
        skillsStatus
      };
    });

    // Apply filtering
    const filtered = this.applyFilters(enriched, filters);

    // Sort by relevance score descending by default
    return filtered.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Evaluates filter criteria against list
   */
  static applyFilters(internships, filters = {}) {
    const {
      search = '',
      branch = 'all',
      track = 'all',
      workMode = 'all',
      compensation = 'all',
      status = 'all'
    } = filters;

    return internships.filter(intn => {
      // 1. Search Query
      if (search && search.trim().length > 0) {
        const q = search.toLowerCase().trim();
        const inCompany = intn.company_name.toLowerCase().includes(q);
        const inTitle = intn.role_title.toLowerCase().includes(q);
        const inDesc = (intn.description || '').toLowerCase().includes(q);
        const inSkills = (intn.required_skills || []).some(s => s.toLowerCase().includes(q));
        const inLocation = (intn.location || '').toLowerCase().includes(q);
        const inTrack = (intn.track || '').toLowerCase().includes(q);

        if (!inCompany && !inTitle && !inDesc && !inSkills && !inLocation && !inTrack) {
          return false;
        }
      }

      // 2. Branch Filter
      if (branch && branch !== 'all') {
        const b = branch.toLowerCase();
        const relBranches = (intn.branch_relevance || []).map(x => x.toLowerCase());
        if (!relBranches.includes(b)) {
          return false;
        }
      }

      // 3. Track / Category Filter
      if (track && track !== 'all') {
        if ((intn.track || '').toLowerCase() !== track.toLowerCase()) {
          return false;
        }
      }

      // 4. Work Mode Filter
      if (workMode && workMode !== 'all') {
        if ((intn.work_mode || '').toLowerCase() !== workMode.toLowerCase()) {
          return false;
        }
      }

      // 5. Compensation
      if (compensation === 'paid') {
        if (!intn.stipend || intn.stipend.toLowerCase().includes('unpaid')) {
          return false;
        }
      }

      // 6. Application Status Filter
      if (status === 'saved') {
        if (intn.trackingStatus !== 'saved') return false;
      } else if (status === 'applied') {
        if (!intn.trackingStatus || intn.trackingStatus === 'saved') return false;
      }

      return true;
    });
  }

  /**
   * Retrieves tracking records for a specific user from Supabase and IndexedDB
   */
  static async getUserInternships(userId) {
    if (!userId || userId === 'usr_guest') {
      const local = JSON.parse(localStorage.getItem('TP_USER_INTERNSHIPS_GUEST') || '[]');
      return local;
    }

    let records = [];

    // 1. Try Supabase first if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_internships')
          .select('*')
          .eq('user_id', userId);

        if (!error && Array.isArray(data)) {
          records = data;
        }
      } catch (err) {
        console.warn('Supabase user_internships query failed:', err);
      }
    }

    // 2. Merge with IndexedDB
    try {
      const idbRecords = await dbStore.filter('user_internships', r => r.user_id === userId);
      if (idbRecords && idbRecords.length > 0) {
        const existingIds = new Set(records.map(r => r.internship_id));
        for (const idbR of idbRecords) {
          if (!existingIds.has(idbR.internship_id)) {
            records.push(idbR);
          }
        }
      }
    } catch {
      // IndexedDB fallback
    }

    // Fallback to localStorage if both empty
    if (records.length === 0) {
      const local = JSON.parse(localStorage.getItem(`TP_USER_INTERNSHIPS_${userId}`) || '[]');
      records = local;
    }

    return records;
  }

  /**
   * Saves or updates internship tracking state for authenticated user
   */
  static async trackInternship(userId, internshipId, status = 'saved', notes = '') {
    const record = {
      id: `${userId}_${internshipId}`,
      user_id: userId,
      internship_id: internshipId,
      status, // 'saved' | 'applied' | 'assessment' | 'interview' | 'offered' | 'rejected'
      applied_date: status !== 'saved' ? new Date().toISOString().split('T')[0] : null,
      notes: notes || '',
      updated_at: new Date().toISOString()
    };

    // 1. Save to IndexedDB
    try {
      await dbStore.insert('user_internships', record);
    } catch (err) {
      console.warn('Could not save to IndexedDB user_internships:', err);
    }

    // 2. Save to localStorage backup
    try {
      const key = userId === 'usr_guest' ? 'TP_USER_INTERNSHIPS_GUEST' : `TP_USER_INTERNSHIPS_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = existing.filter(r => r.internship_id !== internshipId);
      filtered.push(record);
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch {}

    // 3. Persist to Supabase if authenticated
    if (isSupabaseConfigured() && supabase && userId !== 'usr_guest') {
      try {
        await supabase.from('user_internships').upsert({
          user_id: userId,
          internship_id: internshipId,
          status,
          applied_date: record.applied_date,
          notes: record.notes
        });
      } catch (err) {
        console.warn('Failed to upsert user_internships to Supabase:', err);
      }
    }

    return record;
  }

  /**
   * Removes tracking record (unsave)
   */
  static async untrackInternship(userId, internshipId) {
    const recordId = `${userId}_${internshipId}`;

    // 1. Remove from IndexedDB
    try {
      await dbStore.delete('user_internships', recordId);
    } catch {}

    // 2. Remove from localStorage
    try {
      const key = userId === 'usr_guest' ? 'TP_USER_INTERNSHIPS_GUEST' : `TP_USER_INTERNSHIPS_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = existing.filter(r => r.internship_id !== internshipId);
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch {}

    // 3. Remove from Supabase
    if (isSupabaseConfigured() && supabase && userId !== 'usr_guest') {
      try {
        await supabase.from('user_internships').delete().match({ user_id: userId, internship_id: internshipId });
      } catch (err) {
        console.warn('Failed to delete user_internships from Supabase:', err);
      }
    }

    return true;
  }
}
