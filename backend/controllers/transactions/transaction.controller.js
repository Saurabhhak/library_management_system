"use strict";

const transactionService = require("../../services/transactions/transaction.service");

exports.issueBook = async (req, res) => {
  try {
    const { book_id, member_id, due_date } = req.body;

    console.log("[IssueBook Request Payload]:", {
      book_id,
      member_id,
      due_date,
    });

    if (!book_id || !member_id || !due_date) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing required fields: book_id, member_id, due_date.",
        });
    }

    const result = await transactionService.issueBook(
      parseInt(book_id, 10),
      parseInt(member_id, 10),
      due_date,
    );

    return res.status(201).json({
      success: true,
      message: "Book issued successfully.",
      data: result,
    });
  } catch (err) {
    console.error("[IssueBook Controller Error]:", err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { issue_id } = req.body;
    if (!issue_id)
      return res
        .status(400)
        .json({ success: false, message: "Issue ID is required." });

    const result = await transactionService.returnBook(parseInt(issue_id, 10));
    return res.status(200).json({
      success: true,
      message: `"${result.book_title}" returned by ${result.member_name}`,
      data: result,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const { status = "all", search = "", page = 1, limit = 10 } = req.query;
    const result = await transactionService.getAllTransactions({
      status,
      search,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error fetching transactions." });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await transactionService.getTransactionStats();
    return res.status(200).json({ success: true, data: stats });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Server error fetching stats." });
  }
};

exports.getMonthlyStats = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const data = await transactionService.getMonthlyIssueStats(year);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch monthly stats." });
  }
};

/* ════════════════════════════════════════════════════════════════
   MEMBER PERSONAL CONTROLLERS (Dashboard & History)
════════════════════════════════════════════════════════════════ */
exports.getMyTransactions = async (req, res) => {
  try {
    const result = await transactionService.getMemberTransactions(req.user.id);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error("[getMyTransactions Error]:", err.message);
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch your borrowing history.",
      });
  }
};

exports.getMyStats = async (req, res) => {
  try {
    const data = await transactionService.getMyDashboardStats(req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("[getMyStats Error]:", err.message);
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch your dashboard stats.",
      });
  }
};
