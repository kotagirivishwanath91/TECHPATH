/**
 * TECHPATH — EXAM ROADMAP AI ENGINE
 * Generates personalized, date-aware, exam-specific preparation roadmaps for:
 * 1. Language & Study Abroad (IELTS, TOEFL, PTE, Duolingo, GRE, GMAT, SAT, ACT)
 * 2. Government & Competitive (UPSC Civil Services, SSC, Banking, Railways, State PSC, Defence)
 * 3. Academic & Professional (University Semester Exams, GATE, CAT, JEE, NEET, AWS/Cloud Certifications)
 * Tracks task progress (Not Started, In Progress, Completed) persisted to Supabase and IndexedDB.
 */

import { dbStore } from '../db/store.js';
import { supabase } from '../lib/supabase.js';

export const EXAM_CATALOG = [
  // ── LANGUAGE & STUDY ABROAD ────────────────────────────────────────────────
  {
    id: 'exam_ielts',
    name: 'IELTS (International English Language Testing System)',
    short_name: 'IELTS Academic / General',
    category: 'language',
    conducting_org: 'British Council & IDP',
    default_target: 'Band 7.5+',
    score_metric: 'Band Score (0 - 9.0)',
    sections: ['Listening', 'Reading', 'Writing (Task 1 & 2)', 'Speaking', 'Grammar & Vocabulary'],
    description: 'Premier English language assessment required for higher education and migration to the UK, Canada, Australia, and New Zealand.',
    recommended_duration_weeks: 8,
    is_active: true
  },
  {
    id: 'exam_toefl',
    name: 'TOEFL iBT (Test of English as a Foreign Language)',
    short_name: 'TOEFL iBT',
    category: 'language',
    conducting_org: 'ETS (Educational Testing Service)',
    default_target: '105+ / 120',
    score_metric: 'Total Score (0 - 120)',
    sections: ['Reading', 'Listening', 'Speaking', 'Writing'],
    description: 'Standardized test measuring the English language ability of non-native speakers for university admissions.',
    recommended_duration_weeks: 8,
    is_active: true
  },
  {
    id: 'exam_pte',
    name: 'PTE Academic (Pearson Test of English)',
    short_name: 'PTE Academic',
    category: 'language',
    conducting_org: 'Pearson PLC',
    default_target: '75+ / 90',
    score_metric: 'Score (10 - 90)',
    sections: ['Speaking & Writing', 'Reading', 'Listening'],
    description: 'Computer-based academic English language test accepted by educational institutions worldwide.',
    recommended_duration_weeks: 6,
    is_active: true
  },
  {
    id: 'exam_det',
    name: 'Duolingo English Test (DET)',
    short_name: 'Duolingo English Test',
    category: 'language',
    conducting_org: 'Duolingo',
    default_target: '130+ / 160',
    score_metric: 'Score (10 - 160)',
    sections: ['Literacy', 'Comprehension', 'Conversation', 'Production'],
    description: 'Modern, online English proficiency assessment accepted by thousands of global universities.',
    recommended_duration_weeks: 4,
    is_active: true
  },
  {
    id: 'exam_gre',
    name: 'GRE General Test (Graduate Record Examination)',
    short_name: 'GRE General',
    category: 'language',
    conducting_org: 'ETS',
    default_target: '325+ (Quant 168+, Verbal 157+)',
    score_metric: 'Score (260 - 340)',
    sections: ['Quantitative Reasoning', 'Verbal Reasoning', 'Analytical Writing'],
    description: 'Standardized examination required for admission to graduate programs and business schools globally.',
    recommended_duration_weeks: 12,
    is_active: true
  },
  {
    id: 'exam_gmat',
    name: 'GMAT Focus Edition (Graduate Management Admission Test)',
    short_name: 'GMAT Focus',
    category: 'language',
    conducting_org: 'GMAC',
    default_target: '685+ (90th percentile)',
    score_metric: 'Score (205 - 805)',
    sections: ['Quantitative Reasoning', 'Verbal Reasoning', 'Data Insights'],
    description: 'Premier business school entrance exam evaluating analytical and reasoning skills.',
    recommended_duration_weeks: 14,
    is_active: true
  },
  {
    id: 'exam_sat',
    name: 'SAT (Scholastic Assessment Test)',
    short_name: 'Digital SAT',
    category: 'language',
    conducting_org: 'College Board',
    default_target: '1450+ / 1600',
    score_metric: 'Score (400 - 1600)',
    sections: ['Reading and Writing', 'Math (Calculator Allowed)'],
    description: 'Standardized test widely used for undergraduate college admissions in the United States and abroad.',
    recommended_duration_weeks: 10,
    is_active: true
  },

  // ── GOVERNMENT & COMPETITIVE ──────────────────────────────────────────────
  {
    id: 'exam_upsc_cse',
    name: 'UPSC Civil Services Examination (IAS / IPS / IFS)',
    short_name: 'UPSC CSE',
    category: 'government',
    conducting_org: 'Union Public Service Commission (India)',
    default_target: 'Top 100 All India Rank',
    score_metric: 'Rank & Cutoff Marks',
    sections: ['Prelims GS Paper 1', 'Prelims CSAT Paper 2', 'Mains Essay & GS 1-4', 'Mains Optional Papers', 'Personality Test (Interview)'],
    description: 'India’s premier competitive examination for recruitment to higher civil services including IAS, IPS, and IFS.',
    recommended_duration_weeks: 40,
    is_active: true
  },
  {
    id: 'exam_ssc_cgl',
    name: 'SSC CGL (Combined Graduate Level Examination)',
    short_name: 'SSC CGL',
    category: 'government',
    conducting_org: 'Staff Selection Commission',
    default_target: 'Tier-1 150+, Tier-2 320+',
    score_metric: 'Total Marks',
    sections: ['General Intelligence & Reasoning', 'General Awareness', 'Quantitative Aptitude', 'English Comprehension'],
    description: 'Recruitment examination for Group B and C gazetted and non-gazetted posts in government ministries.',
    recommended_duration_weeks: 16,
    is_active: true
  },
  {
    id: 'exam_ibps_po',
    name: 'IBPS / SBI Probationary Officer (Bank PO)',
    short_name: 'Banking PO (SBI / IBPS)',
    category: 'government',
    conducting_org: 'IBPS & State Bank of India',
    default_target: 'Final Selection Rank',
    score_metric: 'Sectional & Aggregate Cutoff',
    sections: ['Prelims Quantitative Aptitude', 'Prelims Reasoning Ability', 'Mains Data Analysis', 'Banking & Financial Awareness'],
    description: 'Competitive recruitment for Management Trainees and Probationary Officers across public sector banks.',
    recommended_duration_weeks: 14,
    is_active: true
  },
  {
    id: 'exam_rrb_ntpc',
    name: 'Railway RRB NTPC (Non-Technical Popular Categories)',
    short_name: 'Railway RRB NTPC',
    category: 'government',
    conducting_org: 'Railway Recruitment Control Board',
    default_target: 'CBT 1 & 2 Merit Rank',
    score_metric: 'Normalized Score',
    sections: ['General Awareness & Current Affairs', 'Mathematics', 'General Intelligence & Reasoning'],
    description: 'Recruitment drive for operational and administrative posts in Indian Railways.',
    recommended_duration_weeks: 12,
    is_active: true
  },
  {
    id: 'exam_defence_cds',
    name: 'UPSC CDS / NDA (Combined Defence Services)',
    short_name: 'Defence (CDS / NDA)',
    category: 'government',
    conducting_org: 'UPSC & Service Selection Board',
    default_target: 'Written Qualification + SSB Recommendation',
    score_metric: 'Written Cutoff + SSB Interview',
    sections: ['English', 'General Knowledge', 'Elementary Mathematics', 'SSB Psychological & GTO Tasks'],
    description: 'Officer training commission for Indian Military Academy, Naval Academy, and Air Force Academy.',
    recommended_duration_weeks: 16,
    is_active: true
  },

  // ── ACADEMIC & PROFESSIONAL ───────────────────────────────────────────────
  {
    id: 'exam_gate',
    name: 'GATE (Graduate Aptitude Test in Engineering)',
    short_name: 'GATE (Engineering Core)',
    category: 'academic',
    conducting_org: 'IITs & IISc',
    default_target: 'AIR < 200 (Score 850+)',
    score_metric: 'GATE Score (1000) & AIR',
    sections: ['Engineering Mathematics', 'General Aptitude', 'Branch-Specific Technical Core (CSE, ECE, EEE, MECH, CIVIL)'],
    description: 'National entrance examination for M.Tech/Ph.D admissions to IITs/IISc and executive engineering recruitment in PSUs.',
    recommended_duration_weeks: 24,
    is_active: true
  },
  {
    id: 'exam_cat',
    name: 'CAT (Common Admission Test - IIMs)',
    short_name: 'CAT (MBA Entrance)',
    category: 'academic',
    conducting_org: 'Indian Institutes of Management (IIMs)',
    default_target: '99.5+ Percentile',
    score_metric: 'Percentile Score',
    sections: ['VARC (Verbal Ability & Reading Comprehension)', 'DILR (Data Interpretation & Logical Reasoning)', 'QA (Quantitative Aptitude)'],
    description: 'Premier management entrance examination for admission to the 21 IIMs and top business schools in India.',
    recommended_duration_weeks: 20,
    is_active: true
  },
  {
    id: 'exam_semester',
    name: 'University Semester Final Examination',
    short_name: 'University Semester Exams',
    category: 'academic',
    conducting_org: 'State & Autonomous Universities',
    default_target: 'SGPA 9.0+ / O Grade',
    score_metric: 'SGPA / Percentage',
    sections: ['Unit 1 (Fundamentals)', 'Unit 2 (Core Models)', 'Unit 3 (Advanced Mechanics)', 'Unit 4 (Applied Systems)', 'Unit 5 (Case Studies & PYQs)'],
    description: 'Comprehensive academic semester examinations across engineering departments and theoretical units.',
    recommended_duration_weeks: 6,
    is_active: true
  },
  {
    id: 'exam_cert_aws',
    name: 'AWS Certified Solutions Architect — Associate (SAA-C03)',
    short_name: 'AWS Solutions Architect Associate',
    category: 'certification',
    conducting_org: 'Amazon Web Services',
    default_target: '820+ / 1000',
    score_metric: 'Scaled Score (100 - 1000)',
    sections: ['Design Secure Architectures', 'Design Resilient Architectures', 'Design High-Performing Architectures', 'Design Cost-Optimized Architectures'],
    description: 'Industry-standard cloud certification validating expertise in designing distributed AWS systems.',
    recommended_duration_weeks: 8,
    is_active: true
  },
  {
    id: 'exam_cert_gcp',
    name: 'Google Cloud Associate Cloud Engineer (ACE)',
    short_name: 'Google Cloud ACE',
    category: 'certification',
    conducting_org: 'Google Cloud',
    default_target: 'Pass / 100%',
    score_metric: 'Pass / Fail',
    sections: ['Setting up a cloud solution environment', 'Planning and configuring a cloud solution', 'Deploying and implementing solutions', 'Ensuring successful operations'],
    description: 'Validates ability to deploy applications, monitor operations, and manage enterprise solutions on Google Cloud.',
    recommended_duration_weeks: 6,
    is_active: true
  }
];

export class ExamRoadmapEngine {
  /**
   * Retrieves all available exams, merging static catalog with admin-configured database records
   */
  static async getAvailableExams() {
    let customExams = [];
    try {
      customExams = await dbStore.getAll('exams');
    } catch { /* proceed */ }

    const map = new Map();
    // Seed canonical catalog
    EXAM_CATALOG.forEach(ex => map.set(ex.id, ex));
    // Overlay admin custom records
    customExams.forEach(ex => {
      if (ex.is_active !== false) {
        map.set(ex.id, {
          id: ex.id,
          name: ex.title || ex.name,
          short_name: ex.short_name || ex.title,
          category: ex.exam_type || ex.category || 'academic',
          conducting_org: ex.conducting_org || 'Exam Authority',
          default_target: ex.default_target || 'High Score',
          score_metric: ex.score_metric || 'Marks',
          sections: ex.sections || ['Section 1', 'Section 2', 'Practice Mocks'],
          description: ex.description || ex.syllabus_summary || 'Standardized examination preparation.',
          recommended_duration_weeks: ex.recommended_duration_weeks || 8,
          is_active: true
        });
      }
    });

    return Array.from(map.values());
  }

  static async getExamById(examId) {
    const all = await this.getAvailableExams();
    return all.find(e => e.id === examId) || all[0];
  }

  /**
   * Generates a personalized, date-aware, exam-specific preparation roadmap
   */
  static async generateExamRoadmap(options = {}) {
    const {
      examId = 'exam_ielts',
      targetScore = '',
      examDate = null,
      currentLevel = 'intermediate',
      diagnosticScore = '',
      dailyHours = 3,
      prepDurationWeeks = null,
      weakAreas = [],
      strongAreas = [],
      preferredLanguage = 'en',
      userId = 'usr_guest',
      branch = 'cse'
    } = options;

    const exam = await this.getExamById(examId);

    // 1. Calculate time availability
    let calculatedWeeks = prepDurationWeeks || exam.recommended_duration_weeks || 8;
    let daysRemaining = null;

    if (examDate) {
      const targetDate = new Date(examDate);
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      calculatedWeeks = Math.max(2, Math.ceil(daysRemaining / 7));
    }

    const totalEstimatedStudyHours = calculatedWeeks * 7 * dailyHours;

    // 2. Synthesize exam-specific phases and actionable task modules
    const phases = this._synthesizePhasesForExam(
      exam,
      calculatedWeeks,
      dailyHours,
      targetScore || exam.default_target,
      currentLevel,
      diagnosticScore,
      weakAreas,
      strongAreas,
      branch
    );

    // 3. Build overall roadmap structure
    const roadmapId = `erm_${userId}_${exam.id}_${Date.now()}`;
    const roadmap = {
      id: roadmapId,
      user_id: userId,
      exam_id: exam.id,
      exam_name: exam.name,
      exam_short_name: exam.short_name,
      category: exam.category,
      target_score: targetScore || exam.default_target,
      exam_date: examDate,
      days_remaining: daysRemaining,
      calculated_weeks: calculatedWeeks,
      daily_study_hours: dailyHours,
      total_estimated_hours: totalEstimatedStudyHours,
      current_level: currentLevel,
      diagnostic_score: diagnosticScore,
      weak_areas: weakAreas,
      strong_areas: strongAreas,
      preferred_language: preferredLanguage,
      phases,
      overall_progress: 0,
      total_tasks: phases.reduce((acc, p) => acc + p.tasks.length, 0),
      completed_tasks: 0,
      strategy_notes: this._generateExamStrategy(exam, targetScore, weakAreas, calculatedWeeks),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 4. Persist to local IndexedDB store
    try {
      await dbStore.insert('exam_roadmaps', roadmap);
    } catch {
      await dbStore.update('exam_roadmaps', roadmap.id, roadmap);
    }

    // 5. Persist to Supabase if user is authenticated
    if (userId && userId !== 'usr_guest') {
      try {
        await supabase.from('exam_roadmaps').upsert({
          user_id: userId,
          exam_id: exam.id,
          exam_title: exam.name,
          exam_category: exam.category,
          target_score: targetScore || exam.default_target,
          exam_date: examDate || null,
          daily_hours: dailyHours,
          current_level: currentLevel,
          weak_areas: weakAreas,
          strong_areas: strongAreas,
          phases,
          overall_progress: 0
        });
      } catch (err) {
        console.warn('[ExamRoadmapEngine] Supabase roadmap save note:', err.message);
      }
    }

    return roadmap;
  }

  /**
   * Updates task status in roadmap, recalculates percentage, and syncs to Supabase
   */
  static async updateTaskStatus(userId, roadmapId, taskId, status = 'completed') {
    if (!userId) return null;

    // 1. Save individual task progress
    const progressRec = {
      id: `taskprog_${userId}_${roadmapId}_${taskId}`,
      user_id: userId,
      roadmap_id: roadmapId,
      task_id: taskId,
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null
    };

    try {
      await dbStore.insert('user_exam_progress', progressRec);
    } catch {
      await dbStore.update('user_exam_progress', progressRec.id, progressRec);
    }

    if (userId !== 'usr_guest') {
      try {
        await supabase.from('user_exam_progress').upsert({
          user_id: userId,
          roadmap_id: roadmapId,
          task_id: taskId,
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        }, { onConflict: 'user_id, roadmap_id, task_id' });
      } catch (err) {
        console.warn('[ExamRoadmapEngine] Supabase task update note:', err.message);
      }
    }

    // 2. Update cached roadmap in dbStore
    let roadmap = await dbStore.getById('exam_roadmaps', roadmapId);
    if (roadmap) {
      let total = 0;
      let completed = 0;
      roadmap.phases.forEach(ph => {
        ph.tasks.forEach(t => {
          total++;
          if (t.id === taskId) t.status = status;
          if (t.status === 'completed') completed++;
        });
        const phTotal = ph.tasks.length;
        const phDone = ph.tasks.filter(t => t.status === 'completed').length;
        ph.progress = phTotal > 0 ? Math.round((phDone / phTotal) * 100) : 0;
      });

      roadmap.total_tasks = total;
      roadmap.completed_tasks = completed;
      roadmap.overall_progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      roadmap.updated_at = new Date().toISOString();

      await dbStore.update('exam_roadmaps', roadmapId, roadmap);
      return roadmap;
    }

    return null;
  }

  /**
   * Retrieves active roadmap for user and applies persisted user task completions
   */
  static async getActiveRoadmap(userId = 'usr_guest', examId = null) {
    let all = await dbStore.getAll('exam_roadmaps');
    let userRoadmaps = all.filter(r => r.user_id === userId);

    if (userRoadmaps.length === 0 && userId && userId !== 'usr_guest') {
      try {
        const { data } = await supabase
          .from('exam_roadmaps')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (data && data.length > 0) {
          for (const item of data) {
            await dbStore.insert('exam_roadmaps', item);
          }
          userRoadmaps = data;
        }
      } catch { /* proceed */ }
    }

    if (userRoadmaps.length === 0) return null;

    let target = examId ? userRoadmaps.find(r => r.exam_id === examId) : userRoadmaps[userRoadmaps.length - 1];
    if (!target) target = userRoadmaps[userRoadmaps.length - 1];

    // Load task progress
    let taskProgress = await dbStore.filter('user_exam_progress', p => p.user_id === userId && p.roadmap_id === target.id);
    if (taskProgress.length === 0 && userId && userId !== 'usr_guest') {
      try {
        const { data } = await supabase.from('user_exam_progress').select('*').eq('user_id', userId).eq('roadmap_id', target.id);
        if (data && data.length > 0) taskProgress = data;
      } catch { /* proceed */ }
    }

    const map = new Map(taskProgress.map(p => [p.task_id, p.status]));

    let total = 0;
    let completed = 0;
    target.phases.forEach(ph => {
      ph.tasks.forEach(t => {
        total++;
        if (map.has(t.id)) t.status = map.get(t.id);
        if (t.status === 'completed') completed++;
      });
      const phTotal = ph.tasks.length;
      const phDone = ph.tasks.filter(t => t.status === 'completed').length;
      ph.progress = phTotal > 0 ? Math.round((phDone / phTotal) * 100) : 0;
    });

    target.total_tasks = total;
    target.completed_tasks = completed;
    target.overall_progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return target;
  }

  /**
   * Administrative Catalog Management: Saves or updates an exam in the catalog.
   * Persists to Supabase and local indexed store.
   */
  static async createOrUpdateExam(examData) {
    if (!examData.id) {
      examData.id = 'exam_custom_' + Date.now();
    }
    examData.updated_at = new Date().toISOString();
    if (!examData.created_at) examData.created_at = new Date().toISOString();

    try {
      await dbStore.put('exams', examData);
    } catch {
      await dbStore.insert('exams', examData);
    }

    try {
      await supabase.from('exams').upsert({
        id: examData.id,
        title: examData.name || examData.title,
        exam_type: examData.category || 'academic',
        conducting_org: examData.conducting_org || '',
        description: examData.description || '',
        duration_minutes: (examData.recommended_duration_weeks || 8) * 7 * 60,
        passing_score: 70,
        total_marks: 100,
        is_active: examData.is_active !== false
      });
    } catch (err) {
      console.warn('[ExamRoadmapEngine] Supabase exam sync warning:', err.message);
    }

    return examData;
  }

  /**
   * Administrative Catalog Management: Deletes a custom exam.
   */
  static async deleteCustomExam(examId) {
    try {
      await dbStore.delete('exams', examId);
    } catch { /* proceed */ }

    try {
      await supabase.from('exams').delete().eq('id', examId);
    } catch (err) {
      console.warn('[ExamRoadmapEngine] Supabase delete exam warning:', err.message);
    }
    return true;
  }

  /**
   * Internal generator synthesizing distinct, authentic preparation phases
   * adapting specifically to the exam syllabus (IELTS vs UPSC vs GATE vs AWS).
   */
  static _synthesizePhasesForExam(exam, weeks, dailyHours, target, level, diagnostic, weakAreas, strongAreas, branch) {
    const isWeak = (name) => weakAreas.some(w => w.toLowerCase().includes(name.toLowerCase()));

    // ──────────────────────────────────────────────────────────────────────────
    // 1. IELTS SPECIFIC
    // ──────────────────────────────────────────────────────────────────────────
    if (exam.id === 'exam_ielts') {
      return [
        {
          phase_number: 1,
          title: 'Phase 1 — Diagnostic Baseline & Core Test Mechanics',
          duration_weeks: Math.max(1, Math.round(weeks * 0.2)),
          focus: 'Format Mastery, Acoustic Dictation & Band Rubric Invariants',
          progress: 0,
          tasks: [
            { id: 'ielts_t1', title: 'Take Full Official Diagnostic Test (Cambridge IELTS)', type: 'diagnostic', status: 'not_started', est_hours: 3, resourceUrl: '#/exams' },
            { id: 'ielts_t2', title: 'Listening Section 1 & 2: Form Completion & Accent Familiarization (British/Aus)', type: 'practice', status: 'not_started', est_hours: 4, resourceUrl: '#/practice' },
            { id: 'ielts_t3', title: 'Academic Reading: Skimming, Scanning & True/False/Not Given Methodology', type: 'theory', status: 'not_started', est_hours: 5, resourceUrl: '#/learning' },
            { id: 'ielts_t4', title: 'Master Academic Word List (AWL) Sublists 1–3 & Collocations', type: 'vocabulary', status: 'not_started', est_hours: 3, resourceUrl: '#/practice' }
          ]
        },
        {
          phase_number: 2,
          title: 'Phase 2 — Sectional Mastery & Deep Analytical Frameworks',
          duration_weeks: Math.max(1, Math.round(weeks * 0.3)),
          focus: isWeak('writing') ? 'PRIORITY: Task 1 & 2 Essay Structures' : 'Writing & Reading Complex Question Types',
          progress: 0,
          tasks: [
            { id: 'ielts_t5', title: 'Writing Task 1: Line Graphs, Bar Charts, Maps & Process Diagrams Overview', type: 'writing', status: 'not_started', est_hours: 6, resourceUrl: '#/pdf' },
            { id: 'ielts_t6', title: 'Writing Task 2: Agree/Disagree, Discussion & Problem-Solution Paragraph Templates', type: 'writing', status: 'not_started', est_hours: 8, resourceUrl: '#/pdf' },
            { id: 'ielts_t7', title: 'Speaking Part 2: 1-Minute Cue Card Brainstorming & Fluent Delivery Drill', type: 'speaking', status: 'not_started', est_hours: 5, resourceUrl: '#/mock-interview' },
            { id: 'ielts_t8', title: 'Reading Passage 3: Headings Matching & Abstract Synthesis Drill', type: 'reading', status: 'not_started', est_hours: 6, resourceUrl: '#/practice' }
          ]
        },
        {
          phase_number: 3,
          title: 'Phase 3 — High-Speed Conditioning & Error Analysis',
          duration_weeks: Math.max(1, Math.round(weeks * 0.25)),
          focus: 'Speed Reading, Audio Distractor Traps & Lexical Flexibility',
          progress: 0,
          tasks: [
            { id: 'ielts_t9', title: 'Listening Sections 3 & 4: Multi-Speaker Academic Debates & Fast Monologues', type: 'listening', status: 'not_started', est_hours: 6, resourceUrl: '#/practice' },
            { id: 'ielts_t10', title: 'Speaking Part 3: Deep Abstract Reasoning & Fluency with Discourse Markers', type: 'speaking', status: 'not_started', est_hours: 5, resourceUrl: '#/mock-interview' },
            { id: 'ielts_t11', title: 'Timed Writing Simulation: Complete Both Tasks in 60 Minutes Strictly', type: 'simulation', status: 'not_started', est_hours: 4, resourceUrl: '#/pdf' },
            { id: 'ielts_t12', title: 'Error Log Triage: Categorize Recurring Spelling & Grammar Penalties', type: 'analysis', status: 'not_started', est_hours: 3, resourceUrl: '#/practice' }
          ]
        },
        {
          phase_number: 4,
          title: 'Phase 4 — Full-Length Mocks & Test-Day Peak Conditioning',
          duration_weeks: Math.max(1, Math.round(weeks * 0.25)),
          focus: 'Endurance, Stress Inoculation & Target Band Score Defense',
          progress: 0,
          tasks: [
            { id: 'ielts_t13', title: 'Full Mock Test 1 (Exact Test Timing: 2h 45m)', type: 'mock', status: 'not_started', est_hours: 4, resourceUrl: '#/exams' },
            { id: 'ielts_t14', title: 'Full Mock Test 2 & Post-Exam Score Audit against Band 7.5+ Threshold', type: 'mock', status: 'not_started', est_hours: 4, resourceUrl: '#/exams' },
            { id: 'ielts_t15', title: 'Final Speaking Simulation & Audio Warmup Drills', type: 'speaking', status: 'not_started', est_hours: 3, resourceUrl: '#/mock-interview' },
            { id: 'ielts_t16', title: 'Test-Day Strategy Protocol & Passport Verification Checklist', type: 'strategy', status: 'not_started', est_hours: 2, resourceUrl: '#/learning' }
          ]
        }
      ];
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. UPSC CSE SPECIFIC
    // ──────────────────────────────────────────────────────────────────────────
    if (exam.id === 'exam_upsc_cse') {
      return [
        {
          phase_number: 1,
          title: 'Phase 1 — NCERT Foundations & Constitutional Architecture',
          duration_weeks: Math.max(2, Math.round(weeks * 0.25)),
          focus: 'Polity (M. Laxmikanth), Modern Indian History & Physical Geography',
          progress: 0,
          tasks: [
            { id: 'upsc_t1', title: 'Indian Polity: Fundamental Rights, DPSP, Parliament & Federal Relations', type: 'polity', status: 'not_started', est_hours: 18, resourceUrl: '#/learning' },
            { id: 'upsc_t2', title: 'Modern History: 1857 Revolt to 1947 Independence Movement Timeline', type: 'history', status: 'not_started', est_hours: 15, resourceUrl: '#/learning' },
            { id: 'upsc_t3', title: 'Physical & Human Geography: Geomorphology, Monsoon & River Basins', type: 'geography', status: 'not_started', est_hours: 14, resourceUrl: '#/learning' },
            { id: 'upsc_t4', title: 'Daily The Hindu / Indian Express Editorial Synthesis & Current Notes', type: 'current_affairs', status: 'not_started', est_hours: 12, resourceUrl: '#/pdf' }
          ]
        },
        {
          phase_number: 2,
          title: 'Phase 2 — Economy, Ecology & Science Foundations',
          duration_weeks: Math.max(2, Math.round(weeks * 0.25)),
          focus: 'Macroeconomics, Inflation, Biodiversity & Technology Innovations',
          progress: 0,
          tasks: [
            { id: 'upsc_t5', title: 'Indian Economy: National Income, Monetary Policy, Fiscal Deficit & External Sector', type: 'economy', status: 'not_started', est_hours: 16, resourceUrl: '#/learning' },
            { id: 'upsc_t6', title: 'Environment & Ecology: National Parks, Ramsar Sites & IUCN Red List', type: 'environment', status: 'not_started', est_hours: 14, resourceUrl: '#/learning' },
            { id: 'upsc_t7', title: 'Science & Tech: Biotech, AI, Space Missions & Nuclear Tech Developments', type: 'sci_tech', status: 'not_started', est_hours: 10, resourceUrl: '#/learning' },
            { id: 'upsc_t8', title: 'CSAT Paper 2: Reading Comprehension & Data Sufficiency Sectional Drill', type: 'csat', status: 'not_started', est_hours: 10, resourceUrl: '#/practice' }
          ]
        },
        {
          phase_number: 3,
          title: 'Phase 3 — Mains Answer Writing & Ethics (GS 4)',
          duration_weeks: Math.max(2, Math.round(weeks * 0.25)),
          focus: 'Answer Framing, Diagrams, Case Studies & Optional Subject Deep Dive',
          progress: 0,
          tasks: [
            { id: 'upsc_t9', title: 'Daily 2-Question Mains Answer Writing: Intro-Body-Conclusion Framework', type: 'writing', status: 'not_started', est_hours: 16, resourceUrl: '#/pdf' },
            { id: 'upsc_t10', title: 'Ethics, Integrity & Aptitude: Ethical Philosophies & Case Study Approaches', type: 'ethics', status: 'not_started', est_hours: 14, resourceUrl: '#/learning' },
            { id: 'upsc_t11', title: 'Internal Security & Disaster Management Frameworks', type: 'security', status: 'not_started', est_hours: 10, resourceUrl: '#/learning' },
            { id: 'upsc_t12', title: 'Solve 10 Years of Previous Prelims Question Papers (PYQs 2014-2025)', type: 'pyq', status: 'not_started', est_hours: 15, resourceUrl: '#/exams' }
          ]
        },
        {
          phase_number: 4,
          title: 'Phase 4 — Prelims Test Series & Rapid Re-Revision',
          duration_weeks: Math.max(2, Math.round(weeks * 0.25)),
          focus: 'Elimination Techniques, High-Yield Revision & Negative Marking Control',
          progress: 0,
          tasks: [
            { id: 'upsc_t13', title: 'Complete 5 Full-Length Prelims Mock Tests (Simulated 9:30 AM Slot)', type: 'mock', status: 'not_started', est_hours: 15, resourceUrl: '#/exams' },
            { id: 'upsc_t14', title: 'CSAT Mock Test Series: Secure 90+ Score to Safely Clear 66-Mark Cutoff', type: 'csat', status: 'not_started', est_hours: 8, resourceUrl: '#/exams' },
            { id: 'upsc_t15', title: 'Yearly Current Affairs Compilation (Polity, Economy, Env)', type: 'revision', status: 'not_started', est_hours: 12, resourceUrl: '#/pdf' },
            { id: 'upsc_t16', title: 'Final Question Selection & Elimination Drill (Risk vs Reward Triage)', type: 'strategy', status: 'not_started', est_hours: 5, resourceUrl: '#/learning' }
          ]
        }
      ];
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. GATE (ENGINEERING CORE) SPECIFIC
    // ──────────────────────────────────────────────────────────────────────────
    if (exam.id === 'exam_gate') {
      const bUpper = (branch || 'CSE').toUpperCase();
      return [
        {
          phase_number: 1,
          title: `Phase 1 — Engineering Mathematics & General Aptitude (${bUpper})`,
          duration_weeks: Math.max(2, Math.round(weeks * 0.25)),
          focus: 'Linear Algebra, Calculus, Probability & Verbal/Numerical Aptitude (28 Marks)',
          progress: 0,
          tasks: [
            { id: 'gate_t1', title: 'Linear Algebra: Eigenvalues, Cayley-Hamilton Theorem & Vector Spaces', type: 'math', status: 'not_started', est_hours: 12, resourceUrl: '#/learning' },
            { id: 'gate_t2', title: 'Calculus: Maxima/Minima, Mean Value Theorems, Vector Calculus', type: 'math', status: 'not_started', est_hours: 12, resourceUrl: '#/learning' },
            { id: 'gate_t3', title: 'Probability & Statistics: Baye\'s Theorem, Normal & Poisson Distributions', type: 'math', status: 'not_started', est_hours: 10, resourceUrl: '#/learning' },
            { id: 'gate_t4', title: 'General Aptitude: Spatial Reasoning, Permutations & Critical Reasoning', type: 'aptitude', status: 'not_started', est_hours: 8, resourceUrl: '#/practice' }
          ]
        },
        {
          phase_number: 2,
          title: `Phase 2 — ${bUpper} Technical Core (High-Weightage Subjects)`,
          duration_weeks: Math.max(2, Math.round(weeks * 0.35)),
          focus: bUpper === 'ECE' ? 'Signals & Systems, Analog Circuits & Electromagnetics' : 'Algorithms, TOC, Operating Systems & DBMS',
          progress: 0,
          tasks: [
            { id: 'gate_t5', title: bUpper === 'ECE' ? 'Signals: Fourier & Z-Transforms, LTI Systems' : 'Algorithms: Asymptotic Notation, Graph Algorithms, Dynamic Programming', type: 'core', status: 'not_started', est_hours: 18, resourceUrl: '#/learning' },
            { id: 'gate_t6', title: bUpper === 'ECE' ? 'Analog: Op-Amps, BJT/MOSFET Small Signal Amplifiers' : 'Theory of Computation: Regular Expressions, CFG, Turing Machine Decidability', type: 'core', status: 'not_started', est_hours: 16, resourceUrl: '#/learning' },
            { id: 'gate_t7', title: bUpper === 'ECE' ? 'Digital Circuits: Sequential Counters, State Machines' : 'Operating Systems: Virtual Memory Paging, Deadlock, CPU Scheduling', type: 'core', status: 'not_started', est_hours: 15, resourceUrl: '#/learning' },
            { id: 'gate_t8', title: bUpper === 'ECE' ? 'VLSI & Semiconductor Physics Basics' : 'DBMS: Relational Algebra, Normal Forms, Serializability & Indexing', type: 'core', status: 'not_started', est_hours: 14, resourceUrl: '#/learning' }
          ]
        },
        {
          phase_number: 3,
          title: 'Phase 3 — Chapter-Wise PYQ Drill & Virtual Calculator Mastery',
          duration_weeks: Math.max(1, Math.round(weeks * 0.2)),
          focus: 'Solve 20 Years Previous GATE Questions & Avoid Calculation Mistakes',
          progress: 0,
          tasks: [
            { id: 'gate_t9', title: 'Solve Last 15 Years GATE Technical PYQs (Subject-Wise)', type: 'pyq', status: 'not_started', est_hours: 18, resourceUrl: '#/exams' },
            { id: 'gate_t10', title: 'Practice using Official GATE Virtual Calculator for Numerical Answer Types (NAT)', type: 'tools', status: 'not_started', est_hours: 5, resourceUrl: '#/practice' },
            { id: 'gate_t11', title: 'Formula Compendium Creation: High-Yield Short Notes for Every Chapter', type: 'notes', status: 'not_started', est_hours: 8, resourceUrl: '#/pdf' }
          ]
        },
        {
          phase_number: 4,
          title: 'Phase 4 — Full Mock Exams, Rank Benchmarking & Speed Triage',
          duration_weeks: Math.max(1, Math.round(weeks * 0.2)),
          focus: 'Time Management (65 Questions in 180 Minutes) & Zero Guesswork in MCQs',
          progress: 0,
          tasks: [
            { id: 'gate_t12', title: 'Full GATE Mock Exam 1 (Strict 3-Hour Timed Session)', type: 'mock', status: 'not_started', est_hours: 4, resourceUrl: '#/exams' },
            { id: 'gate_t13', title: 'Full GATE Mock Exam 2 & Comprehensive Negative Marks Audit', type: 'mock', status: 'not_started', est_hours: 4, resourceUrl: '#/exams' },
            { id: 'gate_t14', title: 'High-Value Revision of Weak Concepts identified in Mocks', type: 'revision', status: 'not_started', est_hours: 8, resourceUrl: '#/learning' },
            { id: 'gate_t15', title: 'Final Test-Day Strategy: Question Rounding Strategy (Easy -> Medium -> NAT)', type: 'strategy', status: 'not_started', est_hours: 2, resourceUrl: '#/practice' }
          ]
        }
      ];
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. GENERIC / SEMESTER / CERTIFICATION DEFAULT
    // ──────────────────────────────────────────────────────────────────────────
    const sectionNames = exam.sections || ['Foundations', 'Core Domain', 'Applied Practice', 'Mock Reviews'];
    return [
      {
        phase_number: 1,
        title: `Phase 1 — Syllabus Scope & Diagnostic Assessment`,
        duration_weeks: Math.max(1, Math.round(weeks * 0.25)),
        focus: 'Review Syllabus, Scoring Rubrics & Foundational Definitions',
        progress: 0,
        tasks: [
          { id: `${exam.id}_p1_1`, title: `Take Diagnostic Assessment for ${exam.name}`, type: 'diagnostic', status: 'not_started', est_hours: 3, resourceUrl: '#/exams' },
          { id: `${exam.id}_p1_2`, title: `Master Core Concepts of ${sectionNames[0] || 'Unit 1'}`, type: 'theory', status: 'not_started', est_hours: 6, resourceUrl: '#/learning' },
          { id: `${exam.id}_p1_3`, title: `Review Official Examination Pattern & Negative Marking Rules`, type: 'strategy', status: 'not_started', est_hours: 2, resourceUrl: '#/pdf' }
        ]
      },
      {
        phase_number: 2,
        title: `Phase 2 — In-Depth Study of Core Sections`,
        duration_weeks: Math.max(1, Math.round(weeks * 0.35)),
        focus: sectionNames.slice(1, 3).join(' & ') || 'Technical Concepts',
        progress: 0,
        tasks: sectionNames.slice(1, 4).map((sec, idx) => ({
          id: `${exam.id}_p2_${idx + 1}`,
          title: `Intensive Study & Exercises: ${sec}`,
          type: 'core_study',
          status: 'not_started',
          est_hours: 8,
          resourceUrl: '#/learning'
        }))
      },
      {
        phase_number: 3,
        title: `Phase 3 — Targeted Practice & Question Banks`,
        duration_weeks: Math.max(1, Math.round(weeks * 0.2)),
        focus: 'Timed Sectional Tests, Flashcards & Weak Area Remediation',
        progress: 0,
        tasks: [
          { id: `${exam.id}_p3_1`, title: 'Solve 100+ High-Yield Questions on TechPath Practice Engine', type: 'practice', status: 'not_started', est_hours: 8, resourceUrl: '#/practice' },
          { id: `${exam.id}_p3_2`, title: 'Review Flashcards & Formula Summaries', type: 'revision', status: 'not_started', est_hours: 4, resourceUrl: '#/practice' }
        ]
      },
      {
        phase_number: 4,
        title: `Phase 4 — Full-Length Mocks & Test-Day Peak Performance`,
        duration_weeks: Math.max(1, Math.round(weeks * 0.2)),
        focus: 'Full Simulation, Time Management & Error Log Review',
        progress: 0,
        tasks: [
          { id: `${exam.id}_p4_1`, title: `Full-Length Mock Examination 1 (Simulated Test Environment)`, type: 'mock', status: 'not_started', est_hours: 4, resourceUrl: '#/exams' },
          { id: `${exam.id}_p4_2`, title: `Full-Length Mock Examination 2 & Detailed Score Analysis`, type: 'mock', status: 'not_started', est_hours: 4, resourceUrl: '#/exams' },
          { id: `${exam.id}_p4_3`, title: 'Final Concept Re-Revision & Exam Day Readiness Checklist', type: 'strategy', status: 'not_started', est_hours: 3, resourceUrl: '#/learning' }
        ]
      }
    ];
  }

  static _generateExamStrategy(exam, target, weakAreas, weeks) {
    const lines = [
      `Target Objective: Achieve ${target || exam.default_target} within ${weeks} weeks.`,
      `Conducting Body Standards: Calibrated strictly to ${exam.conducting_org} evaluation criteria.`,
      `Study Pacing: Dedicate regular study blocks rather than sporadic cramming.`
    ];

    if (weakAreas && weakAreas.length > 0) {
      lines.push(`Targeted Weak-Area Triage: High priority allocated to: ${weakAreas.join(', ')}.`);
    }

    if (weeks <= 4) {
      lines.push('Fast-Track Mode: Concentrated on high-yield questions, PYQs, and daily timed mock drills.');
    } else {
      lines.push('Comprehensive Mastery Mode: Balanced conceptual depth, continuous practice, and phased revision.');
    }

    return lines;
  }
}
