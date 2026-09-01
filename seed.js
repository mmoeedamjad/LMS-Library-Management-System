const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/usersModel");
const Category = require("./models/categoryModel");
const Book = require("./models/bookModel");
const Transaction = require("./models/transactionModel");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Library";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB at:", MONGO_URL);
    await mongoose.connect(MONGO_URL);
    console.log("Connected successfully.");

    // Clear existing data
    console.log("Clearing existing collections...");
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Book.deleteMany({}),
      Transaction.deleteMany({}),
    ]);
    console.log("Existing collections cleared.");

    // 1. Seed Users
    console.log("Seeding users...");
    const adminHashedPassword = await bcrypt.hash("admin123", 10);
    const userHashedPassword = await bcrypt.hash("user123", 10);

    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@library.com",
        password: adminHashedPassword,
        role: "admin",
        isActive: "Y",
        createdAt: new Date(),
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: userHashedPassword,
        role: "user",
        isActive: "Y",
        createdAt: new Date(),
      },
      {
        name: "Sarah Connor",
        email: "sarah@example.com",
        password: userHashedPassword,
        role: "user",
        isActive: "Y",
        createdAt: new Date(),
      },
    ]);

    const admin = users[0];
    const clientUser1 = users[1];
    const clientUser2 = users[2];
    console.log(`Created ${users.length} users (1 admin, 2 client users).`);

    // 2. Seed Categories
    console.log("Seeding categories...");
    const categories = await Category.insertMany([
      {
        name: "Computer Science",
        description: "Software engineering, algorithms, architectures, and emerging technologies.",
      },
      {
        name: "Classic Literature",
        description: "Timeless fiction and literary masterpieces across centuries.",
      },
      {
        name: "Science & Physics",
        description: "Explorations of the cosmos, quantum mechanics, and natural sciences.",
      },
      {
        name: "Philosophy & History",
        description: "Works on human civilization, ethics, reason, and historical analysis.",
      },
      {
        name: "Business & Economics",
        description: "Leadership, entrepreneurship, macroeconomics, and modern commerce.",
      },
    ]);

    const [catCS, catLit, catSci, catPhil, catBiz] = categories;
    console.log(`Created ${categories.length} categories.`);

    // 3. Seed Books
    console.log("Seeding books...");
    const books = await Book.insertMany([
      {
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        authorName: "Robert C. Martin",
        isbn: "978-0132350884",
        categoryId: catCS._id,
        totalCopies: 5,
        copiesAvailable: 4, // 1 issued
        quantity: 4,
        shelfLocation: "A1-01",
      },
      {
        title: "The Pragmatic Programmer",
        authorName: "Andrew Hunt & David Thomas",
        isbn: "978-0201616224",
        categoryId: catCS._id,
        totalCopies: 4,
        copiesAvailable: 4,
        quantity: 4,
        shelfLocation: "A1-02",
      },
      {
        title: "Designing Data-Intensive Applications",
        authorName: "Martin Kleppmann",
        isbn: "978-1449373320",
        categoryId: catCS._id,
        totalCopies: 3,
        copiesAvailable: 3,
        quantity: 3,
        shelfLocation: "A1-03",
      },
      {
        title: "1984",
        authorName: "George Orwell",
        isbn: "978-0451524935",
        categoryId: catLit._id,
        totalCopies: 6,
        copiesAvailable: 5, // 1 issued
        quantity: 5,
        shelfLocation: "B2-01",
      },
      {
        title: "The Great Gatsby",
        authorName: "F. Scott Fitzgerald",
        isbn: "978-0743273565",
        categoryId: catLit._id,
        totalCopies: 4,
        copiesAvailable: 4,
        quantity: 4,
        shelfLocation: "B2-02",
      },
      {
        title: "To Kill a Mockingbird",
        authorName: "Harper Lee",
        isbn: "978-0061120084",
        categoryId: catLit._id,
        totalCopies: 4,
        copiesAvailable: 4,
        quantity: 4,
        shelfLocation: "B2-03",
      },
      {
        title: "A Brief History of Time",
        authorName: "Stephen Hawking",
        isbn: "978-0553380163",
        categoryId: catSci._id,
        totalCopies: 3,
        copiesAvailable: 3,
        quantity: 3,
        shelfLocation: "C3-01",
      },
      {
        title: "Meditations",
        authorName: "Marcus Aurelius",
        isbn: "978-0140449334",
        categoryId: catPhil._id,
        totalCopies: 5,
        copiesAvailable: 5,
        quantity: 5,
        shelfLocation: "D4-01",
      },
      {
        title: "Sapiens: A Brief History of Humankind",
        authorName: "Yuval Noah Harari",
        isbn: "978-0062316097",
        categoryId: catPhil._id,
        totalCopies: 4,
        copiesAvailable: 4,
        quantity: 4,
        shelfLocation: "D4-02",
      },
      {
        title: "Zero to One: Notes on Startups",
        authorName: "Peter Thiel",
        isbn: "978-0804139298",
        categoryId: catBiz._id,
        totalCopies: 3,
        copiesAvailable: 3,
        quantity: 3,
        shelfLocation: "E5-01",
      },
    ]);

    console.log(`Created ${books.length} books.`);

    // 4. Seed Transactions
    console.log("Seeding transactions...");
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const elevenDaysLater = new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000);

    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const nineDaysLater = new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000);

    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    const twentyFiveDaysAgo = new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000);
    const elevenDaysAgo = new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000);
    const twelveDaysAgo = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000);

    const transactions = await Transaction.insertMany([
      {
        userId: clientUser1._id,
        bookId: books[0]._id, // Clean Code
        issueDate: threeDaysAgo,
        dueDate: elevenDaysLater,
        returnDate: null,
        status: "Issued",
      },
      {
        userId: clientUser2._id,
        bookId: books[3]._id, // 1984
        issueDate: fiveDaysAgo,
        dueDate: nineDaysLater,
        returnDate: null,
        status: "Issued",
      },
      {
        userId: clientUser1._id,
        bookId: books[4]._id, // The Great Gatsby
        issueDate: fifteenDaysAgo,
        dueDate: oneDayAgo,
        returnDate: twoDaysAgo,
        status: "Returned",
      },
      {
        userId: clientUser2._id,
        bookId: books[8]._id, // Sapiens
        issueDate: twentyFiveDaysAgo,
        dueDate: elevenDaysAgo,
        returnDate: twelveDaysAgo,
        status: "Returned",
      },
    ]);

    console.log(`Created ${transactions.length} transactions (2 Issued, 2 Returned).`);

    console.log("\n========================================");
    console.log(" Database Population Completed! ");
    console.log("========================================");
    console.log("Admin Account:");
    console.log("  Email:    admin@library.com");
    console.log("  Password: admin123");
    console.log("  Role:     admin");
    console.log("\nClient Accounts:");
    console.log("  1) Email: john@example.com   | Password: user123");
    console.log("  2) Email: sarah@example.com  | Password: user123");
    console.log("========================================\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedDatabase();
