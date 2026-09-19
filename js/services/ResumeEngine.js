/**
 * TECHPATH — RESUME BUILDER & AI RESUME COACH ENGINE
 * Client-side text parsing, skill extraction, project matching, export,
 * and multi-dimensional AI Resume Coach analysis.
 */

import { dbStore } from '../db/store.js';
import { learningContext } from '../context/LearningContext.js';

export const TARGET_ENGINEERING_ROLES = [
  {
    id: 'role_swe',
    name: 'Software Engineer',
    track: 'Core Software & Distributed Systems',
    description: 'Engineering resilient, scalable services, algorithms, and core software systems.',
    core_skills: ['Data Structures & Algorithms', 'C++', 'Java', 'Python', 'Git', 'Operating Systems', 'System Design', 'Linux', 'SQL'],
    recommended_projects: 'High-throughput distributed cache, asynchronous telemetry pipeline, or concurrent key-value store.'
  },
  {
    id: 'role_backend',
    name: 'Backend Developer',
    track: 'Server Architecture & APIs',
    description: 'Designing high-availability transactional APIs, database schemas, and microservice architectures.',
    core_skills: ['REST APIs', 'Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'Database Architecture', 'Microservices', 'Git'],
    recommended_projects: 'Idempotent payment gateway API, real-time message broker, or multi-tenant REST backend.'
  },
  {
    id: 'role_frontend',
    name: 'Frontend Engineer',
    track: 'User Interface & Web Engineering',
    description: 'Developing responsive, accessible, and high-performance user interfaces and web applications.',
    core_skills: ['JavaScript', 'TypeScript', 'React', 'HTML5 & CSS', 'State Management', 'Web Performance', 'REST APIs', 'Git'],
    recommended_projects: 'Interactive dashboard with virtualization, collaborative canvas whiteboard, or accessible component design system.'
  },
  {
    id: 'role_aiml',
    name: 'Machine Learning / AI Engineer',
    track: 'Artificial Intelligence & Data Systems',
    description: 'Training, evaluating, and serving predictive and generative deep learning models with mathematical rigor.',
    core_skills: ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Pandas & NumPy', 'Linear Algebra', 'Model Evaluation', 'SQL'],
    recommended_projects: 'Real-time object detection pipeline, fine-tuned transformer with quantization, or feature store for tabular inference.'
  },
  {
    id: 'role_embedded',
    name: 'Embedded Systems & Firmware Engineer',
    track: 'Hardware-Software Systems',
    description: 'Developing deterministic, low-power bare-metal and RTOS firmware for microcontrollers.',
    core_skills: ['Embedded C', 'C++', 'Microcontrollers', 'RTOS', 'Digital Electronics', 'I2C / SPI / UART', 'Circuit Debugging', 'Linux'],
    recommended_projects: 'FreeRTOS telemetry node over CAN bus, bare-metal ARM Cortex bootloader, or sensor fusion with EKF filter.'
  },
  {
    id: 'role_cloud',
    name: 'Cloud / DevOps Engineer',
    track: 'Cloud Infrastructure & Reliability',
    description: 'Automating continuous deployment pipelines and maintaining resilient cloud infrastructure.',
    core_skills: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'AWS / Cloud Infrastructure', 'Linux Administration', 'Git', 'Prometheus / Monitoring'],
    recommended_projects: 'GitOps Kubernetes cluster with automated canary deployments, automated multi-cloud failover pipeline, or Terraform IaC blueprint.'
  },
  {
    id: 'role_civil',
    name: 'Structural / Civil Infrastructure Engineer',
    track: 'Civil & Structural Design',
    description: 'Analyzing load-bearing structures, foundations, and modern infrastructure systems.',
    core_skills: ['Structural Analysis', 'AutoCAD', 'Reinforced Concrete Design', 'STAAD.Pro', 'Strength of Materials', 'Building Codes'],
    recommended_projects: 'Seismic response analysis of multi-story frame, retaining wall stability optimization, or BIM structural modeling.'
  },
  {
    id: 'role_mech',
    name: 'Mechanical Design & CAD/CAE Engineer',
    track: 'Mechanical Simulation & Product Design',
    description: 'Engineering mechanical assemblies, thermal dissipation, and stress-optimized components.',
    core_skills: ['SolidWorks / CAD', 'Thermodynamics', 'Mechanics of Materials', 'Finite Element Analysis', 'ANSYS / Simulation'],
    recommended_projects: 'Conjugate heat transfer simulation of EV battery enclosure, topology optimization of suspension knuckle, or fatigue life assessment.'
  },
  {
    id: 'role_power',
    name: 'Power Systems & Electrical Engineer',
    track: 'Electrical & Energy Systems',
    description: 'Modeling power generation, transmission networks, protection relays, and smart electrical grids.',
    core_skills: ['Power Systems Analysis', 'Circuit Theory', 'Electrical Machines', 'MATLAB / Simulink', 'Control Systems', 'Power Electronics'],
    recommended_projects: 'Distribution network fault coordination model, microgrid inverter islanding detector, or MPPT solar charge controller.'
  }
];

export class ResumeEngine {
  /**
   * Retrieves role definition by ID or name
   */
  static getRoleById(roleId) {
    if (!roleId) return TARGET_ENGINEERING_ROLES[0];
    const cleanId = roleId.toLowerCase().trim();
    const found = TARGET_ENGINEERING_ROLES.find(r => 
      r.id === cleanId || 
      r.name.toLowerCase() === cleanId || 
      cleanId.includes(r.name.toLowerCase()) || 
      r.name.toLowerCase().includes(cleanId)
    );
    return found || TARGET_ENGINEERING_ROLES[0];
  }

  /**
   * Parses uploaded resume text or document
   */
  static async parseResumeText(rawText, userId = 'usr_guest') {
    if (!rawText || rawText.trim().length === 0) {
      throw new Error('Resume content cannot be empty.');
    }

    const lower = rawText.toLowerCase();
    const allSkills = await dbStore.getAll('skills');
    const matchedSkills = [];

    // Canonical skill keyword search
    allSkills.forEach((s) => {
      const skillNameLower = s.name.toLowerCase();
      if (lower.includes(skillNameLower) || (s.id === 'skill_python' && lower.includes('python')) || (s.id === 'skill_sql' && lower.includes('sql')) || (s.id === 'skill_dsa' && (lower.includes('algorithms') || lower.includes('data structures')))) {
        matchedSkills.push({
          skill_id: s.id,
          name: s.name,
          category: s.category,
          level: 3,
          source: 'Detected via Resume'
        });
      }
    });

    // Detect project titles or tech stacks
    const extractedProjects = [];
    const lines = rawText.split('\n');
    lines.forEach((line) => {
      if (line.toLowerCase().includes('project:') || line.toLowerCase().includes('developed') || line.toLowerCase().includes('built')) {
        extractedProjects.push(line.trim());
      }
    });

    const resumeRecord = await dbStore.insert('resumes', {
      user_id: userId,
      title: 'Uploaded Technical Resume',
      source_type: 'upload',
      raw_text: rawText,
      extracted_skills: matchedSkills,
      parsed_data: {
        projects: extractedProjects.slice(0, 5),
        word_count: rawText.split(/\s+/).length
      },
      updated_at: new Date().toISOString()
    });

    learningContext.setResume(resumeRecord.id);

    for (const sk of matchedSkills) {
      await dbStore.insert('user_skills', {
        id: `${userId}_${sk.skill_id}`,
        user_id: userId,
        skill_id: sk.skill_id,
        current_level: sk.level,
        status: 'Developing',
        source: 'Detected from Resume',
        last_practiced_at: new Date().toISOString()
      });
    }

    return resumeRecord;
  }

  /**
   * Formats and exports builder state to JSON & Printable HTML
   */
  static exportResume(resumeData) {
    return {
      json: JSON.stringify(resumeData, null, 2),
      html: `
        <div class="resume-sheet">
          <h1>${resumeData.personal?.name || 'Engineer'}</h1>
          <p>${resumeData.personal?.email || ''} | ${resumeData.personal?.phone || ''} | ${resumeData.personal?.github || ''}</p>
          <hr/>
          <h3>Education</h3>
          <p><strong>${resumeData.education?.[0]?.degree || 'B.Tech Engineering'}</strong> — ${resumeData.education?.[0]?.institution || 'University'} (${resumeData.education?.[0]?.year || '2026'})</p>
          <h3>Technical Skills</h3>
          <p>${(resumeData.skills || []).map(s => s.items).join(', ')}</p>
          <h3>Engineering Projects</h3>
          ${(resumeData.projects || []).map((p) => `<p><strong>${p.title}</strong>: ${(p.bullets || []).join(' ')}</p>`).join('')}
        </div>
      `
    };
  }

  /**
   * Comprehensive Multi-Dimensional AI Resume Coach Analysis
   */
  static async analyzeResumeWithCoach(resumeData, targetRoleId = 'role_swe', profile = {}, userId = 'usr_guest') {
    if (!resumeData) {
      throw new Error('Resume data is required for coach analysis.');
    }

    const role = this.getRoleById(targetRoleId);
    const p = resumeData.personal || {};
    const summary = resumeData.summary || '';
    const education = resumeData.education || [];
    const skills = resumeData.skills || [];
    const projects = resumeData.projects || [];
    const experience = resumeData.experience || [];
    const certs = resumeData.certifications || [];

    // Aggregate all text for parsing
    const allResumeText = [
      p.name, p.title, summary, resumeData.objective || '',
      ...education.map(e => `${e.degree} ${e.institution} ${e.coursework || ''}`),
      ...skills.map(s => `${s.category} ${s.items}`),
      ...projects.map(pr => `${pr.title} ${pr.techStack} ${(pr.bullets || []).join(' ')}`),
      ...experience.map(x => `${x.title} ${x.company} ${(x.bullets || []).join(' ')}`)
    ].join(' ').toLowerCase();

    // Collect distinct skill strings present in skills section
    const rawSkillsText = skills.map(s => s.items).join(', ').toLowerCase();
    const skillsList = skills.flatMap(s => (s.items || '').split(',').map(x => x.trim().toLowerCase())).filter(Boolean);

    // Collect project & experience descriptions for evidence matching
    const projectAndExpText = [
      ...projects.map(pr => `${pr.title} ${pr.techStack} ${(pr.bullets || []).join(' ')}`),
      ...experience.map(x => `${x.title} ${x.company} ${(x.bullets || []).join(' ')}`)
    ].join(' ').toLowerCase();

    // ──────────────────────────────────────────────────────────────────────────
    // 1. Target-Role Skill Analysis (3 Categories: Represented, Needs Evidence, Missing)
    // ──────────────────────────────────────────────────────────────────────────
    const alreadyRepresented = [];
    const needsEvidence = [];
    const missingFromResume = [];

    role.core_skills.forEach(skill => {
      const skLower = skill.toLowerCase();
      const inSkillsSection = skillsList.some(s => s.includes(skLower) || skLower.includes(s));
      const inProjectEvidence = projectAndExpText.includes(skLower);

      if (inSkillsSection && inProjectEvidence) {
        alreadyRepresented.push({
          name: skill,
          status: 'represented',
          evidenceNote: `Demonstrated in your project / experience details.`
        });
      } else if (inSkillsSection && !inProjectEvidence) {
        needsEvidence.push({
          name: skill,
          status: 'needs_evidence',
          evidenceNote: `Listed in skills, but not evidenced in any project or bullet point.`
        });
      } else if (inProjectEvidence) {
        alreadyRepresented.push({
          name: skill,
          status: 'represented',
          evidenceNote: `Demonstrated in projects, but consider adding to your skills list.`
        });
      } else {
        missingFromResume.push({
          name: skill,
          status: 'missing',
          evidenceNote: `Important for ${role.name}. Consider adding ONLY if you have genuine project experience.`
        });
      }
    });

    // ──────────────────────────────────────────────────────────────────────────
    // 2. Multi-Dimensional Resume Strength Score (0 – 100%)
    // ──────────────────────────────────────────────────────────────────────────
    const scores = {
      completeness: 0,        // Max 15
      roleRelevance: 0,       // Max 15
      skillsEvidence: 0,      // Max 15
      projectsDepth: 0,       // Max 15
      experienceAndTraining: 0,// Max 10
      actionVerbsAndImpact: 0,// Max 15
      formatting: 0,          // Max 10
      keywordCoverage: 0      // Max 15
    };

    // 2.1 Completeness (15 pts)
    let compPoints = 0;
    if (p.name && p.email && p.phone) compPoints += 4;
    if (summary && summary.length > 50) compPoints += 3;
    if (education.length > 0 && education[0].institution) compPoints += 3;
    if (skills.length > 0 && skills[0].items) compPoints += 3;
    if (projects.length > 0) compPoints += 2;
    scores.completeness = Math.min(compPoints, 15);

    // 2.2 Role Relevance (15 pts)
    let rolePoints = 0;
    const roleTitleLower = role.name.toLowerCase();
    if ((p.title || '').toLowerCase().includes(roleTitleLower) || (p.title || '').toLowerCase().includes('engineer')) rolePoints += 5;
    if (summary.toLowerCase().includes(roleTitleLower) || summary.toLowerCase().includes(role.track.toLowerCase())) rolePoints += 4;
    const repRatio = alreadyRepresented.length / role.core_skills.length;
    rolePoints += Math.round(repRatio * 6);
    scores.roleRelevance = Math.min(rolePoints, 15);

    // 2.3 Skills Evidence (15 pts)
    const totalListedSkills = skillsList.length || 1;
    let verifiedEvidenceCount = 0;
    skillsList.forEach(sk => {
      if (projectAndExpText.includes(sk)) verifiedEvidenceCount++;
    });
    const evidenceRatio = Math.min(verifiedEvidenceCount / totalListedSkills, 1);
    scores.skillsEvidence = Math.round(evidenceRatio * 15);

    // 2.4 Projects Depth (15 pts)
    let projPoints = 0;
    if (projects.length >= 1) projPoints += 5;
    if (projects.length >= 2) projPoints += 4;
    const hasTechStack = projects.every(pr => pr.techStack && pr.techStack.length > 3);
    if (hasTechStack) projPoints += 3;
    const hasMultipleBullets = projects.every(pr => (pr.bullets || []).length >= 2);
    if (hasMultipleBullets) projPoints += 3;
    scores.projectsDepth = Math.min(projPoints, 15);

    // 2.5 Experience & Practical Training (10 pts)
    let expPoints = 0;
    if (experience.length > 0) {
      expPoints += 10;
    } else if (projects.length >= 2) {
      expPoints += 7; // Capstone project credit for students
    } else {
      expPoints += 3;
    }
    scores.experienceAndTraining = Math.min(expPoints, 10);

    // 2.6 Action Verbs & Measurable Impact (15 pts)
    const strongActionVerbs = ['engineered', 'architected', 'implemented', 'benchmarked', 'optimized', 'designed', 'developed', 'deployed', 'modeled', 'simulated', 'constructed', 'instrumented', 'integrated'];
    const passiveWords = ['worked on', 'helped', 'assisted', 'participated', 'involved in', 'responsible for', 'did'];
    let strongVerbCount = 0;
    let hasMetrics = false;

    projects.forEach(pr => {
      (pr.bullets || []).forEach(b => {
        const bLower = b.toLowerCase();
        if (strongActionVerbs.some(v => bLower.startsWith(v) || bLower.includes(v))) strongVerbCount++;
        if (/\d+%|\d+\s*(ms|sec|req|users|gb|mb|kb|fps|events)/i.test(b)) hasMetrics = true;
      });
    });

    let impactPoints = Math.min(strongVerbCount * 3, 10);
    if (hasMetrics) impactPoints += 5;
    scores.actionVerbsAndImpact = Math.min(impactPoints, 15);

    // 2.7 Formatting & Structure (10 pts)
    let formatPoints = 10;
    if (!p.github && !p.linkedin) formatPoints -= 2;
    if (summary.length > 500) formatPoints -= 2; // Too long
    if (projects.some(pr => (pr.bullets || []).length === 0)) formatPoints -= 3;
    scores.formatting = Math.max(formatPoints, 4);

    // 2.8 Keyword Coverage (15 pts)
    const keywordMatchCount = role.core_skills.filter(sk => allResumeText.includes(sk.toLowerCase())).length;
    scores.keywordCoverage = Math.round((keywordMatchCount / role.core_skills.length) * 15);

    const totalStrengthScore = Math.min(
      scores.completeness +
      scores.roleRelevance +
      scores.skillsEvidence +
      scores.projectsDepth +
      scores.experienceAndTraining +
      scores.actionVerbsAndImpact +
      scores.formatting +
      scores.keywordCoverage,
      98
    );

    // ──────────────────────────────────────────────────────────────────────────
    // 3. Actionable Feedback: WHAT TO ADD, WHAT TO IMPROVE, HOW TO MAKE STRONGER
    // ──────────────────────────────────────────────────────────────────────────
    const whatToAdd = [];
    const whatToImprove = [];
    const suggestions = [];

    // Check What to Add
    if (!p.github && !p.website) {
      whatToAdd.push({
        type: 'links',
        title: 'Add GitHub or Technical Portfolio Link',
        detail: 'Hiring engineering teams look for public repositories verifying code cleanliness and commit history.'
      });
    }

    if (!hasMetrics) {
      whatToAdd.push({
        type: 'metrics',
        title: 'Add a measurable result if you have one',
        detail: 'Strengthen project bullet points by adding actual metrics (e.g. latency, throughput, benchmark percentage, or test coverage) ONLY where you have real verification without inventing numbers.'
      });
    }

    if (missingFromResume.length > 0) {
      const topMissing = missingFromResume.slice(0, 3).map(m => m.name).join(', ');
      whatToAdd.push({
        type: 'skills',
        title: `Consider Role-Relevant Skills: ${topMissing}`,
        detail: `These competencies are frequently expected for ${role.name}. Add them ONLY if you have built projects with them or plan to learn them.`
      });
    }

    if (!education[0]?.coursework) {
      whatToAdd.push({
        type: 'coursework',
        title: 'Add Relevant Academic Coursework',
        detail: 'List 3–4 core engineering courses (e.g. Operating Systems, Computer Networks, Database Architecture) to reinforce foundational mastery.'
      });
    }

    // Check What to Improve
    if (needsEvidence.length > 0) {
      const skillsNeedingEvidence = needsEvidence.map(n => n.name).join(', ');
      whatToImprove.push({
        type: 'unsubstantiated_skills',
        title: `Skills Mentioned Without Project Evidence: ${skillsNeedingEvidence}`,
        detail: `You listed ${skillsNeedingEvidence} in your skills section, but none of your projects describe how you applied them. Mention them in a project bullet.`
      });
    }

    // Inspect project bullets for passive verbs
    projects.forEach((pr, pIdx) => {
      (pr.bullets || []).forEach((b, bIdx) => {
        const bLower = b.toLowerCase().trim();
        const foundPassive = passiveWords.find(pw => bLower.startsWith(pw));
        if (foundPassive) {
          whatToImprove.push({
            type: 'weak_bullet',
            title: `Passive Phrasing in Project "${pr.title}"`,
            detail: `Bullet begins with "${foundPassive}". Start directly with an active engineering verb (e.g. "Engineered", "Implemented", "Architected").`
          });

          // Generate a suggested concrete rewrite
          const cleanedText = b.replace(new RegExp(`^${foundPassive}\\s*`, 'i'), '').trim();
          const suggestedVerb = 'Engineered';
          const rewrittenBullet = `${suggestedVerb} ${cleanedText.charAt(0).toLowerCase() + cleanedText.slice(1)}`;

          suggestions.push({
            id: `sug_proj_${pIdx}_b_${bIdx}`,
            type: 'bullet',
            targetProjectIdx: pIdx,
            targetBulletIdx: bIdx,
            title: `Strengthen Bullet in "${pr.title}"`,
            currentText: b,
            suggestedText: rewrittenBullet,
            reason: `Replaces passive "${foundPassive}" with high-impact engineering action verb "${suggestedVerb}".`
          });
        }
      });
    });

    // Suggest improved professional summary tailored to target role and actual profile
    if (summary) {
      const userBranch = (profile.branch_id || profile.branch || 'cse').toUpperCase();
      const sem = (profile.semester_id || 'sem_5').replace('sem_', '');
      const userSkillsPreview = skillsList.slice(0, 3).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
      
      const suggestedSummary = `Engineering student (${userBranch}, Sem ${sem}) focused on ${role.name} competencies including ${userSkillsPreview || 'core systems'}. Proven hands-on capstone engineering in distributed logic, algorithmic problem-solving, and reliable software design.`;

      suggestions.push({
        id: 'sug_summary_rewrite',
        type: 'summary',
        title: `Tailor Summary for ${role.name}`,
        currentText: summary,
        suggestedText: suggestedSummary,
        reason: `Explicitly aligns your technical background with ${role.name} benchmarks using your authentic academic standing and existing skills.`
      });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. "Skills to Strengthen for This Role" (Connected to Skills Matrix & LearnHub)
    // ──────────────────────────────────────────────────────────────────────────
    const skillsToStrengthen = [];

    // Add missing skills
    missingFromResume.slice(0, 4).forEach(sk => {
      skillsToStrengthen.push({
        name: sk.name,
        status: 'Missing from Resume',
        whyItMatters: `Core standard requirement for ${role.name} in high-scale industry environments.`,
        suggestedProficiency: 'Intermediate / Applied',
        actionHref: '#/learning',
        actionLabel: 'Study in LearnHub →'
      });
    });

    // Add skills needing stronger evidence
    needsEvidence.slice(0, 3).forEach(sk => {
      skillsToStrengthen.push({
        name: sk.name,
        status: 'Needs Project Demonstration',
        whyItMatters: `Present in your skills list, but recruiters require demonstrable proof in capstone code.`,
        suggestedProficiency: 'Demonstrated in Code',
        actionHref: '#/projects',
        actionLabel: 'Build Proof Project →'
      });
    });

    return {
      success: true,
      targetRole: role,
      strengthScore: totalStrengthScore,
      scoreBreakdown: scores,
      scoreExplanation: 'This empirical score reflects content completeness, target-role keyword alignment, and verified project evidence. It does not predict hiring results.',
      skillFit: {
        alreadyRepresented,
        needsEvidence,
        missingFromResume
      },
      skillsToStrengthen,
      whatToAdd,
      whatToImprove,
      suggestions,
      recommendedNextAction: role.recommended_projects,
      analyzedAt: new Date().toISOString()
    };
  }

  /**
   * Applies an AI Coach suggestion cleanly to the resume data model without silent overwrite
   */
  static applyCoachSuggestion(resumeData, suggestion) {
    if (!resumeData || !suggestion) return resumeData;
    const cloned = JSON.parse(JSON.stringify(resumeData));

    if (suggestion.type === 'summary') {
      cloned.summary = suggestion.suggestedText;
    } else if (suggestion.type === 'bullet') {
      const pIdx = suggestion.targetProjectIdx;
      const bIdx = suggestion.targetBulletIdx;
      if (cloned.projects && cloned.projects[pIdx] && cloned.projects[pIdx].bullets) {
        cloned.projects[pIdx].bullets[bIdx] = suggestion.suggestedText;
      }
    }

    cloned.updated_at = new Date().toISOString();
    return cloned;
  }
}
