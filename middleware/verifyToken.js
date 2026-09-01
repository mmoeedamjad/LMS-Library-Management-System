const jwt = require("jsonwebtoken");
require("dotenv").config();

async function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).redirect("/api/auth/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now req.user contains { userId, role }
    res.locals.userId = decoded.userId;  // <-- available in EJS
    res.locals.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).render("error", {
      pageTitle: "Unauthorized",
      errorTitle: "Access Denied",
      errorMessage: "Invalid or expired token. Please log in again.",
    });
  }
}

module.exports = { verifyToken };
