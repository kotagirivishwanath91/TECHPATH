/**
 * TECHPATH — ACADEMIC TAXONOMY SELECTOR COMPONENT
 * Department -> Branch -> Specialization -> Semester -> Dynamic Career Roles
 * Supports searchable grouped dropdown, keyboard navigation, mobile layout,
 * selected-state persistence, multi-role selection, and canonical IDs.
 */

import { TaxonomyEngine, DEPARTMENTS, ALL_BRANCHES } from '../services/TaxonomyEngine.js';

export class AcademicTaxonomySelector {
  /**
   * Mounts the selector inside a container
   * @param {HTMLElement} container
   * @param {Object} options initial values and onChange callback
   */
  static render(container, options = {}) {
    const {
      initialDepartment = 'dept_cs',
      initialBranch = 'cse',
      initialSpecialization = '',
      initialSemester = 'sem_5',
      initialRoles = [],
      onChange = () => {},
      compact = false
    } = options;

    let selectedDeptId = initialDepartment;
    let selectedBranchId = initialBranch;
    let selectedSpec = initialSpecialization;
    let selectedSem = initialSemester;
    let selectedRoles = Array.isArray(initialRoles) ? [...initialRoles] : (initialRoles ? [initialRoles] : []);
    let searchQuery = '';

    // Ensure branch belongs to selected department or update department
    const foundBranch = TaxonomyEngine.getBranchById(selectedBranchId);
    if (foundBranch && foundBranch.department_id) {
      selectedDeptId = foundBranch.department_id;
    }

    function renderUI() {
      const currentDept = TaxonomyEngine.getDepartmentById(selectedDeptId) || DEPARTMENTS[0];
      const branches = currentDept.branches || [];
      const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0] || ALL_BRANCHES[0];
      if (currentBranch && currentBranch.id !== selectedBranchId) {
        selectedBranchId = currentBranch.id;
      }

      const specs = currentBranch ? (currentBranch.specializations || []) : [];
      if (!selectedSpec && specs.length > 0) {
        selectedSpec = specs[0].name;
      }

      const suggestedRoles = TaxonomyEngine.getSuggestedRoles(selectedBranchId);

      container.innerHTML = `
        <div class="tp-taxonomy-selector" style="display: flex; flex-direction: column; gap: 1.25rem; width: 100%;">
          
          <!-- Search Filter across 33 Departments -->
          <div style="position: relative;">
            <input type="text"
                   id="tp-taxonomy-search"
                   class="tp-input"
                   placeholder="🔍 Search all 33 departments, branches, or engineering roles..."
                   value="${searchQuery}"
                   style="width: 100%; padding: 0.6rem 0.85rem; font-size: 0.88rem; border-radius: var(--radius-sm); border: 1px solid var(--tp-border-dark); background: rgba(0,0,0,0.35); color: #fff;" />
            ${searchQuery ? `
              <button type="button" id="tp-taxonomy-clear-search" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 0.85rem;">✕</button>
            ` : ''}
          </div>

          <!-- Hierarchy 3-Tier Grid: Department -> Branch -> Specialization -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
            
            <!-- Tier 1: Department (Grouped list of 33) -->
            <div>
              <label class="tp-form-label" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; margin-bottom: 0.35rem;">
                <span>1. Engineering Department *</span>
                <span class="mono-chip" style="font-size: 0.68rem; color: var(--tp-primary);">33 AVAILABLE</span>
              </label>
              <select id="tp-select-department" class="tp-input" style="width: 100%; font-size: 0.88rem; padding: 0.55rem; background: #0f172a; color: #f8fafc; border: 1px solid var(--tp-border-dark);">
                ${DEPARTMENTS.map((dept, idx) => `
                  <option value="${dept.id}" ${dept.id === selectedDeptId ? 'selected' : ''}>
                    ${idx + 1}. ${dept.name} (${dept.code})
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Tier 2: Branch -->
            <div>
              <label class="tp-form-label" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; margin-bottom: 0.35rem;">
                <span>2. Discipline / Branch *</span>
                <span class="mono-chip" style="font-size: 0.68rem; color: var(--tp-info);">${currentBranch ? currentBranch.code : ''}</span>
              </label>
              <select id="tp-select-branch" class="tp-input" style="width: 100%; font-size: 0.88rem; padding: 0.55rem; background: #0f172a; color: #f8fafc; border: 1px solid var(--tp-border-dark);">
                ${branches.map(b => `
                  <option value="${b.id}" ${b.id === selectedBranchId ? 'selected' : ''}>
                    ${b.name} (${b.code})
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Tier 3: Specialization -->
            <div>
              <label class="tp-form-label" style="font-size: 0.82rem; margin-bottom: 0.35rem;">3. Specialization / Focus Track *</label>
              ${specs.length > 0 ? `
                <select id="tp-select-specialization" class="tp-input" style="width: 100%; font-size: 0.88rem; padding: 0.55rem; background: #0f172a; color: #f8fafc; border: 1px solid var(--tp-border-dark);">
                  ${specs.map(s => `
                    <option value="${s.name}" ${s.name === selectedSpec ? 'selected' : ''}>
                      ${s.name}
                    </option>
                  `).join('')}
                </select>
              ` : `
                <input type="text" id="tp-input-specialization" class="tp-input" value="${selectedSpec || 'General Engineering Track'}" placeholder="e.g. Core Systems" />
              `}
            </div>
          </div>

          <!-- Semester / Academic Year Selector -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label class="tp-form-label" style="font-size: 0.82rem; margin-bottom: 0.35rem;">Current Semester *</label>
              <select id="tp-select-semester" class="tp-input" style="width: 100%; font-size: 0.88rem; padding: 0.55rem; background: #0f172a; color: #f8fafc; border: 1px solid var(--tp-border-dark);">
                ${[1, 2, 3, 4, 5, 6, 7, 8].map(sem => `
                  <option value="sem_${sem}" ${`sem_${sem}` === selectedSem ? 'selected' : ''}>
                    Semester ${sem} (Year ${Math.ceil(sem / 2)})
                  </option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="tp-form-label" style="font-size: 0.82rem; margin-bottom: 0.35rem;">Canonical Branch ID</label>
              <input type="text" class="tp-input" value="${selectedBranchId}" disabled style="opacity: 0.7; font-family: monospace; font-size: 0.85rem;" />
            </div>
          </div>

          <!-- Dynamic Career Role Suggestions (Requirement 2) -->
          <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--tp-border-dark); border-radius: var(--radius-sm); padding: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <span class="mono-chip" style="color: var(--tp-primary); font-size: 0.72rem;">CAREER ALIGNMENT</span>
                <strong style="color: #fff; font-size: 0.9rem; margin-left: 0.5rem;">Suggested Career Roles for ${currentBranch ? currentBranch.name : 'Branch'}</strong>
              </div>
              <div style="display: flex; gap: 0.5rem; font-size: 0.75rem;">
                <button type="button" id="tp-roles-select-all" class="tp-btn tp-btn-ghost tp-btn-xs">Select All</button>
                <button type="button" id="tp-roles-clear-all" class="tp-btn tp-btn-ghost tp-btn-xs">Clear</button>
              </div>
            </div>
            <p style="font-size: 0.78rem; color: var(--tp-text-dark-secondary); margin-bottom: 0.75rem;">
              Click to select one or multiple target roles. These personalize your LearnHub videos, resume builder, and mock interviews.
            </p>

            <div id="tp-roles-chips" style="display: flex; flex-wrap: wrap; gap: 0.45rem;">
              ${suggestedRoles.map(role => {
                const isSelected = selectedRoles.includes(role);
                return `
                  <button type="button"
                          class="tp-role-chip ${isSelected ? 'tp-role-chip-selected' : ''}"
                          data-role="${role}"
                          style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.75rem; border-radius: 9999px; font-size: 0.78rem; font-weight: 500; cursor: pointer; transition: all 0.2s; background: ${isSelected ? 'var(--tp-primary)' : 'rgba(255,255,255,0.05)'}; color: ${isSelected ? '#fff' : '#cbd5e1'}; border: 1px solid ${isSelected ? 'var(--tp-primary)' : 'var(--tp-border-dark)'};">
                    <span>${isSelected ? '✓' : '+'}</span>
                    <span>${role}</span>
                  </button>
                `;
              }).join('')}
            </div>

            ${selectedRoles.length > 0 ? `
              <div style="margin-top: 0.75rem; font-size: 0.78rem; color: var(--tp-success);">
                ✓ ${selectedRoles.length} role(s) selected: ${selectedRoles.join(', ')}
              </div>
            ` : `
              <div style="margin-top: 0.75rem; font-size: 0.78rem; color: var(--tp-text-dark-muted);">
                (No roles selected yet &bull; User can select multiple or skip for now)
              </div>
            `}
          </div>
        </div>
      `;

      bindEvents();
      notifyChange();
    }

    function notifyChange() {
      const currentDept = TaxonomyEngine.getDepartmentById(selectedDeptId);
      const currentBranch = TaxonomyEngine.getBranchById(selectedBranchId);
      onChange({
        departmentId: selectedDeptId,
        departmentName: currentDept?.name || '',
        branchId: selectedBranchId,
        branchCode: currentBranch?.code || '',
        branchName: currentBranch?.name || '',
        specialization: selectedSpec,
        semesterId: selectedSem,
        careerRoles: selectedRoles
      });
    }

    function bindEvents() {
      // Search input
      const searchInput = container.querySelector('#tp-taxonomy-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value;
          if (searchQuery.trim().length > 1) {
            const results = TaxonomyEngine.searchTaxonomy(searchQuery);
            if (results.length > 0) {
              selectedDeptId = results[0].id;
              if (results[0].branches.length > 0) {
                selectedBranchId = results[0].branches[0].id;
              }
              renderUI();
            }
          }
        });
      }

      const clearSearchBtn = container.querySelector('#tp-taxonomy-clear-search');
      if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
          searchQuery = '';
          renderUI();
        });
      }

      // Department Change
      const deptSelect = container.querySelector('#tp-select-department');
      if (deptSelect) {
        deptSelect.addEventListener('change', (e) => {
          selectedDeptId = e.target.value;
          const branches = TaxonomyEngine.getBranchesByDepartment(selectedDeptId);
          if (branches.length > 0) {
            selectedBranchId = branches[0].id;
            const specs = branches[0].specializations || [];
            selectedSpec = specs.length > 0 ? specs[0].name : '';
            selectedRoles = [];
          }
          renderUI();
        });
      }

      // Branch Change
      const branchSelect = container.querySelector('#tp-select-branch');
      if (branchSelect) {
        branchSelect.addEventListener('change', (e) => {
          selectedBranchId = e.target.value;
          const specs = TaxonomyEngine.getSpecializationsByBranch(selectedBranchId);
          selectedSpec = specs.length > 0 ? specs[0].name : '';
          selectedRoles = [];
          renderUI();
        });
      }

      // Specialization Change
      const specSelect = container.querySelector('#tp-select-specialization');
      if (specSelect) {
        specSelect.addEventListener('change', (e) => {
          selectedSpec = e.target.value;
          notifyChange();
        });
      }
      const specInput = container.querySelector('#tp-input-specialization');
      if (specInput) {
        specInput.addEventListener('input', (e) => {
          selectedSpec = e.target.value;
          notifyChange();
        });
      }

      // Semester Change
      const semSelect = container.querySelector('#tp-select-semester');
      if (semSelect) {
        semSelect.addEventListener('change', (e) => {
          selectedSem = e.target.value;
          notifyChange();
        });
      }

      // Role Chips Multi-Select
      container.querySelectorAll('.tp-role-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const role = btn.getAttribute('data-role');
          if (selectedRoles.includes(role)) {
            selectedRoles = selectedRoles.filter(r => r !== role);
          } else {
            selectedRoles.push(role);
          }
          renderUI();
        });
      });

      // Select All Roles
      const selectAllBtn = container.querySelector('#tp-roles-select-all');
      if (selectAllBtn) {
        selectAllBtn.addEventListener('click', () => {
          const roles = TaxonomyEngine.getSuggestedRoles(selectedBranchId);
          selectedRoles = [...roles];
          renderUI();
        });
      }

      // Clear All Roles
      const clearAllBtn = container.querySelector('#tp-roles-clear-all');
      if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
          selectedRoles = [];
          renderUI();
        });
      }
    }

    renderUI();

    return {
      getValues: () => ({
        departmentId: selectedDeptId,
        branchId: selectedBranchId,
        specialization: selectedSpec,
        semesterId: selectedSem,
        careerRoles: selectedRoles
      })
    };
  }
}
