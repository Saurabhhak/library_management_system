# 📚 APV Library Management System

A production-ready full-stack Library Management System with unified role-based authentication, DB-backed OTP verification, refresh token rotation, and modular clean architecture.

---

## 🚀 Features

### 🔐 Unified Auth System

- Single `/api/auth/*` route set for **admin and member both**
- Role-based login — `{ email, password, role }` → JWT access token
- **Access token** (15 min) + **Refresh token** (7 days, httpOnly cookie)
- Refresh token rotation — new token on every refresh call
- All active sessions revoked on password reset

### 📧 Email OTP Verification (SMTP — Nodemailer)

- OTP stored in **PostgreSQL** (`otp_verifications` table) — not in memory
- Supports two purposes: `registration` and `password_reset`
- Works for **admin and member** with a `role` field
- Auto-expiry (10 min) with DB-level cleanup function
- Sent via Gmail SMTP using Nodemailer

### 🛡 Role-Based Access Control

- Single `role.middleware.js` — replaces 4 separate middleware files
- Roles: `member` | `admin` | `superadmin`
- Usage: `role("admin", "superadmin")` — composable, reusable

### 👨‍💼 Admin Management

- Create / Update / Delete admin (superadmin protected)
- Online tracking — `last_seen`, `is_online` via heartbeat
- Soft delete (`is_deleted = true`)

### 👤 Member Management

- Public self-registration with OTP verification
- Admin-managed CRUD (status, membership dates, book limits)
- Soft delete support

### 🌍 Location

- Dynamic State & City dropdown
- Relational (PostgreSQL `states` + `cities` tables)

### 📚 Library Core

- Book & Category management
- Issue / Return tracking
- Feedback system
- Contact Us (dual email via Nodemailer)

---

## 🛠 Tech Stack

### 🎨 Frontend

| Library             | Use                                         |
| ------------------- | ------------------------------------------- |
| React 19            | UI framework                                |
| React Router DOM v7 | Routing                                     |
| Axios               | API calls                                   |
| TanStack Table      | Data tables with sort, filter, drag-reorder |
| Chart.js            | Dashboard visualizations                    |
| SweetAlert2         | Alerts & confirmations                      |
| Lucide React        | Icons                                       |
| Swiper              | Book slider                                 |

### ⚙️ Backend

| Library                 | Use                                        |
| ----------------------- | ------------------------------------------ |
| Node.js + Express       | Server                                     |
| PostgreSQL (Neon Cloud) | Database                                   |
| `pg`                    | PostgreSQL client                          |
| `jsonwebtoken`          | Access token (JWT)                         |
| `bcrypt`                | Password hashing                           |
| `cookie-parser`         | Refresh token (httpOnly cookie)            |
| `nodemailer`            | SMTP email (Gmail)                         |
| `crypto` (built-in)     | Refresh token generation + SHA-256 hashing |

### ☁️ Infrastructure

| Tool    | Use                           |
| ------- | ----------------------------- |
| Neon DB | Serverless PostgreSQL         |
| Render  | Backend + Frontend deployment |
| Postman | API testing                   |

---

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── auth/                        ← Unified auth (NEW)
│   │   ├── auth.controller.js       login, logout, refresh, profile, checkEmail
│   │   ├── otp.controller.js        sendOtp, verifyOtp (DB-backed)
│   │   └── password.controller.js   forgotPassword, resetPassword
│   ├── admin/
│   │   └── admin.controller.js      CRUD
│   └── member/
│       └── member.controller.js     CRUD
├── middleware/
│   ├── auth.middleware.js            JWT verify
│   └── role.middleware.js            role("admin","superadmin") — replaces 4 files
├── routes/
│   ├── index.js
│   ├── auth.routes.js               /api/auth/*  (unified)
│   ├── admin/admin.routes.js
│   └── member/member.routes.js
├── services/mail/
│   ├── mailer.js                    Nodemailer SMTP
│   └── templates.js                 Email HTML templates
├── utils/
│   ├── generateOtp.js
│   └── tokenUtils.js                Access + Refresh token helpers
└── server.js
```

---

## 🗺 API Routes

### Auth — `/api/auth/` (public + protected)

| Method | Route              | Auth   | Body                             |
| ------ | ------------------ | ------ | -------------------------------- |
| POST   | `/login`           | —      | `{ email, password, role }`      |
| POST   | `/refresh`         | cookie | —                                |
| POST   | `/logout`          | JWT    | —                                |
| GET    | `/profile`         | JWT    | —                                |
| POST   | `/check-email`     | —      | `{ email, role }`                |
| POST   | `/send-otp`        | —      | `{ email, role, purpose }`       |
| POST   | `/verify-otp`      | —      | `{ email, otp, role, purpose }`  |
| POST   | `/forgot-password` | —      | `{ email, role }`                |
| POST   | `/reset-password`  | —      | `{ email, otp, password, role }` |
| POST   | `/heartbeat`       | JWT    | —                                |

### Admin — `/api/admin/` (superadmin protected)

| Method | Route  | Role              |
| ------ | ------ | ----------------- |
| GET    | `/`    | admin, superadmin |
| POST   | `/`    | superadmin        |
| GET    | `/:id` | superadmin        |
| PUT    | `/:id` | superadmin        |
| DELETE | `/:id` | superadmin        |

### Members — `/api/members/`

| Method | Route  | Role                   |
| ------ | ------ | ---------------------- |
| POST   | `/`    | public (self-register) |
| GET    | `/`    | admin, superadmin      |
| PUT    | `/:id` | admin, superadmin      |
| DELETE | `/:id` | admin, superadmin      |

---

## 🗄 DB Migration

Run `migrations/001_auth_system.sql` on Neon DB before starting the server.

**What it does:**

- Adds `reset_otp`, `reset_otp_expiry`, `email_verified` to `members` table
- Creates `otp_verifications` table (DB-backed OTP — replaces in-memory Map)
- Creates `refresh_tokens` table (SHA-256 hashed, rotation + revocation support)
- Creates `cleanup_expired_tokens()` function (run via cron/pg_cron)

---

## ⚙️ Environment Variables

```env
# Server
PORT=5000
NODE_ENV=production
BACKEND_URL=https://your-backend.onrender.com
FRONTEND_URL=https://your-frontend.onrender.com

# Database
DATABASE_URL=postgresql://...

# Auth
JWT_SECRET=your_jwt_secret

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password     # Gmail App Password (not account password)
MAIL_FROM_NAME=APV Library

# Google OAuth (future scope)
GOOGLE_CLIENT_ID=...
```

> **Gmail setup:** Enable 2FA → Google Account → Security → App Passwords → Create one → use as `SMTP_PASS`

---

## 📦 Install & Run

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production
npm start
```

---

## 🔑 Token Flow

```
Login → accessToken (15min, in response) + refreshToken (7d, httpOnly cookie)
         ↓
     accessToken expires
         ↓
POST /api/auth/refresh → new accessToken + rotated refreshToken
         ↓
     Logout → refresh token revoked in DB + cookie cleared
```

---

## 📝 Notes

- `role` field is **required** on login, check-email, send-otp, verify-otp, forgot-password, reset-password
- Refresh tokens are stored as **SHA-256 hash** in DB — raw token never persisted
- Password reset revokes **all active sessions** for that user
- Admin `last_seen` / `is_online` tracked via `/heartbeat` (ping every 30s from frontend)
