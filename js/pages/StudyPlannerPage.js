/**
 * TECHPATH — STUDY PLANNER & TIMETABLE PAGE
 * Interactive weekly schedule, AI plan generator, session tracker, and integrated Pomodoro timer
 */
import { StudyPlanEngine } from '../services/StudyPlanEngine.js';
import { Toast } from '../components/Toast.js';

export class StudyPlannerPage {
  static timerInterval = null;
  static timerSeconds = 25 * 60;
  static isTimerRunning = false;
  static isBreak = false;

  static async render(container) {
    const schedule = StudyPlanEngine.getSchedule();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentDayName = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

    const completedSlots = schedule.slots.filter(s => s.completed);
    const totalMins = schedule.slots.reduce((acc, s) => acc + (s.durationMins || 60), 0);
    const doneMins = completedSlots.reduce((acc, s) => acc + (s.durationMins || 60), 0);
    const completionRate = schedule.slots.length > 0 ? Math.round((completedSlots.length / schedule.slots.length) * 100) : 0;

    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1150px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom:0.5rem">
              <span class="pulse-beacon"></span> COGNITIVE SCHEDULING ENGINE
            </div>
            <h1 class="display-lg">Study Planner & Focus Suite</h1>
            <p style="color:var(--tp-text-dark-secondary)">Intelligent syllabus pacing, weekly study timetables, and distraction-free Pomodoro deep work blocks.</p>
          </div>
          <div style="display:flex;gap:0.75rem;">
            <button id="regenerate-plan-btn" class="tp-btn tp-btn-secondary">
              ⚡ Regenerate AI Timetable
            </button>
            <button id="add-slot-btn" class="tp-btn tp-btn-primary">
              + Add Study Block
            </button>
          </div>
        </div>

        <!-- Metric Overview -->
        <div class="tp-metrics-grid">
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-primary)">📅</div>
            <div class="tp-metric-value">${schedule.slots.length}</div>
            <div class="tp-metric-label">Planned Sessions</div>
            <div class="tp-metric-sub">This week</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-success)">⏱️</div>
            <div class="tp-metric-value">${(doneMins / 60).toFixed(1)} / ${(totalMins / 60).toFixed(1)}h</div>
            <div class="tp-metric-label">Study Hours Done</div>
            <div class="tp-metric-sub">${completionRate}% completed</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-info)">🔥</div>
            <div class="tp-metric-value">${currentDayName}</div>
            <div class="tp-metric-label">Today's Focus</div>
            <div class="tp-metric-sub">${schedule.slots.filter(s => s.day === currentDayName).length} sessions scheduled</div>
          </div>
          <div class="tp-metric-card tp-card">
            <div class="tp-metric-icon" style="color:var(--tp-warning)">⏳</div>
            <div class="tp-metric-value">${schedule.slots.length - completedSlots.length}</div>
            <div class="tp-metric-label">Sessions Remaining</div>
            <div class="tp-metric-sub">Keep the momentum</div>
          </div>
        </div>

        <!-- Focus Workstation (Pomodoro Timer) -->
        <div class="tp-card tp-card-glass" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;border:1px solid rgba(225,29,72,0.3)">
          <div style="max-width:480px">
            <div class="telemetry-chip" style="margin-bottom:0.5rem;background:rgba(225,29,72,0.1);color:var(--tp-primary)">
              DEEP WORK ENGINE
            </div>
            <h2 class="headline-md">Integrated Pomodoro Focus Timer</h2>
            <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin-top:0.25rem">
              25 minutes of unbroken technical concentration followed by 5 minutes of cognitive decompression. Proven to increase engineering concept retention by 40%.
            </p>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
            <div id="pomodoro-display" style="font-family:var(--font-mono, monospace);font-size:3.2rem;font-weight:700;letter-spacing:2px;color:var(--tp-primary)">
              25:00
            </div>
            <div style="display:flex;gap:0.75rem;">
              <button id="pomodoro-toggle-btn" class="tp-btn tp-btn-primary" style="min-width:110px">
                Start Session
              </button>
              <button id="pomodoro-reset-btn" class="tp-btn tp-btn-secondary">
                Reset
              </button>
            </div>
          </div>
        </div>

        <!-- Add Slot Form (Hidden) -->
        <div id="custom-slot-card" class="tp-card" style="display:none;border-color:var(--tp-primary);">
          <h3 class="headline-sm" style="margin-bottom:1rem">Add Custom Study Session</h3>
          <form id="custom-slot-form" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;">
            <div>
              <label class="tp-label">Day *</label>
              <select id="slot-day" class="tp-input">
                ${days.map(d => `<option value="${d}" ${d === currentDayName ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="tp-label">Time Window *</label>
              <input type="text" id="slot-time" class="tp-input" placeholder="e.g. 05:00 - 06:30 PM" required />
            </div>
            <div>
              <label class="tp-label">Subject / Topic *</label>
              <input type="text" id="slot-subject" class="tp-input" placeholder="e.g. Dynamic Programming Practice" required />
            </div>
            <div>
              <label class="tp-label">Session Type</label>
              <select id="slot-type" class="tp-input">
                <option value="Theory & Flashcards">Theory & Flashcards</option>
                <option value="Problem Solving & Quiz">Problem Solving & Quiz</option>
                <option value="3D Hardware Lab">3D Hardware Lab</option>
                <option value="Coding & Git Build">Coding & Git Build</option>
                <option value="Revision & Formula Sheet">Revision & Formula Sheet</option>
              </select>
            </div>
            <div style="grid-column:1/-1;display:flex;justify-content:flex-end;gap:0.75rem">
              <button type="button" id="cancel-slot-btn" class="tp-btn tp-btn-secondary">Cancel</button>
              <button type="submit" class="tp-btn tp-btn-primary">Add Block</button>
            </div>
          </form>
        </div>

        <!-- Day-by-Day Timetable Grid -->
        <div style="display:flex;flex-direction:column;gap:1.5rem;">
          <div class="tp-section-header">
            <h2 class="headline-md">📅 7-Day Structured Schedule</h2>
            <span class="mono-chip" style="color:var(--tp-primary)">AUTONOMOUS PACING ACTIVE</span>
          </div>

          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:1.25rem;">
            ${days.map(day => {
              const daySlots = schedule.slots.filter(s => s.day === day);
              const isToday = day === currentDayName;
              return `
                <div class="tp-card" style="${isToday ? 'border:1.5px solid var(--tp-primary);box-shadow:0 0 15px rgba(225,29,72,0.15);' : ''}">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;padding-bottom:0.5rem;border-bottom:1px solid var(--tp-border-dark)">
                    <div style="display:flex;align-items:center;gap:0.5rem">
                      <h3 style="font-size:1.1rem;font-weight:700;margin:0">${day}</h3>
                      ${isToday ? '<span class="telemetry-chip" style="font-size:0.65rem;background:rgba(225,29,72,0.2);color:var(--tp-primary)">TODAY</span>' : ''}
                    </div>
                    <span style="font-size:0.75rem;color:var(--tp-text-dark-muted)">${daySlots.length} blocks</span>
                  </div>

                  ${daySlots.length === 0 ? `
                    <p style="font-size:0.8rem;color:var(--tp-text-dark-muted);padding:1rem 0;text-align:center">Rest or Open Project Sprint</p>
                  ` : `
                    <div style="display:flex;flex-direction:column;gap:0.6rem">
                      ${daySlots.map(s => `
                        <div class="tp-study-slot" style="padding:0.6rem 0.75rem;border-radius:var(--radius-sm);background:${s.completed ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.02)'};border:1px solid ${s.completed ? 'rgba(34,197,94,0.3)' : 'var(--tp-border-dark)'};display:flex;justify-content:space-between;align-items:center;gap:0.5rem">
                          <div style="flex:1">
                            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.2rem">
                              <span class="mono-chip" style="font-size:0.68rem;color:${s.completed ? 'var(--tp-success)' : 'var(--tp-primary)'}">${s.subjectCode || 'ENG'}</span>
                              <span style="font-size:0.75rem;color:var(--tp-text-dark-muted)">${s.time}</span>
                            </div>
                            <div style="font-size:0.88rem;font-weight:600;color:${s.completed ? 'var(--tp-text-dark-secondary)' : 'var(--tp-text-light)'};text-decoration:${s.completed ? 'line-through' : 'none'}">${s.subjectTitle}</div>
                            <div style="font-size:0.75rem;color:var(--tp-text-dark-muted)">${s.type} (${s.durationMins || 90}m)</div>
                          </div>
                          <div style="display:flex;flex-direction:column;gap:0.35rem;align-items:flex-end">
                            <button class="tp-btn ${s.completed ? 'tp-btn-secondary' : 'tp-btn-primary'} tp-btn-sm toggle-slot-btn" data-id="${s.id}" style="padding:0.25rem 0.5rem;font-size:0.75rem">
                              ${s.completed ? '✓ Done' : 'Complete'}
                            </button>
                            <button class="tp-btn tp-btn-ghost tp-btn-sm delete-slot-btn" data-id="${s.id}" style="padding:0.1rem 0.3rem;font-size:0.7rem;color:var(--tp-text-dark-muted)">
                              ✕
                            </button>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  `}
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;

    // Event handlers
    const regenBtn = container.querySelector('#regenerate-plan-btn');
    regenBtn?.addEventListener('click', async () => {
      const hrs = prompt('Target daily study hours (1 - 8):', '3');
      if (hrs && !isNaN(hrs)) {
        await StudyPlanEngine.generateAutoPlan(Number(hrs));
        Toast.show({ message: `Generated personalized ${hrs}h daily study timetable!`, type: 'success' });
        await StudyPlannerPage.render(container);
      }
    });

    const addBtn = container.querySelector('#add-slot-btn');
    const slotCard = container.querySelector('#custom-slot-card');
    const cancelSlotBtn = container.querySelector('#cancel-slot-btn');
    const customForm = container.querySelector('#custom-slot-form');

    addBtn?.addEventListener('click', () => {
      slotCard.style.display = slotCard.style.display === 'none' ? 'block' : 'none';
    });

    cancelSlotBtn?.addEventListener('click', () => {
      slotCard.style.display = 'none';
    });

    customForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const day = container.querySelector('#slot-day').value;
      const time = container.querySelector('#slot-time').value.trim();
      const subjectTitle = container.querySelector('#slot-subject').value.trim();
      const type = container.querySelector('#slot-type').value;

      StudyPlanEngine.addCustomSlot({ day, time, subjectTitle, type });
      Toast.show({ message: 'Study block scheduled successfully!', type: 'success' });
      await StudyPlannerPage.render(container);
    });

    container.querySelectorAll('.toggle-slot-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        StudyPlanEngine.toggleSlot(id);
        await StudyPlannerPage.render(container);
      });
    });

    container.querySelectorAll('.delete-slot-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        StudyPlanEngine.deleteSlot(id);
        await StudyPlannerPage.render(container);
      });
    });

    // Pomodoro Timer controls
    const toggleTimerBtn = container.querySelector('#pomodoro-toggle-btn');
    const resetTimerBtn = container.querySelector('#pomodoro-reset-btn');
    const display = container.querySelector('#pomodoro-display');

    const updateTimerDisplay = () => {
      if (!display) return;
      const m = Math.floor(StudyPlannerPage.timerSeconds / 60);
      const s = StudyPlannerPage.timerSeconds % 60;
      display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    updateTimerDisplay();

    toggleTimerBtn?.addEventListener('click', () => {
      if (StudyPlannerPage.isTimerRunning) {
        clearInterval(StudyPlannerPage.timerInterval);
        StudyPlannerPage.isTimerRunning = false;
        toggleTimerBtn.textContent = 'Resume Session';
      } else {
        StudyPlannerPage.isTimerRunning = true;
        toggleTimerBtn.textContent = 'Pause Session';
        StudyPlannerPage.timerInterval = setInterval(() => {
          if (StudyPlannerPage.timerSeconds > 0) {
            StudyPlannerPage.timerSeconds--;
            updateTimerDisplay();
          } else {
            clearInterval(StudyPlannerPage.timerInterval);
            StudyPlannerPage.isTimerRunning = false;
            StudyPlannerPage.isBreak = !StudyPlannerPage.isBreak;
            StudyPlannerPage.timerSeconds = StudyPlannerPage.isBreak ? 5 * 60 : 25 * 60;
            Toast.show({
              message: StudyPlannerPage.isBreak ? 'Focus session completed! Take 5 mins break.' : 'Break ended! Ready for next focus block.',
              type: 'success'
            });
            toggleTimerBtn.textContent = 'Start Session';
            updateTimerDisplay();
          }
        }, 1000);
      }
    });

    resetTimerBtn?.addEventListener('click', () => {
      clearInterval(StudyPlannerPage.timerInterval);
      StudyPlannerPage.isTimerRunning = false;
      StudyPlannerPage.timerSeconds = 25 * 60;
      StudyPlannerPage.isBreak = false;
      toggleTimerBtn.textContent = 'Start Session';
      updateTimerDisplay();
    });
  }
}
