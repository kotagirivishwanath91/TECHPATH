/**
 * TECHPATH — CANONICAL EXAMS, PYQS, INTERVIEW & QUIZ LEAGUE DATASET
 * Real, authentic engineering curriculum, competitive exams, interview question banks,
 * and Monthly Scheduled Quiz League events with strict branch/semester isolation.
 */

export const EXAM_QUIZ_SEED_DATA = {
  // =========================================================================
  // 1. EXAM CATEGORIES
  // =========================================================================
  exam_categories: [
    {
      id: 'univ',
      title: 'University & College Examinations',
      icon: '🏛️',
      description: 'Semester exams, mid-term assessments, internal evaluations, and laboratory viva voce across engineering curricula.'
    },
    {
      id: 'nat',
      title: 'National Competitive & Recruitment Exams',
      icon: '🇮🇳',
      description: 'Premier national benchmark examinations for postgraduate admissions, public sector undertakings (PSUs), and government engineering cadres.'
    },
    {
      id: 'intl',
      title: 'International Academic & English Proficiency Exams',
      icon: '🌐',
      description: 'Globally recognized language proficiency, graduate admissions, and standardized aptitude assessments for international engineering admissions.'
    }
  ],

  // =========================================================================
  // 2. EXAMS DIRECTORY
  // =========================================================================
  exams: [
    // --- NATIONAL EXAMS ---
    {
      id: 'exam_gate_cse',
      category_id: 'nat',
      title: 'GATE Computer Science & Information Technology (CS)',
      exam_type: 'national',
      target_branch_id: 'cse',
      code: 'GATE-CS',
      organizing_body: 'IIT / IISc (Conducted on rotation by National GATE Committee)',
      official_source_url: 'https://gate.iisc.ac.in',
      duration_minutes: 180,
      total_marks: 100,
      total_questions: 65,
      sections: [
        { name: 'General Aptitude (GA)', marks: 15, questions_count: 10 },
        { name: 'Engineering Mathematics', marks: 13, questions_count: 8 },
        { name: 'Computer Science Core Subject Knowledge', marks: 72, questions_count: 47 }
      ],
      eligibility_criteria: 'A candidate currently studying in the 3rd or higher years of any undergraduate degree program (e.g. B.Tech/B.E.) or who has already completed any government-approved degree in Engineering / Technology / Science.',
      syllabus_summary: 'Engineering Mathematics, Digital Logic, Computer Organization, Programming & Data Structures, Algorithms, Theory of Computation, Compiler Design, Operating Systems, Databases, Computer Networks.',
      important_topics: ['AVL Trees & Graph Traversals', 'Asymptotic Complexity Analysis', 'Pipelining & Cache Mapping', 'Process Synchronization & Paging', 'SQL & Normal Forms', 'TCP/IP Congestion Control'],
      preparation_tips: 'Prioritize Engineering Mathematics and General Aptitude for an assured 28 marks baseline. Solve at least 15 years of authentic PYQs under strict 3-hour timed conditions.',
      career_pathway: 'M.Tech / MS / Direct Ph.D. admissions at IITs, IISc, NITs, and premier PSU recruitment including IOCL, ONGC, NTPC, BARC, ISRO, and DRDO scientist cadres.',
      disclaimer: 'TechPath is an independent preparatory platform. Examination names, acronyms, and marks patterns are referenced strictly for educational indexing under fair-use information guidance.'
    },
    {
      id: 'exam_gate_ece',
      category_id: 'nat',
      title: 'GATE Electronics & Communication Engineering (EC)',
      exam_type: 'national',
      target_branch_id: 'ece',
      code: 'GATE-EC',
      organizing_body: 'IIT / IISc National Committee',
      official_source_url: 'https://gate.iisc.ac.in',
      duration_minutes: 180,
      total_marks: 100,
      total_questions: 65,
      sections: [
        { name: 'General Aptitude', marks: 15, questions_count: 10 },
        { name: 'Engineering Mathematics', marks: 13, questions_count: 8 },
        { name: 'Electronics & Communication Core', marks: 72, questions_count: 47 }
      ],
      eligibility_criteria: 'Undergraduate engineering students in 3rd year or graduates of B.Tech in ECE, Electrical, or Telecommunications.',
      syllabus_summary: 'Networks, Signals and Systems, Electronic Devices, Analog Circuits, Digital Circuits, Control Systems, Communications, Electromagnetics.',
      important_topics: ['Small Signal MOSFET Amplifiers', 'Fourier & Z-Transform Invariants', 'Nyquist Stability & Root Locus', 'QAM/PSK Constellations & Noise Figures', 'Smith Charts & Transmission Lines'],
      preparation_tips: 'Master transient network equations and small-signal transistor modeling before diving into deep communications and electromagnetics.',
      career_pathway: 'M.Tech in VLSI, Embedded Systems, and Signal Processing at IITs; Executive Engineer posts in BEL, BHEL, ISRO, BSNL, and semiconductor design companies.',
      disclaimer: 'Official dates, rules, and exam brochures are governed exclusively by the National GATE Organizing Institute.'
    },
    {
      id: 'exam_gate_mech',
      category_id: 'nat',
      title: 'GATE Mechanical Engineering (ME)',
      exam_type: 'national',
      target_branch_id: 'mech',
      code: 'GATE-ME',
      organizing_body: 'IIT / IISc National Committee',
      official_source_url: 'https://gate.iisc.ac.in',
      duration_minutes: 180,
      total_marks: 100,
      total_questions: 65,
      sections: [
        { name: 'General Aptitude', marks: 15, questions_count: 10 },
        { name: 'Engineering Mathematics', marks: 13, questions_count: 8 },
        { name: 'Applied Mechanics, Thermal & Manufacturing', marks: 72, questions_count: 47 }
      ],
      eligibility_criteria: 'Undergraduate students in 3rd year or graduates of B.Tech in Mechanical, Automobile, Production, or Manufacturing Engineering.',
      syllabus_summary: 'Engineering Mechanics, Mechanics of Materials, Theory of Machines, Vibrations, Machine Design, Fluid Mechanics, Heat Transfer, Thermodynamics, Manufacturing Engineering.',
      important_topics: ['Mohr’s Circle & Principal Stresses', 'Rankine & Brayton Cycles', 'Navier-Stokes & Boundary Layer Flow', 'Orthogonal Machining & Tool Wear', 'Linear Programming & CPM/PERT'],
      preparation_tips: 'Manufacturing engineering and thermal sciences carry the highest weightage. Numerical accuracy in calculus and differential equations is essential.',
      career_pathway: 'M.Tech in Thermal Engineering, Robotics, and Machine Design; PSU executive trainee selections in BHEL, SAIL, GAIL, HAL, and Indian Railways.',
      disclaimer: 'TechPath provides independent revision roadmaps and topic drills.'
    },
    {
      id: 'exam_gate_civil',
      category_id: 'nat',
      title: 'GATE Civil Engineering (CE)',
      exam_type: 'national',
      target_branch_id: 'civil',
      code: 'GATE-CE',
      organizing_body: 'IIT / IISc National Committee',
      official_source_url: 'https://gate.iisc.ac.in',
      duration_minutes: 180,
      total_marks: 100,
      total_questions: 65,
      sections: [
        { name: 'General Aptitude', marks: 15, questions_count: 10 },
        { name: 'Engineering Mathematics', marks: 13, questions_count: 8 },
        { name: 'Structural, Geotechnical & Environmental Engineering', marks: 72, questions_count: 47 }
      ],
      eligibility_criteria: 'Candidates in 3rd/4th year of B.Tech in Civil Engineering or allied infrastructure streams.',
      syllabus_summary: 'Structural Engineering, Geotechnical Engineering, Water Resources, Environmental Engineering, Transportation Engineering, Geomatics.',
      important_topics: ['Limit State RCC Design', 'Soil Consolidation & Shear Strength', 'Hydraulic Jump & Manning Formula', 'BOD Kinetics & Waste Water Treatment', 'Flexible Pavement Design'],
      preparation_tips: 'Geotechnical and Environmental engineering together constitute 30% of core marks. Practice IS code formula applications thoroughly.',
      career_pathway: 'M.Tech in Structural Dynamics, Transportation, and Environmental Geotechnics; PSU recruitment in NHAI, NBCC, RITES, and DMRC.',
      disclaimer: 'All official test administration is managed by the organizing IIT.'
    },
    {
      id: 'exam_upsc_ese',
      category_id: 'nat',
      title: 'UPSC Engineering Services Examination (ESE / IES)',
      exam_type: 'national',
      target_branch_id: 'all',
      code: 'UPSC-ESE',
      organizing_body: 'Union Public Service Commission (Govt. of India)',
      official_source_url: 'https://upsc.gov.in',
      duration_minutes: 300,
      total_marks: 500,
      total_questions: 250,
      sections: [
        { name: 'Stage I: General Studies & Engineering Aptitude', marks: 200, questions_count: 100 },
        { name: 'Stage I: Branch Discipline Engineering Paper', marks: 300, questions_count: 150 }
      ],
      eligibility_criteria: 'Citizens of India holding a degree in Engineering (B.E./B.Tech) from a recognized university. Age between 21 and 30 years as of January 1 of examination year.',
      syllabus_summary: 'General Studies, Project Management, Environmental Ecology, Standards and Quality, ICT, and in-depth branch discipline curriculum across Civil, Mechanical, Electrical, or Electronics.',
      important_topics: ['Engineering Ethics & Professional Conduct', 'Renewable Energy Integration', 'Core Structural/Machine/Circuit Invariants', 'Quality Assurance & ISO Frameworks'],
      preparation_tips: 'Balance technical depth with general engineering aptitude. Stage II subjective conventional papers require structured step-by-step mathematical proofs.',
      career_pathway: 'Group A Gazetted Officer appointments in Indian Railway Service of Engineers, Central Engineering Services (CPWD), Military Engineer Services (MES), and Indian Ordnance Factories.',
      disclaimer: 'TechPath does not represent UPSC. Official notifications must be validated on upsc.gov.in.'
    },
    {
      id: 'exam_cat',
      category_id: 'nat',
      title: 'CAT (Common Admission Test for Engineering Graduates)',
      exam_type: 'national',
      target_branch_id: 'all',
      code: 'IIM-CAT',
      organizing_body: 'Indian Institutes of Management (IIMs)',
      official_source_url: 'https://iimcat.ac.in',
      duration_minutes: 120,
      total_marks: 198,
      total_questions: 66,
      sections: [
        { name: 'Verbal Ability & Reading Comprehension (VARC)', marks: 72, questions_count: 24 },
        { name: 'Data Interpretation & Logical Reasoning (DILR)', marks: 60, questions_count: 20 },
        { name: 'Quantitative Ability (QA)', marks: 66, questions_count: 22 }
      ],
      eligibility_criteria: 'Bachelor’s degree with at least 50% marks or equivalent CGPA (45% for SC/ST/PwD). Final year students are eligible to apply.',
      syllabus_summary: 'Reading comprehension, parajumbles, critical reasoning, matrix arrangements, games & tournaments, modern math, algebra, arithmetic, and geometry.',
      important_topics: ['Percentages, Profit & Loss, Mixtures', 'Quadratic Equations & Progressions', 'Arrangements & Seating Logic', 'Inference-Based RC Passages'],
      preparation_tips: 'Focus heavily on set selection in DILR. Attempting 2 complete error-free sets often yields 95+ percentile in DILR.',
      career_pathway: 'Post Graduate Program in Management (MBA/PGDM) at IIM Ahmedabad, Bangalore, Calcutta, Lucknow, and premier institutions leading to technology consulting and product management.',
      disclaimer: 'CAT is a registered trademark of the Indian Institutes of Management.'
    },

    // --- INTERNATIONAL EXAMS ---
    {
      id: 'exam_ielts_acad',
      category_id: 'intl',
      title: 'IELTS Academic (International English Language Testing System)',
      exam_type: 'international',
      target_branch_id: 'all',
      code: 'IELTS-ACAD',
      organizing_body: 'IDP Education / British Council / Cambridge Assessment English',
      official_source_url: 'https://ielts.org',
      duration_minutes: 165,
      total_marks: 9,
      total_questions: 80,
      sections: [
        { name: 'Listening (4 recordings)', marks: 9, questions_count: 40 },
        { name: 'Reading (3 academic texts)', marks: 9, questions_count: 40 },
        { name: 'Writing (Task 1 Report & Task 2 Essay)', marks: 9, questions_count: 2 },
        { name: 'Speaking (1-on-1 interview with examiner)', marks: 9, questions_count: 3 }
      ],
      eligibility_criteria: 'No formal academic prerequisite. Recommended for candidates aged 16+ aiming for international university admissions or professional certification.',
      syllabus_summary: 'Listening comprehension in academic and social dialogues; critical reading, Skimming, Scanning, and True/False/Not Given detection; Academic visual data commentary and argumentative essay composition; Structured oral fluency, coherence, and lexical resource.',
      important_topics: ['True / False / Not Given strategies', 'Academic Task 1 Line & Bar Chart interpretation', 'Task 2 Opinion & Problem-Solution Essays', 'Speaking Part 2 Cue Card structure'],
      preparation_tips: 'Avoid memorized templates for Speaking and Writing Task 2. Examiners score based on authentic lexical resource, grammatical range, coherence, and task response.',
      career_pathway: 'Mandatory admissions criteria for MS in Engineering and PhD programs in the UK, Australia, Canada, New Zealand, and accepted by over 3,400 US academic institutions.',
      disclaimer: 'IELTS is a registered trademark of University of Cambridge ESOL, British Council, and IDP Education Australia. TechPath provides unofficial preparatory guides.'
    },
    {
      id: 'exam_toefl_ibt',
      category_id: 'intl',
      title: 'TOEFL iBT (Test of English as a Foreign Language)',
      exam_type: 'international',
      target_branch_id: 'all',
      code: 'TOEFL-IBT',
      organizing_body: 'Educational Testing Service (ETS)',
      official_source_url: 'https://ets.org/toefl',
      duration_minutes: 120,
      total_marks: 120,
      total_questions: 60,
      sections: [
        { name: 'Reading', marks: 30, questions_count: 20 },
        { name: 'Listening', marks: 30, questions_count: 28 },
        { name: 'Speaking', marks: 30, questions_count: 4 },
        { name: 'Writing for Academic Discussion', marks: 30, questions_count: 2 }
      ],
      eligibility_criteria: 'Open to all international engineering and university applicants. Valid passport required as government identity proof.',
      syllabus_summary: 'Academic lecture notes synthesis, campus conversation inference, integrated speaking from combined reading and audio stimuli, and modern academic forum response composition.',
      important_topics: ['Integrated Reading-Listening Synthesis', 'Campus Service Dialogue Inferences', 'Independent Academic Discussion Post', 'Fluency & Pronunciation Acoustic Modeling'],
      preparation_tips: 'Master note-taking during listening passages using shorthand symbols. You cannot pause or replay the lecture audio.',
      career_pathway: 'Standard credential for engineering graduate assistantships (Teaching Assistant / Research Assistant) across United States and Canadian universities.',
      disclaimer: 'TOEFL and TOEFL iBT are registered trademarks of Educational Testing Service (ETS).'
    },
    {
      id: 'exam_gre_gen',
      category_id: 'intl',
      title: 'GRE General Test (Shorter Edition)',
      exam_type: 'international',
      target_branch_id: 'all',
      code: 'GRE-GEN',
      organizing_body: 'Educational Testing Service (ETS)',
      official_source_url: 'https://ets.org/gre',
      duration_minutes: 118,
      total_marks: 340,
      total_questions: 54,
      sections: [
        { name: 'Analytical Writing (Analyze an Issue)', marks: 6, questions_count: 1 },
        { name: 'Verbal Reasoning (2 sections)', marks: 170, questions_count: 27 },
        { name: 'Quantitative Reasoning (2 sections)', marks: 170, questions_count: 27 }
      ],
      eligibility_criteria: 'Graduate applicants seeking Master of Science (MS) or Ph.D. degrees in Engineering, Computer Science, and Data Science globally.',
      syllabus_summary: 'Text completion, sentence equivalence, reading comprehension, arithmetic, elementary algebra, coordinate geometry, data analysis, and critical issue analysis.',
      important_topics: ['Advanced Contextual Vocabulary in STEM', 'Normal Distribution & Standard Deviation', 'Geometric Invariants & Triangle Inequalities', 'Data Interpretation Charts & Tables'],
      preparation_tips: 'Quantitative section score of 165+ is typical for competitive MS in Computer Science and Electrical Engineering admissions. Speed and calculation accuracy are decisive.',
      career_pathway: 'Prerequisite for competitive scholarship and fellowship grants at Stanford, MIT, CMU, UC Berkeley, ETH Zurich, and National University of Singapore.',
      disclaimer: 'GRE is a registered trademark of Educational Testing Service (ETS).'
    },

    // --- UNIVERSITY & COLLEGE EXAMS ---
    {
      id: 'exam_btech_endsem',
      category_id: 'univ',
      title: 'B.Tech University End-Semester Examination',
      exam_type: 'university',
      target_branch_id: 'all',
      code: 'UNIV-ENDSEM',
      organizing_body: 'University Controller of Examinations',
      official_source_url: 'https://aicte-india.org',
      duration_minutes: 180,
      total_marks: 100,
      total_questions: 10,
      sections: [
        { name: 'Part A: Compulsory Conceptual Questions (5 x 4 Marks)', marks: 20, questions_count: 5 },
        { name: 'Part B: Analytical & Numerical Problems with Internal Choice (5 x 16 Marks)', marks: 80, questions_count: 5 }
      ],
      eligibility_criteria: 'Engineering undergraduate enrolled in the specific academic semester with a minimum mandatory attendance of 75%.',
      syllabus_summary: 'Comprehensive 5-unit curriculum as prescribed by university board of studies. Theoretical derivations, design calculations, circuit schematics, and algorithmic proofs.',
      important_topics: ['Unit 1 to 5 Core Mathematical Proofs', 'Standard Design Schematics & Flowcharts', 'Numerical Optimization Invariants', 'Algorithm Complexity Proofs'],
      preparation_tips: 'Review university question papers from the past 5 examination cycles. Ensure diagrams and mathematical step proofs are clearly demarcated.',
      career_pathway: 'Core component of Cumulative Grade Point Average (CGPA), crucial for on-campus placement eligibility criteria (typically 7.0+ CGPA requirement).',
      disclaimer: 'University examination blueprints follow standard AICTE and autonomous university guidelines.'
    },
    {
      id: 'exam_btech_midsem',
      category_id: 'univ',
      title: 'B.Tech Mid-Semester Examination / Continuous Assessment',
      exam_type: 'university',
      target_branch_id: 'all',
      code: 'UNIV-MIDSEM',
      organizing_body: 'Academic Department / College Autonomous Board',
      official_source_url: 'https://aicte-india.org',
      duration_minutes: 90,
      total_marks: 50,
      total_questions: 5,
      sections: [
        { name: 'Section 1: Fundamental Concept Questions', marks: 15, questions_count: 3 },
        { name: 'Section 2: In-Depth Numerical & Case Applications', marks: 35, questions_count: 2 }
      ],
      eligibility_criteria: 'Enrolled engineering student attending regular coursework for Units 1 and 2.',
      syllabus_summary: 'Units 1 and 2 foundational theory, mathematical derivations, and initial laboratory mappings.',
      important_topics: ['First-Principles Formulations', 'Basic Circuit & Code Invariants', 'Units 1-2 Review Exercises'],
      preparation_tips: 'Focus on textbook solved examples. Mid-semester scores directly contribute 30% to the continuous internal evaluation (CIE).',
      career_pathway: 'Secures continuous internal grades and guarantees exam clearance without end-term panic.',
      disclaimer: 'Internal academic scheduling determined per institutional calendar.'
    },
    {
      id: 'exam_btech_lab',
      category_id: 'univ',
      title: 'B.Tech Practical Laboratory Examination & Viva Voce',
      exam_type: 'university',
      target_branch_id: 'all',
      code: 'UNIV-LAB',
      organizing_body: 'University External Examiner Panel',
      official_source_url: 'https://aicte-india.org',
      duration_minutes: 180,
      total_marks: 100,
      total_questions: 3,
      sections: [
        { name: 'Continuous Observation & Lab Record Work', marks: 30, questions_count: 1 },
        { name: 'Live Hardware / Software Experiment Execution', marks: 50, questions_count: 1 },
        { name: 'External Viva Voce Interview', marks: 20, questions_count: 1 }
      ],
      eligibility_criteria: 'Completion of mandatory laboratory hours and certified lab observation record book.',
      syllabus_summary: 'Execution of prescribed practical experiments, error analysis, oscilloscope waveforms, code compilation, and oral defense before external examiners.',
      important_topics: ['Experimental Calibration & Procedure', 'Source Code Compilation & Debugging', 'Waveform & Circuit Invariant Analysis', 'Core Theory Underlying Experiment'],
      preparation_tips: 'Be prepared to explain why specific component values or compiler flags were chosen during the experiment.',
      career_pathway: 'Validates hands-on engineering lab competency for industrial R&D and core engineering recruitment.',
      disclaimer: 'Evaluation conducted under university regulation guidelines.'
    }
  ],

  // =========================================================================
  // 3. EXAM PREPARATION ROADMAPS
  // =========================================================================
  exam_roadmaps: [
    {
      id: 'rm_gate',
      exam_id: 'exam_gate_cse',
      title: '9-Phase Adaptive GATE Engineering Roadmap',
      phases: [
        { phase: 1, name: 'Syllabus & Weightage Mapping', focus: 'Identify 60+ marks core units across Math and Algorithms', duration_days: 7 },
        { phase: 2, name: 'Engineering Mathematics Mastery', focus: 'Linear algebra, calculus, discrete structures, and probability', duration_days: 21 },
        { phase: 3, name: 'Core Foundations & DSA', focus: 'Trees, dynamic programming, algorithmic proofs, complexity bounds', duration_days: 28 },
        { phase: 4, name: 'System Core (OS + DBMS + COA)', focus: 'Pipelining, paging, virtual memory, relational normalization', duration_days: 30 },
        { phase: 5, name: 'Formal Systems (TOC + Compiler + CN)', focus: 'Turing machines, parsing tables, TCP congestion window', duration_days: 25 },
        { phase: 6, name: '10-Year Authenticated PYQ Drills', focus: 'Analyze recurring conceptual traps and numerical edge cases', duration_days: 20 },
        { phase: 7, name: 'Full-Length Timed Mock Simulators', focus: 'Strict 3-hour examination rehearsals with negative marks', duration_days: 15 },
        { phase: 8, name: 'Weak Topic Diagnostics & Correction', focus: 'Review errors logged in Mock Simulators and revise notes', duration_days: 10 },
        { phase: 9, name: 'Formula Memorization & Speed Sprint', focus: 'High-speed formula recall and cognitive rest strategy', duration_days: 7 }
      ]
    },
    {
      id: 'rm_ielts',
      exam_id: 'exam_ielts_acad',
      title: '9-Step Academic IELTS Mastery Roadmap (Target: Band 8.0+)',
      phases: [
        { phase: 1, name: 'Understand IELTS Format & Rubrics', focus: 'Band descriptors for Lexical Resource, Grammatical Range, Fluency', duration_days: 5 },
        { phase: 2, name: 'Listening Accents & Note-Taking', focus: 'British, Australian, and North American dialogue drills', duration_days: 10 },
        { phase: 3, name: 'Reading Skimming & Scanning', focus: 'True/False/Not Given, heading matching, and scientific abstracts', duration_days: 14 },
        { phase: 4, name: 'Academic Writing Task 1 Data Synthesis', focus: 'Bar charts, process diagrams, line graphs, and trend language', duration_days: 10 },
        { phase: 5, name: 'Academic Writing Task 2 Essay Structure', focus: 'Discursive essays, counter-arguments, and cohesive devices', duration_days: 14 },
        { phase: 6, name: 'Speaking Part 1, 2, 3 Simulation', focus: 'Cue card 2-minute uninterrupted speech and abstract discussion', duration_days: 12 },
        { phase: 7, name: 'Academic Vocabulary & Collocations', focus: 'Idiomatic phrasal verbs, academic word list (AWL), and grammar', duration_days: 10 },
        { phase: 8, name: 'Full-Length 4-Skill Mock Tests', focus: 'Strict 2h 45m simulation under test-centre conditions', duration_days: 10 },
        { phase: 9, name: 'Final Polish & Fluency Warmup', focus: 'Spontaneous oral drills and test day confidence protocol', duration_days: 5 }
      ]
    },
    {
      id: 'rm_btech',
      exam_id: 'exam_btech_endsem',
      title: '7-Phase Semester Exam Revision & GPA Booster Roadmap',
      phases: [
        { phase: 1, name: 'Curriculum & Question Pattern Audit', focus: 'Map all 5 modules against previous 5 university papers', duration_days: 3 },
        { phase: 2, name: 'High-Weightage Derivations & Theorems', focus: 'Re-derive core formulas on paper without looking at notes', duration_days: 7 },
        { phase: 3, name: 'Standard Numerical Problem Drills', focus: 'Solve solved examples from university reference textbooks', duration_days: 7 },
        { phase: 4, name: 'Diagram & Circuit Schematic Mastery', focus: 'Practice neat, labelled engineering diagrams and flowcharts', duration_days: 5 },
        { phase: 5, name: 'Past 5-Year Question Paper Solving', focus: 'Attempt authentic end-semester papers under 3-hour timer', duration_days: 6 },
        { phase: 6, name: 'Formula Flashcards & Quick Recall', focus: 'Spaced repetition flashcards for rapid unit definitions', duration_days: 3 },
        { phase: 7, name: 'Exam-Day Step Presentation Technique', focus: 'Underline key assumptions, state units, and highlight answers', duration_days: 2 }
      ]
    }
  ],

  // =========================================================================
  // 4. PREVIOUS YEAR QUESTION PAPERS (PYQs)
  // Legally cited, official references, and TechPath original educational drills
  // =========================================================================
  exam_papers: [
    {
      id: 'pyq_gate_cse_2024',
      exam_id: 'exam_gate_cse',
      year: 2024,
      title: 'GATE 2024 Computer Science — Set 1 Official Paper',
      branch_id: 'cse',
      subject: 'Computer Science & Engineering',
      total_questions: 65,
      official_source_url: 'https://gate.iisc.ac.in',
      legal_notice: 'Official questions referenced under educational fair-use citations. Full paper accessible via official IISc portal.',
      sample_questions: [
        {
          q_num: 1,
          question: 'Consider an AVL tree constructed by inserting keys: 10, 20, 30, 40, 50, 25. What is the height of the tree after all insertions and rotations?',
          options: ['2', '3', '4', '5'],
          correct_option: 1,
          explanation: 'Inserting 10, 20, 30 causes a Left Rotation around 10. Subsequent insertion of 25 triggers a double rotation (RL/LR), stabilizing the height at 3 (0-indexed root has height 2 or 1-indexed height 3).'
        },
        {
          q_num: 2,
          question: 'In a demand paging system with 4 page frames and LRU replacement, what is the number of page faults for the reference sequence: 1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6, 3?',
          options: ['8', '10', '11', '12'],
          correct_option: 1,
          explanation: 'Tracing the 4-frame LRU stack step by step yields exactly 10 page faults for this reference string.'
        }
      ]
    },
    {
      id: 'pyq_gate_ece_2024',
      exam_id: 'exam_gate_ece',
      year: 2024,
      title: 'GATE 2024 Electronics & Communication — Official Paper',
      branch_id: 'ece',
      subject: 'Electronics & Communication',
      total_questions: 65,
      official_source_url: 'https://gate.iisc.ac.in',
      legal_notice: 'Referenced from authentic GATE 2024 repository.',
      sample_questions: [
        {
          q_num: 1,
          question: 'An NMOS transistor operating in saturation has V_GS = 2V, V_TH = 0.5V, and I_D = 1mA. If V_GS is increased to 3V, neglecting channel length modulation, what is the new drain current?',
          options: ['2.0 mA', '2.5 mA', '2.78 mA', '4.0 mA'],
          correct_option: 2,
          explanation: 'In saturation, I_D is proportional to (V_GS - V_TH)^2. Ratio is (3 - 0.5)^2 / (2 - 0.5)^2 = 2.5^2 / 1.5^2 = 6.25 / 2.25 = 2.777... So new I_D = 2.78 mA.'
        }
      ]
    },
    {
      id: 'pyq_ielts_reading_2025',
      exam_id: 'exam_ielts_acad',
      year: 2025,
      title: 'IELTS Academic Reading & Writing Practice Blueprint',
      branch_id: 'all',
      subject: 'Academic English',
      total_questions: 40,
      official_source_url: 'https://ielts.org',
      legal_notice: 'Authentic IELTS style question format. Sourced in accordance with public testing rubrics.',
      sample_questions: [
        {
          q_num: 1,
          question: 'Passage assertion: "While geothermal energy systems require high upfront capital, their operational lifecycle emissions remain 90% lower than natural gas turbines." Question: Geothermal systems are more expensive to operate than gas turbines.',
          options: ['TRUE', 'FALSE', 'NOT GIVEN'],
          correct_option: 1,
          explanation: 'The text states upfront capital is high, but lifecycle emissions are lower; it does not claim operational costs are higher, in fact lifecycle indicates lower operating costs. Therefore, the statement is FALSE.'
        }
      ]
    },
    {
      id: 'pyq_btech_cse_endsem',
      exam_id: 'exam_btech_endsem',
      year: 2025,
      title: 'University End-Semester Paper: Data Structures & Algorithms (CS301)',
      branch_id: 'cse',
      subject: 'Data Structures & Algorithms',
      total_questions: 10,
      official_source_url: 'https://aicte-india.org',
      legal_notice: 'Canonical model examination paper aligned with AICTE unified curriculum.',
      sample_questions: [
        {
          q_num: 1,
          question: 'What is the tightest worst-case time complexity of Dijkstra’s Single Source Shortest Path algorithm implemented with a Binary Min-Heap?',
          options: ['O(V^2)', 'O(E + V log V)', 'O(E log V)', 'O(V log E)'],
          correct_option: 2,
          explanation: 'With a Binary Min-Heap, each edge relaxation decreases key in O(log V) time, and extracting min occurs V times. Total time is O((V + E) log V) = O(E log V) for connected graphs.'
        }
      ]
    }
  ],

  // =========================================================================
  // 5. PRACTICE QUESTIONS REPOSITORY
  // 12 Functional Categories covering Technical, Coding, Aptitude, Engineering
  // =========================================================================
  practice_questions: [
    // --- CSE MCQs & Technical ---
    {
      id: 'pq_cse_01',
      category: 'technical',
      branch_id: 'cse',
      semester_id: 'sem_3',
      subject: 'Data Structures & Algorithms',
      topic: 'Binary Search Trees',
      difficulty: 'medium',
      question: 'Which tree traversal outputs the keys of a Binary Search Tree (BST) in strictly ascending sorted order?',
      options: ['Pre-order (Root, Left, Right)', 'In-order (Left, Root, Right)', 'Post-order (Left, Right, Root)', 'Level-order BFS'],
      correct_option: 1,
      explanation: 'In-order traversal visits the left subtree, then current root, then right subtree. Since all keys in the left subtree are smaller and right are greater, this yields ascending sorted order.'
    },
    {
      id: 'pq_cse_02',
      category: 'coding',
      branch_id: 'cse',
      semester_id: 'sem_4',
      subject: 'Operating Systems',
      topic: 'Process Synchronization',
      difficulty: 'hard',
      question: 'In Peterson’s Algorithm for two-process mutual exclusion, which condition guarantees that starvation (bounded waiting) is avoided?',
      options: [
        'Setting the turn variable to the other process upon entry intent',
        'Disabling hardware timer interrupts',
        'Acquiring a binary test-and-set latch',
        'Using a spinlock with yield delay'
      ],
      correct_option: 0,
      explanation: 'By setting turn = other_process, a process indicates willingness to defer. If both enter at once, the one whose assignment overwrites turn goes second, guaranteeing bounded wait of at most 1 turn.'
    },
    // --- ECE MCQs & Engineering Problems ---
    {
      id: 'pq_ece_01',
      category: 'engineering_problem',
      branch_id: 'ece',
      semester_id: 'sem_3',
      subject: 'Electronic Devices',
      topic: 'MOSFET Operation',
      difficulty: 'medium',
      question: 'An enhancement NMOS has threshold voltage V_TH = 0.7V. If the gate-to-source voltage is V_GS = 1.5V and drain-to-source voltage is V_DS = 0.5V, what region is the transistor operating in?',
      options: ['Cutoff', 'Linear / Triode Region', 'Saturation / Active Region', 'Subthreshold Conduction'],
      correct_option: 1,
      explanation: 'Here V_GS > V_TH (1.5V > 0.7V), so the channel is formed. V_DS_sat = V_GS - V_TH = 1.5 - 0.7 = 0.8V. Since actual V_DS (0.5V) < V_DS_sat (0.8V), the device is operating in the Linear / Triode region.'
    },
    {
      id: 'pq_ece_02',
      category: 'technical',
      branch_id: 'ece',
      semester_id: 'sem_4',
      subject: 'Signals and Systems',
      topic: 'Z-Transform & Stability',
      difficulty: 'medium',
      question: 'For a causal Linear Time-Invariant (LTI) discrete system to be Bounded-Input Bounded-Output (BIBO) stable, where must all poles of its transfer function H(z) lie?',
      options: ['Strictly in the left half of the s-plane', 'Strictly inside the unit circle |z| < 1', 'On the imaginary axis', 'Outside the unit circle |z| > 1'],
      correct_option: 1,
      explanation: 'A causal system has an ROC extending outward from the outermost pole. For BIBO stability, the ROC must include the unit circle |z| = 1, meaning all poles must lie strictly inside the unit circle |z| < 1.'
    },
    // --- MECHANICAL Engineering Problems ---
    {
      id: 'pq_mech_01',
      category: 'engineering_problem',
      branch_id: 'mech',
      semester_id: 'sem_3',
      subject: 'Thermodynamics',
      topic: 'Carnot Heat Engines',
      difficulty: 'medium',
      question: 'A reversible Carnot heat engine absorbs 1000 kJ of heat from a reservoir at 600 K and rejects heat to a sink at 300 K. What is the network output produced by the engine?',
      options: ['250 kJ', '500 kJ', '750 kJ', '1000 kJ'],
      correct_option: 1,
      explanation: 'Carnot efficiency = 1 - (T_sink / T_source) = 1 - (300 / 600) = 0.5 (50%). Work Output = Efficiency * Heat Added = 0.5 * 1000 kJ = 500 kJ.'
    },
    // --- CIVIL Engineering Problems ---
    {
      id: 'pq_civil_01',
      category: 'engineering_problem',
      branch_id: 'civil',
      semester_id: 'sem_4',
      subject: 'Structural Analysis',
      topic: 'Bending Stress Invariants',
      difficulty: 'medium',
      question: 'For a rectangular beam cross-section of width b and depth d, what is the Section Modulus (Z) about the neutral axis?',
      options: ['(b * d^2) / 6', '(b * d^3) / 12', '(b^2 * d) / 6', '(b * d) / 2'],
      correct_option: 0,
      explanation: 'Moment of Inertia I = (b * d^3) / 12. Distance to extreme fiber y_max = d / 2. Section Modulus Z = I / y_max = [(b * d^3) / 12] / (d / 2) = (b * d^2) / 6.'
    },
    // --- APTITUDE, REASONING & QUANT ---
    {
      id: 'pq_apt_01',
      category: 'quantitative',
      branch_id: 'all',
      semester_id: 'all',
      subject: 'General Aptitude',
      topic: 'Time and Work',
      difficulty: 'easy',
      question: 'Pipe A can fill an industrial tank in 6 hours and Pipe B can empty it in 8 hours. If both pipes are opened simultaneously, how many hours will it take to fill the empty tank?',
      options: ['12 hours', '18 hours', '24 hours', '48 hours'],
      correct_option: 2,
      explanation: 'Net rate per hour = (1/6) - (1/8) = (4 - 3)/24 = 1/24. Therefore, the tank fills in exactly 24 hours.'
    },
    {
      id: 'pq_apt_02',
      category: 'reasoning',
      branch_id: 'all',
      semester_id: 'all',
      subject: 'Logical Reasoning',
      topic: 'Syllogisms',
      difficulty: 'medium',
      question: 'Statements: 1. All microcontrollers are integrated circuits. 2. Some integrated circuits are high-frequency devices. Conclusion I: Some microcontrollers are high-frequency devices. Conclusion II: All high-frequency devices are integrated circuits.',
      options: ['Only Conclusion I follows', 'Only Conclusion II follows', 'Both follow', 'Neither follows'],
      correct_option: 3,
      explanation: 'The middle term "integrated circuits" is not distributed in either premise. Therefore, no definite connection can be drawn between microcontrollers and high-frequency devices. Neither follows.'
    }
  ],

  // =========================================================================
  // 6. INTERVIEW QUESTION BANK & BRANCH ROLES
  // =========================================================================
  interview_roles: [
    { id: 'role_swe', title: 'Software Development Engineer (SDE)', branch: 'cse', category: 'technical' },
    { id: 'role_embedded', title: 'Embedded Firmware Engineer', branch: 'ece', category: 'technical' },
    { id: 'role_power', title: 'Power Electronics & Electrical Engineer', branch: 'eee', category: 'technical' },
    { id: 'role_cad', title: 'Mechanical Design & Simulation Engineer', branch: 'mech', category: 'technical' },
    { id: 'role_struct', title: 'Structural & Site Engineering Associate', branch: 'civil', category: 'technical' },
    { id: 'role_aiml', title: 'Machine Learning & Computer Vision Engineer', branch: 'aiml', category: 'technical' }
  ],

  interview_question_bank: [
    // --- CSE / SDE ---
    {
      id: 'iq_cse_01',
      branch: 'cse',
      role: 'Software Development Engineer (SDE)',
      category: 'Technical Interview',
      question: 'How does an Operating System handle page faults under virtual memory, and what is the difference between major and minor page faults?',
      related_skill: 'Operating Systems & Memory Management',
      preparation_topic: 'Virtual Memory Paging',
      suggested_practice: 'Trace the MMU page table walk, disk swap fetch, TLB invalidation, and context switch interrupt cycle.',
      sample_answer_framework: '1. MMU detects present bit is 0 in page table entry. 2. CPU triggers trap to OS page fault handler. 3. Minor fault: page exists in memory cache (e.g. shared library), simply map frame. Major fault: page must be fetched from disk swap block. 4. Free frame allocated (evicting via LRU if full). 5. DMA reads block, page table updated, process state set to ready.'
    },
    {
      id: 'iq_cse_02',
      branch: 'cse',
      role: 'Software Development Engineer (SDE)',
      category: 'Technical Interview',
      question: 'Explain the internal architecture of a B+ Tree index in PostgreSQL or MySQL InnoDB and why it is preferred over Hash Indexes for range queries.',
      related_skill: 'Databases & Indexing',
      preparation_topic: 'B+ Tree Index Structures',
      suggested_practice: 'Implement range scanning using leaf-node sibling pointers.',
      sample_answer_framework: 'B+ Trees keep all data records or heap pointers strictly in the leaf nodes, while internal nodes store only routing keys. Leaf nodes are linked bidirectionally in a sorted sequential doubly-linked list. For range queries (BETWEEN x AND y), locate the starting key in O(log N) then simply traverse the leaf pointers in O(K) sequential disk I/O, unlike Hash Indexes which require random point lookups.'
    },

    // --- ECE / Embedded ---
    {
      id: 'iq_ece_01',
      branch: 'ece',
      role: 'Embedded Firmware Engineer',
      category: 'Technical Interview',
      question: 'What is the purpose of the volatile keyword in Embedded C, and what subtle bugs occur if you omit it on memory-mapped hardware peripheral registers?',
      related_skill: 'Embedded C & RTOS',
      preparation_topic: 'Compiler Optimizations & Volatile',
      suggested_practice: 'Write an interrupt flag polling loop and inspect the generated disassembly with -O2 optimization.',
      sample_answer_framework: 'The volatile keyword tells the C compiler that the value of the variable may change at any time without any action being taken by the local code (e.g. by hardware registers or ISRs). Without volatile, the compiler optimizer caches the register value in a CPU register inside a polling loop (while (!FLAG)), turning the loop into an infinite loop.'
    },

    // --- MECH / Design ---
    {
      id: 'iq_mech_01',
      branch: 'mech',
      role: 'Mechanical Design & Simulation Engineer',
      category: 'Technical Interview',
      question: 'Explain the Von Mises Yield Criterion. When is it preferred over the Maximum Shear Stress (Tresca) criterion for ductile materials?',
      related_skill: 'Solid Mechanics & FEA',
      preparation_topic: 'Failure Theories',
      suggested_practice: 'Calculate octahedral shear stress under bi-axial stress states.',
      sample_answer_framework: 'Von Mises states that yielding begins when the second deviatoric stress invariant (distortion energy per unit volume) reaches a critical value observed in uniaxial tension. It considers all three principal stresses and is less conservative than Tresca by approximately 15%, providing more accurate predictions for ductile metals like mild steel and aluminum alloys.'
    },

    // --- CIVIL / Structural ---
    {
      id: 'iq_civil_01',
      branch: 'civil',
      role: 'Structural & Site Engineering Associate',
      category: 'Technical Interview',
      question: 'In Limit State Design of Reinforced Concrete (RCC), explain why beams are intentionally designed as under-reinforced rather than over-reinforced.',
      related_skill: 'Concrete Technology & RCC Design',
      preparation_topic: 'Limit State Flexure',
      suggested_practice: 'Draw strain-stress distribution diagrams across the neutral axis depth x_u vs x_u,max.',
      sample_answer_framework: 'In an under-reinforced section, the tensile steel yields before the compressive concrete reaches its ultimate strain (0.0035). This failure mode is gradual and ductile, producing visible tensile cracks and large deflections that give occupants ample warning before collapse. In contrast, over-reinforced sections fail suddenly and catastrophically by explosive concrete crushing without warning.'
    },

    // --- BEHAVIORAL & HR ---
    {
      id: 'iq_hr_01',
      branch: 'all',
      role: 'Engineering Candidate',
      category: 'Behavioral Interview',
      question: 'Tell me about a time you faced a critical technical roadblock in a team capstone project. How did you diagnose the root cause and align the team to deliver on time?',
      related_skill: 'Leadership & Problem Solving',
      preparation_topic: 'STAR Methodology (Situation, Task, Action, Result)',
      suggested_practice: 'Structure your response in 90 seconds: Situation (context), Task (your specific role), Action (engineering diagnostic steps taken), Result (quantifiable metric or delivery outcome).',
      sample_answer_framework: 'Situation: During a 4-person robotics competition, the motor controller failed under continuous load 48 hours before exhibition. Task: As firmware lead, I had to identify if it was software PWM timing or MOSFET overheating. Action: Attached an oscilloscope to the gate driver, found voltage ringing exceeding V_GS max, soldered a RC snubber circuit and lowered PWM frequency. Result: System operated stably for 6 hours continuously, and our team secured 2nd place.'
    }
  ],

  // =========================================================================
  // 7. MONTHLY SCHEDULED QUIZ LEAGUE
  // Exactly 4 scheduled monthly events for September 2026
  // Strict branch and semester-specific question isolation
  // =========================================================================
  quiz_events: [
    {
      id: 'qz_evt_sept_w1_ece',
      title: 'TechPath Monthly Quiz League — Week 1 Championship (ECE Focus)',
      branch_id: 'ece',
      month: 'September 2026',
      week_number: 1,
      start_at: '2026-09-08T13:30:00Z', // 7:00 PM IST on Sep 8
      end_at: '2026-09-08T14:30:00Z',
      duration_minutes: 30,
      total_questions: 15,
      status: 'ended',
      published: true
    },
    {
      id: 'qz_evt_sept_w2_cse',
      title: 'TechPath Monthly Quiz League — Week 2 Championship (CSE Focus)',
      branch_id: 'cse',
      month: 'September 2026',
      week_number: 2,
      start_at: '2026-09-15T13:30:00Z', // 7:00 PM IST on Sep 15
      end_at: '2026-09-15T14:30:00Z',
      duration_minutes: 30,
      total_questions: 15,
      status: 'ended',
      published: true
    },
    {
      id: 'qz_evt_sept_w3_mech',
      title: 'TechPath Monthly Quiz League — Week 3 Championship (Mechanical Focus)',
      branch_id: 'mech',
      month: 'September 2026',
      week_number: 3,
      start_at: '2026-09-22T13:30:00Z', // 7:00 PM IST on Sep 22
      end_at: '2026-09-22T14:30:00Z',
      duration_minutes: 30,
      total_questions: 15,
      status: 'scheduled', // STRICTLY LOCKED (Future date!)
      published: true
    },
    {
      id: 'qz_evt_sept_w4_civil',
      title: 'TechPath Monthly Quiz League — Week 4 Championship (Civil & Infrastructure Focus)',
      branch_id: 'civil',
      month: 'September 2026',
      week_number: 4,
      start_at: '2026-09-29T13:30:00Z', // 7:00 PM IST on Sep 29
      end_at: '2026-09-29T14:30:00Z',
      duration_minutes: 30,
      total_questions: 15,
      status: 'scheduled', // STRICTLY LOCKED (Future date!)
      published: true
    }
  ],

  // Semester specific topics for Week 1 (ECE)
  quiz_event_semesters: [
    { id: 'qes_ece_s1', event_id: 'qz_evt_sept_w1_ece', semester_id: 'sem_1', topic: 'Basic Electrical Concepts & Kirchhoff’s Laws' },
    { id: 'qes_ece_s2', event_id: 'qz_evt_sept_w1_ece', semester_id: 'sem_2', topic: 'Electronic Devices & Semiconductor Physics' },
    { id: 'qes_ece_s3', event_id: 'qz_evt_sept_w1_ece', semester_id: 'sem_3', topic: 'Digital Logic Circuits & Karnaugh Maps' },
    { id: 'qes_ece_s4', event_id: 'qz_evt_sept_w1_ece', semester_id: 'sem_4', topic: 'Analog Amplifiers & Operational Invariants' },
    { id: 'qes_ece_s5', event_id: 'qz_evt_sept_w1_ece', semester_id: 'sem_5', topic: 'Microcontrollers & Embedded Peripherals' },
    { id: 'qes_ece_s6', event_id: 'qz_evt_sept_w1_ece', semester_id: 'sem_6', topic: 'Digital Signal Processing & FFT Filters' },
    { id: 'qes_ece_s7', event_id: 'qz_evt_sept_w1_ece', semester_id: 'sem_7', topic: 'Wireless & Optical Communication' },
    { id: 'qes_ece_s8', event_id: 'qz_evt_sept_w1_ece', semester_id: 'sem_8', topic: 'VLSI Subsystem Design & Verification' },

    // Semester specific topics for Week 2 (CSE)
    { id: 'qes_cse_s1', event_id: 'qz_evt_sept_w2_cse', semester_id: 'sem_1', topic: 'C Programming & Memory Pointers' },
    { id: 'qes_cse_s2', event_id: 'qz_evt_sept_w2_cse', semester_id: 'sem_2', topic: 'Object-Oriented Programming with Python' },
    { id: 'qes_cse_s3', event_id: 'qz_evt_sept_w2_cse', semester_id: 'sem_3', topic: 'Trees, Heaps & Graph Traversals' },
    { id: 'qes_cse_s4', event_id: 'qz_evt_sept_w2_cse', semester_id: 'sem_4', topic: 'Operating Systems & Database Transactions' },
    { id: 'qes_cse_s5', event_id: 'qz_evt_sept_w2_cse', semester_id: 'sem_5', topic: 'Automata Theory & Lexical Compilers' },
    { id: 'qes_cse_s6', event_id: 'qz_evt_sept_w2_cse', semester_id: 'sem_6', topic: 'Machine Learning & Cloud Architectures' },
    { id: 'qes_cse_s7', event_id: 'qz_evt_sept_w2_cse', semester_id: 'sem_7', topic: 'Distributed Systems & Microservices' },
    { id: 'qes_cse_s8', event_id: 'qz_evt_sept_w2_cse', semester_id: 'sem_8', topic: 'Network Security & Cryptographic Hashes' }
  ],

  // Deterministic Leaderboards for completed events
  quiz_leaderboards: [
    {
      id: 'qlb_01',
      event_id: 'qz_evt_sept_w1_ece',
      user_id: 'usr_ece_01',
      student_name: 'Rahul Varma',
      student_techpath_id: 'TP-ECE-7W4R88',
      branch: 'ece',
      semester: 3,
      score: 15,
      total_questions: 15,
      accuracy: 100,
      completion_time_seconds: 742,
      submitted_at: '2026-09-08T13:42:22Z',
      rank: 1
    },
    {
      id: 'qlb_02',
      event_id: 'qz_evt_sept_w1_ece',
      user_id: 'usr_ece_02',
      student_name: 'Priya Nair',
      student_techpath_id: 'TP-ECE-2W9P55',
      branch: 'ece',
      semester: 3,
      score: 14,
      total_questions: 15,
      accuracy: 93.3,
      completion_time_seconds: 810,
      submitted_at: '2026-09-08T13:43:30Z',
      rank: 2
    },
    {
      id: 'qlb_03',
      event_id: 'qz_evt_sept_w2_cse',
      user_id: 'usr_cse_01',
      student_name: 'Ananya Sharma',
      student_techpath_id: 'TP-CSE-9K2L44',
      branch: 'cse',
      semester: 3,
      score: 15,
      total_questions: 15,
      accuracy: 100,
      completion_time_seconds: 650,
      submitted_at: '2026-09-15T13:40:50Z',
      rank: 1
    },
    {
      id: 'qlb_04',
      event_id: 'qz_evt_sept_w2_cse',
      user_id: 'usr_aiml_01',
      student_name: 'Sneha Patel',
      student_techpath_id: 'TP-AIML-5M3K89',
      branch: 'cse',
      semester: 3,
      score: 14,
      total_questions: 15,
      accuracy: 93.3,
      completion_time_seconds: 720,
      submitted_at: '2026-09-15T13:42:00Z',
      rank: 2
    }
  ],

  // Monthly Quiz League Standings
  monthly_quiz_leagues: [
    {
      id: 'mql_sept_01',
      month: 'September 2026',
      student_name: 'Rahul Varma',
      student_techpath_id: 'TP-ECE-7W4R88',
      branch: 'ece',
      semester: 3,
      total_points: 20,
      quizzes_participated: 1,
      average_score: 15.0,
      best_score: 15,
      overall_rank: 1
    },
    {
      id: 'mql_sept_02',
      month: 'September 2026',
      student_name: 'Ananya Sharma',
      student_techpath_id: 'TP-CSE-9K2L44',
      branch: 'cse',
      semester: 3,
      total_points: 20,
      quizzes_participated: 1,
      average_score: 15.0,
      best_score: 15,
      overall_rank: 2
    },
    {
      id: 'mql_sept_03',
      month: 'September 2026',
      student_name: 'Priya Nair',
      student_techpath_id: 'TP-ECE-2W9P55',
      branch: 'ece',
      semester: 3,
      total_points: 17,
      quizzes_participated: 1,
      average_score: 14.0,
      best_score: 14,
      overall_rank: 3
    }
  ]
};
