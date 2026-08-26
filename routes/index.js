const express = require("express");
const router = express.Router();

const Productrouter = require("./product_route");
const HealthRouter = require("./health");
const WelcomeRouter = require("./welcome");
const CategoryRouter = require("./categories");
const AuthRouter = require("./auth");
const UploadRouter = require("./upload_route");
const ProfileRouter = require("./profile_route");

router.use("/api/products", Productrouter);
router.use("/api/auth", AuthRouter);
router.use("/api/upload", UploadRouter);
router.use("/api/profile", ProfileRouter);

router.use("/", WelcomeRouter);
router.use("/api", CategoryRouter);
router.use("/health", HealthRouter);


module.exports = router;
