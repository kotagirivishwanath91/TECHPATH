/**
 * TECHPATH — TOAST NOTIFICATION SYSTEM
 * Lightweight, accessible, self-dismissing toast notifications
 */
export class Toast {
  static show(message, type = 'info', duration = 3500) {
    const root = document.getElementById('tp-toast-root');
    if (!root) return;

    const toast = document.createElement('div');
    toast.className = `tp-toast tp-toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    toast.innerHTML = `
      <span class="tp-toast-icon">${icons[type] || icons.info}</span>
      <span class="tp-toast-msg">${message}</span>
      <button class="tp-toast-close" aria-label="Dismiss notification">×</button>
    `;

    root.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('tp-toast-enter'));

    let isDismissed = false;
    let timer = null;

    const dismiss = () => {
      if (isDismissed) return;
      isDismissed = true;
      if (timer) clearTimeout(timer);
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 220);
    };

    const closeBtn = toast.querySelector('.tp-toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismiss();
      });
    }

    timer = setTimeout(dismiss, duration);
  }

  static success(msg) { this.show(msg, 'success'); }
  static error(msg) { this.show(msg, 'error', 5000); }
  static warning(msg) { this.show(msg, 'warning', 4000); }
  static info(msg) { this.show(msg, 'info'); }
}
