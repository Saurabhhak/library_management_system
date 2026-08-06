"use strict";

const pool = require("../../config/db");

/**
 * safeCount — runs a COUNT query and returns 0 instead of crashing
 * if the table/column doesn't exist yet (e.g. books/issues not built out).
 * This lets the dashboard render partial data instead of a 500 error
 * while you're still building out other modules.
 */
const safeCount = async (query, params = []) => {
  try {
    const { rows } = await pool.query(query, params);
    return Number(rows[0]?.count ?? 0);
  } catch (err) {
    console.warn(
      "[Dashboard] query skipped (table may not exist yet):",
      err.message,
    );
    return 0;
  }
};

const safeRows = async (query, params = []) => {
  try {
    const { rows } = await pool.query(query, params);
    return rows;
  } catch (err) {
    console.warn(
      "[Dashboard] query skipped (table may not exist yet):",
      err.message,
    );
    return [];
  }
};

/* ══════════════════════════════════════════════════════════════
   GET /api/admin/dashboard/stats   (admin | superadmin)
   Returns real counts. Book-issue/fine numbers return 0 until
   those tables exist — replace the TODO queries once your
   books/issues schema is finalized.
══════════════════════════════════════════════════════════════ */
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalMembers,
      activeMembers,
      totalAdmins,
      totalBooks,
      totalCategories,
      // TODO: once your `issues` table exists (book_id, member_id, issued_at,
      // due_at, returned_at), swap these two for real queries:
      totalBooksIssued,
      overdueCount,
    ] = await Promise.all([
      safeCount("SELECT COUNT(*) FROM members WHERE is_deleted = false"),
      safeCount(
        "SELECT COUNT(*) FROM members WHERE is_deleted = false AND status = 'active'",
      ),
      safeCount("SELECT COUNT(*) FROM admin WHERE is_deleted = false"),
      safeCount("SELECT COUNT(*) FROM books"),
      safeCount("SELECT COUNT(*) FROM categories"),
      safeCount("SELECT COUNT(*) FROM issues WHERE returned_at IS NULL"),
      safeCount(
        "SELECT COUNT(*) FROM issues WHERE returned_at IS NULL AND due_at < NOW()",
      ),
    ]);

    const booksByCategory = await safeRows(`
      SELECT c.name AS category, COUNT(b.id) AS count
      FROM categories c
      LEFT JOIN books b ON b.category_id = c.id
      GROUP BY c.name
      ORDER BY count DESC
      LIMIT 6
    `);

    const recentMembers = await safeRows(`
      SELECT id, first_name, last_name, email, status, membership_start
      FROM members
      WHERE is_deleted = false
      ORDER BY id DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        kpis: {
          totalMembers,
          activeMembers,
          totalAdmins,
          totalBooks,
          totalBooksIssued,
          overdueCount,
        },
        booksByCategory,
        recentMembers,
      },
    });
  } catch (err) {
    console.error("[getDashboardStats]", err.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to load dashboard stats" });
  }
};

module.exports = { getDashboardStats };
