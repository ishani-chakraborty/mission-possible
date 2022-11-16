import AsyncSelect from "react-select/async";
import "./ss_styles.css";
import * as dbInterface from "../DatabaseInterface.js"


export default function ScenarioStatistics() {
  // Define where we store the dropdown data - we only have to collect it once
  const options = [
    { value: "temp", label: "Temp" },
    { value: "temp1", label: "Temp1" },
  ];

  // load options from the 'options' list
  // TODO: generalize to any list, not just 'options'
	const loadOptions = (searchValue, callback) => {
		setTimeout(() => {
			const filterOptions = options.filter((option) =>
				option.label.toLowerCase().includes(searchValue.toLowerCase())
			);
			callback(filterOptions);
		}, 2000);
	};

	let fakeArray = [1, 2, 3, 5, 7, 9]; //fake array for dummy data

	const roundToDec = (num, dec) => {
		let mult = Math.pow(10, dec);
		return Math.round((num + Number.EPSILON) * mult) / mult;
	};

	const findMean = (arr) => {
		let sum = 0;
		for (const element of arr) {
			sum += element;
		}
		return roundToDec(sum / arr.length, 5);
	};

	const findMin = (arr) => {
		return Math.min(...arr);
	};

	const findMax = (arr) => {
		return Math.max(...arr);
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
		let mean = findMean(arr);
		let median = findMedian(arr);
		let stdev = findStdev(arr);
		return roundToDec((3 * (mean - median)) / stdev, 5);
	};

	const findPercentile = (arr, p) => {
		let size = arr.length;
		return roundToDec(arr.sort()[Math.ceil((size * p) / 100) - 1], 5);
	};

	const showTable = () => {
		document.getElementById("show-buttons").style.display = "block";
		let x = findMean(fakeArray);
		document.getElementById("mean_val").innerHTML = x;
		let y = findMedian(fakeArray);
		document.getElementById("median_val").innerHTML = y;
		let z = findStdev(fakeArray);
		document.getElementById("std_val").innerHTML = z;
		let a = findMin(fakeArray);
		document.getElementById("min_val").innerHTML = a;
		let b = findMax(fakeArray);
		document.getElementById("max_val").innerHTML = b;
		let c = findScew(fakeArray);
		document.getElementById("skew_val").innerHTML = c;
		let d = findPercentile(fakeArray, 99);
		document.getElementById("99_val").innerHTML = d;
		let e = findPercentile(fakeArray, 90);
		document.getElementById("90_val").innerHTML = e;
		let f = findPercentile(fakeArray, 95);
		document.getElementById("95_val").innerHTML = f;
	};
	return (
		<>
			<h1 className="scenariostats">Scenario Statistics</h1>
			<hr></hr>
			<h1 className="config1">Configuration</h1>
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
						loadOptions={loadOptions}
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
						loadOptions={loadOptions}
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
						loadOptions={loadOptions}
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
						loadOptions={loadOptions}
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
