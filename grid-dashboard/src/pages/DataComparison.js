import AsyncSelect from "react-select/async";
import "./dc_styles.css";
import { DateRangePicker } from "rsuite";
// import * as dbInterface from "../DatabaseInterface.js";
import * as api_calls from "../api_calls.js";
import Scatter from "../graphs/Scatter";
import Heatmap from "../graphs/Heatmap";
import Histogram from "../graphs/Histogram";

import React, { useState } from "react";

export default function DataComparison() {
	// Define react hooks to save info from the dropdowns

	// This info is used in the data query
	const [curStartDate, setStartDate] = useState(null);
	const [curEndDate, setEndDate] = useState(null);
	const [curBaseCase, setBaseCase] = useState(null);
	const [curScenario, setScenario] = useState(null);
	const [curNode, setNode] = useState(null);
	const [curMetric, setMetric] = useState(null);

	// This info is used for graphing
	const [curGraph, setGraph] = useState(null);
	const [curData, setData] = useState(null); // change this to null
	const default_graph = "scatter";

	// let my_json = [];
	// fetch("http://localhost:3001/api/Scenarios")
	// 	.then((response) => response.json())
	// 	.then((data) => {
	// 		my_json = data;
	// 		// console.log(my_json);
	// 	});
	// console.log(my_json);

	let scenarios = [];
	api_calls
		.populateDropdown(
			scenarios,
			"http://localhost:3001/api/Scenarios",
			"SCENARIO_ID",
			"SCENRAIO_NAME"
		)
		.catch((error) => {
			console.error(error);
		});

	let node_names = [];
	api_calls
		.populateDropdown(
			node_names,
			"http://localhost:3001/api/Node_Data",
			"PNODE_NAME",
			"PNODE_NAME"
		)
		.catch((error) => {
			console.error(error);
		});

	// const response = fetch("http://localhost:3001/api/Scenarios");
	// const my_json = response.json();
	// console.log(my_json);

	// Define where we store the data (ex. names stores the names of geysers)
	// let scenario_names = [];

	// let namess = fetch("api/Scenarios");
	// console.log(namess.json());

	let metrics = [
		{ value: "LMP", label: "LMP" },
		{ value: "MW", label: "MW" },
	];

	const graphs = [
		{ value: "scatter", label: "Scatter" },
		{ value: "heatmap", label: "Heatmap" },
		{ value: "histogram", label: "Histogram" },
	];

	const scenarioIdToName = (ID) => {
		let label = ID;
		scenarios.forEach((entry) => {
			if (entry.value === ID) {
				label = entry.label;
			}
		});
		return label;
	};

	// populate the dropdown lists
	// Use a specific REST CALL to get a list of the geysers, saving their names
	// let query = "/geysers";
	// let list_to_save_to = scenario_names;
	// dbInterface.getGeyserInfo(query, list_to_save_to).catch((error) => {
	// 	console.error(error);
	// });

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

	// Change a react-hook when a dropdown value changes
	const OnChangeReactHook = (setFunction) => {
		return (selectedOption) => {
			console.log("handle react-hook change", selectedOption);
			if (selectedOption === null) {
				setFunction(null);
			} else {
				setFunction(selectedOption.value);
			}
		};
	};

	const createGraph = async () => {
		console.log("pushed");

		// Validate that the "base case", "scenario", and "metric" have been chosen
		let err_msg = "";
		if (curBaseCase === null) {
			err_msg += '"Scenario 1" must be specified to generate a graph.\n';
		}
		if (curScenario === null) {
			err_msg += '"Scenario 2" must be specified to generate a graph.\n';
		}
		// if (curNode === null) {
		// 	err_msg += '"Node Name" must be specified to generate a graph.\n';
		// }
		if (curMetric === null) {
			err_msg += '"Metric" must be specified to generate a graph.\n';
		}

		if (err_msg !== "") {
			// console.log(err_msg);
			window.alert(err_msg);
			return;
		}

		// Only if the required fields have been selected will we get here
		// Make a REST api call to get the data, returning a JSON
		await api_calls
			.updateData(
				setData,
				curBaseCase,
				curScenario,
				curMetric,
				curNode,
				curStartDate,
				curEndDate,
				scenarioIdToName
			)
			.catch((error) => {
				console.error(error);
			});

		// Finally, if the graph isn't visible make sure it is
		if (curGraph === null) {
			// make these elements visisble, set the default graph
			document.getElementsByClassName(
				"graph_dropdowns"
			)[0].style.display = "block";
			document.getElementsByClassName("graph_headers")[0].style.display =
				"block";
		}
		setGraph(default_graph);
	};

	const onChangeDateSelection = (selectedOption) => {
		// console.log(toGMT(selectedOption[0]));
		if (selectedOption !== null && selectedOption !== undefined) {
			let start = toGMT(selectedOption[0]);
			let end = toGMT(selectedOption[1]);
			let s =
				start.getFullYear() +
				"-" +
				pad(start.getMonth() + 1) +
				"-" +
				pad(start.getDate()) +
				" " +
				pad(start.getHours());
			let e =
				end.getFullYear() +
				"-" +
				pad(end.getMonth() + 1) +
				"-" +
				pad(end.getDate()) +
				" " +
				pad(end.getHours());
			// console.log(s,e);
			setStartDate(s);
			setEndDate(e);
			console.log(s);
			console.log(e);
		} else {
			setStartDate(null);
			setEndDate(null);
		}
	};

	const pad = (s) => {
		// If s is less than 2 charcters long, pad the start with '0'
		return s.toString().padStart(2, "0");
	};

	const toGMT = (date) => {
		var gmt = date.toUTCString();
		// console.log(new Date(gmt));
		return new Date(gmt);
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
						onChange={onChangeDateSelection}
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
						onChange={OnChangeReactHook(setBaseCase)}
						loadOptions={loadOptions(scenarios)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
				<li>
					<AsyncSelect
						onChange={OnChangeReactHook(setScenario)}
						loadOptions={loadOptions(scenarios)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
				<li>
					<AsyncSelect
						onChange={OnChangeReactHook(setNode)}
						loadOptions={loadOptions(node_names)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
				<li>
					<AsyncSelect
						onChange={OnChangeReactHook(setMetric)}
						loadOptions={loadOptions(metrics)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
			</ul>

			{/* createGraph */}
			<button className="button" onClick={createGraph}>
				Create Graphs
			</button>

			<ul className="graph_headers">
				<li>Graph Type</li>
			</ul>
			<ul className="graph_dropdowns">
				<li>
					<AsyncSelect
						onChange={OnChangeReactHook(setGraph)}
						loadOptions={loadOptions(graphs)}
						defaultOptions
						defaultInputValue={default_graph}
						placeholder="- Select -"
						isClearable
					/>
				</li>
			</ul>

			{/* Conditionally render only one graph */}
			{/* data should be a json, containing the fields:
					"metric"        : str,
					"scenario_name" : str,
					"base_case"           : list[ json ],
					"scenario_to_compare" : list[ json ]

				where json contains the fields
					metric (name specified by "metric", notice the difference in quotes) : float
					"PERIOD_ID"  : str
					"PNODE_NAME" : str 
				View Scatter.js for more details
			*/}
			<ul className="scatter">
				{curGraph === "scatter" && <Scatter data={curData}></Scatter>}
			</ul>
			<ul className="histogram">
				{curGraph === "histogram" && (
					<Histogram data={curData}></Histogram>
				)}
			</ul>
			<ul className="heatmap">
				{curGraph === "heatmap" && <Heatmap data={curData}></Heatmap>}
			</ul>
		</>
	);
}
