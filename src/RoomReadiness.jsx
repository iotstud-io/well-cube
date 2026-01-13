import React, { Activity } from 'react'

import { 
    computeIndoorHealthIndex,
    describeIndoorHealth,
    formatLux,
    handleTemp,
    luxToColor,
    roomReady,
    tempColor
} from './Functions'

const RoomReadiness = ({ 
    title='',
    theme,
    temp_celcius=null, 
    temp_fahrenheit=null, 
    brightness_lux=null,
    co2=null, 
    tvoc=null,
    pm25=0,
    pm10=0,
    settings={},
}) => {

    let format = 'f'

    if(settings?.temperature_format === 'c') {
        format = 'c'
    }

    const { temperature, temperature_formatted } = handleTemp(format, temp_fahrenheit, temp_celcius)
    const tcolor = tempColor(temperature, format, theme)
    const index = computeIndoorHealthIndex({pm25, pm10, co2, tvoc })
    const health = describeIndoorHealth(index, theme)
    const readiness = roomReady(index, temperature, brightness_lux)
    const brightness_color = luxToColor(brightness_lux)

    const root_style = {
        width: '100%',
        height: '100%',
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        padding: '11px 15px',
        border: '1px solid transparent',
        borderRadius: '10px',
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
             linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`
    }

    const readiness_score_style = {
        flexShrink: 0,
        borderRadius: '50%',
        fontWeight: 'bold',
        fontSize: '26px',
        paddingTop: '35px',
        margin: '0 5px 0 0',
        width: '120px',
        height: '120px',
        textAlign: 'center',
        backgroundColor: theme.palette.background.paper
    }

    const sub_scores_style = {
        flexShrink: 0,
        borderRadius: '50%',
        paddingTop: '15px',
        margin: '6px 0 0 0',
        width: '65px',
        height: '65px',
        textAlign: 'center',
        backgroundColor: theme.palette.background.paper,
    }

    return <div className='flx justify-center align-center' style={root_style}>

        <div className='flx justify-center align-center gap10 wrap'>

            <div style={{
                ...readiness_score_style, 
                flex: '0 0 120px',
                outline: `3px solid ${readiness.isReady ? theme.palette.success.main: theme.palette.error.dark}`
            }}>
                {readiness.isReady ? 'Ready': 'Unready'}
            </div>

            <div style={{
                flex: '1 1 260px',
                minWidth: '260px',
            }}>

                <div className='flx justify-center align-center gap20 wrap'>

                    <div style={{...sub_scores_style, outline: `3px solid ${health.color}`}}>
                        <div style={{fontWeight: 'bold'}}>{index}</div>
                        <div style={{fontSize: '12px', lineHeight: '8px'}}>AQI</div>
                    </div>

                    <div style={{...sub_scores_style, outline: `3px solid ${tcolor}`}}>
                        <div style={{fontWeight: 'bold'}}>{temperature_formatted}</div>
                        <div style={{fontSize: '12px', lineHeight: '8px'}}>Temp</div>
                    </div>
                    
                    <div style={{...sub_scores_style, outline: `3px solid ${brightness_color}`}}>
                        <div style={{fontWeight: 'bold'}}>{formatLux(brightness_lux)}</div>
                        <div style={{fontSize: '12px', lineHeight: '8px'}}>LUX</div>
                    </div>

                </div>

                <div className='txt-center' style={{
                    marginTop: '10px',
                    whiteSpace: 'pre-line'
                }}>
                    {readiness.explanation}
                </div>
        
            </div>

        </div>
    </div>
}

export default RoomReadiness