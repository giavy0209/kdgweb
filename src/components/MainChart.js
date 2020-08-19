import React from 'react'

import { Chart } from 'react-charts'
export default function App(){
    const data = React.useMemo(
        () => [{
          label: 'USDT',
          data: [
            [1, 1] , [2, 2], [3, 5],[4, 4],[5, 2]
          ]
        }],
        []
      )
    const axes = React.useMemo(
    () => [
        { primary: true, type: 'linear', position: 'bottom',show: true},
        { type: 'linear', position: 'left', show: true},
        { type: 'linear', position: 'right', show: true,},
    ],
    []
    )
    const series = React.useMemo(
    () => ({
        showPoints: false,
        type: 'area'
    }),
    []
    )

    return(
    <div className="chart-container" >
        <div className="title-filter">
          <div><p>KDG Price Chart</p></div>
          <div>
            <select>
              <option>7 Ngày</option>
            </select>
          </div>
        </div>
        <div className="note">
            <p><span className="yellow"></span> Market Cap</p>
            <p><span className="blue"></span> Price</p>
        </div>
        <div className="chart">
        <Chart  data={data} series={series} axes={axes} />
        </div>
    </div>
    )
}