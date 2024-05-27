const { HymnTypes } = require('./enums')
const dateFns = require('date-fns')

function getRankedHymnsByType(hymnType, hymnData, history, referenceYear, referenceWeek) {
  let rankedHymns
  switch (hymnType) {
    case HymnTypes.Opening:
      rankedHymns = getRankedOpeningHymns(hymnData, history, referenceYear, referenceWeek)
      break
    case HymnTypes.Sacrament:
      rankedHymns = getRankedSacramentHymns(hymnData, history, referenceYear, referenceWeek)
      break
    case HymnTypes.Intermediate:
      rankedHymns = getRankedIntermediateHymns(hymnData, history, referenceYear, referenceWeek)
      break
    case HymnTypes.Closing:
      rankedHymns = getRankedClosingHymns(hymnData, history, referenceYear, referenceWeek)
      break
    case HymnTypes.Dismiss:
      rankedHymns = getRankedDismissHymns(hymnData, history, referenceYear, referenceWeek)
      break
    default:
      rankedHymns = []
  }
  return rankedHymns.sort((a, b) => a.rank.overall < b.rank.overall ? 1 : -1)
}

function getRankedOpeningHymns(hymnData, history, referenceYear, referenceWeek) {
  return hymnData.filter(row => !row.isLimited).map(hymn => {
    const recencyFactor = getRecencyFactor(hymn.id, history, referenceYear, referenceWeek)
    const energyFactor = getEnergyFactor(hymn.energyLevel)
    return {
      rank: {
        recencyFactor,
        energyFactor,
        overall: (recencyFactor * -1) + (energyFactor * 1.3)
      },
      ...hymn,
    }
  })
}

function getRankedSacramentHymns(hymnData, history, referenceYear, referenceWeek) {
  return hymnData.filter(row => row.limitedUses.sacrament).map(hymn => {
    const recencyFactor = getRecencyFactor(hymn.id, history, referenceYear, referenceWeek)
    return {
      rank: {
        recencyFactor,
        overall: (recencyFactor * -1),
      },
      ...hymn,
    }
  })
}

function getRankedIntermediateHymns(hymnData, history, referenceYear, referenceWeek) {
  return hymnData.filter(row => !row.isLimited).map(hymn => {
    const recencyFactor = getRecencyFactor(hymn.id, history, referenceYear, referenceWeek)
    const energyFactor = getEnergyFactor(hymn.energyLevel)
    return {
      rank: {
        recencyFactor,
        energyFactor,
        overall: (recencyFactor * -1) + (energyFactor * 2)
      },
      ...hymn,
    }
  })
}

function getRankedClosingHymns(hymnData, history, referenceYear, referenceWeek) {
  return hymnData.filter(row => !row.isLimited || row.limitedUses.closing).map(hymn => {
    const recencyFactor = getRecencyFactor(hymn.id, history, referenceYear, referenceWeek)
    const energyFactor = getEnergyFactor(hymn.energyLevel)
    return {
      rank: {
        recencyFactor,
        energyFactor,
        overall: (recencyFactor * -1) + (energyFactor * -1.3)
      },
      ...hymn,
    }
  })
}

function getRankedDismissHymns(hymnData, history, referenceYear, referenceWeek) {
  return hymnData.filter(row => !row.isLimited || row.limitedUses.closing || row.limitedUses.dismiss).map(hymn => {
    const recencyFactor = getRecencyFactor(hymn.id, history, referenceYear, referenceWeek, 2)
    const familiarityFactor = getFamiliarityFactor(hymn.familiarity)
    return {
      rank: {
        recencyFactor,
        familiarityFactor,
        overall: (recencyFactor * -1) + (familiarityFactor * 3)
      },
      ...hymn,
    }
  })
}

function getRecencyFactor(hymnId, history, referenceYear, referenceWeek, decayMultiplier = 1) {
  const inclusion = history.find(h => h.hymnId === hymnId)
  if (!inclusion) {
    return 0
  }
  const inclusionDate = dateFns.setDay(dateFns.setWeek(dateFns.setYear(new Date(inclusion.year, 0), inclusion.year), inclusion.week), 0)
  const referenceDate = dateFns.setDay(dateFns.setWeek(dateFns.setYear(new Date(referenceYear, 0), referenceYear), referenceWeek), 0)
  const weeksApart = dateFns.differenceInWeeks(referenceDate, inclusionDate)

  if (weeksApart <= 0) {
    return 1
  }
  return 1 / (weeksApart * decayMultiplier)
}

function getEnergyFactor(mood) {
  // Map 0: low energy - 1: high energy
  switch (mood) {
    case 'Boldly': return 1
    case 'Brightly': return 0.6
    case 'Broadly': return 0.4
    case 'Calmly': return 0.2
    case 'Cheerfully': return 1
    case 'Confidently': return 0.8
    case 'Earnestly': return 0.4
    case 'Energetically': return 0.8
    case 'Enthusiastically': return 0.6
    case 'Expressively': return 0.2
    case 'Exultantly': return 0.8
    case 'Fervently': return 0.4
    case 'Firmly': return 0.6
    case 'Gently': return 0.2
    case 'Humbly': return 0.2
    case 'Joyfully': return 0.6
    case 'Jubilantly': return 0.8
    case 'Lightly': return 0.8
    case 'Majestically': return 0.4
    case 'Meekly': return 0.2
    case 'Peacefully': return 0.2
    case 'Prayerfully': return 0.2
    case 'Reflectively': return 0.2
    case 'Resolutely': return 0.6
    case 'Reverently': return 0.2
    case 'Smoothly': return 0.4
    case 'Solemnly': return 0.2
    case 'Tenderly': return 0.4
    case 'Thankfully': return 0.4
    case 'Thoughtfully': return 0.4
    case 'Triumphantly': return 0.8
    case 'Vigorously': return 1
    case 'With contemplation': return 0.4
    case 'With conviction': return 0.8
    case 'With devotion': return 0.6
    case 'With dignity': return 0.6
    case 'With energy': return 1
    case 'With exultation': return 0.8
    case 'With motion': return 0.6
    case 'With spirit': return 1
    case 'With vigor': return 1
    case 'Worshipfully': return 0.2
    default: return 0.6
  }
}

function getFamiliarityFactor(familiarity) {
  return familiarity / 5
}

module.exports = {
  getRankedHymnsByType,
  getFamiliarityFactor,
}
