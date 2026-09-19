/**
 * TECHPATH — MODAL SYSTEM
 * Accessible, focus-trapped modal dialogs
 */
export class Modal {
  static _current = null;

  static show({ title, body, actions = [], size = 'md', onClose }) {
    const root = document.getElementById('tp-modal-root');
    if (!root) return;
    this.close(); // close any existing

    const sizeMap = { sm: '420px', md: '560px', lg: '760px', xl: '960px' };

    const overlay = document.createElement('div');
    overlay.className = 'tp-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', title);

    overlay.innerHTML = `
      <div class="tp-modal" style="max-width:${sizeMap[size] || sizeMap.md};">
        <div class="tp-modal-header">
          <h2 class="tp-modal-title">${title}</h2>
          <button class="tp-modal-close" aria-label="Close modal">×</button>
        </div>
        <div class="tp-modal-body">${body}</div>
        ${actions.length ? `
          <div class="tp-modal-footer">
            ${actions.map(a => `<button class="tp-btn ${a.class || 'tp-btn-secondary'}" data-action="${a.id}">${a.label}</button>`).join('')}
          </div>` : ''}
      </div>
    `;

    overlay.querySelector('.tp-modal-close').addEventListener('click', () => this.close(onClose));
    overlay.addEventListener('click', e => { if (e.target === overlay) this.close(onClose); });

    actions.forEach(a => {
      const btn = overlay.querySelector(`[data-action="${a.id}"]`);
      if (btn && a.onClick) btn.addEventListener('click', () => a.onClick(overlay));
    });

    // Keyboard trap
    overlay.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close(onClose);
      if (e.key === 'Tab') this._trapFocus(e, overlay);
    });

    root.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('tp-modal-enter'));
    overlay.querySelector('.tp-modal-close').focus();
    this._current = overlay;
    return overlay;
  }

  static close(onClose) {
    if (!this._current) return;
    const el = this._current;
    this._current = null;
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.18s ease';
    setTimeout(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
      document.body.style.overflow = '';
      if (onClose) onClose();
    }, 180);
  }

  static _trapFocus(e, container) {
    const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
  }

  /** Confirm dialog shorthand */
  static confirm({ title, message, confirmLabel = 'Confirm', danger = false }) {
    return new Promise(resolve => {
      this.show({
        title,
        body: `<p style="color:var(--tp-text-dark-secondary);line-height:1.6">${message}</p>`,
        actions: [
          { id: 'cancel', label: 'Cancel', class: 'tp-btn-ghost', onClick: () => { this.close(); resolve(false); } },
          { id: 'confirm', label: confirmLabel, class: danger ? 'tp-btn-danger' : 'tp-btn-primary', onClick: () => { this.close(); resolve(true); } }
        ]
      });
    });
  }
}
