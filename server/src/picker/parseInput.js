const dateFns = require('date-fns')
const { HymnTypes } = require('./enums')
const { createHash } = require('../util')

function mapHymnData(row) {
  const hymnData = {
    hymnNumber: parseInt(row.Number, 10),
    title: row.Title,
    energyLevel: mapMoodToNumber(row.Mood), // 1-5
    hymnLength: parseInt(row.Length, 10), // rounded to nearest minute
    familiarity: parseInt(row.Familiarity, 10), // 1-5
    isLimited: !!row.Limited, // not generally appropriate
    isEaster: !!row.Easter,
    isPatriotic: !!row.Patriotic,
    isPioneer: !!row.Pioneer,
    isThanksgiving: !!row.Thanksgiving,
    isChristmas: !!row.Christmas,
    isNewYear: !!row.NewYear,
    isSacrament: !!row.Sacrament,
    isFasting: !!row.Fasting,
    isClosing: !!row.Closing,
    isDismiss: !!row.Dismiss,a
  }

  return {
    ...hymnData,
    hash: createHash(hymnData),
  }
}

function mapMoodToNumber(mood) {
  // Map 1: low energy - 5: high energy
  switch (mood) {
    case 'Boldly': return 5
    case 'Brightly': return 3
    case 'Broadly': return 2
    case 'Calmly': return 1
    case 'Cheerfully': return 5
    case 'Confidently': return 4
    case 'Earnestly': return 2
    case 'Energetically': return 4
    case 'Enthusiastically': return 3
    case 'Expressively': return 1
    case 'Exultantly': return 4
    case 'Fervently': return 2
    case 'Firmly': return 3
    case 'Gently': return 1
    case 'Humbly': return 1
    case 'Joyfully': return 3
    case 'Jubilantly': return 4
    case 'Lightly': return 4
    case 'Majestically': return 2
    case 'Meekly': return 1
    case 'Peacefully': return 1
    case 'Prayerfully': return 1
    case 'Reflectively': return 1
    case 'Resolutely': return 3
    case 'Reverently': return 1
    case 'Smoothly': return 2
    case 'Solemnly': return 1
    case 'Tenderly': return 2
    case 'Thankfully': return 2
    case 'Thoughtfully': return 2
    case 'Triumphantly': return 4
    case 'Vigorously': return 5
    case 'With contemplation': return 2
    case 'With conviction': return 4
    case 'With devotion': return 3
    case 'With dignity': return 3
    case 'With energy': return 5
    case 'With exultation': return 4
    case 'With motion': return 3
    case 'With spirit': return 5
    case 'With vigor': return 5
    case 'Worshipfully': return 1
    default: return 3
  }
}

function mapHistory(row) {
  return {
    week: dateFns.differenceInWeeks(dateFns.parseISO(row.Date), Date.now(), { roundingMethod: 'ceil' }),
    hymnNumber: parseInt(row.Number, 10),
    hymnType: mapLetterToHymnType(row.HymnType)
  }
}

function mapLetterToHymnType(letter) {
  switch (letter) {
    case 'O': return HymnTypes.Opening
    case 'S': return HymnTypes.Sacrament
    case 'I': return HymnTypes.Intermediate
    case 'C': return HymnTypes.Closing
    case 'D': return HymnTypes.Dismiss
    default: return HymnTypes.Unknown
  }
}

module.exports = {
  mapHymnData,
  mapHistory,
  mapLetterToHymnType,
}
