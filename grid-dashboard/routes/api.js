const mysql = require("mysql");
const express = require("express");
const router = express.Router();

const { Pool } = require("pg");
const credentials = {
	user: "postgres",
	host: "iso-db.ctyl0757wfse.us-east-1.rds.amazonaws.com",
	database: "ISO_NE_DB",
	password: "Tomcruise2022",
	port: 5432,
};

const pool = new Pool(credentials);

router.get("/:id", (req, res) => {
	pool.query(`SELECT * from "${req.params.id}"`)
		.then((result) => res.send(result.rows))
		.catch((err) => console.log(err));
});

router.get("/:id/:scenario", (req, res) => {
	pool.query(
		`SELECT * from "${req.params.id}" WHERE "SCENARIO_ID"=${req.params.scenario}`
	)
		.then((result) => res.send(result.rows))
		.catch((err) => console.log(err));
});

router.get("/:id/:pnode_name", (req, res) => {
	pool.query(
		`SELECT * from "${req.params.id}" WHERE "PNODE_NAME"=${req.params.pnode_name}`
	)
		.then((result) => res.send(result.rows))
		.catch((err) => console.log(err));
});

module.exports = router;
