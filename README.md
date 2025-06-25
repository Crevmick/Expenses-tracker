# Expense Tracker API

This is a Node.js and Express.js based API for tracking personal expenses. It allows users to manage their expenses, categorize them, and export expense data in various formats.

## Features

*   User authentication (Sign up, Sign In)
*   Password reset functionality (OTP verification)
*   CRUD operations for expense categories
*   CRUD operations for expenses
*   Export expenses in CSV, Excel (XLSX), and PDF formats

## Prerequisites

*   Node.js (v14 or higher recommended)
*   npm (usually comes with Node.js)
*   MongoDB (ensure you have a running instance and its URI)

## Installation

1.  **Clone the repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd expenses-tracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables. Replace placeholder values with your actual configuration.
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    EMAIL_USER=your_email_address # For OTP sending
    EMAIL_PASS=your_email_password # For OTP sending
    ```
    *   `PORT`: The port on which the server will run.
    *   `MONGODB_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A secret key for signing JSON Web Tokens.
    *   `EMAIL_USER` & `EMAIL_PASS`: Credentials for the email account used to send OTPs for password resets.

## Running the Application

*   **Development mode (with auto-reloading using nodemon):**
    ```bash
    npm run dev
    ```

*   **Production mode:**
    ```bash
    npm start
    ```

The server will start on the port specified in your `.env` file (default is 3000).

## API Endpoints

All endpoints are prefixed with `/api`. User authentication (JWT token in Authorization header) is required for most expense and category related endpoints.

### Authentication

*   `POST /api/auth/signup`: Register a new user.
    *   Body: `{ "username": "testuser", "email": "user@example.com", "password": "password123" }`
*   `POST /api/auth/signin`: Log in an existing user.
    *   Body: `{ "email": "user@example.com", "password": "password123" }`

### Password Reset

*   `POST /api/password/forgot-password`: Request a password reset OTP.
    *   Body: `{ "email": "user@example.com" }`
*   `POST /api/password/verify-otp`: Verify the OTP.
    *   Body: `{ "email": "user@example.com", "otp": "123456" }`
*   `POST /api/password/reset-password`: Set a new password after OTP verification.
    *   Body: `{ "email": "user@example.com", "newPassword": "newSecurePassword" }`

### Categories (Authentication Required)

*   `POST /api/categories`: Create a new category.
    *   Body: `{ "name": "Groceries", "description": "Monthly grocery shopping" }`
*   `GET /api/categories`: Get all categories for the authenticated user.
*   `GET /api/categories/:id`: Get a specific category by ID.
*   `PUT /api/categories/:id`: Update a category by ID.
*   `DELETE /api/categories/:id`: Delete a category by ID.

### Expenses (Authentication Required)

*   `POST /api/expenses`: Create a new expense.
    *   Body: `{ "title": "Milk", "amount": 3, "categoryId": "your_category_id", "date": "2023-10-27", "note": "Bought from local store" }`
*   `GET /api/expenses`: Get all expenses for the authenticated user.
*   `GET /api/expenses/export?format=<format_type>`: Export expenses.
    *   `format_type`: Can be `csv`, `xlsx`, or `pdf`.
    *   Example: `GET /api/expenses/export?format=csv`
*   `GET /api/expenses/:id`: Get a specific expense by ID.
*   `PUT /api/expenses/:id`: Update an expense by ID.
*   `DELETE /api/expenses/:id`: Delete an expense by ID.

## Scripts

The `package.json` file contains some utility scripts:

*   `npm run lint`: Lint the codebase using ESLint.
*   `npm run format`: Format the code using Prettier.

This project also includes placeholder scripts for CSV/PDF export and Excel import (`export-csv`, `export-pdf`, `import-excel`) which might be for command-line utilities and are separate from the API export functionality implemented.

---

This README provides a comprehensive guide to setting up, running, and using the Expense Tracker API.
Make sure to replace placeholder values in the `.env` example with your actual configuration details.
The `EMAIL_USER` and `EMAIL_PASS` are necessary if you intend to use the password reset via email OTP functionality. You might need to configure your email provider for "less secure app access" if using Gmail, or use an app-specific password.
The database connection (`MONGODB_URI`) is crucial for the application to function.
The `JWT_SECRET` should be a long, random, and strong string for security.
The API export functionality via `GET /api/expenses/export` is the newly implemented feature for downloading expenses in different file formats.
