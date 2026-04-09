const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const db = require("./db");

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
        const email = profile.emails[0].value.toLowerCase().trim();
        const googleId = profile.id;
        const firstName = profile.name?.givenName || "";
        const lastName = profile.name?.familyName || "";
        const state = req.query.state || "";

        /* ══════════════════════════════════════════════════════════
           CASE 1 — BOOTSTRAP
           First-time setup: create the very first superadmin.
           Only allowed when NO superadmin exists at all.
           ══════════════════════════════════════════════════════════ */
        if (state === "BOOTSTRAP") {
          // Double-check no superadmin exists (race condition safety)
          const existing = await db.query(
            `SELECT id FROM admin
             WHERE role = 'superadmin' AND is_deleted = false LIMIT 1`,
          );

          if (existing.rows.length > 0) {
            return done(null, false, {
              message: "Bootstrap already complete. Use normal login.",
            });
          }

          // Check if this Google email already exists as any admin
          const emailCheck = await db.query(
            `SELECT * FROM admin WHERE LOWER(email) = $1 AND is_deleted = false`,
            [email],
          );

          let admin;

          if (emailCheck.rows.length > 0) {
            // Promote existing record to superadmin
            const updated = await db.query(
              `UPDATE admin
               SET role                = 'superadmin',
                   google_id           = $1,
                   is_active           = true,
                   is_verified         = true,
                   is_profile_complete = true,
                   first_name          = COALESCE(NULLIF(first_name,''), $2),
                   last_name           = COALESCE(NULLIF(last_name,''), $3),
                   updated_at          = NOW()
               WHERE LOWER(email) = $4
               RETURNING *`,
              [googleId, firstName, lastName, email],
            );
            admin = updated.rows[0];
          } else {
            // Create brand new superadmin from Google profile
            const inserted = await db.query(
              `INSERT INTO admin
                 (first_name, last_name, email, google_id, role,
                  is_active, is_verified, is_profile_complete, is_deleted)
               VALUES ($1, $2, $3, $4, 'superadmin', true, true, true, false)
               RETURNING *`,
              [firstName, lastName, email, googleId],
            );
            admin = inserted.rows[0];
          }

          return done(null, admin);
        }

        /* ══════════════════════════════════════════════════════════
           CASE 2 — SUPERADMIN_LOGIN
           Existing admin logs in with Google.
           ══════════════════════════════════════════════════════════ */
        if (state === "SUPERADMIN_LOGIN") {
          const result = await db.query(
            `SELECT * FROM admin
             WHERE LOWER(email) = $1 AND is_deleted = false`,
            [email],
          );

          if (!result.rows.length) {
            return done(null, false, {
              message: "No admin account found for this Google email.",
            });
          }

          const admin = result.rows[0];

          if (!admin.is_active) {
            return done(null, false, {
              message: "Your account is inactive. Contact the SuperAdmin.",
            });
          }

          // Save google_id on first Google login
          if (!admin.google_id) {
            await db.query(
              `UPDATE admin SET google_id=$1, updated_at=NOW() WHERE id=$2`,
              [googleId, admin.id],
            );
          }

          return done(null, { ...admin, google_id: googleId });
        }

        /* ══════════════════════════════════════════════════════════
           CASE 3 — INVITE TOKEN
           Invited admin accepts invite via Google.
           ══════════════════════════════════════════════════════════ */
        const inviteToken = state;

        if (!inviteToken) {
          return done(null, false, { message: "Missing invite token." });
        }

        const inviteResult = await db.query(
          `SELECT * FROM admin
           WHERE invite_token = $1
             AND invite_token_expiry > NOW()
             AND is_deleted = false`,
          [inviteToken],
        );

        if (!inviteResult.rows.length) {
          return done(null, false, {
            message: "Invite link is invalid or has expired.",
          });
        }

        const invited = inviteResult.rows[0];

        // The Google email must exactly match the invited email
        if (invited.email !== email) {
          return done(null, false, {
            message: `Please sign in with ${invited.email} — that is the email this invite was sent to.`,
          });
        }

        // Activate the invited admin
        const updated = await db.query(
          `UPDATE admin
           SET google_id           = $1,
               is_active           = true,
               is_verified         = true,
               invite_token        = NULL,
               invite_token_expiry = NULL,
               updated_at          = NOW()
           WHERE id = $2
           RETURNING *`,
          [googleId, invited.id],
        );

        return done(null, updated.rows[0]);
      } catch (err) {
        console.error("[GoogleStrategy] Error:", err);
        return done(err);
      }
    },
  ),
);

module.exports = passport;

// const passport = require("passport");
// const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
// const db = require("./db");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
//       passReqToCallback: true,
//     },
//     async (req, accessToken, refreshToken, profile, done) => {
//       try {
//         const email = profile.emails[0].value.toLowerCase().trim();
//         const googleId = profile.id;
//         const state = req.query.state || "";

//         // /* ── SUPERADMIN Google Login ─────────────────────────── */
//         // if (state === "SUPERADMIN_LOGIN") {
//         //   const result = await db.query(
//         //     `SELECT * FROM admin
//         //      WHERE LOWER(email) = $1
//         //        AND is_deleted = false`,
//         //     [email],
//         //   );

//         //   if (!result.rows.length) {
//         //     return done(null, false, {
//         //       message: "No admin account found for this Google email",
//         //     });
//         //   }

//         //   const admin = result.rows[0];

//         //   if (!admin.is_active) {
//         //     return done(null, false, {
//         //       message: "Account is inactive. Contact SuperAdmin.",
//         //     });
//         //   }

//         //   // Save google_id on first Google login
//         //   if (!admin.google_id) {
//         //     await db.query(
//         //       `UPDATE admin
//         //        SET google_id = $1, updated_at = NOW()
//         //        WHERE id = $2`,
//         //       [googleId, admin.id],
//         //     );
//         //   }

//         //   return done(null, { ...admin, google_id: googleId });
//         // }
//         const superAdminCheck = await db.query(
//           `SELECT id FROM admin WHERE role='superadmin' AND is_deleted=false`,
//         );

//         const isFirstUser = superAdminCheck.rows.length === 0;

//         // FIRST USER → AUTO CREATE SUPERADMIN
//         if (state === "SUPERADMIN_LOGIN" && isFirstUser) {
//           const newAdmin = await db.query(
//             `INSERT INTO admin (
//         first_name,
//         last_name,
//         email,
//         google_id,
//         role,
//         is_active,
//         is_verified,
//         is_profile_complete,
//         is_deleted,
//         created_at
//      )
//      VALUES ($1,$2,$3,$4,'superadmin',true,true,false,false,NOW())
//      RETURNING *`,
//             [
//               profile.name.givenName,
//               profile.name.familyName,
//               email,
//               profile.id,
//             ],
//           );

//           return done(null, newAdmin.rows[0]);
//         }

//         /* ── INVITE Google Login ─────────────────────────────── */
//         const inviteToken = state;

//         if (!inviteToken) {
//           return done(null, false, { message: "Missing invite token" });
//         }

//         const inviteResult = await db.query(
//           `SELECT * FROM admin
//            WHERE invite_token = $1
//              AND invite_token_expiry > NOW()
//              AND is_deleted = false`,
//           [inviteToken],
//         );

//         if (!inviteResult.rows.length) {
//           return done(null, false, {
//             message: "Invalid or expired invite token",
//           });
//         }

//         const admin = inviteResult.rows[0];

//         // Invited email must match Google account email
//         if (admin.email !== email) {
//           return done(null, false, {
//             message: "Google account email does not match your invite email",
//           });
//         }

//         // Activate the admin account
//         const updated = await db.query(
//           `UPDATE admin
//            SET google_id           = $1,
//                is_active           = true,
//                is_verified         = true,
//                invite_token        = NULL,
//                invite_token_expiry = NULL,
//                updated_at          = NOW()
//            WHERE id = $2
//            RETURNING *`,
//           [googleId, admin.id],
//         );

//         return done(null, updated.rows[0]);
//       } catch (err) {
//         console.error("[GoogleStrategy] Error:", err);
//         return done(err);
//       }
//     },
//   ),
// );

// module.exports = passport;
