const PRESSURE_UNITS = 0.750062;

export function capitalizeFirstLetter(str){
    if(!str) return ''

    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getPressureMm(hpa){
    return Math.round(hpa * PRESSURE_UNITS);
}

export function getTime(seconds){
    return new Date(seconds * 1000).toLocaleTimeString('ru-RU', {
        timeZone: 'Atlantic/Reykjavik'
    });
}