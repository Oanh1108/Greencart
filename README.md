## 🛒 GreenCart – E-commerce Grocery Web App

**GreenCart** is a full-stack web application for ordering groceries online. It includes a 
user-friendly frontend, an admin dashboard for management, and a backend API for handling 
orders, products, users, and secure payments.

---

## 🚀 Technologies Used

### 🔹 Frontend (Client)
- **React** – JavaScript library for building user interfaces
- **React Router DOM** – Handles routing between pages
- **Tailwind CSS** – Utility-first CSS framework
- **Vite** – Fast build tool for frontend development

### 🔹 Backend (Server)
- **Node.js** – JavaScript runtime environment
- **Express** – Minimal and flexible web framework for Node.js
- **MongoDB** – NoSQL database for storing app data
- **Mongoose** – ODM for MongoDB and Node.js
- **Stripe** – Secure online payment integration

---

## 🛠 Admin Dashboard
- Manage products (add, update, delete)
- View and process customer orders
- Track payment status (Online or COD)
- Monitor store performance

---

## 🗂 Directory Structure

GreenCart/
├── client/ # Frontend (User Interface)
│ ├── src/
│ │ ├── Components/ # Reusable UI components
│ │ ├── Pages/ # Application pages
│ │ ├── Context/ # Context API for global state
│ └── public/ # Static assets (index.html, favicon...)

├── server/ # Backend (API and logic)
│ ├── models/ # Mongoose models
│ ├── routes/ # API route definitions
│ ├── controllers/ # Business logic
│ ├── configs/ # Database, Cloudinary, Stripe configs
│ ├── uploads/ # Image upload storage
│ └── .env # Environment variables

---

## ⚙️ Getting Started

### 📦 Step 1: Clone the Repository
- git clone https://github.com/Oanh1108/Greencart.git
  
### 💻 Step 2: Set Up the Frontend
- cd client
- npm install
- npm run dev
  
### 🖥 Step 3: Set Up the Backend
- cd ../server
- npm install
- npm run start   # or: node index.js
### 🔐 Demo Login
- Email: test@gmail.com
- Password: 12345678

### 💳 Online Payment
- GreenCart supports online payments through Stripe. Customers can securely pay for their orders
at checkout.

### 🔗 Useful References
- **ReactJS:** https://legacy.reactjs.org/docs/getting-started.html
- **React Router**: https://reactrouter.com/en/v6.3.0/getting-started/overview
- **Vite:** https://vite.dev/guide/
- **Node.js:** https://nodejs.org/docs/latest/api/
- **ExpressJS:** https://expressjs.com/en/starter/installing.html
- **MongoDB:** https://www.mongodb.com/docs/
- **Mongoose:** https://mongoosejs.com/docs/guide.html
- **GreatStack (YouTube):** https://www.youtube.com/@GreatStack

### ✨ Features Implemented
- Online payment with Stripe
- User and admin authentication
- Add to cart, manage cart items
- Place and track orders
- View order history (COD)

### 📌 Features Coming Soon
- Discount and coupon system
- Email notifications after order confirmation
- View order history (online)

 Advanced revenue analytics for admin

 Product reviews and ratings

