# DOCS

## Pre-Credentials for convenience

### For Role: Customer
- **Email:** customer@gmail.com | **Password:** test123  
- **Email:** raja@gmail.com | **Password:** test123  
- **Email:** customer2@gmail.com | **Password:** test123  

### For Role: Admin
- **Email:** admin@gmail.com | **Password:** test123  

### For Role: Advisor
- **Email:** advisor@gmail.com | **Password:** test123  

# Backend Setup Documentation

## 1. Project Initialization
### Install Dependencies
Run the following command inside the `backend/` folder:
```sh
npm init -y
npm install express mongoose dotenv cors jsonwebtoken bcryptjs cookie-parser express-validator redis socket.io
npm install --save-dev nodemon jest supertest
```

### Project Structure
```
backend/
│── src/
│   ├── config/            # Database connection
│   ├── controllers/       # Business logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, validation, logging
│   ├── services/          # External API logic (Plaid, notifications)
│   ├── utils/             # Helpers, error handling
│   ├── app.js             # Express setup
│   ├── server.js          # Entry point
│── .gitignore
│── package.json
│── README.md
```

---

## 2. Express Server Setup
### `server.js`
This is the entry point for our backend.
```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect Database
connectDB();

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 3. Database Connection
### `db.js`
This file connects MongoDB Atlas to our application.
```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 4. Environment Variables
Create a `.env` file in the `backend/` folder:
```
PORT=5000
MONGO_URI=mongodb+srv://<your-cluster>.mongodb.net/fintechDB
JWT_SECRET=your_secret_key
```

---

## 5. Running the Server
Start the backend server:
```sh
node server.js
```
OR (for hot-reloading):
```sh
npx nodemon server.js
```
Visit `http://localhost:5000/` – You should see `API is running...`

---

# Authentication Module Documentation

## Overview
This module handles user authentication, including registration and login. It uses JWT-based authentication to secure API endpoints.

## Endpoints

### 1. User Registration
**Endpoint:** `POST /api/auth/register`
**Description:** Registers a new user with email, password, and role.

#### Request Body:
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "role": "customer"
}
```

#### Response:
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "role": "customer",
  "token": "jwt_token"
}
```

#### Possible Errors:
- **400 Bad Request** - Missing fields or invalid data.
- **409 Conflict** - Email already registered.
- **500 Internal Server Error** - Server issues.

---

### 2. User Login
**Endpoint:** `POST /api/auth/login`
**Description:** Authenticates a user and returns a JWT token.

#### Request Body:
```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

#### Response:
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "role": "customer",
  "token": "jwt_token"
}
```

#### Possible Errors:
- **400 Bad Request** - Invalid email or password.
- **500 Internal Server Error** - Server issues.

---

## Middleware
### Authentication Middleware
Verifies JWT tokens for protected routes.
```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

---

## Testing
We used **Jest** and **Supertest** to validate authentication functionality.

### **Test Cases:**
- Should register a new user (`201 Created`)
- Should login an existing user (`200 OK`)
- Should return errors for invalid credentials

#### Example Test:
```javascript
test('Should register a new user', async () => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'customer'
  });
  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty('token');
});
```

---

# DOCS

# Backend Setup Documentation

## 1. Project Initialization
### Install Dependencies
Run the following command inside the `backend/` folder:
```sh
npm init -y
npm install express mongoose dotenv cors jsonwebtoken bcryptjs cookie-parser express-validator redis socket.io
npm install --save-dev nodemon jest supertest
```

### Project Structure
```
backend/
│── src/
│   ├── config/            # Database connection
│   ├── controllers/       # Business logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, validation, logging
│   ├── services/          # External API logic (Plaid, notifications)
│   ├── utils/             # Helpers, error handling
│   ├── app.js             # Express setup
│   ├── server.js          # Entry point
│── .gitignore
│── package.json
│── README.md
```

---

## 2. Express Server Setup
### `server.js`
This is the entry point for our backend.
```javascript
import express from 'express';
import dotenv from 'dotenv';
cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect Database
connectDB();

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 3. Database Connection
### `db.js`
This file connects MongoDB Atlas to our application.
```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 4. Environment Variables
Create a `.env` file in the `backend/` folder:
```
PORT=5000
MONGO_URI=mongodb+srv://<your-cluster>.mongodb.net/fintechDB
JWT_SECRET=your_secret_key
```

---

## 5. Running the Server
Start the backend server:
```sh
node server.js
```
OR (for hot-reloading):
```sh
npx nodemon server.js
```
Visit `http://localhost:5000/` – You should see `API is running...`

---

# Authentication Module Documentation

## Overview
This module handles user authentication, including registration and login. It uses JWT-based authentication to secure API endpoints.

## Endpoints

### 1. User Registration
**Endpoint:** `POST /api/auth/register`
**Description:** Registers a new user with email, password, and role.

#### Request Body:
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "role": "customer"
}
```

#### Response:
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "role": "customer",
  "token": "jwt_token"
}
```

#### Possible Errors:
- **400 Bad Request** - Missing fields or invalid data.
- **409 Conflict** - Email already registered.
- **500 Internal Server Error** - Server issues.

---

### 2. User Login
**Endpoint:** `POST /api/auth/login`
**Description:** Authenticates a user and returns a JWT token.

#### Request Body:
```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

#### Response:
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "role": "customer",
  "token": "jwt_token"
}
```

#### Possible Errors:
- **400 Bad Request** - Invalid email or password.
- **500 Internal Server Error** - Server issues.

---

## Middleware
### Authentication Middleware
Verifies JWT tokens for protected routes.
```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

---

# Transactions Module

## 1. Transaction Model
```javascript
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionType: {
      type: String,
      enum: ['deposit', 'withdrawal', 'transfer'],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
```

---

## 2. User Schema Update
Added a new `balance` field in the user schema to track financial transactions.

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], required: true },
  balance: { type: Number, default: 0 }
});
```
# Transaction System

## Overview of Transaction Logic

The transaction system supports three types of transactions: deposit, withdrawal, and transfer. The logic ensures data integrity, security, and proper validation before processing transactions.

### 1. Deposit
- Users can deposit money into their own account.
- Deposits to another user's account are not allowed.
- The system updates the receiver's balance accordingly.

### 2. Withdrawal
- Users can withdraw funds from their account if their balance is sufficient.
- The balance is atomically checked and updated to prevent overdrafts.

### 3. Transfer
- A user can transfer funds to another user.
- The sender's balance is checked to ensure sufficiency before deduction.
- If the sender and receiver are the same, the transaction is rejected.
- If the receiver does not exist, the transaction is rolled back to maintain data consistency.

All transactions are stored in the database with a status of `completed` upon successful execution.

---

## Testing Approach

To ensure the correctness and robustness of the transaction system, the following tests were implemented using Jest and Supertest:

### 1. Successful Transactions
- Creating a transfer transaction with valid users and a sufficient balance.
- Depositing money into one's own account.
- Withdrawing money if the account has enough balance.

### 2. Failure Scenarios
- Depositing into another user's account (should be rejected).
- Attempting to withdraw an amount greater than the available balance.
- Performing a transaction with a negative amount (should be rejected).
- Using an invalid transaction type (should return a validation error).
- Attempting to transfer money to oneself (should be rejected).

### 3. Edge Cases
- Depositing an amount of zero (should be rejected).
- Withdrawing an amount of zero (should be rejected).
- Handling rollback in case of a failed transaction to prevent inconsistent data.

These tests ensure that transactions are processed correctly and prevent unauthorized actions or incorrect fund movements.

---

# Frontend Development and Backend Connection

## 1. Frontend Setup
We started by initializing the frontend with **React** using `create-vite@latest` and installing the necessary dependencies:
- `axios` for making API requests.
- `react-router-dom` for handling routing between pages.
- `socket.io-client` for establishing WebSocket connections.
- `chart.js` and `react-chartjs-2` for displaying financial data visualizations.

### Folder Structure:
- `components/`: Contains reusable UI components .
- `pages/`: Contains the different views or pages such as Landing Page.
- `hooks/`: Contains hooks for socket and authentication
- `utils/`: Contains helper functions for things like form validation and data formatting.

## 2. Routing Setup
We used **React Router** for page navigation. The primary routes are:
- `/`: Home page where the user can view transaction data and statistics.
- `/login`: Login page where users can enter credentials to authenticate.
- `/register`: Registration page where users can sign up.
- There are more protected routes.

The frontend setup includes routing to these pages based on the URL and managing navigation between them.

## 3. Authentication Pages
- **Login Page**: Allows users to log in by entering their email and password. Upon successful login, an authentication token (JWT) is received and stored in local storage for maintaining the user session.
- **Register Page**: Allows new users to sign up by entering their name, email, password, and role. After successful registration, the user is redirected to the login page.

These pages handle user input validation to ensure correct data submission.

## 4. WebSocket for Real-Time Updates
We set up **WebSocket** connections via **Socket.io** for real-time transaction updates. The frontend listens for transaction data pushed from the backend through WebSocket and updates the UI immediately when new transactions occur.

## 5. Backend Integration
- The frontend makes API requests using `axios` and `fetch` to interact with the backend, such as registering a user, logging in, fetching transaction data, and sending transactions.
- The **Socket.io client** establishes a connection to the backend server to receive real-time updates about transactions.

The API communication includes:
- **POST requests** for user authentication (login and registration).
- **GET requests** for fetching transaction history and financial data.
- **WebSocket connection** for receiving real-time updates whenever a new transaction occurs or when transaction data is updated.

## 6. Data Visualization
For displaying financial data like transaction trends and account balances, we use **Chart.js** with the **react-chartjs-2** wrapper. This allows us to visualize complex financial data in a clean and interactive way.

## 7. State Management
The application uses React's **useState** and **useEffect** hooks to manage the state for things like authentication status, transaction data, and user profile details.


---
