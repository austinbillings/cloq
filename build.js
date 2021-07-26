// build.js
const fs = require('fs')
const path = require('path')
const fileContents = stripComments(fs.readFileSync(path.resolve(__dirname, 'cloq.js'), 'utf8'))

function stripComments (text) {
    return text
        .split('\n')
        .map(t => t.substring(0, t.indexOf('//') === -1 ? t.length : t.indexOf('//')))
        .filter(line => line.trim().length)
        .join('\n')
}

const exportsList = `{
    formatDate,
    isBefore,
    isAfter,
    isConcurrent
}`

const commonJs = fileContents.concat('\n', `module.exports = ${exportsList}`)
fs.writeFileSync(path.resolve(__dirname, 'lib', 'commonjs.js'), commonJs, 'utf8')

const es6 = fileContents.concat('\n', `export ${exportsList};`)
fs.writeFileSync(path.resolve(__dirname, 'lib', 'es6.js'), es6, 'utf8')
