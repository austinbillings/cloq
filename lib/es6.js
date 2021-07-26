function format (date, givenOptions = 'compact', locale = undefined) {
    const parsedOptions = typeof givenOptions === 'string'
        ? newObjectWithKeys(givenOptions.split('-').map(t => t.toLowerCase()), true)
        : Array.isArray(givenOptions)
            ? newObjectWithKeys(givenOptions, true)
            : givenOptions && typeof givenOptions === 'object'
                ? givenOptions
                : new Error('givenOptions should be string, array, or object')
    const option = s => parsedOptions[s] === true;
    const options = {
        compact: option('compact'),
        precise: option('precise'),
        full: option('full'),
        weekdays: option('weekdays'),
        years: option('years') || option('year'),
        commas: option('commas'),
        ordinals: option('ordinals'),
        html: option('html')
    };
    const weekdayOptions = options.weekdays ? { weekday: options.full ? 'long' : 'short' } : {};
    const yearOptions = !options.years ? {} : { year: options.compact && !options.precise ? '2-digit' : 'numeric' };
    const monthOptions = { month: options.full ? 'long' : options.compact ? options.precise ? '2-digit' : 'numeric' : 'short' };
    const dayOptions = { day: options.precise ? '2-digit' : 'numeric' };
    const localeOptions = { ...weekdayOptions, ...yearOptions, ...monthOptions, ...dayOptions };
    const formattedDate = (new Date(date)).toLocaleDateString(locale, localeOptions);
    const ordinalDayPattern = /[^0-9-]([0-9]?[0-9])(?=,| |$)/;
    const splitResults = formattedDate.split(ordinalDayPattern)
    const [preOrdinal, ordinal, postOrdinal] = splitResults;
    const assembledDate = !options.ordinals
        ? formattedDate
        : `${preOrdinal || ''} ${ordinal}${options.html ? `<sup>${getOrdinalText(ordinal)}</sup>` : getOrdinalText(ordinal)}${postOrdinal || ''}`
    return options.commas ? assembledDate : assembledDate.split(',').join('');
}
function newObjectWithKeys (keys = [], defaultValue = null) {
    return Array.from(keys)
        .reduce((o, k) => ({ ...o, [k]: defaultValue }), {});
}
function getOrdinalText (ordinal = '') {
    switch (ordinal[ordinal.length - 1]) {
        case '1':
            return 'st';
        case '2':
            return 'nd';
        case '3':
            return 'rd';
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
            return 'th';
        default:
            return '';
    }
}
function isBefore (dateA, dateB) {
    return dateB
        ? (new Date(dateA)).getTime() < (new Date(dateB)).getTime()
        : (new Date(dateA)).getTime() < Date.now()
}
function isAfter (dateA, dateB) {
    return dateB
        ? (new Date(dateA)).getTime() > (new Date(dateB)).getTime()
        : (new Date(dateA)).getTime() > Date.now()
}
function isConcurrent (dateA, dateB) {
    return dateB
        ? (new Date(dateA)).getTime() === (new Date(dateB)).getTime()
        : (new Date(dateA)).getTime() === Date.now()
}
export {
    format,
    isBefore,
    isAfter,
    isConcurrent
};