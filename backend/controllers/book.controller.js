const db = require("../config/db");
const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category_id, total_copies, shelf_location } =
      req.body;
    // Auto set available copies
    const available_copies = total_copies;
    if (!title || !author || !category_id || !total_copies) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }
    const result = await db.query(
      `INSERT INTO books
       (title, author, isbn, category_id, total_copies, available_copies, shelf_location)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        title,
        author,
        isbn,
        category_id,
        total_copies,
        available_copies,
        shelf_location,
      ],
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBooks = async (req, res) => {
  const result = await db.query(`
    SELECT b.*, c.name AS category_name
    FROM books b
    JOIN categories c ON b.category_id = c.id
    WHERE b.is_deleted = FALSE
    ORDER BY b.id DESC
  `);

  res.json({
    success: true,
    data: result.rows,
  });
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, category_id, total_copies } = req.body;

  await db.query(
    `UPDATE books 
     SET title=$1, author=$2, category_id=$3, total_copies=$4, updated_at=NOW()
     WHERE id=$5`,
    [title, author, category_id, total_copies, id],
  );

  res.json({ success: true, message: "Book Updated" });
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  await db.query(
    `UPDATE books 
     SET is_deleted = TRUE, status='archived'
     WHERE id=$1`,
    [id],
  );

  res.json({ success: true, message: "Book Deleted" });
};
module.exports = { deleteBook, updateBook, getBooks, createBook };
