const account = require('./account')
const history = require('./history')
const hymn = require('./hymn')

module.exports = {
  ...account,
  ...history,
  ...hymn,
}
