const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {type: String},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isActive: { type: String, enum: ["Y", "N"], default: "Y" },
  },
  {
    timestamps: false, // You are using manual createdAt
    versionKey: false,
  }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
