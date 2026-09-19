/**
 * TECHPATH — DEDICATED INTERNSHIP DISCOVERY & OPPORTUNITY TRACKER
 * Personalized engineering internships matched against candidate profile,
 * multi-faceted filtering, details modal, and dual Supabase/IndexedDB tracking.
 */

import { authContext } from '../context/AuthContext.js';
import { learningContext } from '../context/LearningContext.js';
import { InternshipEngine, CANONICAL_INTERNSHIPS } from '../services/InternshipEngine.js';
import { TaxonomyEngine } from '../services/TaxonomyEngine.js';
import { Toast } from '../components/Toast.js';

export class InternshipsPage {
  static activeFilters = {
    search: '',
    branch: 'all',
    track: 'all',
    workMode: 'all',
    compensation: 'all',
    status: 'all'
  };

  static activeDetails = null;
  static activeTrackingModal = null;

  static async render(container) {
    const user = authContext.getUser();
    const profile = authContext.getProfile() || user?.profile || {};
    const ctx = learningContext.get();
    const userId = user?.id || 'usr_guest';

    const userBranch = (profile.branch_id || profile.branch || ctx.branch_id || 'cse').toLowerCase();
    const branchObj = TaxonomyEngine.getBranchById(userBranch);
    const branchName = branchObj ? branchObj.name : userBranch.toUpperCase();
    const semester = (profile.semester_id || profile.semester || ctx.semester_id || 'sem_5').replace('sem_', '');
    const targetRole = profile.target_role || profile.career_goal || 'Software Engineer';

    // Set default branch filter on initial load if unset
    if (this.activeFilters.branch === 'all' && userBranch) {
      this.activeFilters.branch = userBranch;
    }

    // Load personalized internships
    let internships = [];
    try {
      internships = await InternshipEngine.getPersonalizedInternships(profile, this.activeFilters, userId);
    } catch (err) {
      console.error('Failed to load internships:', err);
      internships = CANONICAL_INTERNSHIPS;
    }

    // Load all tracking items to compute metrics
    const userTracking = await InternshipEngine.getUserInternships(userId);
    const savedCount = userTracking.filter(t => t.status === 'saved').length;
    const appliedCount = userTracking.filter(t => t.status && t.status !== 'saved').length;
    const branchMatchCount = CANONICAL_INTERNSHIPS.filter(i => (i.branch_relevance || []).includes(userBranch)).length;

    container.innerHTML = `
      <div class="tp-page" style="display: flex; flex-direction: column; gap: 1.75rem; max-width: 1400px; width: 100%; margin: 0 auto;">
        
        <!-- Header & Academic Telemetry -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1.25rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1.25rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem; display: inline-flex; align-items: center; gap: 0.5rem;">
              <span class="pulse-beacon"></span>
              <span>VERIFIED INTERNSHIP DOSSIER // ${userBranch.toUpperCase()} // SEMESTER ${semester}</span>
              <span style="color: var(--tp-text-dark-muted);">&bull;</span>
              <span style="color: #fff;">GOAL: ${targetRole}</span>
            </div>
            <h1 class="display-lg" style="margin: 0;">Engineering Internships & Co-op Discovery</h1>
            <p style="color: var(--tp-text-dark-secondary); max-width: 840px; margin-top: 0.35rem; font-size: 0.92rem; line-height: 1.5;">
              Vetted opportunities from leading technology organizations and research institutions. Every listing is verified against official corporate career portals and personalized to your academic discipline and skill profile.
            </p>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <a href="#/resume" class="tp-btn tp-btn-secondary tp-btn-sm">
              📄 Tailor My Resume →
            </a>
            <a href="#/mock-interview" class="tp-btn tp-btn-primary tp-btn-sm">
              🎤 Practice Interview →
            </a>
          </div>
        </div>

        <!-- Telemetry & Tracking Metrics Bar -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
          <div class="tp-card tp-card-glass" style="padding: 1.25rem; border-left: 3px solid var(--tp-primary);">
            <div style="font-size: 0.78rem; color: var(--tp-text-dark-muted); text-transform: uppercase; letter-spacing: 0.5px;">Verified Listings</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #fff; margin-top: 0.25rem;">${CANONICAL_INTERNSHIPS.length} Active</div>
            <div style="font-size: 0.78rem; color: var(--tp-success); margin-top: 0.2rem;">✓ 100% Genuine Portals</div>
          </div>

          <div class="tp-card tp-card-glass" style="padding: 1.25rem; border-left: 3px solid var(--tp-accent);">
            <div style="font-size: 0.78rem; color: var(--tp-text-dark-muted); text-transform: uppercase; letter-spacing: 0.5px;">Your Branch Match (${userBranch.toUpperCase()})</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #fff; margin-top: 0.25rem;">${branchMatchCount} Targeted</div>
            <div style="font-size: 0.78rem; color: var(--tp-text-dark-secondary); margin-top: 0.2rem;">Aligned with ${branchName}</div>
          </div>

          <div class="tp-card tp-card-glass" style="padding: 1.25rem; border-left: 3px solid #38bdf8;">
            <div style="font-size: 0.78rem; color: var(--tp-text-dark-muted); text-transform: uppercase; letter-spacing: 0.5px;">Saved Opportunities</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #fff; margin-top: 0.25rem;">${savedCount} Saved</div>
            <div style="font-size: 0.78rem; color: var(--tp-text-dark-secondary); margin-top: 0.2rem;">Bookmarked in tracker</div>
          </div>

          <div class="tp-card tp-card-glass" style="padding: 1.25rem; border-left: 3px solid #10b981;">
            <div style="font-size: 0.78rem; color: var(--tp-text-dark-muted); text-transform: uppercase; letter-spacing: 0.5px;">Applied & In Progress</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: #fff; margin-top: 0.25rem;">${appliedCount} Tracked</div>
            <div style="font-size: 0.78rem; color: var(--tp-text-dark-secondary); margin-top: 0.2rem;">Supabase synced</div>
          </div>
        </div>

        <!-- Filter & Search Controls -->
        <div class="tp-card tp-card-glass" style="padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; border: 1px solid var(--tp-border-dark);">
          
          <!-- Top Row: Search + Status Tabs -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <!-- Search Bar -->
            <div style="flex: 1; min-width: 280px; position: relative;">
              <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--tp-text-dark-muted);">🔍</span>
              <input 
                type="text" 
                id="intn-search-input" 
                class="tp-input" 
                placeholder="Search by company, role title, skills (e.g. C++, PyTorch, FEA), or location..." 
                value="${this.activeFilters.search}"
                style="padding-left: 2.5rem;"
              />
            </div>

            <!-- Status Tabs -->
            <div style="display: flex; gap: 0.5rem; background: rgba(0,0,0,0.25); padding: 0.25rem; border-radius: var(--radius-sm);">
              <button class="tp-btn tp-btn-xs intn-status-tab ${this.activeFilters.status === 'all' ? 'tp-btn-primary' : 'tp-btn-secondary'}" data-status="all">
                All Listings (${internships.length})
              </button>
              <button class="tp-btn tp-btn-xs intn-status-tab ${this.activeFilters.status === 'saved' ? 'tp-btn-primary' : 'tp-btn-secondary'}" data-status="saved">
                Saved (${savedCount})
              </button>
              <button class="tp-btn tp-btn-xs intn-status-tab ${this.activeFilters.status === 'applied' ? 'tp-btn-primary' : 'tp-btn-secondary'}" data-status="applied">
                Applied (${appliedCount})
              </button>
            </div>
          </div>

          <!-- Bottom Row: Filter Dropdowns & Pills -->
          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            
            <!-- Branch Filter -->
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 0.8rem; color: var(--tp-text-dark-muted);">Branch:</span>
              <select id="intn-branch-filter" class="tp-input" style="padding: 0.4rem 0.75rem; font-size: 0.82rem; width: auto; background: #0f172a; color: #fff;">
                <option value="all" ${this.activeFilters.branch === 'all' ? 'selected' : ''}>All Disciplines</option>
                <option value="cse" ${this.activeFilters.branch === 'cse' ? 'selected' : ''}>CSE (Computer Science)</option>
                <option value="aiml" ${this.activeFilters.branch === 'aiml' ? 'selected' : ''}>AI & Machine Learning</option>
                <option value="ece" ${this.activeFilters.branch === 'ece' ? 'selected' : ''}>ECE (Electronics & Comm)</option>
                <option value="eee" ${this.activeFilters.branch === 'eee' ? 'selected' : ''}>EEE (Electrical & Electronics)</option>
                <option value="mech" ${this.activeFilters.branch === 'mech' ? 'selected' : ''}>MECH (Mechanical Engg)</option>
                <option value="civil" ${this.activeFilters.branch === 'civil' ? 'selected' : ''}>CIVIL (Civil & Structural)</option>
              </select>
            </div>

            <!-- Role Track Filter -->
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 0.8rem; color: var(--tp-text-dark-muted);">Track:</span>
              <select id="intn-track-filter" class="tp-input" style="padding: 0.4rem 0.75rem; font-size: 0.82rem; width: auto; background: #0f172a; color: #fff;">
                <option value="all" ${this.activeFilters.track === 'all' ? 'selected' : ''}>All Tracks</option>
                <option value="Software Systems" ${this.activeFilters.track === 'Software Systems' ? 'selected' : ''}>Software Systems</option>
                <option value="Embedded & Hardware" ${this.activeFilters.track === 'Embedded & Hardware' ? 'selected' : ''}>Embedded & Hardware</option>
                <option value="AI & Data" ${this.activeFilters.track === 'AI & Data' ? 'selected' : ''}>AI & Data</option>
                <option value="Mechanical & Automotive" ${this.activeFilters.track === 'Mechanical & Automotive' ? 'selected' : ''}>Mechanical & Automotive</option>
                <option value="Civil & Infrastructure" ${this.activeFilters.track === 'Civil & Infrastructure' ? 'selected' : ''}>Civil & Infrastructure</option>
                <option value="Power Systems" ${this.activeFilters.track === 'Power Systems' ? 'selected' : ''}>Power Systems</option>
                <option value="Aerospace & Robotics" ${this.activeFilters.track === 'Aerospace & Robotics' ? 'selected' : ''}>Aerospace & Robotics</option>
              </select>
            </div>

            <!-- Work Mode Pills -->
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 0.8rem; color: var(--tp-text-dark-muted);">Mode:</span>
              <div style="display: flex; gap: 0.35rem;">
                <button class="tp-btn tp-btn-xs intn-mode-pill ${this.activeFilters.workMode === 'all' ? 'tp-btn-primary' : 'tp-btn-secondary'}" data-mode="all">All</button>
                <button class="tp-btn tp-btn-xs intn-mode-pill ${this.activeFilters.workMode === 'remote' ? 'tp-btn-primary' : 'tp-btn-secondary'}" data-mode="remote">Remote</button>
                <button class="tp-btn tp-btn-xs intn-mode-pill ${this.activeFilters.workMode === 'hybrid' ? 'tp-btn-primary' : 'tp-btn-secondary'}" data-mode="hybrid">Hybrid</button>
                <button class="tp-btn tp-btn-xs intn-mode-pill ${this.activeFilters.workMode === 'onsite' ? 'tp-btn-primary' : 'tp-btn-secondary'}" data-mode="onsite">On-Site</button>
              </div>
            </div>

            <!-- Compensation Toggle -->
            <div style="display: flex; align-items: center; gap: 0.4rem; margin-left: auto;">
              <button id="intn-paid-toggle" class="tp-btn tp-btn-xs ${this.activeFilters.compensation === 'paid' ? 'tp-btn-accent' : 'tp-btn-secondary'}">
                ${this.activeFilters.compensation === 'paid' ? '✓ Paid Only' : 'All Compensation'}
              </button>
              <button id="intn-reset-filters" class="tp-btn tp-btn-xs tp-btn-secondary" title="Reset all filters">
                ↺ Reset
              </button>
            </div>

          </div>
        </div>

        <!-- Internship Listings Grid -->
        ${internships.length === 0 ? `
          <!-- Truthful Empty State -->
          <div class="tp-card tp-card-glass" style="padding: 4rem 2rem; text-align: center; border: 1px dashed var(--tp-border-dark);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🏢</div>
            <h3 class="headline-md" style="color: #fff; margin-bottom: 0.5rem;">No Opportunities Match Your Current Criteria</h3>
            <p style="color: var(--tp-text-dark-secondary); max-width: 540px; margin: 0 auto 1.5rem auto; font-size: 0.9rem; line-height: 1.5;">
              TechPath only displays authentic, verified postings directly from engineering corporations and research agencies. We never invent mock listings or fabricated URLs.
            </p>
            <div style="display: flex; gap: 0.75rem; justify-content: center;">
              <button id="intn-empty-reset-btn" class="tp-btn tp-btn-primary tp-btn-sm">
                ↺ Clear All Filters
              </button>
              <a href="#/skills" class="tp-btn tp-btn-secondary tp-btn-sm">
                ⚡ Build Required Skills
              </a>
            </div>
          </div>
        ` : `
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 1.5rem;" class="tp-internships-grid">
            ${internships.map(intn => this._renderInternshipCard(intn, userBranch)).join('')}
          </div>
        `}

        <!-- Modals Container -->
        <div id="tp-internship-modal-host"></div>

      </div>
    `;

    this._bindEvents(container, profile, userId);
  }

  /**
   * Renders single internship card with personalization badges
   */
  static _renderInternshipCard(intn, userBranch) {
    const isSaved = intn.trackingStatus === 'saved';
    const isApplied = intn.trackingStatus && intn.trackingStatus !== 'saved';
    const branchMatched = (intn.branch_relevance || []).includes(userBranch.toLowerCase());

    const statusBadge = isApplied ? `
      <span class="mono-chip" style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 0.7rem; border: 1px solid #10b981;">
        ✓ ${intn.trackingStatus.toUpperCase()}
      </span>
    ` : isSaved ? `
      <span class="mono-chip" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-size: 0.7rem; border: 1px solid #0284c7;">
        🔖 SAVED
      </span>
    ` : '';

    return `
      <div class="tp-card tp-card-glass" style="display: flex; flex-direction: column; justify-content: space-between; gap: 1.25rem; border: 1px solid var(--tp-border-dark); padding: 1.5rem; transition: transform 0.2s, border-color 0.2s; position: relative;">
        
        <div>
          <!-- Top Row: Company + Match Score -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                <span style="font-weight: 700; color: #fff; font-size: 1.05rem;">${intn.company_name}</span>
                <span class="mono-chip" style="font-size: 0.65rem; color: var(--tp-info);">VERIFIED</span>
                ${statusBadge}
              </div>
              <div style="font-size: 0.78rem; color: var(--tp-text-dark-muted); margin-top: 0.15rem;">
                Track: ${intn.track || 'Engineering'} &bull; ${intn.work_mode.toUpperCase()}
              </div>
            </div>

            <!-- Relevance Score Badge -->
            <div style="text-align: right;">
              <span class="mono-chip" style="background: ${intn.relevance >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)'}; color: ${intn.relevance >= 80 ? '#34d399' : '#38bdf8'}; font-weight: 800; font-size: 0.75rem; border: 1px solid ${intn.relevance >= 80 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.4)'};">
                ${intn.relevance}% MATCH
              </span>
            </div>
          </div>

          <!-- Role Title -->
          <h3 style="font-size: 1.12rem; font-weight: 700; color: #fff; margin: 0 0 0.6rem 0; line-height: 1.35;">
            ${intn.role_title}
          </h3>

          <!-- Details Micro-table -->
          <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.82rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.9rem;">
            <div style="display: flex; justify-content: space-between;">
              <span>📍 Location:</span>
              <span style="color: #fff; text-align: right;">${intn.location}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>💰 Stipend:</span>
              <span style="color: var(--tp-success); font-weight: 600;">${intn.stipend || 'Competitive'}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>⏳ Duration:</span>
              <span style="color: #fff;">${intn.duration || 'Semester'}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>📅 Deadline:</span>
              <span style="color: #f59e0b; font-weight: 500;">${intn.deadline || 'Rolling'}</span>
            </div>
          </div>

          <!-- Skills Matched Checklist -->
          <div style="margin-bottom: 0.5rem;">
            <div style="font-size: 0.72rem; text-transform: uppercase; color: var(--tp-text-dark-muted); letter-spacing: 0.5px; margin-bottom: 0.35rem;">
              Key Competencies:
            </div>
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
              ${(intn.skillsStatus || []).slice(0, 4).map(sk => `
                <span class="mono-chip" style="font-size: 0.68rem; background: ${sk.hasSkill ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)'}; color: ${sk.hasSkill ? '#34d399' : 'var(--tp-text-dark-secondary)'}; border: 1px solid ${sk.hasSkill ? 'rgba(16, 185, 129, 0.3)' : 'transparent'};">
                  ${sk.hasSkill ? '✓ ' : ''}${sk.name}
                </span>
              `).join('')}
              ${(intn.skillsStatus || []).length > 4 ? `
                <span class="mono-chip" style="font-size: 0.68rem; color: var(--tp-text-dark-muted);">
                  +${intn.skillsStatus.length - 4} more
                </span>
              ` : ''}
            </div>
          </div>

        </div>

        <!-- Action Footer -->
        <div style="display: flex; gap: 0.5rem; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1rem; flex-wrap: wrap;">
          <!-- View Details Button -->
          <button class="tp-btn tp-btn-secondary tp-btn-sm btn-intn-details" data-id="${intn.id}" style="flex: 1; font-size: 0.8rem;">
            Details & Overview
          </button>

          <!-- Direct Official Apply Link -->
          <a href="${intn.application_url}" target="_blank" rel="noopener noreferrer" class="tp-btn tp-btn-primary tp-btn-sm" style="flex: 1; text-align: center; font-size: 0.8rem;">
            Apply Direct ↗
          </a>

          <!-- Save / Bookmark Toggle -->
          <button class="tp-btn tp-btn-secondary tp-btn-sm btn-intn-save" data-id="${intn.id}" data-saved="${isSaved}" title="${isSaved ? 'Remove from Saved' : 'Save Opportunity'}" style="padding: 0.4rem 0.65rem; color: ${isSaved ? '#38bdf8' : 'inherit'};">
            ${isSaved ? '★' : '☆'}
          </button>

          <!-- Track Status Button -->
          <button class="tp-btn tp-btn-secondary tp-btn-sm btn-intn-track" data-id="${intn.id}" title="Track Application Status" style="padding: 0.4rem 0.65rem;">
            📋
          </button>
        </div>

      </div>
    `;
  }

  /**
   * Renders the details modal for an internship
   */
  static _renderDetailsModal(intn, host, userBranch, userId) {
    const isSaved = intn.trackingStatus === 'saved';
    const isApplied = intn.trackingStatus && intn.trackingStatus !== 'saved';

    host.innerHTML = `
      <div class="tp-modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
        <div class="tp-modal-content tp-card" style="background: #0f172a; border: 1px solid var(--tp-border-dark); border-radius: var(--radius-md); max-width: 760px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
          
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                <span style="font-weight: 800; font-size: 1.2rem; color: #fff;">${intn.company_name}</span>
                <span class="mono-chip" style="font-size: 0.68rem; color: var(--tp-info);">OFFICIAL VERIFIED LISTING</span>
              </div>
              <h2 style="font-size: 1.35rem; font-weight: 800; color: #fff; margin: 0;">${intn.role_title}</h2>
              <div style="font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-top: 0.25rem;">
                Track: ${intn.track || 'Engineering'} &bull; Modality: ${intn.work_mode.toUpperCase()}
              </div>
            </div>

            <button id="tp-modal-close-btn" class="tp-btn tp-btn-secondary tp-btn-xs" style="padding: 0.35rem 0.65rem; font-size: 1.1rem;">
              ✕
            </button>
          </div>

          <!-- Quick Metrics Bar -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; background: rgba(255,255,255,0.02); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--tp-border-dark);">
            <div>
              <div style="font-size: 0.72rem; color: var(--tp-text-dark-muted); text-transform: uppercase;">Stipend</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: var(--tp-success); margin-top: 0.2rem;">${intn.stipend || 'Competitive'}</div>
            </div>
            <div>
              <div style="font-size: 0.72rem; color: var(--tp-text-dark-muted); text-transform: uppercase;">Location</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-top: 0.2rem;">${intn.location}</div>
            </div>
            <div>
              <div style="font-size: 0.72rem; color: var(--tp-text-dark-muted); text-transform: uppercase;">Duration</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-top: 0.2rem;">${intn.duration || 'Semester'}</div>
            </div>
            <div>
              <div style="font-size: 0.72rem; color: var(--tp-text-dark-muted); text-transform: uppercase;">Deadline</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #f59e0b; margin-top: 0.2rem;">${intn.deadline || 'Rolling'}</div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin: 0 0 0.5rem 0;">Role Overview & Objectives</h4>
            <p style="font-size: 0.88rem; color: var(--tp-text-dark-secondary); line-height: 1.6; margin: 0;">
              ${intn.description}
            </p>
          </div>

          <!-- Responsibilities -->
          ${intn.responsibilities && intn.responsibilities.length > 0 ? `
            <div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin: 0 0 0.5rem 0;">Key Engineering Responsibilities</h4>
              <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.88rem; color: var(--tp-text-dark-secondary); line-height: 1.6;">
                ${intn.responsibilities.map(r => `<li style="margin-bottom: 0.35rem;">${r}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- Eligibility -->
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin: 0 0 0.4rem 0;">Eligibility & Prerequisites</h4>
            <div style="padding: 0.75rem 1rem; background: rgba(56, 189, 248, 0.06); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: var(--radius-sm); font-size: 0.85rem; color: #38bdf8;">
              ℹ️ ${intn.eligibility || 'Open to all enrolled engineering students meeting prerequisite coursework.'}
            </div>
          </div>

          <!-- Skills Comparison -->
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin: 0 0 0.5rem 0;">Technical Competencies Required</h4>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${(intn.skillsStatus || []).map(sk => `
                <div class="mono-chip" style="font-size: 0.75rem; padding: 0.35rem 0.75rem; background: ${sk.hasSkill ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.04)'}; color: ${sk.hasSkill ? '#34d399' : 'var(--tp-text-dark-secondary)'}; border: 1px solid ${sk.hasSkill ? 'rgba(16, 185, 129, 0.4)' : 'var(--tp-border-dark)'};">
                  ${sk.hasSkill ? '✓ Verified in Dossier: ' : '⭕ Required: '}${sk.name}
                </div>
              `).join('')}
            </div>

            ${intn.preferred_skills && intn.preferred_skills.length > 0 ? `
              <div style="margin-top: 0.75rem;">
                <div style="font-size: 0.75rem; color: var(--tp-text-dark-muted); margin-bottom: 0.35rem;">Preferred / Advantageous Skills:</div>
                <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
                  ${intn.preferred_skills.map(ps => `
                    <span class="mono-chip" style="font-size: 0.72rem; color: var(--tp-text-dark-secondary);">+ ${ps}</span>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Official Portal & Actions Footer -->
          <div style="display: flex; gap: 0.75rem; align-items: center; justify-content: space-between; border-top: 1px solid var(--tp-border-dark); padding-top: 1.25rem; flex-wrap: wrap;">
            <div style="font-size: 0.8rem; color: var(--tp-text-dark-muted);">
              Source: <span style="color: #fff;">${intn.source || 'Corporate Career Portal'}</span>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <button id="modal-track-status-btn" class="tp-btn tp-btn-secondary tp-btn-sm">
                📋 Update Status
              </button>
              <a href="${intn.application_url}" target="_blank" rel="noopener noreferrer" class="tp-btn tp-btn-primary tp-btn-sm">
                Apply on Official Portal ↗
              </a>
            </div>
          </div>

        </div>
      </div>
    `;

    // Bind modal events
    const closeBtn = host.querySelector('#tp-modal-close-btn');
    closeBtn?.addEventListener('click', () => { host.innerHTML = ''; });
    host.querySelector('.tp-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) host.innerHTML = '';
    });

    // Track Status inside modal
    host.querySelector('#modal-track-status-btn')?.addEventListener('click', () => {
      host.innerHTML = '';
      this._renderTrackingModal(intn, host, userId);
    });
  }

  /**
   * Renders application tracking modal for setting status and notes
   */
  static _renderTrackingModal(intn, host, userId) {
    const currentStatus = intn.trackingStatus || 'saved';

    host.innerHTML = `
      <div class="tp-modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem;">
        <div class="tp-modal-content tp-card" style="background: #0f172a; border: 1px solid var(--tp-border-dark); border-radius: var(--radius-md); max-width: 520px; width: 100%; padding: 2rem; display: flex; flex-direction: column; gap: 1.25rem;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.75rem;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color: #fff; margin: 0;">Track Application</h3>
              <div style="font-size: 0.8rem; color: var(--tp-text-dark-secondary); margin-top: 0.2rem;">${intn.company_name} — ${intn.role_title}</div>
            </div>
            <button id="track-modal-close" class="tp-btn tp-btn-secondary tp-btn-xs">✕</button>
          </div>

          <div>
            <label class="tp-form-label">Application Status</label>
            <select id="track-status-select" class="tp-input">
              <option value="saved" ${currentStatus === 'saved' ? 'selected' : ''}>🔖 Bookmarked / Saved</option>
              <option value="applied" ${currentStatus === 'applied' ? 'selected' : ''}>📝 Applied on Portal</option>
              <option value="assessment" ${currentStatus === 'assessment' ? 'selected' : ''}>⚡ Online Technical Assessment</option>
              <option value="interview" ${currentStatus === 'interview' ? 'selected' : ''}>🎤 Technical / HR Interview</option>
              <option value="offered" ${currentStatus === 'offered' ? 'selected' : ''}>🎉 Offer Received</option>
              <option value="rejected" ${currentStatus === 'rejected' ? 'selected' : ''}>❌ Not Selected</option>
            </select>
          </div>

          <div>
            <label class="tp-form-label">Personal Application Notes</label>
            <textarea id="track-notes-input" class="tp-input" rows="3" placeholder="e.g. Applied via referral, completed HackerRank test, interviewer mentioned distributed systems...">${intn.trackingNotes || ''}</textarea>
          </div>

          <div style="display: flex; justify-content: space-between; gap: 0.75rem; border-top: 1px solid var(--tp-border-dark); padding-top: 1rem;">
            ${intn.trackingStatus ? `
              <button id="track-untrack-btn" class="tp-btn tp-btn-secondary tp-btn-sm" style="color: #ef4444;">
                Remove From Tracker
              </button>
            ` : '<div></div>'}
            <div style="display: flex; gap: 0.5rem;">
              <button id="track-modal-cancel" class="tp-btn tp-btn-secondary tp-btn-sm">Cancel</button>
              <button id="track-modal-save" class="tp-btn tp-btn-primary tp-btn-sm">Save Tracking</button>
            </div>
          </div>

        </div>
      </div>
    `;

    const close = () => { host.innerHTML = ''; };
    host.querySelector('#track-modal-close')?.addEventListener('click', close);
    host.querySelector('#track-modal-cancel')?.addEventListener('click', close);

    // Save tracking state
    host.querySelector('#track-modal-save')?.addEventListener('click', async () => {
      const status = host.querySelector('#track-status-select').value;
      const notes = host.querySelector('#track-notes-input').value;
      await InternshipEngine.trackInternship(userId, intn.id, status, notes);
      Toast.success(`Tracking updated: ${status.toUpperCase()}`);
      close();
      // Re-render main page with updated state
      const viewport = document.getElementById('app-viewport');
      if (viewport) InternshipsPage.render(viewport);
    });

    // Untrack button
    host.querySelector('#track-untrack-btn')?.addEventListener('click', async () => {
      await InternshipEngine.untrackInternship(userId, intn.id);
      Toast.info('Removed from application tracker.');
      close();
      const viewport = document.getElementById('app-viewport');
      if (viewport) InternshipsPage.render(viewport);
    });
  }

  /**
   * Binds all dynamic interactive filters, search, and action buttons
   */
  static _bindEvents(container, profile, userId) {
    const modalHost = container.querySelector('#tp-internship-modal-host');

    const rerender = () => {
      this.render(container);
    };

    // 1. Search Bar with debounce
    const searchInput = container.querySelector('#intn-search-input');
    if (searchInput) {
      let debounceTimer = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.activeFilters.search = e.target.value;
          rerender();
        }, 300);
      });
    }

    // 2. Branch Filter Dropdown
    const branchFilter = container.querySelector('#intn-branch-filter');
    if (branchFilter) {
      branchFilter.addEventListener('change', (e) => {
        this.activeFilters.branch = e.target.value;
        rerender();
      });
    }

    // 3. Role Track Filter
    const trackFilter = container.querySelector('#intn-track-filter');
    if (trackFilter) {
      trackFilter.addEventListener('change', (e) => {
        this.activeFilters.track = e.target.value;
        rerender();
      });
    }

    // 4. Work Mode Pills
    container.querySelectorAll('.intn-mode-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeFilters.workMode = e.target.dataset.mode;
        rerender();
      });
    });

    // 5. Status Tabs
    container.querySelectorAll('.intn-status-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeFilters.status = e.target.dataset.status;
        rerender();
      });
    });

    // 6. Paid Toggle
    const paidBtn = container.querySelector('#intn-paid-toggle');
    if (paidBtn) {
      paidBtn.addEventListener('click', () => {
        this.activeFilters.compensation = this.activeFilters.compensation === 'paid' ? 'all' : 'paid';
        rerender();
      });
    }

    // 7. Reset Filters
    const resetBtn = container.querySelector('#intn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.activeFilters = {
          search: '',
          branch: 'all',
          track: 'all',
          workMode: 'all',
          compensation: 'all',
          status: 'all'
        };
        rerender();
      });
    }

    const emptyResetBtn = container.querySelector('#intn-empty-reset-btn');
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', () => {
        this.activeFilters = {
          search: '',
          branch: 'all',
          track: 'all',
          workMode: 'all',
          compensation: 'all',
          status: 'all'
        };
        rerender();
      });
    }

    // 8. Card Action: Details
    container.querySelectorAll('.btn-intn-details').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const all = await InternshipEngine.getPersonalizedInternships(profile, {}, userId);
        const intn = all.find(i => i.id === id);
        if (intn && modalHost) {
          this._renderDetailsModal(intn, modalHost, profile.branch_id || 'cse', userId);
        }
      });
    });

    // 9. Card Action: Save Toggle
    container.querySelectorAll('.btn-intn-save').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const isSaved = e.currentTarget.dataset.saved === 'true';
        if (isSaved) {
          await InternshipEngine.untrackInternship(userId, id);
          Toast.info('Removed from saved internships.');
        } else {
          await InternshipEngine.trackInternship(userId, id, 'saved');
          Toast.success('Saved to your application tracker!');
        }
        rerender();
      });
    });

    // 10. Card Action: Track Status
    container.querySelectorAll('.btn-intn-track').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const all = await InternshipEngine.getPersonalizedInternships(profile, {}, userId);
        const intn = all.find(i => i.id === id);
        if (intn && modalHost) {
          this._renderTrackingModal(intn, modalHost, userId);
        }
      });
    });
  }
}
