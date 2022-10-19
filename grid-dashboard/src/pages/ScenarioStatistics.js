
import AsyncSelect from "react-select/async";
import React, { useState } from 'react';

//import Select from 'react-select';



export default function ScenarioStatistics(){
    const handleOnClick = () => {
       console.log("Scneario :"+document.querySelector("#mn1").value+" "+document.querySelector("#mn2").value+" "+document.querySelector("#mn3").value+" "+document.querySelector("#mn4").value+"s");
    };
   

   
  return (
    <div>
    <div className="scenratio_stats"> Scenario Statistics
    <hr
        style={{
        background: 'white',
        color: 'white',
        borderColor: 'white',
        height: '2px',
        }}/>
         <div className="dropdowns">
        <select className="dropdown_s1" id="mn1">
        <option selected value="a">Scenario A</option>
        <option value="b">Scenario B</option>
        <option  value="c">Scenario C</option>
        </select>
        <select className="dropdown_s2" id="mn2">
        <option selected value="fa">Filter A</option>
        <option value="fb">Filter B</option>
        <option  value="fc">Filter C</option>
        </select>
        
        <select className="dropdown_s3"  id="mn3">
        <option selected value="mean">Mean</option>
        <option value="median">Median</option>
        <option  value="mode">Mode</option>
        </select>
        <select className="dropdown_s4"  id="mn4">
        <option selected value="LDP">LDP</option>
        <option value="smth">Something</option>
        </select>
        </div>
        <button onClick={handleOnClick}>Get Stats</button>
        
          
     </div>
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
     </div>
     
    
  );

};