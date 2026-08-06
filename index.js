require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();
const ApiRouter = require("./routes/index");

app.use(express.json());
app.use(cors());

app.use("/", ApiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server run on port ${PORT} \nOn ${new Date(Date.now()).toString()}`,
  );
});
