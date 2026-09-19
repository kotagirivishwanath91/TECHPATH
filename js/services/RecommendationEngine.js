/**
 * TECHPATH — CENTRALIZED RECOMMENDATION ENGINE
 * Consumes LearningContext to produce strictly branch- and gap-aligned suggestions
 */

import { dbStore } from '../db/store.js';
import { learningContext } from '../context/LearningContext.js';

export class RecommendationEngine {
  /**
   * Generates tailored recommendations matching current state
   */
  static async getRecommendations() {
    const ctx = learningContext.get();
    const { branch_id, semester_id, skill_gaps, target_role } = ctx;

    // 1. Next Video to watch (Strictly in active branch & semester)
    const videos = await dbStore.filter('videos', (v) => v.branch_id === branch_id && v.semester_id === semester_id);
    const recommendedVideo = videos.length > 0 ? videos[0] : null;

    // 2. Next 3D Model to explore
    const models = await dbStore.filter('branch_models', (m) => m.branch_id === branch_id && m.semester_id === semester_id);
    const recommendedModel = models.length > 0 ? models[0] : null;

    // 3. Recommended Project (Grounded in current skill gaps or branch)
    const projects = await dbStore.filter('projects', (p) => p.branch_id === branch_id);
    let recommendedProject = projects[0] || null;
    if (skill_gaps?.length > 0) {
      const topGapSkillId = skill_gaps[0].skill_id;
      const projectTargetingGap = projects.find((p) => p.skills.includes(topGapSkillId));
      if (projectTargetingGap) recommendedProject = projectTargetingGap;
    }

    // 4. Priority Skill to Master
    const prioritySkill = skill_gaps && skill_gaps.length > 0 ? skill_gaps[0] : null;

    return {
      branchId: branch_id,
      semesterId: semester_id,
      video: recommendedVideo,
      model: recommendedModel,
      project: recommendedProject,
      prioritySkill,
      targetRole: target_role
    };
  }
}
