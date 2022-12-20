import AsyncSelect from "react-select/async";
import "./ss_styles.css";
import * as api_calls from "../api_calls.js";
import React, { useState } from "react";

export default function ScenarioStatistics() {
	// Define react hooks to save info from the dropdowns
	const [curScenario, setScenario] = useState(null);
	const [curMetric,   setMetric]   = useState(null);
	// React hook used to save the list of data
	const [curData,     setData]     = useState(null);

	// Define where we store the dropdown data - we only have to collect it once
	let filters = [
		{value: "Period_ID", label: "Period_ID"},
		{value: "Load Zone", label: "Load Zone"},
		{value: "Dispatch Zone", label: "Dispatch Zone"},
		{value: "Reserve Zone", label: "Reserve Zone"},
		{value: "Fuel", label: "Fuel Type"},

	];
	let aggregates = [
		{value: "Time Period Grouping", label: "Time Period Grouping"},
		{value: "Load Zone", label: "Load Zone"},
		{value: "Dispatch Zone", label: "Dispatch Zone"},
		{value: "Reserve Zone", label: "Reserve Zone"},
		{value: "Fuel", label: "Fuel Type"},

	];
	let scenario_names = [];
	let metrics = [];

	// populate the dropdown lists using the REST api
	api_calls
		.populateDropdown(
			scenario_names,
			"http://localhost:3001/api/Scenarios",
			"SCENARIO_ID",
			"SCENRAIO_NAME"
		)
		.catch((error) => {
			console.error(error);
		});

	api_calls
		.getMetrics(metrics)
		.catch((error) => {
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

	// let fakeArray = [1, 2, 3, 5, 7, 9]; //fake array for dummy data and testing

	const roundToDec = (num, dec) => {
		let mult = Math.pow(10, dec);
		return Math.round((num + Number.EPSILON) * mult) / mult;
	};

	const findMean = (arr) => {
		if (arr.length === 0) {
			return 0;
		} else {
			let sum = arr.reduce((a, b) => a + b);
			return roundToDec(sum / arr.length, 5);
		}
	};

	const findMin = (arr) => {
		if (arr.length === 0) {
			return Infinity;
		} else {
			return arr.reduce((a, b) => Math.min(a, b));
		}
	};

	const findMax = (arr) => {
		if (arr.length === 0) {
			return -Infinity;
		} else {
			return arr.reduce((a, b) => Math.max(a, b));
		}
	};

	const findMedian = (arr) => {
		arr.sort();
		let n = arr.length;
		if (arr.length % 2 === 0) {
			//n is even
			return arr[n / 2];
		} else {
			// n is odd
			return (arr[(n - 1) / 2] + arr[(n + 1) / 2]) / 2;
		}
	};

	const findStdev = (arr) => {
		let sum = 0;
		let mean = findMean(arr);
		for (const element of arr) {
			sum = sum + (element - mean) * (element - mean);
		}
		return roundToDec(sum / arr.length, 5);
	};

	const findScew = (arr) => {
		let stdev = findStdev(arr);
		if (stdev !== 0) {
			let mean = findMean(arr);
			let median = findMedian(arr);
			return roundToDec((3 * (mean - median)) / stdev, 5);

		} else {
			return 0;
		}
	};

	const findPercentile = (arr, p) => {
		let size = arr.length;
		return roundToDec(arr.sort()[Math.ceil((size * p) / 100) - 1], 5);
	};

	const showTable = async () => {
		// Validate that the "scenario", and "target metric" have been chosen
		let err_msg = "";
		if (curScenario === null) {
			err_msg += '"Scenario" must be specified to generate a report.\n';
		}
		if (curMetric === null) {
			err_msg += '"Metric" must be specified to generate a report.\n';
		}

		if (err_msg !== "") {
			window.alert(err_msg);
			return;
		}

		// We only get here if the required fields have been selected
		// Make a REST api call to get update data, returning an array
		let new_data = await api_calls
			.getStatisticsData(
				setData,
				curScenario,
				curMetric
			)
			.catch((error) => {
				console.error(error);
			});		

		// Make sure the table is visible
		let cur_style = document.getElementById("show-buttons").style.display;

		if (cur_style !== "block") {
			document.getElementById("show-buttons").style.display = "block";
		} else {
			// Temp solution because its hard to see the update
			// TODO: switch to a modal window
			window.alert("Table Updated");
		}

		// set the values in the table by analyzing the data
		document.getElementById("mean_val").innerHTML   = findMean(new_data);
		document.getElementById("median_val").innerHTML = findMedian(new_data);
		document.getElementById("std_val").innerHTML    = findStdev(new_data);
		document.getElementById("min_val").innerHTML    = findMin(new_data);
		document.getElementById("max_val").innerHTML    = findMax(new_data);
		document.getElementById("skew_val").innerHTML   = findScew(new_data);
		document.getElementById("99_val").innerHTML     = findPercentile(new_data, 99);
		document.getElementById("90_val").innerHTML     = findPercentile(new_data, 90);
		document.getElementById("95_val").innerHTML     = findPercentile(new_data, 95);
		
	};

	return (
		<>
			<h1 className="scenariostats">Scenario Statistics</h1>
			<hr></hr>
			{/* <h1 className="config1">Configuration</h1> */}
			<hr></hr>
			<table className="table_row" id="show-buttons">
				<tbody>
					<tr>
						<th>Metric</th>
						<th>Value</th>
					</tr>
					<tr>
						<td className="first">Mean</td>
						<td id="mean_val">Value</td>
					</tr>
					<tr>
						<td className="first">Median</td>
						<td id="median_val">Value</td>
					</tr>
					<tr>
						<td className="first">Std Dev</td>
						<td id="std_val">Value</td>
					</tr>
					<tr>
						<td className="first">Min</td>
						<td id="min_val">Value</td>
					</tr>
					<tr>
						<td className="first">Max</td>
						<td id="max_val">Value</td>
					</tr>
					<tr>
						<td className="first">P99</td>
						<td id="99_val">Value</td>
					</tr>
					<tr>
						<td className="first">P95</td>
						<td id="95_val">Value</td>
					</tr>
					<tr>
						<td className="first">P90</td>
						<td id="90_val">Value</td>
					</tr>
					<tr>
						<td className="first">Skew</td>
						<td id="skew_val">Value</td>
					</tr>
				</tbody>
			</table>
			<ul className="group1">
				<li>Scenario</li>
				<li>
					<AsyncSelect
						onChange={OnChangeReactHook(setScenario)}
						loadOptions={loadOptions(scenario_names)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
			</ul>
			<ul className="group2">
				<li>Target Metric</li>
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
			{/* Put table div here */}
			<ul className="group1">
				<li>Filter</li>
				<li>
					<AsyncSelect
						loadOptions={loadOptions(filters)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
			</ul>
			<ul className="group2">
				<li>Aggregates</li>
				<li>
					<AsyncSelect
						loadOptions={loadOptions(aggregates)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
			</ul>
			<button className="button1" onClick={showTable}>
				View Stats
			</button>
		</>
	);
}
