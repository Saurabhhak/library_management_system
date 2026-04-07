const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db");

/* ─────────────────────────────────────────────────────────────────
   Google OAuth Strategy
   callbackURL must be registered in Google Cloud Console:
     Dev  → http://localhost:5000/api/auth/google/callback
     Prod → https://lms-backend-td41.onrender.com/api/auth/google/callback
───────────────────────────────────────────────────────────────── */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();
        const state = req.query.state; // inviteToken  OR  "SUPERADMIN_LOGIN"

        let user;

        // ── SUPERADMIN LOGIN ──────────────────────────────────────
        if (state === "SUPERADMIN_LOGIN") {
          const result = await db.query(
            "SELECT * FROM admin WHERE email = $1 AND role = 'superadmin'",
            [email],
          );

          if (!result.rows.length) {
            return done(null, false, {
              message: "No superadmin account found for this Google email.",
            });
          }

          user = result.rows[0];

          // ── INVITE LOGIN ──────────────────────────────────────────
        } else {
          const result = await db.query(
            `SELECT * FROM admin
             WHERE email = $1
               AND invite_token = $2
               AND invite_token_expiry > NOW()`,
            [email, state],
          );

          if (!result.rows.length) {
            return done(null, false, {
              message: "Invalid or expired invite token.",
            });
          }

          user = result.rows[0];

          // Activate account, clear invite token
          await db.query(
            `UPDATE admin
             SET is_active            = true,
                 invite_token         = NULL,
                 invite_token_expiry  = NULL
             WHERE id = $1`,
            [user.id],
          );
        }

        return done(null, user);
      } catch (err) {
        console.error("[Passport Google] Error:", err);
        return done(err, null);
      }
    },
  ),
);

/* ── Session serialization (session: false in routes, but keep for safety) ── */
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM admin WHERE id = $1", [id]);
    done(null, result.rows[0] ?? null);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
