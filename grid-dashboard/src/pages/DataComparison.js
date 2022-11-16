import AsyncSelect from "react-select/async";
import "./dc_styles.css"
import { DateRangePicker } from "rsuite";
import * as dbInterface from "../DatabaseInterface.js"
import Scatter from '../graphs/Scatter'
import Heatmap from '../graphs/Heatmap'
import Histogram from '../graphs/Histogram'

export default function DataComparison(){
    // Define where we store the data (ex. names stores the names of geysers)
    let scenario_names = [];
    let node_names = [
        {value: ".I.Kent", label: ".I.Kent"},
        {value: "AR.BRIGHTON345 UBGH2P", label: "AR.BRIGHTON345 UBGH2P"},
        {value: "LD.KENT", label: "LD.KENT"}
    ];
    let metrics = [
        {value: "lmp", label: "LMP"},
        {value: "mw", label: "MW"},
    ];
    const options = [
        {value: "temp", label: "Temp"},
        {value: "temp1", label: "Temp1"},
     ];
    
    // Use a specific REST CALL to get a list of the geysers, saving their names
    let query = '/geysers';
    let list_to_save_to = scenario_names;
    dbInterface.getGeyserInfo(query, list_to_save_to).catch(error => {
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
						loadOptions={loadOptions(scenario_names)}
						defaultOptions
						placeholder="- Select -"
						isClearable
					/>
				</li>
				<li>
					<AsyncSelect
						loadOptions={loadOptions(scenario_names)}
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
			<button className="button">Create Graphs</button>

            {/* TODO: Need some way to switch between the different types*/}
            <ul className="scatter">
                <Scatter></Scatter>
            </ul>
            <ul className="histogram">
                <Histogram></Histogram>
            </ul>
            <ul className="heatmap">
                <Heatmap></Heatmap>
            </ul>
		</>
	);
}
