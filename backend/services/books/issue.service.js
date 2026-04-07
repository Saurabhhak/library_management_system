const db = require("../../config/db");

const issueBookService = async (book_id, member_id, due_date) => {
  // 1. Check Member Active
  const member = await db.query(
    `SELECT * FROM members
     WHERE id=$1 AND status='active' AND is_deleted=FALSE`,
    [member_id]
  );

  if (member.rows.length === 0) {
    throw new Error("Member not active");
  }

  // 2. Check Membership Expiry
  const today = new Date();
  const endDate = member.rows[0].membership_end;

  if (endDate && new Date(endDate) < today) {
    throw new Error("Membership expired");
  }

  // 3. Check Book Issue Limit
  const count = await db.query(
    `SELECT COUNT(*) FROM issues
     WHERE member_id=$1 AND status='issued'`,
    [member_id]
  );

  if (parseInt(count.rows[0].count) >= member.rows[0].max_books_allowed) {
    throw new Error("Book limit reached");
  }

  // 4. Check Book Availability
  const book = await db.query(
    `SELECT available_copies FROM books WHERE id=$1`,
    [book_id]
  );

  if (book.rows.length === 0) {
    throw new Error("Book not found");
  }

  if (book.rows[0].available_copies <= 0) {
    throw new Error("Book not available");
  }

  // 5. Insert Issue Record
  const issue = await db.query(
    `INSERT INTO issues (book_id, member_id, due_date, status)
     VALUES ($1,$2,$3,'issued')
     RETURNING *`,
    [book_id, member_id, due_date]
  );

  // 6. Reduce Available Copies
  await db.query(
    `UPDATE books
     SET available_copies = available_copies - 1
     WHERE id=$1`,
    [book_id]
  );

  return issue.rows[0];
};

module.exports = { issueBookService };