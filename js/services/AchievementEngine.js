/**
 * TECHPATH — ACHIEVEMENT ENGINE
 * Badge system triggered by learning events
 */
import { dbStore } from '../db/store.js';
import { NotificationEngine } from './NotificationEngine.js';

const ACHIEVEMENTS = [
  { id: 'ach_first_login',    title: 'Welcome to TechPath', desc: 'Logged in for the first time.',        icon: '🎓', trigger: 'login',              threshold: 1 },
  { id: 'ach_first_video',    title: 'First Watch',          desc: 'Watched your first lecture video.',    icon: '▶️',  trigger: 'video_completed',    threshold: 1 },
  { id: 'ach_5_videos',       title: 'Video Learner',        desc: 'Watched 5 lecture videos.',            icon: '📺', trigger: 'video_completed',    threshold: 5 },
  { id: 'ach_first_quiz',     title: 'Quiz Taker',           desc: 'Completed your first quiz.',           icon: '📝', trigger: 'quiz_completed',     threshold: 1 },
  { id: 'ach_quiz_perfect',   title: 'Perfect Score',        desc: 'Scored 100% on a quiz.',               icon: '💯', trigger: 'quiz_perfect',       threshold: 1 },
  { id: 'ach_5_topics',       title: 'Topic Explorer',       desc: 'Completed 5 topics.',                  icon: '🗺️',  trigger: 'topic_completed',    threshold: 5 },
  { id: 'ach_first_project',  title: 'Builder',              desc: 'Started your first project.',          icon: '🔨', trigger: 'project_started',    threshold: 1 },
  { id: 'ach_resume_uploaded','title': 'Career Ready',       desc: 'Uploaded and parsed your resume.',     icon: '📄', trigger: 'resume_parsed',      threshold: 1 },
  { id: 'ach_interview_done', title: 'Interview Practice',   desc: 'Completed a mock interview.',          icon: '🎤', trigger: 'interview_complete', threshold: 1 },
  { id: 'ach_7_day_streak',   title: '7-Day Streak',         desc: 'Maintained a 7-day learning streak.',  icon: '🔥', trigger: 'streak',             threshold: 7  },
  { id: 'ach_3d_explored',    title: '3D Pioneer',           desc: 'Explored a 3D engineering model.',     icon: '🧊', trigger: '3d_viewed',          threshold: 1 },
  { id: 'ach_pdf_analyzed',   title: 'Document Analyst',     desc: 'Analyzed a PDF document.',             icon: '🔍', trigger: 'pdf_analyzed',       threshold: 1 },
];

export class AchievementEngine {
  static _userId() {
    try { return JSON.parse(localStorage.getItem('TP_AUTH_STATE') || '{}')?.user?.id || 'usr_guest'; }
    catch { return 'usr_guest'; }
  }

  static async trigger(eventType, metadata = {}) {
    const userId = this._userId();
    const progress = await dbStore.filter('learning_progress', r => r.user_id === userId && r.type === eventType.replace('_completed','').replace('_started',''));
    const count = progress.length + 1;

    for (const ach of ACHIEVEMENTS) {
      if (ach.trigger !== eventType && ach.trigger !== eventType.replace('_completed','')) continue;
      if (ach.trigger === 'streak') {
        const streakKey = `TP_STREAK_${userId}`;
        const streak = JSON.parse(localStorage.getItem(streakKey) || '{"currentDays":0}');
        if (streak.currentDays < ach.threshold) continue;
      } else {
        if (count < ach.threshold) continue;
      }
      await this._grant(userId, ach);
    }
  }

  static async _grant(userId, ach) {
    const existing = await dbStore.filter('achievements', a => a.user_id === userId && a.achievement_id === ach.id);
    if (existing.length > 0) return; // already granted
    await dbStore.insert('achievements', {
      id: `ach_${userId}_${ach.id}`,
      user_id: userId,
      achievement_id: ach.id,
      title: ach.title,
      desc: ach.desc,
      icon: ach.icon,
      granted_at: new Date().toISOString()
    });
    await NotificationEngine.achievement(`${ach.icon} ${ach.title}`, ach.desc);
  }

  static async getAll(userId = this._userId()) {
    const granted = await dbStore.filter('achievements', a => a.user_id === userId);
    const grantedIds = new Set(granted.map(g => g.achievement_id));
    return ACHIEVEMENTS.map(a => ({ ...a, earned: grantedIds.has(a.id), grantedAt: granted.find(g => g.achievement_id === a.id)?.granted_at || null }));
  }
}
