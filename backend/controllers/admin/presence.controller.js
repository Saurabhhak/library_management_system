// controllers/admin/presence.controller.js
const markOnline = async (req, res) => {
  const adminId = req.user.id; // from auth middleware

  await pool.query(
    `UPDATE admin SET is_online = true, last_seen = NOW() WHERE id=$1`,
    [adminId]
  );

  res.json({ success: true });
};