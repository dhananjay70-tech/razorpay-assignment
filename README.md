# 💳 Razorpay Backend Assignment – Reimbursement Management System

A scalable **Role-Based Reimbursement Management System** built using **Node.js**, **Express.js**, **PostgreSQL**, and **Drizzle ORM**. The application implements secure authentication, authorization, and a complete reimbursement approval workflow for different organizational roles.

> **🌐 Live Demo:** https://razorpay-assignment-ecru.vercel.app/

> **📂 GitHub Repository:** https://github.com/dhananjay70-tech/razorpay-assignment

---

# 🚀 Live Demo

Experience the deployed application here:

🔗 **https://razorpay-assignment-ecru.vercel.app/**

---

# 📖 About the Project

This project simulates a real-world reimbursement management platform where employees can submit reimbursement requests and designated authorities can review, approve, or reject them based on their organizational roles.

The system follows **Role-Based Access Control (RBAC)** to ensure users can only access features permitted by their assigned roles.

Every newly registered account is assigned the **EMP (Employee)** role by default. A **Chief Financial Officer (CFO)** has the authority to promote employees to:

* Reporting Manager (RM)
* Accounts Payable Executive (APE)
* Chief Financial Officer (CFO)

The application is designed using industry-standard backend development practices with secure authentication, authorization, modular architecture, and scalable REST APIs.

---

# ✨ Key Features

## 🔐 Authentication & Security

* Secure User Registration
* User Login & Logout
* JWT Authentication
* Password Hashing using bcrypt
* Protected REST APIs
* Secure Session Management

## 👤 Role-Based Access Control (RBAC)

* Employee (EMP)
* Reporting Manager (RM)
* Accounts Payable Executive (APE)
* Chief Financial Officer (CFO)

## 💰 Reimbursement Management

* Create Reimbursement Requests
* View Submitted Requests
* Multi-Level Approval Workflow
* Approve / Reject Requests
* Role-Based Access Permissions

## 📊 Dashboards

* Employee Dashboard
* Manager Dashboard
* Accounts Dashboard
* CFO Dashboard

## 🗄 Database

* PostgreSQL
* Drizzle ORM
* Database Migrations
* Relational Database Design

## ⚙ Backend Features

* RESTful API Architecture
* Modular MVC Structure
* Middleware-based Authentication
* Centralized Error Handling
* Request Validation
* Environment Configuration
* Clean Code Structure

---

# 🏗 Tech Stack

| Category          | Technology  |
| ----------------- | ----------- |
| Runtime           | Node.js     |
| Framework         | Express.js  |
| Database          | PostgreSQL  |
| ORM               | Drizzle ORM |
| Authentication    | JWT         |
| Password Security | bcrypt      |
| Environment       | dotenv      |
| Development       | Nodemon     |

---

# 🌍 Deployment

| Component | Platform   |
| --------- | ---------- |
| Frontend  | Vercel     |
| Backend   | Render     |
| Database  | PostgreSQL |

**Live URL**

https://razorpay-assignment-ecru.vercel.app/

---

# 📁 Project Structure

```text
Backend
│
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── db
│   ├── utils
│   └── server.js
│
├── package.json
├── .env
└── README.md
```

---

# 🔄 Workflow

```text
                 Register
                    │
                    ▼
             Employee (EMP)
                    │
                    ▼
      Submit Reimbursement Request
                    │
                    ▼
      Reporting Manager (RM)
          Approve / Reject
                    │
                    ▼
 Accounts Payable Executive (APE)
          Approve / Reject
                    │
                    ▼
     Chief Financial Officer (CFO)
            Final Approval
```

---

# 👥 User Roles

| Role | Permissions                                              |
| ---- | -------------------------------------------------------- |
| EMP  | Register, Login, Submit Reimbursement, View Own Requests |
| RM   | Review Employee Requests                                 |
| APE  | Verify Approved Requests                                 |
| CFO  | Manage Users, Promote Employees, Final Approval          |

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/dhananjay70-tech/razorpay-assignment.git
```

```bash
cd Backend
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env` file.

```env
PORT=7002

DATABASE_URL=postgresql://username:password@localhost:5432/database_name

JWT_SECRET=your_secret_key

NODE_ENV=development
```

---

## Run Database Migration

```bash
npm run migrate
```

---

## Start Development Server

```bash
npm run dev
```

Backend Server:

```
http://localhost:7002
```

---

# 🔐 Authentication APIs

## Register

```
POST /rest/onboardings/register
```

```json
{
  "name": "Dhananjay Kumar",
  "email": "dhan@gmail.com",
  "password": "123456"
}
```

---

## Login

```
POST /rest/onboardings/login
```

---

## Logout

```
POST /rest/onboardings/logout
```

---

## Current User Profile

```
GET /rest/onboardings/me
```

---

# 📌 Authentication

All protected APIs require a valid JWT access token.

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 📦 Available Scripts

```bash
npm install
```

Install project dependencies.

```bash
npm run dev
```

Run the development server.

```bash
npm start
```

Run the production server.

---

# 📈 Future Enhancements

* Email Notifications
* Bill / Invoice Upload
* Swagger API Documentation
* Docker Support
* Unit & Integration Testing
* Audit Logs
* Redis Caching
* Rate Limiting
* CI/CD Pipeline

---

# 🧪 API Testing

You can test all APIs using:

* Postman
* Thunder Client
* Insomnia

---

# 👨‍💻 Developer

**Dhananjay Kumar**

B.Tech – Computer Science & Engineering (AI & ML)

KR Mangalam University

**GitHub**

https://github.com/dhananjay70-tech

**LinkedIn**

https://linkedin.com/in/dhananjay-kumar-7a76052a7

---

# ⭐ Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub.
