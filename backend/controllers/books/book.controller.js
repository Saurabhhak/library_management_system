const db = require("../../config/db");
// ---------------- CREATE BOOK ----------------
const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category_id, total_copies, shelf_location } =
      req.body;

    // -------- VALIDATION --------
    if (!title || !author || !isbn || !category_id || !total_copies) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }
    // ----- CHECK TOTAL COPIES GREATER THEN 0 -----
    if (total_copies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Total copies must be greater than 0",
      });
    }

    // -------- CHECK DUPLICATE ISBN --------
    const existingBook = await db.query("SELECT * FROM books WHERE isbn=$1", [
      isbn,
    ]);

    if (existingBook.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "ISBN already exists",
      });
    }

    // -------- CHECK CATEGORY EXISTS --------
    const category = await db.query("SELECT * FROM categories WHERE id=$1", [
      category_id,
    ]);

    if (category.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }
    // Because when a book is first added to the library, no copies are issued yet, so all copies are available. Available copies will decrease when books are issued and increase when books are returned.
    const available_copies = total_copies;
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

// ---------------- GET BOOKS ----------------
const getBooks = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- UPDATE BOOK ----------------
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category_id, total_copies } = req.body;

    if (!title || !author || !category_id || !total_copies) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (total_copies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Copies must be greater than 0",
      });
    }

    await db.query(
      `UPDATE books 
   SET title=$1,
       author=$2,
       category_id=$3,
       total_copies=$4,
       available_copies = LEAST(available_copies, $4),
       updated_at=NOW()
   WHERE id=$5`,
      [title, author, category_id, total_copies, id],
    );
    res.json({ success: true, message: "Book Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- DELETE BOOK ----------------
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `UPDATE books 
       SET is_deleted = TRUE, status='archived'
       WHERE id=$1`,
      [id],
    );

    res.json({ success: true, message: "Book Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { deleteBook, updateBook, getBooks, createBook };
