import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Histogram extends Component {

  // TODO: URGENT: I fricked something up so now the dropdowns don't align with their titles 

  constructor (props) {
    super(props)

    // TODO: How to get this dynamically?
    // This data in this format is exactly what the graph needs
    this.passed_data = {
      metric: 'LMP',
      base_case: [30, 40, 35, 50, 49, 60, 70, 91, 125, 32, 42, 37, 52, 48, 62, 72, 93, 123],
      scenario_to_compare: [35, 45, 40, 55, 54, 65, 75, 96, 130, 37, 47, 42, 57, 53, 67, 77, 98, 127], //+5
      scenario_name: 'Scenario 1'
    }
    
    // from the passed data, construct this information
    // List[number] : the metric for each datapoint
    this.data1 = this.passed_data.base_case
    this.data2 = this.passed_data.scenario_to_compare

    // Get the mean, median, and standard deviation of the data
    let statistics1 = Histogram.getStatistics(this.data1)
    let statistics2 = Histogram.getStatistics(this.data2)
    this.statisticsString1 = 'Median: ' + statistics1.median + ' Mean: ' + statistics1.mean + ' Std Deviation: ' + statistics1.std_dev;
    this.statisticsString2 = 'Median: ' + statistics2.median + ' Mean: ' + statistics2.mean + ' Std Deviation: ' + statistics2.std_dev;
    
    // Create a histogram w/ 10 bins using the min/max of the two lists
    const numOfBuckets = 10;
    this.abs_min = Math.min( Math.min(...this.data1), Math.min(...this.data2) )
    this.abs_max = Math.max( Math.max(...this.data1), Math.max(...this.data2) )
    this.interval = (this.abs_max - this.abs_min) / numOfBuckets;
    this.bins1 = Histogram.dataToBins(this.data1, numOfBuckets, this.abs_min, this.abs_max, this.interval)
    this.bins2 = Histogram.dataToBins(this.data2, numOfBuckets, this.abs_min, this.abs_max, this.interval)
    // console.log(bins1); //debug

    // find the tallest bin (for graph scaling)
    this.tallest_bin = 0
    for (let i = 0; i < numOfBuckets; i++) {
      if (this.bins1[i].y > this.tallest_bin) {
        this.tallest_bin = this.bins1[i].y
      }
      if (this.bins2[i].y > this.tallest_bin) {
        this.tallest_bin = this.bins2[i].y
      }
    }

    // rounds a number to at most numDecimals decimals
    const roundToDecimals = (num, numDecimals) => {
      let multiplier = Math.pow(10, numDecimals)
      return Math.round((num + Number.EPSILON) * multiplier) / multiplier
    }

    // returns a JSON that represents how the graph is customized
    // each graph has slightly different options, so this is a function 
    const options = (id) => {
      // id===1 when base case => 1st set of data/statistics
      // id===2 when scenario to compare
      let scenario = (id===1) ? 'Base Case' : this.passed_data.scenario_name;
      let x_title =  (id===1) ? '' : this.passed_data.metric; // Only display title on bottom
      let stats =    (id===1) ? this.statisticsString1 : this.statisticsString2

      return {
        chart: {
          id: scenario,
          group: 'histo', //makes them synchronized charts
          type: 'bar',
          height: 300
        },
        plotOptions: {
          bar: {
            columnWidth: "92%",
            borderRadius: 2
          }
        },
        fill: {
          colors: "#ff4040",
          opacity: 0.7
        },
        stroke: {
          width: 2,
          colors: ["#ee8080"]
        },
        dataLabels: { enabled: false },
        grid: {
          yaxis: {
            lines: { show: true }
          }
        },
        xaxis: {
          type: "numeric",
          min: this.abs_min,
          max: this.abs_max,
          tickAmount: numOfBuckets,
          labels: {
            formatter: (x) => roundToDecimals(x, 2),
            style: { colors: 'white' }
          },
          title: {
            text: x_title,
            offsetY: 75,
            style: {
              fontSize:  '15px',
              color:  'white',
              fontWeight:  'normal',
            },
          },
          axisBorder: {
            color: "white"
          }
          
        },
        yaxis: {
          title: {
            text: "Percent (" + scenario + ")",
            style: {
              fontSize:  '15px',
              color:  'white',
              fontWeight:  'normal',
            },
          },
          min: 0,
          max: this.tallest_bin,
          forceNiceScale: true,
          labels: {
            formatter: (x) => roundToDecimals(x, 0),
            style: { colors: 'white' }
          },
          axisBorder: {
            show: true,
            color: "white"
          }
        },
        tooltip: {
          onDatasetHover: {
            highlightDataSeries: true
          },
          x: {
            formatter: (x) => {
              let left  = roundToDecimals((x - 0.5 * this.interval), 2)
              let right = roundToDecimals((x + 0.5 * this.interval), 2)
              return this.passed_data.metric + " " + left + "-" + right;
            }
          },
          y: {
            formatter: (y) => {
              return roundToDecimals(y, 2) + '%';
            }
          }
        },
        title: {
          text: scenario,
          floating: true,
          align: 'left',
          margin: 10,
          offsetX: 50,
          style: {
            fontSize:  '16px',
            fontWeight:  'bold',
            color:  'white'
          },
        },
        subtitle: {
          text: stats,
          floating: false,
          align: 'left',
          margin: 10,
          offsetX: 50,
          style: {
            fontSize:  '13px',
            fontWeight:  'normal',
            color:  'white'
          },
      }
      } //end options
    }

    // Adapted from: https://stackoverflow.com/questions/74419893/make-a-histogram-in-apexcharts-js
    this.state = {
      series1: [{name: ' ', data: this.bins1}],
      series2: [{name: ' ', data: this.bins2}],

      options1: options(1),
      options2: options(2)
    } //end state

  }


  // Calculates some useful statistics: mean, median, and standard deviation
  static getStatistics(data){
    const num_decimals = 2;
    const sorted = [...data].sort((a, b) => a - b); //numerical sort
    let median = 0;
    let mean = 0;
    let std_dev = 0;

    if (data.length !== 0) {
      // find the median
      let midpoint = Math.floor(sorted.length / 2);
      if (sorted.length % 2 === 1) { //odd length
        median = sorted[midpoint];
      } else { //even length, avg the 2 midpoints
        median = (sorted[midpoint - 1] + sorted[midpoint]) / 2;
      }

      //find the mean and std_dev
      mean = data.reduce((a, b) => a + b) / data.length;

      let meanSquareErr = data.map((k) => { return (k - mean)**2 });
      let sumErr = meanSquareErr.reduce((acc, curr)=> acc + curr, 0);
      std_dev = Math.sqrt(sumErr / data.length);
    }

    return {
      median:  median.toFixed(num_decimals),
      mean:    mean.toFixed(num_decimals),
      std_dev: std_dev.toFixed(num_decimals)
    }
  }


  // turn an array of data into bins with labels and counts
  static dataToBins(data, numOfBuckets, min, max, interval) {
    // Following: https://stackoverflow.com/questions/37445495/binning-an-array-in-javascript-for-a-histogram
    let bins = []

    //Setup Bins
    for (let i = 0; i < numOfBuckets; i++) {
      bins.push({
        maxNum: min + interval * (i+1),
        label: min + interval * (i+0.5),
        count: 0
      })
    }

    // Loop through data and add to bin's count
    for (let i = 0; i < data.length; i++) {
      let item = data[i];

      // The 2nd histogram's range may not be the same
      // So make sure we always find a bin for each item
      if (item > bins[numOfBuckets-1].maxNum) {
        bins[numOfBuckets-1].count++;
      } else {
        for (let j = 0; j < numOfBuckets; j++) {
          let bin = bins[j];
          if(item <= bin.maxNum) {
            bin.count++;
            break;  // An item can only be in one bin.
          }
        }
      }  
    }

    // Collect the bins into usable data (graphing by percent)
    let final_bins = []
    for (let i = 0; i < bins.length; i++) {
      final_bins.push({
        x: bins[i].label,
        y: 100 * bins[i].count / data.length
      });
    }

    return final_bins;
  }

  render() {
    
    return (
      <div className="histogram">
        <table>
          <tr>
            <Chart options={this.state.options1} series={this.state.series1} type="bar" width="600" />
          </tr>
          <tr>
            <Chart options={this.state.options2} series={this.state.series2} type="bar" width="600" />
          </tr>
			  </table>
      </div>
    );
  }

}

export default Histogram;