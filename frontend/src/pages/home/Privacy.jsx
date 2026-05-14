import LegalPage, { Section, InfoBox } from "./LegalPage";

/* ─── Privacy Policy ─── */
function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How LibraryMS collects, uses, and protects your personal information."
      icon="fa-solid fa-shield-halved"
      updatedDate="February 2026"
    >
      <Section title="1. Introduction">
        <InfoBox>
          LibraryMS is committed to protecting your privacy. This policy applies
          to all users — members, admins, and super admins.
        </InfoBox>
        <p>
          LibraryMS ("we", "our", "us") operates a full-stack Library Management
          System with JWT authentication, OTP-based email verification, and
          role-based access control. This Privacy Policy explains what data we
          collect, why we collect it, and how we keep it safe.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <p>We collect the following categories of personal information:</p>
        <ul>
          <li><strong>Account data</strong> — name, email address, hashed password (bcrypt), role (Member / Admin / Super Admin).</li>
          <li><strong>OTP verification data</strong> — one-time passcodes sent via Brevo (Sendinblue) for admin account creation; not stored after verification.</li>
          <li><strong>Location data</strong> — state and city selected during registration (used for dynamic dropdowns).</li>
          <li><strong>Library activity</strong> — books issued, return dates, membership plan, account status.</li>
          <li><strong>Technical data</strong> — JWT session tokens, IP address, browser type (for security logging only).</li>
        </ul>
        <p>We do <strong>not</strong> collect payment information, government IDs, or biometric data.</p>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul>
          <li>Authenticate and manage your account securely (JWT tokens).</li>
          <li>Send OTP emails required for admin creation via Brevo.</li>
          <li>Manage book issuance, returns, and membership plans.</li>
          <li>Generate admin reports and analytics (anonymised where possible).</li>
          <li>Maintain system security and prevent unauthorised access.</li>
        </ul>
      </Section>

      <Section title="4. Data Storage & Security">
        <p>
          Your data is stored in a <strong>PostgreSQL database hosted on Neon Cloud DB</strong>.
          Passwords are hashed using <strong>bcrypt</strong> before storage — we never store
          plain-text passwords. Session tokens are signed with <strong>JWT</strong> and expire
          automatically.
        </p>
        <p>
          The application is deployed on <strong>Render</strong>. All traffic is served over
          HTTPS. Database credentials and secret keys are stored as environment variables
          and never exposed in source code.
        </p>
      </Section>

      <Section title="5. Third-Party Services">
        <ul>
          <li><strong>Brevo (Sendinblue)</strong> — transactional email for OTP delivery. Brevo processes email addresses per their own privacy policy.</li>
          <li><strong>Neon DB</strong> — cloud PostgreSQL provider for secure data persistence.</li>
          <li><strong>Render</strong> — cloud hosting provider for the backend API.</li>
        </ul>
        <p>We do not sell your data to any third party.</p>
      </Section>

      <Section title="6. Role-Based Access">
        <p>
          Access to user data is strictly role-gated:
        </p>
        <ul>
          <li><strong>Members</strong> — can view and manage their own account only.</li>
          <li><strong>Admins</strong> — can manage books and members in their scope.</li>
          <li><strong>Super Admin</strong> — full system access; cannot be deleted by other admins.</li>
        </ul>
      </Section>

      <Section title="7. Data Retention">
        <p>
          Member and admin account data is retained for as long as the account is active.
          Upon deletion, personal data is purged from the database within 30 days.
          OTP codes are discarded immediately after use or expiry.
        </p>
      </Section>

      <Section title="8. Your Rights">
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your account and associated data.</li>
          <li>Withdraw consent for email communications.</li>
        </ul>
        <p>
          To exercise any of these rights, email us at{" "}
          <a href="mailto:support@libraryms.in">support@libraryms.in</a>.
        </p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be
          published on this page with an updated date. Continued use of LibraryMS
          after changes constitutes acceptance of the revised policy.
        </p>
      </Section>
    </LegalPage>
  );
}

export default Privacy;