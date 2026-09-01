const { body } = require("express-validator");

const validateBook = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Book title is required")
    .isLength({ min: 2 })
    .withMessage("Book title must be at least 2 characters long"),

  body("authorName")
    .trim()
    .notEmpty()
    .withMessage("Author name is required")
    .isLength({ min: 2 })
    .withMessage("Author name must be at least 2 characters long"),

  body("isbn")
    .trim()
    .notEmpty()
    .withMessage("ISBN is required")
    .isLength({ min: 13, max: 17 })
    .withMessage("ISBN must be between 13 to 17 characters"),

  body("categoryId").notEmpty().withMessage("Category must be selected"),

  body("totalCopies")
    .notEmpty()
    .withMessage("Total copies is required")
    .isInt({ min: 1 })
    .withMessage("Total copies must be at least 1"),

  body("copiesAvailable")
    .notEmpty()
    .withMessage("Available copies is required")
    .isInt({ min: 0 })
    .withMessage("Available copies must be 0 or more")
    .custom((value, { req }) => {
      if (parseInt(value) > parseInt(req.body.totalCopies)) {
        throw new Error("Available copies cannot exceed total copies");
      }
      return true;
    }),
    
  body("shelfLocation")
    .trim()
    .notEmpty()
    .withMessage("Shelf location is required")
    .isLength({ min: 1 })
    .withMessage("Shelf location must not be empty"),
];

module.exports = validateBook;
