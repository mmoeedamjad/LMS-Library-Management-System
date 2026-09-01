# Athenaeum &bull; Full-Stack Library Management System

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Codex-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-ready, open-source **Library Management System (LMS)** designed with an antique, scholarly aesthetic inspired by classic academic archives. Built with **Node.js, Express, MongoDB, EJS, and Three.js**, the application provides complete circulation workflows for both scholars and library administrators.

---

## Key Features

### 1. Public Card Catalog & Archival Presentation
- **Real-Time Catalog Search**: Instant client-side filtering by book title, author, ISBN, and category.
- **Dynamic Thematic Book Covers**: Automatically maps titles to high-resolution, genre-specific covers.
- **Interactive 3D Leather Codex**: Built with Three.js, offering an archival volume showcase with interactive camera orbit controls and page inspection.
- **Transparent Borrowing Policies**: Clear quotas, lending windows (14 days), and online renewal guidelines.
- **Privacy First**: Patron circulation ledgers are strictly restricted to authenticated dashboards.

### 2. Scholar / Member Workspace
- **Zero-Scroll Authentication**: Dedicated split-panel sign-in and registration pages that fit standard viewports.
- **Active Loan Register**: Live countdowns on due dates, current checkouts, and return timestamps.
- **Borrowing Quota Meter**: Visual progress indicator tracking against the standard 3-volume limit.
- **In-Dashboard Book Modal**: Accession details and 24-hour reserve hold requests without navigating away.
- **Security Console**: Self-service password update with visibility toggles.

### 3. Administrator & Circulation Console
- **Institutional Metric Counters**: Live dashboard tracking enrolled members, staff accounts, total cataloged titles, active loans, and discharged returns.
- **Complete Stacks Management**: CRUD operations for books, categories, members, and administrators.
- **Circulation Desk Ledger**: Issue books to registered patrons with automatic 14-day due date defaults and restock returns.
- **Deletion Safeguards**: Built-in modal confirmations before deleting accession records or user accounts.

### 4. Authentication & Security
- **JWT Session Cookies**: Secure token verification middleware (`verifyToken`).
- **Role-Based Access Control (RBAC)**: Enforced via `checkAdmin` middleware.
- **Password Security**: Salted hashing via `bcrypt`.
- **Google OAuth 2.0**: Integrated passport authentication flow.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime & Backend** | Node.js, Express.js |
| **Database & ODM** | MongoDB, Mongoose |
| **Templating Engine** | EJS (Embedded JavaScript) |
| **Styling & Icons** | Vanilla CSS (Athenaeum Design System), Bootstrap 5.3, Bootstrap Icons |
| **Typography** | Cinzel, Cormorant Garamond, EB Garamond, Courier Prime |
| **3D Graphics** | Three.js (WebGL Canvas) |
| **Authentication** | JSON Web Tokens (JWT), Cookies, Passport.js (Google OAuth 2.0), Bcrypt |

---

## Project Structure

```text
Library-Project/
├── config/
│   └── passport.js          # Google OAuth 2.0 strategy configuration
├── controllers/
│   ├── authController.js     # Signup, login, logout, and token logic
│   ├── bookController.js     # Book catalog CRUD handlers
│   ├── categoryController.js # Category taxonomy CRUD handlers
│   └── usersController.js    # Member & admin profile handlers
├── middleware/
│   ├── index.js              # Request logger middleware (log.txt)
│   ├── roleCheck.js          # Admin authorization guard
│   ├── userValidator.js      # Input validation schemas
│   ├── validationHandler.js  # Validation error formatter
│   └── verifyToken.js        # JWT verification middleware
├── models/
│   ├── bookModel.js          # Book schema (title, author, ISBN, copies, shelf)
│   ├── categoryModel.js      # Category taxonomy schema
│   ├── transactionModel.js   # Loan circulation schema (issue, due, return)
│   └── usersModel.js         # User schema (name, email, password, role)
├── public/
│   ├── css/
│   │   └── styles.css        # Athenaeum design system stylesheet
│   ├── images/               # High-resolution local library assets
│   └── js/
│       ├── common.js         # Deletion confirmation and utility scripts
│       └── hero-book-3d.js   # Three.js interactive 3D codex script
├── routes/
│   ├── authRoutes.js         # Public home and auth endpoints
│   ├── bookRoutes.js         # Book management routes
│   ├── categoryRoutes.js     # Category management routes
│   ├── dashboardRoutes.js    # Admin and user dashboard routes
│   ├── transactionRoute.js   # Circulation loan routes
│   └── usersRoutes.js        # User management and password routes
├── views/
│   ├── auth/                 # Login and signup views
│   ├── books/                # Book catalog, add, edit, and view views
│   ├── categories/           # Category taxonomy views
│   ├── partials/             # Admin header, sidebar layout, and footer
│   ├── transactions/         # Circulation ledger and issue views
│   ├── users/                # User registry, profile, and password views
│   ├── dashboard.ejs         # Admin console view
│   ├── home.ejs              # Public library home view
│   └── user-dashboard.ejs    # Scholar member portal view
├── .env.example              # Sanitized environment template
├── .gitignore                # Git ignore configuration
├── connection.js             # MongoDB connection utility
├── index.js                  # Application entry point
├── LICENSE                   # MIT License
├── package.json              # Project dependencies and npm scripts
├── README.md                 # Project documentation
└── seed.js                   # Database seeder script
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mmoeedamjad/LMS-Library-Management-System
   cd LMS-Library-Management-System
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and verify settings:
   ```env
   JWT_SECRET=SuperSonicSecretKey
   PORT=3000
   MONGO_URL=mongodb://127.0.0.1:27017/Library

   # Optional (for Google OAuth)
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   ```

4. **Seed Sample Data**
   Populate categories, cataloged volumes, and demo users:
   ```bash
   npm run seed
   ```

5. **Start the Application**
   ```bash
   npm start
   ```
   Open your browser and navigate to:
   **[http://localhost:3000/api/home](http://localhost:3000/api/home)**

---

## Demo Credentials

The seeder script (`seed.js`) provides sample accounts for immediate testing:

| Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@library.com` | `admin123` | Full access to Admin Console, Stacks, Categories, Members, and Loans |
| **Scholar Member** | `john@example.com` | `user123` | Member Dashboard, Borrowing Register, Hold Requests |
| **Scholar Member** | `sarah@example.com` | `user123` | Member Dashboard, Borrowing Register, Hold Requests |

*(Quick-fill buttons are also available on the Login page for one-click testing).*

---

## API & Route Reference

### Public Routes
- `GET /api/home` &bull; Public library homepage with catalog search and 3D codex.
- `GET /api/auth/login` &bull; Member and admin portal sign-in page.
- `POST /api/auth/login` &bull; Authenticate credentials and issue JWT cookie.
- `GET /api/auth/signup` &bull; Register a new member account.
- `POST /api/auth/signup` &bull; Create account and initialize borrower privileges.
- `GET /api/auth/logout` &bull; Clear session cookie and sign out.

### Member Routes *(Requires Authentication)*
- `GET /api/user-dashboard` &bull; Member portal with active loans, due dates, and quota meter.
- `GET /api/users/pw/:id` &bull; Password update form.
- `POST /api/users/pw/:id` &bull; Save updated account password.

### Administrator Routes *(Requires Admin Role)*
- `GET /api/dashboard` &bull; Admin console with system metrics and quick action dispatch.
- `GET /api/books` &bull; Inventory catalog with live search filter.
- `GET /api/books/add` &bull; Accession registration form for new volumes.
- `POST /api/books` &bull; Save new volume to catalog.
- `GET /api/books/:id` &bull; View detailed accession record.
- `GET /api/books/edit/:id` &bull; Edit volume bibliographic metadata.
- `POST /api/books/edit/:id` &bull; Update volume record.
- `GET /api/books/delete/:id` &bull; Delete volume from stacks.
- `GET /api/category` &bull; View collection taxonomy categories.
- `GET /api/category/add` &bull; Create new taxonomy category.
- `GET /api/users/user` &bull; Member identity registry.
- `GET /api/users/admin` &bull; Administrator identity registry.
- `GET /api/transactions` &bull; Circulation ledger of active loans and returns.
- `GET /api/transactions/add` &bull; Issue book loan to member.
- `POST /api/transactions/edit/:id` &bull; Update loan status or mark volume returned.

---

## License

Distributed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
