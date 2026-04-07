const express = require("express");
const router = express.Router();
const passport = require("passport");

/* ── Bug Fix #3: correct import path (was ../../controllers/admin/) ── */
const {
  loginAdmin,
  generateToken,
} = require("../../controllers/admin/auth.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const {
  checkEmailExists,
} = require("../../controllers/admin/checkEmailExists.controller");

// ─── GOOGLE INVITE LOGIN ──────────────────────────────────────────
// Called from AcceptInvite.jsx  →  /api/auth/google?inviteToken=xxx
router.get("/google", (req, res, next) => {
  const { inviteToken } = req.query;

  if (!inviteToken) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/login?error=invite_required`,
    );
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: inviteToken,
    session: false,
  })(req, res, next);
});

// ─── GOOGLE SUPERADMIN LOGIN ──────────────────────────────────────
router.get("/google/superadmin", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "SUPERADMIN_LOGIN",
    session: false,
  })(req, res, next);
});

// ─── GOOGLE CALLBACK ──────────────────────────────────────────────
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/google-success?token=${token}`);
  },
);

// ─── LOGIN ────────────────────────────────────────────────────────
router.post("/login", loginAdmin);

// ─── CHECK EMAIL ──────────────────────────────────────────────────
router.post("/check-email", checkEmailExists);

/* ── Bug Fix #4: complete-profile is served from admin.routes ──────
   Profile service calls PUT /admin/complete-profile
   So this route lives in admin.routes.js, not here.
   (Removed from auth.routes to avoid the /auth/complete-profile mismatch) */

module.exports = router;
