import React from 'react';
import { useNavigate } from "react-router-dom";
import "./home_styles.css"

export default function Home(){
    const navigate = useNavigate();
    const navigateToDataComparison = () => {
        let path = '/dataComparison';
        navigate(path); 
    } 

    const navigateToScenarioStatistics = () => {
        let path = '/scenarioStatistics';
        navigate(path); 
    } 

     return (
      <div className="home"> Select a way to view the data
        <table class="center">
            <tbody>
                <tr>
                    <td>
                        <div className="buttons">
                            <button className="data" onClick={navigateToDataComparison}>Data Comparison</button>
                        </div>
                    </td>
                    <td>
                        <div className="buttons">
                            <button className="stats" onClick={navigateToScenarioStatistics}>Scenario Statistics</button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="descriptions">
                            <div className="description1">
                                <b>Graphical comparisons</b> generated from 
                                <br></br>
                                node input scenarios that perform 
                                <br></br>
                                sanity checks against the base case
                                <br></br> 
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="descriptions">
                            <div className="description2">
                                <b>Exploratory data analysis</b> using   
                                <br></br>
                                aggregate and target metric filters 
                                <br></br>
                                that sample different values of 
                                <br></br> 
                                node variables 
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
     </div>
    );
 };


