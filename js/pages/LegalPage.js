/**
 * TECHPATH — LEGAL, GOVERNANCE & TERMS OF USE
 * Canonical Terms of Use consolidating all 24 statutory sections
 * including AI Disclaimer, Educational Disclaimer, Upload Policy,
 * Copyright Policy, and Data Retention into one comprehensive document.
 */
import { I18nEngine } from '../services/I18nEngine.js';

export class LegalPage {
  static activeDoc = 'terms';

  static docs = [
    {
      id: 'terms',
      title: 'Terms of Use',
      subtitle: 'Official Terms of Use & Academic Governance Agreement',
      version: 'v4.0 — Consolidated March 2026',
      sections: [
        {
          id: 'section-1-introduction',
          num: 1,
          title: 'Introduction',
          content: `
            <p>These Terms of Use ("Terms") govern your access to and use of the TechPath educational platform, websites, mobile interfaces, APIs, and associated engineering curriculum tools ("Service"), provided by the TechPath Platform Governance Board ("TechPath", "we", "us", or "our").</p>
            <p>By registering, accessing, browsing, or utilizing any component of TechPath, you unconditionally agree to comply with and be legally bound by these Terms. If you do not consent to all provisions herein, you must immediately discontinue use of the platform.</p>
          `
        },
        {
          id: 'section-2-eligibility',
          num: 2,
          title: 'Eligibility',
          content: `
            <p>The Service is designed for undergraduate and graduate engineering students, academic faculty, researchers, and technical mentors. You must be at least 16 years of age (or the minimum legal age of digital consent in your jurisdiction) to establish an account.</p>
            <p>By enrolling, you warrant that all information submitted during registration is accurate, current, and reflects your authentic academic identity.</p>
          `
        },
        {
          id: 'section-3-account-responsibilities',
          num: 3,
          title: 'Account Responsibilities',
          content: `
            <p>Users are solely responsible for maintaining the confidentiality of their authentication credentials, passwords, and cryptographic session tokens. You agree not to disclose, share, transfer, or sell your account credentials to any other individual or entity.</p>
            <p>Any action, submission, assessment attempt, or class booking initiated through your authenticated identity is legally attributed to you. Automated scraping, unauthorized credential harvesting, reverse-engineering, or bulk data extraction is strictly prohibited and subject to immediate account termination.</p>
          `
        },
        {
          id: 'section-4-acceptable-use',
          num: 4,
          title: 'Acceptable Use',
          content: `
            <p>TechPath is an authentic learning community. You agree to utilize the platform strictly for legitimate educational, academic research, and career preparation purposes.</p>
            <p>You agree NOT to: (a) probe, scan, or test the vulnerability of platform endpoints, firewalls, or databases; (b) launch Denial of Service (DoS/DDoS) attacks, flood API gateways, or cause resource exhaustion; (c) reverse-engineer, decompile, or disassemble proprietary WebGL shaders, client-side bundles, or evaluation rubrics; (d) deploy automated scraping bots, crawlers, or headless extractors; (e) harass, defame, impersonate, or abuse students, teachers, or staff; or (f) violate academic honor codes by submitting platform materials as uncredited original work during formal institutional examinations.</p>
          `
        },
        {
          id: 'section-5-learning-content',
          num: 5,
          title: 'Learning Content',
          content: `
            <p>TechPath provides structured engineering curriculum telemetry across 33 engineering departments, organized hierarchically into branches, specializations, semesters, subjects, and topics. Syllabi, lecture notes, formula guides, 3D interactive laboratories, and practice problem sets are curated for pedagogical clarity.</p>
            <p>While curriculum mappings adhere closely to national and international accreditation benchmarks (including AICTE, ABET, and IEEE educational standards), TechPath makes no warranty that curriculum structures will identically match the specific syllabus or grading schema of every individual university.</p>
          `
        },
        {
          id: 'section-6-ai-features',
          num: 6,
          title: 'AI Features',
          content: `
            <p>TechPath features AI copilot assistants, dynamic capstone project generators, interactive doubt solvers, automated interview rubrics, and resume evaluation systems. These generative systems operate deterministically within verified engineering principles.</p>
            <p>All AI capabilities are designed as cognitive acceleration aids to stimulate critical engineering problem-solving, identify curriculum gaps, and assist in architectural planning.</p>
          `
        },
        {
          id: 'section-7-ai-disclaimer',
          num: 7,
          title: 'AI Disclaimer',
          content: `
            <div class="tp-legal-alert" style="background:rgba(225,29,72,0.08);border-left:4px solid var(--tp-primary);padding:1rem;margin:0.75rem 0;border-radius:0 var(--radius-sm) var(--radius-sm) 0;">
              <strong style="color:var(--tp-primary);">⚠️ Algorithmic Transparency & Academic Verification Notice</strong>
              <p style="margin:0.5rem 0 0 0;">TechPath AI assistants, dynamic capstone project generation, resume scoring algorithms, and automated mock interview assessments are powered by generative machine learning models. All generative systems operate as educational cognitive aids and are not guaranteed to be error-free.</p>
            </div>
            <p><strong>Mandatory Independent Derivation:</strong> AI-generated engineering answers, mathematical derivations, circuit schematics, and code snippets are cognitive acceleration aids. Students are strictly expected and required to verify mathematical derivations against standard academic textbooks and formal university syllabi before relying on them for examinations, lab implementations, or physical engineering prototypes.</p>
            <p><strong>No Professional Certification:</strong> AI evaluations do not constitute certified professional engineering certifications, structural safety approvals, or medical device clearances.</p>
          `
        },
        {
          id: 'section-8-educational-disclaimer',
          num: 8,
          title: 'Educational Disclaimer',
          content: `
            <p><strong>Diagnostic Projections, Not Guarantees:</strong> TechPath and its academic partners provide technical materials, syllabus roadmaps, and simulated assessments "as is". While syllabus mappings adhere to national accreditation standards, placement probabilities, skill readiness percentages, GATE mock percentiles, and assessment percentiles represent empirical diagnostic projections based on student telemetry—they do NOT constitute a contractual guarantee or legal promise of employment, internship selection, or university admission.</p>
            <p><strong>Independent Educational Entity:</strong> TechPath is an independent educational technology platform and is not officially affiliated with or endorsed by any specific examination board, testing agency, or university unless explicitly specified in a formal institutional partnership agreement.</p>
          `
        },
        {
          id: 'section-9-user-generated-content',
          num: 9,
          title: 'User-Generated Content',
          content: `
            <p>Users may author, submit, or transmit technical notes, project repositories, capstone documentation, study group discussions, and peer messages ("User Content"). You retain full copyright ownership of your original User Content.</p>
            <p>By posting User Content to collaborative or public areas of TechPath (such as Community Resources or Study Groups), you grant TechPath a worldwide, non-exclusive, royalty-free license to store, format, display, and distribute that content exclusively to facilitate peer learning and academic collaboration.</p>
          `
        },
        {
          id: 'section-10-upload-policy',
          num: 10,
          title: 'Upload Policy',
          content: `
            <div class="tp-legal-alert" style="background:rgba(56,189,248,0.08);border-left:4px solid #38bdf8;padding:1rem;margin:0.75rem 0;border-radius:0 var(--radius-sm) var(--radius-sm) 0;">
              <strong style="color:#38bdf8;">📁 Document Sandboxing & Acceptable File Formats</strong>
              <p style="margin:0.5rem 0 0 0;">Uploaded PDF documents and technical diagrams are processed inside client-side Web Workers using isolated memory partitions, preventing unauthorized document exfiltration.</p>
            </div>
            <p><strong>Permitted Formats:</strong> You may upload academic resumes, lab notes, formula sheets, and project documentation in PDF (.pdf), PNG (.png), JPEG (.jpg, .jpeg), Plain Text (.txt), and JSON (.json) formats.</p>
            <p><strong>Prohibited Material:</strong> You must not upload: (a) executable binaries, scripts, or files containing viruses, worms, malware, or ransomware; (b) copyrighted textbooks, commercial question banks, or proprietary test papers without statutory authorization; or (c) confidential, defamatory, or unlawful materials. TechPath reserves the right to quarantine and remove non-compliant files immediately.</p>
          `
        },
        {
          id: 'section-11-copyright-intellectual-property',
          num: 11,
          title: 'Copyright & Intellectual Property',
          content: `
            <p><strong>Platform Intellectual Property:</strong> All TechPath trademarks, visual interfaces, 3D WebGL scenes, interactive simulators, curriculum hierarchies, software architectures, logos, and proprietary algorithms are the exclusive property of TechPath and its licensors, protected under international copyright, trademark, and trade secret laws.</p>
            <p><strong>Open Source Attributions:</strong> TechPath is constructed utilizing open-source frameworks under their respective licenses: Three.js (MIT License, Copyright © 2010-2026 Three.js Authors), PDF.js (Apache License 2.0, Copyright © Mozilla Foundation), and Google Fonts (SIL Open Font License).</p>
            <p><strong>Student Capstone Ownership:</strong> Students retain 100% intellectual property ownership of the custom code, hardware schematics, and capstone implementations they engineer while using TechPath scaffolds.</p>
            <p><strong>DMCA & Statutory Notice:</strong> TechPath respects the intellectual property rights of academic authors. Curriculum materials are licensed or published under fair educational use. To report infringement, contact our designated copyright agent at <a href="mailto:copyright@techpath.edu" style="color:var(--tp-primary)">copyright@techpath.edu</a> with formal statutory notice.</p>
          `
        },
        {
          id: 'section-12-third-party-content',
          num: 12,
          title: 'Third-Party Content',
          content: `
            <p>TechPath may reference, link to, or display content from third-party educational repositories, academic datasets, and external development utilities. TechPath does not operate, control, or assume liability for the practices, security, or contents of third-party services.</p>
          `
        },
        {
          id: 'section-13-videos-and-external-resources',
          num: 13,
          title: 'Videos and External Resources',
          content: `
            <p>Video learning content in LearnHub utilizes the official YouTube IFrame Player API and compliant embed standards. TechPath does NOT download, rehost, modify, or monetize external video streams.</p>
            <p>All videos remain the property of their respective creators and educational institutions (e.g., MIT OpenCourseWare, NPTEL, 3Blue1Brown, freeCodeCamp). If a video becomes unavailable, TechPath displays an availability notice and recommends alternative open educational resources.</p>
          `
        },
        {
          id: 'section-14-code-execution-and-technical-features',
          num: 14,
          title: 'Code Execution and Technical Features',
          content: `
            <p>TechPath provides browser-based code compilation, algorithm drills, and 3D simulation sandboxes. All client-side code execution operates within strict browser security constraints.</p>
            <p>Users must not exploit execution environments for network reconnaissance, denial of service, cryptocurrency mining, or accessing unauthorized hosts. TechPath reserves the right to terminate any process that violates resource quotas.</p>
          `
        },
        {
          id: 'section-15-techpath-classes',
          num: 15,
          title: 'TechPath Classes',
          content: `
            <p>TechPath Classes connects verified engineering instructors with students. TechPath maintains a strict <strong>Zero Platform Fee</strong> policy for student learners, ensuring engineering curriculum access is free of platform surcharges.</p>
            <p>Instructors are independent educators responsible for their instructional conduct, live lecture delivery, and adherence to academic ethics.</p>
          `
        },
        {
          id: 'section-16-payments-and-refunds',
          num: 16,
          title: 'Payments and Refunds',
          content: `
            <p>Where third-party instructors offer optional premium workshops or mentorship cohorts: (a) course fees are clearly displayed in the class syllabus; (b) payments are processed securely via accredited payment gateways; and (c) refund requests submitted at least 24 hours prior to a batch start date are processed in full under our educator billing policy.</p>
          `
        },
        {
          id: 'section-17-data-retention',
          num: 17,
          title: 'Data Retention',
          content: `
            <div class="tp-legal-alert" style="background:rgba(168,85,247,0.08);border-left:4px solid #a855f7;padding:1rem;margin:0.75rem 0;border-radius:0 var(--radius-sm) var(--radius-sm) 0;">
              <strong style="color:#a855f7;">🗄️ Purposeful Educational Data Retention Policy</strong>
              <p style="margin:0.5rem 0 0 0;">TechPath retains student academic telemetry only for as long as your account remains active and necessary to support curriculum isolation and progress tracking.</p>
            </div>
            <p><strong>Client-Side Storage:</strong> User preferences, study bookmarks, and offline notes are preserved locally in browser IndexedDB and localStorage, which you can clear at any time.</p>
            <p><strong>Server-Side Telemetry Purge:</strong> Server-side telemetry records are maintained during active enrollment. Following an account deletion request or after 24 months of total account inactivity, personal telemetry is purged or permanently anonymized in accordance with our cryptographic destruction standards.</p>
          `
        },
        {
          id: 'section-18-privacy-and-data',
          num: 18,
          title: 'Privacy and Data',
          content: `
            <p>TechPath is committed to student data protection. We do NOT sell, rent, or trade your personal data, resumes, or academic telemetry to advertisers or data brokers.</p>
            <p>Our data handling aligns with GDPR, FERPA, and international student privacy statutes. For comprehensive information on data collection categories, encryption, and rights, refer to our <a href="#/legal/privacy" style="color:var(--tp-primary);text-decoration:underline;">Privacy Policy</a>.</p>
          `
        },
        {
          id: 'section-19-account-deletion',
          num: 19,
          title: 'Account Deletion',
          content: `
            <p>In accordance with GDPR Article 17 ("Right to Erasure"), you maintain the irrevocable right to request immediate personal data erasure and account destruction at any time.</p>
            <p>You can execute self-service account deletion via the <a href="#/security?action=delete" style="color:var(--tp-primary);text-decoration:underline;">Security Center</a> or submit a formal deletion request via the <a href="#/legal/deletion-request" style="color:var(--tp-primary);text-decoration:underline;">Data Deletion Request</a> portal. Deletion permanently purges personal profiles, resumes, and session telemetry.</p>
          `
        },
        {
          id: 'section-20-service-availability',
          num: 20,
          title: 'Service Availability',
          content: `
            <p>While we target continuous 24/7/365 availability, TechPath does not guarantee uninterrupted service. Routine maintenance, feature deployments, infrastructure updates, and unforeseen outages may occasionally affect availability.</p>
            <p>TechPath employs client-side caching to ensure core offline learning capabilities remain accessible during connectivity interruptions.</p>
          `
        },
        {
          id: 'section-21-limitations',
          num: 21,
          title: 'Limitations of Liability',
          content: `
            <p>TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, TECHPATH, ITS FOUNDERS, DIRECTORS, AFFILIATES, AND ACADEMIC PARTNERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, INTERNSHIP OPPORTUNITIES, EMPLOYMENT CLAIMS, OR ACADEMIC GRADING CONSEQUENCES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE PLATFORM.</p>
            <p>THE SERVICE IS PROVIDED STRICTLY ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.</p>
          `
        },
        {
          id: 'section-22-suspension-and-termination',
          num: 22,
          title: 'Suspension and Termination',
          content: `
            <p>TechPath reserves the right, in its sole discretion, to suspend, throttle, or terminate your account and access to the Service without prior notice if you violate these Terms, breach our Academic Honor Code, attempt cyberattacks, or disrupt the learning environment of other students.</p>
          `
        },
        {
          id: 'section-23-changes-to-these-terms',
          num: 23,
          title: 'Changes to These Terms',
          content: `
            <p>TechPath reserves the right to amend, update, or revise these Terms of Use at any time. When material modifications occur, we will update the version number and effective date at the top of this document, and notify registered users through an in-app notice or email alert at least 14 days before changes take effect.</p>
            <p>Continued use of TechPath following the effective date constitutes your affirmative consent to the revised Terms.</p>
          `
        },
        {
          id: 'section-24-contact-information',
          num: 24,
          title: 'Contact Information',
          content: `
            <p>For legal inquiries, copyright notices, compliance verification, or questions regarding these Terms of Use, please contact:</p>
            <ul style="list-style:none;padding-left:0;line-height:2;">
              <li><strong>Governance Board:</strong> TechPath Platform Legal & Academic Governance Board</li>
              <li><strong>General Inquiries:</strong> <a href="mailto:legal@techpath.edu" style="color:var(--tp-primary)">legal@techpath.edu</a></li>
              <li><strong>DMCA & Copyright Officer:</strong> <a href="mailto:copyright@techpath.edu" style="color:var(--tp-primary)">copyright@techpath.edu</a></li>
              <li><strong>Student Privacy & DPO:</strong> <a href="mailto:privacy@techpath.edu" style="color:var(--tp-primary)">privacy@techpath.edu</a></li>
              <li><strong>Student Help Center:</strong> <a href="#/contact" style="color:var(--tp-primary)">techpath.edu/contact</a></li>
            </ul>
          `
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'Student Privacy Rights & Data Protection Standard',
      version: 'v3.0 — March 2026',
      content: `
        <h3>1. Data We Collect</h3>
        <p>TechPath collects necessary account telemetry including your name, institutional email address, department branch, active semester, learning progression timestamps, quiz accuracies, and user-submitted resumes.</p>
        
        <h3>2. Local Storage & Client-Side Privacy</h3>
        <p>TechPath utilizes local client-side IndexedDB and web storage architectures for high-speed local processing. Your resumes and project telemetry remain strictly confidential and are never marketed, sold, or shared with third-party advertisers.</p>
        
        <h3>3. Data Retention & Erasure</h3>
        <p>In accordance with GDPR Article 17, you maintain the irrevocable right to request immediate personal data erasure and account destruction at any time via the Profile & Privacy Center or Data Deletion Request.</p>
      `
    },
    {
      id: 'cookies',
      title: 'Cookie Policy',
      subtitle: 'Platform Session & Cookie Preferences',
      version: 'v2.1 — February 2026',
      content: `
        <h3>1. Essential Platform Cookies</h3>
        <p>These cookies are strictly required to preserve user authentication state, cryptographic session tokens, and branch/semester context isolation across page refreshes.</p>

        <h3>2. Analytics & Performance Cookies (Optional)</h3>
        <p>Optional telemetry cookies capture study session durations and 3D WebGL render performance to assist our engineers in optimizing curriculum pacing. Non-essential cookies are disabled by default until explicit consent is granted.</p>
      `
    },
    {
      id: 'deletion-request',
      title: 'Data Deletion Request',
      subtitle: 'GDPR Article 17 Right to Erasure Execution',
      version: 'v1.0 — March 2026',
      content: `
        <h3>Execute Complete Data Erasure</h3>
        <p>Under GDPR, FERPA, and CCPA principles, you have the right to request the complete, permanent purge of your account, resumes, personal details, and study telemetry from TechPath systems.</p>
        <div style="margin:1.5rem 0;padding:1.5rem;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:var(--radius-md);">
          <h4 style="color:#ef4444;margin:0 0 0.5rem 0;">⚠️ Permanent & Irreversible Action</h4>
          <p style="font-size:0.9rem;color:var(--tp-text-dark-secondary);margin:0 0 1rem 0;">Deleting your account permanently destroys your academic dossier, verified skill matrix, saved resumes, and mock interview history. This cannot be undone.</p>
          <a href="#/security?action=delete" class="tp-btn tp-btn-danger" style="display:inline-block;padding:0.6rem 1.25rem;">
            Proceed to Account Deletion in Security Center →
          </a>
        </div>
      `
    }
  ];

  static async render(container, options = {}) {
    // Detect active document based on URL or options
    const hash = window.location.hash || '';
    const path = window.location.pathname || '';

    if (options.doc) {
      this.activeDoc = options.doc;
    } else if (path === '/terms' || hash.startsWith('#/terms') || hash.startsWith('#/legal/terms')) {
      this.activeDoc = 'terms';
    } else if (hash.startsWith('#/legal/privacy') || hash.startsWith('#/privacy')) {
      this.activeDoc = 'privacy';
    } else if (hash.startsWith('#/legal/cookies') || hash.startsWith('#/cookies') || path === '/cookies') {
      this.activeDoc = 'cookies';
    } else if (hash.startsWith('#/legal/deletion-request') || hash.startsWith('#/data-deletion') || path === '/data-deletion') {
      this.activeDoc = 'deletion-request';
    } else if (
      hash.includes('ai-disclaimer') ||
      hash.includes('disclaimer') ||
      hash.includes('copyright') ||
      hash.includes('upload-policy') ||
      hash.includes('retention')
    ) {
      // Legacy links redirect seamlessly to Terms of Use
      this.activeDoc = 'terms';
    }

    const active = this.docs.find(d => d.id === this.activeDoc) || this.docs[0];
    const isTerms = active.id === 'terms';
    const translatedTitle = isTerms ? (I18nEngine.t('terms_of_use') || 'Terms of Use') : active.title;

    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1180px;margin:0 auto;padding-bottom:3rem;">
        
        <!-- Header Section -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1.25rem;border-bottom:1px solid var(--tp-border-dark);padding-bottom:1.5rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom:0.6rem;background:rgba(225,29,72,0.1);border-color:rgba(225,29,72,0.3);color:#fda4af;">
              <span class="pulse-beacon" style="background:var(--tp-primary)"></span> OFFICIAL GOVERNANCE & LEGAL PORTAL
            </div>
            <h1 class="display-lg" style="margin:0 0 0.35rem 0;color:#fff;">${translatedTitle}</h1>
            <p style="color:var(--tp-text-dark-secondary);font-size:0.95rem;margin:0;">
              ${isTerms ? 'Comprehensive statutory terms of use, academic policies, AI disclosures, and upload governance for TechPath.' : (active.subtitle || '')}
            </p>
          </div>
          
          <div style="display:flex;gap:0.75rem;align-items:center;">
            <button id="print-legal-btn" class="tp-btn tp-btn-secondary" style="display:flex;align-items:center;gap:0.5rem;font-size:0.88rem;">
              <span>🖨️</span> Print / Save PDF
            </button>
            <a href="#/profile" class="tp-btn tp-btn-ghost" style="font-size:0.88rem;">
              👤 My Profile
            </a>
          </div>
        </div>

        <!-- Main Layout -->
        <div style="display:grid;grid-template-columns:300px 1fr;gap:2rem;align-items:start;">
          
          <!-- Sticky Left Navigator / Table of Contents -->
          <aside class="tp-card" style="padding:1.25rem;position:sticky;top:1rem;max-height:calc(100vh - 2rem);overflow-y:auto;display:flex;flex-direction:column;gap:1rem;">
            
            <!-- Quick Document Switcher -->
            <div style="border-bottom:1px solid var(--tp-border-dark);padding-bottom:0.85rem;">
              <span style="font-size:0.72rem;font-weight:700;color:var(--tp-text-dark-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:0.5rem;">
                Legal Frameworks
              </span>
              <div style="display:flex;flex-direction:column;gap:0.35rem;">
                ${this.docs.map(d => `
                  <button class="tp-btn ${this.activeDoc === d.id ? 'tp-btn-primary' : 'tp-btn-ghost'} tp-legal-nav-btn" data-doc="${d.id}" style="text-align:left;justify-content:flex-start;padding:0.5rem 0.75rem;font-size:0.85rem;border-radius:var(--radius-sm);width:100%;">
                    ${d.id === 'terms' ? '📜 ' + (I18nEngine.t('terms_of_use') || 'Terms of Use') : (d.id === 'privacy' ? '🛡️ Privacy Policy' : (d.id === 'cookies' ? '🍪 Cookie Policy' : '🗑️ Deletion Request'))}
                  </button>
                `).join('')}
              </div>
            </div>

            ${isTerms ? `
              <!-- Section Search Filter -->
              <div>
                <span style="font-size:0.72rem;font-weight:700;color:var(--tp-text-dark-muted);text-transform:uppercase;letter-spacing:1px;display:block;margin-bottom:0.5rem;">
                  Search Terms (24 Sections)
                </span>
                <input type="search" id="terms-toc-search" class="tp-input tp-input-sm" placeholder="Filter sections (e.g. AI, Upload, Refund)..." style="width:100%;font-size:0.8rem;" />
              </div>

              <!-- 24 Section Table of Contents -->
              <nav id="terms-toc-list" style="display:flex;flex-direction:column;gap:0.25rem;" aria-label="Table of Contents">
                ${active.sections.map(s => `
                  <a href="#${s.id}" class="tp-toc-link" data-sec-id="${s.id}" style="display:block;padding:0.4rem 0.6rem;font-size:0.8rem;color:var(--tp-text-dark-secondary);text-decoration:none;border-radius:4px;line-height:1.3;transition:all 0.15s ease;">
                    <span style="color:var(--tp-primary);font-weight:700;margin-right:0.35rem;">${s.num}.</span> ${s.title}
                  </a>
                `).join('')}
              </nav>
            ` : ''}

            <div style="font-size:0.75rem;color:var(--tp-text-dark-muted);padding-top:0.75rem;border-top:1px solid var(--tp-border-dark);">
              <div>Version: <span style="color:#fff;">${active.version}</span></div>
              <div style="margin-top:0.25rem;">Effective Date: March 1, 2026</div>
            </div>

          </aside>

          <!-- Right Column: Document Content -->
          <article class="tp-card" style="padding:2.5rem;border:1px solid var(--tp-border-dark);line-height:1.75;">
            
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--tp-border-dark);padding-bottom:1.25rem;margin-bottom:2rem;flex-wrap:wrap;gap:1rem;">
              <div>
                <h2 class="headline-xl" style="margin:0 0 0.25rem 0;color:#fff;">${translatedTitle}</h2>
                <span class="mono-chip" style="color:var(--tp-primary);">${active.version}</span>
              </div>
              <span class="telemetry-chip" style="color:var(--tp-success);border-color:var(--tp-success);background:rgba(34,197,94,0.1);">
                ✓ OFFICIALLY BINDING STATUTORY POLICY
              </span>
            </div>

            ${isTerms ? `
              <!-- Consolidated 24 Sections -->
              <div class="tp-terms-container" style="display:flex;flex-direction:column;gap:2rem;">
                ${active.sections.map(s => `
                  <section id="${s.id}" class="tp-terms-section-block" style="scroll-margin-top:2rem;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:1.75rem;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                      <h3 style="margin:0;font-size:1.25rem;color:#fff;display:flex;align-items:center;gap:0.6rem;">
                        <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:rgba(225,29,72,0.15);color:var(--tp-primary);font-size:0.85rem;font-weight:700;">
                          ${s.num}
                        </span>
                        <span>${s.title}</span>
                      </h3>
                      <a href="#${s.id}" class="tp-link" style="font-size:0.75rem;color:var(--tp-text-dark-muted);" title="Direct link to this section">
                        🔗 Link
                      </a>
                    </div>
                    <div class="tp-terms-text" style="color:var(--tp-text-light);font-size:0.95rem;">
                      ${s.content}
                    </div>
                  </section>
                `).join('')}
              </div>
            ` : `
              <!-- Regular Doc Content -->
              <div class="tp-legal-content" style="color:var(--tp-text-light);font-size:0.95rem;">
                ${active.content}
              </div>
            `}

            <!-- Footer Signoff -->
            <div style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--tp-border-dark);display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;color:var(--tp-text-dark-muted);flex-wrap:wrap;gap:1rem;">
              <span>TechPath Platform Legal & Academic Governance Board</span>
              <span>Statutory Compliance: <a href="mailto:legal@techpath.edu" style="color:var(--tp-primary)">legal@techpath.edu</a></span>
            </div>

          </article>

        </div>

      </div>
    `;

    this._attachHandlers(container);
  }

  static _attachHandlers(container) {
    // Document Switcher Buttons
    container.querySelectorAll('.tp-legal-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeDoc = e.currentTarget.dataset.doc;
        if (this.activeDoc === 'terms') {
          window.location.hash = '#/terms';
        } else if (this.activeDoc === 'privacy') {
          window.location.hash = '#/legal/privacy';
        } else if (this.activeDoc === 'cookies') {
          window.location.hash = '#/legal/cookies';
        } else if (this.activeDoc === 'deletion-request') {
          window.location.hash = '#/legal/deletion-request';
        }
        LegalPage.render(container);
      });
    });

    // Print Button
    container.querySelector('#print-legal-btn')?.addEventListener('click', () => {
      window.print();
    });

    // TOC Search / Filter
    const searchInput = container.querySelector('#terms-toc-search');
    const tocList = container.querySelector('#terms-toc-list');
    if (searchInput && tocList) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const links = tocList.querySelectorAll('.tp-toc-link');
        const sections = container.querySelectorAll('.tp-terms-section-block');

        links.forEach(link => {
          const text = link.textContent.toLowerCase();
          const match = !query || text.includes(query);
          link.style.display = match ? 'block' : 'none';
        });

        sections.forEach(sec => {
          const text = sec.textContent.toLowerCase();
          const match = !query || text.includes(query);
          sec.style.display = match ? 'block' : 'none';
        });
      });
    }

    // Smooth scroll for TOC links
    container.querySelectorAll('.tp-toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const secId = link.getAttribute('data-sec-id');
        const target = container.querySelector('#' + secId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', '#' + secId);
        }
      });
    });

    // Handle initial anchor link if URL contains an anchor
    const hash = window.location.hash || '';
    if (hash.includes('section-') || hash.includes('ai-disclaimer') || hash.includes('disclaimer') || hash.includes('copyright') || hash.includes('upload') || hash.includes('retention')) {
      let targetId = 'section-1-introduction';
      if (hash.includes('ai-disclaimer')) targetId = 'section-7-ai-disclaimer';
      else if (hash.includes('educational-disclaimer') || hash.includes('disclaimer')) targetId = 'section-8-educational-disclaimer';
      else if (hash.includes('upload')) targetId = 'section-10-upload-policy';
      else if (hash.includes('copyright')) targetId = 'section-11-copyright-intellectual-property';
      else if (hash.includes('retention')) targetId = 'section-17-data-retention';
      else if (hash.includes('section-')) {
        const match = hash.match(/section-[0-9a-z-]+/);
        if (match) targetId = match[0];
      }

      setTimeout(() => {
        const target = container.querySelector('#' + targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.style.backgroundColor = 'rgba(225,29,72,0.1)';
          setTimeout(() => { target.style.backgroundColor = 'transparent'; }, 2000);
        }
      }, 150);
    }
  }
}
