import { memo, useMemo } from 'react'
import { ResponsiveLine } from '@nivo/line'
import { transformData } from './Functions'

const HistoricChart = ({historic, theme}) => {

    const data = useMemo(() => transformData(historic), [historic])
    const textColor = theme?.palette?.text?.secondary
    const chartTheme = useMemo(() => ({
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
    }), [textColor, theme])

    const legends = useMemo(() => [
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
    ], [])

    const defs = useMemo(() => [
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
    ], [])

    const fill = useMemo(() => [
        {
            id: 'gradientA',
            match: '*'
        }
    ], [])

    const margin = useMemo(() => ({ top: 25, right: 14, bottom: 20, left: 40 }), [])
    const yScale = useMemo(() => ({ type: 'linear', min: 0, max: 'auto', stacked: false }), [])
    const pointColor = useMemo(() => ({ from: 'serieColor' }), [])
    const pointBorderColor = useMemo(() => ({ from: 'serieColor' }), [])

    const containerStyle = { 
        width: '100%', 
        height: 275, 
        marginTop: 5, 
        padding: '15px 15px 15px 10px', 
        borderTop: `1px solid ${theme.palette.background.paper}` 
    }

    return <div style={containerStyle}>
        <ResponsiveLine
            curve="monotoneX"
            data={data}
            enableArea
            margin={margin}
            yScale={yScale}
            lineWidth={1.5}
            pointSize={5}
            pointColor={pointColor}
            pointBorderWidth={1.5}
            pointBorderColor={pointBorderColor}
            pointLabelYOffset={-12}
            enableTouchCrosshair={true}
            useMesh={true}
            theme={chartTheme}
            legends={legends}
            defs={defs}
            fill={fill}
        />
    </div>
}

export default memo(HistoricChart)
