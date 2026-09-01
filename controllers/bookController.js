const Book = require("../models/bookModel");
const Categories = require("../models/categoryModel");
const Transaction = require("../models/transactionModel");

// GET all Books
async function handleGetAllBooks(req, res) {
  try {
    const books = await Book.find().populate("categoryId");
    res.render("../views/books/all-books", {
      books,
      page: "books",
      pageTitle: "All Books",
    });
    // return res.json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    return res.status(500).render("error", {
      pageTitle: "Error 500",
      errorTitle: "Server Error",
      errorMessage: "Failed to fetch books. Please try again later.",
    });
  }
}

// GET Book by ID
async function handleGetBookById(req, res) {
  try {
    const book = await Book.findById(req.params.id).populate("categoryId");
    if (!book) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Book Not Found",
        errorMessage: "The requested book does not exist.",
      });
    }
    res.render("../views/books/view-book", {
      book,
      page: "books",
      pageTitle: "View Book",
    });
    // return res.json(book);
  } catch (err) {
    return res.status(400).render("error", {
      pageTitle: "Error 400",
      errorTitle: "Invalid Book ID",
      errorMessage: "Provided Book ID is invalid.",
    });
  }
}

// open inserting form
async function addBook(req, res) {
  try {
    const categories = await Categories.find();
    res.render("../views/books/add-book", {
      categories,
      page: "books",
      pageTitle: "Add Book",
      oldInput: {},
    });
  } catch (error) {
    res.status(500).render("error", {
      pageTitle: "Error 500",
      errorTitle: "Server Error",
      errorMessage: "Failed to load category list. Please try again.",
    });
  }
}
// open editing form
async function editBook(req, res) {
  try {
    const categories = await Categories.find();
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Book Not Found",
        errorMessage: "The book you are trying to edit does not exist.",
      });
    }

    res.render("../views/books/edit-book", {
      book,
      categories,
      page: "books",
      pageTitle: "Edit Book",
      oldInput: {},
    });
  } catch (err) {
    return res.status(400).render("error", {
      pageTitle: "Error 400",
      errorTitle: "Invalid Book ID",
      errorMessage: "Provided Book ID is invalid.",
    });
  }
}

// CREATE new Book
async function handleCreateNewBook(req, res) {
  if (req.validationErrors) {
    const categories = await Categories.find();
    return res.status(400).render("../views/books/add-book", {
      categories,
      errors: req.validationErrors,
      oldInput: req.oldInput,
      page: "books",
      pageTitle: "Add Book",
    });
  }
  try {
    const {
      title,
      isbn,
      categoryId,
      copiesAvailable,
      totalCopies,
      shelfLocation,
      authorName,
    } = req.body;

    if (
      !title ||
      !isbn ||
      !categoryId ||
      !copiesAvailable ||
      !totalCopies ||
      !shelfLocation ||
      !authorName
    ) {
      return res.status(400).render("error", {
        pageTitle: "Error 400",
        errorTitle: "Missing Fields",
        errorMessage: "All fields are required to add a new book.",
      });
    }
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(409).render("error", {
        pageTitle: "Error 409",
        errorTitle: "Duplicate ISBN",
        errorMessage: "Book with this ISBN already exists.",
      });
    }
    const newBook = await Book.create({
      title,
      isbn,
      categoryId,
      copiesAvailable,
      totalCopies,
      shelfLocation,
      authorName,
    });
    res.redirect("/api/books");
  } catch (err) {
    console.error("Failed to insert book:", err);
    return res.status(500).render("error", {
      pageTitle: "Error 500",
      errorTitle: "Database Error",
      errorMessage: "Failed to create book. Try again later.",
    });
  }
}

// UPDATE Book by ID
async function handleUpdateBookById(req, res) {
  if (req.validationErrors) {
    const book = await Book.findById(req.params.id);
    const categories = await Categories.find();
    if (!book) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Book Not Found",
        errorMessage: "The book you are trying to update does not exist.",
      });
    }
    return res.status(400).render("../views/books/edit-book", {
      book,
      categories,
      errors: req.validationErrors,
      oldInput: req.oldInput,
      page: "books",
      pageTitle: "Edit Book",
    });
  }
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        authorName: req.body.authorName,
        isbn: req.body.isbn,
        categoryId: req.body.categoryId,
        totalCopies: req.body.totalCopies,
        copiesAvailable: req.body.copiesAvailable,
        shelfLocation: req.body.shelfLocation,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedBook) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Book Not Found",
        errorMessage: "Unable to update. Book not found.",
      });
    }
    res.redirect("/api/books");
  } catch (err) {
    console.error("Error updating book:", err.message);
    return res.status(400).render("error", {
      pageTitle: "Error 400",
      errorTitle: "Update Failed",
      errorMessage:
        "Failed to update book. Please check the data and try again.",
    });
  }
}

// DELETE Book by ID
async function handleDeleteBookById(req, res) {
  try {
    const txCount = await Transaction.countDocuments({ bookId: req.params.id });
    if (txCount > 0) {
      return res.status(400).render("error", {
        pageTitle: "Error 400",
        errorTitle: "Cannot Delete Book",
        errorMessage:
          "This book cannot be deleted as it has active issue transactions.",
      });
    }
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Book Not Found",
        errorMessage: "The book you're trying to delete does not exist.",
      });
    }
    res.redirect("/api/books");
  } catch (err) {
    console.error("Error deleting book:", err);
    return res.status(500).render("error", {
      pageTitle: "Error 500",
      errorTitle: "Delete Failed",
      errorMessage: "Something went wrong while trying to delete the book.",
    });
  }
}

module.exports = {
  handleGetAllBooks,
  handleGetBookById,
  addBook,
  editBook,
  handleCreateNewBook,
  handleUpdateBookById,
  handleDeleteBookById,
};
