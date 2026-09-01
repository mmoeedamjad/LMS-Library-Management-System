const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    copiesAvailable: {type: Number, required: true },
    totalCopies: { type: Number, required: true },
    quantity: { type: Number },
    shelfLocation: { type: String },
    authorName: { type: String },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const Book = mongoose.model("books", bookSchema);
module.exports = Book;
