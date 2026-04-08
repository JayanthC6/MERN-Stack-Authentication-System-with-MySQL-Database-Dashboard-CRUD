# 🚀 MERN Stack Secure Dashboard

A full-stack web application featuring secure user authentication, role-based access, and a protected dashboard with full CRUD (Create, Read, Update, Delete) capabilities. Built from scratch as a final year MCA project.

## ✨ Features

* **Secure Authentication:** User registration and login with encrypted passwords (bcrypt) and stateless sessions using JSON Web Tokens (JWT).
* **Protected Routes:** Custom backend middleware to verify tokens and secure API endpoints.
* **CRUD Operations:** Authenticated users can create, read, update, and delete their own dashboard items.
* **Relational Database:** MySQL database with strict foreign key constraints linking items to specific users.
* **Modern Frontend:** Lightning-fast React Single Page Application (SPA) built with Vite and React Router.
* **Responsive UI:** Clean, modern interface styled utilizing the brand new Tailwind CSS v4.

## 🛠️ Technology Stack

**Frontend**
* React.js (Vite)
* Tailwind CSS v4
* Axios
* React Router DOM

**Backend**
* Node.js
* Express.js
* MySQL (Relational Database)
* JSON Web Tokens (JWT)
* CORS

## 📦 Prerequisites

Before running this project, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MySQL Server](https://dev.mysql.com/downloads/installer/) & MySQL Workbench

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### 1. Database Setup
1. Open MySQL Workbench.
2. Open and execute the provided `database.sql` file to automatically create the `mem_auth_db` database, the `users` table, and the `items` table.

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend