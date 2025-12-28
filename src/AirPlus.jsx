import React, { Activity } from 'react'
import { 
    colorFor,
    computeIndoorHealthIndex, 
    describeIndoorHealth,
    roundUpIfNeeded,
    c_to_f,
    f_to_c,
    tempColor
} from './Functions'

import HistoricChart from './HistoricChart'

const small_chip ={
    padding: '5px',
    fontSize: '16px',
}

const dot_style = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '12px',
}

const AirPlus = ({ 
    title='Climate Sensors',
    theme,
    historic=[],
    temp_celcius=null, 
    temp_fahrenheit=null, 
    humidity=0,
    co2=null, 
    tvoc=null,
    pm25=0,
    pm10=0,
    timemstamp_unix=Date.now()/1000,
    settings={},
}) => {

    const index = computeIndoorHealthIndex({pm25, pm10, co2, tvoc })
    const health = describeIndoorHealth(index, theme)

    let format = 'f'
    let temperature = null
    let show_chart = true

    if(settings?.show_chart === false) {
        show_chart = false
    }

    if(settings?.temperature_format === 'c') {
        format = 'c'
    }

    if(format === 'c') {

        if(temp_celcius !== null) {
            temperature = temp_celcius
        } 

        if(temp_celcius === null && temp_fahrenheit !== null) {
            temperature = f_to_c(temp_fahrenheit)
        }        
    }

    if(format === 'f') {

        if(temp_fahrenheit !== null) {
            temperature = temp_fahrenheit
        }

        if(temp_fahrenheit === null && temp_celcius !== null) {
            temperature = c_to_f(temp_celcius)
        }
    }

    const t = temperature !== null ? `${roundUpIfNeeded(temperature)}°${format}`: '--'
    const h = humidity !== null ? `${roundUpIfNeeded(humidity)}% RH`: ''
    const tcolor = tempColor(temperature, format, theme)

    const aqi_style = {
        flexShrink: 0,
        borderRadius: '50%',
        padding: '28px',
        margin: '6px 0 0 0',
        width: '150px',
        height: '150px',
        textAlign: 'center',
        backgroundColor: theme.palette.background.paper,
        outline: `3px solid ${health.color}`,
    }

    const chip ={
        width: '95px',
        borderRadius: '20px',
        backgroundColor: theme.palette.background.paper,
    }

    const root_style = {
        maxWidth: '527px',
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        padding: 0,
        border: '1px solid transparent',
        borderRadius: '10px',
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
             linear-gradient(135deg, ${theme.palette.background.paper}, #000000) border-box`
    }

    return <div style={root_style}>
        <div className='flx align-center justify-center gap20 wrap' style={{padding: '15px'}}>

            <div style={aqi_style}>
                <div style={{fontSize: '16px', lineHeight: '12px'}}>AQI</div>
                <div style={{fontSize: '60px', lineHeight: '54px'}}>{index}</div>
                <div style={{fontSize: '16px', fontWeight: 'bold', lineHeight: '25px'}}>{health.label}</div>
            </div>

            <div  style={{padding: 0, margin: 0}}>

                <div className='flx align-center justify-center wrap' style={{fontWeight: 'bold', fontSize: '20px', marginBottom: '4px'}}>

                    <span>{title}</span>
                    
                    <span style={{fontSize: '14px', fontStyle: 'italic', marginLeft: '10px', fontWeight: 'normal', color: theme.palette.text.secondary}}>
                        As of {new Date(timemstamp_unix * 1000).toLocaleTimeString()}
                    </span>

                </div>

                <div className='flx align-center justify-center gap10 wrap' style={{maxWidth: '310px', marginTop: '10px'}}>
                
                    <div className='flx align-center justify-center' style={{...chip, ...small_chip}}>

                        <div style={{
                            ...dot_style, 
                            backgroundColor: colorFor(pm25, 0, 1000, theme),
                            boxShadow: `0 0 4px 5px ${colorFor(pm25, 0, 1000, theme)}`
                        }}></div>

                        <div>
                            <div style={{fontSize: '13px', color: theme.palette.text.secondary }}>PM2.5</div>
                            <div>{Math.ceil(pm25)}</div>
                        </div>
                    </div>

                    <div className='flx align-center justify-center' style={{...chip, ...small_chip}}>

                        <div style={{
                            ...dot_style, 
                            backgroundColor: colorFor(pm10, 0, 1000, theme),
                            boxShadow: `0 0 4px 5px ${colorFor(pm10, 0, 1000, theme)}`
                        }}></div>

                        <div>
                            <div style={{fontSize: '13px', color: theme.palette.text.secondary }}>PM10</div>
                            <div>{Math.ceil(pm10)}</div>
                        </div>
                    </div>

                    <div className='flx align-center justify-center' style={{...chip, ...small_chip}}>

                        <div style={{
                            ...dot_style, 
                            backgroundColor: colorFor(tvoc, 0, 1000, theme),
                            boxShadow: `0 0 4px 5px ${colorFor(tvoc, 0, 1000, theme)}`
                        }}></div>

                        <div>
                            <div style={{fontSize: '13px', color: theme.palette.text.secondary }}>TVOC</div>
                            <div>{Math.ceil(tvoc)}</div>
                        </div>
                    </div>
                            
                    <div className='flx align-center justify-center' style={{...chip, ...small_chip}}>
                        
                        <div style={{
                            ...dot_style, 
                            backgroundColor: colorFor(co2, 400, 5000, theme),
                            boxShadow: `0 0 4px 5px ${colorFor(co2, 400, 5000, theme)}`
                        }}></div>

                        <div>
                            <div style={{fontSize: '13px', color: theme.palette.text.secondary }}>CO&sup2;</div>
                            <div>{Math.ceil(co2)}</div>
                        </div>
                    </div>

                    <div className='flx align-center justify-center' style={{...chip, ...small_chip}}>

                        <div style={{
                            ...dot_style, 
                            backgroundColor: tcolor,
                            boxShadow: `0 0 4px 5px ${tcolor}`
                        }}></div>

                        <div>
                            <div style={{fontSize: '13px', color: theme.palette.text.secondary }}>Temp</div>
                            <div>{t}</div>
                        </div>
                    </div>

                    <div className='flx align-center justify-center' style={{...chip, ...small_chip}}>
                        <div>
                            <div style={{fontSize: '13px', color: theme.palette.text.secondary }}>Humidity</div>
                            <div>{h}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Activity mode={historic?.length > 0 && show_chart ? 'visible' : 'hidden'}>
            <HistoricChart historic={historic} theme={theme} />
        </Activity>

    </div>
}

export default AirPlus