const express = require("express");
const conn = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  const [result] = await conn.query(
    `SELECT current_date AS date, current_time AS time`,
  );

  res.status(200).json({
    success: true,
    message: "Welcome and Thankyou",
    date: result[0].date,
    time: result[0].time,
  });
});

module.exports = router;
