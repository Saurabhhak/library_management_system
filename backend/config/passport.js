const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;
        const firstName = profile.name.givenName || "";
        const lastName = profile.name.familyName || "";

        // ── Case 1: Already linked this Google account → login ──
        const byGoogle = await pool.query(
          "SELECT * FROM members WHERE google_id=$1 AND is_deleted=false",
          [googleId],
        );
        if (byGoogle.rows.length) return done(null, byGoogle.rows[0]);

        // ── Case 2: Email already exists → link Google ID ──
        const byEmail = await pool.query(
          "SELECT * FROM members WHERE email=$1 AND is_deleted=false",
          [email],
        );
        if (byEmail.rows.length) {
          const updated = await pool.query(
            `UPDATE members SET google_id=$1, is_email_verified=true WHERE email=$2 RETURNING *`,
            [googleId, email],
          );
          return done(null, updated.rows[0]);
        }

        // ── Case 3: New user → create account ──
        const newUser = await pool.query(
          `INSERT INTO members (first_name, last_name, email, google_id, is_email_verified, status)
           VALUES ($1,$2,$3,$4,true,'active') RETURNING *`,
          [firstName, lastName, email, googleId],
        );
        return done(null, newUser.rows[0]);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
