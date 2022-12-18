import React, { Component } from "react";
import Chart from "react-apexcharts";

class Scatter extends Component {
	constructor(props) {
		super(props);
		// console.log(props.data)

		// This data in this format is exactly what the graph needs
		// FYI, the dummy data is hard to read: each entry contains a unique PERIOD_ID with an LMP value, they all have the same node
		// this.passed_data = {
		//   node: "Node",
		//   metric: 'LMP',
		//   base_case_name: 'Base Case',
		//   scenario_name: 'Scenario',
		//   base_case: [{LMP:30, PERIOD_ID: "2020-07-17 01", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:40, PERIOD_ID: "2020-07-17 02", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:35,  PERIOD_ID: "2020-07-17 03", PNODE_NAME: "UN.ALTA 345 UALT"},
		//               {LMP:50, PERIOD_ID: "2020-07-17 04", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:49, PERIOD_ID: "2020-07-17 05", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:60,  PERIOD_ID: "2020-07-17 06", PNODE_NAME: "UN.ALTA 345 UALT"},
		//               {LMP:70, PERIOD_ID: "2020-07-17 07", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:91, PERIOD_ID: "2020-07-17 08", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:125, PERIOD_ID: "2020-07-17 09", PNODE_NAME: "UN.ALTA 345 UALT"},
		//               {LMP:32, PERIOD_ID: "2020-07-17 10", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:42, PERIOD_ID: "2020-07-17 11", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:37,  PERIOD_ID: "2020-07-17 12", PNODE_NAME: "UN.ALTA 345 UALT"},
		//               {LMP:52, PERIOD_ID: "2020-07-17 13", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:48, PERIOD_ID: "2020-07-17 14", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:62,  PERIOD_ID: "2020-07-17 15", PNODE_NAME: "UN.ALTA 345 UALT"},
		//               {LMP:72, PERIOD_ID: "2020-07-17 16", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:93, PERIOD_ID: "2020-07-17 17", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:120, PERIOD_ID: "2020-07-17 18", PNODE_NAME: "UN.ALTA 345 UALT"}],
		//   scenario_to_compare: [{LMP:28, PERIOD_ID: "2020-07-17 01", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:42, PERIOD_ID: "2020-07-17 02", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:37,  PERIOD_ID: "2020-07-17 03", PNODE_NAME: "UN.ALTA 345 UALT"},
		//                         {LMP:48, PERIOD_ID: "2020-07-17 04", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:47, PERIOD_ID: "2020-07-17 05", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:60,  PERIOD_ID: "2020-07-17 06", PNODE_NAME: "UN.ALTA 345 UALT"},
		//                         {LMP:70, PERIOD_ID: "2020-07-17 07", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:84, PERIOD_ID: "2020-07-17 08", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:120, PERIOD_ID: "2020-07-17 09", PNODE_NAME: "UN.ALTA 345 UALT"},
		//                         {LMP:35, PERIOD_ID: "2020-07-17 10", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:43, PERIOD_ID: "2020-07-17 11", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:36,  PERIOD_ID: "2020-07-17 12", PNODE_NAME: "UN.ALTA 345 UALT"},
		//                         {LMP:50, PERIOD_ID: "2020-07-17 13", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:50, PERIOD_ID: "2020-07-17 14", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:50,  PERIOD_ID: "2020-07-17 15", PNODE_NAME: "UN.ALTA 345 UALT"},
		//                         {LMP:72, PERIOD_ID: "2020-07-17 16", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:93, PERIOD_ID: "2020-07-17 17", PNODE_NAME: "UN.ALTA 345 UALT"}, {LMP:60,  PERIOD_ID: "2020-07-17 18", PNODE_NAME: "UN.ALTA 345 UALT"}]
		// }

		this.passed_data = props.data;
		this.metric = this.passed_data.metric;

		// transform the base case into a map
		// {PNODE_Name : {PERIOD_ID : metric} }
		let nodeDatetimeMap = new Map();
		this.passed_data.base_case.forEach((baseData) => {
			if (!nodeDatetimeMap.has(baseData.PNODE_NAME)) {
				nodeDatetimeMap.set(baseData.PNODE_NAME, new Map());
			}

			// gets the map corresponding to the node, and creates an entry maping datetime to the metric
			let datetimeMap = nodeDatetimeMap.get(baseData.PNODE_NAME);
			datetimeMap.set(baseData.PERIOD_ID, baseData[this.metric]);
		});

		this.data = [];

		// match the scenario data (scenario_to_compare) to the base case
		// If it matches, add it to the data
		this.passed_data.scenario_to_compare.forEach((scenarioData) => {
			// if the node is found AND the datetime for that node was found:
			// Transform the metric data into a datapoint for the graph
			if (nodeDatetimeMap.has(scenarioData.PNODE_NAME)) {
				let datetimeMap = nodeDatetimeMap.get(scenarioData.PNODE_NAME);
				if (datetimeMap.has(scenarioData.PERIOD_ID)) {
					let match = [
						datetimeMap.get(scenarioData.PERIOD_ID),
						scenarioData[this.metric],
					];
					this.data.push(match);
				}
			}
		});
		// console.log(this.data) // debug, should look like [ [x1, y1], [x2, y2], ..., [xn, yn] ]

		let max_x = Math.max(...this.data.map((x) => x[0]));
		let max_y = Math.max(...this.data.map((x) => x[1]));
		let min_x = Math.min(...this.data.map((x) => x[0]));
		let min_y = Math.min(...this.data.map((x) => x[1]));
		let max = Math.max(max_x, max_y);
		let min = Math.min(min_x, min_y);

		// best_fit fits the data, ideal_fit is y=x: where the scenario matches up with the base_case
		this.ideal_fit = [
			[min, min],
			[max, max],
		];

		this.state = {
			series: [
				{
					name: "Datapoints",
					type: "scatter",
					data: this.data,
				},
				{
					name: "Goal",
					type: "line",
					data: this.ideal_fit,
				},
			],

			options: {
				markers: {
					size: [5, 0],
				},
				xaxis: {
					type: "numeric",
					min: min,
					tickAmount: 5,
					labels: {
						formatter: function (val) {
							return parseFloat(val).toFixed(2);
						},
						style: {
							colors: "white",
						},
					},
					title: {
						text:
							this.metric + " " + this.passed_data.base_case_name,
						offsetY: 75,
						style: {
							fontSize: "15px",
							color: "white",
						},
					},
				},
				yaxis: {
					min: min,
					tickAmount: 5,
					labels: {
						formatter: function (val) {
							return parseFloat(val).toFixed(2);
						},
						style: {
							colors: "white",
						},
					},
					title: {
						text:
							this.metric + " " + this.passed_data.scenario_name,
						style: {
							fontSize: "15px",
							color: "white",
						},
					},
				},
				tooltip: {
					enabled: false, //keeping track of upto 24hours * 365days * 3years = 26,000 points is likely a performance hit
				},
				title: {
					// TODO: only display the 2nd part of the message if the node is valid
					text:
						this.metric + " Comparison on " + this.passed_data.node,
					align: "left",
					margin: 10,
					offsetX: 60,
					offsetY: -5,
					style: {
						fontSize: "18px",
						fontWeight: "bold",
						color: "white",
					},
				},
				legend: {
					position: "top",
					floating: true,
					offsetX: 310,
					offsetY: -14,
					labels: {
						colors: "white",
					},
				},
			}, //end options
		}; //end state
		if (this.data.length > 0) {
			this.best_fit = Scatter.bestFit(
				this.data,
				max_x,
				max_y,
				min_x,
				min_y
			);
			this.state["series"] = [
				{
					name: "Datapoints",
					type: "scatter",
					data: this.data,
				},
				{
					name: "Best Fit",
					type: "line",
					data: this.best_fit,
				},
				{
					name: "Goal",
					type: "line",
					data: this.ideal_fit,
				},
			];
		}
	}

	static bestFit(data, max_x, max_y, min_x, min_y) {
		// using a linear least squares algorithim

		// sum the x-terms together and the y-terms together
		let sums = data.reduce((a, b) => [
			parseFloat(a[0]) + parseFloat(b[0]),
			parseFloat(a[1]) + parseFloat(b[1]),
		]);
		let meanX = sums[0] / data.length;
		let meanY = sums[1] / data.length;

		// sqaure each x-term, then avg the results
		let avgXSquared =
			data.map((arr) => arr[0] ** 2).reduce((a, b) => a + b) /
			data.length;
		// multiply the x-term and y-term, then avg the results
		let avgXY =
			data.map((arr) => arr[0] * arr[1]).reduce((a, b) => a + b) /
			data.length;

		let m = (avgXY - meanX * meanY) / (avgXSquared - meanX * meanX);
		let b = m * meanX - meanY;

		console.log(m);
		console.log(b);

		let min = Math.min(min_x, min_y);
		let max = Math.max(max_x, max_y);

		// originally [[0, -b], [max_x, m*max_x - b]], but that isn't as nice for graph scaling
		let p1 = [(min + b) / m, min];
		let p2 = [(max + b) / m, max];
		return [p1, p2];
	}

	render() {
		return (
			<div className="scatter">
				<Chart
					options={this.state.options}
					series={this.state.series}
					type="line"
					width="600"
				/>
			</div>
		);
	}
}

export default Scatter;
