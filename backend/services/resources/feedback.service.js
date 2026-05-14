"use strict";
const db = require("../../config/db");

/* ── CREATE ─────────────────────────────────────────────────────────── */
const saveFeedback = async ({ name, email, message, ip, userAgent }) => {
  const { rows } = await db.query(
    `INSERT INTO feedback (name, email, message, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, created_at`,
    [name, email, message, ip ?? null, userAgent ?? null],
  );
  return rows[0];
};

/* ── READ ALL ────────────────────────────────────────────────────────── */
const getAllFeedbacks = async ({ status, search, limit, offset }) => {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (status) {
    conditions.push(`status = $${idx++}`);
    values.push(status);
  }

  if (search) {
    conditions.push(
      `(name ILIKE $${idx} OR email ILIKE $${idx} OR message ILIKE $${idx})`,
    );
    values.push(`%${search}%`);
    idx++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  // Total count for pagination meta
  const countResult = await db.query(
    `SELECT COUNT(*) FROM feedback ${where}`,
    values,
  );
  const total = parseInt(countResult.rows[0].count, 10);

  // Paginated rows
  const { rows } = await db.query(
    `SELECT id, name, email, message, status, ip_address, user_agent, created_at, updated_at
     FROM feedback
     ${where}
     ORDER BY created_at DESC
     LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset],
  );

  return { rows, total };
};

/* ── DELETE ──────────────────────────────────────────────────────────── */
const deleteFeedbackById = async (id) => {
  const { rows } = await db.query(
    `DELETE FROM feedback WHERE id = $1 RETURNING id`,
    [id],
  );
  return rows[0] ?? null; // null → not found
};

/* ── UPDATE STATUS ───────────────────────────────────────────────────── */
const updateFeedbackStatus = async (id, status) => {
  const { rows } = await db.query(
    `UPDATE feedback
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING id, status, updated_at`,
    [status, id],
  );
  return rows[0] ?? null; // null → not found
};

module.exports = {
  saveFeedback,
  getAllFeedbacks,
  deleteFeedbackById,
  updateFeedbackStatus,
};
