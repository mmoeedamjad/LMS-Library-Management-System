const { body } = require("express-validator");

const validateUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .optional({ checkFalsy: true }) // required only when provided
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "user"])
    .withMessage("Invalid role value"),

  body("isActive")
    .notEmpty()
    .withMessage("Active status is required")
    .isIn(["Y", "N"])
    .withMessage("isActive must be either 'Y' or 'N'"),
];

module.exports = validateUser;
