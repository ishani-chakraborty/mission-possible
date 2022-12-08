import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Scatter extends Component {

  constructor (props) {
    super(props)
    console.log(props.data)

    // TODO: Get this dynamically using: this.passed_data=props.data
    // This data in this format is exactly what the graph needs
    this.passed_data = {
      node: "Node",
      metric: 'LMP',
      base_case_name: 'Base Case',
      scenario_name: 'Scenario',
      base_case: [{LMP:30, PERIOD_ID: "2020-07-17 01"}, {LMP:40, PERIOD_ID: "2020-07-17 02"}, {LMP:35, PERIOD_ID: "2020-07-17 03"},
                  {LMP:50, PERIOD_ID: "2020-07-17 04"}, {LMP:49, PERIOD_ID: "2020-07-17 05"}, {LMP:60, PERIOD_ID: "2020-07-17 06"},
                  {LMP:70, PERIOD_ID: "2020-07-17 07"}, {LMP:91, PERIOD_ID: "2020-07-17 08"}, {LMP:125, PERIOD_ID: "2020-07-17 09"},
                  {LMP:32, PERIOD_ID: "2020-07-17 10"}, {LMP:42, PERIOD_ID: "2020-07-17 11"}, {LMP:37, PERIOD_ID: "2020-07-17 12"},
                  {LMP:52, PERIOD_ID: "2020-07-17 13"}, {LMP:48, PERIOD_ID: "2020-07-17 14"}, {LMP:62, PERIOD_ID: "2020-07-17 15"},
                  {LMP:72, PERIOD_ID: "2020-07-17 16"}, {LMP:93, PERIOD_ID: "2020-07-17 17"}, {LMP:120, PERIOD_ID: "2020-07-17 18"}],
      scenario_to_compare: [{LMP:28, PERIOD_ID: "2020-07-17 01"}, {LMP:42, PERIOD_ID: "2020-07-17 02"}, {LMP:37, PERIOD_ID: "2020-07-17 03"},
                            {LMP:48, PERIOD_ID: "2020-07-17 04"}, {LMP:47, PERIOD_ID: "2020-07-17 05"}, {LMP:60, PERIOD_ID: "2020-07-17 06"},
                            {LMP:70, PERIOD_ID: "2020-07-17 07"}, {LMP:84, PERIOD_ID: "2020-07-17 08"}, {LMP:120, PERIOD_ID: "2020-07-17 09"},
                            {LMP:35, PERIOD_ID: "2020-07-17 10"}, {LMP:43, PERIOD_ID: "2020-07-17 11"}, {LMP:36, PERIOD_ID: "2020-07-17 12"},
                            {LMP:50, PERIOD_ID: "2020-07-17 13"}, {LMP:50, PERIOD_ID: "2020-07-17 14"}, {LMP:50, PERIOD_ID: "2020-07-17 15"},
                            {LMP:72, PERIOD_ID: "2020-07-17 16"}, {LMP:93, PERIOD_ID: "2020-07-17 17"}, {LMP:60, PERIOD_ID: "2020-07-17 18"}]
    }

    this.metric = this.passed_data.metric
    
    // TODO: add an extra map layer for the node
    // transform the base case into a map
    let datetimeMap = new Map();
    this.passed_data.base_case.forEach( baseData => {
      datetimeMap.set(baseData.PERIOD_ID, baseData[this.metric]);
    });

    this.data = []

    // match the scenario data (scenario_to_compare) to the base case
    // If it matches, add it to the data
    this.passed_data.scenario_to_compare.forEach( scenarioData => {
      if (datetimeMap.has(scenarioData.PERIOD_ID)) {
        let match = [datetimeMap.get(scenarioData.PERIOD_ID), scenarioData[this.metric]]
        this.data.push(match);
      }
    });
    // console.log(this.data) // debug, should look like [ [x1, y1], [x2, y2], ..., [xn, yn] ]

    let max_x = Math.max(...this.data.map(x => x[0]))
    let max_y = Math.max(...this.data.map(x => x[1]))

    // like [ [x0, 0], [xn, max_y] ] where x0 and xn fall on the line of best fit
    this.best_fit = Scatter.bestFit(this.data, max_x, max_y)

    let max = Math.max(max_x, max_y)
    this.ideal_fit = [ [0, 0], [max, max]]

    console.log("Testing data stuff");
    console.log(this.data);
    console.log(this.data2);

    this.state = {
      series: [{
        name: "Datapoints",
        type: 'scatter',
        data: this.data
      }, {
        name: "Best Fit",
        type: 'line',
        data: this.best_fit
      }, {
        name: "Goal",
        type: 'line',
        data: this.ideal_fit
      }],

      options: {
        markers: {
          size: [5, 0]
        },
        xaxis: {
          type: 'numeric',
          min: 0,
          tickAmount: 5,
          labels: {
            formatter: function(val) {
              return parseFloat(val).toFixed(2)
            },
            style: {
              colors: 'white',
            }
          },
          title: {
            text: this.metric + " Base Case",
            offsetY: 90,
            style: {
              fontSize: '15px',
              color: 'white'
            }
          }
        },
        yaxis: {
          min: 0,
          tickAmount: 5,
          labels: {
            formatter: function(val) {
              return parseFloat(val).toFixed(2)
            },
            style: {
              colors: 'white',
            }
          },
          title: {
            text: this.metric + " " + this.passed_data.scenario_name,
            style: {
              fontSize:  '15px',
              color: 'white'
            }
          }
        },
        tooltip: {
          enabled: false //keeping track of upto 24hours * 365days * 3years = 26,000 points is likely a performance hit
        },
        title: {
          // TODO: only display the 2nd part of the message if the node is valid
          text: this.metric + " Comparison on " + this.passed_data.node,
          align: 'left',
          margin: 10,
          offsetX: 60,
          offsetY: 15,
          style: {
            fontSize:  '18px',
            fontWeight:  'bold',
            color:  'white'
          },
        },
        legend: {
          position: 'top',
          floating: true,
          offsetX: 250,
          offsetY: -15,
          labels: {
            colors: 'white'
          }
        }
      } //end options
    } //end state

  }

  static bestFit(data, max_x, max_y) {
    // using a linear least squares algorithim

    // sum the x-terms together and the y-terms together
    let sums = data.reduce((a, b) => [a[0] + b[0], a[1] + b[1]])
    let meanX = sums[0] / data.length
    let meanY = sums[1] / data.length

    // sqaure each x-term, then avg the results
    let avgXSquared = data.map(arr => arr[0]**2).reduce((a, b) => a+b)     / data.length
    // multiply the x-term and y-term, then avg the results
    let avgXY       = data.map(arr => arr[0]*arr[1]).reduce((a, b) => a+b) / data.length

    let m = (avgXY - meanX * meanY) / (avgXSquared - meanX * meanX)
    let b = m * meanX - meanY
    
    // originally [[0, -b], [max_x, m*max_x - b]], but that doesn't touch y=0, y=max_y for graph scaling
    return [[b / m, 0], [(max_y + b) / m, max_y]]
  }


  render() {

    return (
      <div className="scatter">
        <Chart options={this.state.options} series={this.state.series} type="line" width="600" />
      </div>
    );
  }

}

export default Scatter;
