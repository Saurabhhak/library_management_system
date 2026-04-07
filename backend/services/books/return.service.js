const returnBookService = async (issue_id) => {
  const issue = await db.query(
    "SELECT * FROM issues WHERE id=$1 AND status='issued'",
    [issue_id]
  );

  if (issue.rows.length === 0) {
    throw new Error("Invalid issue");
  }

  const book_id = issue.rows[0].book_id;
  const due_date = new Date(issue.rows[0].due_date);
  const today = new Date();

  // Fine logic
  let fine = 0;
  if (today > due_date) {
    const diff = today - due_date;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    fine = days * 5;
  }

  // Update issue
  await db.query(
    `UPDATE issues
     SET status='returned', return_date=NOW()
     WHERE id=$1`,
    [issue_id]
  );

  // Insert return history
  await db.query(
    `INSERT INTO returns (issue_id, fine_amount)
     VALUES ($1,$2)`,
    [issue_id, fine]
  );

  // Increase available copies
  await db.query(
    `UPDATE books
     SET available_copies = available_copies + 1
     WHERE id=$1`,
    [book_id]
  );

  return fine;
};