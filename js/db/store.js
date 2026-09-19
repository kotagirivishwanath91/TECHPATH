/**
 * TECHPATH — LOCAL-FIRST RESILIENT DATA STORE
 * Hybrid IndexedDB & Reactive State Storage
 * Provides atomic persistence for all 45+ relational entities
 */

import { CANONICAL_SEED_DATA } from './seed-data.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const DB_NAME = 'TechPath_DB_v4';
const DB_VERSION = 7;

class DataStore {
  constructor() {
    this.db = null;
    this.isReady = false;
    this.memoryCache = new Map();
    this.listeners = new Set();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const stores = [
          'profiles', 'departments', 'branches', 'specializations', 'semesters',
          'subjects', 'topics', 'videos', 'lessons', 'resources',
          'branch_models', 'model_components', 'component_explanations',
          'skills', 'career_roles', 'career_role_skills', 'skill_dependencies',
          'user_skills', 'skill_gaps',
          'projects', 'project_progress',
          'quiz_questions', 'quiz_attempts', 'flashcards', 'flashcard_progress',
          'learning_progress', 'study_sessions', 'goals', 'roadmaps', 'roadmap_items',
          'resume_profiles', 'resumes', 'resume_skills', 'resume_projects',
          'interview_sessions', 'interview_questions', 'interview_answers',
          'exams', 'exam_subjects', 'exam_topics', 'exam_questions', 'exam_attempts',
          'internships', 'user_internships', 'reviews', 'support_tickets', 'notifications', 'achievements',
          'analytics_events', 'saved_items', 'recent_activity', 'recommendations',
          'community_groups', 'community_posts', 'community_replies',
          'faq_categories', 'faqs',
          'consents', 'cookie_consents', 'policy_versions', 'data_deletion_requests',
          'admin_audit_logs', 'translation_content', 'video_progress', 'certificates',
          'friend_requests', 'friendships', 'conversations', 'conversation_members',
          'messages', 'user_blocks', 'user_reports', 'social_preferences',
          // Study Groups stores
          'study_groups', 'study_group_members', 'study_group_join_requests',
          'study_group_invitations', 'study_group_messages',
          // TechPath Classes Marketplace stores
          'teaching_profiles', 'classes', 'class_availability', 'class_bookings',
          'class_students', 'payments', 'refunds', 'class_materials',
          'class_reviews', 'class_reports', 'teacher_verifications', 'class_group_mappings',
          // Exam, Practice, Interview & Quiz League stores
          'exam_categories', 'exam_sections', 'exam_roadmaps', 'exam_resources',
          'exam_papers', 'saved_exams', 'interview_roles', 'interview_question_bank',
          'interview_resources', 'practice_questions', 'practice_attempts',
          'quiz_events', 'quiz_event_semesters', 'quiz_event_topics',
          'quiz_leaderboards', 'monthly_quiz_leagues', 'quiz_notifications',
          // Career Trajectories & Exam Preparation Progress stores
          'career_trajectories', 'user_trajectory_progress', 'user_exam_progress'
        ];

        for (const storeName of stores) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.warn('IndexedDB unavailable, operating in memory/localStorage fallback mode:', event.target.error);
        this.useFallback = true;
        resolve(null);
      };
    });
  }

  initFallback() {
    this.isReady = true;
    this.seedFallback();
  }

  /**
   * Seeds all tables with verified canonical data on first boot
   */
  async seedAll() {
    if (this.useFallback || !this.db) {
      this.seedFallback();
      return;
    }

    const existing = await this.getAll('branches');
    if (existing.length === 0) {
      console.log('Seeding fresh canonical engineering dataset into IndexedDB...');
      for (const branch of (CANONICAL_SEED_DATA.branches || [])) await this.insert('branches', branch);
      for (const sem of (CANONICAL_SEED_DATA.semesters || [])) await this.insert('semesters', sem);
      for (const sub of (CANONICAL_SEED_DATA.subjects || [])) await this.insert('subjects', sub);
      for (const top of (CANONICAL_SEED_DATA.topics || [])) await this.insert('topics', top);
      for (const vid of (CANONICAL_SEED_DATA.videos || [])) await this.insert('videos', vid);
      for (const mod of (CANONICAL_SEED_DATA.branch_models || [])) await this.insert('branch_models', mod);
      for (const skl of (CANONICAL_SEED_DATA.skills || [])) await this.insert('skills', skl);
      for (const rol of (CANONICAL_SEED_DATA.career_roles || [])) await this.insert('career_roles', rol);
      for (const prj of (CANONICAL_SEED_DATA.projects || [])) await this.insert('projects', prj);
      for (const qz of (CANONICAL_SEED_DATA.quiz_questions || [])) await this.insert('quiz_questions', qz);
      for (const fc of (CANONICAL_SEED_DATA.flashcards || [])) await this.insert('flashcards', fc);
      for (const intn of (CANONICAL_SEED_DATA.internships || [])) await this.insert('internships', intn);
      for (const prof of (CANONICAL_SEED_DATA.profiles || [])) await this.insert('profiles', prof);
      for (const tp of (CANONICAL_SEED_DATA.teaching_profiles || [])) await this.insert('teaching_profiles', tp);
      for (const cls of (CANONICAL_SEED_DATA.classes || [])) await this.insert('classes', cls);
      for (const slot of (CANONICAL_SEED_DATA.class_availability || [])) await this.insert('class_availability', slot);
      for (const rev of (CANONICAL_SEED_DATA.class_reviews || [])) await this.insert('class_reviews', rev);
    }

    // Always ensure branch_models exist across all 11 disciplines
    const existingModels = await this.getAll('branch_models');
    if (existingModels.length === 0 && CANONICAL_SEED_DATA.branch_models) {
      console.log('Seeding 11-branch 3D engineering models into IndexedDB...');
      for (const mod of CANONICAL_SEED_DATA.branch_models) await this.insert('branch_models', mod);
    }

    // Always ensure enriched class rich learning fields (YouTube + 3D) exist
    if (CANONICAL_SEED_DATA.enriched_classes) {
      for (const enc of CANONICAL_SEED_DATA.enriched_classes) {
        const cls = await this.getById('classes', enc.id);
        if (cls && (!cls.youtube_videos || cls.youtube_videos.length === 0)) {
          await this.update('classes', enc.id, { ...cls, ...enc });
        }
      }
    }

    // Zero Platform Fees Guarantee: Normalize all stored classes and bookings
    try {
      const storedClasses = await this.getAll('classes');
      for (const cls of storedClasses) {
        if (cls.platform_fee !== 0 || cls.total_price !== cls.price) {
          await this.update('classes', cls.id, {
            ...cls,
            platform_fee: 0,
            total_price: cls.price
          });
        }
      }
      const storedBookings = await this.getAll('class_bookings');
      for (const b of storedBookings) {
        if (b.platform_fee !== 0 || b.total_amount !== b.amount) {
          await this.update('class_bookings', b.id, {
            ...b,
            platform_fee: 0,
            total_amount: b.amount
          });
        }
      }
    } catch { /* proceed */ }

    // Always ensure exams, practice, interview and quiz league datasets exist
    const existingExams = await this.getAll('exams');
    if (existingExams.length === 0 && CANONICAL_SEED_DATA.exams) {
      for (const ex of CANONICAL_SEED_DATA.exams) await this.insert('exams', ex);
      for (const cat of (CANONICAL_SEED_DATA.exam_categories || [])) await this.insert('exam_categories', cat);
      for (const sec of (CANONICAL_SEED_DATA.exam_sections || [])) await this.insert('exam_sections', sec);
      for (const rm of (CANONICAL_SEED_DATA.exam_roadmaps || [])) await this.insert('exam_roadmaps', rm);
      for (const res of (CANONICAL_SEED_DATA.exam_resources || [])) await this.insert('exam_resources', res);
      for (const pyq of (CANONICAL_SEED_DATA.exam_papers || [])) await this.insert('exam_papers', pyq);
      for (const role of (CANONICAL_SEED_DATA.interview_roles || [])) await this.insert('interview_roles', role);
      for (const iq of (CANONICAL_SEED_DATA.interview_question_bank || [])) await this.insert('interview_question_bank', iq);
      for (const pq of (CANONICAL_SEED_DATA.practice_questions || [])) await this.insert('practice_questions', pq);
      for (const qe of (CANONICAL_SEED_DATA.quiz_events || [])) await this.insert('quiz_events', qe);
      for (const qs of (CANONICAL_SEED_DATA.quiz_event_semesters || [])) await this.insert('quiz_event_semesters', qs);
      for (const qt of (CANONICAL_SEED_DATA.quiz_event_topics || [])) await this.insert('quiz_event_topics', qt);
      for (const lb of (CANONICAL_SEED_DATA.quiz_leaderboards || [])) await this.insert('quiz_leaderboards', lb);
      for (const ml of (CANONICAL_SEED_DATA.monthly_quiz_leagues || [])) await this.insert('monthly_quiz_leagues', ml);
    }
  }

  seedFallback() {
    const stored = localStorage.getItem('TECHPATH_SEEDED');
    if (!stored) {
      Object.entries(CANONICAL_SEED_DATA).forEach(([table, items]) => {
        localStorage.setItem(`tp_${table}`, JSON.stringify(items));
      });
      localStorage.setItem('TECHPATH_SEEDED', 'true');
    }
  }

  // -------------------------------------------------------------
  // GENERIC CRUD OPERATIONS (SUPABASE CONNECTED WITH LOCAL CACHE)
  // -------------------------------------------------------------
  async getAll(table) {
    // 1. Attempt fetching from real Supabase project if configured
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        const { data, error } = await supabase.from(table).select('*');
        if (!error && data && data.length > 0) {
          // Cache in local IndexedDB asynchronously
          this._cacheTableLocally(table, data);
          return data;
        }
      } catch (err) {
        console.warn(`[Supabase DB] Error reading ${table}, falling back to local store:`, err.message);
      }
    }

    // 2. Local IndexedDB or LocalStorage fallback
    if (!this.db) {
      const data = localStorage.getItem(`tp_${table}`);
      return data ? JSON.parse(data) : [];
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(table, 'readonly');
        const store = tx.objectStore(table);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      } catch (err) {
        resolve([]);
      }
    });
  }

  async _cacheTableLocally(table, items) {
    if (!this.db || !Array.isArray(items)) return;
    try {
      const tx = this.db.transaction(table, 'readwrite');
      const store = tx.objectStore(table);
      for (const item of items) {
        if (item && item.id) store.put(item);
      }
    } catch (e) {
      // Background caching fail is non-fatal
    }
  }

  async getById(table, id) {
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn(`[Supabase DB] Error reading ${table} ${id}:`, err.message);
      }
    }

    if (!this.db) {
      const items = await this.getAll(table);
      return items.find((item) => item.id === id) || null;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(table, 'readonly');
        const store = tx.objectStore(table);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      } catch (err) {
        resolve(null);
      }
    });
  }

  async filter(table, predicate) {
    const all = await this.getAll(table);
    return all.filter(predicate);
  }

  async insert(table, item) {
    if (!item.id) {
      item.id = 'gen_' + Math.random().toString(36).substr(2, 9);
    }
    item.created_at = item.created_at || new Date().toISOString();

    // Asynchronously sync to Supabase table
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        supabase.from(table).upsert(item).then(({ error }) => {
          if (error) console.warn(`[Supabase DB] Upsert notice for ${table}:`, error.message);
        });
      } catch (err) {
        // Continue with local storage
      }
    }

    if (!this.db) {
      const items = await this.getAll(table);
      items.push(item);
      localStorage.setItem(`tp_${table}`, JSON.stringify(items));
      this.notify(table, item);
      return item;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(table, 'readwrite');
        const store = tx.objectStore(table);
        const req = store.put(item);
        req.onsuccess = () => {
          this.notify(table, item);
          resolve(item);
        };
        req.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }

  async update(table, id, updates) {
    const current = await this.getById(table, id);
    if (!current) throw new Error(`Entity ${id} not found in ${table}`);

    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };

    // Asynchronously update in Supabase
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        supabase.from(table).update(updates).eq('id', id).then(({ error }) => {
          if (error) console.warn(`[Supabase DB] Update notice for ${table}:`, error.message);
        });
      } catch (err) {
        // Non-blocking
      }
    }

    return this.insert(table, updated);
  }

  async delete(table, id) {
    if (isSupabaseConfigured() && supabase?.from) {
      try {
        supabase.from(table).delete().eq('id', id).then(({ error }) => {
          if (error) console.warn(`[Supabase DB] Delete notice for ${table}:`, error.message);
        });
      } catch (err) {
        // Non-blocking
      }
    }

    if (!this.db) {
      const items = await this.getAll(table);
      const filtered = items.filter((item) => item.id !== id);
      localStorage.setItem(`tp_${table}`, JSON.stringify(filtered));
      return true;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction(table, 'readwrite');
        const store = tx.objectStore(table);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      } catch (err) {
        resolve(false);
      }
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(table, data) {
    this.listeners.forEach((fn) => fn({ table, data }));
  }

  /** Alias for seedInitialData — called from app.js */
  async seedAll() {
    return this.seedInitialData();
  }

  /** Full-text search across multiple tables */
  async search(query, tables = ['subjects', 'topics', 'skills', 'career_roles', 'projects', 'exams', 'branch_models']) {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase();
    const results = [];
    for (const table of tables) {
      try {
        const items = await this.getAll(table);
        for (const item of items) {
          const text = JSON.stringify(item).toLowerCase();
          if (text.includes(q)) {
            results.push({ ...item, _table: table });
          }
        }
      } catch { /* table may not exist */ }
    }
    return results.slice(0, 50); // cap at 50 results
  }

  /** Count items in a table */
  async count(table) {
    const all = await this.getAll(table);
    return all.length;
  }

  /** Get items matching a field value */
  async getBy(table, field, value) {
    return this.filter(table, item => item[field] === value);
  }
}

export const dbStore = new DataStore();

