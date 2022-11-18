require("dotenv").config();
const mysql = require("mysql");
const express = require("express");
const router = express.Router();

const { Pool } = require("pg");
const credentials = {
	user: process.env.API_USER,
	host: process.env.API_HOST,
	database: process.env.API_DATABASE,
	password: process.env.API_PASSWORD,
	port: process.env.API_PORT,
};

const pool = new Pool(credentials);

router.get("/:id", (req, res) => {
	pool.query(`SELECT * from "${req.params.id}"`)
		.then((result) => res.send(result.rows))
		.catch((err) => res.send(err.message));
});

router.get("/:id/:scenario", (req, res) => {
	pool.query(
		`SELECT * from "${req.params.id}" WHERE "SCENARIO_ID"=${req.params.scenario}`
	)
		.then((result) => res.send(result.rows))
		.catch((err) => res.send(err.message));
});

router.get("/:id/:pnode_name", (req, res) => {
	pool.query(
		`SELECT * from "${req.params.id}" WHERE "PNODE_NAME"=${req.params.pnode_name}`
	)
		.then((result) => res.send(result.rows))
		.catch((err) => res.send(err.message));
});

module.exports = router;
