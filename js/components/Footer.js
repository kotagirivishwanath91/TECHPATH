/**
 * TECHPATH — GLOBAL APPLICATION FOOTER
 * Structured into four clearly organized columns:
 * 1. Brand & Mission: TECHPATH, Tagline, Subtagline, Copyright
 * 2. Legal & Privacy: Terms of Use, Privacy Policy, Cookie Preferences, Privacy & Data, Data Deletion Request
 * 3. Support: FAQs, Contact Us, Support Tickets
 * 4. Account / Preferences: Settings, Preferences
 */

export class FooterComponent {
  static render() {
    return `
      <footer id="tp-global-footer" class="tp-global-footer" role="contentinfo">
        <div class="tp-footer-inner">
          
          <!-- Brand & Mission Column -->
          <div class="tp-footer-col tp-footer-col-brand">
            <div class="tp-footer-brand">
              <a href="#/dashboard" class="tp-footer-logo" aria-label="TechPath Home">
                TECH<span style="color:var(--tp-primary)">PATH</span>
              </a>
            </div>
            <p class="tp-footer-tagline">Learn. Build. Prepare. Grow.</p>
            <p class="tp-footer-subtagline">From Classroom to Career.</p>
            <div class="tp-footer-copy">
              &copy; 2026 TechPath Platform Governance Board. All rights reserved.
            </div>
          </div>

          <!-- Legal & Privacy Column -->
          <div class="tp-footer-col">
            <h4 class="tp-footer-heading">Legal &amp; Privacy</h4>
            <ul class="tp-footer-nav" role="list">
              <li><a href="#/terms" class="tp-footer-link" id="footer-terms-link">Terms of Use</a></li>
              <li><a href="#/legal/privacy" class="tp-footer-link" id="footer-privacy-link">Privacy Policy</a></li>
              <li><a href="#/preferences?tab=cookies" class="tp-footer-link" id="footer-cookies-link">Cookie Preferences</a></li>
              <li><a href="#/legal/privacy" class="tp-footer-link" id="footer-privacy-data-link">Privacy &amp; Data</a></li>
              <li><a href="#/legal/deletion-request" class="tp-footer-link" id="footer-deletion-link">Data Deletion Request</a></li>
            </ul>
          </div>

          <!-- Support Column -->
          <div class="tp-footer-col">
            <h4 class="tp-footer-heading">Support</h4>
            <ul class="tp-footer-nav" role="list">
              <li><a href="#/faq" class="tp-footer-link" id="footer-faq-link">FAQs</a></li>
              <li><a href="#/contact" class="tp-footer-link" id="footer-contact-link">Contact Us</a></li>
              <li><a href="#/contact?tab=tickets" class="tp-footer-link" id="footer-tickets-link">Support Tickets</a></li>
            </ul>
          </div>

          <!-- Account / Preferences Column -->
          <div class="tp-footer-col">
            <h4 class="tp-footer-heading">Account / Preferences</h4>
            <ul class="tp-footer-nav" role="list">
              <li><a href="#/settings" class="tp-footer-link" id="footer-settings-link">Settings</a></li>
              <li><a href="#/preferences" class="tp-footer-link" id="footer-preferences-link">Preferences</a></li>
            </ul>
          </div>

        </div>
      </footer>
    `;
  }
}
