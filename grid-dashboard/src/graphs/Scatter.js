import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Scatter extends Component {

  constructor (props) {
    super(props)

    // TODO: How to get this dynamically?
    this.metric = "LMP"
    this.scenario_name = "Scenario"
    this.label = 'Node'
    this.base_case = [30, 40, 35, 50, 49, 60, 70, 91, 125, 32, 42, 37, 52, 48, 62, 72, 93, 120]
    this.scenario  = [28, 42, 37, 48, 47, 60, 70, 84, 120, 35, 43, 36, 50, 50, 50, 72, 93, 60]
    
    // TODO: This will require pairing json objects by date, rather than simply lining up indeces
    this.data = []
    for (let i = 0; i < Math.min(this.base_case.length, this.scenario.length); i++) {
      this.data.push( [this.base_case[i], this.scenario[i]] );
    }
    // console.log(this.data) // debug, should look like [ [x1, y1], [x2, y2], ..., [xn, yn] ]

    let max_x = Math.max(...this.base_case)
    let max_y = Math.max(...this.scenario)

    // like [ [0, b], [x, mx+b] ], where x=max_x
    this.best_fit = Scatter.bestFit(this.data, max_x)

    let max = Math.max(max_x, max_y)
    this.ideal_fit = [ [0, 0], [max, max]]


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
            text: this.metric + " " + this.scenario_name,
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
          text: this.metric + " Comparison on " + this.label,
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

  static bestFit(data, max_x) {
    // using a linear least squares algorithim
    // following: https://stackoverflow.com/questions/12946341/algorithm-for-scatter-plot-best-fit-line

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
    
    return [[0, -b], [max_x, m*max_x - b]]
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
