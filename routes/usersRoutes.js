const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/usersController");
const validateUser = require("../middleware/userValidator");
const { handleValidationErrors } = require("../middleware/validationHandler");
const checkAdmin = require("../middleware/roleCheck");

// GET all users and admins and POST new user
router
  .route("/")
  .post(validateUser, handleValidationErrors, handleCreateNewUser);

router.route("/admin").get(checkAdmin, getAllAdmins);
router.route("/user").get(checkAdmin, getAllUsers);

router.route("/add").get(checkAdmin, addUser);
router
  .route("/edit/:id")
  .get(checkAdmin, editUser)
  .post(checkAdmin, validateUser, handleValidationErrors, updateUserById);

// GET, PATCH, DELETE by ID
router.route("/:id").get(checkAdmin, getUserById);
router.route("/delete/:id").get(checkAdmin, deleteUserById);
router.route("/personal/:id").get(checkAdmin, viewUserInfo);
router.route("/pw/:id").get(OpenUpdatePW).post(updatePassword);
module.exports = router;
