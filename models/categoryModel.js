const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

const Category = mongoose.model("categories", categorySchema);
module.exports = Category;
