const express = require("express");
const router = express.Router();

const Productrouter = require("./product_route");
const HealthRouter = require("./health");
const WelcomeRouter = require("./welcome");
const CategoryRouter = require("./categories");
const AuthRouter = require("./auth");

router.use("/api/product", Productrouter);
router.use("/api/auth", AuthRouter);

router.use("/", WelcomeRouter);
router.use("/api", CategoryRouter);
router.use("/health", HealthRouter);

module.exports = router;
