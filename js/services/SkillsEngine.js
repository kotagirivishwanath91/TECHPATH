/**
 * TECHPATH — ROLE-AWARE SKILLS & SKILL GAP ENGINE
 * Analyzes required role competencies vs user skill levels
 * Closes the loop between Quiz, Project, Interview, and LearnHub
 */

import { dbStore } from '../db/store.js';
import { learningContext } from '../context/LearningContext.js';
import { supabase } from '../lib/supabase.js';

export class SkillsEngine {
  /**
   * Evaluates skills for a specific career role against user proficiency
   * Produces the 4 canonical groups: Already Have, Need to Learn, Need to Improve, and Optional
   */
  static async evaluateRoleSkills(roleId, userId = 'usr_guest') {
    let role = await dbStore.getById('career_roles', roleId);
    if (!role) {
      const allRoles = await dbStore.getAll('career_roles');
      role = allRoles.find(r => r.id === roleId || r.title.toLowerCase() === (roleId || '').toLowerCase()) || allRoles[0];
    }
    if (!role) return { role: null, skills: [], gaps: [], alreadyHave: [], needToLearn: [], needToImprove: [], optionalSkills: [], stats: { totalSkills: 0, readinessPercent: 0 } };

    const allSkills = await dbStore.getAll('skills');
    const userSkills = await dbStore.filter('user_skills', (us) => us.user_id === userId);
    const userSkillMap = new Map(userSkills.map((us) => [us.skill_id, us]));

    const evaluated = [];
    const alreadyHave = [];
    const needToLearn = [];
    const needToImprove = [];
    const roleSkillIds = new Set();

    for (const req of (role.required_skills || [])) {
      roleSkillIds.add(req.skill_id);
      const skillMeta = allSkills.find((s) => s.id === req.skill_id) || {
        id: req.skill_id,
        name: req.skill_id.replace('skill_', '').replace(/_/g, ' ').toUpperCase(),
        category: 'Core Engineering',
        description: 'Key competency required for this engineering specialization.'
      };

      const userRecord = userSkillMap.get(req.skill_id);
      const currentLevel = userRecord ? userRecord.current_level : 0;
      const requiredLevel = req.level || 3;
      const delta = requiredLevel - currentLevel;
      const weight = req.weight || 1.0;

      let status = 'Need to Learn';
      let priority = 'Medium';
      if (weight >= 0.95 || requiredLevel >= 5) priority = 'Critical';
      else if (weight >= 0.8 || requiredLevel >= 4) priority = 'High';

      if (currentLevel >= requiredLevel) {
        status = 'Already Have';
      } else if (currentLevel > 0) {
        status = 'Need to Improve';
      } else {
        status = 'Need to Learn';
      }

      const item = {
        skill_id: req.skill_id,
        name: skillMeta.name,
        category: skillMeta.category || 'Core Systems',
        description: skillMeta.description || 'Core engineering benchmark requirement.',
        why_it_matters: this._getWhyItMatters(skillMeta.name, role.title),
        required_level: requiredLevel,
        current_level: currentLevel,
        target_proficiency: `Level ${requiredLevel} (${this._getLevelLabel(requiredLevel)})`,
        gap_delta: Math.max(0, delta),
        status,
        priority,
        importance_weight: weight,
        source: userRecord ? userRecord.source : 'Unassessed',
        recommended_actions: this.generateRemediationActions(skillMeta, delta)
      };

      evaluated.push(item);

      if (status === 'Already Have') {
        alreadyHave.push(item);
      } else if (status === 'Need to Improve') {
        needToImprove.push(item);
      } else {
        needToLearn.push(item);
      }
    }

    // Optional / Nice to Have skills from same branch or category
    const optionalSkills = allSkills
      .filter(s => !roleSkillIds.has(s.id))
      .slice(0, 5)
      .map(s => {
        const userRec = userSkillMap.get(s.id);
        const cur = userRec ? userRec.current_level : 0;
        return {
          skill_id: s.id,
          name: s.name,
          category: s.category || 'Supplementary',
          description: s.description || 'High-value secondary competency for career acceleration.',
          why_it_matters: `Provides differentiated competitive advantage in ${role.title} cross-functional teams.`,
          required_level: 2,
          current_level: cur,
          target_proficiency: 'Level 2 (Foundational Competency)',
          status: cur >= 2 ? 'Already Have' : cur > 0 ? 'Need to Improve' : 'Optional',
          priority: 'Nice to Have',
          importance_weight: 0.5,
          recommended_actions: this.generateRemediationActions(s, Math.max(0, 2 - cur))
        };
      });

    const gaps = [...needToLearn, ...needToImprove];
    const totalRequired = evaluated.length;
    const masteredCount = alreadyHave.length;
    const readinessPercent = totalRequired > 0 ? Math.round((masteredCount / totalRequired) * 100) : 0;

    const stats = {
      totalRequired,
      masteredCount,
      needToLearnCount: needToLearn.length,
      needToImproveCount: needToImprove.length,
      readinessPercent
    };

    // Update centralized learning context
    learningContext.setSkillsAndGaps(evaluated, gaps);

    return {
      role,
      skills: evaluated,
      alreadyHave,
      needToLearn,
      needToImprove,
      optionalSkills,
      gaps,
      stats
    };
  }

  static _getLevelLabel(level) {
    if (level >= 5) return 'Architect & Production Mastery';
    if (level === 4) return 'Advanced Engineering';
    if (level === 3) return 'Intermediate Competency';
    if (level === 2) return 'Working Knowledge';
    return 'Foundations';
  }

  static _getWhyItMatters(skillName, roleTitle) {
    return `Critical for ${roleTitle} to ensure fault-tolerant implementation, code review standards, and technical interview benchmarks.`;
  }

  /**
   * Generates concrete actionable steps to eliminate skill deficit
   */
  static generateRemediationActions(skill, delta) {
    const actions = [];
    if (delta > 0) {
      actions.push({ type: 'learn', label: `Study ${skill.name} on LearnHub`, route: '#/learnhub' });
      actions.push({ type: 'quiz', label: `Pass ${skill.name} Knowledge Drill`, route: '#/practice' });
      actions.push({ type: 'project', label: `Build Capstone using ${skill.name}`, route: '#/projects' });
      actions.push({ type: 'interview', label: `Mock Interview: ${skill.name}`, route: '#/interview' });
    }
    return actions;
  }

  /**
   * Updates user skill proficiency level and status with immediate persistence
   */
  static async updateUserSkillProgress(userId, skillId, gainedLevel, source = 'Self-Assessment') {
    const existing = await dbStore.filter('user_skills', (us) => us.user_id === userId && us.skill_id === skillId);
    let currentLevel = existing.length > 0 ? existing[0].current_level : 0;

    const newLevel = Math.min(5, Math.max(0, gainedLevel));
    let status = 'Developing';
    if (newLevel >= 4) status = 'Strong';
    else if (newLevel <= 1) status = 'Needs Improvement';

    const record = {
      id: `${userId}_${skillId}`,
      user_id: userId,
      skill_id: skillId,
      current_level: newLevel,
      status,
      source: source || 'Assessment',
      last_practiced_at: new Date().toISOString()
    };

    const hasItem = await dbStore.getById('user_skills', record.id);
    if (hasItem) {
      await dbStore.update('user_skills', record.id, record);
    } else {
      await dbStore.insert('user_skills', record);
    }

    // Sync to Supabase user profile skills array if authenticated
    if (userId && userId !== 'usr_guest') {
      try {
        const allUserSkills = await dbStore.filter('user_skills', (us) => us.user_id === userId);
        const formatted = allUserSkills.map(us => ({ skill_id: us.skill_id, level: us.current_level, status: us.status }));
        await supabase.from('profiles').update({
          current_skills: formatted,
          updated_at: new Date().toISOString()
        }).eq('id', userId);
      } catch (err) {
        console.warn('[Supabase Skill Sync Note]:', err.message);
      }
    }

    return record;
  }

  /**
   * Legacy method signature for backward compatibility
   */
  static async recordSkillEvidence(userId, skillId, gainedLevel, source) {
    return this.updateUserSkillProgress(userId, skillId, gainedLevel, source);
  }
}
