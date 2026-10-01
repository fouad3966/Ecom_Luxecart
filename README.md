# LuxeCart — Premium E-Commerce Platform

![LuxeCart Platform Preview](https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200&h=400)

> A modern, full-stack e-commerce SaaS prototype demonstrating robust architecture, secure stateless authentication, and a premium, highly responsive user interface.

LuxeCart is engineered as a complete end-to-end shopping platform. It features a fully dynamic customer storefront and a protected administrative dashboard for managing products, inventory, and orders. The project was built to showcase production-ready development practices, full-stack state management, and custom API design.

## 🚀 Key Technical Achievements & Skills Demonstrated

This project highlights proficiency in building scalable web applications using the MERN/PERN stack methodologies, adapted for a lightweight local SQLite database.

### 1. Full-Stack Architecture & API Design
- **RESTful API**: Designed and implemented a structured REST API using **Express.js** to handle authentication, product catalogs, shopping carts, and administrative operations.
- **Relational Database Design**: Designed a normalized **SQLite** database schema (Users, Products, Orders, Order_Items) leveraging foreign keys, cascading deletes, and optimized indexing.
- **Custom Middlewares**: Developed reusable Express middlewares for JWT verification and strict Role-Based Access Control (RBAC).

### 2. Frontend Engineering (React 19)
- **Advanced State Management**: Utilized React's Context API and custom hooks (`useAuth`, `useCart`, `useWishlist`) to manage complex, globally shared state across the application without relying on Redux.
- **Performance Optimization**: Implemented `useEffect` and `useCallback` for optimized data fetching, debounced API calls, and automatic UI synchronization.
- **Custom UI System**: Built a complete design system from scratch using Vanilla CSS, CSS variables (tokens), and modern layout techniques (CSS Grid/Flexbox), avoiding component libraries to demonstrate core CSS mastery.

### 3. Security Best Practices
- **Stateless Authentication**: Implemented secure, stateless sessions using `jsonwebtoken` (JWT), passing tokens via Authorization headers.
- **XSS Prevention**: Built a custom recursive input sanitization middleware on the backend to strip HTML tags and prevent Cross-Site Scripting (XSS) attacks.
- **Brute-Force Protection**: Integrated `express-rate-limit` and `helmet` to secure HTTP headers and throttle login attempts.

---

## 🏗️ System Architecture

```text
[ React Frontend ]  <--(JSON over HTTP)-->  [ Express Node.js API ]  <--(SQL Queries)-->  [ SQLite Database ]
      |                                              |                                           |
- React Router DOM                             - JWT Auth Middleware                       - Schema & Relations
- Context API (State)                          - Role-Based Access (Admin/User)            - Persistent Storage
- Dynamic Filters                              - XSS Sanitization & Rate Limiting          - Seed Scripts
```

## ✨ Core Features

### 🛍️ Storefront (Customer Facing)
- **Dynamic Product Catalog**: Real-time fetching of products, categories, and stock statuses.
- **Advanced Filtering**: Filter and sort products dynamically by category, price range, color, and brand.
- **Cart & Wishlist**: Real-time cart state management with a simulated checkout flow and order history tracking.

### 🛡️ Admin Dashboard
- **Analytics Overview**: View real-time stats on total revenue, active orders, and average order values.
- **Inventory Management**: Complete CRUD operations for adding, editing, and deleting products.
- **Order Processing**: Track orders and update fulfillment statuses (Processing, Shipped, Delivered).

---

## 🛠️ Tech Stack Breakdown

| Layer | Technologies Used |
|-------|-------------------|
| **Frontend** | React 19, Vite, React Router DOM v7, Vanilla CSS |
| **Backend** | Node.js, Express.js (v5) |
| **Database** | `sql.js` (SQLite in WebAssembly) |
| **Security** | `jsonwebtoken` (JWT), `bcryptjs`, `helmet`, `express-rate-limit` |

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v18 or newer)

### 1. Clone the repository
```bash
git clone https://github.com/fouad3966/Ecom_Luxecart.git
cd Ecom_Luxecart
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 3. Environment Variables
Create a `.env` file in the `/server` directory:
```env
PORT=3001
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Run the Application
You will need two terminal windows.

**Terminal 1 (Backend):**
```bash
cd server
npm start
# API runs on http://localhost:3001
# Note: The database automatically seeds demo data on first launch.
```

**Terminal 2 (Frontend):**
```bash
npm run dev
# App runs on http://localhost:5173
```

## 🔐 Demo Accounts
- **Admin Access:** `admin@luxecart.com` / `admin123`
- **Customer Access:** `demo@luxecart.com` / `demo123`

---
*This project serves as a comprehensive demonstration of full-stack engineering, emphasizing clean code, security, and scalable architecture.*
