# 🚀 MERN Stack Secure Dashboard (MySQL Edition)

A professional, production-ready full-stack application featuring a secure authentication system, role-based access control, and a data management dashboard with full CRUD operations. [cite_start]Built as a Final Year MCA project for the CampusPe Full Stack Assignment[cite: 1, 3, 8].

## ✨ Features

* [cite_start]**Advanced Authentication:** User registration, login with JWT, and "Remember Me" functionality[cite: 58, 60, 85].
* [cite_start]**Secure Password Reset:** Integrated password recovery flow using `nodemailer` and temporary reset tokens[cite: 61, 86, 87].
* [cite_start]**Global State Management:** React Context API and custom `useAuth` hook for centralized session handling[cite: 17, 105, 106].
* [cite_start]**Route Protection:** implementation of `ProtectedRoute` and `PublicRoute` to guard sensitive data and auth pages[cite: 108, 109].
* [cite_start]**Dashboard Statistics:** Real-time calculation of Total, Active, Pending, and Completed tasks[cite: 70, 92].
* [cite_start]**Full CRUD Operations:** Create, Read, Update (with status dropdown), and Delete functionality with confirmation dialogs[cite: 63, 64, 94, 95, 96, 97].
* [cite_start]**Security First:** SQL Injection prevention via parameterized queries, password hashing with `bcryptjs`, and Axios interceptors for token injection[cite: 23, 76, 101, 247].

## 🛠️ Tech Stack

### [cite_start]Frontend [cite: 12]
* [cite_start]**Framework:** React.js (Vite) [cite: 13, 79]
* [cite_start]**State:** React Context API [cite: 17, 105]
* [cite_start]**Styling:** Tailwind CSS v4 [cite: 16, 81]
* **Icons:** Lucide React
* [cite_start]**HTTP Client:** Axios (with Interceptors) [cite: 15, 99]

### [cite_start]Backend [cite: 18]
* [cite_start]**Runtime:** Node.js & Express.js [cite: 19, 20]
* [cite_start]**Database:** MySQL (Relational) [cite: 21, 22]
* [cite_start]**Auth:** JSON Web Tokens (JWT) & bcryptjs [cite: 23, 24]
* [cite_start]**Email:** Nodemailer [cite: 25]

---

## 📦 Installation & Setup

### [cite_start]1. Database Setup [cite: 273]
1.  [cite_start]Open MySQL Workbench[cite: 358].
2.  [cite_start]Execute the provided `database.sql` script to create the `mern_auth_db` and required tables with proper indexes and foreign keys[cite: 36, 119, 207].

### [cite_start]2. Backend Configuration [cite: 282]
1.  Navigate to the `/backend` folder.
2.  Install dependencies:
    ```bash
    npm install express mysql2 bcryptjs jsonwebtoken dotenv cors nodemailer
    
http://googleusercontent.com/immersive_entry_chip/0
http://googleusercontent.com/immersive_entry_chip/1
http://googleusercontent.com/immersive_entry_chip/2


**Jayanth C** * Final Year MCA Student
* [https://www.linkedin.com/in/jayanthc18/]
* [(https://github.com/JayanthC6)]

---
*This project was built to demonstrate proficiency in full-stack architecture, relational database design, and modern REST API security practices.*