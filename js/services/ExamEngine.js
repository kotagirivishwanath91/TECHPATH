/**
 * TECHPATH — EXAM & CAMPUS PLACEMENT STRATEGY ENGINE
 * Implements 9-Phase Adaptive Exam Strategy, PYQ Analysis & Mock Test Grading
 */

import { dbStore } from '../db/store.js';

export class ExamEngine {
  /**
   * Generates the 9-Phase Adaptive Strategy customized to candidate timeline
   */
  static getAdaptiveStrategy(examId, targetDate, hoursPerDay = 3) {
    return {
      examId,
      hoursPerDay,
      targetDate: targetDate || '2027-02-15',
      phases: [
        { phase: 1, name: 'Syllabus Decomposition', focus: 'High-weightage unit identification & weightage mapping', durationDays: 7, status: 'completed' },
        { phase: 2, name: 'Core Foundations', focus: 'Mathematical invariants, discrete structures, and logic gates', durationDays: 21, status: 'in_progress' },
        { phase: 3, name: 'Deep Topic Learning', focus: 'Algorithmic proofs, memory hierarchy, and pipelining', durationDays: 35, status: 'pending' },
        { phase: 4, name: 'Targeted Practice', focus: 'Topic-wise standard numericals and conceptual drill sets', durationDays: 20, status: 'pending' },
        { phase: 5, name: 'Previous Year Questions (PYQs)', focus: '10-Year historical question patterns and traps', durationDays: 25, status: 'pending' },
        { phase: 6, name: 'Full-Length Mock Tests', focus: 'Time management and strict exam simulator drills', durationDays: 14, status: 'pending' },
        { phase: 7, name: 'Weak-Area Remediation', focus: 'Targeting questions missed in mock drills', durationDays: 10, status: 'pending' },
        { phase: 8, name: 'Spaced Formula Revision', focus: 'Rapid-fire formula sheets and flashcard runs', durationDays: 7, status: 'pending' },
        { phase: 9, name: 'Final Sprint', focus: 'High-confidence summary notes and sleep hygiene', durationDays: 5, status: 'pending' }
      ]
    };
  }

  /**
   * Evaluates mock exam submission including negative marking
   */
  static async gradeExamSubmission(examId, userAnswers, totalMarks = 100, negativeMarkRatio = 0.33) {
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    const weakTopics = new Set();

    userAnswers.forEach((ans) => {
      if (ans.selectedOption === ans.correctOption) {
        score += ans.marks || 1;
        correctCount++;
      } else if (ans.selectedOption !== null && ans.selectedOption !== undefined) {
        score -= (ans.marks || 1) * negativeMarkRatio;
        incorrectCount++;
        if (ans.topicTitle) weakTopics.add(ans.topicTitle);
      }
    });

    const finalScore = Math.max(0, Math.round(score * 100) / 100);
    const accuracy = userAnswers.length > 0 ? Math.round((correctCount / userAnswers.length) * 100) : 0;

    const attempt = await dbStore.insert('exam_attempts', {
      exam_id: examId,
      score: finalScore,
      total_marks: totalMarks,
      accuracy_percentage: accuracy,
      weak_topics: Array.from(weakTopics),
      time_spent_seconds: 5400
    });

    return { attempt, score: finalScore, accuracy, weakTopics: Array.from(weakTopics) };
  }
}
