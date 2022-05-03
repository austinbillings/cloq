function formatDate (date, givenOptions = 'compact', locale = undefined) {
    const parsedOptions = parseOptions(givenOptions);
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
    const formattedDate = (new Date(date)).toLocaleDateString(locale || 'en-US', localeOptions);
    const ordinalDayPattern = /[^0-9-]([0-9]?[0-9])(?=,| |$)/;
    const splitResults = formattedDate.split(ordinalDayPattern)
    const [preOrdinal, ordinal, postOrdinal] = splitResults;
    const assembledDate = !options.ordinals
        ? formattedDate
        : `${preOrdinal || ''} ${ordinal}${options.html ? `<sup>${getOrdinalText(ordinal)}</sup>` : getOrdinalText(ordinal)}${postOrdinal || ''}`
    return options.commas ? assembledDate : assembledDate.split(',').join('');
}
function parseOptions (options) {
    switch (true) {
        case Array.isArray(options):
            return newObjectWithKeys(options, true);
        case typeof options === 'string':
            const optionKeys = options.split('-').map(opt => opt.toLowerCase());
            return newObjectWithKeys(optionKeys, true);
        case typeof options === 'object':
            return options;
        default:
            throw new Error('cloq: options should be string, array, or object');
    }
}
function newObjectWithKeys (keys = [], defaultValue = null) {
    return Array.from(keys)
        .reduce((o, k) => ({ ...o, [k]: defaultValue }), {});
}
function getOrdinalText (ordinal = '') {
    switch (ordinal[ordinal.length - 1]) {
        case '1':
            return ordinal.length === 2 && ordinal[0] === '1'
                ? 'th' 
                : 'st';
        case '2':
            return ordinal.length === 2 && ordinal[0] === '1'
                ? 'th' 
                : 'nd';
        case '3':
            return ordinal.length === 2 && ordinal[0] === '1'
                ? 'th' 
                : 'rd';
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
    formatDate,
    isBefore,
    isAfter,
    isConcurrent
};