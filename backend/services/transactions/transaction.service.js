"use strict";
const db = require("../../config/db");

const FINE_PER_DAY = 5;

async function issueBook(book_id, member_id, due_date) {
  const client = await db.connect();
  try {
    await client.query("BEGIN"); // Transaction Start

    // 1. Fetch Member & Validate
    const memberRes = await client.query(
      `SELECT id, status, membership_end, max_books_allowed, is_deleted 
       FROM members WHERE id = $1 FOR UPDATE`,
      [member_id],
    );
    if (memberRes.rows.length === 0) throw new Error("Member does not exist.");
    const member = memberRes.rows[0];
    if (member.is_deleted) throw new Error("Member account is deleted.");
    if (member.status !== "active")
      throw new Error(`Member is ${member.status}, cannot issue books.`);

    // 2. Fetch Book & Validate Availability
    const bookRes = await client.query(
      `SELECT id, title, available_copies FROM books WHERE id = $1 FOR UPDATE`,
      [book_id],
    );
    if (bookRes.rows.length === 0) throw new Error("Book not found.");
    if (bookRes.rows[0].available_copies < 1)
      throw new Error("Book is out of stock.");

    // 3. Check Borrow Limit
    const countRes = await client.query(
      `SELECT COUNT(*) FROM issues WHERE member_id = $1 AND status = 'issued'`,
      [member_id],
    );
    const limit = member.max_books_allowed || 3;
    if (parseInt(countRes.rows[0].count) >= limit)
      throw new Error(`Borrow limit reached (Max: ${limit}).`);

    // 4. Perform Insert
    const issueRes = await client.query(
      `INSERT INTO issues (book_id, member_id, issue_date, due_date, status) 
       VALUES ($1, $2, CURRENT_DATE, $3, 'issued') RETURNING *`,
      [book_id, member_id, due_date],
    );

    // 5. Update Book Copies
    await client.query(
      `UPDATE books SET available_copies = available_copies - 1 WHERE id = $1`,
      [book_id],
    );

    await client.query("COMMIT"); // Transaction Success
    return issueRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK"); // Transaction Failed
    console.error("Transaction Failed:", err.message);
    throw err;
  } finally {
    client.release();
  }
}

async function returnBook(issue_id) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const issueRes = await client.query(
      `SELECT i.*, b.title AS book_title, CONCAT(m.first_name, ' ', COALESCE(m.last_name, '')) AS member_name
       FROM issues i
       JOIN books b ON b.id = i.book_id
       JOIN members m ON m.id = i.member_id
       WHERE i.id = $1 AND i.status = 'issued'`,
      [issue_id],
    );
    if (issueRes.rows.length === 0)
      throw new Error("Issue record not found or book is already returned.");

    const issue = issueRes.rows[0];
    const today = new Date();
    const dueDate = new Date(issue.due_date);

    let fine = 0,
      overdueDays = 0;
    if (today > dueDate) {
      overdueDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      fine = overdueDays * FINE_PER_DAY;
    }

    await client.query(
      `UPDATE issues SET status = 'returned', return_date = NOW() WHERE id = $1`,
      [issue_id],
    );
    await client.query(
      `INSERT INTO returns (issue_id, fine_amount) VALUES ($1, $2)`,
      [issue_id, fine],
    );
    await client.query(
      `UPDATE books SET available_copies = available_copies + 1 WHERE id = $1`,
      [issue.book_id],
    );

    await client.query("COMMIT");
    return {
      issue_id,
      book_title: issue.book_title,
      member_name: issue.member_name.trim(),
      fine,
      overdue_days: overdueDays,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/* ════════════════════════════════════════════════════════════════
   ADMIN & LIBRARIAN TRANSACTIONS (Fixed to query 'issues' table)
════════════════════════════════════════════════════════════════ */

async function getAllTransactions({
  status = "all",
  search = "",
  page = 1,
  limit = 10,
} = {}) {
  const conditions = [];
  const params = [];
  let i = 1;

  if (status !== "all") {
    conditions.push(`i.status = $${i++}`);
    params.push(status);
  }
  if (search.trim()) {
    conditions.push(
      `(b.title ILIKE $${i} OR m.first_name ILIKE $${i} OR m.last_name ILIKE $${i} OR m.email ILIKE $${i})`,
    );
    params.push(`%${search.trim()}%`);
    i++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT 
      i.id, i.book_id, i.member_id, i.issue_date, i.due_date, i.return_date, i.status,
      b.title AS book_title, b.isbn AS book_isbn,
      CONCAT(m.first_name, ' ', COALESCE(m.last_name, '')) AS member_name, m.email AS member_email,
      COALESCE(r.fine_amount, 0)::NUMERIC AS fine_amount,
      CASE WHEN i.status = 'issued' AND CURRENT_DATE > i.due_date::DATE THEN TRUE ELSE FALSE END AS is_overdue,
      CASE WHEN i.status = 'issued' AND CURRENT_DATE > i.due_date::DATE THEN CURRENT_DATE - i.due_date::DATE ELSE 0 END AS overdue_days,
      CASE WHEN i.status = 'issued' AND CURRENT_DATE > i.due_date::DATE THEN (CURRENT_DATE - i.due_date::DATE) * ${FINE_PER_DAY} ELSE 0 END AS current_fine
    FROM issues i
    LEFT JOIN books b ON b.id = i.book_id
    LEFT JOIN members m ON m.id = i.member_id
    LEFT JOIN returns r ON r.issue_id = i.id
    ${where}
    ORDER BY i.issue_date DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;
  params.push(limit, offset);

  const countQuery = `
    SELECT COUNT(*) AS total FROM issues i
    LEFT JOIN books b ON b.id = i.book_id
    LEFT JOIN members m ON m.id = i.member_id
    ${where}
  `;

  const [dataRes, countRes] = await Promise.all([
    db.query(dataQuery, params),
    db.query(countQuery, params.slice(0, -2)),
  ]);

  const total = parseInt(countRes.rows[0].total, 10);
  return {
    transactions: dataRes.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

async function getTransactionStats() {
  const res = await db.query(`
    SELECT
      COUNT(*) FILTER (WHERE i.status = 'issued') AS total_issued,
      COUNT(*) FILTER (WHERE i.status = 'returned') AS total_returned,
      COUNT(*) FILTER (WHERE i.status = 'issued' AND CURRENT_DATE > i.due_date::DATE) AS total_overdue,
      COALESCE(SUM(r.fine_amount), 0)::NUMERIC AS total_fines_collected,
      COALESCE(SUM(CASE WHEN i.status = 'issued' AND CURRENT_DATE > i.due_date::DATE
        THEN (CURRENT_DATE - i.due_date::DATE) * ${FINE_PER_DAY} ELSE 0 END), 0)::NUMERIC AS pending_fines
    FROM issues i 
    LEFT JOIN returns r ON r.issue_id = i.id
  `);
  return res.rows[0];
}

async function getMonthlyIssueStats(year) {
  // ... Keep your existing getMonthlyIssueStats code exactly as it is ...
}

/* ════════════════════════════════════════════════════════════════
   PERSONAL MEMBER DASHBOARD FUNCTIONS
════════════════════════════════════════════════════════════════ */

// 1. Get List of Personal Borrowing History
async function getMemberTransactions(member_id) {
  const dataQuery = `
    SELECT 
      i.id, i.issue_date, i.due_date, i.return_date, i.status,
      b.title AS book_title,
      CASE 
        WHEN i.status='issued' AND CURRENT_DATE > i.due_date::DATE THEN (CURRENT_DATE - i.due_date::DATE) * ${FINE_PER_DAY}
        WHEN i.status='returned' THEN COALESCE(r.fine_amount, 0)
        ELSE 0 
      END AS fine
    FROM issues i
    LEFT JOIN books b ON b.id = i.book_id
    LEFT JOIN returns r ON r.issue_id = i.id
    WHERE i.member_id = $1
    ORDER BY i.issue_date DESC
  `;
  const { rows } = await db.query(dataQuery, [member_id]);
  return rows;
}

// 2. Get KPI Stats for Personal Dashboard
async function getMyDashboardStats(member_id) {
  const query = `
    SELECT
      COUNT(*) FILTER (WHERE i.status = 'issued') AS active_issues,
      COUNT(*) FILTER (WHERE i.status = 'returned') AS total_read,
      COUNT(*) FILTER (WHERE i.status = 'issued' AND CURRENT_DATE > i.due_date::DATE) AS overdue,
      COALESCE(SUM(CASE 
        WHEN i.status = 'issued' AND CURRENT_DATE > i.due_date::DATE THEN (CURRENT_DATE - i.due_date::DATE) * ${FINE_PER_DAY}
        ELSE 0 
      END), 0)::NUMERIC AS total_fine
    FROM issues i
    WHERE i.member_id = $1
  `;
  const { rows } = await db.query(query, [member_id]);

  return {
    active_issues: parseInt(rows[0].active_issues) || 0,
    total_read: parseInt(rows[0].total_read) || 0,
    overdue: parseInt(rows[0].overdue) || 0,
    total_fine: parseInt(rows[0].total_fine) || 0,
  };
}

module.exports = {
  issueBook,
  returnBook,
  getAllTransactions,
  getTransactionStats,
  getMonthlyIssueStats,
  getMemberTransactions,
  getMyDashboardStats,
};
