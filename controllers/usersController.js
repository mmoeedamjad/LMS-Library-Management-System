const User = require("../models/usersModel");
const Book = require("../models/bookModel");
const Transaction = require("../models/transactionModel");
const bcrypt = require("bcrypt");
// GET all users
async function getAllUsers(req, res) {
  try {
    const users = await User.find({ role: "user" });
    res.render("../views/users/all-users", {
      userList: users,
      page: "user",
      role: "user",
      pageTitle: "All Users",
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).render("error", {
      pageTitle: "Server Error",
      errorTitle: "Fetch Error",
      errorMessage: "Failed to fetch users.",
    });
  }
}
async function getAllAdmins(req, res) {
  try {
    const admins = await User.find({
      role: "admin",
      _id: { $ne: req.user.userId },
    });
    res.render("../views/users/all-users", {
      userList: admins,
      page: "admin",
      role: "admin",
      pageTitle: "All Admins",
    });
  } catch (err) {
    console.error("Error fetching admins:", err);
    return res.status(500).render("error", {
      pageTitle: "Server Error",
      errorTitle: "Fetch Error",
      errorMessage: "Failed to fetch admins.",
    });
  }
}

// GET user by ID
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).render("error", {
        pageTitle: "User Not Found",
        errorTitle: "404 - User Not Found",
        errorMessage: "The user you are trying to view does not exist.",
      });
    }
    res.render("../views/users/view-user", {
      user,
      role: user.role,
      page: user.role,
      pageTitle: user.role === "admin" ? "View Admin" : "View User",
    });
  } catch (err) {
    return res.status(400).render("error", {
      pageTitle: "Invalid ID",
      errorTitle: "Bad Request",
      errorMessage: "Invalid User ID format.",
    });
  }
}
//view user
async function viewUserInfo(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).render("error", {
        pageTitle: "User Not Found",
        errorTitle: "404 - User Not Found",
        errorMessage: "The user you are trying to view does not exist.",
      });
    }
    res.render("../views/users/personal-info", {
      user,
      page: "personal",
      pageTitle: "View Personal Info",
    });
  } catch (err) {
    return res.status(400).render("error", {
      pageTitle: "Invalid ID",
      errorTitle: "Bad Request",
      errorMessage: "Invalid User ID format.",
    });
  }
}
// open inserting form
async function addUser(req, res) {
  const role = req.originalUrl.includes("/admin") ? "admin" : "user";
  res.render("../views/users/add-user", {
    page: "user",
    pageTitle: "Add User",
    oldInput: {},
    role,
  });
}
// open editing form
async function editUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).render("error", {
        pageTitle: "User Not Found",
        errorTitle: "404 - User Not Found",
        errorMessage: "The user you are trying to edit does not exist.",
      });
    }

    res.render("../views/users/edit-user", {
      user,
      page: "user",
      pageTitle: "Edit User",
      oldInput: {},
    });
  } catch (err) {
    return res.status(400).render("error", {
      pageTitle: "Invalid ID",
      errorTitle: "Bad Request",
      errorMessage: "Invalid User ID format.",
    });
  }
}
//open change pw form
async function OpenUpdatePW(req, res) {
  try {
    const user = await User.findById(req.params.id);
    // const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).render("error", {
        pageTitle: "User Not Found",
        errorTitle: "404 - User Not Found",
        errorMessage: "The user you are trying to edit does not exist.",
      });
    }
    if (user.role === "admin") {
      res.render("../views/users/edit-password", {
        user,
        page: "personal",
        pageTitle: "Change Password",
        errors: [],
      });
    } else {
      res.render("../views/users/edit-user-password", {
        user,
        errors: [],
      });
    }
  } catch (err) {
    return res.status(400).render("error", {
      pageTitle: "Invalid ID",
      errorTitle: "Bad Request",
      errorMessage: "Invalid User ID format to change password.",
    });
  }
}
async function updatePassword(req, res) {
  const {
    "curr-password": currentPassword,
    "new-password": newPassword,
    "conf-password": confirmPassword,
  } = req.body;
  try {
    const user = await User.findById(req.params.id);
    // const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).render("error", {
        pageTitle: "User Not Found",
        errorTitle: "User Not Found",
        errorMessage: "No user found with the provided ID.",
      });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      if (user.role === "admin") {
        return res.status(400).render("../views/users/edit-password", {
          user,
          page: "personal",
          pageTitle: "Update Password",
          errors: [{ msg: "Current password is incorrect." }],
        });
      } else {
        return res.render("../views/users/edit-user-password", {
          user,
          errors: [{ msg: "Current password is incorrect." }],
        });
      }
    }
    if (newPassword !== confirmPassword) {
      if (user.role === "admin") {
        return res.status(400).render("../views/users/edit-password", {
          user,
          page: "personal",
          pageTitle: "Update Password",
          errors: [{ msg: "New password and confirm password do not match." }],
        });
      } else {
        return res.render("../views/users/edit-user-password", {
          user,
          errors: [{ msg: "New password and confirm password do not match." }],
        });
      }
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    if (user.role === "admin") {
      return res.render("../views/users/personal-info", {
        user,
        success: "Password updated successfully.",
        page: "personal",
        pageTitle: "View Personal Info",
      });
    } else {
      // Get user's transactions
      const userTransactions = await Transaction.find({
        userId: req.params.id,
      }).populate("bookId");

      // Separate current and history
      const borrowedBooks = userTransactions
        .filter((tx) => tx.status === "Issued")
        .map((tx) => ({
          title: tx.bookId.title,
          author: tx.bookId.authorName,
          borrowedDate: tx.issueDate.toLocaleDateString(),
          dueDate: tx.dueDate.toLocaleDateString(),
          status: tx.status,
        }));

      const history = userTransactions
        .filter((tx) => tx.status === "Returned")
        .map((tx) => ({
          title: tx.bookId.title,
          author: tx.bookId.authorName,
          borrowedDate: tx.issueDate.toLocaleDateString(),
          returnedDate: tx.returnDate.toLocaleDateString(),
          status: tx.status,
        }));

      // Get all available books
      const availableBooks = await Book.find({
        quantity: { $gt: 0 },
      });

      return res.render("../views/user-dashboard", {
        user,
        borrowedBooks,
        history,
        availableBooks,
        success: "Password updated successfully.",
      });
    }
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).render("error", {
      pageTitle: "Server Error",
      errorTitle: "Update Failed",
      errorMessage: "Something went wrong while updating password.",
    });
  }
}
// CREATE new user
async function handleCreateNewUser(req, res) {
  if (req.validationErrors) {
    const user = await User.find();
    return res.status(400).render("../views/users/add-user", {
      user,
      errors: req.validationErrors,
      oldInput: req.oldInput,
      page: "user",
      pageTitle: "Add User",
      role: req.body.role,
    });
  }
  try {
    const { name, email, password, role, isActive } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).render("error", {
        pageTitle: "Validation Error",
        errorTitle: "Missing Fields",
        errorMessage: "All required fields must be provided.",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).render("error", {
        pageTitle: "Duplicate User",
        errorTitle: "Conflict",
        errorMessage: "A user with this email already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      role,
      isActive,
    });
    if (role === "admin") {
      res.redirect("/api/users/admin");
    } else {
      res.redirect("/api/users/user");
    }
  } catch (err) {
    console.error("Failed to insert user:", err);
    return res.status(500).render("error", {
      pageTitle: "Insert Error",
      errorTitle: "Failed to Create",
      errorMessage: "An error occurred while creating the user.",
    });
  }
}
// UPDATE user
async function updateUserById(req, res) {
  if (req.validationErrors) {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).render("error", {
        pageTitle: "User Not Found",
        errorTitle: "404 - User Not Found",
        errorMessage: "Unable to update. User not found.",
      });
    }
    return res.status(400).render("../views/users/edit-user", {
      user,
      errors: req.validationErrors,
      oldInput: req.oldInput,
      page: "user",
      pageTitle: "Edit User",
    });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        isActive: req.body.isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (req.body.password && req.body.password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { password: hashedPassword },
        { new: true, runValidator: true }
      );
    }
    if (!updatedUser) {
      return res.status(404).render("error", {
        pageTitle: "User Not Found",
        errorTitle: "404 - Not Found",
        errorMessage: "User could not be updated because it doesn't exist.",
      });
    }
    if (req.body.role === "admin") {
      res.redirect("/api/users/admin");
    } else {
      res.redirect("/api/users/user");
    }
  } catch (err) {
    console.error("Error updating user:", err.message);
    return res.status(400).render("error", {
      pageTitle: "Update Failed",
      errorTitle: "Update Error",
      errorMessage: "An error occurred while updating the user.",
    });
  }
}

// DELETE user
async function deleteUserById(req, res) {
  try {
    const txCount = await Transaction.countDocuments({ userId: req.params.id });
    if (txCount > 0) {
      return res.status(400).render("error", {
        pageTitle: "Delete Blocked",
        errorTitle: "User Has Transactions",
        errorMessage: "Cannot delete user with active or issued transactions.",
      });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).render("error", {
        pageTitle: "User Not Found",
        errorTitle: "Delete Failed",
        errorMessage: "The user you are trying to delete does not exist.",
      });
    }
    res.redirect("/api/users/user");
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).render("error", {
      pageTitle: "Server Error",
      errorTitle: "Deletion Failed",
      errorMessage: "An error occurred while deleting the user.",
    });
  }
}

module.exports = {
  getAllUsers,
  getAllAdmins,
  getUserById,
  viewUserInfo,
  addUser,
  editUser,
  OpenUpdatePW,
  updatePassword,
  handleCreateNewUser,
  updateUserById,
  deleteUserById,
};
