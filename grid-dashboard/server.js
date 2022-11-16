const mysql = require("mysql");
const express = require("express");
const app = express();

app.use(express.json());

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

app.listen(3001, () => console.log("Server Started"));
