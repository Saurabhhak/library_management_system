// config/googleAuth.js

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const inviteToken = req.query.inviteToken;

        if (!inviteToken) return done(null, false);

        const user = await pool.query(
          "SELECT * FROM admin WHERE invite_token=$1",
          [inviteToken],
        );

        if (!user.rows.length) return done(null, false);

        const updated = await pool.query(
          `UPDATE admin
           SET google_id=$1,
               is_email_verified=true,
               is_active=true,
               invite_token=NULL
           WHERE id=$2
           RETURNING *`,
          [profile.id, user.rows[0].id],
        );

        return done(null, updated.rows[0]);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
module.exports = passport;
