import AsyncSelect from "react-select/async";
import "./dc_styles.css";
import { DateRangePicker } from "rsuite";
import * as dbInterface from "../DatabaseInterface.js";
import * as testdb from "../testdb.js";
import Scatter from "../graphs/Scatter";
import Heatmap from "../graphs/Heatmap";
import Histogram from "../graphs/Histogram";

import React, { useState } from "react";

export default function DataComparison() {
	const [curGraph, setGraph] = useState(""); //react hook
	const default_graph = "scatter";
	// let my_json = [];
	// fetch("http://localhost:3001/api/Scenarios")
	// 	.then((response) => response.json())
	// 	.then((data) => {
	// 		my_json = data;
	// 		// console.log(my_json);
	// 	});
	// console.log(my_json);
	let listab = [];
	let list_to_save = listab;
	testdb
		.getGeyser(
			list_to_save,
			"http://localhost:3001/api/Scenarios",
			"SCENARIO_ID",
			"SCENRAIO_NAME"
		)
		.catch((error) => {
			console.error(error);
		});

	let lista = [];
	let list_to_sav = lista;
	testdb
		.getGeyser(
			list_to_sav,
			"http://localhost:3001/api/Node_Data",
			"SCENARIO_ID",
			"PNODE_NAME"
		)
		.catch((error) => {
			console.error(error);
		});
	// const response = fetch("http://localhost:3001/api/Scenarios");
	// const my_json = response.json();
	// console.log(my_json);
	// Define where we store the data (ex. names stores the names of geysers)
	let scenario_names = [];
	// let namess = fetch("api/Scenarios");
	// console.log(namess.json());

	let metrics = [
		{ value: "lmp", label: "LMP" },
		{ value: "mw", label: "MW" },
	];

	const graphs = [
		{ value: "scatter", label: "scatter" },
		{ value: "heatmap", label: "heatmap" },
		{ value: "histogram", label: "histogram" },
	];

	// populate the dropdown lists
	// Use a specific REST CALL to get a list of the geysers, saving their names
	let query = "/geysers";
	let list_to_save_to = scenario_names;
	dbInterface.getGeyserInfo(query, list_to_save_to).catch((error) => {
		console.error(error);
	});

	// Search a specific search list (source) for seachValue
	// Usable by AsyncSelect after specifying the source list
	const loadOptions = (source) => {
		return (searchValue, callback) => {
			setTimeout(() => {
				const filterOptions = source.filter((option) =>
					option.label
						.toLowerCase()
						.includes(searchValue.toLowerCase())
				);
				callback(filterOptions);
			}, 2000);
		};
	};

	// change which graph is displayed by using the react hook
	const OnChangeSelectedOption = (selectedOption) => {
		console.log("handle change", selectedOption);
		setGraph(selectedOption.value);
		console.log("Now displaying graph: ", curGraph);
	};

	const showDrop = () => {
		// make these elements visisble, set the default graph
		document.getElementsByClassName("graph_dropdowns")[0].style.display =
			"block";
		document.getElementsByClassName("graph_headers")[0].style.display =
			"block";
		setGraph(default_graph);
	};

	return (
		<>
			<h1 className="datacomp">Data Comparison</h1>
			<hr></hr>
			<h1 className="config">Configuration</h1>
			<hr></hr>
			<ul className="headers">
				<li>Date</li>
				<li>Scenario 1</li>
				<li>Scenario 2</li>
				<li>Node Name</li>
				<li>Metric</li>
			</ul>
			<ul className="dropdowns">
				<li>
					<DateRangePicker
						format="yyyy-MM-dd hh:mm aa"
						showMeridian
						defaultCalendarValue={[
							new Date("2022-02-01 00:00:00"),
							new Date("2022-05-01 23:59:59"),
						]}
					/>
				</li>
				<li>
					<AsyncSelect
						loadOptions={loadOptions(listab)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
				<li>
					<AsyncSelect
						loadOptions={loadOptions(listab)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
				<li>
					<AsyncSelect
						loadOptions={loadOptions(lista)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
				<li>
					<AsyncSelect
						loadOptions={loadOptions(metrics)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
			</ul>

			<button className="button" onClick={showDrop}>
				Create Graphs
			</button>

			<ul className="graph_headers">
				<li>Graph Type</li>
			</ul>
			<ul className="graph_dropdowns">
				<li>
					<AsyncSelect
						onChange={OnChangeSelectedOption}
						loadOptions={loadOptions(graphs)}
						defaultOptions
						defaultInputValue={default_graph}
						placeholder="- Select -"
						isClearable
					/>
				</li>
			</ul>

			<ul className="scatter">
				{/* Conditionally render scatter plot */}
				{curGraph === "scatter" && <Scatter></Scatter>}
			</ul>
			<ul className="histogram">
				{/* Conditionally render histogram */}
				{curGraph === "histogram" && <Histogram></Histogram>}
			</ul>
			<ul className="heatmap">
				{/* Conditionally render heatmap */}
				{curGraph === "heatmap" && <Heatmap></Heatmap>}
			</ul>
		</>
	);
}
