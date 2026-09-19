/**
 * TECHPATH — CLASS DETAIL PAGE
 * Comprehensive syllabus, official YouTube engineering lecture walkthroughs,
 * interactive 3D engineering structural telemetry, teacher dossier, slot picker,
 * transparent fee breakdown, verified student reviews, and checkout trigger.
 */

import { authContext } from '../context/AuthContext.js';
import { ClassesEngine } from '../services/ClassesEngine.js';
import { ThreeDEngine } from '../services/ThreeDEngine.js';
import { PaymentModal } from '../components/PaymentModal.js';
import { PublicProfileModal } from '../components/PublicProfileModal.js';
import { Toast } from '../components/Toast.js';

export class ClassDetailPage {
  static async render(container, classId) {
    const user = authContext.getUser();
    const cid = typeof classId === 'object' && classId !== null ? (classId.classId || classId.id) : classId;
    const classDetail = await ClassesEngine.getClassDetail(cid);

    if (!classDetail) {
      container.innerHTML = `
        <div class="tp-card" style="text-align: center; padding: 4rem 1rem; max-width: 600px; margin: 2rem auto;">
          <h2 style="color: #fff; margin-bottom: 0.5rem;">Class Not Found</h2>
          <p style="color: var(--tp-text-dark-secondary); margin-bottom: 1.5rem;">The requested class listing does not exist or has been removed.</p>
          <a href="#/classes" class="tp-btn tp-btn-primary">Back to Classes Explorer</a>
        </div>
      `;
      return;
    }

    // Check if current user is teacher or already booked
    const access = await ClassesEngine.assertClassroomAccess(cid, user?.id);
    let selectedSlotId = classDetail.slots[0]?.id || null;
    let selectedVideoIndex = 0;
    let activeComponentIndex = 0;
    let show2D = false;
    let threeEngine = null;

    const videos = classDetail.youtube_videos || [];
    const model3d = classDetail.model_3d || null;
    const materials = classDetail.materials || [];
    const practiceQuestions = classDetail.practice_questions || [];
    const semNum = (classDetail.semester_id || 'sem_3').replace('sem_', '');

    function renderView() {
      const currentVideo = videos[selectedVideoIndex] || null;
      const activeComponent = model3d?.components?.[activeComponentIndex] || model3d?.components?.[0] || null;

      container.innerHTML = `
        <div class="tp-page" style="display: flex; flex-direction: column; gap: 2rem; max-width: 1200px; width: 100%; margin: 0 auto; padding-bottom: 4rem;">
          
          <!-- Back Navigation & Canonical Group Breadcrumbs -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; font-size: 0.85rem;">
              <a href="#/classes" class="tp-btn tp-btn-secondary" style="font-size: 0.82rem; padding: 0.35rem 0.85rem;">
                ← TechPath Classes
              </a>
              <span style="color: var(--tp-text-dark-muted);">/</span>
              <a href="#/classes?branch=${classDetail.branch_id}" style="color: #94a3b8; text-decoration: none;">${classDetail.branch_id.toUpperCase()}</a>
              <span style="color: var(--tp-text-dark-muted);">/</span>
              <a href="#/classes?branch=${classDetail.branch_id}&semester=${classDetail.semester_id}" style="color: #94a3b8; text-decoration: none;">Sem ${semNum}</a>
              <span style="color: var(--tp-text-dark-muted);">/</span>
              <span style="color: #cbd5e1; font-weight: 600;">${classDetail.subject}</span>
              ${classDetail.topic ? `<span style="color: var(--tp-text-dark-muted);">/</span><span style="color: #38bdf8;">${classDetail.topic}</span>` : ''}
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span class="telemetry-chip" style="font-size: 0.75rem; color: var(--tp-primary); border-color: var(--tp-primary);">
                ${classDetail.branch_id.toUpperCase()} &bull; Semester ${semNum}
              </span>
              <span class="mono-chip" style="font-size: 0.72rem; color: #38bdf8;">
                ${classDetail.class_type || 'Interactive'}
              </span>
            </div>
          </div>

          <!-- Enrolled Banner if Already Confirmed -->
          ${access.hasAccess ? `
            <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid var(--tp-success); border-radius: var(--radius-md); padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div>
                <strong style="color: #fff; font-size: 1.05rem; display: block;">
                  ${access.role === 'teacher' ? '👑 You are the Teacher for this Class' : '✅ You are Enrolled in this Class!'}
                </strong>
                <span style="font-size: 0.85rem; color: #86efac;">
                  ${access.role === 'teacher' ? 'You have full host permissions for this session.' : 'Your seat is confirmed and your interactive classroom is open.'}
                </span>
              </div>
              <a href="#/classes/${classDetail.id}/classroom" class="tp-btn tp-btn-primary" style="padding: 0.65rem 1.5rem;">
                Enter Classroom Now →
              </a>
            </div>
          ` : ''}

          <!-- Main Layout: 2 Columns (Curriculum + Learning Lab & Booking Sidebar) -->
          <div style="display: grid; grid-template-columns: 1fr 380px; gap: 1.75rem; align-items: start;" class="class-detail-grid">
            
            <!-- Left Column: Syllabus, YouTube, 3D Lab, Materials, Reviews -->
            <div style="display: flex; flex-direction: column; gap: 1.75rem;">
              
              <!-- 1. Class Header Overview Card -->
              <div class="tp-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.75rem;">
                  <h1 class="headline-lg" style="color: #fff; line-height: 1.3;">${classDetail.title}</h1>
                </div>

                <div style="display: flex; gap: 1rem; align-items: center; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 1.25rem; flex-wrap: wrap;">
                  <span>📖 <strong>${classDetail.subject}</strong></span>
                  <span>⚡ Topic: <strong>${classDetail.topic}</strong></span>
                  <span style="color: #f59e0b;">★ <strong>${(classDetail.rating || 5.0).toFixed(1)}</strong> (${classDetail.reviews_count || classDetail.reviews?.length || 0} reviews)</span>
                  <span>⏱️ ${classDetail.duration} Minutes</span>
                  <span>🗣️ ${classDetail.language}</span>
                </div>

                <p style="color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 0;">
                  ${classDetail.description}
                </p>
              </div>

              <!-- 2. What You'll Learn & Prerequisites -->
              <div class="tp-card">
                <h3 class="headline-md" style="color: #fff; font-size: 1.15rem; margin-bottom: 1rem;">What You'll Learn</h3>
                <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem;">
                  ${(classDetail.what_will_learn || []).map(outcome => `
                    <div style="display: flex; align-items: flex-start; gap: 0.65rem; font-size: 0.9rem; color: #f1f5f9;">
                      <span style="color: var(--tp-primary); font-size: 1.1rem; line-height: 1;">✓</span>
                      <span>${outcome}</span>
                    </div>
                  `).join('')}
                </div>

                ${classDetail.prerequisites ? `
                  <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--tp-border-dark);">
                    <strong style="color: #94a3b8; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.35rem;">Prerequisites</strong>
                    <p style="color: var(--tp-text-dark-secondary); font-size: 0.88rem; margin: 0;">${classDetail.prerequisites}</p>
                  </div>
                ` : ''}
              </div>

              <!-- 3. OFFICIAL YOUTUBE VIDEO LECTURE SECTION -->
              <div class="tp-card" id="class-youtube-section" style="border: 1px solid rgba(239, 68, 68, 0.25);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <span style="font-size: 1.25rem; color: #ef4444;">▶</span>
                    <h3 class="headline-md" style="color: #fff; font-size: 1.15rem; margin: 0;">
                      Engineering Lecture & Video Walkthrough
                    </h3>
                  </div>
                  <span class="telemetry-chip" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.4); font-size: 0.72rem;">
                    OFFICIAL YOUTUBE EMBED
                  </span>
                </div>

                ${videos.length === 0 ? `
                  <div style="background: rgba(255,255,255,0.02); border: 1px dashed var(--tp-border-dark); border-radius: var(--radius-sm); padding: 2rem; text-align: center;">
                    <p style="color: var(--tp-text-dark-secondary); margin: 0; font-size: 0.9rem;">
                      Curated engineering video lecture is currently being prepared for this topic.
                    </p>
                  </div>
                ` : `
                  <!-- Video Tabs (if multiple videos exist) -->
                  ${videos.length > 1 ? `
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; overflow-x: auto; padding-bottom: 0.25rem;">
                      ${videos.map((vid, idx) => `
                        <button class="tp-btn ${selectedVideoIndex === idx ? 'tp-btn-primary' : 'tp-btn-ghost'} yt-video-tab" data-index="${idx}" style="font-size: 0.78rem; padding: 0.35rem 0.75rem; white-space: nowrap;">
                          ${idx + 1}. ${vid.title.substring(0, 35)}...
                        </button>
                      `).join('')}
                    </div>
                  ` : ''}

                  <!-- 16:9 Responsive Video Player Container -->
                  <div style="position: relative; width: 100%; aspect-ratio: 16 / 9; min-height: 220px; background: #000; border-radius: 8px; overflow: hidden; border: 1px solid var(--tp-border-dark); box-shadow: 0 8px 24px rgba(0,0,0,0.5);">
                    ${currentVideo ? `
                      <iframe 
                        id="class-yt-iframe"
                        src="https://www.youtube.com/embed/${currentVideo.video_id}?enablejsapi=1&rel=0" 
                        title="${currentVideo.title}"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;">
                      </iframe>
                    ` : `
                      <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #94a3b8;">
                        Video unavailable
                      </div>
                    `}
                  </div>

                  <!-- Video Metadata & Fallback State -->
                  ${currentVideo ? `
                    <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(0,0,0,0.25); border-radius: 6px; border: 1px solid var(--tp-border-dark);">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.4rem;">
                        <h4 style="color: #fff; font-size: 1rem; margin: 0;">${currentVideo.title}</h4>
                        <div style="display: flex; gap: 0.5rem; align-items: center; font-size: 0.75rem;">
                          <span class="mono-chip" style="color: #38bdf8;">⏱️ ${currentVideo.duration}</span>
                          <span class="mono-chip" style="color: #10b981;">CC: ${currentVideo.captions || 'Available'}</span>
                        </div>
                      </div>
                      <p style="color: #cbd5e1; font-size: 0.85rem; line-height: 1.5; margin: 0 0 0.75rem 0;">
                        ${currentVideo.description}
                      </p>
                      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--tp-text-dark-muted); border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.5rem;">
                        <span>Source: Official Engineering Channel</span>
                        <a href="${currentVideo.url || `https://www.youtube.com/watch?v=${currentVideo.video_id}`}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: none; display: flex; align-items: center; gap: 0.3rem;">
                          Watch on YouTube ↗
                        </a>
                      </div>
                    </div>
                  ` : ''}
                `}
              </div>

              <!-- 4. DEDICATED 3D ENGINEERING SECTION -->
              <div class="tp-card" id="class-3d-section" style="border: 1px solid rgba(56, 189, 248, 0.25);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <span style="font-size: 1.25rem; color: #38bdf8;">🔬</span>
                    <div>
                      <h3 class="headline-md" style="color: #fff; font-size: 1.15rem; margin: 0;">
                        3D Engineering Structural Simulation
                      </h3>
                      <span style="font-size: 0.78rem; color: var(--tp-text-dark-secondary);">
                        Interactive structural model demonstrating components, signal flows, and real-world industrial applications.
                      </span>
                    </div>
                  </div>
                  ${model3d ? `
                    <button id="class-toggle-2d-btn" class="tp-btn tp-btn-secondary" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;">
                      ${show2D ? '🧊 Switch to 3D Viewport' : '📐 Switch to Technical Schematic (2D)'}
                    </button>
                  ` : ''}
                </div>

                ${!model3d ? `
                  <div style="background: rgba(255,255,255,0.02); border: 1px dashed var(--tp-border-dark); border-radius: var(--radius-sm); padding: 2.5rem 1.5rem; text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚙️</div>
                    <h4 style="color: #fff; font-size: 1rem; margin-bottom: 0.35rem;">3D Model In Preparation</h4>
                    <p style="color: var(--tp-text-dark-secondary); margin: 0 auto; font-size: 0.88rem; max-width: 500px;">
                      Content for this branch and semester is currently being prepared.
                    </p>
                  </div>
                ` : `
                  <!-- Model Info Strip -->
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                    <div>
                      <strong style="color: #38bdf8; font-size: 1rem;">${model3d.name}</strong>
                      <span style="color: var(--tp-text-dark-muted); font-size: 0.78rem; margin-left: 0.5rem;">(${model3d.model_type?.toUpperCase()})</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                      <span class="telemetry-chip" style="font-size: 0.7rem; color: #10b981; border-color: #10b981;">
                        ${model3d.difficulty || 'Intermediate'}
                      </span>
                      <span class="mono-chip" style="font-size: 0.7rem;">
                        ${model3d.specialization || 'Engineering'}
                      </span>
                    </div>
                  </div>

                  <!-- 3D / 2D Viewport Container -->
                  <div style="position: relative; width: 100%; min-height: 400px; background: #070a12; border-radius: 8px; overflow: hidden; border: 1px solid var(--tp-border-dark);">
                    
                    <!-- 3D Canvas Root -->
                    <div id="class-3d-canvas-root" style="width: 100%; height: 400px; display: ${show2D ? 'none' : 'block'}; cursor: grab;"></div>

                    <!-- 2D Schematic Canvas Root -->
                    <div id="class-2d-canvas-root" style="display: ${show2D ? 'flex' : 'none'}; flex-direction: column; gap: 1rem; padding: 1.25rem; background: #070a12; min-height: 400px;">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #38bdf8; font-weight: 600; font-size: 0.9rem;">Accessible Technical Schematic</span>
                        <span class="mono-chip" style="color: #94a3b8; font-size: 0.72rem;">2D VECTOR VIEW</span>
                      </div>
                      ${model3d.svg_diagram ? `
                        <div style="width: 100%; border-radius: 6px; overflow: hidden; border: 1px solid var(--tp-border-dark);">
                          ${model3d.svg_diagram}
                        </div>
                      ` : `
                        <div style="padding: 2rem; text-align: center; color: var(--tp-text-dark-secondary);">
                          2D diagram view rendered for accessibility.
                        </div>
                      `}
                    </div>

                    <!-- Viewport Floating HUD Controls -->
                    <div style="position: absolute; bottom: 12px; left: 12px; right: 12px; display: ${show2D ? 'none' : 'flex'}; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); padding: 0.4rem 0.75rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; color: #cbd5e1; z-index: 10; flex-wrap: wrap; gap: 0.5rem;">
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span>EXPLODE:</span>
                        <input id="class-explode-slider" type="range" min="0" max="1" step="0.02" value="0" style="width: 100px; accent-color: var(--tp-primary);" />
                      </div>
                      <div style="display: flex; gap: 0.4rem;">
                        <button id="class-cross-sec-btn" class="tp-btn tp-btn-ghost" style="padding: 0.2rem 0.55rem; font-size: 0.72rem;">
                          ◧ Cross-Section
                        </button>
                        <button id="class-reset-view-btn" class="tp-btn tp-btn-ghost" style="padding: 0.2rem 0.55rem; font-size: 0.72rem;">
                          ⟲ Reset View
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Interactive Component Inspector -->
                  <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--tp-border-dark);">
                    <h4 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.75rem;">Interactive Component Telemetry</h4>
                    
                    <!-- Component Tabs -->
                    <div style="display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
                      ${(model3d.components || []).map((comp, idx) => `
                        <button class="tp-btn ${activeComponentIndex === idx ? 'tp-btn-primary' : 'tp-btn-ghost'} class-comp-tab-btn" data-index="${idx}" style="font-size: 0.75rem; padding: 0.3rem 0.65rem; white-space: nowrap;">
                          ${comp.name}
                        </button>
                      `).join('')}
                    </div>

                    <!-- Component Details Card -->
                    ${activeComponent ? `
                      <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--tp-border-dark); border-radius: 6px; padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                          <strong style="color: #38bdf8; font-size: 0.95rem;">${activeComponent.name}</strong>
                          <span class="mono-chip" style="font-size: 0.7rem; color: #10b981;">ACTIVE TELEMETRY</span>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.82rem;">
                          <div>
                            <span style="color: #94a3b8; display: block; font-weight: 600;">WHAT IT IS:</span>
                            <span style="color: #e2e8f0;">${activeComponent.what}</span>
                          </div>
                          <div>
                            <span style="color: #94a3b8; display: block; font-weight: 600;">WHY IT MATTERS:</span>
                            <span style="color: #e2e8f0;">${activeComponent.why}</span>
                          </div>
                          <div>
                            <span style="color: #94a3b8; display: block; font-weight: 600;">SIGNAL INPUTS:</span>
                            <span style="color: #e2e8f0; font-family: monospace;">${activeComponent.inputs || 'System Bus Signal'}</span>
                          </div>
                          <div>
                            <span style="color: #94a3b8; display: block; font-weight: 600;">SIGNAL OUTPUTS:</span>
                            <span style="color: #e2e8f0; font-family: monospace;">${activeComponent.outputs || 'Calculated Metric'}</span>
                          </div>
                        </div>

                        ${activeComponent.interview_questions && activeComponent.interview_questions.length > 0 ? `
                          <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.06); font-size: 0.8rem;">
                            <strong style="color: #f59e0b; display: block; margin-bottom: 0.25rem;">Key Technical Interview Focus:</strong>
                            <ul style="margin: 0; padding-left: 1.2rem; color: #cbd5e1;">
                              ${activeComponent.interview_questions.map(q => `<li>${q}</li>`).join('')}
                            </ul>
                          </div>
                        ` : ''}
                      </div>
                    ` : ''}

                    <!-- Real World Applications & Signal Flow -->
                    <div style="margin-top: 1rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.82rem;">
                      ${model3d.signal_flow ? `
                        <div style="background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 6px; border: 1px solid var(--tp-border-dark);">
                          <strong style="color: #38bdf8; display: block; margin-bottom: 0.35rem;">⚡ Signal & Data Flow:</strong>
                          <span style="color: #cbd5e1; line-height: 1.5; font-family: monospace; font-size: 0.78rem;">${model3d.signal_flow}</span>
                        </div>
                      ` : ''}
                      ${model3d.real_world_applications && model3d.real_world_applications.length > 0 ? `
                        <div style="background: rgba(255,255,255,0.02); padding: 0.75rem; border-radius: 6px; border: 1px solid var(--tp-border-dark);">
                          <strong style="color: #10b981; display: block; margin-bottom: 0.35rem;">🏭 Real-World Deployments:</strong>
                          <ul style="margin: 0; padding-left: 1.2rem; color: #cbd5e1; line-height: 1.4;">
                            ${model3d.real_world_applications.map(app => `<li>${app}</li>`).join('')}
                          </ul>
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `}
              </div>

              <!-- 5. STUDY MATERIALS & PRACTICE QUESTIONS SECTION -->
              <div class="tp-card">
                <h3 class="headline-md" style="color: #fff; font-size: 1.15rem; margin-bottom: 1rem;">
                  Study Materials & Practice Drills
                </h3>

                <!-- Materials List -->
                ${materials.length > 0 ? `
                  <div style="margin-bottom: 1.25rem;">
                    <strong style="color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.5rem;">
                      Class Notes & Handouts
                    </strong>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                      ${materials.map(mat => `
                        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: 6px; padding: 0.65rem 0.85rem; font-size: 0.85rem;">
                          <div style="display: flex; align-items: center; gap: 0.6rem;">
                            <span style="font-size: 1rem;">📄</span>
                            <div>
                              <strong style="color: #fff; display: block;">${mat.title}</strong>
                              <span style="color: var(--tp-text-dark-muted); font-size: 0.75rem;">${mat.type || 'Resource'} &bull; ${mat.size || 'PDF'}</span>
                            </div>
                          </div>
                          <button class="tp-btn tp-btn-secondary" style="font-size: 0.75rem; padding: 0.25rem 0.65rem;" onclick="alert('Downloading ${mat.title}...');">
                            Download
                          </button>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                <!-- Practice Questions -->
                ${practiceQuestions.length > 0 ? `
                  <div>
                    <strong style="color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.5rem;">
                      Topic Practice Drills
                    </strong>
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                      ${practiceQuestions.map((pq, idx) => `
                        <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--tp-border-dark); border-radius: 6px; padding: 0.85rem;">
                          <p style="color: #f1f5f9; font-weight: 500; font-size: 0.88rem; margin: 0 0 0.5rem 0;">
                            Q${idx + 1}: ${pq.question}
                          </p>
                          <details style="font-size: 0.82rem; color: #38bdf8; cursor: pointer;">
                            <summary style="font-weight: 600; outline: none;">Reveal Verified Answer</summary>
                            <p style="margin: 0.5rem 0 0 0; color: #86efac; background: rgba(16,185,129,0.08); padding: 0.6rem; border-radius: 4px; border-left: 3px solid #10b981; line-height: 1.5;">
                              ${pq.answer}
                            </p>
                          </details>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>

              <!-- 6. Teacher Dossier Card -->
              <div class="tp-card tp-card-glass">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <h3 class="headline-md" style="color: #fff; font-size: 1.15rem;">About Your Teacher</h3>
                  <span class="telemetry-chip" style="font-size: 0.72rem; color: ${classDetail.teacher_verification === 'Teacher Verified' ? '#10b981' : '#f59e0b'}; border-color: ${classDetail.teacher_verification === 'Teacher Verified' ? '#10b981' : '#f59e0b'};">
                    ${classDetail.teacher_verification || 'Verified Instructor'}
                  </span>
                </div>

                <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                  <div style="width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--tp-primary), var(--tp-accent)); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: #fff;">
                    ${classDetail.teacher_name ? classDetail.teacher_name.charAt(0) : 'T'}
                  </div>
                  <div>
                    <h4 style="color: #fff; font-size: 1.1rem; margin: 0 0 0.2rem 0;">${classDetail.teacher_name}</h4>
                    <span style="font-family: monospace; font-size: 0.82rem; color: #38bdf8;">${classDetail.teacher_techpath_id || 'TP-TEACHER'}</span>
                  </div>
                </div>

                <p style="color: var(--tp-text-dark-secondary); font-size: 0.88rem; line-height: 1.5; margin-bottom: 1rem;">
                  ${classDetail.teacherProfile?.description || 'Senior engineering peer dedicated to structured, intuitive peer learning.'}
                </p>

                ${classDetail.teacherProfile?.teaching_experience ? `
                  <div style="margin-bottom: 1rem; font-size: 0.85rem; color: #cbd5e1;">
                    <strong style="color: #94a3b8; display: block; font-size: 0.78rem; text-transform: uppercase;">Experience & Background</strong>
                    ${classDetail.teacherProfile.teaching_experience}
                  </div>
                ` : ''}

                <!-- Connect & Messaging Actions -->
                <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                  <button id="view-teacher-profile-btn" class="tp-btn tp-btn-secondary" style="font-size: 0.82rem;">
                    👤 View Teacher Dossier
                  </button>
                  <a href="#/connect/chat/${classDetail.teacher_id}" class="tp-btn tp-btn-secondary" style="font-size: 0.82rem;">
                    💬 Message Teacher
                  </a>
                </div>
              </div>

              <!-- 7. Verified Student Reviews Section -->
              <div class="tp-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                  <h3 class="headline-md" style="color: #fff; font-size: 1.15rem;">Verified Student Reviews</h3>
                  <span class="mono-chip" style="color: #f59e0b;">★ ${(classDetail.rating || 5.0).toFixed(1)} &bull; ${classDetail.reviews?.length || 0} RATINGS</span>
                </div>

                ${!classDetail.reviews || classDetail.reviews.length === 0 ? `
                  <p style="color: var(--tp-text-dark-secondary); font-size: 0.85rem; font-style: italic;">
                    No reviews submitted yet. Enrolled students can leave verified reviews after session completion.
                  </p>
                ` : `
                  <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${classDetail.reviews.map(rev => `
                      <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm); padding: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
                          <span style="color: #fff; font-weight: 600; font-size: 0.88rem;">${rev.student_name}</span>
                          <span style="color: #f59e0b; font-size: 0.85rem;">${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}</span>
                        </div>
                        <p style="color: #cbd5e1; font-size: 0.85rem; line-height: 1.5; margin: 0;">“${rev.review}”</p>
                        <span style="font-size: 0.72rem; color: var(--tp-text-dark-muted); display: block; margin-top: 0.4rem;">
                          Verified Student &bull; ${new Date(rev.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    `).join('')}
                  </div>
                `}
              </div>

            </div>

            <!-- Right Column: Booking Slot Picker & Checkout Sticky Sidebar -->
            <div style="display: flex; flex-direction: column; gap: 1.25rem; position: sticky; top: 1.5rem;">
              <div class="tp-card tp-card-glass" style="border: 1px solid rgba(225,29,72,0.35);">
                <h3 style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Select Schedule & Book</h3>

                <!-- Schedule Slots -->
                <label class="tp-form-label" style="margin-bottom: 0.5rem;">Available Time Slots</label>
                ${!classDetail.slots || classDetail.slots.length === 0 ? `
                  <p style="color: #fca5a5; font-size: 0.85rem;">All sessions are currently fully booked. Check back soon for new schedules.</p>
                ` : `
                  <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem;">
                    ${classDetail.slots.map((slot) => `
                      <label class="slot-select-option" style="padding: 0.75rem; border: 1px solid ${selectedSlotId === slot.id ? 'var(--tp-primary)' : 'var(--tp-border-dark)'}; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: ${selectedSlotId === slot.id ? 'rgba(225,29,72,0.1)' : 'rgba(0,0,0,0.3)'};">
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                          <input type="radio" name="slot-choice" value="${slot.id}" ${selectedSlotId === slot.id ? 'checked' : ''} style="accent-color: var(--tp-primary);" />
                          <div>
                            <strong style="color: #fff; font-size: 0.88rem; display: block;">${slot.date}</strong>
                            <span style="color: var(--tp-text-dark-secondary); font-size: 0.78rem;">${slot.start_time} - ${slot.end_time} IST</span>
                          </div>
                        </div>
                        <span class="telemetry-chip" style="font-size: 0.7rem;">
                          ${slot.seats_total - slot.seats_booked} seats left
                        </span>
                      </label>
                    `).join('')}
                  </div>
                `}

                <!-- Transparent Price Calculation (Exact Teacher Price, Zero Additional Fees) -->
                <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">
                    <span>Class price:</span>
                    <span style="color: #fff; font-weight: 500;">${classDetail.price === 0 ? 'Free' : `₹${classDetail.price}`}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">
                    <span>Platform fee:</span>
                    <span style="color: #10b981; font-weight: 500;">₹0</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">
                    <span>Service fee:</span>
                    <span style="color: #10b981; font-weight: 500;">₹0</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">
                    <span>Convenience fee:</span>
                    <span style="color: #10b981; font-weight: 500;">₹0</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">
                    <span>External fee:</span>
                    <span style="color: #10b981; font-weight: 500;">₹0</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.35rem;">
                    <span>Additional fees:</span>
                    <span style="color: #10b981; font-weight: 500;">₹0</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 700; color: #fff; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.6rem; margin-top: 0.6rem;">
                    <span>Total payable:</span>
                    <span style="color: var(--tp-primary);">${classDetail.price === 0 ? 'Free' : `₹${classDetail.price}`}</span>
                  </div>
                </div>

                <!-- Cancellation Policy Guarantee -->
                <div style="font-size: 0.75rem; color: var(--tp-text-dark-secondary); line-height: 1.4; margin-bottom: 1.25rem; background: rgba(255,255,255,0.02); padding: 0.65rem; border-radius: 6px; border: 1px solid var(--tp-border-dark);">
                  🛡️ <strong>Refund Guarantee:</strong> ${classDetail.cancellation_policy || 'Full refund up to 2 hours before scheduled start.'}
                </div>

                <!-- Booking Trigger -->
                ${access.hasAccess ? `
                  <a href="#/classes/${classId}/classroom" class="tp-btn tp-btn-primary" style="width: 100%; text-align: center; padding: 0.75rem; font-size: 1rem;">
                    Enter Classroom →
                  </a>
                ` : `
                  <button id="book-now-checkout-btn" class="tp-btn tp-btn-primary" style="width: 100%; padding: 0.75rem; font-size: 1rem; font-weight: 600;" ${!classDetail.slots || classDetail.slots.length === 0 ? 'disabled' : ''}>
                    ${classDetail.price === 0 ? 'Enroll for Free →' : `Book & Pay ₹${classDetail.price} →`}
                  </button>
                `}
              </div>
            </div>

          </div>
        </div>
      `;

      bindEvents();
    }

    function bindEvents() {
      // 1. Mount 3D Engine if canvas container exists and not in 2D mode
      const canvasRoot = container.querySelector('#class-3d-canvas-root');
      if (canvasRoot && model3d && !show2D) {
        if (threeEngine) {
          threeEngine.destroy();
          threeEngine = null;
        }
        try {
          threeEngine = new ThreeDEngine(canvasRoot);
          threeEngine.loadModel(model3d);
        } catch (e) {
          console.warn('3D initialization failed, falling back to 2D view', e);
        }
      }

      // 2. Video Tabs
      container.querySelectorAll('.yt-video-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedVideoIndex = parseInt(btn.getAttribute('data-index'), 10);
          renderView();
        });
      });

      // 3. 2D / 3D Mode Toggle
      const toggle2DBtn = container.querySelector('#class-toggle-2d-btn');
      if (toggle2DBtn) {
        toggle2DBtn.addEventListener('click', () => {
          show2D = !show2D;
          renderView();
        });
      }

      // 4. 3D HUD Controls: Explode Slider
      const explodeSlider = container.querySelector('#class-explode-slider');
      if (explodeSlider && threeEngine) {
        explodeSlider.addEventListener('input', (e) => {
          threeEngine.setExplode(parseFloat(e.target.value));
        });
      }

      // 5. 3D HUD Controls: Cross Section
      const crossBtn = container.querySelector('#class-cross-sec-btn');
      if (crossBtn && threeEngine) {
        crossBtn.addEventListener('click', () => {
          const isActive = threeEngine.toggleCrossSection();
          crossBtn.style.color = isActive ? 'var(--tp-primary)' : 'inherit';
        });
      }

      // 6. 3D HUD Controls: Reset View
      const resetBtn = container.querySelector('#class-reset-view-btn');
      if (resetBtn && threeEngine) {
        resetBtn.addEventListener('click', () => {
          threeEngine.resetView();
          if (explodeSlider) explodeSlider.value = 0;
        });
      }

      // 7. Component Inspector Tabs
      container.querySelectorAll('.class-comp-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeComponentIndex = parseInt(btn.getAttribute('data-index'), 10);
          renderView();
        });
      });

      // 8. Slot Selection Listener
      container.querySelectorAll('input[name="slot-choice"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          selectedSlotId = e.target.value;
          container.querySelectorAll('.slot-select-option').forEach(el => {
            el.style.borderColor = 'var(--tp-border-dark)';
            el.style.background = 'rgba(0,0,0,0.3)';
          });
          const parent = e.target.closest('.slot-select-option');
          if (parent) {
            parent.style.borderColor = 'var(--tp-primary)';
            parent.style.background = 'rgba(225,29,72,0.1)';
          }
        });
      });

      // 9. View Teacher Profile Modal
      container.querySelector('#view-teacher-profile-btn')?.addEventListener('click', () => {
        PublicProfileModal.open(classDetail.teacher_id, user?.id);
      });

      // 10. Booking & Payment Initiation
      const bookBtn = container.querySelector('#book-now-checkout-btn');
      if (bookBtn) {
        bookBtn.addEventListener('click', async () => {
          if (!user) {
            Toast.error('Please sign in to book an engineering class.');
            window.location.hash = '#/signin';
            return;
          }

          if (!selectedSlotId) {
            Toast.error('Please select an available schedule slot.');
            return;
          }

          // Rule 12: Completely free classes bypass payment gateway entirely
          if (Number(classDetail.price) === 0) {
            bookBtn.disabled = true;
            bookBtn.textContent = 'Enrolling in Free Class...';
            try {
              await ClassesEngine.enrollFreeClass({
                studentId: user.id,
                classId: cid,
                slotId: selectedSlotId,
                studentName: user.name || user.profile?.full_name || 'Engineering Student',
                studentEmail: user.email
              });
              Toast.success('Enrolled successfully! Free classroom unlocked.');
              ClassDetailPage.render(container, cid);
            } catch (err) {
              console.error('Free enrollment error:', err);
              Toast.error(err.message || 'Free enrollment failed.');
              bookBtn.disabled = false;
              bookBtn.textContent = 'Enroll for Free →';
            }
            return;
          }

          bookBtn.disabled = true;
          bookBtn.textContent = 'Initiating Secure Order...';

          try {
            const bookingSession = await ClassesEngine.initiateBooking({
              studentId: user.id,
              classId: cid,
              slotId: selectedSlotId,
              studentName: user.name || user.profile?.full_name || 'Engineering Student',
              studentEmail: user.email
            });

            // Launch secure payment modal
            PaymentModal.open({
              booking: bookingSession.booking,
              order: bookingSession.order,
              classDetail,
              slot: bookingSession.slot,
              onComplete: () => {
                ClassDetailPage.render(container, cid);
              }
            });
          } catch (err) {
            console.error('Booking error:', err);
            Toast.error(err.message || 'Failed to initiate booking.');
          } finally {
            bookBtn.disabled = false;
            bookBtn.textContent = classDetail.price === 0 ? 'Enroll for Free →' : `Book & Pay ₹${classDetail.price} →`;
          }
        });
      }
    }

    renderView();
  }
}
