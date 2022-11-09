import AsyncSelect from "react-select/async";
import "./dc_styles.css"
// import * as dbInterface from "../DatabaseInterface.js" //might cause merge conflict

export default function DataComparison(){
    // Define where we store the data (ex. names stores the names of geysers)
    // In practce we'd have dates, times, and scenarios
    let names = [];
    const options = [
        {value: "temp", label: "Temp"},
        {value: "temp1", label: "Temp1"},
     ];
    
    //might cause merge conflict
    // Use a specific REST CALL to get a list of the geysers, saving their names
    // let query = '/geysers';
    // dbInterface.getGeyserInfo(query, names).catch(error => {
    //   console.error(error);
    // });

    // Search a specific search list (source) for seachValue
    // Usable by AsyncSelect after specifying the source list
    // TODO: make sure the source list isn't hardcoded (right now "option" is hardcoded)
    const loadOptions = (searchValue, callback) => {
        setTimeout(()=> {
            const filterOptions = options.filter(option => 
                option.label.toLowerCase().includes(searchValue.toLowerCase()));
                callback(filterOptions);
            }, 2000)
        }

    return (
        <>
            <h1 className="datacomp">Data Comparison</h1>
            <hr></hr>
            <h1 className="config">Configuration</h1>
            <hr></hr>
            <ul className="headers">
                <li>Date</li>
                <li>Time</li>
                <li>Scenario 1</li>
                <li>Scenario 2</li>
            </ul>
            <ul className="dropdowns">
                <li><AsyncSelect loadOptions={loadOptions} defaultOptions placeholder="- Select -" isClearable/></li>
                <li><AsyncSelect loadOptions={loadOptions} defaultOptions placeholder="- Select -" isClearable/></li>
                <li><AsyncSelect loadOptions={loadOptions} defaultOptions placeholder="- Select -" isClearable/></li>
                <li><AsyncSelect loadOptions={loadOptions} defaultOptions placeholder="- Select -" isClearable/></li>
            </ul>
            <button className="button">Create Graphs</button>
            
        </>
    );

};