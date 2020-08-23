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
      <coingecko-coin-compare-chart-widget  coin-ids="kingdom-game-4-0" currency="usd" locale="en"></coingecko-coin-compare-chart-widget>
    </div>
    )
}