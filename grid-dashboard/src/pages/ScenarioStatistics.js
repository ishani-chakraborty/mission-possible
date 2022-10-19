import AsyncSelect from "react-select/async";
import "./ss_styles.css"

export default function ScenarioStatistics(){
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

    const showTable = () => {
        document.getElementById("show-buttons").style.display="block";
    };
    return (
        <>
            <h1 className="scenariostats">Scenario Statistics</h1>
            <hr></hr>
            <h1 className="config1">Configuration</h1>
            <hr></hr>
             <table className="table_row" id="show-buttons">
        <tr>
          <th>Metric</th> 
          <th>Value</th>
        </tr>
        <tr>
          <td>Mean</td> 
          <td>0</td>
        </tr>
        <tr >
        <td>Median</td> 
          <td>0</td>
        </tr>
        <tr>
        <td>Mode</td> 
          <td>0</td>
        </tr>
        <tr>
        <td>Std Dev</td> 
          <td>0</td>
        </tr>
        <tr>
        <td>Min</td> 
          <td>0</td>
        </tr>
        <tr>
        <td>Max</td> 
          <td>0</td>
        </tr>
        <tr>
        <td>P99</td>
          
          <td>10</td>
        </tr>
        <tr>
        <td>P95</td>
          
          <td>10</td>
        </tr>
        <tr>
        <td>P90</td>
          
          <td>10</td>
        </tr>
        <tr>
        <td>SKEWNESS</td>
          
          <td>10</td>
        </tr>
      </table>
                <ul className="group1">
                    <li>Scenario</li>
                    <li><AsyncSelect loadOptions={loadOptions} defaultOptions placeholder="- Select -" isClearable/></li>
                </ul>
                <ul className="group2">
                    <li>Target Metric</li>
                    <li><AsyncSelect loadOptions={loadOptions} defaultOptions placeholder="- Select -" isClearable/></li>
                </ul>
                {/* Put table div here */}
                <ul className="group1">
                    <li>Filter</li>
                    <li><AsyncSelect loadOptions={loadOptions} defaultOptions placeholder="- Select -" isClearable/></li>
                </ul>
                <ul className="group2">
                    <li>Aggregates</li>
                    <li><AsyncSelect loadOptions={loadOptions} defaultOptions placeholder="- Select -" isClearable/></li>
                </ul>
                <button className="button1" onClick={showTable} >View Stats</button> 
        </>
    );

}