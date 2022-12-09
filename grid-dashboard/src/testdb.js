// A function that async queryies the database for some information
// URI_extension is a string represnting the rest of the path
export async function getGeyser(list, URI, value, label) {
	// Get the json using the database's REST api
	const response = await fetch(URI);
	const my_json = await response.json();

	// Get a specific part of the data
	console.log(my_json);

	// Populate the target list such that AsyncSelect can use it
	for (let i = 0; i < my_json.length; i++) {
		if (typeof my_json[i] !== "undefined") {
			list.push({
				value: my_json[i][value],
				label: my_json[i][label],
			});
		}
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