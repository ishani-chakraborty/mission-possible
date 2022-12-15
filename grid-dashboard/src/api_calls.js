// A function that async queryies the database for some information
// URI_extension is a string represnting the rest of the path
export async function populateDropdown(list, URI, value, label) {
	// Get the json using the database's REST api
	const response = await fetch(URI);
	const my_json = await response.json();
	const unique_labels = new Set();

	// Get a specific part of the data
	// console.log(my_json);

	// Populate the target list such that AsyncSelect can use it
	for (let i = 0; i < my_json.length; i++) {
		if (typeof my_json[i] !== "undefined" && !unique_labels.has(my_json[i][label])) {
			list.push({
				value: my_json[i][value],
				label: my_json[i][label],
			});
			unique_labels.add(my_json[i][label]);
		}
	}
}

export async function updateData(setDataFunc, baseCase, scenario, metric, node, startDate, endDate, idToNameFunc) {
	// Dynamically determine the query to execute based on how many parameters are specified

	let baseCaseURI = "http://localhost:3001/api/Node_Data/" + baseCase + "/'" + node + "'/" + metric;
	let scenarioURI = "http://localhost:3001/api/Node_Data/" + scenario + "/'" + node + "'/" + metric;
	
	if (startDate !== null && endDate !== null) {
		baseCaseURI += "/" + startDate + "/" + endDate;
		scenarioURI += "/" + startDate + "/" + endDate;
	}

	const response1 = await fetch(baseCaseURI);
	let baseCaseData = await response1.json();
	const response2 = await fetch(scenarioURI);
	let scenarioData = await response2.json();

	// filter out null values
	baseCaseData = baseCaseData.filter(entry => entry[metric] !== null);
	scenarioData = scenarioData.filter(entry => entry[metric] !== null);

	const my_data = {
		"node"           : node,
		"metric"         : metric,
		"base_case_name" : idToNameFunc(baseCase),
		"scenario_name"  : idToNameFunc(scenario),
		"base_case"      : baseCaseData,
		"scenario_to_compare" : scenarioData
	}
	setDataFunc(my_data);

	// Possible queries, for reference
	// /:id/:scenario/:pnode_name/:metric/:startdate/:enddate
	// /:id/:scenario/:pnode_name/        :startdate/:enddate
	// /:id/:scenario/:pnode_name/:metric
	// /:id/:scenario/:pnode_name
	// /:id/:scenario
}

// populate metrics
export async function getMetrics(list) {

	const response = await fetch("http://localhost:3001/api/Node_Data/metrics");
	const my_json = await response.json();

	var keys = Object.keys(my_json[0]);

	keys
		.filter(key => !(key === "SCENARIO_ID" || key === "PNODE_NAME" || key === "PERIOD_ID"))
		.map(metric => list.push({ value: metric.toLowerCase(), label: metric }));

	console.log(list);
}