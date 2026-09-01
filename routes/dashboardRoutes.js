const express = require("express");
const router = express.Router();
const User = require("../models/usersModel");
const Book = require("../models/bookModel");
const Transaction = require("../models/transactionModel");
const checkAdmin = require("../middleware/roleCheck");

router.get("/dashboard", checkAdmin, async (req, res) => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalAdmins = await User.countDocuments({ role: "admin" });
  const totalBooks = await Book.countDocuments();
  const issuedBooks = await Transaction.countDocuments({ status: "Issued" });
  const returnedBooks = await Transaction.countDocuments({
    status: "Returned",
  });
  res.render("../views/dashboard", {
    totalUsers,
    totalAdmins,
    totalBooks,
    issuedBooks,
    returnedBooks,
    page: "dashboard",
    pageTitle: "Dashboard",
  });
});
router.get("/user-dashboard", async (req, res) => {
  const userId = req.user.userId; // From decoded token via middleware
  const user = await User.findById(userId);

  // Get user's transactions
  const userTransactions = await Transaction.find({ userId }).populate("bookId");

  // Separate current and history
  const borrowedBooks = userTransactions
    .filter((tx) => tx.status === "Issued")
    .map((tx) => ({
      title: tx.bookId.title,
      author: tx.bookId.authorName,
      borrowedDate: tx.issueDate.toLocaleDateString(),
      dueDate: tx.dueDate.toLocaleDateString(),
      status: tx.status,
    }));

  const history = userTransactions
    .filter((tx) => tx.status === "Returned")
    .map((tx) => ({
      title: tx.bookId.title,
      author: tx.bookId.authorName,
      borrowedDate: tx.issueDate.toLocaleDateString(),
      returnedDate: tx.returnDate.toLocaleDateString(),
      status: tx.status,
    }));

  // Get all available books
  const issuedBookIds = userTransactions
    .filter((tx) => tx.status === "Issued")
    .map((tx) => tx.bookId._id.toString());

  const availableBooks = await Book.find({
    quantity: { $gt: 0 },
  });

  res.render("../views/user-dashboard", {
    user,
    borrowedBooks,
    history,
    availableBooks,
  });
});

module.exports = router;
