/**
 * TECHPATH — PROGRESS ENGINE
 * Tracks completion of videos, topics, quizzes, flashcards, projects
 * Updates streaks, badges, analytics events
 */
import { dbStore } from '../db/store.js';

export class ProgressEngine {
  static _userId() {
    try {
      const s = JSON.parse(localStorage.getItem('TP_AUTH_STATE') || '{}');
      return s?.user?.id || 'usr_guest';
    } catch { return 'usr_guest'; }
  }

  static _key(type, itemId) { return `${this._userId()}_${type}_${itemId}`; }

  /** Mark any item complete */
  static async markComplete(type, itemId, metadata = {}) {
    const userId = this._userId();
    const record = {
      id: this._key(type, itemId),
      user_id: userId,
      type,          // 'video' | 'topic' | 'quiz' | 'flashcard' | 'project' | 'lesson'
      item_id: itemId,
      completed_at: new Date().toISOString(),
      ...metadata
    };
    await dbStore.insert('learning_progress', record);
    await this._recordAnalytics(type, itemId, metadata);
    await this._updateStreak(userId);
    return record;
  }

  /** Check if item is complete */
  static async isComplete(type, itemId) {
    const all = await dbStore.filter('learning_progress',
      r => r.user_id === this._userId() && r.type === type && r.item_id === itemId);
    return all.length > 0;
  }

  /** Get all completed items of a type */
  static async getCompleted(type) {
    return dbStore.filter('learning_progress',
      r => r.user_id === this._userId() && r.type === type);
  }

  /** Get subject progress (% of topics completed) */
  static async getSubjectProgress(subjectId, allTopics) {
    if (!allTopics || allTopics.length === 0) return 0;
    const completed = await this.getCompleted('topic');
    const topicIds = new Set(allTopics.map(t => t.id));
    const done = completed.filter(c => topicIds.has(c.item_id)).length;
    return Math.round((done / allTopics.length) * 100);
  }

  /** Record quiz attempt and score */
  static async recordQuizAttempt(quizId, subjectId, topicId, score, total, answers = []) {
    const userId = this._userId();
    const attempt = {
      id: `qa_${userId}_${Date.now()}`,
      user_id: userId,
      quiz_id: quizId,
      subject_id: subjectId,
      topic_id: topicId,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      answers,
      completed_at: new Date().toISOString()
    };
    await dbStore.insert('quiz_attempts', attempt);
    if (attempt.percentage >= 70) {
      await this.markComplete('quiz', quizId, { score, total });
    }
    return attempt;
  }

  /** Get streak data */
  static async getStreak(userId = this._userId()) {
    const key = `TP_STREAK_${userId}`;
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{"currentDays":0,"longestDays":0,"lastDate":null}');
      return data;
    } catch { return { currentDays: 0, longestDays: 0, lastDate: null }; }
  }

  static async _updateStreak(userId) {
    const key = `TP_STREAK_${userId}`;
    const today = new Date().toDateString();
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{"currentDays":0,"longestDays":0,"lastDate":null}');
      if (data.lastDate === today) return; // already counted today
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (data.lastDate === yesterday) {
        data.currentDays += 1;
      } else {
        data.currentDays = 1; // reset streak
      }
      data.longestDays = Math.max(data.longestDays, data.currentDays);
      data.lastDate = today;
      localStorage.setItem(key, JSON.stringify(data));
    } catch { /* ignore */ }
  }

  /** Record analytics event */
  static async _recordAnalytics(type, itemId, metadata) {
    await dbStore.insert('analytics_events', {
      id: `ae_${Date.now()}_${Math.random().toString(36).substr(2,5)}`,
      user_id: this._userId(),
      event_type: `${type}_completed`,
      item_id: itemId,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  /** Get overview metrics for dashboard */
  static async getOverviewMetrics() {
    const userId = this._userId();
    const [allProgress, quizAttempts, streak] = await Promise.all([
      dbStore.filter('learning_progress', r => r.user_id === userId),
      dbStore.filter('quiz_attempts', r => r.user_id === userId),
      this.getStreak(userId)
    ]);

    const totalHours = Math.round(allProgress.length * 0.35 * 10) / 10;
    const avgScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((a, q) => a + q.percentage, 0) / quizAttempts.length) + '%'
      : 'N/A';
    const userSkills = await dbStore.filter('user_skills', us => us.user_id === userId);
    const mastered = userSkills.filter(s => s.current_level >= 4).length;

    return {
      currentStreakDays: streak.currentDays,
      longestStreakDays: streak.longestDays,
      totalHoursLearned: totalHours,
      avgQuizScore: avgScore,
      skillsMastered: mastered,
      totalCompleted: allProgress.length,
      velocityDelta: totalHours > 0 ? `+${Math.round(totalHours * 0.15 * 10)/10}h this week` : 'Start learning!'
    };
  }
}
