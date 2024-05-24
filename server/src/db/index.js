const history = require('./history')
const hymn = require('./hymn')
const user = require('./user')

module.exports = {
  ...history,
  ...hymn,
  ...user,
}
