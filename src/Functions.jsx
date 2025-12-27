const WELL_CUBE_LIMITS = {
    pm: { min: 0, max: 1000 },
    tvoc: { min: 0, max: 1000 },
    co2: { min: 0, max: 5000 }
}

const thresholds = {
    pm25: { good: 8, bad: 55 },
    pm10: { good: 15, bad: 150 },
    co2: { good: 800, bad: 2000 },
    tvoc: { good: 0.3, bad: 1.0 }
}

const pollutantScore = (key, value) => {

    if(value == null) return null

    const th = thresholds[key] || {}
    const limits = key.startsWith('pm') ? WELL_CUBE_LIMITS.pm : (WELL_CUBE_LIMITS[key] || WELL_CUBE_LIMITS.pm)
    const min = limits.min
    const max = limits.max
    const good = th.good ?? min
    //const bad = th.bad ?? max

    if(value <= good) return 100
    if(value >= max) return 0

    const ratio = (value - good) / (max - good)
    const score = Math.round(100 * (1 - ratio))

    return Math.max(0, Math.min(100, score))
}

export const computeIndoorHealthIndex = ({ pm25, pm10, co2, tvoc }) => {

    const pm25Score = pollutantScore('pm25', pm25)
    const pm10Score = pollutantScore('pm10', pm10)

    let particleScore = null

    if(pm25Score != null && pm10Score != null) {
        particleScore = Math.min(pm25Score, pm10Score)
    } else {
        particleScore = pm25Score ?? pm10Score
    }

    const co2Score = pollutantScore('co2', co2)
    const tvocScore = pollutantScore('tvoc', tvoc)

    const scores = [particleScore, co2Score, tvocScore]
        .filter(s => typeof s === 'number')

    if(!scores.length) return null

    return scores.reduce((min, s) => (s < min ? s : min), 100)
}

export const describeIndoorHealth = (index, th) => {
    if(index == null) return { label: 'unknown', color: th.palette.info.light }
    if(index >= 90) return { label: 'excellent', color: th.palette.success.main }
    if(index >= 75) return { label: 'good', color: th.palette.success.light }
    if(index >= 60) return { label: 'fair', color: th.palette.warning.light }
    if(index >= 40) return { label: 'poor', color: th.palette.error.light }
    return { label: 'very poor', color: th.palette.error.main }
}

export const roundUpIfNeeded = value => {

    const n = Number(value)

    if(!Number.isFinite(n)) return value

    if(Number.isInteger(n)) return n

    return Math.ceil(n)
}

export const c_to_f = c => (c * 9 / 5) + 32
export const f_to_c = f => (f - 32) * 5 / 9

export const colorFor = (v, min, max, th) => {

    if(!Number.isFinite(v)) return th.palette.text.disabled

    const t = min === max ? (v <= min ? 0 : 1) : Math.max(0, Math.min(1, (v - min) / (max - min)))
    const c = [th.palette.success.main, th.palette.warning.light, th.palette.warning.dark, th.palette.error.main]

    return c[Math.min(3, Math.floor(t * 4))]
}

export const tempColor = (t, u, th) => (
    f => {
        const colors = [
            th.palette.secondary.dark,
            th.palette.secondary.light,
            th.palette.info.main,
            th.palette.info.light,
            th.palette.success.light,
            th.palette.success.main,
            th.palette.warning.light,
            th.palette.error.light,
            th.palette.error.main
        ]

        if(f <= 0) return colors[0]
        if(f <= 16) return colors[1]
        if(f <= 32) return colors[2]
        if(f <= 55) return colors[3]
        if(f <= 65) return colors[4]
        if(f <= 80) return colors[5]
        if(f <= 90) return colors[6]
        if(f <= 100) return colors[7]
        if(f >= 101) return colors[8]
    }
)(u === 'f' ? t : (t * 9 / 5 + 32))

export const transformData = input => {

    const historic = Array.isArray(input) ? input : input?.historic

    if(!Array.isArray(historic) || historic.length === 0) return []

    const firstRow = historic.find(r => r && typeof r === 'object')

    if(!firstRow) return []

    const keys = Object.keys(firstRow).filter(k => k !== 'timestamp')

    return keys
        .map(key => ({
            id: key,
            data: historic
                .filter(p => p && typeof p.timestamp !== 'undefined' && p[key] !== undefined && p[key] !== null)
                .map(p => ({
                    x: new Date(p.timestamp * 1000).toLocaleTimeString(undefined, {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    y: roundUpIfNeeded(Number(p[key])),
                })),
        }))
        .filter(series => series.data.length > 0)
}