const express = require("express");
const router = express.Router();
const passport = require("passport");
const { loginAdmin, generateToken } = require("../../controllers/admin/auth.controller");
const { checkEmailExists } = require("../../controllers/admin/checkEmailExists.controller");
const { checkBootstrap, bootstrapGuard } = require("../../controllers/bootstrap.controller");

// Bootstrap check
router.get("/bootstrap/check", checkBootstrap);

// Bootstrap Google OAuth (with browser-friendly guard)
router.get("/bootstrap/google", bootstrapGuard, (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "BOOTSTRAP",
    session: false,
  })(req, res, next);
});

// Invited admin Google OAuth
router.get("/google", (req, res, next) => {
  const { inviteToken } = req.query;

  if (!inviteToken) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=invite_required`);
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: inviteToken,
    session: false,
  })(req, res, next);
});

// Existing superadmin Google login
router.get("/google/superadmin", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "SUPERADMIN_LOGIN",
    session: false,
  })(req, res, next);
});

// ✅ Single callback — all three flows land here, differentiated by state
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/google-success?token=${token}`);
  }
);

router.post("/login", loginAdmin);
router.post("/check-email", checkEmailExists);

module.exports = router;