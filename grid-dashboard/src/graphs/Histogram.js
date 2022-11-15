import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Histogram extends Component {

  constructor (props) {
    super(props)
    Histogram.enableStringFormatting()

    // TODO: How to get this dynamically?
    this.label = 'LMP'
    this.data = [30, 40, 35, 50, 49, 60, 70, 91, 125, 32, 42, 37, 52, 48, 62, 72, 93, 123]

    // Get the mean, median, and standard deviation of the data
    this.statistics = Histogram.getStatistics(this.data)
    
    // Create a histogram w/ 10 bins
    const numOfBuckets = 10;
    this.min = Math.min(...this.data);
    this.max = Math.max(...this.data);
    this.interval = (this.max-this.min) / numOfBuckets;
    this.bins = Histogram.dataToBins(this.data, numOfBuckets, this.min, this.max, this.interval)

    // find the tallest bin (for graph scaling)
    this.tallest_bin = 0
    for (let i = 0; i < this.bins.length; i++) {
      if (this.bins[i].y > this.tallest_bin) {
        this.tallest_bin = this.bins[i].y
      }
    }
    // console.log(bins); //debug

    const roundToDecimals = (num, numDecimals) => {
      let multiplier = Math.pow(10, numDecimals)
      return Math.round((num + Number.EPSILON) * multiplier) / multiplier
    }
    
    // Adapted from: https://stackoverflow.com/questions/74419893/make-a-histogram-in-apexcharts-js
    this.state = {
      series: [{name: ' ', data: this.bins}],

      options: {
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
          min: this.min,
          max: this.max,
          tickAmount: this.bins.length,
          labels: {
            formatter: (x) => roundToDecimals(x, 2),
            style: { colors: 'white' }
          },
          title: {
            text: this.label,
            offsetY: 70,
            style: {
              fontSize:  '15px',
              color:  'white'
            },
          },
          axisBorder: {
            color: "white"
          }
          
        },
        yaxis: {
          title: {
            text: "Percent",
            style: {
              fontSize:  '15px',
              color:  'white'
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
              return this.label + " " + left + "-" + right;
            }
          },
          y: {
            formatter: (y) => {
              return roundToDecimals(y, 2) + '%';
            }
          }
        },
        title: {
          text: '{0} Distribution'.format(this.label),
          align: 'left',
          margin: 10,
          offsetX: 50,
          offsetY: 20,
          style: {
            fontSize:  '18px',
            fontWeight:  'bold',
            color:  'white'
          },
        },
        subtitle: {
          text: 'Median: {0} Mean: {1} Standard Deviation: {2}'.format(this.statistics.median.toFixed(2), this.statistics.mean.toFixed(2), this.statistics.std_dev.toFixed(2)),
          align: 'right',
          margin: 5,
          floating: true,
          offsetY: 25,
          style: { color: 'white' },
      }
      } //end options
    } //end state

  }

  // This is the only way I could get string formatting to work
  // ex. "Hi {0}".format('Spencer')
  static enableStringFormatting() {
    // First, checks if it isn't implemented yet.
    if (!String.prototype.format) {
      String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
      };
    }
  }

  // Calculates some useful statistics: mean, median, and standard deviation
  static getStatistics(data){
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

    return {median: median, mean: mean, std_dev: std_dev}
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
        <Chart options={this.state.options} series={this.state.series} type="bar" width="600" />
      </div>
    );
  }

}

export default Histogram;
