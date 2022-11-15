import AsyncSelect from "react-select/async";
import "./ss_styles.css";
import * as dbInterface from "../DatabaseInterface.js"



export default function ScenarioStatistics() {
  // Define where we store the dropdown data - we only have to collect it once
  const options = [
    { value: "temp", label: "Temp" },
    { value: "temp1", label: "Temp1" },
  ];

  // Search a specific search list (source) for seachValue
  // Usable by AsyncSelect after specifying the source list
  const loadOptions = (source) => {
    return (searchValue, callback) => {
      setTimeout(()=> {
        const filterOptions = source.filter(option => 
          option.label.toLowerCase().includes(searchValue.toLowerCase()));
          callback(filterOptions);
        }, 2000)
      }
  }

  const showTable = () => {
    document.getElementById("show-buttons").style.display = "block";
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
          <td className="first">Mean</td>
          <td>0</td>
        </tr>
        <tr>
          <td className="first">Median</td>
          <td>0</td>
        </tr>
        <tr>
          <td className="first">Mode</td>
          <td>0</td>
        </tr>
        <tr>
          <td className="first">Std Dev</td>
          <td>0</td>
        </tr>
        <tr>
          <td className="first">Min</td>
          <td>0</td>
        </tr>
        <tr>
          <td className="first">Max</td>
          <td>0</td>
        </tr>
        <tr>
          <td className="first">P99</td>

          <td>0</td>
        </tr>
        <tr>
          <td className="first">P95</td>

          <td>0</td>
        </tr>
        <tr>
          <td className="first">P90</td>

          <td>0</td>
        </tr>
        <tr>
          <td className="first">Skew</td>
          <td>0</td>
        </tr>
      </table>
      <ul className="group1">
        <li>Scenario</li>
        <li>
          <AsyncSelect
            loadOptions={loadOptions(options)}
            defaultOptions
            placeholder="- Select -"
            isClearable
          />
        </li>
      </ul>
      <ul className="group2">
        <li>Target Metric</li>
        <li>
          <AsyncSelect
            loadOptions={loadOptions(options)}
            defaultOptions
            placeholder="- Select -"
            isClearable
          />
        </li>
      </ul>
      {/* Put table div here */}
      <ul className="group1">
        <li>Filter</li>
        <li>
          <AsyncSelect
            loadOptions={loadOptions(options)}
            defaultOptions
            placeholder="- Select -"
            isClearable
          />
        </li>
      </ul>
      <ul className="group2">
        <li>Aggregates</li>
        <li>
          <AsyncSelect
            loadOptions={loadOptions(options)}
            defaultOptions
            placeholder="- Select -"
            isClearable
          />
        </li>
      </ul>
      <button className="button1" onClick={showTable}>
        View Stats
      </button>
    </>
  );
}
