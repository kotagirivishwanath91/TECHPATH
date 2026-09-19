/**
 * TECHPATH — LEARNHUB & REAL RELATED VIDEO LECTURE THEATER
 * Strictly curriculum-grounded video streaming adhering to user's canonical academic profile:
 * Department, Branch, Specialization, Semester, Subject, Topic, Career Goal, Role, Language.
 * Powered by verified, legal YouTube resources with official embed player, safe fallback,
 * multi-tier relevance matching across 6 non-overlapping sections, and progress tracking.
 */

import { learningContext } from '../context/LearningContext.js';
import { authContext } from '../context/AuthContext.js';
import { ContentFilterEngine } from '../services/ContentFilter.js';
import { VideoEngine } from '../services/VideoEngine.js';
import { Toast } from '../components/Toast.js';
import { I18nEngine } from '../services/I18nEngine.js';

export class LearningPage {
  static activeVideoId = null;
  static searchQuery = '';
  static activeViewTab = 'all'; // 'all' | 'continue' | 'saved' | 'completed'
  static isVideoUnavailable = false;
  static _activeContainer = null;
  static _subscribed = false;

  static async render(container) {
    this._activeContainer = container;
    const user = authContext.getUser();
    const profile = authContext.getProfile() || user?.profile || {};
    const ctx = learningContext.get();

    // Canonical Academic Context
    const department = profile.department_id || ctx.department_id || 'eng';
    const branch = (profile.branch_id || ctx.branch_id || 'cse').toLowerCase();
    const specialization = profile.specialization || ctx.specialization || 'AI & ML';
    const semester = profile.semester_id || ctx.semester_id || 'sem_5';
    const careerGoal = profile.career_goal || ctx.career_goal || 'Machine Learning Engineer';
    const careerRole = profile.career_interests?.[0] || ctx.target_role || 'role_data_scientist';
    const language = profile.preferred_language || ctx.preferred_language || I18nEngine.getCurrentLanguage() || 'en';

    // 1. Fetch branch subjects and active subject topics
    const subjects = await ContentFilterEngine.getSubjects(branch, semester);
    let activeSubject = subjects.find(s => s.id === ctx.subject_id) || subjects[0] || null;

    let topics = [];
    if (activeSubject) {
      topics = await ContentFilterEngine.getTopics(activeSubject.id);
    }
    let activeTopic = topics.find(t => t.id === ctx.topic_id) || topics[0] || null;

    // 2. Query categorized videos via VideoEngine
    const queryContext = {
      department_id: department,
      branch_id: branch,
      specialization: specialization,
      semester_id: semester,
      subject_id: activeSubject?.id || null,
      subject_name: activeSubject?.title || null,
      topic_id: activeTopic?.id || null,
      topic_name: activeTopic?.title || null,
      career_goal: careerGoal,
      target_role: careerRole,
      preferred_language: language,
      learning_level: profile.learning_level || ctx.learning_level || 'intermediate'
    };

    const { allBranchVideos, sections } = VideoEngine.getCategorizedVideos(queryContext);

    // 3. Telemetry and state storage
    const progressMap = JSON.parse(localStorage.getItem('TP_VIDEO_PROGRESS') || '{}');
    const savedVideoIds = JSON.parse(localStorage.getItem('TP_SAVED_VIDEOS') || '[]');
    const libraryVideoIds = JSON.parse(localStorage.getItem('TP_LIBRARY_VIDEOS') || '[]');
    const completedVideoIds = JSON.parse(localStorage.getItem('TP_COMPLETED_VIDEOS') || '[]');

    // 4. Resolve active video
    let activeVideo = allBranchVideos.find(v => v.id === this.activeVideoId) ||
                      sections.relatedToTopic[0] ||
                      sections.recommendedForYou[0] ||
                      allBranchVideos[0] || null;

    if (activeVideo && !this.activeVideoId) {
      this.activeVideoId = activeVideo.id;
    }

    // 5. Handle search if active
    let searchResults = null;
    if (this.searchQuery && this.searchQuery.trim()) {
      searchResults = VideoEngine.searchVideos(this.searchQuery, queryContext);
    }

    // Continue watching queue
    const continueWatchingList = allBranchVideos.filter(v => {
      const prog = progressMap[v.id];
      return prog && prog.currentTime > 5 && !completedVideoIds.includes(v.id);
    });

    // Helper: generate video card HTML
    const renderVideoCard = (vid) => {
      const isCur = activeVideo?.id === vid.id;
      const isSaved = savedVideoIds.includes(vid.id);
      const isLib = libraryVideoIds.includes(vid.id);
      const isDone = completedVideoIds.includes(vid.id);
      const langLabel = vid.language === 'te' ? 'Telugu (తెలుగు)' : (vid.language === 'hi' ? 'Hindi (हिंदी)' : 'English');

      return `
        <div class="tp-card tp-video-card" data-vid-id="${vid.id}" style="display: flex; flex-direction: column; justify-content: space-between; padding: 0.85rem; border: 1px solid ${isCur ? 'var(--tp-primary)' : 'var(--tp-border-dark)'}; background: ${isCur ? 'rgba(225,29,72,0.08)' : 'rgba(255,255,255,0.02)'}; border-radius: var(--radius-sm); transition: transform 0.2s ease, border-color 0.2s ease;">
          <div>
            <!-- Thumbnail & Badges -->
            <div style="position: relative; aspect-ratio: 16/9; border-radius: var(--radius-xs); overflow: hidden; background: #000; margin-bottom: 0.75rem;">
              <img src="${vid.thumbnail_url || `https://img.youtube.com/vi/${vid.video_id}/hqdefault.jpg`}"
                   alt="${vid.title}"
                   style="width: 100%; height: 100%; object-fit: cover;"
                   loading="lazy" />
              <span style="position: absolute; bottom: 6px; right: 6px; font-size: 0.7rem; font-weight: 600; padding: 2px 6px; background: rgba(0,0,0,0.8); color: #fff; border-radius: 4px; font-family: monospace;">
                ${vid.duration_label || `${Math.round((vid.duration || 600) / 60)}m`}
              </span>
              <span style="position: absolute; top: 6px; left: 6px; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; background: rgba(225,29,72,0.9); color: #fff; border-radius: 4px; letter-spacing: 0.5px;">
                ${(vid.source || 'YOUTUBE').toUpperCase()}
              </span>
              ${isDone ? `
                <span style="position: absolute; top: 6px; right: 6px; font-size: 0.65rem; font-weight: 700; padding: 2px 6px; background: #10b981; color: #fff; border-radius: 4px;">
                  ✓ WATCHED
                </span>
              ` : ''}
            </div>

            <!-- Metadata Info -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; font-size: 0.72rem; color: var(--tp-text-dark-muted);">
              <span>${vid.channel || vid.creator || 'Verified Educator'}</span>
              <span class="mono-chip" style="font-size: 0.65rem; padding: 1px 5px; color: ${(vid.difficulty || '').toLowerCase() === 'advanced' ? 'var(--tp-warning)' : 'var(--tp-info)'};">
                ${(vid.difficulty || 'INTERMEDIATE').toUpperCase()}
              </span>
            </div>

            <h4 style="font-size: 0.88rem; font-weight: 600; line-height: 1.35; color: #fff; margin: 0 0 0.4rem 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${vid.title}">
              ${vid.title}
            </h4>

            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.5rem; font-size: 0.72rem;">
              <span style="background: rgba(255,255,255,0.05); padding: 1px 6px; border-radius: 4px; color: var(--tp-text-dark-secondary);">
                📖 ${vid.subject}
              </span>
              <span style="background: rgba(255,255,255,0.05); padding: 1px 6px; border-radius: 4px; color: var(--tp-text-dark-secondary);">
                🌐 ${langLabel}
              </span>
            </div>

            <!-- Why Recommended Callout -->
            <div style="padding: 0.4rem 0.55rem; background: rgba(255,255,255,0.03); border-left: 2px solid var(--tp-primary); border-radius: 2px; font-size: 0.74rem; color: #f1f5f9; margin-bottom: 0.75rem;">
              ${vid.whyRecommended || 'Curriculum aligned with active branch'}
            </div>
          </div>

          <!-- Card Actions Strip -->
          <div style="display: flex; gap: 0.35rem; border-top: 1px solid var(--tp-border-dark); padding-top: 0.65rem; flex-wrap: wrap;">
            <button class="tp-btn ${isCur ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-xs btn-watch-video" data-vid="${vid.id}" style="flex: 1; font-size: 0.74rem;">
              ▶ ${isCur ? 'Watching' : 'Watch'}
            </button>
            <button class="tp-btn tp-btn-ghost tp-btn-xs btn-save-video" data-vid="${vid.id}" title="Save Bookmark" style="padding: 0.25rem 0.45rem; font-size: 0.8rem;">
              ${isSaved ? '★' : '☆'}
            </button>
            <button class="tp-btn tp-btn-ghost tp-btn-xs btn-library-video" data-vid="${vid.id}" title="Add to My Resource Library" style="padding: 0.25rem 0.45rem; font-size: 0.8rem;">
              ${isLib ? '📚✓' : '📚+'}
            </button>
            <button class="tp-btn tp-btn-ghost tp-btn-xs btn-complete-video" data-vid="${vid.id}" title="Toggle Watched" style="padding: 0.25rem 0.45rem; font-size: 0.8rem;">
              ${isDone ? '✓' : '○'}
            </button>
            <button class="tp-btn tp-btn-ghost tp-btn-xs btn-share-video" data-vid="${vid.id}" data-url="${vid.url}" title="Share Video" style="padding: 0.25rem 0.45rem; font-size: 0.8rem;">
              🔗
            </button>
          </div>
        </div>
      `;
    };

    // Render HTML structure
    container.innerHTML = `
      <div class="tp-page" style="display: flex; flex-direction: column; gap: 1.75rem; max-width: 1350px; width: 100%;">
        <!-- Header Strip with Canonical Context Pill -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
              <span class="pulse-beacon"></span> DISCIPLINE: ${branch.toUpperCase()} // SEMESTER ${semester.replace('sem_', '')} // ${specialization.toUpperCase()}
            </div>
            <h1 class="display-lg">${I18nEngine.t('learnhub')} & Real Video Resources</h1>
            <p style="color: var(--tp-text-dark-secondary); max-width: 750px; font-size: 0.92rem;">
              Syllabus-aligned video lectures, mathematical derivations, and capstone labs from YouTube and academic repositories.
              Strictly filtered to your engineering curriculum.
            </p>
          </div>

          <!-- Quick Search & Telemetry Count -->
          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <div style="position: relative;">
              <input type="text" id="learn-global-search" class="tp-input" value="${this.searchQuery}" placeholder="Search videos by topic, subject, creator..." style="padding: 0.45rem 0.75rem; font-size: 0.85rem; width: 280px;" />
              ${this.searchQuery ? `
                <button id="btn-clear-search" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #fff; cursor: pointer;">✕</button>
              ` : ''}
            </div>
            <span class="mono-chip" style="color: var(--tp-primary);">
              ${allBranchVideos.length} VERIFIED LECTURES
            </span>
          </div>
        </div>

        <!-- Academic Hierarchy Selector (Department -> Branch -> Semester -> Subject -> Topic) -->
        <div class="tp-card" style="padding: 1rem; background: rgba(0,0,0,0.25); border: 1px solid var(--tp-border-dark);">
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <!-- Hierarchy Breadcrumbs -->
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.82rem; color: var(--tp-text-dark-secondary);">
              <span style="font-weight: 600; color: #fff;">ACADEMIC CONTEXT:</span>
              <span class="mono-chip" style="color: #38bdf8;">Dept: ${department.toUpperCase()}</span>
              <span>&rarr;</span>
              <span class="mono-chip" style="color: #a855f7;">Branch: ${branch.toUpperCase()}</span>
              <span>&rarr;</span>
              <span class="mono-chip" style="color: #ec4899;">Sem: ${semester.replace('sem_', '')}</span>
              ${activeSubject ? `<span>&rarr;</span><span class="mono-chip" style="color: var(--tp-primary);">${activeSubject.title}</span>` : ''}
              ${activeTopic ? `<span>&rarr;</span><span class="mono-chip" style="color: var(--tp-success);">${activeTopic.title}</span>` : ''}
            </div>

            <!-- Subject & Topic Navigation Buttons -->
            ${subjects.length > 0 ? `
              <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.25rem;">
                ${subjects.map(s => `
                  <button class="tp-btn ${s.id === activeSubject?.id ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm btn-select-subject" data-sub-id="${s.id}" style="white-space: nowrap; font-size: 0.8rem;">
                    ${s.code || ''}: ${s.title}
                  </button>
                `).join('')}
              </div>
            ` : ''}

            <!-- Topics Pills for Active Subject -->
            ${topics.length > 0 ? `
              <div style="display: flex; gap: 0.4rem; overflow-x: auto; padding-top: 0.25rem; border-top: 1px solid rgba(255,255,255,0.05);">
                <span style="font-size: 0.75rem; color: var(--tp-text-dark-muted); align-self: center; margin-right: 0.25rem;">TOPICS:</span>
                ${topics.map(t => `
                  <button class="tp-btn ${t.id === activeTopic?.id ? 'tp-btn-accent' : 'tp-btn-ghost'} tp-btn-xs btn-select-topic" data-top-id="${t.id}" style="white-space: nowrap; font-size: 0.75rem; border-radius: 9999px;">
                    ${t.title}
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Continue Watching Strip (if any in progress) -->
        ${continueWatchingList.length > 0 ? `
          <div class="tp-card tp-card-glass" style="padding: 1rem 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.1rem;">⏱️</span>
                <strong style="font-size: 0.95rem; color: #fff;">Continue Watching</strong>
              </div>
              <span class="mono-chip" style="font-size: 0.72rem; color: var(--tp-primary);">${continueWatchingList.length} IN PROGRESS</span>
            </div>
            <div style="display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 0.4rem;">
              ${continueWatchingList.map(cv => {
                const prog = progressMap[cv.id] || { currentTime: 0, duration: cv.duration };
                const pct = Math.min(100, Math.round((prog.currentTime / (prog.duration || cv.duration || 600)) * 100));
                return `
                  <div class="continue-card tp-btn-watch-trigger" data-vid-id="${cv.id}" style="min-width: 220px; max-width: 240px; background: rgba(255,255,255,0.03); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm); overflow: hidden; cursor: pointer; transition: transform 0.2s;">
                    <div style="position: relative; aspect-ratio: 16/9; background: #000;">
                      <img src="${cv.thumbnail_url || `https://img.youtube.com/vi/${cv.video_id}/hqdefault.jpg`}" alt="${cv.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: rgba(255,255,255,0.2);">
                        <div style="width: ${pct}%; height: 100%; background: var(--tp-primary);"></div>
                      </div>
                    </div>
                    <div style="padding: 0.6rem 0.75rem;">
                      <h4 style="font-size: 0.82rem; margin: 0 0 0.2rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff;">${cv.title}</h4>
                      <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--tp-text-dark-muted);">
                        <span>${pct}% watched</span>
                        <span>${cv.duration_label || `${Math.round((cv.duration || 600) / 60)}m`}</span>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Primary Video Player & Theater -->
        ${activeVideo ? `
          <div class="tp-card" style="padding: 0; overflow: hidden; border: 1px solid var(--tp-border-dark);">
            <div style="position: relative; background: #000; aspect-ratio: 16/9; width: 100%; max-height: 580px; display: flex; align-items: center; justify-content: center;">
              ${!this.isVideoUnavailable ? `
                <iframe id="learn-youtube-iframe"
                        src="https://www.youtube.com/embed/${activeVideo.video_id}?enablejsapi=1&rel=0&autoplay=0"
                        title="${activeVideo.title}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                        style="width: 100%; height: 100%; border: 0;">
                </iframe>
              ` : `
                <!-- Safe Unavailable Fallback UI -->
                <div style="padding: 2.5rem; text-align: center; max-width: 600px;">
                  <div style="font-size: 3rem; margin-bottom: 0.75rem;">⚠️</div>
                  <h3 class="headline-md" style="color: #fff; margin-bottom: 0.5rem;">Video currently unavailable</h3>
                  <p style="color: var(--tp-text-dark-secondary); font-size: 0.9rem; margin-bottom: 1.25rem;">
                    The external video player cannot be loaded in embedded mode. You can open the official lecture stream directly or switch to an alternate topic tutorial.
                  </p>
                  <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                    <a href="${activeVideo.url || `https://www.youtube.com/watch?v=${activeVideo.video_id}`}" target="_blank" rel="noopener noreferrer" class="tp-btn tp-btn-primary">
                      Watch on YouTube Directly ↗
                    </a>
                    <button id="btn-reset-player" class="tp-btn tp-btn-secondary">
                      Retry Embedded Player
                    </button>
                  </div>
                </div>
              `}
            </div>

            <!-- Player Details Strip -->
            <div style="padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 0.75rem;">
                <div>
                  <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.5rem;">
                    <span class="telemetry-chip" style="background: rgba(225,29,72,0.15); color: var(--tp-primary); border-color: var(--tp-primary); font-size: 0.75rem;">
                      ${activeVideo.channel || activeVideo.creator || 'Verified Resource'}
                    </span>
                    <span class="mono-chip" style="color: #38bdf8; font-size: 0.75rem;">
                      ${activeVideo.duration_label || `${Math.round((activeVideo.duration || 600) / 60)} MINS`}
                    </span>
                    <span class="mono-chip" style="color: var(--tp-success); font-size: 0.75rem;">
                      ${(activeVideo.difficulty || 'INTERMEDIATE').toUpperCase()}
                    </span>
                    <span class="mono-chip" style="color: #e2e8f0; font-size: 0.75rem;">
                      LANGUAGE: ${(activeVideo.language || 'en').toUpperCase()}
                    </span>
                    <button id="btn-toggle-unavailable-sim" class="tp-btn tp-btn-ghost tp-btn-xs" style="font-size: 0.7rem; color: var(--tp-text-dark-muted);">
                      ${this.isVideoUnavailable ? 'Show Normal Player' : 'Report Broken Video'}
                    </button>
                  </div>
                  <h2 class="headline-md" style="color: #fff; margin: 0 0 0.4rem 0;">${activeVideo.title}</h2>
                  <p style="color: var(--tp-text-dark-secondary); font-size: 0.92rem; line-height: 1.5; max-width: 900px;">
                    ${activeVideo.description}
                  </p>
                </div>

                <!-- Action Controls -->
                <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                  <button id="btn-hero-save" class="tp-btn tp-btn-secondary tp-btn-sm" data-vid="${activeVideo.id}">
                    ${savedVideoIds.includes(activeVideo.id) ? '★ Bookmarked' : '☆ Save Video'}
                  </button>
                  <button id="btn-hero-library" class="tp-btn tp-btn-secondary tp-btn-sm" data-vid="${activeVideo.id}">
                    ${libraryVideoIds.includes(activeVideo.id) ? '📚 In Library' : '📚 Add to Library'}
                  </button>
                  <button id="btn-hero-complete" class="tp-btn tp-btn-secondary tp-btn-sm" data-vid="${activeVideo.id}">
                    ${completedVideoIds.includes(activeVideo.id) ? '✓ Watched' : '○ Mark as Watched'}
                  </button>
                  <button id="btn-hero-share" class="tp-btn tp-btn-ghost tp-btn-sm" data-vid="${activeVideo.id}" data-url="${activeVideo.url}">
                    🔗 Share
                  </button>
                </div>
              </div>

              <!-- Recommendation Reason Banner -->
              <div style="padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); background: rgba(255,255,255,0.02); border-left: 3px solid var(--tp-primary); font-size: 0.84rem; color: #fff;">
                <span style="font-weight: 600; color: var(--tp-primary);">RECOMMENDED BECAUSE: </span>
                ${activeVideo.whyRecommended || 'Curriculum alignment with your engineering profile'}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- ─────────────────────────────────────────────────────────── -->
        <!-- SEARCH RESULTS VIEW (if search is active)                    -->
        <!-- ─────────────────────────────────────────────────────────── -->
        ${searchResults ? `
          <div class="tp-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 class="headline-md" style="color: #fff;">Search Results for “${this.searchQuery}”</h3>
              <span class="mono-chip" style="color: var(--tp-primary);">${searchResults.length} RESULTS</span>
            </div>
            ${searchResults.length === 0 ? `
              <div style="padding: 3rem 1.5rem; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 0.75rem;">🔍</div>
                <h4 style="color: #fff; margin-bottom: 0.4rem;">No matching video lectures found in ${branch.toUpperCase()}</h4>
                <p style="color: var(--tp-text-dark-secondary); font-size: 0.88rem;">Try searching for a different concept, subject name, or faculty instructor.</p>
              </div>
            ` : `
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
                ${searchResults.map(v => renderVideoCard(v)).join('')}
              </div>
            `}
          </div>
        ` : `
          <!-- ─────────────────────────────────────────────────────────── -->
          <!-- 6 CANONICAL NON-OVERLAPPING VIDEO SECTIONS                  -->
          <!-- ─────────────────────────────────────────────────────────── -->

          <!-- 1. Related to This Topic -->
          ${sections.relatedToTopic.length > 0 ? `
            <div class="tp-section">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-size: 1.2rem;">🎯</span>
                  <h3 class="headline-md" style="color: #fff; margin: 0;">Related to This Topic: ${activeTopic?.title || 'Current Topic'}</h3>
                </div>
                <span class="mono-chip" style="color: var(--tp-success);">${sections.relatedToTopic.length} TOPIC LECTURES</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
                ${sections.relatedToTopic.map(v => renderVideoCard(v)).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 2. More from This Subject -->
          ${sections.moreFromSubject.length > 0 ? `
            <div class="tp-section">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-size: 1.2rem;">📚</span>
                  <h3 class="headline-md" style="color: #fff; margin: 0;">More from This Subject: ${activeSubject?.title || 'Curriculum'}</h3>
                </div>
                <span class="mono-chip" style="color: #38bdf8;">${sections.moreFromSubject.length} SUBJECT VIDEOS</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
                ${sections.moreFromSubject.map(v => renderVideoCard(v)).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 3. Recommended for You (Highest overall relevance score) -->
          ${sections.recommendedForYou.length > 0 ? `
            <div class="tp-section">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-size: 1.2rem;">✨</span>
                  <h3 class="headline-md" style="color: #fff; margin: 0;">Recommended for You</h3>
                </div>
                <span class="mono-chip" style="color: var(--tp-primary);">ALIGNED TELEMETRY</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
                ${sections.recommendedForYou.map(v => renderVideoCard(v)).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 4. Recommended for Your Career Goal -->
          ${sections.recommendedForCareer.length > 0 ? `
            <div class="tp-section">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-size: 1.2rem;">💼</span>
                  <h3 class="headline-md" style="color: #fff; margin: 0;">Recommended for Your Career Goal: ${careerGoal}</h3>
                </div>
                <span class="mono-chip" style="color: #a855f7;">CAREER ACCELERATION</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
                ${sections.recommendedForCareer.map(v => renderVideoCard(v)).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 5. Based on Your Semester -->
          ${sections.basedOnSemester.length > 0 ? `
            <div class="tp-section">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-size: 1.2rem;">📅</span>
                  <h3 class="headline-md" style="color: #fff; margin: 0;">Based on Your Semester (Semester ${semester.replace('sem_', '')})</h3>
                </div>
                <span class="mono-chip" style="color: #ec4899;">SYLLABUS SYNC</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
                ${sections.basedOnSemester.map(v => renderVideoCard(v)).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 6. Based on Your Branch -->
          ${sections.basedOnBranch.length > 0 ? `
            <div class="tp-section">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-size: 1.2rem;">⚡</span>
                  <h3 class="headline-md" style="color: #fff; margin: 0;">Based on Your Branch (${branch.toUpperCase()})</h3>
                </div>
                <span class="mono-chip" style="color: var(--tp-primary);">${branch.toUpperCase()} DISCIPLINE</span>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
                ${sections.basedOnBranch.map(v => renderVideoCard(v)).join('')}
              </div>
            </div>
          ` : ''}

          <!-- EMPTY STATE: If genuinely no matching videos anywhere for this query -->
          ${allBranchVideos.length === 0 ? `
            <div class="tp-card" style="padding: 3.5rem 2rem; text-align: center;">
              <div style="font-size: 3.5rem; margin-bottom: 1rem;">📚</div>
              <h3 class="headline-md" style="color: #fff; margin-bottom: 0.5rem;">Content for this branch is currently being prepared.</h3>
              <p style="color: var(--tp-text-dark-secondary); max-width: 600px; margin: 0 auto 1.5rem auto; font-size: 0.92rem;">
                Curriculum resources and lecture modules for ${branch.toUpperCase()} are being curated by the academic department. We preserve your chosen branch and never replace it with unrelated branch content.
              </p>
              <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                <a href="#/profile" class="tp-btn tp-btn-primary tp-btn-sm">Adjust Academic Profile</a>
                <a href="#/dashboard" class="tp-btn tp-btn-secondary tp-btn-sm">Return to Dashboard</a>
              </div>
            </div>
          ` : ''}
        `}
      </div>
    `;

    this._bindEvents(container, activeVideo, progressMap, savedVideoIds, libraryVideoIds, completedVideoIds, subjects, topics);
  }

  static _bindEvents(container, activeVideo, progressMap, savedVideoIds, libraryVideoIds, completedVideoIds, subjects, topics) {
    // Subject selector buttons
    container.querySelectorAll('.btn-select-subject').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const subId = e.currentTarget.getAttribute('data-sub-id');
        this.activeVideoId = null;
        await learningContext.setSubject(subId);
        LearningPage.render(container);
      });
    });

    // Topic selector buttons
    container.querySelectorAll('.btn-select-topic').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const topId = e.currentTarget.getAttribute('data-top-id');
        this.activeVideoId = null;
        learningContext.setTopic(topId);
        LearningPage.render(container);
      });
    });

    // Watch video triggers from cards or continue-watching
    container.querySelectorAll('.btn-watch-video, .tp-btn-watch-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const vidId = e.currentTarget.getAttribute('data-vid') || e.currentTarget.getAttribute('data-vid-id');
        if (vidId) {
          this.activeVideoId = vidId;
          this.isVideoUnavailable = false;
          LearningPage.render(container);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // Save/Bookmark video button
    container.querySelectorAll('.btn-save-video, #btn-hero-save').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const vidId = e.currentTarget.getAttribute('data-vid');
        const idx = savedVideoIds.indexOf(vidId);
        if (idx >= 0) {
          savedVideoIds.splice(idx, 1);
          Toast.info('Video removed from bookmarks.');
        } else {
          savedVideoIds.push(vidId);
          Toast.success('Video bookmarked successfully!');
        }
        localStorage.setItem('TP_SAVED_VIDEOS', JSON.stringify(savedVideoIds));
        LearningPage.render(container);
      });
    });

    // Add to Library button
    container.querySelectorAll('.btn-library-video, #btn-hero-library').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const vidId = e.currentTarget.getAttribute('data-vid');
        const idx = libraryVideoIds.indexOf(vidId);
        if (idx >= 0) {
          libraryVideoIds.splice(idx, 1);
          Toast.info('Removed from Resource Library.');
        } else {
          libraryVideoIds.push(vidId);
          Toast.success('Added to My Resource Library!');
        }
        localStorage.setItem('TP_LIBRARY_VIDEOS', JSON.stringify(libraryVideoIds));
        LearningPage.render(container);
      });
    });

    // Mark as Watched button
    container.querySelectorAll('.btn-complete-video, #btn-hero-complete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const vidId = e.currentTarget.getAttribute('data-vid');
        const idx = completedVideoIds.indexOf(vidId);
        if (idx >= 0) {
          completedVideoIds.splice(idx, 1);
          Toast.info('Marked as unwatched.');
        } else {
          completedVideoIds.push(vidId);
          Toast.success('Marked as watched!');
        }
        localStorage.setItem('TP_COMPLETED_VIDEOS', JSON.stringify(completedVideoIds));
        LearningPage.render(container);
      });
    });

    // Share video link
    container.querySelectorAll('.btn-share-video, #btn-hero-share').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const url = e.currentTarget.getAttribute('data-url') || window.location.href;
        try {
          await navigator.clipboard.writeText(url);
          Toast.success('Lecture link copied to clipboard!');
        } catch {
          Toast.info(`Lecture URL: ${url}`);
        }
      });
    });

    // Toggle simulated unavailable state for testing
    const toggleUnavailBtn = container.querySelector('#btn-toggle-unavailable-sim');
    if (toggleUnavailBtn) {
      toggleUnavailBtn.addEventListener('click', () => {
        this.isVideoUnavailable = !this.isVideoUnavailable;
        LearningPage.render(container);
      });
    }

    const resetPlayerBtn = container.querySelector('#btn-reset-player');
    if (resetPlayerBtn) {
      resetPlayerBtn.addEventListener('click', () => {
        this.isVideoUnavailable = false;
        LearningPage.render(container);
      });
    }

    // Global search input
    const searchInput = container.querySelector('#learn-global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        clearTimeout(this._searchTimer);
        this._searchTimer = setTimeout(() => {
          LearningPage.render(container);
        }, 200);
      });
    }

    const clearSearchBtn = container.querySelector('#btn-clear-search');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        this.searchQuery = '';
        LearningPage.render(container);
      });
    }

    // Empty state action buttons
    const btnExploreTopics = container.querySelector('#btn-explore-topics');
    if (btnExploreTopics) {
      btnExploreTopics.addEventListener('click', () => {
        window.location.hash = '#/learning';
      });
    }

    const btnBrowseSubject = container.querySelector('#btn-browse-subject');
    if (btnBrowseSubject && subjects[0]) {
      btnBrowseSubject.addEventListener('click', async () => {
        await learningContext.setSubject(subjects[0].id);
        LearningPage.render(container);
      });
    }

    const btnBrowseBranch = container.querySelector('#btn-browse-branch');
    if (btnBrowseBranch) {
      btnBrowseBranch.addEventListener('click', () => {
        window.location.hash = '#/dashboard';
      });
    }

    const btnSearchVideos = container.querySelector('#btn-search-videos');
    if (btnSearchVideos) {
      btnSearchVideos.addEventListener('click', () => {
        const input = container.querySelector('#learn-global-search');
        if (input) input.focus();
      });
    }

    // Subscribe once to reactive updates from profile changes or context switches
    if (!this._subscribed) {
      this._subscribed = true;
      window.addEventListener('tp:recommendations_refresh', () => {
        if (this._activeContainer) LearningPage.render(this._activeContainer);
      });
      window.addEventListener('tp:profile_saved', () => {
        if (this._activeContainer) LearningPage.render(this._activeContainer);
      });
      learningContext.subscribe(() => {
        if (this._activeContainer) LearningPage.render(this._activeContainer);
      });
    }
  }
}
