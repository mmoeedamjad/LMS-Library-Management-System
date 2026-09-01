const Category = require("../models/categoryModel");
const Book = require("../models/bookModel");
// GET all Categories
async function getAllCategory(req, res) {
  try {
    const categories = await Category.find();
    res.render("../views/categories/all-categories", {
      categories,
      page: "categories",
      pageTitle: "All Categories",
    });
  } catch (err) {
    res.status(500).render("error", {
      pageTitle: "Error 500",
      errorTitle: "Server Error",
      errorMessage: "Failed to fetch Categories. Please try again later.",
    });
  }
}

// GET Category by ID
async function getCategoryById(req, res) {
  try {
    const categories = await Category.findById(req.params.id);
    if (!categories) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Not Found",
        errorMessage: "Category not found.",
      });
    }
    res.render("../views/categories/view-category", {
      categories,
      page: "categories",
      pageTitle: "View Category",
    });
    // return res.json(categories);
  } catch (err) {
    res.status(400).render("error", {
      pageTitle: "Error 400",
      errorTitle: "Invalid Request",
      errorMessage: "Invalid Category ID.",
    });
  }
}

// open inserting form
async function addCategory(req, res) {
  res.render("../views/categories/add-category", {
    page: "categories",
    pageTitle: "Add Category",
    oldInput: {},
  });
}
// open editing form
async function editCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Not Found",
        errorMessage: "Category not found.",
      });
    }

    res.render("../views/categories/edit-category", {
      category,
      page: "categories",
      pageTitle: "Edit Category",
      oldInput: {},
    });
  } catch (err) {
    res.status(400).render("error", {
      pageTitle: "Error 400",
      errorTitle: "Invalid Request",
      errorMessage: "Invalid Category ID.",
    });
  }
}

// CREATE new Category
async function createCategory(req, res) {
  if (req.validationErrors) {
    return res.status(400).render("../views/categories/add-category", {
      errors: req.validationErrors,
      oldInput: req.oldInput,
      page: "categories",
      pageTitle: "Add Category",
    });
  }
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      res.status(400).render("error", {
        pageTitle: "Error 400",
        errorTitle: "Server Error",
        errorMessage: "Missing required fields",
      });
      // return res.status(400).send("Missing required fields");
    }

    const newCategory = await Category.create({
      name,
      description,
    });
    res.redirect("/api/category");
    // return res.status(201).json({ message: "Category created", Category: newCategory });
  } catch (err) {
    console.error("Failed to insert category:", err);
    res.status(500).render("error", {
      pageTitle: "Error 500",
      errorTitle: "Server Error",
      errorMessage: "Failed to create category.",
    });
  }
}

// UPDATE Category
async function updateCategoryById(req, res) {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).render("error", {
      pageTitle: "Error 404",
      errorTitle: "Not Found",
      errorMessage: "Category not found.",
    });
  }
  if (req.validationErrors) {
    return res.status(400).render("../views/categories/edit-category", {
      category,
      errors: req.validationErrors,
      oldInput: req.oldInput,
      page: "categories",
      pageTitle: "Edit Category",
    });
  }
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
      },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Not Found",
        errorMessage: "Category not found.",
      });
    }
    res.redirect("/api/category");
  } catch (err) {
    console.error("Error updating category:", err.message);
    res.status(400).render("error", {
      pageTitle: "Error 400",
      errorTitle: "Update Failed",
      errorMessage: "Failed to update category.",
    });
  }
}

// DELETE Category
async function deleteCategoryById(req, res) {
  try {
    const bookCount = await Book.countDocuments({ categoryId: req.params.id });
    if (bookCount > 0){
      return res.status(400).render("error", {
        pageTitle: "Delete Blocked",
        errorTitle: "Category includes Books",
        errorMessage: "Cannot delete category containing books.",
      });
    }
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).render("error", {
        pageTitle: "Error 404",
        errorTitle: "Not Found",
        errorMessage: "Category not found.",
      });
    }
    res.redirect("/api/category");
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).render("error", {
      pageTitle: "Error 500",
      errorTitle: "Server Error",
      errorMessage: "Failed to delete category.",
    });
  }
}

module.exports = {
  getAllCategory,
  getCategoryById,
  addCategory,
  editCategory,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};
