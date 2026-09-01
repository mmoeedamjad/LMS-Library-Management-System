const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Render Signup Page
function showSignupForm(req, res) {
  res.render("../views/auth/signup", {
    errors: [],
    oldInput: {},
    pageTitle: "Sign Up",
  });
}
function showLoginForm(req, res) {
  res.render("../views/auth/login", {
    errors: [],
    oldInput: {},
    pageTitle: "Log in",
  });
}

// Handle Signup Submission
async function handleSignup(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  // Extra backend check (besides express-validator)
  if (password !== confirmPassword) {
    return res.status(400).render("../views/auth/signup", {
      errors: [{ msg: "Passwords do not match." }],
      oldInput: req.body,
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).render("../views/auth/signup", {
        errors: [{ msg: "Email already registered." }],
        oldInput: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      role: "user", // always "user" for signup
      isActive: "Y",
    });

    await user.save();

    // // Create JWT Token (optional: send or store it in cookie)
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1d",
    // });

    res.redirect("/api/auth/login"); // redirect to login page
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).render("error", {
      pageTitle: "Signup Error",
      errorTitle: "Registration Failed",
      errorMessage: "Something went wrong. Please try again later.",
    });
  }
}
async function handleLogin(req, res) {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).render("../views/auth/login", {
        errors: [{ msg: "Invalid Email Address." }],
        oldInput: req.body,
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(409).render("../views/auth/login", {
        errors: [{ msg: "Invalid email or password." }],
        oldInput: req.body,
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // Save token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    if (user.role === "admin") {
      return res.redirect("/api/dashboard");
    } else {
      return res.redirect("/api/user-dashboard");
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).render("error", {
      pageTitle: "Login Error",
      errorTitle: "Login Failed",
      errorMessage: "Something went wrong. Please try again later.",
    });
  }
}
async function Logout(req, res) {
  res.clearCookie("token"); // Clear the cookie that contains the JWT
  res.redirect("/api/auth/login"); // Redirect to login page
}

function handleGoogleCallback(req, res) {
  // Google user is available in req.user from passport
  const user = req.user;

  // You can create a JWT if needed (or rely on session)
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  if (user.role === "admin") {
    res.redirect("/api/dashboard");
  } else {
    res.redirect("/api/user-dashboard");
  }
}

module.exports = {
  showSignupForm,
  showLoginForm,
  handleSignup,
  handleLogin,
  Logout,
  handleGoogleCallback,
};
