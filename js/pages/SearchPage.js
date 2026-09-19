/**
 * TECHPATH — GLOBAL TECHNICAL SEARCH
 * Full-text multi-store search across subjects, topics, 3D models, skills, projects, exams, and career roles
 */
import { dbStore } from '../db/store.js';

export class SearchPage {
  static async render(container, initialQuery = '') {
    const searchVal = initialQuery || new URLSearchParams(window.location.hash.split('?')[1]).get('q') || '';

    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1100px;">
        <!-- Header -->
        <div>
          <div class="telemetry-chip" style="margin-bottom:0.5rem">
            <span class="pulse-beacon"></span> INDEXED KNOWLEDGE RETRIEVAL
          </div>
          <h1 class="display-lg">Omni-Search Engine</h1>
          <p style="color:var(--tp-text-dark-secondary)">Instant semantic and keyword search across curriculum subjects, 3D hardware models, capstones, and skills.</p>
        </div>

        <!-- Search Input Bar -->
        <div class="tp-card" style="padding:1rem 1.25rem;">
          <div style="position:relative;display:flex;align-items:center;">
            <span style="position:absolute;left:1rem;font-size:1.2rem;color:var(--tp-text-dark-muted)">🔍</span>
            <input type="search" id="global-search-input" class="tp-input" style="padding-left:3rem;font-size:1.05rem;" placeholder="Search by topic, subject code, skill (e.g. 'Operating Systems', 'Pipelining', 'C++', 'GATE')..." value="${searchVal}" autofocus />
          </div>

          <div style="display:flex;gap:0.5rem;margin-top:1rem;overflow-x:auto;padding-bottom:0.25rem;">
            ${[
              { id: 'all', label: 'All Results' },
              { id: 'classes', label: '🎓 Classes' },
              { id: 'exams', label: '🎯 Exams' },
              { id: 'pyqs', label: '📜 PYQs' },
              { id: 'practice', label: '⚡ Practice' },
              { id: 'interview', label: '🎤 Interview' },
              { id: 'subjects', label: '📖 Subjects' },
              { id: 'topics', label: '📑 Topics' },
              { id: 'projects', label: '🛠️ Projects' },
              { id: 'skills', label: '⚡ Skills' },
              { id: 'models', label: '🧊 3D Models' },
              { id: 'legal', label: '📜 Terms & Legal' }
            ].map(f => `
              <button class="tp-btn tp-btn-secondary tp-btn-sm search-filter-btn" data-filter="${f.id}">
                ${f.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Results Container -->
        <div id="search-results-output">
          <div class="tp-card tp-empty-state">
            <div class="tp-empty-icon">🔍</div>
            <h3 class="tp-empty-title">${searchVal ? 'Searching...' : 'Enter a search term above'}</h3>
            <p class="tp-empty-desc">Search through hundreds of engineering subjects, 3D interactive models, and industry skills.</p>
          </div>
        </div>

      </div>
    `;

    const input = container.querySelector('#global-search-input');
    const output = container.querySelector('#search-results-output');
    let activeFilter = 'all';

    const performSearch = async (query) => {
      const q = query.toLowerCase().trim();
      if (!q) {
        output.innerHTML = `
          <div class="tp-card tp-empty-state">
            <div class="tp-empty-icon">🔍</div>
            <h3 class="tp-empty-title">Enter a search term above</h3>
            <p class="tp-empty-desc">Search through hundreds of engineering subjects, 3D interactive models, and industry skills.</p>
          </div>
        `;
        return;
      }

      // Fetch from stores in parallel
      const [subjects, topics, projects, skills, models, exams, pyqPapers, practiceQs, interviewQs, classesList] = await Promise.all([
        dbStore.getAll('subjects'),
        dbStore.getAll('topics'),
        dbStore.getAll('projects'),
        dbStore.getAll('skills'),
        dbStore.getAll('three_d_models'),
        dbStore.getAll('exams'),
        dbStore.getAll('exam_papers'),
        dbStore.getAll('practice_questions'),
        dbStore.getAll('interview_question_bank'),
        dbStore.getAll('classes')
      ]);

      const results = [];

      // Classes
      (classesList || []).forEach(cls => {
        const isPublished = cls.status === 'PUBLISHED' || cls.status === 'active';
        if (!isPublished) return;
        if (cls.title?.toLowerCase().includes(q) ||
            cls.subject?.toLowerCase().includes(q) ||
            cls.topic?.toLowerCase().includes(q) ||
            cls.teacher_name?.toLowerCase().includes(q) ||
            cls.branch_id?.toLowerCase().includes(q) ||
            cls.specialization?.toLowerCase().includes(q) ||
            cls.career_relevance?.toLowerCase().includes(q)) {
          results.push({
            type: 'classes',
            badge: 'CLASS',
            badgeColor: 'var(--tp-primary)',
            title: cls.title,
            desc: `${(cls.branch_id || 'cse').toUpperCase()} · Sem ${(cls.semester_id || 'sem_1').replace('sem_', '')} · ${cls.subject} (${cls.topic}) · Teacher: ${cls.teacher_name}`,
            link: `#/classes/${cls.id}`,
            action: 'View Masterclass'
          });
        }
      });

      // Exams
      exams.forEach(ex => {
        if (ex.title?.toLowerCase().includes(q) || ex.code?.toLowerCase().includes(q) || ex.syllabus_summary?.toLowerCase().includes(q)) {
          results.push({
            type: 'exams',
            badge: 'EXAM',
            badgeColor: 'var(--tp-accent)',
            title: `${ex.code || ''}: ${ex.title}`,
            desc: ex.syllabus_summary || ex.eligibility_criteria || '',
            link: `#/exams/${ex.id}`,
            action: 'View Exam Dossier'
          });
        }
      });

      // PYQs
      pyqPapers.forEach(pyq => {
        if (pyq.title?.toLowerCase().includes(q) || pyq.subject?.toLowerCase().includes(q) || String(pyq.year).includes(q)) {
          results.push({
            type: 'pyqs',
            badge: 'PYQ PAPER',
            badgeColor: '#38bdf8',
            title: `${pyq.title} (${pyq.year})`,
            desc: `${pyq.subject} • ${pyq.total_questions} Questions • Official & Inspired Drills`,
            link: `#/exams/pyqs`,
            action: 'Attempt Paper'
          });
        }
      });

      // Practice Questions
      practiceQs.forEach(pq => {
        if (pq.question?.toLowerCase().includes(q) || pq.topic?.toLowerCase().includes(q) || pq.subject?.toLowerCase().includes(q)) {
          results.push({
            type: 'practice',
            badge: 'PRACTICE',
            badgeColor: 'var(--tp-success)',
            title: pq.question,
            desc: `${pq.subject || 'Engineering'} • Topic: ${pq.topic || 'Concept'} (${(pq.difficulty || 'medium').toUpperCase()})`,
            link: `#/practice`,
            action: 'Practice Drill'
          });
        }
      });

      // Interview Questions
      interviewQs.forEach(iq => {
        if (iq.question?.toLowerCase().includes(q) || iq.related_skill?.toLowerCase().includes(q) || iq.preparation_topic?.toLowerCase().includes(q) || iq.role?.toLowerCase().includes(q)) {
          results.push({
            type: 'interview',
            badge: 'INTERVIEW',
            badgeColor: 'var(--tp-primary)',
            title: iq.question,
            desc: `Role: ${iq.role} • Skill: ${iq.related_skill} • Category: ${iq.category}`,
            link: `#/interview/prep`,
            action: 'Study Answer'
          });
        }
      });

      // Subjects
      subjects.forEach(s => {
        if (s.title?.toLowerCase().includes(q) || s.code?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)) {
          results.push({
            type: 'subjects',
            badge: 'SUBJECT',
            badgeColor: 'var(--tp-primary)',
            title: `${s.code || ''}: ${s.title}`,
            desc: s.description || '',
            link: `#/learning?subject=${s.id}`,
            action: 'Study Subject'
          });
        }
      });

      // Topics
      topics.forEach(t => {
        if (t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)) {
          results.push({
            type: 'topics',
            badge: 'TOPIC',
            badgeColor: 'var(--tp-info)',
            title: t.title,
            desc: t.description || '',
            link: `#/learning`,
            action: 'View Topic'
          });
        }
      });

      // Projects
      projects.forEach(p => {
        if (p.title?.toLowerCase().includes(q) || p.problem_statement?.toLowerCase().includes(q) || p.technologies?.some(tech => tech.toLowerCase().includes(q))) {
          results.push({
            type: 'projects',
            badge: 'PROJECT',
            badgeColor: 'var(--tp-warning)',
            title: p.title,
            desc: p.problem_statement || p.objective || '',
            link: `#/projects`,
            action: 'View Architecture'
          });
        }
      });

      // Skills
      skills.forEach(sk => {
        if (sk.name?.toLowerCase().includes(q) || sk.category?.toLowerCase().includes(q)) {
          results.push({
            type: 'skills',
            badge: 'SKILL',
            badgeColor: 'var(--tp-success)',
            title: sk.name,
            desc: `Category: ${sk.category || 'Core'} · Demand: High`,
            link: `#/skills`,
            action: 'Assess Skill'
          });
        }
      });

      // 3D Models
      models.forEach(m => {
        if (m.title?.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q)) {
          results.push({
            type: 'models',
            badge: '3D LAB',
            badgeColor: '#a855f7',
            title: m.title,
            desc: m.description || '',
            link: `#/3d`,
            action: 'Inspect 3D Hardware'
          });
        }
      });

      // Exams
      exams.forEach(e => {
        if (e.name?.toLowerCase().includes(q) || e.title?.toLowerCase().includes(q)) {
          results.push({
            type: 'exams',
            badge: 'EXAM',
            badgeColor: '#ec4899',
            title: e.name || e.title,
            desc: e.description || 'National / University Entrance & Placement Test',
            link: `#/exams`,
            action: 'View Syllabus'
          });
        }
      });

      // Terms of Use & Legal Governance (24 Sections)
      const termsSections = [
        { num: 1, id: 'section-1-introduction', title: 'Terms of Use — Introduction', keywords: 'terms, terms of use, terms of service, agreement, legal, introduction' },
        { num: 2, id: 'section-2-eligibility', title: 'Terms of Use — Eligibility', keywords: 'eligibility, age, enrollment, students, minimum age' },
        { num: 3, id: 'section-3-account-responsibilities', title: 'Terms of Use — Account Responsibilities', keywords: 'account, credentials, password, scraping, security' },
        { num: 4, id: 'section-4-acceptable-use', title: 'Terms of Use — Acceptable Use', keywords: 'acceptable use, prohibited conduct, ddos, vulnerability, probing, bot' },
        { num: 5, id: 'section-5-learning-content', title: 'Terms of Use — Learning Content', keywords: 'curriculum, syllabi, learning content, accreditation, aicte, abet' },
        { num: 6, id: 'section-6-ai-features', title: 'Terms of Use — AI Features', keywords: 'ai features, copilot, doubt solver, machine learning, artificial intelligence' },
        { num: 7, id: 'section-7-ai-disclaimer', title: 'Terms of Use — AI Disclaimer', keywords: 'ai disclaimer, disclaimer, algorithmic transparency, generative ai, academic verification, non-definitive' },
        { num: 8, id: 'section-8-educational-disclaimer', title: 'Terms of Use — Educational Disclaimer', keywords: 'educational disclaimer, placement guarantee, assessment, diagnostic projections' },
        { num: 9, id: 'section-9-user-generated-content', title: 'Terms of Use — User-Generated Content', keywords: 'user content, student notes, capstones, intellectual property' },
        { num: 10, id: 'section-10-upload-policy', title: 'Terms of Use — Upload Policy', keywords: 'upload policy, file upload, pdf upload, sandboxing, prohibited files, malware' },
        { num: 11, id: 'section-11-copyright-intellectual-property', title: 'Terms of Use — Copyright & Intellectual Property', keywords: 'copyright, intellectual property, dmca, open source, three.js, pdf.js' },
        { num: 12, id: 'section-12-third-party-content', title: 'Terms of Use — Third-Party Content', keywords: 'third party, external links, academic datasets' },
        { num: 13, id: 'section-13-videos-and-external-resources', title: 'Terms of Use — Videos and External Resources', keywords: 'videos, youtube, external resources, learnhub, nptel' },
        { num: 14, id: 'section-14-code-execution-and-technical-features', title: 'Terms of Use — Code Execution & Technical Features', keywords: 'code execution, compiler, sandbox, runtime' },
        { num: 15, id: 'section-15-techpath-classes', title: 'Terms of Use — TechPath Classes', keywords: 'classes, zero fee, pricing, instructors, classrooms' },
        { num: 16, id: 'section-16-payments-and-refunds', title: 'Terms of Use — Payments & Refunds', keywords: 'payments, refunds, pricing, billing, cancellation' },
        { num: 17, id: 'section-17-data-retention', title: 'Terms of Use — Data Retention', keywords: 'data retention, retention policy, purge, telemetry, localstorage' },
        { num: 18, id: 'section-18-privacy-and-data', title: 'Terms of Use — Privacy & Data', keywords: 'privacy, gdpr, ferpa, student data, personal data' },
        { num: 19, id: 'section-19-account-deletion', title: 'Terms of Use — Account Deletion', keywords: 'account deletion, erasure, right to be forgotten, purge' },
        { num: 20, id: 'section-20-service-availability', title: 'Terms of Use — Service Availability', keywords: 'service availability, uptime, maintenance, outages' },
        { num: 21, id: 'section-21-limitations', title: 'Terms of Use — Limitations of Liability', keywords: 'limitations, liability, warranty, as is' },
        { num: 22, id: 'section-22-suspension-and-termination', title: 'Terms of Use — Suspension & Termination', keywords: 'suspension, termination, ban, account revocation' },
        { num: 23, id: 'section-23-changes-to-these-terms', title: 'Terms of Use — Changes to These Terms', keywords: 'changes, amendment, revision, notice' },
        { num: 24, id: 'section-24-contact-information', title: 'Terms of Use — Contact Information', keywords: 'contact, legal, copyright, governance, email' }
      ];

      termsSections.forEach(ts => {
        if (ts.title.toLowerCase().includes(q) || ts.keywords.toLowerCase().includes(q) || 'terms of use'.includes(q)) {
          results.push({
            type: 'legal',
            badge: 'TERMS OF USE',
            badgeColor: 'var(--tp-primary)',
            title: ts.title,
            desc: `Section ${ts.num} of the TechPath Statutory Terms of Use and Governance Agreement.`,
            link: `#/terms#${ts.id}`,
            action: 'Review Section'
          });
        }
      });

      const filtered = activeFilter === 'all' ? results : results.filter(r => r.type === activeFilter);

      if (filtered.length === 0) {
        output.innerHTML = `
          <div class="tp-card tp-empty-state">
            <div class="tp-empty-icon">🔎</div>
            <h3 class="tp-empty-title">No results found for "${query}"</h3>
            <p class="tp-empty-desc">Check your spelling or try broader terms like "Data", "Circuit", "Algorithm", or "GATE".</p>
          </div>
        `;
        return;
      }

      output.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
          <span style="font-size:0.9rem;color:var(--tp-text-dark-secondary)">Found <strong>${filtered.length}</strong> matching items</span>
          <span class="mono-chip" style="color:var(--tp-success)">MATCHES READY</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:1rem;">
          ${filtered.map(r => `
            <a href="${r.link}" class="tp-card" style="display:flex;justify-content:space-between;align-items:center;text-decoration:none;gap:1.5rem;transition:all 0.2s ease">
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem">
                  <span class="mono-chip" style="color:${r.badgeColor}">${r.badge}</span>
                </div>
                <h3 style="font-size:1.1rem;font-weight:700;margin:0 0 0.35rem 0;color:var(--tp-text-light)">${r.title}</h3>
                <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin:0;line-height:1.4">${r.desc}</p>
              </div>
              <div>
                <span class="tp-btn tp-btn-secondary tp-btn-sm" style="white-space:nowrap">${r.action} →</span>
              </div>
            </a>
          `).join('')}
        </div>
      `;
    };

    input?.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });

    container.querySelectorAll('.search-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        container.querySelectorAll('.search-filter-btn').forEach(b => b.classList.replace('tp-btn-primary', 'tp-btn-secondary'));
        btn.classList.replace('tp-btn-secondary', 'tp-btn-primary');
        activeFilter = btn.dataset.filter;
        performSearch(input.value);
      });
    });

    if (searchVal) {
      performSearch(searchVal);
    }
  }
}
