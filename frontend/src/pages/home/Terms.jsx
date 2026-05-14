import LegalPage, { Section, InfoBox } from "./LegalPage";

/* ─── Terms of Use ─── */
function Terms() {
  return (
    <LegalPage
      title="Terms of Use"
      subtitle="Please read these terms carefully before using LibraryMS."
      icon="fa-solid fa-file-contract"
      updatedDate="February 2026"
    >
      <Section title="1. Acceptance of Terms">
        <InfoBox>
          By accessing or using LibraryMS you agree to be bound by these Terms.
          If you disagree, please discontinue use immediately.
        </InfoBox>
        <p>
          These Terms of Use ("Terms") govern your access to and use of the
          LibraryMS platform — including the web application, REST APIs, and all
          related services (collectively "the Service"). The Service is operated
          by LibraryMS ("we", "us").
        </p>
      </Section>

      <Section title="2. Eligibility">
        <ul>
          <li>You must be at least 13 years old to use LibraryMS.</li>
          <li>Admin accounts may only be created by individuals authorised by a Super Admin via OTP verification.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
        </ul>
      </Section>

      <Section title="3. User Roles & Responsibilities">
        <p>LibraryMS operates a role-based access system:</p>
        <ul>
          <li><strong>Members</strong> — may browse books, issue books, return books, and manage their own account.</li>
          <li><strong>Admins</strong> — may manage books, manage members, and generate reports. Admin accounts require OTP email verification.</li>
          <li><strong>Super Admin</strong> — has full system access. Super Admin accounts cannot be deleted by standard admins.</li>
        </ul>
        <p>
          You agree to use the Service only for its intended library management
          purposes and not to misuse any role or privilege.
        </p>
      </Section>

      <Section title="4. Acceptable Use">
        <p>You agree <strong>not</strong> to:</p>
        <ul>
          <li>Attempt to bypass JWT authentication or session security.</li>
          <li>Use the API endpoints to scrape, overload, or attack the system.</li>
          <li>Create fake member or admin accounts.</li>
          <li>Share your credentials or JWT tokens with unauthorised users.</li>
          <li>Use the system to store or distribute content unrelated to library management.</li>
          <li>Reverse-engineer, decompile, or copy the source code without permission.</li>
        </ul>
      </Section>

      <Section title="5. Book Issuance & Returns">
        <ul>
          <li>Issued books must be returned by the due date displayed in your account.</li>
          <li>Repeated late returns may result in membership suspension at admin discretion.</li>
          <li>LibraryMS records all issuance and return events for audit purposes.</li>
        </ul>
      </Section>

      <Section title="6. API Usage">
        <p>
          The LibraryMS REST API is available for authorised integrations. API usage is
          subject to rate limits. Misuse of the API — including automated scraping,
          credential stuffing, or DDoS — will result in immediate account termination
          and may be reported to relevant authorities.
        </p>
        <p>
          Full API documentation is available at <strong>/api-reference</strong>.
        </p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>
          All code, design, and content within LibraryMS — including the frontend
          (React.js), backend (Node.js / Express.js), and database schema (PostgreSQL)
          — are the intellectual property of the author (Saurabh) unless otherwise stated.
          You may not reproduce or redistribute any part of the Service without
          explicit written permission.
        </p>
      </Section>

      <Section title="8. Termination">
        <p>
          We reserve the right to suspend or terminate any account that violates
          these Terms without prior notice. Upon termination, your access to the
          Service will be revoked and your data handled per our Privacy Policy.
        </p>
      </Section>

      <Section title="9. Disclaimer of Warranties">
        <p>
          LibraryMS is provided "as is" without warranties of any kind. We do not
          guarantee uninterrupted availability, though we aim to maintain high uptime
          via Render deployment and Neon Cloud DB.
        </p>
      </Section>

      <Section title="10. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, LibraryMS and its author shall not
          be liable for any indirect, incidental, or consequential damages arising
          from your use of the Service.
        </p>
      </Section>

      <Section title="11. Changes to Terms">
        <p>
          We may revise these Terms at any time. Updated terms will be published here
          with a new effective date. Continued use of the Service after changes
          constitutes your acceptance.
        </p>
      </Section>
    </LegalPage>
  );
}

export default Terms;