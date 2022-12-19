import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Heatmap extends Component {
  constructor (props) {
    super(props)
    // console.log(props.data)

    this.passed_data = props.data;
    this.metric = this.passed_data.metric;

    // transform the base case into a map
    // {PNODE_Name : {PERIOD_ID : metric} }
    let nodeDatetimeMap = new Map();
    this.passed_data.base_case.forEach( baseData => {
      if (! nodeDatetimeMap.has(baseData.PNODE_NAME)) {
        nodeDatetimeMap.set(baseData.PNODE_NAME, new Map())
      }
      
      // gets the map corresponding to the node, and creates an entry maping datetime to the metric
      let datetimeMap = nodeDatetimeMap.get(baseData.PNODE_NAME);
      datetimeMap.set(baseData.PERIOD_ID, baseData[this.metric]);
    });

    // Create the 24 (hour) x 12 (month) data to graph
    // Each entry starts with a list, but wil be averaged into a single number
    this.data = []
    // populating empty hours
    for (let i = 0; i < 24; i ++) {
      let emptyArray = [];
      // populating empty months
      for (let j = 0; j < 12; j++) {
        let innerArray = [];
        emptyArray.push(innerArray);
      }
      this.data.push(emptyArray);
    }

    // console.log(this.data); //should be a 3d array: 24 x 12 x 0

    // match the scenario data (scenario_to_compare) to the base case
    // If it matches, add it to the data
    this.passed_data.scenario_to_compare.forEach( scenarioData => {
      // if the node is found AND the datetime for that node was found:
        // Transform the metric data into a datapoint for the graph
      if (nodeDatetimeMap.has(scenarioData.PNODE_NAME)) {
        let datetimeMap = nodeDatetimeMap.get(scenarioData.PNODE_NAME);

        if (datetimeMap.has(scenarioData.PERIOD_ID)) {
          let data1 = datetimeMap.get(scenarioData.PERIOD_ID);
          let data2 = scenarioData[this.metric]
          let mape  = Heatmap.MAPE( data1, data2 );

          let dataAndTime = scenarioData.PERIOD_ID.split(" "); // splits into [date, time]
          let hour = dataAndTime[1];
          let month = dataAndTime[0].split("-")[1]; // splits into [year, month, day], we select the month
          hour  = parseInt(hour)  -1; // convert 1-24 string into 0-23 int
          month = parseInt(month) -1; // convert 1-12 string into 0-11 int

          // Add to the correct data
          this.data[hour][month].push(Math.abs(mape));
        }
      }
    });

    // Return the average of the array, or if its empty, 0
    const average = array => (array.length > 0) ? array.reduce((a, b) => a + b) / array.length : 0;

    for (let i = 0; i < this.data.length; i++) {
      let hour = this.data[i]  // contains the 12 months

      for (let j = 0; j < hour.length; j++) {
        // Reduce the array to an avg value
        this.data[i][j] = average(this.data[i][j])
      }
    }

    // console.log(this.data);

    // from the data, create the series
    let my_series = []
    for (let i = 1; i <= 24; i++) {
      let name = i.toString().padStart(2, '0') // pad with zeros
      my_series.push({name: name, data: this.data[i-1]})
    }

    this.state = {
            
      series: my_series,

      options: {
        chart: {
          type: 'heatmap',
        },
        dataLabels: {
          enabled: false
        },
        colors: ["#008FFB"],
        title: {
          text: 'Avg. MAPEs Between ' + this.passed_data.base_case_name + ' and ' + this.passed_data.scenario_name,
          style: {
            fontSize:  '18px',
            fontWeight:  'bold',
            color:  'white'
          }
        },
        xaxis: {
          type: 'category',
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          title: {
            text: "Month",
            offsetY: 90,
            style: {
              fontSize: '15px',
              color: 'white'
            }
          },
          labels: {
            style: { colors: 'white' }
          }
        },
        yaxis: {
          title: {
            text: "Hour Ending (HE)",
            style: {
              fontSize: '15px',
              color: 'white'
            }
          },
          labels: {
            style: { colors: 'white' }
          }
        }

      } //end options
    }; //end state

  }

  // Calculate the MAPE of two datapoints
  static MAPE(base, scenario) {
    base     = parseFloat(base);
    scenario = parseFloat(scenario);

    if (base === 0) {
      return 0;
    } else {
      return Math.abs((base - scenario) / base);
    }
  }

  render() {

    return (
      <div className="heatmap">
        <Chart options={this.state.options} series={this.state.series} type="heatmap" width="600" />
      </div>
    );
  }

}

export default Heatmap;
