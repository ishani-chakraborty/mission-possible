import AsyncSelect from "react-select/async";
import "./dc_styles.css";
import { DateRangePicker } from "rsuite";
import * as dbInterface from "../DatabaseInterface.js";

export default function DataComparison() {
	// Define where we store the data (ex. names stores the names of geysers)
	// In practce we'd have dates, times, and scenarios
	let names = [];
	// const options = [
	// 	{ value: "temp", label: "Temp" },
	// 	{ value: "temp1", label: "Temp1" },
	// ];

	// Use a specific REST CALL to get a list of the geysers, saving their names
	let query = "/geysers";
	dbInterface.getGeyserInfo(query, names).catch((error) => {
		console.error(error);
	});
	// console.log(names); //debug

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
			</ul>
			<ul className="dropdowns">
				<li>
					<DateRangePicker
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
						loadOptions={loadOptions(names)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
				<li>
					<AsyncSelect
						loadOptions={loadOptions(names)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
			</ul>
			<button className="button">Create Graphs</button>
		</>
	);
}
