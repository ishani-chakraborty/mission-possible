// A function that async queryies the database for some information
// URI_extension is a string represnting the rest of the path
export async function getGeyser(list, URI, value, label) {
	// Get the json using the database's REST api
	const response = await fetch(URI);
	const my_json = await response.json();
	const unique_labels = new Set();

	// Get a specific part of the data
	console.log(my_json);

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
