/**
 * TECHPATH — DEDICATED THANK-YOU PAGES
 * Supports both Contact Submission & Review Submission flows with rich futuristic UI
 */
export class ThankYouPage {
  static render(container, type = 'contact') {
    if (!container) return;

    // Detect type and query parameters from hash
    const hash = window.location.hash || '';
    const isReview = type === 'review' || hash.includes('/reviews/thank-you');
    
    // Extract ticketId query param if present
    let ticketId = 'TCK-' + Math.floor(100000 + Math.random() * 900000);
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
      const params = new URLSearchParams(hash.slice(queryIndex));
      if (params.get('ticketId')) {
        ticketId = params.get('ticketId');
      }
    }

    if (isReview) {
      this._renderReviewThankYou(container);
    } else {
      this._renderContactThankYou(container, ticketId);
    }
  }

  static _renderContactThankYou(container, ticketId) {
    container.innerHTML = `
      <div class="tp-thankyou-wrapper" style="
        min-height: calc(100vh - 120px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2.5rem 1.5rem;
        background: radial-gradient(circle at 50% 25%, rgba(16, 185, 129, 0.08) 0%, #030712 100%);
        position: relative;
        overflow: hidden;
      ">
        <!-- Ambient Green/Cyan Glow -->
        <div style="
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
          filter: blur(80px);
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        "></div>

        <div style="
          position: relative;
          z-index: 2;
          max-width: 620px;
          width: 100%;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-top: 2px solid #10b981;
          border-radius: 24px;
          padding: 3rem 2.25rem;
          text-align: center;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.15);
          backdrop-filter: blur(20px);
        ">
          <!-- Animated Checkmark Emblem -->
          <div style="
            width: 84px;
            height: 84px;
            margin: 0 auto 1.75rem auto;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2));
            border: 2px solid #10b981;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.35);
          ">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>

          <!-- Status Ribbon -->
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 999px; padding: 0.4rem 1.1rem; margin-bottom: 1.25rem;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
            <span style="font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6ee7b7;">DISPATCH CONFIRMED</span>
          </div>

          <h1 style="font-size: 2rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.85rem; font-family: 'Space Grotesk', system-ui, sans-serif;">
            Inquiry Received Successfully
          </h1>
          <p style="color: #94a3b8; font-size: 1rem; line-height: 1.6; margin-bottom: 2rem; max-width: 500px; margin-left: auto; margin-right: auto;">
            Thank you for reaching out to the TechPath Academic Operations Team. Your support ticket has been registered in our tracking cluster.
          </p>

          <!-- Ticket Reference Information Box -->
          <div style="
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
          ">
            <div>
              <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 0.25rem;">Reference Ticket ID</div>
              <div style="font-family: monospace; font-size: 1.2rem; font-weight: 700; color: #38bdf8;">${ticketId}</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 0.25rem;">Guaranteed Response</div>
              <div style="font-size: 1rem; font-weight: 700; color: #10b981;">Within 24 Hours</div>
            </div>
            <div style="grid-column: 1 / -1; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 0.85rem;">
              <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 0.25rem;">Official Operations Liaison</div>
              <a href="mailto:kotagirivishanath91@gmail.com" style="color: #cbd5e1; text-decoration: none; font-size: 0.9rem; word-break: break-all; font-family: monospace;">
                kotagirivishanath91@gmail.com
              </a>
            </div>
          </div>

          <!-- Direct Navigation Actions -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.85rem; justify-content: center; align-items: center;">
            <a href="#/dashboard" class="tp-btn tp-btn-primary" style="
              background: linear-gradient(135deg, #10b981, #06b6d4);
              color: #ffffff;
              padding: 0.8rem 1.75rem;
              font-weight: 700;
              font-size: 0.95rem;
              border-radius: 12px;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              box-shadow: 0 4px 18px rgba(16, 185, 129, 0.35);
              transition: transform 0.2s;
            ">
              Go to Dashboard
            </a>
            <a href="#/" style="
              background: rgba(255, 255, 255, 0.06);
              color: #e2e8f0;
              border: 1px solid rgba(255, 255, 255, 0.15);
              padding: 0.8rem 1.4rem;
              font-weight: 600;
              font-size: 0.95rem;
              border-radius: 12px;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              transition: background 0.2s;
            ">
              Return Home
            </a>
            <a href="#/contact" style="
              background: transparent;
              color: #94a3b8;
              border: 1px solid rgba(255, 255, 255, 0.08);
              padding: 0.8rem 1.3rem;
              font-weight: 600;
              font-size: 0.95rem;
              border-radius: 12px;
              text-decoration: none;
              transition: color 0.2s;
            ">
              Send Another Message
            </a>
          </div>
        </div>
      </div>
    `;
  }

  static _renderReviewThankYou(container) {
    container.innerHTML = `
      <div class="tp-thankyou-wrapper" style="
        min-height: calc(100vh - 120px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2.5rem 1.5rem;
        background: radial-gradient(circle at 50% 25%, rgba(168, 85, 247, 0.1) 0%, #030712 100%);
        position: relative;
        overflow: hidden;
      ">
        <!-- Ambient Purple Glow -->
        <div style="
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, transparent 70%);
          filter: blur(80px);
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        "></div>

        <div style="
          position: relative;
          z-index: 2;
          max-width: 620px;
          width: 100%;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-top: 2px solid #a855f7;
          border-radius: 24px;
          padding: 3rem 2.25rem;
          text-align: center;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(168, 85, 247, 0.2);
          backdrop-filter: blur(20px);
        ">
          <!-- Animated Star Emblem -->
          <div style="
            width: 84px;
            height: 84px;
            margin: 0 auto 1.75rem auto;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2));
            border: 2px solid #a855f7;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 30px rgba(168, 85, 247, 0.35);
          ">
            <span style="font-size: 2.2rem;">⭐</span>
          </div>

          <!-- Status Ribbon -->
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(168, 85, 247, 0.12); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: 999px; padding: 0.4rem 1.1rem; margin-bottom: 1.25rem;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #a855f7; box-shadow: 0 0 8px #a855f7;"></span>
            <span style="font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #d8b4fe;">FEEDBACK CATALOGUED</span>
          </div>

          <h1 style="font-size: 2rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.85rem; font-family: 'Space Grotesk', system-ui, sans-serif;">
            Thank You for Shaping TechPath!
          </h1>
          <p style="color: #cbd5e1; font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.75rem; max-width: 520px; margin-left: auto; margin-right: auto;">
            Your academic feedback directly empowers thousands of engineering students across branches to elevate their technical mastery.
          </p>

          <!-- Moderation & Quality Box -->
          <div style="
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 1.25rem 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
            display: flex;
            gap: 1rem;
            align-items: flex-start;
          ">
            <span style="font-size: 1.5rem; line-height: 1;">🛡️</span>
            <div>
              <div style="font-size: 0.88rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.2rem;">Academic Moderation Policy</div>
              <div style="font-size: 0.82rem; color: #94a3b8; line-height: 1.5;">
                To preserve academic authenticity, your review has been instantly added to your local profile and will appear publicly within 12–24 hours after verification by our community stewards.
              </div>
            </div>
          </div>

          <!-- Direct Navigation Actions -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.85rem; justify-content: center; align-items: center;">
            <a href="#/reviews" class="tp-btn tp-btn-primary" style="
              background: linear-gradient(135deg, #a855f7, #3b82f6);
              color: #ffffff;
              padding: 0.8rem 1.75rem;
              font-weight: 700;
              font-size: 0.95rem;
              border-radius: 12px;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              box-shadow: 0 4px 18px rgba(168, 85, 247, 0.35);
              transition: transform 0.2s;
            ">
              Explore Community Reviews
            </a>
            <a href="#/dashboard" style="
              background: rgba(255, 255, 255, 0.06);
              color: #e2e8f0;
              border: 1px solid rgba(255, 255, 255, 0.15);
              padding: 0.8rem 1.4rem;
              font-weight: 600;
              font-size: 0.95rem;
              border-radius: 12px;
              text-decoration: none;
              transition: background 0.2s;
            ">
              Go to Dashboard
            </a>
            <a href="#/learnhub" style="
              background: transparent;
              color: #94a3b8;
              border: 1px solid rgba(255, 255, 255, 0.08);
              padding: 0.8rem 1.3rem;
              font-weight: 600;
              font-size: 0.95rem;
              border-radius: 12px;
              text-decoration: none;
              transition: color 0.2s;
            ">
              Continue Learning
            </a>
          </div>
        </div>
      </div>
    `;
  }
}
