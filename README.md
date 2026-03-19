📚 Library Management System (Production Ready)

A full-stack Library Management System with secure authentication, OTP-based email verification, and role-based admin control.

🚀 Features

🔐 JWT Authentication

Secure login system

Token-based session handling

📧 Email OTP Verification

OTP sent via Brevo (Sendinblue)

Required before admin creation

Resend timer & validation included

🛡 Role-Based Access Control

Admin

Super Admin (restricted operations)

👨‍💼 Admin Management

Create Admin (with OTP verification)

Update / Delete Admin

Superadmin protection (cannot delete)

🌍 Location Management

Dynamic State & City dropdown

Relational DB (PostgreSQL)

📚 Scalable Architecture

RESTful APIs

Modular services

Clean separation (Controller / Service / UI)

🛠 Tech Stack
🎨 Frontend

JavaScript (ES6+)

React.js (v19)

React Router DOM (v7)

Axios (API calls)

Lucide React (icons)

SweetAlert2 (alerts)

React Table (TanStack) (data table)

FontAwesome (icons)

⚙️ Backend

Node.js

Express.js

PostgreSQL (Neon Cloud DB)

JWT (Authentication)

bcrypt (password hashing)

☁️ Services & Tools

Neon DB → Cloud PostgreSQL

Brevo (Sendinblue) → Email OTP service

Render → Deployment

Postman → API Testing

📦 Dependencies (Key)
Frontend

axios → API communication

react-router-dom → routing

jwt-decode → token decoding

lucide-react → icons

sweetalert2 → notifications

Backend

bcrypt → password hashing

jsonwebtoken → auth tokens

pg → PostgreSQL client

resend / brevo → email service


