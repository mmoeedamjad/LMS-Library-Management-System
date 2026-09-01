const express = require("express");
const router = express.Router();
const {
  getAllCategory,
  getCategoryById,
  addCategory,
  editCategory,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} = require("../controllers/categoryController");
const validateCategory = require("../middleware/categoryValidator");
const { handleValidationErrors } = require("../middleware/validationHandler");

// GET all Books and POST new Book
router
  .route("/")
  .get(getAllCategory)
  .post(validateCategory, handleValidationErrors, createCategory);

// OPEN FORMS FOR INSERT AND UPDATE
router.route("/add").get(addCategory);
router
  .route("/edit/:id")
  .get(editCategory)
  .post(validateCategory, handleValidationErrors, updateCategoryById);

// GET, DELETE by ID
router.route("/:id").get(getCategoryById);
router.route("/delete/:id").get(deleteCategoryById);

module.exports = router;
