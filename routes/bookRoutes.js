const express = require("express");
const router = express.Router();

const {
  handleGetAllBooks,
  handleGetBookById,
  addBook,
  editBook,
  handleUpdateBookById,
  handleDeleteBookById,
  handleCreateNewBook,
} = require("../controllers/bookController");
const validateBook = require("../middleware/bookValidator");
const { handleValidationErrors } = require("../middleware/validationHandler");

// GET all Books and POST new Book
router
  .route("/")
  .get(handleGetAllBooks)
  .post(validateBook, handleValidationErrors, handleCreateNewBook);

router.route("/add").get(addBook);
router
  .route("/edit/:id")
  .get(editBook)
  .post(validateBook, handleValidationErrors, handleUpdateBookById);

// GET, UPDATE, DELETE by ID
router.route("/:id").get(handleGetBookById);
router.route("/delete/:id").get(handleDeleteBookById);

module.exports = router;
