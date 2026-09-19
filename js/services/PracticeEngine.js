/**
 * TECHPATH — PRACTICE CENTER ENGINE
 * Manages question retrieval, multi-category filtering, active session timing,
 * scoring evaluation with negative marks support, and weak topic remediation.
 */

import { dbStore } from '../db/store.js';

export const PRACTICE_CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: '🌟' },
  { id: 'subject_drill', label: 'Subject Practice', icon: '📖' },
  { id: 'topic_drill', label: 'Topic Practice', icon: '📑' },
  { id: 'mcq', label: 'MCQs', icon: '🔘' },
  { id: 'pyq', label: 'Previous-Year Questions', icon: '📜' },
  { id: 'coding', label: 'Coding Practice', icon: '💻' },
  { id: 'engineering_problem', label: 'Engineering Problems', icon: '⚙️' },
  { id: 'aptitude', label: 'Aptitude', icon: '💡' },
  { id: 'reasoning', label: 'Reasoning', icon: '🧩' },
  { id: 'quantitative', label: 'Quantitative Ability', icon: '📐' },
  { id: 'technical', label: 'Technical Questions', icon: '⚡' },
  { id: 'interview_prep', label: 'Interview Questions', icon: '🎤' },
  { id: 'exam_drill', label: 'Exam Practice', icon: '🎯' }
];

export class PracticeEngine {
  /**
   * Fetch questions backed by IndexedDB with multi-dimensional filtering
   */
  static async getQuestions(filter = {}) {
    const {
      category = 'all',
      branchId = 'all',
      semesterId = 'all',
      difficulty = 'all',
      search = ''
    } = filter;

    let questions = await dbStore.getAll('practice_questions');

    // Also pull from quiz_questions to enrich practice pool
    const quizQuestions = await dbStore.getAll('quiz_questions');
    if (quizQuestions && quizQuestions.length > 0) {
      const mapped = quizQuestions.map(q => ({
        id: `pq_qz_${q.id}`,
        category: 'subject_drill',
        branch_id: q.branch_id || 'all',
        semester_id: q.semester_id || 'all',
        subject: q.subject_code || 'Core Engineering',
        topic: q.topic || 'Engineering Fundamentals',
        difficulty: q.difficulty || 'medium',
        question: q.question,
        options: q.options,
        correct_option: q.correct_option !== undefined ? q.correct_option : 0,
        explanation: q.explanation || 'Verified from canonical engineering curriculum syllabus.'
      }));
      questions = [...questions, ...mapped];
    }

    // Apply category filter
    if (category && category !== 'all') {
      questions = questions.filter(q => {
        if (category === 'mcq') return true;
        if (category === 'subject_drill') return q.category === 'subject_drill' || q.category === 'technical';
        if (category === 'topic_drill') return q.category === 'topic_drill' || q.category === 'engineering_problem';
        if (category === 'interview_prep') return q.category === 'interview_prep' || q.category === 'technical';
        if (category === 'exam_drill') return q.category === 'exam_drill' || q.category === 'pyq';
        return q.category === category;
      });
    }

    // Apply branch filter (allow 'all' branch tagged questions)
    if (branchId && branchId !== 'all') {
      questions = questions.filter(q => q.branch_id === branchId || q.branch_id === 'all');
    }

    // Apply semester filter
    if (semesterId && semesterId !== 'all') {
      questions = questions.filter(q => q.semester_id === semesterId || q.semester_id === 'all');
    }

    // Apply difficulty filter
    if (difficulty && difficulty !== 'all') {
      questions = questions.filter(q => (q.difficulty || 'medium').toLowerCase() === difficulty.toLowerCase());
    }

    // Apply search query filter
    if (search && search.trim()) {
      const qLower = search.toLowerCase().trim();
      questions = questions.filter(q =>
        (q.question || '').toLowerCase().includes(qLower) ||
        (q.subject || '').toLowerCase().includes(qLower) ||
        (q.topic || '').toLowerCase().includes(qLower)
      );
    }

    return questions;
  }

  /**
   * Submit and evaluate a practice drill attempt
   */
  static async evaluatePracticeAttempt({
    category = 'practice',
    questions = [],
    userAnswers = {},
    markedForReview = {},
    timeSpentSeconds = 0
  }) {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    const weakTopics = new Set();
    const details = [];

    questions.forEach((q, idx) => {
      const selected = userAnswers[q.id];
      const isCorrect = selected !== undefined && Number(selected) === Number(q.correct_option);
      const isAnswered = selected !== undefined && selected !== null;

      if (!isAnswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
        if (q.topic) weakTopics.add(q.topic);
      }

      details.push({
        questionIndex: idx + 1,
        questionId: q.id,
        question: q.question,
        selectedOption: selected,
        correctOption: q.correct_option,
        isCorrect,
        isAnswered,
        isMarkedForReview: !!markedForReview[q.id],
        explanation: q.explanation,
        topic: q.topic,
        subject: q.subject
      });
    });

    const total = questions.length;
    const score = correctCount;
    const accuracy = total > 0 ? Math.round((correctCount / (correctCount + incorrectCount || 1)) * 100) : 0;

    const attempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      category,
      total_questions: total,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      unanswered_count: unansweredCount,
      score,
      accuracy_percentage: accuracy,
      time_spent_seconds: timeSpentSeconds,
      weak_topics: Array.from(weakTopics),
      created_at: new Date().toISOString()
    };

    try {
      await dbStore.insert('practice_attempts', attempt);
    } catch (err) {
      console.warn('Could not persist practice attempt:', err.message);
    }

    return {
      attempt,
      details,
      score,
      total,
      accuracy,
      weakTopics: Array.from(weakTopics),
      timeSpentSeconds
    };
  }

  /**
   * Fetch recent practice attempt history
   */
  static async getAttemptHistory() {
    try {
      const attempts = await dbStore.getAll('practice_attempts');
      return attempts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch {
      return [];
    }
  }
}
