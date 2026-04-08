# 🚀 MERN Stack Secure Dashboard

A full-stack web application featuring secure user authentication, role-based access, and a protected dashboard with full CRUD (Create, Read, Update, Delete) capabilities. Built from scratch as a final year MCA project.

## ✨ Features

* **Secure Authentication:** User registration and login with encrypted passwords and stateless sessions using JSON Web Tokens (JWT).
* **Protected Routes:** Custom backend middleware to verify tokens and secure API endpoints.
* **CRUD Operations:** Authenticated users can create, read, update, and delete their own dashboard items.
* **Relational Database:** MySQL database with strict foreign key constraints linking items to specific users.
* **Modern Frontend:** Lightning-fast React Single Page Application (SPA) built with Vite and React Router.
* **Responsive UI:** Clean, modern interface styled utilizing the brand new Tailwind CSS v4.

## 🛠️ Technology Stack & Dependencies

### **Frontend**
* **Framework:** React.js (via Vite)
* **Routing:** `react-router-dom` (v6)
* **HTTP Client:** `axios`
* **Styling:** `tailwindcss` (v4), `@tailwindcss/vite`

### **Backend**
* **Runtime:** Node.js
* **Framework:** `express`
* **Database Driver:** `mysql2`
* **Security:** `jsonwebtoken` (JWT), `bcrypt` (Password Hashing), `cors` (Cross-Origin Resource Sharing)
* **Environment:** `dotenv`
* **Development:** `nodemon`

---

## 📦 Prerequisites

Before running this project, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MySQL Server](https://dev.mysql.com/downloads/installer/) & MySQL Workbench

---

## 🚀 Installation & Setup Guide

Follow these exact steps to set up the project on your local machine.

### 1. Database Setup
1. Open MySQL Workbench.
2. Open and execute the provided `database.sql` file to automatically create the `mem_auth_db` database, the `users` table, and the `items` table.

### 2. Backend Setup
Open a terminal, navigate to the backend folder, and install the dependencies:
```bash
cd backend

# Install core backend dependencies
npm install express dotenv cors mysql2 jsonwebtoken bcrypt

# Install development dependencies
npm install -D nodemon