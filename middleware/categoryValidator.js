const { body } = require("express-validator");

const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters long")
    .isAlpha()
    .withMessage("Only alphabet are allowed in name")
    .escape(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Add some description for category"),
];

module.exports = validateCategory;
