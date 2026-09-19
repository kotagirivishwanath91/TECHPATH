/**
 * TECHPATH — MASTER LEARNING CONTEXT MANAGER
 * Centralized Observable State & Branch/Semester Controller
 * Enforces strict canonical isolation across all 280 inventory features
 */

import { dbStore } from '../db/store.js';

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
      learning_level: 'intermediate', // beginner, intermediate, advanced
      career_goal: 'Software Engineer',
      target_role: 'role_data_scientist',
      target_exam: 'exam_gate_cse',
      preferred_language: 'en',
      learning_preferences: {
        theme: 'dark',
        codeTheme: 'monokai',
        autoPlay3D: true,
        accessible2D: false
      },
      current_skills: [], // array of skill objects with mastery levels
      skill_gaps: [], // array of computed gap deltas
      resume_id: null
    };

    this.subscribers = new Set();
    this.loadPersistedState();
  }

  loadPersistedState() {
    try {
      const saved = localStorage.getItem('TECHPATH_LEARNING_CONTEXT');
      if (saved) {
        this.state = { ...this.state, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed reading persisted learning context', e);
    }
  }

  persist() {
    try {
      localStorage.setItem('TECHPATH_LEARNING_CONTEXT', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed saving learning context', e);
    }
  }

  // Current State Getter
  get() {
    return { ...this.state };
  }

  // Branch Selector (Immediate, Zero reload)
  async setBranch(branch_id) {
    if (this.state.branch_id === branch_id) return;
    this.state.branch_id = branch_id;

    // Automatically resolve default subject for the active branch & semester
    const subjects = await dbStore.filter('subjects', (s) => s.branch_id === branch_id && s.semester_id === this.state.semester_id);
    if (subjects.length > 0) {
      this.state.subject_id = subjects[0].id;
      const topics = await dbStore.filter('topics', (t) => t.subject_id === subjects[0].id);
      this.state.topic_id = topics.length > 0 ? topics[0].id : null;
    } else {
      this.state.subject_id = null;
      this.state.topic_id = null;
    }

    this.persist();
    this.notify('branch_changed', { branch_id, state: this.get() });
  }

  // Semester Selector (Immediate, Zero reload)
  async setSemester(semester_id) {
    if (this.state.semester_id === semester_id) return;
    this.state.semester_id = semester_id;

    // Calculate academic year from semester number
    const semNumber = parseInt(semester_id.replace('sem_', ''), 10) || 1;
    this.state.year = Math.ceil(semNumber / 2);

    // Resolve matching subjects for this branch and new semester
    const subjects = await dbStore.filter('subjects', (s) => s.branch_id === this.state.branch_id && s.semester_id === semester_id);
    if (subjects.length > 0) {
      this.state.subject_id = subjects[0].id;
      const topics = await dbStore.filter('topics', (t) => t.subject_id === subjects[0].id);
      this.state.topic_id = topics.length > 0 ? topics[0].id : null;
    } else {
      this.state.subject_id = null;
      this.state.topic_id = null;
    }

    this.persist();
    this.notify('semester_changed', { semester_id, state: this.get() });
  }

  // Subject Selector
  async setSubject(subject_id) {
    this.state.subject_id = subject_id;
    const topics = await dbStore.filter('topics', (t) => t.subject_id === subject_id);
    this.state.topic_id = topics.length > 0 ? topics[0].id : null;
    this.persist();
    this.notify('subject_changed', { subject_id, state: this.get() });
  }

  // Topic Selector
  setTopic(topic_id) {
    this.state.topic_id = topic_id;
    this.persist();
    this.notify('topic_changed', { topic_id, state: this.get() });
  }

  // Target Career Role Selector
  setTargetRole(role_id) {
    this.state.target_role = role_id;
    this.persist();
    this.notify('role_changed', { role_id, state: this.get() });
  }

  // Target Exam Selector
  setTargetExam(exam_id) {
    this.state.target_exam = exam_id;
    this.persist();
    this.notify('exam_changed', { exam_id, state: this.get() });
  }

  // Language Selector
  setLanguage(langCode) {
    this.state.preferred_language = langCode;
    document.documentElement.lang = langCode;
    this.persist();
    this.notify('language_changed', { langCode, state: this.get() });
  }

  // Update Skills & Gaps
  setSkillsAndGaps(currentSkills, skillGaps) {
    this.state.current_skills = currentSkills;
    this.state.skill_gaps = skillGaps;
    this.persist();
    this.notify('skills_updated', { currentSkills, skillGaps, state: this.get() });
  }

  // Set Active Resume
  setResume(resume_id) {
    this.state.resume_id = resume_id;
    this.persist();
    this.notify('resume_updated', { resume_id, state: this.get() });
  }

  // Generalized Mutation
  update(patch) {
    this.state = { ...this.state, ...patch };
    this.persist();
    this.notify('state_updated', { patch, state: this.get() });
  }

  // Observable Subscription
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(event, payload) {
    this.subscribers.forEach((callback) => {
      try {
        callback(event, payload);
      } catch (err) {
        console.error('Error in LearningContext subscriber:', err);
      }
    });
  }
}

export const learningContext = new LearningContextManager();
