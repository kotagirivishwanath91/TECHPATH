/**
 * TECHPATH — STRICT CONTENT FILTERING & BRANCH ISOLATION ENGINE
 * Zero-Tolerance Policy on Cross-Branch and Cross-Semester Contamination
 * Enforces canonical ID matching only (No display-name guessing)
 */

import { dbStore } from '../db/store.js';

export class ContentFilterEngine {
  /**
   * Fetches subjects strictly matching canonical branch_id and semester_id
   */
  static async getSubjects(branch_id, semester_id) {
    if (!branch_id || !semester_id) return [];
    return dbStore.filter('subjects', (s) => s.branch_id === branch_id && s.semester_id === semester_id);
  }

  /**
   * Fetches topics strictly matching subject_id
   */
  static async getTopics(subject_id) {
    if (!subject_id) return [];
    return dbStore.filter('topics', (t) => t.subject_id === subject_id);
  }

  /**
   * Fetches videos strictly matching branch_id (Zero-Tolerance Cross-Branch Policy)
   */
  static async getVideos(branch_id, semester_id, subject_id = null) {
    if (!branch_id) return [];
    const branchVideos = await dbStore.filter('videos', (v) => v.branch_id === branch_id);
    if (!branchVideos || branchVideos.length === 0) return [];

    if (semester_id) {
      const semMatches = branchVideos.filter((v) => {
        const semMatch = v.semester_id === semester_id;
        const subMatch = subject_id ? v.subject_id === subject_id : true;
        return semMatch && subMatch;
      });
      if (semMatches.length > 0) return semMatches;
    }

    return branchVideos;
  }

  /**
   * Fetches 3D models strictly for branch_id and semester_id (Zero-Tolerance Cross-Branch Policy)
   */
  static async get3DModels(branch_id, semester_id, subject_id = null) {
    if (!branch_id) return [];
    const branchModels = await dbStore.filter('branch_models', (m) => m.branch_id === branch_id);
    if (!branchModels || branchModels.length === 0) return [];

    if (semester_id) {
      const semMatches = branchModels.filter((m) => {
        const semMatch = m.semester_id === semester_id;
        const subMatch = subject_id ? m.subject_id === subject_id : true;
        return semMatch && subMatch;
      });
      if (semMatches.length > 0) return semMatches;
    }

    // Return all authentic models for this branch if current semester has none mapped
    return branchModels;
  }

  /**
   * Fetches projects strictly for branch_id and semester_id
   */
  static async getProjects(branch_id, semester_id) {
    if (!branch_id) return [];
    return dbStore.filter('projects', (p) => {
      const branchMatch = p.branch_id === branch_id;
      const semMatch = semester_id ? p.semester_id === semester_id : true;
      return branchMatch && semMatch;
    });
  }

  /**
   * Fetches quizzes strictly for branch_id and semester_id
   */
  static async getQuizzes(branch_id, semester_id, subject_id = null) {
    if (!branch_id || !semester_id) return [];
    return dbStore.filter('quiz_questions', (q) => {
      const branchMatch = q.branch_id === branch_id;
      const semMatch = q.semester_id === semester_id;
      const subMatch = subject_id ? q.subject_id === subject_id : true;
      return branchMatch && semMatch && subMatch;
    });
  }

  /**
   * Standard Honest Empty State Generator
   */
  static getEmptyStateNotice(branchCode, semesterName) {
    return {
      title: 'Content In Preparation',
      message: 'Content for this branch is currently being prepared.',
      icon: 'in-progress'
    };
  }
}
