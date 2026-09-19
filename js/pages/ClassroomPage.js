/**
 * TECHPATH — PRIVATE INTERACTIVE CLASSROOM
 * Strictly gated by confirmed paid booking or teacher ownership.
 * Live meeting portal, interactive syllabus checklist, class materials,
 * real-time class chat, and teacher attendance/completion controls.
 */

import { authContext } from '../context/AuthContext.js';
import { ClassesEngine } from '../services/ClassesEngine.js';
import { dbStore } from '../db/store.js';
import { Toast } from '../components/Toast.js';

export class ClassroomPage {
  static async render(container, classId) {
    const user = authContext.getUser();

    // 1. Strict Security Guard (Requirement 10 & 23)
    const access = await ClassesEngine.assertClassroomAccess(classId, user?.id);

    if (!access.hasAccess) {
      container.innerHTML = `
        <div class="tp-card" style="border-color: var(--tp-error); text-align: center; padding: 4rem 1.5rem; max-width: 600px; margin: 3rem auto;">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">🔒</div>
          <h2 class="headline-lg" style="color: var(--tp-error); margin-bottom: 0.5rem;">403 Access Denied</h2>
          <h3 style="color: #fff; font-size: 1.15rem; margin-bottom: 0.75rem;">Private Classroom Authorization Required</h3>
          <p style="color: var(--tp-text-dark-secondary); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Only students with confirmed, verified paid bookings or the class teacher are permitted into this interactive classroom.
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center;">
            <a href="#/classes/${classId}" class="tp-btn tp-btn-primary" style="padding: 0.65rem 1.5rem;">
              View Class & Book Seat →
            </a>
            <a href="#/classes" class="tp-btn tp-btn-secondary">
              Back to Explorer
            </a>
          </div>
        </div>
      `;
      return;
    }

    const cls = access.classDetail;
    const isTeacher = access.role === 'teacher';
    const students = await dbStore.filter('class_students', s => s.class_id === classId);

    container.innerHTML = `
      <div class="tp-page" style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 1200px; width: 100%;">
        <!-- Header Banner -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.35rem; color: #10b981; border-color: #10b981;">
              <span class="pulse-beacon" style="background: #10b981;"></span> ENCRYPTED CLASSROOM ACTIVE // ${isTeacher ? 'HOST MODE' : 'STUDENT MODE'}
            </div>
            <h1 class="headline-lg" style="margin: 0; color: #fff;">${cls.title}</h1>
            <span style="font-size: 0.85rem; color: var(--tp-text-dark-secondary);">
              Instructor: <strong style="color: #fff;">${cls.teacher_name}</strong> &bull; ${cls.branch_id.toUpperCase()} &bull; ${cls.language}
            </span>
          </div>

          <div style="display: flex; gap: 0.6rem; align-items: center;">
            ${isTeacher ? `
              <button id="mark-complete-btn" class="tp-btn tp-btn-primary" style="font-size: 0.85rem; background: #10b981; border-color: #10b981;">
                ✓ Complete Session
              </button>
            ` : ''}
            <a href="#/classes/my-classes" class="tp-btn tp-btn-secondary" style="font-size: 0.85rem;">
              Exit Classroom
            </a>
          </div>
        </div>

        <!-- Main Classroom Layout (Video/Board + Interactive Studio) -->
        <div style="display: grid; grid-template-columns: 1fr 360px; gap: 1.5rem; align-items: start;" class="classroom-layout-grid">
          
          <!-- Left Main Area: Virtual Video Portal & Materials -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Virtual Video & Screen Stream -->
            <div class="tp-card" style="background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-md); overflow: hidden; padding: 0;">
              <div style="height: 380px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; background: radial-gradient(circle at center, #1a1e29 0%, #090a0f 100%);">
                <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--tp-primary), var(--tp-accent)); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; color: #fff; box-shadow: 0 0 30px rgba(225,29,72,0.4); margin-bottom: 1rem;">
                  👨‍🏫
                </div>
                <h3 style="color: #fff; font-size: 1.2rem; margin-bottom: 0.35rem;">${cls.teacher_name} is Presenting</h3>
                <span class="telemetry-chip" style="font-size: 0.75rem; color: #10b981; border-color: #10b981;">
                  STREAMING HD 1080P // LOW LATENCY
                </span>

                <!-- Meeting Room Controls Toolbar -->
                <div style="position: absolute; bottom: 1.25rem; display: flex; gap: 0.75rem; background: rgba(0,0,0,0.75); padding: 0.5rem 1rem; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(6px);">
                  <button id="ctrl-mic-btn" class="tp-btn tp-btn-ghost" style="padding: 0.4rem 0.75rem; font-size: 0.9rem;" title="Toggle Mic">🎤 On</button>
                  <button id="ctrl-cam-btn" class="tp-btn tp-btn-ghost" style="padding: 0.4rem 0.75rem; font-size: 0.9rem;" title="Toggle Camera">📹 On</button>
                  <button id="ctrl-share-btn" class="tp-btn tp-btn-ghost" style="padding: 0.4rem 0.75rem; font-size: 0.9rem;" title="Share Screen">🖥️ Share</button>
                  <a href="${cls.meeting_link}" target="_blank" class="tp-btn tp-btn-primary" style="padding: 0.4rem 1rem; font-size: 0.85rem;">
                    Launch Full Meeting Room ↗
                  </a>
                </div>
              </div>
            </div>

            <!-- Syllabus Progress Checklist -->
            <div class="tp-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 class="headline-md" style="color: #fff; font-size: 1.15rem;">Live Session Curriculum & Checklist</h3>
                <span class="mono-chip" style="color: var(--tp-primary);">${cls.what_will_learn.length} MILESTONES</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${cls.what_will_learn.map((outcome, idx) => `
                  <label style="display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); cursor: pointer;">
                    <input type="checkbox" ${idx === 0 ? 'checked' : ''} style="margin-top: 0.25rem; accent-color: var(--tp-primary);" />
                    <div>
                      <strong style="color: #fff; font-size: 0.9rem; display: block;">Topic ${idx + 1}: ${outcome}</strong>
                      <span style="font-size: 0.78rem; color: var(--tp-text-dark-secondary);">Live discussion & interactive demonstration</span>
                    </div>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Learning Materials & Code Lab -->
            <div class="tp-card">
              <h3 class="headline-md" style="color: #fff; font-size: 1.15rem; margin-bottom: 1rem;">Session Notes & Code Snippets</h3>
              <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1rem; font-family: monospace; font-size: 0.85rem; color: #a5f3fc; line-height: 1.6; overflow-x: auto;">
// TechPath Class Lab: ${cls.subject} - ${cls.topic}
#include &lt;iostream&gt;
#include &lt;vector&gt;
using namespace std;

// Live code block shared by instructor
void solveEngineeringProblem() {
    cout &lt;&lt; "Executing ${cls.title} solution" &lt;&lt; endl;
}
              </div>
            </div>
          </div>

          <!-- Right Sidebar: Student Roster & Live Class Chat -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <!-- Enrolled Students Roster -->
            <div class="tp-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <h4 style="color: #fff; font-size: 0.95rem; font-weight: 700; margin: 0;">Enrolled Students (${students.length})</h4>
                <span class="telemetry-chip" style="font-size: 0.68rem; color: #10b981; border-color: #10b981;">VERIFIED PAID</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 180px; overflow-y: auto;">
                ${students.length === 0 ? `
                  <p style="font-size: 0.8rem; color: var(--tp-text-dark-muted); font-style: italic;">No other students currently in session.</p>
                ` : students.map(st => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0.6rem; border-radius: 6px; background: rgba(255,255,255,0.02); font-size: 0.82rem;">
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                      <span class="pulse-beacon" style="background: #10b981;"></span>
                      <strong style="color: #fff;">Student #${st.student_id.slice(-4)}</strong>
                    </div>
                    <span style="font-size: 0.72rem; color: #94a3b8;">${st.status}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- In-Class Message Stream -->
            <div class="tp-card" style="display: flex; flex-direction: column; height: 420px; padding: 1.25rem;">
              <h4 style="color: #fff; font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem; border-bottom: 1px solid var(--tp-border-dark); padding-bottom: 0.5rem;">
                💬 Classroom Discussion
              </h4>

              <!-- Stream messages -->
              <div id="class-chat-stream" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.82rem; margin-bottom: 0.75rem;">
                <div style="background: rgba(225,29,72,0.1); border: 1px solid rgba(225,29,72,0.25); border-radius: 6px; padding: 0.5rem; color: #fecdd3;">
                  <strong>Teacher (${cls.teacher_name}):</strong> Welcome everyone! Feel free to ask questions here as we review the code.
                </div>
                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: 6px; padding: 0.5rem; color: #cbd5e1;">
                  <strong style="color: #38bdf8;">System:</strong> Audio/Video stream is active.
                </div>
              </div>

              <!-- Message input -->
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="class-chat-input" class="tp-input" placeholder="Type message..." style="font-size: 0.82rem; padding: 0.45rem;" />
                <button type="button" id="class-chat-send-btn" class="tp-btn tp-btn-primary" style="padding: 0.45rem 0.85rem; font-size: 0.82rem;">
                  Send
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    // Classroom interactive bindings
    const micBtn = container.querySelector('#ctrl-mic-btn');
    let micOn = true;
    micBtn?.addEventListener('click', () => {
      micOn = !micOn;
      micBtn.textContent = micOn ? '🎤 On' : '🔇 Muted';
      micBtn.style.color = micOn ? '#fff' : 'var(--tp-error)';
    });

    const camBtn = container.querySelector('#ctrl-cam-btn');
    let camOn = true;
    camBtn?.addEventListener('click', () => {
      camOn = !camOn;
      camBtn.textContent = camOn ? '📹 On' : '🚫 Off';
      camBtn.style.color = camOn ? '#fff' : 'var(--tp-error)';
    });

    // Chat sender
    const chatInput = container.querySelector('#class-chat-input');
    const sendBtn = container.querySelector('#class-chat-send-btn');
    const stream = container.querySelector('#class-chat-stream');

    const handleSend = () => {
      const text = chatInput?.value.trim();
      if (!text || !stream) return;

      const bubble = document.createElement('div');
      bubble.style.cssText = `
        background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25);
        border-radius: 6px; padding: 0.5rem; color: #bae6fd;
      `;
      bubble.innerHTML = `<strong>You:</strong> ${text}`;
      stream.appendChild(bubble);
      stream.scrollTop = stream.scrollHeight;
      chatInput.value = '';
    };

    sendBtn?.addEventListener('click', handleSend);
    chatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });

    // Teacher Mark Session Complete
    const completeBtn = container.querySelector('#mark-complete-btn');
    if (completeBtn) {
      completeBtn.addEventListener('click', async () => {
        const confirmDone = confirm('Are you sure you want to conclude this session? This will record attendance and prompt enrolled students to leave a verified review.');
        if (!confirmDone) return;

        try {
          await ClassesEngine.markClassComplete(classId, user.id);
          Toast.success('Session completed successfully! Attendance recorded.');
          window.location.hash = '#/teacher/dashboard';
        } catch (err) {
          Toast.error(err.message || 'Failed to mark class complete.');
        }
      });
    }
  }
}
