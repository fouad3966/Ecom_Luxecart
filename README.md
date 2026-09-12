# LuxeCart E-Commerce Platform

![LuxeCart Platform Preview](https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200&h=400)

LuxeCart is a modern, full-stack e-commerce platform prototype designed to demonstrate a robust architecture, secure authentication, and a premium user experience.

Built with a **React 19** frontend and an **Express.js (v5)** backend powered by a local **SQLite** database, LuxeCart features a completely dynamic shopping experience along with a dedicated admin panel for inventory and order management.

## ✨ Features

### Storefront (Customer Facing)
- **Dynamic Product Catalog**: Products, categories, and inventory statuses are fetched dynamically from the database.
- **Advanced Filtering & Sorting**: Filter products by category, price range, color, size, and brand.
- **Shopping Cart & Checkout**: Real-time cart state management with a seamless simulated checkout process.
- **User Accounts**: Order history tracking and profile management for logged-in users.

### Admin Dashboard (Role-Based Access)
- **Revenue Analytics**: Real-time stats on total revenue, orders, active products, and average order value.
- **Inventory Management**: Full CRUD (Create, Read, Update, Delete) operations for products.
- **Order Processing**: Track orders and update shipping statuses (Processing, Shipped, Delivered, Cancelled).
- **Secure Access**: The dashboard is strictly protected by backend role-validation middlewares.

### Security & Architecture
- **JWT Authentication**: Stateless authentication stored securely.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `customer` and `admin` roles.
- **XSS Protection**: Custom recursive middleware on the backend to sanitize inputs and prevent Cross-Site Scripting.
- **Rate Limiting**: IP-based rate limiting to protect authentication routes against brute-force attacks.

## 🛠️ Tech Stack

**Frontend:**
- React 19 (Vite)
- React Router DOM (v7)
- Context API (State Management)
- Vanilla CSS with a customized UI system (Glassmorphism, custom tokens)

**Backend:**
- Node.js & Express 5
- `sql.js` (SQLite in WebAssembly) for persistent, zero-config local storage
- `jsonwebtoken` (JWT) for stateless auth
- `bcryptjs` for secure password hashing
- `helmet` & `express-rate-limit` for security

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fouad3966/Ecom_Luxecart.git
   cd Ecom_Luxecart
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the `/server` directory with the following:
   ```env
   PORT=3001
   JWT_SECRET=your_super_secret_jwt_key
   ```

### Running the Application

1. **Start the Backend Server (Terminal 1):**
   ```bash
   cd server
   npm start
   # API will run on http://localhost:3001
   ```
   *Note: On first boot, the server will automatically seed the database with initial products and a demo admin/customer account.*

2. **Start the Frontend Server (Terminal 2):**
   ```bash
   npm run dev
   # App will run on http://localhost:5173
   ```

## 🔐 Demo Accounts

You can log in with the following seeded accounts to test the functionality:

- **Admin Account:** `admin@luxecart.com` / `admin123`
- **Customer Account:** `demo@luxecart.com` / `demo123`

---
*Developed as a high-performance, full-stack prototype.*
