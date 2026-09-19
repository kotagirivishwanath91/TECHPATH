/**
 * TECHPATH — STUDY PLAN ENGINE
 * Generates tailored study timetables, tracks daily sessions, and manages study blocks
 */
import { dbStore } from '../db/store.js';
import { learningContext } from '../context/LearningContext.js';

export class StudyPlanEngine {
  static _userId() {
    try { return JSON.parse(localStorage.getItem('TP_AUTH_STATE') || '{}')?.user?.id || 'usr_guest'; }
    catch { return 'usr_guest'; }
  }

  static getSchedule() {
    const key = `TP_STUDY_SCHEDULE_${this._userId()}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try { return JSON.parse(raw); } catch { /* ignore */ }
    }
    return this._generateDefaultSchedule();
  }

  static saveSchedule(schedule) {
    const key = `TP_STUDY_SCHEDULE_${this._userId()}`;
    localStorage.setItem(key, JSON.stringify(schedule));
  }

  static async generateAutoPlan(hoursPerDay = 3) {
    const ctx = learningContext.get();
    const subjects = await dbStore.filter('subjects', s => s.branch_id === ctx.branch_id && s.semester_id === ctx.semester_id);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const subList = subjects.length > 0 ? subjects : [
      { id: 'sub_core_1', title: 'Core Engineering Systems', code: 'ENG201' },
      { id: 'sub_core_2', title: 'Mathematical Foundations & Analysis', code: 'MTH202' },
      { id: 'sub_core_3', title: 'Data Structures & Algorithmic Design', code: 'CSE203' }
    ];

    const slots = [];
    let subIdx = 0;
    days.forEach((day, dIdx) => {
      // 2-3 sessions per day
      const sessionCount = Math.max(1, Math.min(3, Math.round(hoursPerDay / 1.5)));
      for (let s = 0; s < sessionCount; s++) {
        const sub = subList[subIdx % subList.length];
        subIdx++;
        const timeSlot = s === 0 ? '09:00 - 10:30 AM' : s === 1 ? '02:00 - 03:30 PM' : '06:00 - 07:30 PM';
        const type = s === 0 ? 'Theory & Lecture' : s === 1 ? 'Problem Solving & Quiz' : 'Hands-on Lab / 3D Lab';

        slots.push({
          id: `slot_${dIdx}_${s}_${Date.now()}`,
          day,
          time: timeSlot,
          subjectId: sub.id,
          subjectCode: sub.code || 'ENG',
          subjectTitle: sub.title,
          type,
          durationMins: 90,
          completed: false
        });
      }
    });

    const schedule = {
      generatedAt: new Date().toISOString(),
      hoursPerDay,
      branchId: ctx.branch_id,
      semesterId: ctx.semester_id,
      slots
    };

    this.saveSchedule(schedule);
    return schedule;
  }

  static toggleSlot(slotId) {
    const sched = this.getSchedule();
    const slot = sched.slots.find(s => s.id === slotId);
    if (slot) {
      slot.completed = !slot.completed;
      this.saveSchedule(sched);
      return slot;
    }
    return null;
  }

  static addCustomSlot({ day, time, subjectTitle, type, durationMins = 60 }) {
    const sched = this.getSchedule();
    const newSlot = {
      id: `slot_custom_${Date.now()}`,
      day,
      time,
      subjectCode: 'CUSTOM',
      subjectTitle,
      type: type || 'Study Session',
      durationMins,
      completed: false
    };
    sched.slots.push(newSlot);
    this.saveSchedule(sched);
    return newSlot;
  }

  static deleteSlot(slotId) {
    const sched = this.getSchedule();
    sched.slots = sched.slots.filter(s => s.id !== slotId);
    this.saveSchedule(sched);
  }

  static _generateDefaultSchedule() {
    const defaultSlots = [
      { id: 's1', day: 'Monday', time: '09:00 - 10:30 AM', subjectCode: 'CS201', subjectTitle: 'Data Structures & Algorithms', type: 'Theory & Flashcards', durationMins: 90, completed: false },
      { id: 's2', day: 'Monday', time: '04:00 - 05:30 PM', subjectCode: 'CS202', subjectTitle: 'Computer Organization & Architecture', type: '3D Lab & Schematics', durationMins: 90, completed: false },
      { id: 's3', day: 'Tuesday', time: '10:00 - 11:30 AM', subjectCode: 'CS203', subjectTitle: 'Object Oriented Programming (Java/C++)', type: 'Practice Coding Drills', durationMins: 90, completed: false },
      { id: 's4', day: 'Wednesday', time: '09:00 - 10:30 AM', subjectCode: 'CS201', subjectTitle: 'Data Structures & Algorithms', type: 'MCQ & Quiz Drills', durationMins: 90, completed: false },
      { id: 's5', day: 'Thursday', time: '02:00 - 03:30 PM', subjectCode: 'CS204', subjectTitle: 'Discrete Mathematics', type: 'Proofs & Theorem Practice', durationMins: 90, completed: false },
      { id: 's6', day: 'Friday', time: '03:00 - 05:00 PM', subjectCode: 'PROJ', subjectTitle: 'Capstone Project Development', type: 'System Build & Git Commit', durationMins: 120, completed: false },
      { id: 's7', day: 'Saturday', time: '10:00 - 12:00 PM', subjectCode: 'GATE', subjectTitle: 'GATE Engineering Mock Test', type: 'Full Mock Test & Analysis', durationMins: 120, completed: false }
    ];
    return {
      generatedAt: new Date().toISOString(),
      hoursPerDay: 3,
      slots: defaultSlots
    };
  }
}
