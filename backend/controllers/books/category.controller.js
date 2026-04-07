const db = require("../../config/db");
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    /* -------- Duplicate check  --------*/
    const existing = await db.query(
      "SELECT * FROM categories WHERE LOWER(name) = LOWER($1)",
      [name],
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }
    /* --------------- After Verifing Insert Data ---------------*/
    const result = await db.query(
      `INSERT INTO categories (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name, description],
    );
    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ------------------ Get Categories Data ---------------*/
const getCategories = async (req, res) => {
  const result = await db.query("SELECT * FROM categories ORDER BY id DESC");

  res.json({
    success: true,
    data: result.rows,
  });
};
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  await db.query("UPDATE categories SET name=$1, description=$2 WHERE id=$3", [
    name,
    description,
    id,
  ]);
  res.json({ success: true, message: "Updated" });
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if books exist under this category
    const check = await db.query("SELECT * FROM books WHERE category_id = $1", [
      id,
    ]);
    if (check.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category. Books exist under this category.",
      });
    }
    // Delete category if no books found
    await db.query("DELETE FROM categories WHERE id = $1", [id]);
    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
