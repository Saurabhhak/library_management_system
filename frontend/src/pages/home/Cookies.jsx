import LegalPage, { Section, InfoBox } from "./LegalPage";

/* ─── Cookie Policy ─── */
function Cookies() {
  return (
    <LegalPage
      title="Cookie Policy"
      subtitle="How LibraryMS uses cookies and similar technologies."
      icon="fa-solid fa-cookie-bite"
      updatedDate="February 2026"
    >
      <Section title="1. What Are Cookies?">
        <InfoBox>
          LibraryMS uses minimal cookies — primarily for authentication and
          session security. We do not use advertising or tracking cookies.
        </InfoBox>
        <p>
          Cookies are small text files stored in your browser when you visit a
          website. They help the site remember preferences and keep you logged in
          across page refreshes. LibraryMS uses both cookies and
          <strong> localStorage / sessionStorage</strong> for session management.
        </p>
      </Section>

      <Section title="2. Cookies We Use">
        <p>
          We use a very small, purposeful set of cookies. No advertising or
          behavioural tracking cookies are used.
        </p>
        <ul>
          <li>
            <strong>auth_token</strong> (Essential) — stores your JWT access token
            to keep you authenticated between page navigations. Expires when you
            log out or the token TTL (time-to-live) is reached.
          </li>
          <li>
            <strong>session_id</strong> (Essential) — a short-lived session identifier
            used for CSRF protection. Cleared on browser close.
          </li>
          <li>
            <strong>theme_pref</strong> (Functional) — remembers your UI preference
            (light / dark mode). Optional; persists for 30 days.
          </li>
        </ul>
      </Section>

      <Section title="3. Local Storage Usage">
        <p>
          In addition to cookies, LibraryMS may store non-sensitive data in your
          browser's <strong>localStorage</strong>:
        </p>
        <ul>
          <li>Decoded JWT payload (role, user ID) for client-side routing guards.</li>
          <li>UI state such as sidebar collapse preference.</li>
          <li>OTP resend timer state (temporary, cleared after use).</li>
        </ul>
        <p>
          This data never leaves your browser and is not transmitted to our servers
          independently of authenticated API requests.
        </p>
      </Section>

      <Section title="4. Third-Party Cookies">
        <p>
          LibraryMS does <strong>not</strong> load third-party advertising scripts,
          social media pixels, or analytics trackers. The only external service that
          may set a cookie during use is <strong>Brevo</strong> (for OTP email
          delivery tracking), which is governed by{" "}
          <a
            href="https://www.brevo.com/legal/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Brevo's Privacy Policy
          </a>.
        </p>
      </Section>

      <Section title="5. Essential vs Optional Cookies">
        <ul>
          <li>
            <strong>Essential cookies</strong> (auth_token, session_id) — required
            for the Service to function. You cannot opt out of these while using
            LibraryMS.
          </li>
          <li>
            <strong>Functional cookies</strong> (theme_pref) — improve your
            experience but are not required. You can clear these at any time via
            your browser settings.
          </li>
        </ul>
      </Section>

      <Section title="6. Managing Cookies">
        <p>
          You can control cookies through your browser settings:
        </p>
        <ul>
          <li><strong>Chrome</strong> — Settings → Privacy and Security → Cookies.</li>
          <li><strong>Firefox</strong> — Settings → Privacy & Security → Cookies and Site Data.</li>
          <li><strong>Safari</strong> — Preferences → Privacy → Manage Website Data.</li>
          <li><strong>Edge</strong> — Settings → Cookies and Site Permissions.</li>
        </ul>
        <p>
          Blocking essential cookies (particularly auth_token) will prevent you from
          logging in to LibraryMS.
        </p>
      </Section>

      <Section title="7. Cookie Lifetime">
        <ul>
          <li><strong>Session cookies</strong> — deleted when you close your browser.</li>
          <li><strong>auth_token</strong> — expires per JWT configuration (typically 24 hours).</li>
          <li><strong>theme_pref</strong> — persists for 30 days.</li>
        </ul>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>
          We may update this Cookie Policy as our use of technologies evolves.
          Any changes will be posted here with an updated date. We encourage you
          to review this page periodically.
        </p>
      </Section>
    </LegalPage>
  );
}

export default Cookies;