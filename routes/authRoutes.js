const passport = require("passport");
const express = require("express");
const router = express.Router();
const {
  showSignupForm,
  showLoginForm,
  handleSignup,
  handleLogin,
  Logout,
  handleGoogleCallback,
} = require("../controllers/authController");
const validateSignup = require("../middleware/signupValidator");
const loginValidator = require("../middleware/authValidator");
const { handleValidationErrors } = require("../middleware/validationHandler");

const Book = require("../models/bookModel");
const Category = require("../models/categoryModel");
const Transaction = require("../models/transactionModel");

router.get("/home", async (req, res) => {
  try {
    const categories = await Category.find().lean();
    const books = await Book.find().populate("categoryId").lean();
    const totalBooks = books.length;
    const totalCopies = books.reduce((acc, b) => acc + (Number(b.totalCopies) || 0), 0);
    const availableCopies = books.reduce((acc, b) => acc + (Number(b.copiesAvailable) || 0), 0);
    const activeLoans = await Transaction.countDocuments({ status: "Issued" });

    res.render("../views/home", {
      categories,
      books,
      stats: {
        totalBooks,
        totalCopies,
        availableCopies,
        activeLoans,
      },
    });
  } catch (error) {
    console.error("Home route error:", error);
    res.render("../views/home", {
      categories: [],
      books: [],
      stats: { totalBooks: 0, totalCopies: 0, availableCopies: 0, activeLoans: 0 },
    });
  }
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/auth/login" }),
  handleGoogleCallback
);

router.get("/auth/signup", showSignupForm); // renders signup form
router.get("/auth/login", showLoginForm); // renders login form

router.get("/auth/logout", Logout); //logout user
router.post(
  "/auth/signup",
  validateSignup,
  handleValidationErrors,
  handleSignup
); // handles signup
router.post("/auth/login", loginValidator, handleValidationErrors, handleLogin);

module.exports = router;
