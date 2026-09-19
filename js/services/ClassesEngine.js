/**
 * TECHPATH — CLASSES ENGINE
 * Peer teaching marketplace logic, academic group taxonomy, automatic group mapping,
 * scheduling, strict classroom authorization gating, teacher studio telemetry,
 * reviews, and safety reporting.
 */

import { dbStore } from '../db/store.js';
import { PaymentGatewayEngine } from './PaymentGatewayEngine.js';
import { NotificationEngine } from './NotificationEngine.js';
import { MODELS_AND_CLASSES_SEED_DATA } from '../db/models-and-classes-seed.js';

export class ClassesEngine {
  // ── CANONICAL ACADEMIC TAXONOMY ─────────────────────────────────────────────
  static DEPARTMENTS = [
    { id: 'eng', name: 'Engineering & Technology', code: 'ENG' },
    { id: 'cse', name: 'Computer Science & Engineering', code: 'CSE' },
    { id: 'ece', name: 'Electronics & Communication', code: 'ECE' },
    { id: 'mech', name: 'Mechanical & Automation', code: 'MECH' },
    { id: 'civil', name: 'Civil & Infrastructure', code: 'CIVIL' }
  ];

  static BRANCHES = [
    { id: 'cse', name: 'Computer Science & Engineering', code: 'CSE', department_id: 'eng' },
    { id: 'aiml', name: 'Artificial Intelligence & Machine Learning', code: 'AI/ML', department_id: 'eng' },
    { id: 'ece', name: 'Electronics & Communication Engineering', code: 'ECE', department_id: 'eng' },
    { id: 'eee', name: 'Electrical & Electronics Engineering', code: 'EEE', department_id: 'eng' },
    { id: 'mech', name: 'Mechanical Engineering', code: 'MECH', department_id: 'eng' },
    { id: 'civil', name: 'Civil Engineering', code: 'CIVIL', department_id: 'eng' },
    { id: 'aero', name: 'Aerospace Engineering', code: 'AERO', department_id: 'eng' },
    { id: 'robotics', name: 'Robotics & Automation', code: 'ROBOTICS', department_id: 'eng' },
    { id: 'biomed', name: 'Biomedical Engineering', code: 'BIOMED', department_id: 'eng' },
    { id: 'auto', name: 'Automobile Engineering', code: 'AUTO', department_id: 'eng' },
    { id: 'chem', name: 'Chemical Engineering', code: 'CHEM', department_id: 'eng' }
  ];

  static SEMESTERS = [
    { id: 'sem_1', number: 1, name: 'Semester 1' },
    { id: 'sem_2', number: 2, name: 'Semester 2' },
    { id: 'sem_3', number: 3, name: 'Semester 3' },
    { id: 'sem_4', number: 4, name: 'Semester 4' },
    { id: 'sem_5', number: 5, name: 'Semester 5' },
    { id: 'sem_6', number: 6, name: 'Semester 6' },
    { id: 'sem_7', number: 7, name: 'Semester 7' },
    { id: 'sem_8', number: 8, name: 'Semester 8' }
  ];

  static _slug(str) {
    return String(str || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'general';
  }

  // ── 1. AUTOMATIC GROUP MAPPING ENGINE ──────────────────────────────────────
  /**
   * Calculates all related TechPath Classes discovery groups directly from class metadata.
   * Enables automatic discovery across Department, Branch, Specialization, Semester,
   * Subject, Topic, Difficulty, Language, Career relevance, and Class type.
   */
  static calculateGroupMappings(classRecord) {
    const mappings = [];
    const classId = classRecord.id;
    const branchId = (classRecord.branch_id || 'cse').toLowerCase();
    const branchObj = this.BRANCHES.find(b => b.id === branchId);
    const deptName = classRecord.department_name || branchObj?.name || 'Computer Science & Engineering';
    const deptId = classRecord.department_id || branchObj?.department_id || 'eng';

    // 1. Department Group
    mappings.push({
      id: `${classId}_dept_${deptId}`,
      class_id: classId,
      group_type: 'department',
      group_id: deptId,
      group_name: deptName,
      created_at: new Date().toISOString()
    });

    // 2. Branch Group
    mappings.push({
      id: `${classId}_branch_${branchId}`,
      class_id: classId,
      group_type: 'branch',
      group_id: branchId,
      group_name: branchObj?.name || branchId.toUpperCase(),
      created_at: new Date().toISOString()
    });

    // 3. Specialization Group (if present)
    if (classRecord.specialization && classRecord.specialization.trim()) {
      const specSlug = this._slug(classRecord.specialization);
      mappings.push({
        id: `${classId}_spec_${specSlug}`,
        class_id: classId,
        group_type: 'specialization',
        group_id: specSlug,
        group_name: classRecord.specialization.trim(),
        created_at: new Date().toISOString()
      });
    }

    // 4. Semester Group
    const semId = classRecord.semester_id || 'sem_1';
    const semNum = semId.replace('sem_', '');
    mappings.push({
      id: `${classId}_sem_${semId}`,
      class_id: classId,
      group_type: 'semester',
      group_id: semId,
      group_name: `Semester ${semNum}`,
      created_at: new Date().toISOString()
    });

    // 5. Subject Group
    if (classRecord.subject && classRecord.subject.trim()) {
      const subSlug = this._slug(classRecord.subject);
      mappings.push({
        id: `${classId}_sub_${subSlug}`,
        class_id: classId,
        group_type: 'subject',
        group_id: subSlug,
        group_name: classRecord.subject.trim(),
        created_at: new Date().toISOString()
      });
    }

    // 6. Topic Group
    if (classRecord.topic && classRecord.topic.trim()) {
      const topicSlug = this._slug(classRecord.topic);
      mappings.push({
        id: `${classId}_topic_${topicSlug}`,
        class_id: classId,
        group_type: 'topic',
        group_id: topicSlug,
        group_name: classRecord.topic.trim(),
        created_at: new Date().toISOString()
      });
    }

    // 7. Difficulty Group
    const diff = (classRecord.difficulty || classRecord.student_level || 'intermediate').toLowerCase();
    mappings.push({
      id: `${classId}_diff_${diff}`,
      class_id: classId,
      group_type: 'difficulty',
      group_id: diff,
      group_name: diff.charAt(0).toUpperCase() + diff.slice(1),
      created_at: new Date().toISOString()
    });

    // 8. Language Group
    const lang = (classRecord.language || 'English').trim();
    mappings.push({
      id: `${classId}_lang_${this._slug(lang)}`,
      class_id: classId,
      group_type: 'language',
      group_id: this._slug(lang),
      group_name: lang,
      created_at: new Date().toISOString()
    });

    // 9. Career Relevance Group (if provided)
    if (classRecord.career_relevance && classRecord.career_relevance.trim()) {
      const careerSlug = this._slug(classRecord.career_relevance);
      mappings.push({
        id: `${classId}_career_${careerSlug}`,
        class_id: classId,
        group_type: 'career',
        group_id: careerSlug,
        group_name: classRecord.career_relevance.trim(),
        created_at: new Date().toISOString()
      });
    }

    // 10. Class Type Group
    const classType = classRecord.class_type || 'live_online';
    mappings.push({
      id: `${classId}_type_${classType}`,
      class_id: classId,
      group_type: 'class_type',
      group_id: classType,
      group_name: classType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      created_at: new Date().toISOString()
    });

    return mappings;
  }

  /**
   * Synchronizes class group mappings atomically without duplicate records
   */
  static async _syncGroupMappingsForClass(classRecord) {
    if (!classRecord || !classRecord.id) return [];
    const mappings = this.calculateGroupMappings(classRecord);

    try {
      // Remove previous mappings for this class (prevents stale/duplicate records)
      const existing = await dbStore.filter('class_group_mappings', m => m.class_id === classRecord.id);
      for (const m of existing) {
        await dbStore.delete('class_group_mappings', m.id);
      }

      // Insert new group mappings
      for (const m of mappings) {
        await dbStore.insert('class_group_mappings', m);
      }
    } catch (e) {
      console.warn('[ClassesEngine] Note on group mappings persistence:', e.message);
    }

    return mappings;
  }

  /**
   * Ensures all published classes are indexed into class_group_mappings
   */
  static async ensureGroupMappingsIndexed() {
    try {
      const allClasses = await dbStore.getAll('classes');
      const allMappings = await dbStore.getAll('class_group_mappings');
      const mappedClassIds = new Set(allMappings.map(m => m.class_id));

      for (const cls of allClasses) {
        if (!mappedClassIds.has(cls.id)) {
          await this._syncGroupMappingsForClass(cls);
        }
      }
    } catch (e) {
      console.warn('[ClassesEngine] Background index note:', e.message);
    }
  }

  // ── 2. CLASS DISCOVERY & FILTERING ──────────────────────────────────────────
  /**
   * Retrieves discoverable classes:
   * - Strict publication gating: only PUBLISHED (or legacy 'active') classes appear
   * - Prioritizes student's canonical academic context (Department, Branch, Specialization, Semester)
   * - Never presents unrelated disciplines as primary recommendations
   * - Rich facet filtering across Subject, Topic, Difficulty, Language, Price, and Availability
   */
  static async getDiscoverableClasses(user, options = {}) {
    await this.ensureGroupMappingsIndexed();

    const userBranch = (user?.profile?.branch_id || user?.branch || 'cse').toLowerCase();
    const userSemester = (user?.profile?.semester_id || 'sem_3').toLowerCase();
    const userSpec = (user?.profile?.specialization || user?.profile?.career_goal || '').toLowerCase();

    // If options.branchFilter is undefined or 'user', default to user's branch
    let branchFilter = options.branchFilter !== undefined ? options.branchFilter : userBranch;
    if (branchFilter === 'user') branchFilter = userBranch;

    const query = (options.query || '').trim().toLowerCase();
    const departmentFilter = (options.departmentFilter || options.department || '').trim().toLowerCase();
    const semesterFilter = options.semesterFilter || '';
    const specializationFilter = (options.specializationFilter || '').trim().toLowerCase();
    const subjectFilter = (options.subjectFilter || '').trim().toLowerCase();
    const topicFilter = (options.topicFilter || '').trim().toLowerCase();
    const teacherFilter = (options.teacherFilter || '').trim().toLowerCase();
    const maxPrice = options.maxPrice ? Number(options.maxPrice) : null;
    const durationFilter = options.durationFilter ? Number(options.durationFilter) : null;
    const minRatingFilter = options.minRatingFilter ? Number(options.minRatingFilter) : null;
    const availabilityFilter = options.availabilityFilter || '';
    const languageFilter = (options.languageFilter || '').trim().toLowerCase();
    const levelFilter = (options.levelFilter || options.difficulty || '').trim().toLowerCase();
    const verificationFilter = options.verificationFilter || '';
    const classTypeFilter = options.classTypeFilter || '';
    const careerFilter = (options.careerFilter || '').trim().toLowerCase();

    const allClasses = await dbStore.getAll('classes');

    const filtered = allClasses.filter(cls => {
      // 1. Group Visibility: Only PUBLISHED (or 'active') classes appear in discovery
      const isPublished = cls.status === 'PUBLISHED' || cls.status === 'active';
      if (!isPublished) return false;

      // 2. Department filter
      if (departmentFilter && departmentFilter !== 'all') {
        const classDept = (cls.department_id || '').toLowerCase();
        if (classDept !== departmentFilter) {
          return false;
        }
      }

      // 3. Branch isolation default: do not leak unrelated Mechanical/Civil into CSE
      if (branchFilter && branchFilter !== 'all') {
        if ((cls.branch_id || '').toLowerCase() !== branchFilter.toLowerCase()) {
          return false;
        }
      }

      // 4. Semester filter
      if (semesterFilter) {
        if ((cls.semester_id || '').toLowerCase() !== semesterFilter.toLowerCase()) {
          return false;
        }
      }

      // 5. Specialization filter
      if (specializationFilter) {
        const classSpec = (cls.specialization || '').toLowerCase();
        if (!classSpec.includes(specializationFilter)) {
          return false;
        }
      }

      // 6. Subject filter
      if (subjectFilter) {
        const classSubject = (cls.subject || '').toLowerCase();
        if (!classSubject.includes(subjectFilter)) {
          return false;
        }
      }

      // 7. Topic filter
      if (topicFilter) {
        const classTopic = (cls.topic || '').toLowerCase();
        if (!classTopic.includes(topicFilter)) {
          return false;
        }
      }

      // 8. Teacher filter
      if (teacherFilter) {
        const tName = (cls.teacher_name || '').toLowerCase();
        const tId = (cls.teacher_techpath_id || '').toLowerCase();
        if (!tName.includes(teacherFilter) && !tId.includes(teacherFilter)) {
          return false;
        }
      }

      // 9. Max price filter
      if (maxPrice !== null && cls.price > maxPrice) {
        return false;
      }

      // 10. Duration filter
      if (durationFilter !== null && Number(cls.duration) !== durationFilter) {
        return false;
      }

      // 11. Rating filter
      if (minRatingFilter !== null && Number(cls.rating || 5.0) < minRatingFilter) {
        return false;
      }

      // 12. Availability filter
      if (availabilityFilter === 'available_only' || availabilityFilter === 'seats_available') {
        if (cls.max_students && (cls.booked_count || 0) >= cls.max_students) {
          return false;
        }
      }

      // 13. Language filter
      if (languageFilter) {
        if ((cls.language || '').toLowerCase() !== languageFilter) {
          return false;
        }
      }

      // 14. Student level / difficulty filter
      if (levelFilter) {
        const classDiff = (cls.difficulty || cls.student_level || '').toLowerCase();
        if (classDiff !== levelFilter) {
          return false;
        }
      }

      // 15. Class Type filter
      if (classTypeFilter && cls.class_type !== classTypeFilter) {
        return false;
      }

      // 16. Career relevance filter
      if (careerFilter) {
        const classCareer = (cls.career_relevance || '').toLowerCase();
        if (!classCareer.includes(careerFilter)) {
          return false;
        }
      }

      // 17. Verification filter
      if (verificationFilter && cls.teacher_verification !== verificationFilter) {
        return false;
      }

      // 18. Multilingual & multi-attribute free-text search
      if (query) {
        const matchesTitle = (cls.title || '').toLowerCase().includes(query);
        const matchesSubject = (cls.subject || '').toLowerCase().includes(query);
        const matchesTopic = (cls.topic || '').toLowerCase().includes(query);
        const matchesTeacher = (cls.teacher_name || '').toLowerCase().includes(query);
        const matchesDesc = (cls.description || '').toLowerCase().includes(query);
        const matchesSpec = (cls.specialization || '').toLowerCase().includes(query);
        const matchesCareer = (cls.career_relevance || '').toLowerCase().includes(query);
        const matchesBranch = (cls.branch_id || '').toLowerCase().includes(query);
        const matchesTechPathId = (cls.teacher_techpath_id || '').toLowerCase().includes(query);

        if (!matchesTitle && !matchesSubject && !matchesTopic && !matchesTeacher && 
            !matchesDesc && !matchesSpec && !matchesCareer && !matchesBranch && !matchesTechPathId) {
          return false;
        }
      }

      return true;
    });

    // Sort: Prioritize classes matching student's exact semester and specialization
    filtered.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if ((a.semester_id || '').toLowerCase() === userSemester) scoreA += 3;
      if ((b.semester_id || '').toLowerCase() === userSemester) scoreB += 3;

      if (userSpec && (a.specialization || '').toLowerCase().includes(userSpec)) scoreA += 2;
      if (userSpec && (b.specialization || '').toLowerCase().includes(userSpec)) scoreB += 2;

      // Rating bonus
      scoreA += (a.rating || 5) * 0.2;
      scoreB += (b.rating || 5) * 0.2;

      return scoreB - scoreA;
    });

    return filtered;
  }

  /**
   * Computes published class counts for groups / categories
   * Strictly excludes drafts, pending, paused, cancelled, or archived classes.
   */
  static async getGroupCounts(filterContext = {}) {
    const allClasses = await dbStore.getAll('classes');
    const publishedClasses = allClasses.filter(c => c.status === 'PUBLISHED' || c.status === 'active');

    const counts = {
      totalPublished: publishedClasses.length,
      byBranch: {},
      bySemester: {},
      bySpecialization: {},
      byDifficulty: {}
    };

    for (const b of this.BRANCHES) counts.byBranch[b.id] = 0;
    for (const s of this.SEMESTERS) counts.bySemester[s.id] = 0;

    for (const cls of publishedClasses) {
      const bId = (cls.branch_id || '').toLowerCase();
      if (counts.byBranch[bId] !== undefined) counts.byBranch[bId]++;
      else counts.byBranch[bId] = 1;

      const semId = (cls.semester_id || '').toLowerCase();
      if (counts.bySemester[semId] !== undefined) counts.bySemester[semId]++;
      else counts.bySemester[semId] = 1;

      if (cls.specialization) {
        const spec = cls.specialization.trim();
        counts.bySpecialization[spec] = (counts.bySpecialization[spec] || 0) + 1;
      }

      const diff = (cls.difficulty || cls.student_level || 'intermediate').toLowerCase();
      counts.byDifficulty[diff] = (counts.byDifficulty[diff] || 0) + 1;
    }

    return counts;
  }

  /**
   * Retrieves complete class detail including teacher profile, slots, reviews,
   * YouTube engineering videos, and interactive 3D models.
   */
  static async getClassDetail(classId) {
    const cls = await dbStore.getById('classes', classId);
    if (!cls) return null;

    const enriched = (MODELS_AND_CLASSES_SEED_DATA?.enriched_classes || []).find(e => e.id === classId);

    const [teacherProfile, slots, reviews, materials, allModels, groupMappings] = await Promise.all([
      this.getTeacherProfile(cls.teacher_id),
      dbStore.filter('class_availability', s => s.class_id === classId && s.status === 'available'),
      dbStore.filter('class_reviews', r => r.class_id === classId),
      dbStore.filter('class_materials', m => m.class_id === classId),
      dbStore.getAll('branch_models'),
      dbStore.filter('class_group_mappings', m => m.class_id === classId)
    ]);

    const model3dId = cls.model_3d_id || enriched?.model_3d_id;
    let model3d = null;
    if (model3dId) {
      model3d = allModels.find(m => m.id === model3dId);
    }
    if (!model3d && cls.branch_id) {
      model3d = allModels.find(m => m.branch_id?.toLowerCase() === cls.branch_id.toLowerCase());
    }

    let youtubeVideos = cls.youtube_videos && cls.youtube_videos.length > 0
      ? cls.youtube_videos
      : (enriched?.youtube_videos || []);

    if (youtubeVideos.length === 0 && cls.branch_id) {
      const branchEnriched = (MODELS_AND_CLASSES_SEED_DATA?.enriched_classes || []).find(
        e => (e.branch_id && e.branch_id.toLowerCase() === cls.branch_id.toLowerCase()) ||
             (e.youtube_videos && e.youtube_videos.some(v => v.branch_id?.toLowerCase() === cls.branch_id.toLowerCase()))
      );
      if (branchEnriched && branchEnriched.youtube_videos) {
        youtubeVideos = branchEnriched.youtube_videos;
      }
    }

    const classMaterials = materials.length > 0
      ? materials
      : (cls.materials || enriched?.materials || []);

    const practiceQuestions = cls.practice_questions && cls.practice_questions.length > 0
      ? cls.practice_questions
      : (enriched?.practice_questions || []);

    return {
      ...cls,
      ...enriched,
      teacherProfile,
      slots: slots.sort((a, b) => (a.date + a.start_time).localeCompare(b.date + b.start_time)),
      reviews: reviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      materials: classMaterials,
      youtube_videos: youtubeVideos,
      model_3d: model3d,
      practice_questions: practiceQuestions,
      group_mappings: groupMappings
    };
  }

  // ── 3. TEACHER PROFILES & STUDIO ───────────────────────────────────────────
  static async getTeacherProfile(userId) {
    if (!userId) return null;
    const profiles = await dbStore.filter('teaching_profiles', tp => tp.user_id === userId);
    return profiles[0] || null;
  }

  static async saveTeacherProfile(userId, profileData) {
    const existing = await this.getTeacherProfile(userId);
    const id = existing?.id || `tp_${userId}_${Date.now()}`;

    const updated = {
      id,
      user_id: userId,
      teacher_name: profileData.teacher_name || existing?.teacher_name || 'Engineering Scholar',
      techpath_id: profileData.techpath_id || existing?.techpath_id || 'TP-ENG-TEACH01',
      department_id: profileData.department_id || existing?.department_id || 'eng',
      branch_id: profileData.branch_id || existing?.branch_id || 'cse',
      specialization: profileData.specialization || existing?.specialization || 'Core Engineering',
      teaching_subjects: profileData.teaching_subjects || existing?.teaching_subjects || [],
      teaching_topics: profileData.teaching_topics || existing?.teaching_topics || [],
      semester_level: profileData.semester_level || existing?.semester_level || 'All Semesters',
      teaching_experience: profileData.teaching_experience || existing?.teaching_experience || '',
      skills: profileData.skills || existing?.skills || [],
      description: profileData.description || existing?.description || '',
      languages: profileData.languages || existing?.languages || ['English'],
      class_format: profileData.class_format || existing?.class_format || 'Live Interactive Class',
      availability_summary: profileData.availability_summary || existing?.availability_summary || 'Flexible Scheduling',
      price_per_class: Number(profileData.price_per_class) || existing?.price_per_class || 300,
      price_per_hour: Number(profileData.price_per_hour) || existing?.price_per_hour || 350,
      package_price: Number(profileData.package_price) || existing?.package_price || 1200,
      package_classes: Number(profileData.package_classes) || existing?.package_classes || 5,
      currency: profileData.currency || 'INR',
      verification_status: existing?.verification_status || 'Unverified',
      rating: existing?.rating || 5.0,
      total_students: existing?.total_students || 0,
      classes_completed: existing?.classes_completed || 0,
      updated_at: new Date().toISOString(),
      created_at: existing?.created_at || new Date().toISOString()
    };

    if (existing) {
      await dbStore.update('teaching_profiles', existing.id, updated);
    } else {
      await dbStore.insert('teaching_profiles', updated);
    }

    return updated;
  }

  static async requestTeacherVerification(userId, { credentials, notes }) {
    const app = {
      id: `tv_${userId}_${Date.now()}`,
      user_id: userId,
      credentials: credentials || 'Peer academic performance transcript & subject mastery',
      notes: notes || '',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    await dbStore.insert('teacher_verifications', app);
    return app;
  }

  // ── 4. ATOMIC PUBLISH & EDIT WORKFLOW ──────────────────────────────────────
  /**
   * Creates and publishes a class listing atomically:
   * 1. Validates required metadata & ownership
   * 2. Persists canonical class record directly to database
   * 3. Calculates and inserts related group mappings (Department, Branch, Specialization, Semester, etc.)
   * 4. Respects moderation toggle: PUBLISHED immediately (or PENDING_REVIEW if moderation enabled)
   * 5. Never requires admin to manually move the class unless moderation is enabled
   */
  static async createClass(teacherUserId, classData, slotsData = []) {
    if (!teacherUserId) throw new Error('Unauthenticated: Teacher ID required');
    if (!classData.title || !classData.title.trim()) throw new Error('Class Title is required');
    if (!classData.branch_id) throw new Error('Branch selection is required');
    if (!classData.semester_id) throw new Error('Semester selection is required');
    if (!classData.subject || !classData.subject.trim()) throw new Error('Subject is required');
    if (!classData.topic || !classData.topic.trim()) throw new Error('Specific Topic is required');

    const teacherProfile = await this.getTeacherProfile(teacherUserId);
    const classId = `cls_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const feeCalculation = PaymentGatewayEngine.calculateFees(classData.price);

    // Moderation check
    const isModerationEnabled = localStorage.getItem('TP_MODERATION_ENABLED') === 'true';
    const status = isModerationEnabled ? 'PENDING_REVIEW' : 'PUBLISHED';

    const branchObj = this.BRANCHES.find(b => b.id === (classData.branch_id || 'cse').toLowerCase());
    const deptName = classData.department_name || branchObj?.name || 'Computer Science & Engineering';

    const newClass = {
      id: classId,
      teacher_id: teacherUserId,
      teacher_name: teacherProfile?.teacher_name || classData.teacher_name || 'Engineering Teacher',
      teacher_techpath_id: teacherProfile?.techpath_id || classData.teacher_techpath_id || 'TP-ENG-TEACH',
      teacher_verification: teacherProfile?.verification_status || 'Teacher Verified',
      title: classData.title.trim(),
      department_id: classData.department_id || branchObj?.department_id || 'eng',
      department_name: deptName,
      branch_id: (classData.branch_id || 'cse').toLowerCase(),
      semester_id: classData.semester_id || 'sem_3',
      specialization: classData.specialization ? classData.specialization.trim() : '',
      subject: classData.subject.trim(),
      topic: classData.topic.trim(),
      difficulty: classData.difficulty || classData.student_level || 'intermediate',
      student_level: classData.difficulty || classData.student_level || 'intermediate',
      class_type: classData.class_type || 'live_online',
      language: classData.language || 'English',
      career_relevance: classData.career_relevance ? classData.career_relevance.trim() : '',
      description: classData.description.trim(),
      what_will_learn: Array.isArray(classData.what_will_learn) 
        ? classData.what_will_learn 
        : (classData.what_will_learn || '').split('\n').filter(Boolean),
      prerequisites: classData.prerequisites || 'Foundational branch knowledge',
      duration: Number(classData.duration) || 60,
      max_students: Number(classData.max_students) || 15,
      booked_count: 0,
      price: feeCalculation.classFee,
      platform_fee: feeCalculation.platformFee,
      total_price: feeCalculation.totalAmount,
      currency: classData.currency || 'INR',
      rating: 5.0,
      reviews_count: 0,
      status, // 'PUBLISHED' | 'PENDING_REVIEW' | 'PAUSED' | 'DRAFT' | 'CANCELLED' | 'ARCHIVED'
      published_at: new Date().toISOString(),
      meeting_link: classData.meeting_link || `https://meet.techpath.edu/room/tp-${classId}`,
      cancellation_policy: classData.cancellation_policy || 'Full refund up to 4 hours before the session. Non-refundable after class starts.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 1. Save canonical class record
    await dbStore.insert('classes', newClass);

    // 2. Calculate and persist related group mappings atomically
    await this._syncGroupMappingsForClass(newClass);

    // 3. Save initial availability schedule slots
    if (slotsData && slotsData.length > 0) {
      for (const slot of slotsData) {
        const slotId = `slot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await dbStore.insert('class_availability', {
          id: slotId,
          class_id: classId,
          date: slot.date,
          start_time: slot.start_time,
          end_time: slot.end_time,
          timezone: slot.timezone || 'IST',
          seats_total: newClass.max_students,
          seats_booked: 0,
          status: 'available'
        });
      }
    }

    return newClass;
  }

  /**
   * Updates an existing class and atomically recalculates related group mappings
   * E.g. Changing Semester 5 to Semester 6 removes Semester 5 and adds Semester 6 group mappings.
   */
  static async updateClass(classId, teacherUserId, updates) {
    const cls = await dbStore.getById('classes', classId);
    if (!cls) throw new Error('Class not found');
    if (cls.teacher_id !== teacherUserId) throw new Error('Unauthorized to modify this class');

    const feeCalculation = updates.price !== undefined 
      ? PaymentGatewayEngine.calculateFees(updates.price)
      : PaymentGatewayEngine.calculateFees(cls.price);

    const branchObj = updates.branch_id 
      ? this.BRANCHES.find(b => b.id === updates.branch_id.toLowerCase())
      : this.BRANCHES.find(b => b.id === cls.branch_id.toLowerCase());

    const updated = {
      ...cls,
      ...updates,
      department_name: updates.department_name || branchObj?.name || cls.department_name,
      price: feeCalculation.classFee,
      platform_fee: feeCalculation.platformFee,
      total_price: feeCalculation.totalAmount,
      difficulty: updates.difficulty || updates.student_level || cls.difficulty || 'intermediate',
      student_level: updates.difficulty || updates.student_level || cls.student_level || 'intermediate',
      updated_at: new Date().toISOString()
    };

    // 1. Update canonical class
    await dbStore.update('classes', classId, updated);

    // 2. Atomically recalculate and replace related group mappings
    await this._syncGroupMappingsForClass(updated);

    return updated;
  }

  /**
   * Sets publication status (PUBLISHED, PAUSED, DRAFT, CANCELLED, ARCHIVED)
   */
  static async setPublicationStatus(classId, teacherUserId, newStatus) {
    const cls = await dbStore.getById('classes', classId);
    if (!cls) throw new Error('Class not found');
    if (cls.teacher_id !== teacherUserId) throw new Error('Unauthorized');

    const validStatuses = ['PUBLISHED', 'PAUSED', 'DRAFT', 'PENDING_REVIEW', 'CANCELLED', 'ARCHIVED', 'active'];
    if (!validStatuses.includes(newStatus)) throw new Error('Invalid publication status');

    await dbStore.update('classes', classId, { status: newStatus, updated_at: new Date().toISOString() });
    return newStatus;
  }

  /**
   * Quick toggle between PAUSED and PUBLISHED
   */
  static async toggleClassStatus(classId, teacherUserId) {
    const cls = await dbStore.getById('classes', classId);
    if (!cls || cls.teacher_id !== teacherUserId) throw new Error('Unauthorized');

    const isCurrentActive = cls.status === 'PUBLISHED' || cls.status === 'active';
    const nextStatus = isCurrentActive ? 'PAUSED' : 'PUBLISHED';

    await dbStore.update('classes', classId, { status: nextStatus, updated_at: new Date().toISOString() });
    return nextStatus;
  }

  /**
   * Teacher studio telemetry: Active classes, gross earnings, rosters, student reviews
   */
  static async getTeacherDashboardData(teacherUserId) {
    const [classes, allBookings, allReviews, teacherProfile] = await Promise.all([
      dbStore.filter('classes', c => c.teacher_id === teacherUserId),
      dbStore.filter('class_bookings', b => b.teacher_id === teacherUserId),
      dbStore.getAll('class_reviews'),
      this.getTeacherProfile(teacherUserId)
    ]);

    const teacherClassIds = new Set(classes.map(c => c.id));
    const teacherReviews = allReviews.filter(r => teacherClassIds.has(r.class_id));

    const paidBookings = allBookings.filter(b => b.status === 'paid');
    const grossEarnings = paidBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const activeClasses = classes.filter(c => c.status === 'PUBLISHED' || c.status === 'active');
    const uniqueStudents = new Set(paidBookings.map(b => b.student_id)).size;

    return {
      profile: teacherProfile,
      classes: classes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      activeClassesCount: activeClasses.length,
      bookings: allBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
      paidBookingsCount: paidBookings.length,
      uniqueStudentsCount: uniqueStudents,
      grossEarnings,
      reviews: teacherReviews,
      rating: teacherProfile?.rating || (teacherReviews.length > 0 
        ? (teacherReviews.reduce((sum, r) => sum + r.rating, 0) / teacherReviews.length).toFixed(1) 
        : 5.0)
    };
  }

  // ── 5. BOOKING & CHECKOUT WORKFLOW ──────────────────────────────────────────
  static async initiateBooking({ studentId, classId, slotId, studentName, studentEmail }) {
    const cls = await dbStore.getById('classes', classId);
    if (!cls) throw new Error('Class not found');
    const isPublished = cls.status === 'PUBLISHED' || cls.status === 'active';
    if (!isPublished) throw new Error('This class is currently paused or not accepting bookings');

    const slot = await dbStore.getById('class_availability', slotId);
    if (!slot) throw new Error('Schedule slot not found');
    if (slot.seats_booked >= slot.seats_total) {
      throw new Error('This schedule slot is completely full');
    }

    const existing = await dbStore.filter('class_bookings', b => 
      b.student_id === studentId && b.slot_id === slotId && (b.status === 'paid' || b.status === 'pending')
    );
    if (existing.length > 0 && existing[0].status === 'paid') {
      throw new Error('You are already enrolled in this session');
    }

    const bookingId = existing[0]?.id || `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const feeCalculation = PaymentGatewayEngine.calculateFees(cls.price);

    const bookingRecord = {
      id: bookingId,
      class_id: classId,
      slot_id: slotId,
      student_id: studentId,
      student_name: studentName,
      student_email: studentEmail,
      teacher_id: cls.teacher_id,
      teacher_name: cls.teacher_name,
      class_title: cls.title,
      branch_id: cls.branch_id,
      date: slot.date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      amount: feeCalculation.classFee,
      platform_fee: 0,
      service_fee: 0,
      convenience_fee: 0,
      external_fee: 0,
      total_amount: feeCalculation.totalAmount,
      currency: cls.currency || 'INR',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existing.length > 0) {
      await dbStore.update('class_bookings', bookingId, bookingRecord);
    } else {
      await dbStore.insert('class_bookings', bookingRecord);
    }

    const order = await PaymentGatewayEngine.createOrder({
      bookingId,
      classId,
      studentId,
      teacherId: cls.teacher_id,
      amount: feeCalculation.classFee,
      platformFee: 0,
      currency: cls.currency || 'INR'
    });

    return {
      booking: bookingRecord,
      order,
      classDetail: cls,
      slot
    };
  }

  /**
   * Enrolls student directly into a free (₹0) class without opening a payment gateway
   * Fulfills Rule 12: Completely free classes bypass payment processing entirely
   */
  static async enrollFreeClass({ studentId, classId, slotId, studentName, studentEmail }) {
    const cls = await dbStore.getById('classes', classId);
    if (!cls) throw new Error('Class not found');
    const isPublished = cls.status === 'PUBLISHED' || cls.status === 'active';
    if (!isPublished) throw new Error('This class is currently not accepting enrollments');

    if (Number(cls.price) !== 0) {
      throw new Error('This is a paid class and requires standard checkout.');
    }

    const slot = await dbStore.getById('class_availability', slotId);
    if (!slot) throw new Error('Schedule slot not found');
    if (slot.seats_booked >= slot.seats_total) {
      throw new Error('This schedule slot is completely full');
    }

    const existing = await dbStore.filter('class_bookings', b => 
      b.student_id === studentId && b.slot_id === slotId && (b.status === 'paid' || b.status === 'enrolled')
    );
    if (existing.length > 0) {
      throw new Error('You are already enrolled in this free session');
    }

    const bookingId = `bk_free_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const bookingRecord = {
      id: bookingId,
      class_id: classId,
      slot_id: slotId,
      student_id: studentId,
      student_name: studentName,
      student_email: studentEmail,
      teacher_id: cls.teacher_id,
      teacher_name: cls.teacher_name,
      class_title: cls.title,
      branch_id: cls.branch_id,
      date: slot.date,
      start_time: slot.start_time,
      end_time: slot.end_time,
      amount: 0,
      platform_fee: 0,
      service_fee: 0,
      convenience_fee: 0,
      external_fee: 0,
      total_amount: 0,
      currency: cls.currency || 'INR',
      status: 'paid',
      payment_id: `free_enr_${Date.now()}`,
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await dbStore.insert('class_bookings', bookingRecord);

    // Add student to roster
    const studentRosterEntry = {
      id: `cs_${classId}_${studentId}`,
      class_id: classId,
      student_id: studentId,
      booking_id: bookingId,
      slot_id: slotId,
      payment_id: bookingRecord.payment_id,
      status: 'enrolled',
      attendance: 'pending',
      joined_at: new Date().toISOString()
    };
    await dbStore.insert('class_students', studentRosterEntry);

    // Update seats
    try {
      await dbStore.update('class_availability', slot.id, {
        seats_booked: (slot.seats_booked || 0) + 1
      });
      await dbStore.update('classes', cls.id, {
        booked_count: (cls.booked_count || 0) + 1
      });
    } catch { /* proceed */ }

    // Dispatch notifications
    await NotificationEngine.send(
      'class',
      'Free Class Enrollment Confirmed! 🎉',
      `Your enrollment for "${cls.title}" has been confirmed with zero fees. You can now access your classroom.`,
      `#/classes/${classId}/classroom`,
      studentId
    );

    await NotificationEngine.send(
      'class',
      'New Student Enrolled! 🎓',
      `A new student has enrolled in your free class "${cls.title}". Check your Teacher Dashboard for the updated roster.`,
      '#/teacher/dashboard',
      cls.teacher_id
    );

    return {
      success: true,
      booking: bookingRecord,
      classDetail: cls,
      slot
    };
  }

  static async getStudentBookings(studentId) {
    const bookings = await dbStore.filter('class_bookings', b => b.student_id === studentId);
    bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return {
      upcoming: bookings.filter(b => b.status === 'paid'),
      completed: bookings.filter(b => b.status === 'completed'),
      cancelled: bookings.filter(b => b.status === 'cancelled' || b.status === 'refunded'),
      pending: bookings.filter(b => b.status === 'pending' || b.status === 'failed'),
      all: bookings
    };
  }

  // ── 6. STRICT CLASSROOM ACCESS GATE ─────────────────────────────────────────
  static async assertClassroomAccess(classId, userId) {
    if (!classId || !userId) {
      return { hasAccess: false, reason: 'Unauthenticated' };
    }

    const cls = await dbStore.getById('classes', classId);
    if (!cls) {
      return { hasAccess: false, reason: 'Class not found' };
    }

    // 1. Teacher access
    if (cls.teacher_id === userId) {
      return {
        hasAccess: true,
        role: 'teacher',
        classDetail: cls,
        booking: null
      };
    }

    // 2. Paid student
    const bookings = await dbStore.filter('class_bookings', b => 
      b.class_id === classId && b.student_id === userId && b.status === 'paid'
    );

    if (bookings.length > 0) {
      return {
        hasAccess: true,
        role: 'student',
        classDetail: cls,
        booking: bookings[0]
      };
    }

    // 3. Fallback check in class_students roster
    const roster = await dbStore.filter('class_students', s => 
      s.class_id === classId && s.student_id === userId && s.status === 'enrolled'
    );

    if (roster.length > 0) {
      return {
        hasAccess: true,
        role: 'student',
        classDetail: cls,
        booking: null
      };
    }

    return {
      hasAccess: false,
      role: null,
      reason: 'No confirmed paid booking found for this session.'
    };
  }

  static async markClassComplete(classId, teacherUserId) {
    const cls = await dbStore.getById('classes', classId);
    if (!cls || cls.teacher_id !== teacherUserId) throw new Error('Unauthorized');

    const students = await dbStore.filter('class_students', s => s.class_id === classId);
    for (const st of students) {
      await dbStore.update('class_students', st.id, {
        status: 'completed',
        attendance: 'attended',
        updated_at: new Date().toISOString()
      });

      await NotificationEngine.send(
        'class',
        'Class Completed! 🌟',
        `Your class "${cls.title}" has completed. Please take a moment to leave a review for ${cls.teacher_name}.`,
        `#/classes/my-classes`,
        st.student_id
      );
    }

    const teacherProfile = await this.getTeacherProfile(teacherUserId);
    if (teacherProfile) {
      await dbStore.update('teaching_profiles', teacherProfile.id, {
        classes_completed: (teacherProfile.classes_completed || 0) + 1
      });
    }

    return { success: true, studentsCount: students.length };
  }

  // ── 7. VERIFIED STUDENT REVIEWS ─────────────────────────────────────────────
  static async submitReview({ classId, studentId, studentName, studentTechPathId, rating, reviewText }) {
    const access = await this.assertClassroomAccess(classId, studentId);
    if (!access.hasAccess || access.role !== 'student') {
      throw new Error('Only enrolled students can review this class.');
    }

    const existingReviews = await dbStore.filter('class_reviews', r => 
      r.class_id === classId && r.student_id === studentId
    );
    if (existingReviews.length > 0) {
      throw new Error('You have already submitted a review for this class.');
    }

    const reviewId = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const reviewRecord = {
      id: reviewId,
      class_id: classId,
      student_id: studentId,
      student_name: studentName || 'TechPath Student',
      student_techpath_id: studentTechPathId || 'TP-ENG-USER',
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      review: reviewText.trim(),
      created_at: new Date().toISOString()
    };

    await dbStore.insert('class_reviews', reviewRecord);

    const allReviews = await dbStore.filter('class_reviews', r => r.class_id === classId);
    const avgRating = Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(2));

    await dbStore.update('classes', classId, {
      rating: avgRating,
      reviews_count: allReviews.length
    });

    const cls = await dbStore.getById('classes', classId);
    if (cls) {
      await NotificationEngine.send(
        'class',
        'New Class Review Received! ⭐',
        `${studentName || 'A student'} left a ${rating}-star review for "${cls.title}".`,
        '#/teacher/dashboard',
        cls.teacher_id
      );
    }

    return reviewRecord;
  }

  // ── 8. SAFETY & INCIDENT REPORTING ──────────────────────────────────────────
  static async reportClass({ reporterId, classId, teacherId, category, reason }) {
    const report = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      reporter_id: reporterId,
      class_id: classId || null,
      teacher_id: teacherId || null,
      category: category || 'Misleading Description',
      reason: reason || 'Violation of academic code or fraudulent listing',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    await dbStore.insert('class_reports', report);
    return report;
  }
}
