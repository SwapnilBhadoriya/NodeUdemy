const express = require("express");
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(require("../src/routers/user"));
app.use(require("../src/routers/task"));

module.exports = app;
