import AsyncSelect from "react-select/async";
import "./dc_styles.css"

export default function DataComparison(){
    const options = [
       {value: "temp", label: "Temp"},
       {value: "temp1", label: "Temp1"},
    ];

    const loadOptions = (searchValue, callback) => {
      setTimeout(()=> {
        const filterOptions = options.filter(option => 
            option.label.toLowerCase().includes(searchValue.toLowerCase()));
            callback(filterOptions);
      },2000)  
    };
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