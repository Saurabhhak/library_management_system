const { returnBookService } = require("../../services/books/return.service");

const returnBook = async (req, res) => {
  try {
    const { issue_id } = req.body;

    await returnBookService(issue_id);

    res.json({
      success: true,
      message: "Book Returned",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { returnBook };