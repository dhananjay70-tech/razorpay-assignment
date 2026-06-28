# 💳 Razorpay Backend Assignment – Reimbursement Management System

A scalable **Role-Based Reimbursement Management System** built using **Node.js**, **Express.js**, **PostgreSQL**, and **Drizzle ORM**. The application implements secure authentication, authorization, and a complete reimbursement approval workflow for different organizational roles.

---

## 📖 About the Project

This project simulates a real-world reimbursement management platform where employees can submit reimbursement requests and designated authorities can review, approve, or reject them based on their roles.

The system follows **Role-Based Access Control (RBAC)** to ensure that every user has appropriate permissions throughout the reimbursement lifecycle.

New users are automatically assigned the **EMP (Employee)** role, while **CFO** users can promote employees to **Reporting Manager (RM)**, **Accounts Payable Executive (APE)**, or another **CFO**.

---

# ✨ Key Features

### 🔐 Authentication & Security
- Secure User Registration
- JWT-based Authentication
- Password Hashing using bcrypt
- Protected API Routes
- Secure Logout

### 👤 Role Based Access Control
- Employee (EMP)
- Reporting Manager (RM)
- Accounts Payable Executive (APE)
- Chief Financial Officer (CFO)

### 💰 Reimbursement Workflow
- Create Reimbursement Request
- View Submitted Requests
- Multi-level Approval Process
- Approve / Reject Requests
- Role-specific Access Control

### 📊 Dashboard
- Employee Dashboard
- Manager Dashboard
- CFO Dashboard
- Role-based API Responses

### 🗄 Database
- PostgreSQL
- Drizzle ORM
- Database Migrations
- Relational Database Design

### ⚙ Backend Features
- RESTful API Design
- Modular MVC Architecture
- Centralized Error Handling
- Request Validation
- Environment Configuration
- Clean Project Structure

---

# 🏗 Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Authentication | JWT |
| Password Encryption | bcrypt |
| Environment | dotenv |
| Development | Nodemon |

---

# 📁 Project Structure

```
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

```
               Register
                  │
                  ▼
             EMPLOYEE (EMP)
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
       Chief Financial Officer
           Final Decision
```

---

# 👥 User Roles

| Role | Permissions |
|------|-------------|
| EMP | Register, Login, Submit Reimbursement, View Own Requests |
| RM | Review Employee Requests |
| APE | Verify Approved Requests |
| CFO | Manage Users, Promote Roles, Final Approval |

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

## Configure Environment

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

Server:

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
    "name":"Dhananjay Kumar",
    "email":"dhan@gmail.com",
    "password":"123456"
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

## Current User

```
GET /rest/onboardings/me
```

---

# 📌 Authentication

All protected endpoints require a JWT.

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 📦 Available Scripts

```bash
npm install
```

Install dependencies.

```bash
npm run dev
```

Run development server.

```bash
npm start
```

Run production server.

---

# 📈 Future Improvements

- Email Notifications
- File Upload for Bills
- Audit Logs
- Admin Dashboard
- Docker Support
- Swagger Documentation
- Unit Testing
- CI/CD Pipeline
- Redis Caching
- Rate Limiting

---

# 🧪 API Testing

The APIs can be tested using:

- Postman
- Thunder Client
- Insomnia

---

# 👨‍💻 Developer

**Dhananjay Kumar**

B.Tech CSE (AI & ML)

KR Mangalam University

GitHub: https://github.com/dhananjay70-tech

---

# ⭐ If you found this project useful, consider giving it a Star!
