const express = require("express");
const router = express.Router();

const {
  handleGetAllTransactions,
  handleGetTransactionById,
  addTransaction,
  editTransaction,
  handleCreateTransaction,
  handleReturnBook,
  handleDeleteTransaction,
} = require("../controllers/transactController");
const validateTransaction = require("../middleware/transactionValidator");
const { handleValidationErrors } = require("../middleware/validationHandler");

// GET all transactions, POST new transaction (issue book)
router
  .route("/")
  .get(handleGetAllTransactions)
  .post(validateTransaction, handleValidationErrors, handleCreateTransaction);

router.route("/add").get(addTransaction);
router
  .route("/edit/:id")
  .get(editTransaction)
  .post(validateTransaction, handleValidationErrors, handleReturnBook);

// GET single transaction, DELETE transaction
router.route("/:id").get(handleGetTransactionById);
router.route("/delete/:id").get(handleDeleteTransaction);

module.exports = router;
