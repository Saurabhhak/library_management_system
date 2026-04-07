const pool = require("../../config/db");
// GET all states
const getStates = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM states ORDER BY name",
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch states",
    });
  }
};
// GET cities by state
const getCitiesByState = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM cities WHERE state_id = $1 ORDER BY name",
      [req.params.stateId],
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
    });
  }
};

module.exports = {
  getStates,
  getCitiesByState,
};
