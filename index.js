require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();
const ApiRouter = require("./routes/index");

const path = require("path");

app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", ApiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server run on port ${PORT} \nOn ${new Date(Date.now()).toString()}`,
  );
});
