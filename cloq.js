/* @date is
    anything that can be parsed by Date()
/* @givenOptions can be
    a string (options dash-separated),
    an array (of enabled option names),
    or an object (options as keys, booleans as values)
/* @locale is
    any locale which can be passed to Date.toLocaleDateString
---------------------------------------------------------   */

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
        // Formatting =======================================================================

        compact: option('compact'),
        // compact: use numbers & slashes (e.g., 3/21/19) instead of words & spaces

        precise: option('precise'),
        // precise-compact: use leading-zeros and full year numbers (e.g., 03/08/1995) instead of shorter values (e.g. 2/1/99)

        full: option('full'),
        // full: spell out day- and month-names (e.g., Friday and August) over short versions (e.g., Fri and Aug)

        // Include / exclude =======================================================================

        weekdays: option('weekdays'),
        // weekdays: include day-of-week (e.g., Wed Mar 21 2020)

        years: option('years') || option('year'),
        // years: include year (e.g., May 23 2020) instead of not (e.g., May 23)

        commas: option('commas'),
        // includes commas (e.g., Saturday, June 20, 2020)

        ordinals: option('ordinals'),
        // includes ordinals (e.g., "th" in 4th and "nd" in 22nd)

        html: option('html')
        // use HTML formatting on  ordinals (e.g., August 24<sup>th</sup>)
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
