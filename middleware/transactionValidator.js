const { body } = require("express-validator");

const validateTransaction = [
  body("userId").notEmpty().withMessage("User is required"),

  body("bookId").notEmpty().withMessage("Book is required"),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date (YYYY-MM-DD)"),

  body("returnDate")
    .optional({ nullable: true })
    .custom((value, { req }) => {
      if (value && req.body.issueDate && new Date(value) < new Date(req.body.issueDate)) {
        throw new Error("Return date cannot be before issue date");
      }
      return true;
    }),

  // Optional for update
  body("status")
    .optional()
    .isIn(["Issued", "Returned"])
    .withMessage("Status must be either 'Issued' or 'Returned'"),
];

module.exports = validateTransaction;
