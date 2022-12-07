const mysql = require("mysql");
const express = require("express");
const app = express();

app.use(function (req, res, next) {
	express.json();
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

app.listen(3001, () => console.log("Server Started"));
