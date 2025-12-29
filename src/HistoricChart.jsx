import React from 'react'
import { ResponsiveLine } from '@nivo/line'
import { transformData } from './Functions'

const HistoricChart = ({historic, theme}) => {

    const data = transformData(historic)
    const textColor = theme?.palette?.text?.secondary

    const containerStyle = { 
        width: '100%', 
        height: 275, 
        marginTop: 5, 
        padding: '15px 15px 15px 10px', 
        borderTop: `1px solid ${theme.palette.background.paper}` 
    }

    return <div style={containerStyle}>
        <ResponsiveLine /* or Line for fixed dimensions */
            curve="monotoneX"
            data={data}
            enableArea
            margin={{ top: 25, right: 14, bottom: 20, left: 40 }}
            yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false }}
            lineWidth={1.5}
            pointSize={5}
            pointColor={{ from: 'serieColor' }}
            pointBorderWidth={1.5}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            enableTouchCrosshair={true}
            useMesh={true}
            theme={{
                text: { fill: textColor },
                axis: {
                    legend: { text: { fill: textColor } },
                    ticks: { text: { fill: textColor } },
                },
                legends: {
                    text: { fill: textColor },
                },
                tooltip: {
                    container: {
                        color: theme.palette.text.primary,
                        background: theme.palette.secondary.main,
                        fontSize: 12
                    }
                },
                grid: {
                    line: {
                        stroke: theme.palette.background.paper,
                        strokeWidth: 1
                    }
                },
                crosshair: {
                    line: {
                        stroke: theme.palette.text.primary,
                        strokeWidth: 1,
                        strokeOpacity: 0.7
                    }
                }
            }}
            legends={[
                {
                    anchor: 'top',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: -25,
                    itemsSpacing: 8,
                    itemWidth: 50,
                    itemHeight: 18,
                    itemDirection: 'left-to-right',
                    symbolSize: 10,
                    symbolShape: 'circle',
                }
            ]}
            defs={[
                {
                    colors: [
                        {
                            color: 'inherit',
                            offset: 0
                        },
                        {
                            color: 'inherit',
                            offset: 100,
                            opacity: 0
                        }
                    ],
                    id: 'gradientA',
                    type: 'linearGradient'
                }
            ]}
            fill={[
                {
                    id: 'gradientA',
                    match: '*'
                }
            ]}
        />
    </div>
}

export default HistoricChart