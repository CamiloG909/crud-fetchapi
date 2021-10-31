const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

require("./database");

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(require("./routes/index.routes"));

module.exports = app;
