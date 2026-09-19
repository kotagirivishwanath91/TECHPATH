/**
 * TECHPATH — GOAL ENGINE
 * Create, track, and complete learning goals with deadlines and progress
 */
import { dbStore } from '../db/store.js';

export class GoalEngine {
  static _userId() {
    try { return JSON.parse(localStorage.getItem('TP_AUTH_STATE') || '{}')?.user?.id || 'usr_guest'; }
    catch { return 'usr_guest'; }
  }

  static async createGoal({ title, type, targetValue, unit, deadline, subjectId, skillId, examId }) {
    const goal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2,5)}`,
      user_id: this._userId(),
      title,
      type,         // 'topics' | 'videos' | 'quiz_score' | 'skill_level' | 'study_hours' | 'project'
      targetValue: Number(targetValue),
      currentValue: 0,
      unit: unit || '',
      deadline,
      subject_id: subjectId || null,
      skill_id: skillId || null,
      exam_id: examId || null,
      status: 'active',   // 'active' | 'completed' | 'missed'
      created_at: new Date().toISOString()
    };
    await dbStore.insert('goals', goal);
    return goal;
  }

  static async getAll() {
    return dbStore.filter('goals', g => g.user_id === this._userId());
  }

  static async getActive() {
    return dbStore.filter('goals', g => g.user_id === this._userId() && g.status === 'active');
  }

  static async updateProgress(goalId, newValue) {
    const goal = await dbStore.getById('goals', goalId);
    if (!goal) return null;
    const status = newValue >= goal.targetValue ? 'completed' : 'active';
    const updated = await dbStore.update('goals', goalId, { currentValue: newValue, status });
    return updated;
  }

  static async deleteGoal(goalId) {
    return dbStore.delete('goals', goalId);
  }

  /** Auto-sync progress from completed items */
  static async syncFromProgress() {
    const userId = this._userId();
    const goals = await this.getActive();
    for (const goal of goals) {
      let count = 0;
      if (goal.type === 'topics') {
        const done = await dbStore.filter('learning_progress', r => r.user_id === userId && r.type === 'topic');
        count = done.length;
      } else if (goal.type === 'videos') {
        const done = await dbStore.filter('learning_progress', r => r.user_id === userId && r.type === 'video');
        count = done.length;
      } else if (goal.type === 'quiz_score') {
        const attempts = await dbStore.filter('quiz_attempts', r => r.user_id === userId);
        if (attempts.length > 0) count = Math.max(...attempts.map(a => a.percentage));
      }
      if (count !== goal.currentValue) await this.updateProgress(goal.id, count);
    }
  }
}
