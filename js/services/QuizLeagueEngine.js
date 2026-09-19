/**
 * TECHPATH — MONTHLY QUIZ LEAGUE & SCHEDULED COMPETITION ENGINE
 * Server-authoritative time-locking, branch + semester question isolation,
 * anti-tamper single-attempt validation, and deterministic leaderboards.
 */

import { dbStore } from '../db/store.js';

export class QuizLeagueEngine {
  /**
   * Get server/engine authoritative timestamp
   */
  static getNow() {
    return new Date();
  }

  /**
   * Evaluates the lifecycle state of a scheduled quiz event
   */
  static evaluateState(event) {
    const now = this.getNow().getTime();
    const start = new Date(event.start_at).getTime();
    const end = new Date(event.end_at).getTime();

    if (now < start) {
      const remainingMs = start - now;
      return {
        state: 'SCHEDULED',
        isLocked: true,
        remainingMs,
        message: `Quiz Locked until ${new Date(event.start_at).toLocaleString()}`
      };
    } else if (now >= start && now <= end) {
      const remainingMs = end - now;
      return {
        state: 'LIVE',
        isLocked: false,
        remainingMs,
        message: 'Quiz is currently LIVE!'
      };
    } else {
      return {
        state: 'ENDED',
        isLocked: true,
        remainingMs: 0,
        message: 'Quiz event has ended.'
      };
    }
  }

  /**
   * Fetch all monthly quiz events with calculated status
   */
  static async getEvents() {
    const events = await dbStore.getAll('quiz_events');
    return events.map(evt => {
      const statusMeta = this.evaluateState(evt);
      return { ...evt, statusMeta, dynamicStatus: statusMeta.state };
    }).sort((a, b) => new Date(a.start_at) - new Date(b.start_at));
  }

  /**
   * Secure question retrieval with strict start-time gating and branch+semester isolation
   */
  static async getEventQuestions(eventId, user, userBranch = 'cse', userSemester = 'sem_3') {
    const events = await dbStore.getAll('quiz_events');
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error('Quiz event does not exist.');

    // 1. Strict Security Guard: Date/Time Lock
    const state = this.evaluateState(event);
    if (state.state === 'SCHEDULED') {
      throw new Error(`Security Exception: Quiz is locked until ${new Date(event.start_at).toLocaleString()}. Questions are protected and will not be released prior to event start time.`);
    }

    // 2. Single-Attempt Guard: Check existing submission
    const existingAttempts = await dbStore.getAll('quiz_attempts');
    const pastAttempt = existingAttempts.find(a => a.event_id === eventId && a.user_id === user.id);
    if (pastAttempt) {
      return {
        isAlreadyAttempted: true,
        pastAttempt,
        questions: []
      };
    }

    // 3. Branch + Semester-Specific Question Selection
    // Fetch all practice and quiz questions
    let pool = await dbStore.getAll('practice_questions');
    const baseQuizzes = await dbStore.getAll('quiz_questions');
    if (baseQuizzes && baseQuizzes.length > 0) {
      pool = [...pool, ...baseQuizzes.map(q => ({
        id: `qz_pool_${q.id}`,
        branch_id: q.branch_id || event.branch_id,
        semester_id: q.semester_id || userSemester,
        subject: q.subject_code || 'Core',
        topic: q.topic || 'Engineering Subject',
        question: q.question,
        options: q.options,
        correct_option: q.correct_option !== undefined ? q.correct_option : 0,
        explanation: q.explanation || 'Curriculum explanation'
      }))];
    }

    // Isolate by branch and semester
    let questions = pool.filter(q =>
      (q.branch_id === event.branch_id || q.branch_id === userBranch || q.branch_id === 'all') &&
      (q.semester_id === userSemester || q.semester_id === 'all')
    );

    // If pool is small, backfill with branch general questions
    if (questions.length < 5) {
      const fallback = pool.filter(q => q.branch_id === event.branch_id || q.branch_id === 'all');
      questions = [...questions, ...fallback].slice(0, 15);
    }

    // Remove duplicates and cap to event count
    const unique = [];
    const seen = new Set();
    for (const q of questions) {
      if (!seen.has(q.question)) {
        seen.add(q.question);
        unique.push(q);
      }
      if (unique.length >= (event.total_questions || 15)) break;
    }

    return {
      isAlreadyAttempted: false,
      pastAttempt: null,
      questions: unique
    };
  }

  /**
   * Submit, grade, and record quiz attempt with deterministic leaderboard insertion
   */
  static async submitQuizAttempt(eventId, user, userProfile, userAnswers, timeSpentSeconds, questions) {
    const events = await dbStore.getAll('quiz_events');
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error('Quiz event not found.');

    // 1. Deduplication Guard: Check if user already submitted
    const existing = await dbStore.getAll('quiz_attempts');
    if (existing.some(a => a.event_id === eventId && a.user_id === user.id)) {
      throw new Error('Duplicate Attempt Prohibited: You have already completed this scheduled quiz event.');
    }

    // 2. Evaluation
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    const weakTopics = new Set();
    const details = [];

    questions.forEach((q, idx) => {
      const selected = userAnswers[q.id];
      const isAnswered = selected !== undefined && selected !== null;
      const isCorrect = isAnswered && Number(selected) === Number(q.correct_option);

      if (!isAnswered) unansweredCount++;
      else if (isCorrect) correctCount++;
      else {
        incorrectCount++;
        if (q.topic) weakTopics.add(q.topic);
      }

      details.push({
        questionNumber: idx + 1,
        question: q.question,
        selected,
        correctOption: q.correct_option,
        isCorrect,
        explanation: q.explanation,
        topic: q.topic
      });
    });

    const total = questions.length;
    const score = correctCount;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 1000) / 10 : 0;
    const nowIso = new Date().toISOString();

    // 3. Save Attempt Record
    const attemptId = `qatt_${eventId}_${user.id}_${Date.now()}`;
    const attempt = {
      id: attemptId,
      event_id: eventId,
      user_id: user.id,
      student_name: userProfile.name || user.email.split('@')[0],
      student_techpath_id: userProfile.techpath_id || 'TP-ENG-USER',
      branch: userProfile.branch_id || event.branch_id,
      semester: parseInt(String(userProfile.semester_id || 'sem_3').replace('sem_', ''), 10) || 3,
      score,
      total_questions: total,
      accuracy,
      completion_time_seconds: timeSpentSeconds,
      submitted_at: nowIso,
      weak_topics: Array.from(weakTopics)
    };

    await dbStore.insert('quiz_attempts', attempt);

    // 4. Update Deterministic Leaderboard
    const lbEntry = {
      id: `qlb_${eventId}_${user.id}`,
      event_id: eventId,
      user_id: user.id,
      student_name: attempt.student_name,
      student_techpath_id: attempt.student_techpath_id,
      branch: attempt.branch,
      semester: attempt.semester,
      score,
      total_questions: total,
      accuracy,
      completion_time_seconds: timeSpentSeconds,
      submitted_at: nowIso
    };
    await dbStore.put('quiz_leaderboards', lbEntry);

    // Compute updated rank
    const allBoard = (await dbStore.getAll('quiz_leaderboards')).filter(l => l.event_id === eventId);
    // Deterministic Sorting Rule:
    // 1. Higher Score DESC
    // 2. Higher Accuracy DESC
    // 3. Earlier Submission Time ASC
    allBoard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return new Date(a.submitted_at) - new Date(b.submitted_at);
    });

    const rank = allBoard.findIndex(l => l.user_id === user.id) + 1;
    const semesterBoard = allBoard.filter(l => l.semester === attempt.semester);
    const semesterRank = semesterBoard.findIndex(l => l.user_id === user.id) + 1;

    // 5. Update Monthly League Standings
    const mqls = await dbStore.getAll('monthly_quiz_leagues');
    let mql = mqls.find(m => m.user_id === user.id && m.month === (event.month || 'September 2026'));
    if (!mql) {
      mql = {
        id: `mql_${user.id}_${Date.now()}`,
        month: event.month || 'September 2026',
        user_id: user.id,
        student_name: attempt.student_name,
        student_techpath_id: attempt.student_techpath_id,
        branch: attempt.branch,
        semester: attempt.semester,
        total_points: score,
        quizzes_participated: 1,
        average_score: score,
        best_score: score
      };
    } else {
      mql.total_points += score;
      mql.quizzes_participated += 1;
      mql.average_score = Math.round((mql.total_points / mql.quizzes_participated) * 10) / 10;
      mql.best_score = Math.max(mql.best_score, score);
    }
    await dbStore.put('monthly_quiz_leagues', mql);

    return {
      attempt,
      details,
      score,
      total,
      accuracy,
      rank,
      semesterRank,
      weakTopics: Array.from(weakTopics)
    };
  }

  /**
   * Fetch leaderboard for an event, optionally filtered by semester
   */
  static async getLeaderboard(eventId, semester = null) {
    const all = (await dbStore.getAll('quiz_leaderboards')).filter(l => l.event_id === eventId);

    // Deterministic Sorting:
    // 1. Score DESC
    // 2. Accuracy DESC
    // 3. Earliest Submission Time ASC
    all.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return new Date(a.submitted_at) - new Date(b.submitted_at);
    });

    // Assign rank
    all.forEach((entry, idx) => { entry.overall_rank = idx + 1; });

    if (semester && semester !== 'all') {
      const semNum = parseInt(String(semester).replace('sem_', ''), 10);
      const filtered = all.filter(l => l.semester === semNum);
      filtered.forEach((entry, idx) => { entry.semester_rank = idx + 1; });
      return filtered;
    }

    return all;
  }

  /**
   * Fetch cumulative monthly league table
   */
  static async getMonthlyLeagueStandings(month = 'September 2026') {
    const mqls = (await dbStore.getAll('monthly_quiz_leagues')).filter(m => m.month === month);
    mqls.sort((a, b) => {
      if (b.total_points !== a.total_points) return b.total_points - a.total_points;
      return b.best_score - a.best_score;
    });
    mqls.forEach((entry, idx) => { entry.overall_rank = idx + 1; });
    return mqls;
  }

  /**
   * Admin Quiz Scheduler: Create new monthly event
   */
  static async createQuizEvent(eventData) {
    const id = `qz_evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEvent = {
      id,
      title: eventData.title,
      branch_id: eventData.branch_id,
      month: eventData.month || 'September 2026',
      week_number: parseInt(eventData.week_number, 10) || 1,
      start_at: eventData.start_at,
      end_at: eventData.end_at,
      duration_minutes: parseInt(eventData.duration_minutes, 10) || 30,
      total_questions: parseInt(eventData.total_questions, 10) || 15,
      status: 'scheduled',
      published: eventData.published !== false
    };
    await dbStore.insert('quiz_events', newEvent);
    return newEvent;
  }
}
