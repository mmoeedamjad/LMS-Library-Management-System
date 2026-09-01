const Transaction = require("../models/transactionModel");
const Book = require("../models/bookModel");
const User = require("../models/usersModel");

// GET all transactions
async function handleGetAllTransactions(req, res) {
  try {
    const transactions = await Transaction.find()
      .populate("userId")
      .populate("bookId");
    res.render("../views/transactions/all-transactions", {
      transactions,
      page: "transactions",
      pageTitle: "All Transactions",
    });
    // return res.json(transactions);
  } catch (err) {
    return res.status(500).render("error", {
      pageTitle: "Error",
      errorTitle: "Database Error",
      errorMessage: "Failed to fetch transactions.",
    });
  }
}

// GET single transaction by ID
async function handleGetTransactionById(req, res) {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("userId")
      .populate("bookId");
    if (!transaction) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Transaction Not Found",
        errorMessage: "No transaction found with this ID.",
      });
    }
    res.render("../views/transactions/view-transaction", {
      transaction,
      page: "transactions",
      pageTitle: "View Transaction",
    });
  } catch (err) {
    return res.status(400).render("error", {
      pageTitle: "Error",
      errorTitle: "Invalid Transaction ID",
      errorMessage: "The provided transaction ID is invalid.",
    });
  }
}

// open inserting form
async function addTransaction(req, res) {
  try {
    const users = await User.find({ role: "user", isActive: "Y" });
    const books = await Book.find({ copiesAvailable: { $gt: 0 } });
    res.render("../views/transactions/add-transaction", {
      users,
      books,
      page: "transactions",
      pageTitle: "Add Transaction",
      oldInput: {},
    });
  } catch (error) {
    res.status(500).render("error", {
      pageTitle: "Error",
      errorTitle: "Form Load Failed",
      errorMessage: "Unable to load users or books for the transaction form.",
    });
  }
}
// open editing form
async function editTransaction(req, res) {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Transaction Not Found",
        errorMessage: "Cannot edit. Transaction does not exist.",
      });
    }
    const users = await User.find({ role: "user", isActive: "Y" });
    const books = await Book.find({ copiesAvailable: { $gt: 0 } });

    res.render("../views/transactions/edit-transaction", {
      transaction,
      users,
      books,
      page: "transactions",
      pageTitle: "Edit Transaction",
      oldInput: {},
    });
  } catch (err) {
    return res.status(400).render("error", {
      pageTitle: "Error",
      errorTitle: "Invalid ID",
      errorMessage: "Invalid transaction ID provided for editing.",
    });
  }
}

// CREATE new transaction (issue a book)
async function handleCreateTransaction(req, res) {
  if (req.validationErrors) {
    const users = await User.find({ role: "user", isActive: "Y" });
    const books = await Book.find({ copiesAvailable: { $gt: 0 } });
    const transaction = await Transaction.find();
    return res.status(400).render("../views/transactions/add-transaction", {
      users,
      books,
      transaction,
      errors: req.validationErrors,
      oldInput: req.oldInput,
      page: "transactions",
      pageTitle: "Add Transaction",
    });
  }
  try {
    const { userId, bookId, dueDate } = req.body;

    if (!userId || !bookId || !dueDate) {
      return res.status(400).render("error", {
        pageTitle: "Validation Error",
        errorTitle: "Missing Fields",
        errorMessage: "All fields are required to issue a book.",
      });
    }

    // Check if book exists and has copies available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).render("error", {
        pageTitle: "Error",
        errorTitle: "Book Not Found",
        errorMessage: "Cannot issue. Selected book not found.",
      });
    }
    // validate dueDate > current date
    if (new Date(dueDate) <= new Date()) {
      return res.status(400).render("error", {
        pageTitle: "Invalid Due Date",
        errorTitle: "Invalid Due Date",
        errorMessage: "Due Date cannot be the same as Issue Date.",
      });
    }

    if (book.copiesAvailable <= 0) {
      return res.status(400).render("error", {
        pageTitle: "Unavailable",
        errorTitle: "No Copies Left",
        errorMessage: "Cannot issue. No available copies of this book.",
      });
    }

    // Decrement available copies
    book.copiesAvailable -= 1;
    await book.save();

    const newTransaction = await Transaction.create({
      userId,
      bookId,
      issueDate: new Date(),
      dueDate,
      returnDate: null,
      status: "Issued",
    });
    res.redirect("/api/transactions");
  } catch (err) {
    console.error("Failed to insert transaction:", err);
    return res.status(500).render("error", {
      pageTitle: "Error",
      errorTitle: "Insert Failed",
      errorMessage: "An error occurred while creating the transaction.",
    });
  }
}

// UPDATE transaction (mark as returned)
async function handleReturnBook(req, res) {
  if (req.validationErrors) {
    const users = await User.find({ role: "user", isActive: "Y" });
    const books = await Book.find({ copiesAvailable: { $gt: 0 } });
    const transaction = await Transaction.findById(req.params.id);
    return res.status(400).render("../views/transactions/edit-transaction", {
      users,
      books,
      transaction,
      errors: req.validationErrors,
      oldInput: req.oldInput,
      page: "transactions",
      pageTitle: "Edit Transaction",
    });
  }
  try {
    const { userId, bookId, dueDate, status } = req.body;

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Transaction Not Found",
        errorMessage: "Cannot update. Transaction not found.",
      });
    }

    const oldbook = await Book.findById(transaction.bookId);
    const newbook = await Book.findById(bookId);
    if (!oldbook || !newbook) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Book Not Found",
        errorMessage: "Associated old or new book not found in system.",
      });
    }
    const bookChanged = transaction.bookId.toString() !== bookId;
    //old bookId not equal to new bookId
    if (bookChanged) {
      if (newbook.copiesAvailable <= 0) {
        return res.status(400).render("error", {
          pageTitle: "Unavailable",
          errorTitle: "No Copies Left",
          errorMessage: "Cannot Update Book. No copies available for new book.",
        });
      }

      oldbook.copiesAvailable += 1;
      await oldbook.save();

      newbook.copiesAvailable -= 1;
      await newbook.save();
    }

    const book = newbook;
    // If status is changed from Issued to Returned and wasn't returned before
    if (status === "Returned" && transaction.status !== "Returned") {
      transaction.returnDate = new Date();
      book.copiesAvailable += 1;
      await book.save();
    }
    // If status is changed from Returned to Issued and it was previously returned
    if (status === "Issued" && transaction.status === "Returned") {
      if (book.copiesAvailable <= 0) {
        return res.status(400).render("error", {
          pageTitle: "Unavailable",
          errorTitle: "No Copies Left",
          errorMessage: "Cannot re-issue. No copies available.",
        });
      }
      transaction.returnDate = null;
      book.copiesAvailable -= 1;
      await book.save();
    }
    transaction.userId = userId;
    transaction.bookId = bookId;
    transaction.dueDate = dueDate;
    transaction.status = status;

    await transaction.save();
    res.redirect("/api/transactions");
  } catch (err) {
    console.error("Error updating transaction:", err.message);
    return res.status(500).render("error", {
      pageTitle: "Update Error",
      errorTitle: "Failed to Update Transaction",
      errorMessage: "An internal error occurred during transaction update.",
    });
  }
}

// DELETE transaction (optional)
async function handleDeleteTransaction(req, res) {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Transaction Not Found",
        errorMessage: "Cannot delete. Transaction does not exist.",
      });
    }

    const book = await Book.findById(transaction.bookId);
    if (!book) {
      return res.status(404).render("error", {
        pageTitle: "Error",
        errorTitle: "Book Not Found",
        errorMessage: "Cannot restore book. Book data missing.",
      });
    }

    if (!transaction.returnDate) {
      book.copiesAvailable += 1;
      await book.save();
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.redirect("/api/transactions");
  } catch (err) {
    console.error("Error deleting transaction:", err);
    return res.status(500).render("error", {
      pageTitle: "Deletion Error",
      errorTitle: "Failed to Delete Transaction",
      errorMessage: "An error occurred while deleting the transaction.",
    });
  }
}

module.exports = {
  handleGetAllTransactions,
  handleGetTransactionById,
  addTransaction,
  editTransaction,
  handleCreateTransaction,
  handleReturnBook,
  handleDeleteTransaction,
};
