const { validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Store errors and old input in request object for access in controller
    req.validationErrors = errors.array();
    req.oldInput = req.body;
  }
  next();
};

module.exports = { handleValidationErrors };
