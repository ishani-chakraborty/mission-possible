import AsyncSelect from "react-select/async";

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
                <li><AsyncSelect loadOptions={loadOptions} defaultOptions isClearable/></li>
                <li><AsyncSelect loadOptions={loadOptions} defaultOptions isClearable/></li>
                <li><AsyncSelect loadOptions={loadOptions} defaultOptions isClearable/></li>
                <li><AsyncSelect loadOptions={loadOptions} defaultOptions isClearable/></li>
            </ul>
            <button className="button">Get Stats</button>
            <table id="table">
        <tr className="table_row">
          <th>Metric</th>
          
          <th>Value</th>
        </tr>
        <tr className="table_row">
          <td>Mean</td>
          
          <td>10</td>
        </tr>
        <tr className="table_row">
        <td>Median</td>
          
          <td>10</td>
        </tr>
        <tr>
        <td>Mode</td>
          
          <td>10</td>
        </tr>
        <tr>
        <td>Std Dev</td>
          
          <td>10</td>
        </tr>
        <tr>
        <td>Min</td>
          
          <td>10</td>
        </tr>
        <tr>
        <td>Max</td>
          
          <td>10</td>
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
        </>
    );

};