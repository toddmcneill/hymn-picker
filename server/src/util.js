const crypto = require('crypto')
const dateFns = require('date-fns')

function createHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data), 'utf8').digest('base64')
}

function getYearAndWeek(date) {
  const year = dateFns.getYear(date)
  let week = dateFns.getWeek(date)

  // Workaround for getWeek not having a way to specify the year. For example, 2023-12-31 is
  // set to week 1 of 2024 when it should be week 53 of 2023. A counter case is 2022-12-31, which
  // is set to week 53, but reconstructing with week 53 sets the date to 2022-12-25.
  const reconstructed = dateFns.format(dateFns.setWeek(dateFns.setDay(new Date(year, 0), 0), week), 'yyyy-MM-dd')
  if (reconstructed !== dateFns.format(date, 'yyyy-MM-dd') && week < 52) {
    week += 52
  }

  return { year, week }
}

module.exports = {
  getYearAndWeek,
  createHash
}
