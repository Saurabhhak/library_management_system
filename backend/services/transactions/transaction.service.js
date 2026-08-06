"use strict";
const db = require("../../config/db");

const FINE_PER_DAY = 5;

async function issueBook(book_id, member_id, due_date) {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const memberRes = await client.query(
      `SELECT id, first_name, last_name, status, membership_end, max_books_allowed, is_deleted
       FROM members WHERE id = $1`,
      [member_id],
    );
    if (memberRes.rows.length === 0) throw new Error("Member not found");
    const member = memberRes.rows[0];
    if (member.is_deleted) throw new Error("Member account is deactivated");
    if (member.status !== "active") throw new Error("Member is not active");
    if (member.membership_end && new Date(member.membership_end) < new Date())
      throw new Error("Member's membership has expired");

    const countRes = await client.query(
      `SELECT COUNT(*) AS cnt FROM issues WHERE member_id = $1 AND status = 'issued'`,
      [member_id],
    );
    const limit = member.max_books_allowed || 3;
    if (parseInt(countRes.rows[0].cnt) >= limit)
      throw new Error(`Borrow limit reached (max ${limit} books)`);

    const bookRes = await client.query(
      `SELECT id, title, available_copies FROM books WHERE id = $1`,
      [book_id],
    );
    if (bookRes.rows.length === 0) throw new Error("Book not found");
    if (bookRes.rows[0].available_copies <= 0)
      throw new Error("No available copies of this book");

    const dupRes = await client.query(
      `SELECT id FROM issues WHERE book_id = $1 AND member_id = $2 AND status = 'issued'`,
      [book_id, member_id],
    );
    if (dupRes.rows.length > 0)
      throw new Error("Member already has this book issued");

    const issueRes = await client.query(
      `INSERT INTO issues (book_id, member_id, due_date, status) VALUES ($1, $2, $3, 'issued') RETURNING *`,
      [book_id, member_id, due_date],
    );

    await client.query(
      `UPDATE books SET available_copies = available_copies - 1 WHERE id = $1`,
      [book_id],
    );

    await client.query("COMMIT");
    return {
      issue: issueRes.rows[0],
      book_title: bookRes.rows[0].title,
      member_name: `${member.first_name} ${member.last_name || ""}`.trim(),
    };
  } catch (err) {
    await client.query("ROLLBACK");
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
      `SELECT i.*, b.title AS book_title,
              CONCAT(m.first_name, ' ', COALESCE(m.last_name, '')) AS member_name
       FROM issues i
       JOIN books   b ON b.id = i.book_id
       JOIN members m ON m.id = i.member_id
       WHERE i.id = $1 AND i.status = 'issued'`,
      [issue_id],
    );
    if (issueRes.rows.length === 0)
      throw new Error("Issue record not found or already returned");

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
    SELECT i.id, i.book_id, i.member_id, i.issue_date, i.due_date, i.return_date, i.status,
      b.title AS book_title, b.isbn AS book_isbn,
      CONCAT(m.first_name, ' ', COALESCE(m.last_name, '')) AS member_name, m.email AS member_email,
      COALESCE(r.fine_amount, 0)::NUMERIC AS fine_amount,
      CASE WHEN i.status = 'issued' AND CURRENT_DATE > i.due_date::DATE
           THEN (CURRENT_DATE - i.due_date::DATE) * ${FINE_PER_DAY} ELSE 0 END AS current_fine,
      CASE WHEN i.status = 'issued' AND CURRENT_DATE > i.due_date::DATE THEN TRUE ELSE FALSE END AS is_overdue,
      CASE WHEN i.status = 'issued' AND CURRENT_DATE > i.due_date::DATE
           THEN CURRENT_DATE - i.due_date::DATE ELSE 0 END AS overdue_days
    FROM issues i
    LEFT JOIN books   b ON b.id = i.book_id
    LEFT JOIN members m ON m.id = i.member_id
    LEFT JOIN returns r ON r.issue_id = i.id
    ${where}
    ORDER BY i.issue_date DESC
    LIMIT $${i} OFFSET $${i + 1}
  `;
  params.push(limit, offset);

  const countQuery = `
    SELECT COUNT(*) AS total FROM issues i
    LEFT JOIN books   b ON b.id = i.book_id
    LEFT JOIN members m ON m.id = i.member_id
    ${where}
  `;

  const [dataRes, countRes] = await Promise.all([
    db.query(dataQuery, params),
    db.query(countQuery, params.slice(0, -2)),
  ]);

  const total = parseInt(countRes.rows[0].total);
  return {
    transactions: dataRes.rows,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
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
    FROM issues i LEFT JOIN returns r ON r.issue_id = i.id
  `);
  return res.rows[0];
}

module.exports = {
  issueBook,
  returnBook,
  getAllTransactions,
  getTransactionStats,
};


async function getMemberTransactions(member_id, { status = "all", page = 1, limit = 20 } = {}) {
  const conditions = ["i.member_id = $1"];
  const params = [member_id];
  let idx = 2;
  if (status !== "all") { conditions.push(`i.status = $${idx++}`); params.push(status); }
  const where = `WHERE ${conditions.join(" AND ")}`;
  const offset = (page - 1) * limit;

  const dataQuery = `
    SELECT i.id, i.book_id, i.issue_date, i.due_date, i.return_date, i.status,
      b.title AS book_title, b.author AS book_author, b.isbn AS book_isbn,
      COALESCE(r.fine_amount, 0)::NUMERIC AS fine_amount,
      CASE WHEN i.status='issued' AND CURRENT_DATE > i.due_date::DATE THEN TRUE ELSE FALSE END AS is_overdue,
      CASE WHEN i.status='issued' AND CURRENT_DATE > i.due_date::DATE THEN CURRENT_DATE - i.due_date::DATE ELSE 0 END AS overdue_days,
      CASE WHEN i.status='issued' AND CURRENT_DATE > i.due_date::DATE THEN (CURRENT_DATE - i.due_date::DATE) * 5 ELSE 0 END AS current_fine
    FROM issues i
    LEFT JOIN books b ON b.id = i.book_id
    LEFT JOIN returns r ON r.issue_id = i.id
    ${where}
    ORDER BY i.issue_date DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  params.push(limit, offset);

  const countQuery = `SELECT COUNT(*) AS total FROM issues i ${where}`;
  const [dataRes, countRes] = await Promise.all([
    db.query(dataQuery, params),
    db.query(countQuery, params.slice(0, -2)),
  ]);

  const total = parseInt(countRes.rows[0].total);
  return { transactions: dataRes.rows, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

async function getMonthlyIssueStats(year) {
  const res = await db.query(
    `SELECT EXTRACT(MONTH FROM issue_date)::INT AS month, COUNT(*)::INT AS issued
     FROM issues WHERE EXTRACT(YEAR FROM issue_date) = $1 GROUP BY month ORDER BY month`, [year]);
  const returnedRes = await db.query(
    `SELECT EXTRACT(MONTH FROM return_date)::INT AS month, COUNT(*)::INT AS returned
     FROM issues WHERE status='returned' AND EXTRACT(YEAR FROM return_date) = $1 GROUP BY month ORDER BY month`, [year]);

  const issuedMap = Object.fromEntries(res.rows.map(r => [r.month, r.issued]));
  const returnedMap = Object.fromEntries(returnedRes.rows.map(r => [r.month, r.returned]));
  const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return MONTH_NAMES.map((name, i) => ({ month: name, issued: issuedMap[i+1]||0, returned: returnedMap[i+1]||0 }));
}

module.exports = { issueBook, returnBook, getAllTransactions, getTransactionStats, getMemberTransactions, getMonthlyIssueStats };