// This file contains all the defintions needed to interface with the Database using REST api calls
// It can be imported into any file that needs to use this information, decreasing code duplication

// Define the base URI to make it easier to change
const base_URI = "https://www.geysertimes.org/api/v5";

// A function that async queryies the database for some information
// URI_extension is a string represnting the rest of the path
export async function getGeyserInfo(URI_extension, list) {
	// Get the json using the database's REST api
	const response = await fetch(base_URI + URI_extension);
	const my_json = await response.json();

	// Get a specific part of the data
	const geysers = await my_json.geysers;
	// console.log(geysers[0]);

	// Populate the target list such that AsyncSelect can use it
	for (let i = 0; i < 10; i++) {
		list.push({ value: geysers[i].id, label: geysers[i].name });
	}
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