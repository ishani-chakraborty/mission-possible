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

	let scenarios = [];
	let list_to_save = scenarios;
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

	let node_names = [];
	let list_to_sav = node_names;
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
	const OnChangeSelectedOptionGraph = (selectedOption) => {
		console.log("handle change", selectedOption);
		setGraph(selectedOption.value);
		console.log("Now displaying graph: ", curGraph);
	};

	const showDropGraph = () => {
		// make these elements visisble, set the default graph
		document.getElementsByClassName("graph_dropdowns")[0].style.display =
			"block";
		document.getElementsByClassName("graph_headers")[0].style.display =
			"block";
		setGraph(default_graph);
	};

	const pad = (s) =>{
		// If s is less than 2 charcters long, pad the start with '0'
		return s.toString().padStart(2, '0');
	}

	const onChangeDateSelection = (selectedOption) => {
		// console.log(toGMT(selectedOption[0]));
		let start = toGMT(selectedOption[0])
		let end = toGMT(selectedOption[1])
		let s = start.getFullYear() +"-"+ pad(start.getMonth()) +"-"+ pad(start.getDate())+" "+ pad(start.getHours())
		let e = end.getFullYear() +"-"+ pad(end.getMonth()) +"-"+ pad(end.getDate())+" "+ pad(end.getHours())
		console.log(s,e);
		
	}	

	const toGMT = (date) => {
        var gmt = date.toUTCString()
        // console.log(new Date( gmt));
        return new Date(gmt);
    } 

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
						onChange = {onChangeDateSelection}
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
						loadOptions={loadOptions(scenarios)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
				<li>
					<AsyncSelect
						loadOptions={loadOptions(scenarios)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
				<li>
					<AsyncSelect
						loadOptions={loadOptions(node_names)}
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

			<button className="button" onClick={showDropGraph}>
				Create Graphs
			</button>

			<ul className="graph_headers">
				<li>Graph Type</li>
			</ul>
			<ul className="graph_dropdowns">
				<li>
					<AsyncSelect
						onChange={OnChangeSelectedOptionGraph}
						loadOptions={loadOptions(graphs)}
						defaultOptions
						defaultInputValue={default_graph}
						placeholder="- Select -"
						isClearable
					/>
				</li>
			</ul>


			{/* data should be a json, containing the fields:
					"metric"        : str,
					"scenario_name" : str,
					"base_case"           : list[ json ],
					"scenario_to_compare" : list[ json ]

				where json contains the fields
					metric - the value specified by "metric" (notice the difference in quotes)
					"PERIOD_ID"  : str
					"PNODE_NAME" : str 
				View Scatter.js for more details
			*/}
			<ul className="scatter">
				{/* Conditionally render scatter plot */}
				{curGraph === "scatter" && <Scatter data="hi"></Scatter>}
			</ul>
			<ul className="histogram">
				{/* Conditionally render histogram */}
				{curGraph === "histogram" && <Histogram data="hi"></Histogram>}
			</ul>
			<ul className="heatmap">
				{/* Conditionally render heatmap */}
				{curGraph === "heatmap" && <Heatmap data="hi"></Heatmap>}
			</ul>
		</>
	);
}
