const { issueBookService } = require("../../services/books/issue.service");

const issueBook = async (req, res) => {
  try {
    const { book_id, member_id, due_date } = req.body;

    if (!book_id || !member_id || !due_date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const result = await issueBookService(book_id, member_id, due_date);
    
    res.status(201).json({
      success: true,
      message: "Book Issued Successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to issue book",
    });
  }
};

module.exports = { issueBook };
