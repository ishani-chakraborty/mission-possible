// A function that async queryies the database for some information
// URI_extension is a string represnting the rest of the path
export async function populateDropdown(list, URI, value, label) {
	// Get the json using the database's REST api
	const response = await fetch(URI);
	const my_json = await response.json();
	const unique_labels = new Set();

	// Populate the target list such that AsyncSelect can use it
	for (let i = 0; i < my_json.length; i++) {
		if (
			typeof my_json[i] !== "undefined" &&
			!unique_labels.has(my_json[i][label])
		) {
			list.push({
				value: my_json[i][value],
				label: my_json[i][label],
			});
			unique_labels.add(my_json[i][label]);
		}
	}
}

export async function getNodeNames(list, value, label) {
	let URI = "http://localhost:3001/api/PNODE_NAME";

	// Get the json using the database's REST api
	const response = await fetch(URI);
	const my_json = await response.json();

	// Populate the target list such that AsyncSelect can use it
	// Each entry is already distinct
	for (let i = 0; i < my_json.length; i++) {
		if (typeof my_json[i] !== "undefined") {
			list.push({
				value: my_json[i][value],
				label: my_json[i][label],
			});
		}
	}
}

export async function updateData(setDataFunc, baseCase, scenario,
	metric, node, startDate, endDate, idToNameFunc) {
		
	// Dynamically determine the query to execute based on how many parameters are specified
	if (node === null) {
		node = "0";
	}
	let baseCaseURI =
		"http://localhost:3001/api/Node_Data" +
		"/" + baseCase +
		"/'" + node +
		"'/" + metric;
	let scenarioURI =
		"http://localhost:3001/api/Node_Data" +
		"/" + scenario +
		"/'" + node +
		"'/" + metric;

	if (startDate !== null && endDate !== null) {
		baseCaseURI += "/" + startDate + "/" + endDate;
		scenarioURI += "/" + startDate + "/" + endDate;
	}

	const response1 = await fetch(baseCaseURI);
	let baseCaseData = await response1.json();
	const response2 = await fetch(scenarioURI);
	let scenarioData = await response2.json();

	// filter out null values
	baseCaseData = baseCaseData.filter((entry) => entry[metric] !== null);
	scenarioData = scenarioData.filter((entry) => entry[metric] !== null);

	const my_data = {
		node: node,
		metric: metric,
		base_case_name: idToNameFunc(baseCase),
		scenario_name: idToNameFunc(scenario),
		base_case: baseCaseData,
		scenario_to_compare: scenarioData,
	};
	setDataFunc(my_data);

}

// populate metrics
export async function getMetrics(list) {
	const response = await fetch("http://localhost:3001/api/Node_Data/metrics");
	const my_json = await response.json();

	var keys = Object.keys(my_json[0]);

	keys.filter(
		(key) =>
			!(
				key === "SCENARIO_ID" ||
				key === "PNODE_NAME" ||
				key === "PERIOD_ID"
			)
	).map((metric) =>
		list.push({ value: metric, label: metric })
	);

	// console.log(list);
}

export async function getStatisticsData(setDataFunc, scenario, metric) {
	// URI like "/:id/:scenario/:pnode_name/:metric"
	let URI =
		"http://localhost:3001/api/Node_Data" +
		"/" + scenario +
		"/'0'" +
		"/" + metric;

	const response = await fetch(URI);
	let rawData = await response.json();

	let non_null   = rawData.filter((entry) => entry[metric] !== null);
	let metricData = non_null.map((entry) => parseFloat(entry[metric]));
	// let finalData  = metricData.filter(((entry) => entry !== null));

	setDataFunc(metricData);

	return metricData;
}