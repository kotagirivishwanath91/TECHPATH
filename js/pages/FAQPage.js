/**
 * TECHPATH — FREQUENTLY ASKED QUESTIONS (FAQ)
 * Categorized accordion answers covering academic isolation, 3D labs, resume ATS analysis, and GATE prep
 */
export class FAQPage {
  static categories = [
    {
      id: 'general',
      title: 'Platform Architecture & Academics',
      faqs: [
        {
          q: 'What is TechPath and how does it bridge classroom to career?',
          a: 'TechPath is a unified engineering intelligence platform that maps canonical university curricula (CSE, ECE, EEE, MECH, Civil, AI/ML) directly to verifiable career outcomes, capstone projects, ATS-optimized resumes, and technical mock interviews.'
        },
        {
          q: 'What is the Branch Isolation Rule in TechPath?',
          a: 'TechPath strictly enforces branch isolation. If you are enrolled in Mechanical Engineering, your curriculum feeds, video streams, and quizzes will never silently fall back to Computer Science or unrelated branch materials. If content for a semester is undergoing accreditation, an honest notice is displayed rather than misleading mock data.'
        },
        {
          q: 'How does TechPath track my learning progress?',
          a: 'All lecture completions, topic notes, quiz attempts, and 3D component inspections are recorded with millisecond precision in local IndexedDB. This powers your streak engine, spaced repetition memory algorithms, and placement prediction index.'
        }
      ]
    },
    {
      id: 'threed',
      title: '3D Hardware & Simulation Lab',
      faqs: [
        {
          q: 'Do I need a dedicated GPU to run the 3D Hardware Lab?',
          a: 'No. TechPath renders optimized procedural WebGL shaders via Three.js that run smoothly at 60 FPS on integrated mobile and laptop chipsets. For accessibility or low-bandwidth environments, an interactive 2D schematic mode is also provided.'
        },
        {
          q: 'Can I inspect individual hardware components in 3D?',
          a: 'Yes. Every 3D model features component-level raycasting. Clicking any component (e.g. Cache Controller, ALU, Stator Core, Nanosheet Gate) reveals its formal What, Why, How specifications, mathematical I/O equations, and related interview questions.'
        }
      ]
    },
    {
      id: 'career',
      title: 'Resume Engine & Mock Interviews',
      faqs: [
        {
          q: 'How does the Resume ATS Analyzer work?',
          a: 'Our resume engine parses uploaded PDF or raw text, extracts engineering skills, maps them to canonical taxonomy IDs, and cross-references them against real job descriptions from Tier-1 systems engineering roles to calculate an honest ATS match score.'
        },
        {
          q: 'Are the Mock Interview questions personalized to my resume?',
          a: 'Yes. The interview engine analyzes the projects and skills listed in your profile/resume and generates targeted technical questions (e.g. architectural trade-offs, concurrency race conditions, failure recovery) accompanied by formal algorithmic evaluation.'
        }
      ]
    },
    {
      id: 'exams',
      title: 'GATE & Campus Placement Prep',
      faqs: [
        {
          q: 'Are the GATE mock tests timed according to national standards?',
          a: 'Yes. GATE mocks feature official 180-minute countdown timers, negative marking calculations (-0.33 for 1-mark and -0.66 for 2-mark MCQs), question review palettes, and post-exam weak topic diagnostics.'
        },
        {
          q: 'Can I use TechPath completely offline?',
          a: 'Yes. TechPath is an offline-capable Progressive Web Application (PWA). All seed curricula, quiz questions, and study planners are stored in local IndexedDB and service worker caches.'
        }
      ]
    }
  ];

  static async render(container) {
    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:950px;">
        <!-- Header -->
        <div>
          <div class="telemetry-chip" style="margin-bottom:0.5rem">
            <span class="pulse-beacon"></span> KNOWLEDGE BASE & RESOLUTIONS
          </div>
          <h1 class="display-lg">Frequently Asked Questions</h1>
          <p style="color:var(--tp-text-dark-secondary)">Clear, authoritative answers regarding academic isolation, 3D simulations, mock interviews, and platform privacy.</p>
        </div>

        <!-- Search FAQ input -->
        <div class="tp-card" style="padding:1rem 1.25rem">
          <input type="search" id="faq-search" class="tp-input" placeholder="Search FAQ topics (e.g. 'isolation', '3D', 'GATE', 'resume')..." />
        </div>

        <!-- FAQ Categories -->
        <div id="faq-list-container" style="display:flex;flex-direction:column;gap:2rem">
          ${this.categories.map(cat => `
            <div class="faq-category-block">
              <h2 class="headline-md" style="margin-bottom:1rem;color:var(--tp-primary)">${cat.title}</h2>
              <div style="display:flex;flex-direction:column;gap:0.75rem">
                ${cat.faqs.map((f, idx) => `
                  <div class="tp-card faq-card" style="padding:1.25rem;cursor:pointer;transition:border-color 0.2s">
                    <div style="display:flex;justify-content:space-between;align-items:center">
                      <h3 style="font-size:1.05rem;font-weight:600;margin:0">${f.q}</h3>
                      <span class="faq-icon" style="font-size:1.2rem;color:var(--tp-text-dark-muted);transition:transform 0.2s">+</span>
                    </div>
                    <div class="faq-answer" style="display:none;margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--tp-border-dark);color:var(--tp-text-dark-secondary);font-size:0.9rem;line-height:1.6">
                      ${f.a}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Help box -->
        <div class="tp-card tp-card-glass" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
          <div>
            <h3 class="headline-sm" style="margin:0 0 0.25rem 0">Didn't find your answer?</h3>
            <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin:0">Submit a support ticket or speak directly with our engineering academic board.</p>
          </div>
          <a href="#/support" class="tp-btn tp-btn-primary">Contact Support</a>
        </div>

      </div>
    `;

    // Accordion toggle
    container.querySelectorAll('.faq-card').forEach(card => {
      card.addEventListener('click', () => {
        const ans = card.querySelector('.faq-answer');
        const icon = card.querySelector('.faq-icon');
        const isHidden = ans.style.display === 'none';
        ans.style.display = isHidden ? 'block' : 'none';
        icon.textContent = isHidden ? '−' : '+';
        card.style.borderColor = isHidden ? 'var(--tp-primary)' : 'var(--tp-border-dark)';
      });
    });

    // Search filter
    const searchInput = container.querySelector('#faq-search');
    searchInput?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      container.querySelectorAll('.faq-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'block' : 'none';
      });
    });
  }
}
