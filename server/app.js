if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use(require("./routers"));
app.use(errorHandler);

module.exports = app;
