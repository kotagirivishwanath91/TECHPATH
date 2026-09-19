/**
 * TECHPATH — PEER COMMUNITY & TECHNICAL DISCUSSIONS
 * Engineering Q&A, branch study circles, code reviews, and instructor-verified solutions
 */
import { learningContext } from '../context/LearningContext.js';
import { Toast } from '../components/Toast.js';

export class CommunityPage {
  static activeTab = 'discussions'; // 'discussions' | 'groups'
  static posts = [
    {
      id: 'p1',
      title: 'How does the Linux kernel handle page fault handling in copy-on-write (COW) forks?',
      author: 'Aarav Sharma',
      branch: 'CSE',
      role: 'Student Engineer',
      votes: 38,
      voted: false,
      answersCount: 4,
      timeAgo: '2 hours ago',
      tags: ['Linux', 'Operating Systems', 'Memory'],
      content: 'When fork() is called, parent and child pages are initially marked read-only. When either process attempts a write, an MMU page fault triggers. Does the kernel duplicate the physical frame immediately inside the interrupt handler?',
      verifiedAnswer: 'Yes. The kernel traps into do_page_fault(). If VM_WRITE is permitted in the VMA, it allocates an alloc_page_vma(), copies the 4KB frame using copy_user_highpage(), updates the PTE with the new physical address and read-write flags, and flushes the TLB.',
      verifiedBy: 'Dr. Ramesh (TechPath Faculty)'
    },
    {
      id: 'p2',
      title: 'Why is Dijkstra algorithm guaranteed to fail or loop indefinitely with negative edge cycles?',
      author: 'Priya Patel',
      branch: 'CSE',
      role: 'GATE Aspirant',
      votes: 52,
      voted: false,
      answersCount: 6,
      timeAgo: '5 hours ago',
      tags: ['Algorithms', 'Graphs', 'GATE'],
      content: 'Dijkstra relies on a greedy premise: once a vertex is removed from the priority queue, its shortest distance is finalized. With negative edges, this assumption is violated because a longer path with a negative edge could yield a lower total weight.',
      verifiedAnswer: 'Dijkstra assumes d[v] >= d[u] for all edges (u, v) with weight w(u,v) >= 0. Negative edges violate the greedy substructure invariant. Use the Bellman-Ford algorithm (O(V*E)) or SPFA to detect and handle negative cycles.',
      verifiedBy: 'Siddharth V. (Systems Architect)'
    },
    {
      id: 'p3',
      title: 'Difference between FinFET and GAAFET (Gate-All-Around) in sub-3nm semiconductor fabrication?',
      author: 'Kunal Verma',
      branch: 'ECE',
      role: 'VLSI Engineer',
      votes: 27,
      voted: false,
      answersCount: 3,
      timeAgo: '1 day ago',
      tags: ['VLSI', 'Semiconductors', 'Hardware'],
      content: 'At nodes below 3nm, even FinFET fins experience quantum tunneling and short-channel drain leakage. GAAFET surrounds the nanosheet channels on all four sides to restore electro-static gate control.',
      verifiedAnswer: null,
      verifiedBy: null
    }
  ];

  static groups = [
    { id: 'g1', name: 'Distributed Systems & Database Internals', members: 412, branch: 'CSE', desc: 'Deep dive into Raft consensus, LSM trees, write-ahead logs, and storage engines.', joined: true },
    { id: 'g2', name: 'GATE 2026 Core Engineering Circle', members: 890, branch: 'All Branches', desc: 'Daily PYQ drills, mock test analysis, and rank strategy discussion.', joined: false },
    { id: 'g3', name: 'Hardware & RISC-V Silicon Designers', members: 230, branch: 'ECE/EEE', desc: 'Verilog RTL synthesis, FPGA prototyping, and ASIC tape-out methodologies.', joined: false },
    { id: 'g4', name: 'System Design & Tier-1 Interview Prep', members: 670, branch: 'CSE', desc: 'Weekly peer mock interviews, resume reviews, and high-level architecture designs.', joined: true }
  ];

  static async render(container) {
    const ctx = learningContext.get();

    container.innerHTML = `
      <div class="tp-page" style="display:flex;flex-direction:column;gap:1.75rem;max-width:1150px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom:0.5rem">
              <span class="pulse-beacon"></span> GLOBAL PEER COLLABORATION
            </div>
            <h1 class="display-lg">Engineering Community Hub</h1>
            <p style="color:var(--tp-text-dark-secondary)">Connect with fellow engineering students, share architectural proofs, ask technical questions, and collaborate in focused study circles.</p>
          </div>
          <button id="ask-question-btn" class="tp-btn tp-btn-primary">
            + Ask Technical Question
          </button>
        </div>

        <!-- Ask Question Modal Form (Hidden) -->
        <div id="ask-form-card" class="tp-card" style="display:none;border-color:var(--tp-primary);padding:1.5rem">
          <h3 class="headline-sm" style="margin-bottom:1rem">Post an Engineering Question</h3>
          <form id="new-question-form" style="display:flex;flex-direction:column;gap:1rem">
            <div>
              <label class="tp-label">Question Title *</label>
              <input type="text" id="q-title" class="tp-input" placeholder="e.g. Why does QuickSort degrade to O(N^2) on sorted arrays with naive pivot?" required />
            </div>
            <div>
              <label class="tp-label">Technical Details & Context *</label>
              <textarea id="q-content" class="tp-input" rows="4" placeholder="Explain the problem, what you tried, and relevant code or formulas..." required></textarea>
            </div>
            <div>
              <label class="tp-label">Tags (comma separated)</label>
              <input type="text" id="q-tags" class="tp-input" placeholder="Algorithms, C++, Memory" />
            </div>
            <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:0.5rem">
              <button type="button" id="cancel-q-btn" class="tp-btn tp-btn-secondary">Cancel</button>
              <button type="submit" class="tp-btn tp-btn-primary">Publish to Forum</button>
            </div>
          </form>
        </div>

        <!-- Navigation Tabs -->
        <div style="display:flex;gap:0.5rem;border-bottom:1px solid var(--tp-border-dark);padding-bottom:0.5rem">
          <button class="tp-btn ${this.activeTab === 'discussions' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm tab-switch-btn" data-tab="discussions">
            💬 Technical Discussions (${this.posts.length})
          </button>
          <button class="tp-btn ${this.activeTab === 'groups' ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm tab-switch-btn" data-tab="groups">
            👥 Study Circles & Working Groups (${this.groups.length})
          </button>
        </div>

        <!-- Content Area -->
        ${this.activeTab === 'discussions' ? `
          <div style="display:flex;flex-direction:column;gap:1.25rem;">
            ${this.posts.map(p => `
              <div class="tp-card" style="display:flex;gap:1.5rem;align-items:flex-start">
                <!-- Upvote column -->
                <div style="display:flex;flex-direction:column;align-items:center;gap:0.25rem;min-width:45px">
                  <button class="tp-btn tp-btn-secondary tp-btn-sm upvote-btn" data-id="${p.id}" style="padding:0.3rem 0.6rem;font-size:1rem;color:${p.voted ? 'var(--tp-primary)' : 'inherit'}">
                    ▲
                  </button>
                  <span style="font-weight:700;font-size:0.95rem;color:${p.voted ? 'var(--tp-primary)' : '#fff'}">${p.votes}</span>
                  <span style="font-size:0.7rem;color:var(--tp-text-dark-muted)">votes</span>
                </div>

                <!-- Post content -->
                <div style="flex:1">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.35rem">
                    <h3 style="font-size:1.1rem;font-weight:700;margin:0">${p.title}</h3>
                    <span style="font-size:0.75rem;color:var(--tp-text-dark-muted)">${p.timeAgo}</span>
                  </div>

                  <p style="font-size:0.88rem;color:var(--tp-text-dark-secondary);margin:0 0 0.75rem 0;line-height:1.5">${p.content}</p>

                  <div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:0.75rem">
                    ${p.tags.map(t => `<span class="tp-tag">${t}</span>`).join('')}
                    <span class="mono-chip" style="font-size:0.7rem;color:var(--tp-primary)">${p.branch}</span>
                  </div>

                  <!-- Verified Answer Box -->
                  ${p.verifiedAnswer ? `
                    <div style="margin-top:0.75rem;padding:0.75rem 1rem;background:rgba(34,197,94,0.06);border-left:3px solid var(--tp-success);border-radius:var(--radius-sm)">
                      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem">
                        <span class="mono-chip" style="color:var(--tp-success);font-size:0.7rem">✓ VERIFIED SOLUTION</span>
                        <span style="font-size:0.75rem;color:var(--tp-text-dark-muted)">by ${p.verifiedBy}</span>
                      </div>
                      <p style="font-size:0.85rem;color:var(--tp-text-light);margin:0;line-height:1.4">${p.verifiedAnswer}</p>
                    </div>
                  ` : ''}

                  <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.75rem;padding-top:0.5rem;border-top:1px solid var(--tp-border-dark);font-size:0.8rem;color:var(--tp-text-dark-muted)">
                    <span>Posted by <strong>${p.author}</strong> (${p.role})</span>
                    <span>💬 ${p.answersCount} answers</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <!-- Study Circles Hub Banner -->
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1.25rem;background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.25);padding:1rem 1.25rem;border-radius:12px;">
            <div>
              <div style="font-weight:700;font-size:1rem;color:var(--tp-text-dark-primary);margin-bottom:0.2rem;">
                🚀 Looking for Interactive Study Groups with Member Chat & Workspaces?
              </div>
              <div style="font-size:0.88rem;color:var(--tp-text-dark-secondary);">
                Join branch-tailored circles, apply to private groups, and chat directly with classmates.
              </div>
            </div>
            <a href="#/connect/study-groups" class="tp-btn tp-btn-primary" style="text-decoration:none;font-weight:600;font-size:0.88rem;">
              Open Full Study Groups Hub →
            </a>
          </div>

          <!-- Groups Grid -->
          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:1.25rem;">
            ${this.groups.map(g => `
              <div class="tp-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:1rem">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
                    <span class="mono-chip" style="color:var(--tp-primary)">${g.branch}</span>
                    <span style="font-size:0.75rem;color:var(--tp-text-dark-muted)">👥 ${g.members} members</span>
                  </div>
                  <h3 style="font-size:1.1rem;font-weight:700;margin:0 0 0.5rem 0">${g.name}</h3>
                  <p style="font-size:0.85rem;color:var(--tp-text-dark-secondary);margin:0;line-height:1.4">${g.desc}</p>
                </div>
                <div style="border-top:1px solid var(--tp-border-dark);padding-top:0.75rem;display:flex;justify-content:flex-end">
                  <button class="tp-btn ${g.joined ? 'tp-btn-secondary' : 'tp-btn-primary'} tp-btn-sm toggle-group-btn" data-id="${g.id}">
                    ${g.joined ? '✓ Joined Circle' : 'Join Circle'}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}

      </div>
    `;

    // Event bindings
    container.querySelectorAll('.tab-switch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.dataset.tab;
        CommunityPage.render(container);
      });
    });

    const askBtn = container.querySelector('#ask-question-btn');
    const formCard = container.querySelector('#ask-form-card');
    const cancelQBtn = container.querySelector('#cancel-q-btn');
    const qForm = container.querySelector('#new-question-form');

    askBtn?.addEventListener('click', () => {
      formCard.style.display = formCard.style.display === 'none' ? 'block' : 'none';
    });

    cancelQBtn?.addEventListener('click', () => {
      formCard.style.display = 'none';
    });

    qForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = container.querySelector('#q-title').value.trim();
      const content = container.querySelector('#q-content').value.trim();
      const tags = container.querySelector('#q-tags').value.split(',').map(t => t.trim()).filter(Boolean);

      this.posts.unshift({
        id: `p_${Date.now()}`,
        title,
        content,
        author: 'You (Student Engineer)',
        branch: ctx.branch_id.toUpperCase(),
        role: 'Verified Student',
        votes: 1,
        voted: true,
        answersCount: 0,
        timeAgo: 'Just now',
        tags: tags.length > 0 ? tags : ['Engineering', 'Curriculum'],
        verifiedAnswer: null,
        verifiedBy: null
      });

      Toast.show({ message: 'Question published to engineering community!', type: 'success' });
      formCard.style.display = 'none';
      CommunityPage.render(container);
    });

    container.querySelectorAll('.upvote-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const post = this.posts.find(p => p.id === id);
        if (post) {
          if (post.voted) {
            post.votes--;
            post.voted = false;
          } else {
            post.votes++;
            post.voted = true;
          }
          CommunityPage.render(container);
        }
      });
    });

    container.querySelectorAll('.toggle-group-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const grp = this.groups.find(g => g.id === id);
        if (grp) {
          grp.joined = !grp.joined;
          grp.members += grp.joined ? 1 : -1;
          Toast.show({ message: grp.joined ? `Joined ${grp.name}!` : `Left circle.`, type: 'info' });
          CommunityPage.render(container);
        }
      });
    });
  }
}
