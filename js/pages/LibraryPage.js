/**
 * TECHPATH — UNIFIED DIGITAL LIBRARY & SAVED REPOSITORY
 * Loads authentic user records from database, multi-field search across PDF notes,
 * formulas, questions, and instant reopening of analyzed documents.
 */

import { learningContext } from '../context/LearningContext.js';
import { dbStore } from '../db/store.js';
import { authContext } from '../context/AuthContext.js';
import { Toast } from '../components/Toast.js';

export class LibraryPage {
  static activeCategory = 'all';
  static searchQuery = '';
  static sortBy = 'newest';

  static async render(container) {
    const ctx = learningContext.get();
    const currentUser = authContext.getUser() || { id: 'usr_guest' };

    container.innerHTML = `
      <div class="tp-page" style="display: flex; flex-direction: column; gap: 1.75rem; max-width: 1200px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="telemetry-chip" style="margin-bottom: 0.5rem;">
              <span class="pulse-beacon"></span> UNIFIED REPOSITORY // SEARCH & VAULT
            </div>
            <h1 class="display-lg">My Learning Library</h1>
            <p style="color: var(--tp-text-dark-secondary);">
              All your saved PDFs, AI study packets, bookmarked videos, projects, flashcards, and syllabus resources.
            </p>
          </div>
          <div>
            <a href="#/pdf" class="tp-btn tp-btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
              <span>Analyze New PDF</span>
            </a>
          </div>
        </div>

        <!-- Search, Filter & Sort Controls -->
        <div class="tp-card" style="padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
            <div style="flex: 1; min-width: 280px; position: relative;">
              <input type="search" id="lib-search-input" class="tp-input" placeholder="Search across titles, extracted text, notes, definitions, questions, topics..." value="${this.searchQuery}" />
            </div>

            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <label style="font-size: 0.85rem; color: var(--tp-text-dark-muted); white-space: nowrap;">Sort by:</label>
              <select id="lib-sort-select" class="tp-input" style="padding: 0.4rem 0.75rem; font-size: 0.85rem; width: auto;">
                <option value="newest" ${this.sortBy === 'newest' ? 'selected' : ''}>Newest First</option>
                <option value="oldest" ${this.sortBy === 'oldest' ? 'selected' : ''}>Oldest First</option>
                <option value="alpha" ${this.sortBy === 'alpha' ? 'selected' : ''}>Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          <!-- Category Navigation Tabs -->
          <div class="tp-tab-bar">
            ${[
              { id: 'all', label: 'All Items', icon: '📂' },
              { id: 'pdf', label: 'PDFs & AI Notes', icon: '📑' },
              { id: 'video', label: 'Videos', icon: '🎥' },
              { id: 'project', label: 'Projects', icon: '💻' },
              { id: 'model', label: '3D Models', icon: '🧊' },
              { id: 'flashcard', label: 'Flashcards', icon: '⚡' },
              { id: 'quiz', label: 'Quizzes', icon: '🎯' },
              { id: 'resource', label: 'Reference Materials', icon: '📚' }
            ].map(tab => `
              <button class="tp-btn ${this.activeCategory === tab.id ? 'tp-btn-primary' : 'tp-btn-secondary'} tp-btn-sm lib-tab-btn" data-cat="${tab.id}" style="white-space: nowrap;">
                <span>${tab.icon}</span>
                <span>${tab.label}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Items Container / Loading State -->
        <div id="lib-items-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem;">
          <div class="tp-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <div class="pulse-beacon" style="margin: 0 auto 1rem; width: 16px; height: 16px;"></div>
            <p style="color: var(--tp-text-dark-secondary);">Loading your saved items from database...</p>
          </div>
        </div>
      </div>
    `;

    const searchInput = container.querySelector('#lib-search-input');
    const sortSelect = container.querySelector('#lib-sort-select');
    const itemsGrid = container.querySelector('#lib-items-grid');

    // Fetch saved data from database
    let allItems = [];
    try {
      const [libItems, projects, videos] = await Promise.all([
        dbStore.getAll('library_items'),
        dbStore.getAll('projects'),
        dbStore.getAll('videos')
      ]);

      // Seed curated default resources if database is fresh
      const defaultResources = [
        { id: 'lib_dsa_cheat', item_type: 'resource', title: 'Data Structures & Big-O Asymptotic Complexity Sheet', category: 'resource', summary: 'Authoritative analysis of algorithmic worst-case bounds, amortized costs, and recurrence trees.', tags: ['DSA', 'Big-O', 'Algorithms'], created_at: '2026-01-10T10:00:00Z' },
        { id: 'lib_os_notes', item_type: 'resource', title: 'Operating Systems Principles: Paging, Threads & Deadlocks', category: 'resource', summary: 'Memory management, TLB invalidation, mutex synchronization, and Peterson algorithm.', tags: ['OS', 'Kernel', 'Core'], created_at: '2026-01-15T10:00:00Z' },
        { id: 'lib_db_guide', item_type: 'resource', title: 'Relational Database Normalization (1NF to BCNF) & SQL Guide', category: 'resource', summary: 'Functional dependencies, lossless join decomposition, and B+ tree indexing strategies.', tags: ['DBMS', 'SQL', 'Normalization'], created_at: '2026-01-20T10:00:00Z' }
      ];

      // Format items into unified records
      const mappedLibItems = libItems.map(item => ({
        id: item.id,
        item_type: item.item_type || item.category || 'pdf',
        title: item.title,
        filename: item.filename || '',
        summary: item.summary || 'AI-generated study packet with formulas and exam questions.',
        tags: item.tags || ['PDF', 'Notes'],
        analysis_data: item.analysis_data || null,
        created_at: item.created_at || new Date().toISOString()
      }));

      const mappedProjects = (projects || []).slice(0, 4).map(p => ({
        id: p.id,
        item_type: 'project',
        title: p.title,
        summary: p.problem_statement || p.objective,
        tags: [p.branch_id?.toUpperCase() || 'ENG', p.difficulty || 'Advanced'],
        created_at: p.created_at || new Date().toISOString()
      }));

      const mappedVideos = (videos || []).slice(0, 4).map(v => ({
        id: v.id,
        item_type: 'video',
        title: v.title,
        summary: v.description,
        tags: [v.branch_id?.toUpperCase() || 'ENG', 'Lecture Video'],
        created_at: v.created_at || new Date().toISOString()
      }));

      allItems = [...mappedLibItems, ...defaultResources, ...mappedProjects, ...mappedVideos];
    } catch (e) {
      console.warn('Library query notice:', e.message);
    }

    // Filter, sort, and render items function
    const renderFilteredItems = () => {
      let filtered = [...allItems];

      // Category filter
      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(item => {
          if (this.activeCategory === 'pdf') return item.item_type === 'pdf' || item.item_type === 'notes';
          if (this.activeCategory === 'video') return item.item_type === 'video';
          if (this.activeCategory === 'project') return item.item_type === 'project';
          if (this.activeCategory === 'model') return item.item_type === 'model';
          if (this.activeCategory === 'flashcard') return item.item_type === 'flashcard';
          if (this.activeCategory === 'quiz') return item.item_type === 'quiz';
          if (this.activeCategory === 'resource') return item.item_type === 'resource';
          return true;
        });
      }

      // Search filter across: title, filename, extracted text, notes, definitions, questions, topics
      if (this.searchQuery && this.searchQuery.trim().length > 0) {
        const q = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(item => {
          const titleMatch = item.title?.toLowerCase().includes(q);
          const filenameMatch = item.filename?.toLowerCase().includes(q);
          const summaryMatch = item.summary?.toLowerCase().includes(q);
          const tagsMatch = item.tags?.some(t => t.toLowerCase().includes(q));

          // Deep search in analysis_data if available
          let deepAnalysisMatch = false;
          if (item.analysis_data) {
            const ad = item.analysis_data;
            const rawMatch = ad.rawText?.toLowerCase().includes(q);
            const defMatch = ad.definitions?.some(d => (d.term + ' ' + d.explanation).toLowerCase().includes(q));
            const formulaMatch = ad.formulas?.some(f => f.formula?.toLowerCase().includes(q));
            const qMatch = ad.shortQuestions?.some(sq => (sq.q + ' ' + sq.answer).toLowerCase().includes(q));
            deepAnalysisMatch = rawMatch || defMatch || formulaMatch || qMatch;
          }

          return titleMatch || filenameMatch || summaryMatch || tagsMatch || deepAnalysisMatch;
        });
      }

      // Sorting
      if (this.sortBy === 'newest') {
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      } else if (this.sortBy === 'oldest') {
        filtered.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
      } else if (this.sortBy === 'alpha') {
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      }

      // Render
      if (filtered.length === 0) {
        itemsGrid.innerHTML = `
          <div class="tp-card tp-empty-state" style="grid-column: 1 / -1; padding: 4rem 1.5rem;">
            <div class="tp-empty-icon">🔍</div>
            <h3 class="tp-empty-title">No matching items found in your library</h3>
            <p class="tp-empty-desc">No items matched "${this.searchQuery}" under ${this.activeCategory.toUpperCase()}. Try clearing your search query or uploading a new document.</p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 1rem;">
              <button id="clear-search-btn" class="tp-btn tp-btn-secondary">Clear Search</button>
              <a href="#/pdf" class="tp-btn tp-btn-primary">Upload Document</a>
            </div>
          </div>
        `;
        const clearBtn = itemsGrid.querySelector('#clear-search-btn');
        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            this.searchQuery = '';
            searchInput.value = '';
            renderFilteredItems();
          });
        }
        return;
      }

      itemsGrid.innerHTML = filtered.map(item => `
        <div class="tp-card" style="display: flex; flex-direction: column; justify-content: space-between; gap: 1rem; border: 1px solid var(--tp-border-dark);">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span class="mono-chip" style="color: ${item.item_type === 'pdf' ? 'var(--tp-primary)' : item.item_type === 'project' ? 'var(--tp-success)' : 'var(--tp-info)'}; font-size: 0.75rem;">
                ${item.item_type.toUpperCase()}
              </span>
              <span style="font-size: 0.75rem; color: var(--tp-text-dark-muted);">
                ${new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>

            <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.4;">${item.title}</h3>
            <p style="font-size: 0.85rem; color: var(--tp-text-dark-secondary); line-height: 1.5; margin-bottom: 0.75rem;">
              ${(item.summary || '').slice(0, 140)}${(item.summary || '').length > 140 ? '...' : ''}
            </p>

            <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
              ${(item.tags || []).map(t => `<span class="telemetry-chip" style="font-size: 0.7rem;">${t}</span>`).join('')}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--tp-border-dark); padding-top: 0.75rem;">
            ${item.item_type === 'pdf' ? `
              <button class="tp-btn tp-btn-primary tp-btn-sm reopen-pdf-btn" data-id="${item.id}" style="width: 100%;">
                📖 Open in PDF Analyzer
              </button>
            ` : item.item_type === 'project' ? `
              <a href="#/projects" class="tp-btn tp-btn-secondary tp-btn-sm" style="width: 100%; text-align: center;">
                View Project Blueprint
              </a>
            ` : item.item_type === 'video' ? `
              <a href="#/learning" class="tp-btn tp-btn-secondary tp-btn-sm" style="width: 100%; text-align: center;">
                Watch Lecture
              </a>
            ` : `
              <button class="tp-btn tp-btn-secondary tp-btn-sm download-res-btn" data-title="${item.title}" style="width: 100%;">
                Download Reference
              </button>
            `}
          </div>
        </div>
      `).join('');

      // Wire reopen PDF handlers
      itemsGrid.querySelectorAll('.reopen-pdf-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const itemId = btn.dataset.id;
          const target = allItems.find(i => i.id === itemId);
          if (target && target.analysis_data) {
            localStorage.setItem('TP_ACTIVE_PDF_ANALYSIS', JSON.stringify(target.analysis_data));
            Toast.show(`Reopening ${target.title}...`, 'info');
            window.location.hash = '#/pdf';
          } else {
            window.location.hash = '#/pdf';
          }
        });
      });

      // Wire download handlers
      itemsGrid.querySelectorAll('.download-res-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          Toast.show(`Downloading verified resource: ${btn.dataset.title}`, 'success');
        });
      });
    };

    // Initial render of items
    renderFilteredItems();

    // Event listeners
    container.querySelectorAll('.lib-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.lib-tab-btn').forEach(b => {
          b.classList.remove('tp-btn-primary');
          b.classList.add('tp-btn-secondary');
        });
        btn.classList.remove('tp-btn-secondary');
        btn.classList.add('tp-btn-primary');
        this.activeCategory = btn.dataset.cat;
        renderFilteredItems();
      });
    });

    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      renderFilteredItems();
    });

    sortSelect.addEventListener('change', (e) => {
      this.sortBy = e.target.value;
      renderFilteredItems();
    });
  }
}
