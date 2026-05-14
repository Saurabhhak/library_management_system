"use strict";
const {
  saveFeedback,
  getAllFeedbacks,
  deleteFeedbackById,
  updateFeedbackStatus,
} = require("../../services/resources/feedback.service");
const { sendMail } = require("../../services/mail/email.service");
const { feedbackTemplate } = require("../../services/mail/templates");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "onlinelibrarylms@gmail.com";
const VALID_STATUSES = ["new", "reviewed", "resolved"];

/* ══════════════════════════════════════════════════════════════════════
   VALIDATION HELPER
   ══════════════════════════════════════════════════════════════════════ */
const validateFeedback = ({ name, email, message }) => {
  const errors = {};
  const n = name?.trim();
  const e = email?.trim();
  const m = message?.trim();

  if (!n) errors.name = "Name is required";
  else if (!/^[A-Za-z\s]{3,50}$/.test(n))
    errors.name = "Only letters, 3–50 chars";

  if (!e) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))
    errors.email = "Invalid email format";

  if (!m) errors.message = "Message is required";
  else if (m.length < 10) errors.message = "Minimum 10 characters";
  else if (m.length > 500) errors.message = "Max 500 characters";

  return errors;
};

/* ══════════════════════════════════════════════════════════════════════
   POST /api/feedback
   Submit new feedback → save to DB + email admin
   ══════════════════════════════════════════════════════════════════════ */
const submitFeedback = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    const errors = validateFeedback({ name, email, message });
    if (Object.keys(errors).length) {
      return res.status(400).json({ success: false, errors });
    }

    const saved = await saveFeedback({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Non-blocking — email failure should not break the response
    sendMail({
      to: ADMIN_EMAIL,
      subject: `New Feedback from ${name.trim()}`,
      html: feedbackTemplate({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        id: saved.id,
        submittedAt: new Date().toLocaleString("en-IN"),
      }),
    }).catch((err) =>
      console.error("[Feedback] Email notify failed:", err.message),
    );

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: { id: saved.id, created_at: saved.created_at },
    });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════════════════════════════════
   GET /api/feedback?status=&search=&page=&limit=
   List all feedback with optional filters + pagination
   ══════════════════════════════════════════════════════════════════════ */
const getAllFeedback = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    // Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const offset = (page - 1) * limit;

    // Validate status query if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const { rows, total } = await getAllFeedbacks({
      status,
      search,
      limit,
      offset,
    });

    return res.status(200).json({
      success: true,
      data: rows,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════════════════════════════════
   DELETE /api/feedback/:id
   Hard delete a single feedback entry
   ══════════════════════════════════════════════════════════════════════ */
const removeFeedback = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid feedback ID" });
    }

    const deleted = await deleteFeedbackById(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Feedback #${id} deleted`,
    });
  } catch (err) {
    next(err);
  }
};

/* ══════════════════════════════════════════════════════════════════════
   PATCH /api/feedback/:id/status
   Update status: new → reviewed → resolved
   ══════════════════════════════════════════════════════════════════════ */
const changeStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid feedback ID" });
    }

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const updated = await updateFeedbackStatus(id, status);
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Status updated to "${status}"`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  removeFeedback,
  changeStatus,
};
