const express = require("express");
const router = express.Router();

const Productrouter = require("./product_route");
const HealthRouter = require("./health");
const WelcomeRouter = require("./welcome");

router.use("/api/product", Productrouter);

router.use("/", WelcomeRouter);
router.use("/health", HealthRouter);

module.exports = router;
