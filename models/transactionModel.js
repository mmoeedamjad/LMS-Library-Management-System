const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "users", required: true}, // Reference to User model
    bookId: {type: mongoose.Schema.Types.ObjectId, ref: "books", required: true}, // Reference to Book model
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },
    status: { type: String, enum: ["Issued", "Returned"], default: "Issued" },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const Transaction = mongoose.model("transactions", transactionSchema);
module.exports = Transaction;
