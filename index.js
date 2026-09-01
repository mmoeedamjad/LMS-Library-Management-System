const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./config/passport"); // Load Google strategy
const checkAdmin = require("./middleware/roleCheck");

const { connectMongoDb } = require("./connection");

const app = express();

// Session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

const bookRoute = require("./routes/bookRoutes");
const userRoute = require("./routes/usersRoutes");
const categoryRoute = require("./routes/categoryRoutes");
const transactionRoute = require("./routes/transactionRoute");
const dashboardRoute = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");

const logReqRes = require("./middleware");
const { verifyToken } = require("./middleware/verifyToken");

app.use(express.json()); // for JSON payloads (important for API)
app.use(express.urlencoded({ extended: false })); // for form data

const cookieParser = require("cookie-parser");
app.use(cookieParser());
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

//MongoDB connection
connectMongoDb(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error", err));

app.set("view engine", "ejs");

// Middleware - Plugin
app.use(logReqRes("log.txt")); // custom request logger
app.use(express.static("public"));

// Routes
app.use("/api", authRoutes);
app.use(verifyToken);
app.use("/api", dashboardRoute);
app.use("/api/users", userRoute);
app.use("/api/books", checkAdmin, bookRoute);
app.use("/api/category", checkAdmin, categoryRoute);
app.use("/api/transactions", checkAdmin, transactionRoute);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/api/home`);
});
