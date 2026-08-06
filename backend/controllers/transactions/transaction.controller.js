// ─────────────────────────────────────────────────────────────────────────────
//  transaction.controller.js   →  backend/controllers/transaction.controller.js
//
//  Validates request input, calls the service, sends JSON response.
//  No SQL here — that all lives in transaction.service.js.
// ─────────────────────────────────────────────────────────────────────────────
const transactionService = require("../../services/transactions/transaction.service");

// POST /api/transactions/issue   { book_id, member_id, due_date }
exports.issueBook = async (req, res) => {
  try {
    const { book_id, member_id, due_date } = req.body;

    if (!book_id || !member_id || !due_date)
      return res.status(400).json({ success: false, message: "book_id, member_id and due_date are required" });

    const dueDateObj = new Date(due_date);
    if (isNaN(dueDateObj) || dueDateObj <= new Date())
      return res.status(400).json({ success: false, message: "due_date must be a valid future date" });

    const result = await transactionService.issueBook(parseInt(book_id), parseInt(member_id), due_date);

    res.status(201).json({
      success: true,
      message: `"${result.book_title}" issued to ${result.member_name}`,
      data: result.issue,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// POST /api/transactions/return   { issue_id }
exports.returnBook = async (req, res) => {
  try {
    const { issue_id } = req.body;
    if (!issue_id)
      return res.status(400).json({ success: false, message: "issue_id is required" });

    const result = await transactionService.returnBook(parseInt(issue_id));

    res.status(200).json({
      success: true,
      message: `"${result.book_title}" returned by ${result.member_name}`,
      data: result,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/transactions?status=&search=&page=&limit=
exports.getAllTransactions = async (req, res) => {
  try {
    const { status = "all", search = "", page = 1, limit = 10 } = req.query;
    const result = await transactionService.getAllTransactions({
      status,
      search,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/transactions/stats
exports.getStats = async (req, res) => {
  try {
    const stats = await transactionService.getTransactionStats();
    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const service = require("../../services/transactions/transaction.service");

exports.getMyTransactions = async (req, res) => {
  try {
    const { status = "all", page = 1, limit = 20 } = req.query;
    const result = await service.getMemberTransactions(req.user.id, { status, page: Number(page), limit: Number(limit) });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("[getMyTransactions]", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch your transactions" });
  }
};

exports.getMonthlyStats = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const data = await service.getMonthlyIssueStats(year);
    res.json({ success: true, data });
  } catch (err) {
    console.error("[getMonthlyStats]", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch monthly stats" });
  }
};