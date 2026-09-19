/**
 * TECHPATH — CAREER & INTERNSHIP ENGINE
 * Maps engineering departments & branches to market roles, requirements, and job trajectories.
 * Builds personalized, structured, 5-stage career progression trajectories with real progress tracking.
 */

import { dbStore } from '../db/store.js';
import { SkillsEngine } from './SkillsEngine.js';
import { TaxonomyEngine } from './TaxonomyEngine.js';
import { supabase } from '../lib/supabase.js';

export class CareerEngine {
  /**
   * Fetches all market career roles matching a specific engineering branch,
   * supplementing canonical database roles with taxonomy definitions.
   */
  static async getRolesForBranch(branchId = 'cse') {
    const bId = (branchId || 'cse').toLowerCase();
    const dbRoles = await dbStore.filter('career_roles', (r) => (r.branch_id || '').toLowerCase() === bId);
    const taxonomyRoles = TaxonomyEngine.getSuggestedRoles(bId) || [];

    const merged = [...dbRoles];
    const existingTitles = new Set(dbRoles.map(r => r.title.toLowerCase()));

    for (const title of taxonomyRoles) {
      if (!existingTitles.has(title.toLowerCase())) {
        const id = 'role_' + title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        merged.push({
          id,
          title,
          branch_id: bId,
          description: `Industry engineering role specializing in ${title} workflows and production systems.`,
          salary_range: '₹8L–₹26L / $85k–$150k',
          market_demand: 'High Growth',
          required_skills: this._inferRequiredSkills(title, bId)
        });
        existingTitles.add(title.toLowerCase());
      }
    }

    return merged;
  }

  /**
   * Resolves a role by ID or Title across both database records and taxonomy.
   */
  static async resolveRole(roleIdOrTitle, branchId = 'cse') {
    const allRoles = await this.getRolesForBranch(branchId);
    if (!roleIdOrTitle) return allRoles[0] || null;

    const term = roleIdOrTitle.toLowerCase().trim();
    let match = allRoles.find(r => r.id.toLowerCase() === term || r.title.toLowerCase() === term);
    if (match) return match;

    // Search across all branches if not found in current branch
    const allDbRoles = await dbStore.getAll('career_roles');
    match = allDbRoles.find(r => r.id.toLowerCase() === term || r.title.toLowerCase() === term);
    if (match) return match;

    // Synthesize role if user specified custom career role
    const cleanTitle = roleIdOrTitle.replace(/^role_/, '').replace(/_/g, ' ');
    const formattedTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
    return {
      id: 'role_' + cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      title: formattedTitle,
      branch_id: branchId,
      description: `Target career role in ${formattedTitle}.`,
      salary_range: '₹9L–₹28L / $90k–$160k',
      market_demand: 'Very High',
      required_skills: this._inferRequiredSkills(formattedTitle, branchId)
    };
  }

  /**
   * Complete 360-degree role telemetry breakdown
   */
  static async getRoleTelemetry(roleId, userId = 'usr_guest', branchId = 'cse') {
    const role = await this.resolveRole(roleId, branchId);
    if (!role) return null;

    const { skills, gaps, alreadyHave, needToLearn, needToImprove, stats } =
      await SkillsEngine.evaluateRoleSkills(role.id, userId);

    // Recommended projects for this role
    const allProjects = await dbStore.getAll('projects');
    const requiredSkillIds = (role.required_skills || []).map(rs => rs.skill_id);
    const matchingProjects = allProjects.filter((p) => {
      const pSkills = p.skills || [];
      return pSkills.some(ps => requiredSkillIds.includes(ps));
    });

    // Verified internships for this branch
    const allInternships = await dbStore.getAll('internships');
    const matchingInternships = allInternships.filter((intn) =>
      (intn.branch_relevance || []).includes(role.branch_id || branchId)
    );

    return {
      role,
      skills,
      gaps,
      alreadyHave,
      needToLearn,
      needToImprove,
      matchingProjects,
      matchingInternships,
      readinessScore: stats.readinessPercent || this.calculateReadinessScore(skills)
    };
  }

  /**
   * Builds an authentic, structured, 5-stage career progression trajectory
   * tailored to the user's branch, specialization, semester, learning level, and skill gaps.
   */
  static async buildPersonalizedTrajectory(profile = {}, targetRoleIdOrTitle = null, userId = 'usr_guest') {
    const branch = profile.branch_id || 'cse';
    const specialization = profile.specialization || profile.specialization_id || 'Core Systems';
    const semester = profile.semester_id || 'sem_3';
    const semNum = parseInt(semester.replace('sem_', ''), 10) || 3;
    const targetRoleName = targetRoleIdOrTitle || profile.target_role || profile.career_goal || 'Software Engineer';

    const role = await this.resolveRole(targetRoleName, branch);
    const roleId = role?.id || 'role_swe';

    // 1. Evaluate user's current skills against role requirements
    const evaluation = await SkillsEngine.evaluateRoleSkills(roleId, userId);
    const { alreadyHave, needToLearn, needToImprove, optionalSkills } = evaluation;

    // 2. Fetch user's saved trajectory progress from local store and Supabase
    let savedProgress = [];
    try {
      savedProgress = await dbStore.filter('user_trajectory_progress',
        u => u.user_id === userId && u.role_id === roleId
      );
    } catch { /* proceed */ }

    // Check if Supabase has persisted progress
    if (savedProgress.length === 0 && userId && userId !== 'usr_guest') {
      try {
        const { data } = await supabase
          .from('user_trajectory_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('role_id', roleId);
        if (data && data.length > 0) {
          savedProgress = data;
          for (const item of data) {
            await dbStore.insert('user_trajectory_progress', item);
          }
        }
      } catch { /* proceed */ }
    }

    const progressMap = new Map(savedProgress.map(p => [`${p.stage_id}_${p.item_id}`, p.completed]));

    // Helper to determine item completion: completed in progress records or already mastered
    const isSkillMastered = (skillId) => alreadyHave.some(s => s.skill_id === skillId);
    const isItemDone = (stageId, itemId, fallbackDone = false) => {
      const key = `${stageId}_${itemId}`;
      if (progressMap.has(key)) return progressMap.get(key);
      return fallbackDone;
    };

    // 3. Construct the 5 Stages dynamically
    const stages = [];

    // ──────────────────────────────────────────────────────────────────────────
    // STAGE 1: FOUNDATIONS & LOGICAL INVARIANTS
    // ──────────────────────────────────────────────────────────────────────────
    const s1Skills = [
      { id: 'skill_programming', name: 'Programming & Syntax Foundations', desc: 'Imperative and OOP paradigms, control flow, functions, memory layout.', required_level: 4, category: 'Foundation' },
      { id: 'skill_git', name: 'Git & Version Control Workflows', desc: 'Atomic commits, branching, rebasing, pull requests, merge conflict resolution.', required_level: 3, category: 'Dev Tools' },
      { id: 'skill_math', name: 'Discrete Mathematics & Logic', desc: 'Set theory, boolean algebra, propositional calculus, asymptotic recurrence relations.', required_level: 3, category: 'Engineering Core' }
    ];
    const s1Items = s1Skills.map(sk => {
      const mastered = isSkillMastered(sk.id) || (semNum >= 3 && sk.id !== 'skill_git');
      const completed = isItemDone('stage_1', sk.id, mastered);
      return {
        id: sk.id,
        title: sk.name,
        type: 'skill',
        description: sk.desc,
        status: completed ? 'completed' : 'in_progress',
        actionUrl: '#/learning',
        actionLabel: 'Review Foundations'
      };
    });
    s1Items.push({
      id: 'task_terminal_git',
      title: 'Setup Production Git Repository with Automated CI Linting',
      type: 'drill',
      description: 'Initialize a remote repository, configure .gitignore, pre-commit hooks, and publish release tags.',
      status: isItemDone('stage_1', 'task_terminal_git', semNum >= 2) ? 'completed' : 'pending',
      actionUrl: '#/practice',
      actionLabel: 'Open Practice Drill'
    });

    const s1DoneCount = s1Items.filter(i => i.status === 'completed').length;
    stages.push({
      id: 'stage_1',
      stage_number: 1,
      title: 'Stage 1 — Engineering Foundations & Invariants',
      type: 'Core Foundations',
      description: 'Master imperative programming syntax, asymptotic notation, and collaborative Git version control.',
      estimated_hours: 45,
      prerequisites: 'None (Freshman Entry)',
      items: s1Items,
      progress_percentage: Math.round((s1DoneCount / s1Items.length) * 100),
      status: s1DoneCount === s1Items.length ? 'completed' : 'in_progress'
    });

    // ──────────────────────────────────────────────────────────────────────────
    // STAGE 2: CORE SYSTEMS & DATA HANDLING
    // ──────────────────────────────────────────────────────────────────────────
    const s2Skills = [
      { id: 'skill_dsa', name: 'Data Structures & Algorithms (DSA)', desc: 'Trees, graphs, heaps, dynamic programming, Dijkstra, amortized analysis.', required_level: 5, category: 'Computer Science' },
      { id: 'skill_sql', name: 'Relational Databases & SQL Schema Design', desc: 'ACID properties, indexing B-trees, normalization (1NF-BCNF), complex joins.', required_level: 4, category: 'Data Architecture' },
      { id: 'skill_os', name: 'Operating Systems & Concurrency', desc: 'Threads, mutexes, virtual memory, process scheduling, syscall interfaces.', required_level: 4, category: 'Systems Core' }
    ];
    const s2Items = s2Skills.map(sk => {
      const mastered = isSkillMastered(sk.id);
      const needImp = needToImprove.some(s => s.skill_id === sk.id);
      const completed = isItemDone('stage_2', sk.id, mastered);
      return {
        id: sk.id,
        title: sk.name,
        type: 'skill',
        description: sk.desc,
        status: completed ? 'completed' : needImp ? 'in_progress' : 'pending',
        actionUrl: '#/practice',
        actionLabel: 'Solve Practice Questions'
      };
    });
    s2Items.push({
      id: 'task_dsa_milestone',
      title: '50-Problem Algorithmic Benchmark (LeetCode / TechPath Practice)',
      type: 'drill',
      description: 'Demonstrate competency in two-pointer, sliding window, binary search, and graph traversal algorithms.',
      status: isItemDone('stage_2', 'task_dsa_milestone', false) ? 'completed' : 'pending',
      actionUrl: '#/practice',
      actionLabel: 'Launch Practice'
    });

    const s2DoneCount = s2Items.filter(i => i.status === 'completed').length;
    stages.push({
      id: 'stage_2',
      stage_number: 2,
      title: 'Stage 2 — Core Systems & Data Handling',
      type: 'Systems Competency',
      description: 'Implement foundational data structures from scratch, query relational databases, and understand concurrency.',
      estimated_hours: 75,
      prerequisites: 'Stage 1 — Foundations',
      items: s2Items,
      progress_percentage: Math.round((s2DoneCount / s2Items.length) * 100),
      status: s2DoneCount === s2Items.length ? 'completed' : (stages[0].status === 'completed' ? 'in_progress' : 'pending')
    });

    // ──────────────────────────────────────────────────────────────────────────
    // STAGE 3: ROLE-SPECIFIC MASTERY & SPECIALIZED FRAMEWORKS
    // ──────────────────────────────────────────────────────────────────────────
    // Filter skills that are specifically required for this role
    const roleSpecificRequirements = (role.required_skills || []).map(rs => {
      const evalMatch = evaluation.skills.find(s => s.skill_id === rs.skill_id);
      const isAlready = alreadyHave.some(s => s.skill_id === rs.skill_id);
      const isImp = needToImprove.some(s => s.skill_id === rs.skill_id);
      const completed = isItemDone('stage_3', rs.skill_id, isAlready);

      return {
        id: rs.skill_id,
        title: evalMatch?.name || rs.skill_id.replace('skill_', '').toUpperCase(),
        type: 'skill',
        description: evalMatch?.description || `Required Level L${rs.level || 3} competency for ${role.title}.`,
        why_it_matters: evalMatch?.why_it_matters || `Essential industry benchmark for ${role.title}.`,
        required_level: rs.level || 3,
        status: completed ? 'completed' : isImp ? 'in_progress' : 'pending',
        priority: evalMatch?.priority || 'High',
        actionUrl: '#/skills',
        actionLabel: 'View Skill Matrix'
      };
    });

    // Add optional/supplementary skills if available
    const optItems = optionalSkills.slice(0, 2).map(os => ({
      id: os.skill_id,
      title: `${os.name} (Recommended Elective)`,
      type: 'skill',
      description: os.description,
      status: isItemDone('stage_3', os.skill_id, os.current_level >= 2) ? 'completed' : 'pending',
      priority: 'Nice to Have',
      actionUrl: '#/skills',
      actionLabel: 'Skill Details'
    }));

    const s3Items = [...roleSpecificRequirements, ...optItems];
    const s3DoneCount = s3Items.filter(i => i.status === 'completed').length;
    stages.push({
      id: 'stage_3',
      stage_number: 3,
      title: `Stage 3 — ${role.title} Technical Competencies`,
      type: 'Domain Specialization',
      description: `Bridge academic knowledge to production-grade competencies expected of an entry-level to mid-level ${role.title}.`,
      estimated_hours: 90,
      prerequisites: 'Stage 2 — Core Systems',
      items: s3Items,
      progress_percentage: Math.round((s3DoneCount / Math.max(1, s3Items.length)) * 100),
      status: s3DoneCount === s3Items.length ? 'completed' : (stages[1].status === 'completed' ? 'in_progress' : 'pending')
    });

    // ──────────────────────────────────────────────────────────────────────────
    // STAGE 4: CAPSTONE PORTFOLIO PROJECTS & ARCHITECTURE
    // ──────────────────────────────────────────────────────────────────────────
    const allProjects = await dbStore.getAll('projects');
    const matchingProjs = allProjects.filter(p => {
      const pBranch = (p.branch_id || '').toLowerCase();
      const pSkills = p.skills || [];
      return pBranch === branch.toLowerCase() || pSkills.some(ps => (role.required_skills || []).map(r => r.skill_id).includes(ps));
    }).slice(0, 3);

    const s4Items = matchingProjs.map((proj, idx) => {
      const completed = isItemDone('stage_4', proj.id, false);
      return {
        id: proj.id,
        title: proj.title,
        type: 'project',
        description: proj.objective || proj.problem_statement || 'Full production architecture implementation.',
        estimated_hours: proj.estimated_hours || 35,
        status: completed ? 'completed' : 'pending',
        actionUrl: '#/projects',
        actionLabel: 'Build Capstone'
      };
    });

    if (s4Items.length === 0) {
      s4Items.push({
        id: 'proj_role_capstone_1',
        title: `Production ${role.title} System Implementation`,
        type: 'project',
        description: `Architect, containerize, and deploy an end-to-end ${role.title} system with CI/CD and telemetry.`,
        estimated_hours: 45,
        status: isItemDone('stage_4', 'proj_role_capstone_1', false) ? 'completed' : 'pending',
        actionUrl: '#/projects',
        actionLabel: 'Open Project Studio'
      });
    }

    const s4DoneCount = s4Items.filter(i => i.status === 'completed').length;
    stages.push({
      id: 'stage_4',
      stage_number: 4,
      title: 'Stage 4 — Capstone Portfolio & Architecture',
      type: 'Portfolio Capstone',
      description: 'Build non-trivial, verifiable engineering artifacts with automated unit testing, deployment, and live demos.',
      estimated_hours: 70,
      prerequisites: 'Stage 3 — Technical Competencies',
      items: s4Items,
      progress_percentage: Math.round((s4DoneCount / s4Items.length) * 100),
      status: s4DoneCount === s4Items.length ? 'completed' : (stages[2].status === 'completed' ? 'in_progress' : 'pending')
    });

    // ──────────────────────────────────────────────────────────────────────────
    // STAGE 5: CAREER, RESUME & MOCK INTERVIEW READINESS
    // ──────────────────────────────────────────────────────────────────────────
    const s5Items = [
      {
        id: 'task_resume_build',
        title: `Tailor ATS-Optimized Resume for ${role.title}`,
        type: 'career_prep',
        description: 'Highlight capstone project architecture, technical skill proficiencies, and quantifiable impact metrics.',
        status: isItemDone('stage_5', 'task_resume_build', false) ? 'completed' : 'pending',
        actionUrl: '#/resume',
        actionLabel: 'Build Resume'
      },
      {
        id: 'task_technical_interview',
        title: `Complete Role Mock Interview Drill (${role.title})`,
        type: 'interview',
        description: 'Complete a timed technical and architectural mock interview drill evaluated across domain-specific rubrics.',
        status: isItemDone('stage_5', 'task_technical_interview', false) ? 'completed' : 'pending',
        actionUrl: '#/mock-interview',
        actionLabel: 'Launch Interview'
      },
      {
        id: 'task_star_behavioral',
        title: 'Complete STAR Behavioral & Engineering Leadership Simulation',
        type: 'interview',
        description: 'Articulate engineering trade-offs, handling project failures, and cross-functional team communication.',
        status: isItemDone('stage_5', 'task_star_behavioral', false) ? 'completed' : 'pending',
        actionUrl: '#/mock-interview',
        actionLabel: 'STAR Drill'
      }
    ];

    const s5DoneCount = s5Items.filter(i => i.status === 'completed').length;
    stages.push({
      id: 'stage_5',
      stage_number: 5,
      title: 'Stage 5 — Professional Placement & Interview Readiness',
      type: 'Career Placement',
      description: 'Refine technical communication, validate resume against ATS screeners, and succeed in technical drills.',
      estimated_hours: 35,
      prerequisites: 'Stage 4 — Capstone Portfolio',
      items: s5Items,
      progress_percentage: Math.round((s5DoneCount / s5Items.length) * 100),
      status: s5DoneCount === s5Items.length ? 'completed' : (stages[3].status === 'completed' ? 'in_progress' : 'pending')
    });

    // Overall metrics
    let totalItems = 0;
    let totalCompleted = 0;
    stages.forEach(st => {
      totalItems += st.items.length;
      totalCompleted += st.items.filter(i => i.status === 'completed').length;
    });
    const overallProgress = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

    const trajectory = {
      id: `traj_${userId}_${roleId}`,
      user_id: userId,
      role_id: roleId,
      role_title: role.title,
      branch_id: branch,
      specialization_id: specialization,
      current_semester: semester,
      stages,
      stats: {
        totalStages: stages.length,
        totalItems,
        totalCompleted,
        overallProgress,
        readinessScore: evaluation.stats.readinessPercent
      },
      evaluation,
      updated_at: new Date().toISOString()
    };

    // Cache locally
    try {
      await dbStore.insert('career_trajectories', trajectory);
    } catch { /* proceed */ }

    return trajectory;
  }

  /**
   * Updates an item's completion status within a trajectory stage,
   * updating user_skills and Supabase profiles.skills when a skill is mastered.
   */
  static async updateTrajectoryItem(userId, roleId, stageId, itemId, itemType, completed = true) {
    if (!userId) return;

    // 1. Record progress locally in IndexedDB
    const progressRecord = {
      id: `prog_${userId}_${roleId}_${stageId}_${itemId}`,
      user_id: userId,
      role_id: roleId,
      stage_id: stageId,
      item_id: itemId,
      item_type: itemType,
      completed,
      completed_at: completed ? new Date().toISOString() : null
    };

    try {
      await dbStore.insert('user_trajectory_progress', progressRecord);
    } catch {
      await dbStore.update('user_trajectory_progress', progressRecord.id, progressRecord);
    }

    // 2. If it's a skill item and marked completed, update user_skills
    if (itemType === 'skill' && completed) {
      await SkillsEngine.updateUserSkillProgress(userId, itemId, 4, 'Mastered');
    }

    // 3. Persist to Supabase if authenticated
    if (userId !== 'usr_guest') {
      try {
        await supabase.from('user_trajectory_progress').upsert({
          user_id: userId,
          role_id: roleId,
          stage_id: stageId,
          item_id: itemId,
          item_type: itemType,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        }, { onConflict: 'user_id, role_id, stage_id, item_id' });
      } catch (err) {
        console.warn('[CareerEngine] Supabase progress sync note:', err.message);
      }
    }

    return true;
  }

  static calculateReadinessScore(evaluatedSkills) {
    if (!evaluatedSkills || evaluatedSkills.length === 0) return 0;
    let totalPossible = 0;
    let totalAchieved = 0;

    evaluatedSkills.forEach((s) => {
      const req = s.required_level || 3;
      const cur = s.current_level || 0;
      const weight = s.importance_weight || 1.0;
      totalPossible += req * weight;
      totalAchieved += Math.min(cur, req) * weight;
    });

    return totalPossible > 0 ? Math.round((totalAchieved / totalPossible) * 100) : 0;
  }

  /**
   * Internal helper to synthesize sensible required skills for taxonomy roles
   */
  static _inferRequiredSkills(roleTitle, branchId = 'cse') {
    const t = roleTitle.toLowerCase();
    if (t.includes('ml') || t.includes('machine learning') || t.includes('ai') || t.includes('data scientist')) {
      return [
        { skill_id: 'skill_python', level: 5, weight: 1.0 },
        { skill_id: 'skill_ml', level: 5, weight: 1.0 },
        { skill_id: 'skill_statistics', level: 4, weight: 0.9 },
        { skill_id: 'skill_sql', level: 4, weight: 0.8 },
        { skill_id: 'skill_dl', level: 4, weight: 0.8 },
        { skill_id: 'skill_git', level: 4, weight: 0.7 }
      ];
    }
    if (t.includes('backend') || t.includes('systems') || t.includes('cloud') || t.includes('devops')) {
      return [
        { skill_id: 'skill_dsa', level: 4, weight: 1.0 },
        { skill_id: 'skill_linux', level: 4, weight: 0.9 },
        { skill_id: 'skill_sql', level: 4, weight: 0.9 },
        { skill_id: 'skill_docker', level: 4, weight: 0.8 },
        { skill_id: 'skill_git', level: 4, weight: 0.8 },
        { skill_id: 'skill_sys_design', level: 3, weight: 0.7 }
      ];
    }
    if (t.includes('embedded') || t.includes('vlsi') || t.includes('hardware') || branchId === 'ece') {
      return [
        { skill_id: 'skill_embedded_c', level: 5, weight: 1.0 },
        { skill_id: 'skill_c', level: 4, weight: 0.9 },
        { skill_id: 'skill_microcontrollers', level: 4, weight: 0.9 },
        { skill_id: 'skill_vlsi', level: 3, weight: 0.8 },
        { skill_id: 'skill_git', level: 3, weight: 0.7 }
      ];
    }
    // Default software engineering skills
    return [
      { skill_id: 'skill_dsa', level: 5, weight: 1.0 },
      { skill_id: 'skill_os', level: 4, weight: 0.9 },
      { skill_id: 'skill_sql', level: 3, weight: 0.8 },
      { skill_id: 'skill_git', level: 4, weight: 0.8 },
      { skill_id: 'skill_python', level: 3, weight: 0.7 },
      { skill_id: 'skill_linux', level: 3, weight: 0.7 }
    ];
  }
}

