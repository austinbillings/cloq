const assert = require('assert');
const { formatDate, isBefore, isAfter, isConcurrent } = require('../lib/commonjs')

const DATE_PAST = '2017-08-10T15:25:14.00-04:00'
const DATE_FUTURE = '2052-08-17T00:00:00.00-04:00'
const DATE_NOW = (new Date()).toISOString()

const dateOptionTests = {
    'full': 'August 10',
    'full-weekdays': 'Thursday August 10',
    'full-compact': 'August 10',
    'full-compact-ordinals': 'August 10th',
    'full-years': 'August 10 2017',
    'full-years-ordinals': 'August 10th 2017',
    'full-years-ordinals-html': 'August 10<sup>th</sup> 2017',
    'full-years-weekdays': 'Thursday August 10 2017',
    'full-years-commas': 'August 10, 2017',
    'full-years-commas-weekdays': 'Thursday, August 10, 2017',
    'compact': '8/10',
    'compact-weekdays': 'Thu 8/10',
    'compact-precise': '08/10',
    'precise': 'Aug 10',
    'compact-years': '8/10/17',
    'compact-years-weekdays': 'Thu 8/10/17',
    'compact-years-precise': '08/10/2017'
}

describe('cloq', function () {
    describe('#formatDate', function () {
        it('should format as compact by default', function () {
            const actual = formatDate(DATE_PAST);
            assert.equal(actual, '8/10')
        })

        it('should properly format empty options', function () {
            const actual = formatDate(DATE_PAST, '');
            assert.equal(actual, 'Aug 10')
        })

        Object.entries(dateOptionTests).forEach(([ optionString, expected ]) => {
            it (`should properly format "${optionString}"`, function () {
                const actual = formatDate(DATE_PAST, optionString);
                assert.equal(actual, expected)
            })
        });
    });

    describe('#isBefore', function () {

        it('should recognize that a past date isBefore a future date', function () {
            const expected = true
            const actual = isBefore(DATE_PAST, DATE_FUTURE)

            assert.equal(expected, actual)
        })

        it('should deny that a future date isBefore a past date', function () {
            const expected = false
            const actual = isBefore(DATE_FUTURE, DATE_PAST)

            assert.equal(expected, actual)
        })

        it('should deny that a future date isBefore now', function () {
            const expected = false
            const actual = isBefore(DATE_FUTURE)

            assert.equal(expected, actual)
        })

        it('should recognize that a past date isBefore now', function () {
            const expected = true
            const actual = isBefore(DATE_PAST)

            assert.equal(expected, actual)
        })
    });

    describe('#isAfter', function () {
        it('should recognize that a future date isAfter a past date', function () {
            const expected = true
            const actual = isAfter(DATE_FUTURE, DATE_PAST)

            assert.equal(expected, actual)
        })

        it('should deny that a past date isAfter a future date', function () {
            const expected = false
            const actual = isAfter(DATE_PAST, DATE_FUTURE)

            assert.equal(expected, actual)
        })

        it('should deny that a past date isAfter now', function () {
            const expected = false
            const actual = isAfter(DATE_PAST)

            assert.equal(expected, actual)
        })

        it('should recognize that a future date isAfter now', function () {
            const expected = true
            const actual = isAfter(DATE_FUTURE)

            assert.equal(expected, actual)
        })
    });

    describe('#isConcurrent', function () {
        it ('should recognize the same date put two ways as the same date', function () {
            const expected = true;
            const actual = isConcurrent(DATE_FUTURE, 'August 17, 2052')

            assert.equal(expected, actual)
        })

        it('should deny that two different dates coincide', function () {
            const expected = false;
            const actual = isConcurrent(DATE_FUTURE, DATE_PAST)

            assert.equal(expected, actual)
        })
    });
});
