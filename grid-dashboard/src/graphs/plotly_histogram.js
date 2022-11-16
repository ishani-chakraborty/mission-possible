import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class PlotlyHistogram extends Component {

    constructor(props) {
        super(props)
        this.x = [1, 2, 2, 3, 4, 9]
        this.y = [2, 5, 3, 8]
    }

    render() {
        return (
            <Plot
                data={[
                    {type: 'histogram', x: this.x, xbins: {
                        end: 10, 
                        size: 1, 
                        start: 0
                      }},
                      {type: 'histogram', x: this.x, xbins: {
                        end: 10, 
                        size: 1, 
                        start: 0
                      }, xaxis: 'x2',
                        yaxis: 'y2',
                    },
                ]}
                layout={
                    { width: 640,
                      height: 480,
                      title: 'A Fancy Plot',
                      grid:{rows: 2, columns: 1, pattern: 'independent'}
                    }
                }
            />
        );
    }
}

export default PlotlyHistogram;