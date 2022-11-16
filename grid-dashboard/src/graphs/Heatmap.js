import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Heatmap extends Component {
  constructor (props) {
    super(props)

    //TODO: how to get this, use the MAPE formula
    let my_data = [2, 4, 6, 8, 10, 4, 14, 18, 18, 24, 22, 20]
    let my_data_2d = []
    for (let i = 1; i <= 24; i++) {
      my_data_2d.push(my_data)
    }

    // from the data, create the series
    let my_series = []
    for (let i = 1; i <= 24; i++) {
      let name = i.toString().padStart(2, '0') // pad with zeros
      my_series.push({name: name, data: my_data_2d[i-1]})
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
          text: 'HeatMap Chart (Single color)',
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

  render() {

    return (
      <div className="heatmap">
        <Chart options={this.state.options} series={this.state.series} type="heatmap" width="600" />
      </div>
    );
  }

}

export default Heatmap;
