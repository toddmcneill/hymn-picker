const { HymnTypes } = require('./enums')

function getRankedHymnsByType(hymnType, hymnData, history, weeksOut) {
  let rankedHymns
  switch (hymnType) {
    case HymnTypes.Opening:
      rankedHymns = getRankedOpeningHymns(hymnData, history, weeksOut)
      break
    case HymnTypes.Sacrament:
      rankedHymns = getRankedSacramentHymns(hymnData, history, weeksOut)
      break
    case HymnTypes.Intermediate:
      rankedHymns = getRankedIntermediateHymns(hymnData, history, weeksOut)
      break
    case HymnTypes.Closing:
      rankedHymns = getRankedClosingHymns(hymnData, history, weeksOut)
      break
    case HymnTypes.Dismiss:
      rankedHymns = getRankedDismissHymns(hymnData, history, weeksOut)
      break
    default:
      rankedHymns = []
  }
  return rankedHymns.sort((a, b) => a.rank.overall < b.rank.overall ? 1 : -1)
}

function getRankedOpeningHymns(hymnData, history, weeksOut) {
  return hymnData.filter(row => !row.isLimited).map(hymn => {
    const recencyFactor = getRecencyFactor(hymn.hymnNumber, history, weeksOut)
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

function getRankedSacramentHymns(hymnData, history, weeksOut) {
  return hymnData.filter(row => row.isSacrament).map(hymn => {
    const recencyFactor = getRecencyFactor(hymn.hymnNumber, history, weeksOut)
    return {
      rank: {
        recencyFactor,
        overall: (recencyFactor * -1),
      },
      ...hymn,
    }
  })
}

function getRankedIntermediateHymns(hymnData, history, weeksOut) {
  return hymnData.filter(row => !row.isLimited).map(hymn => {
    const recencyFactor = getRecencyFactor(hymn.hymnNumber, history, weeksOut)
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

function getRankedClosingHymns(hymnData, history, weeksOut) {
  return hymnData.filter(row => !row.isLimited || row.isClosing).map(hymn => {
    const recencyFactor = getRecencyFactor(hymn.hymnNumber, history, weeksOut)
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

function getRankedDismissHymns(hymnData, history, weeksOut) {
  return hymnData.filter(row => !row.isLimited || row.isClosing || row.isDismiss).map(hymn => {
    const recencyFactor = getRecencyFactor(hymn.hymnNumber, history, weeksOut)
    const energyFactor = getEnergyFactor(hymn.energyLevel)
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

function findMostRecentInclusion(hymnNumber, history) {
  for (let i = history.length - 1; i >= 0; i--) {
    if (hymnNumber === history[i].hymnNumber) {
      return history[i]
    }
  }
  return null
}

function getRecencyFactor(hymnNumber, history, weeksOut) {
  const mostRecentInclusion = findMostRecentInclusion(hymnNumber, history)
  if (mostRecentInclusion === null) {
    return 0
  }
  if (mostRecentInclusion.week >= weeksOut) {
    return 1
  }
  const recencyFactor = -1 / (mostRecentInclusion.week - weeksOut)
  if (mostRecentInclusion.hymnType === HymnTypes.Dismiss) {
    return recencyFactor / 2
  }
  return recencyFactor
}

function getEnergyFactor(energyLevel) {
  return energyLevel / 5
}

function getFamiliarityFactor(familiarity) {
  return familiarity / 5
}

module.exports = {
  getRankedHymnsByType,
  getFamiliarityFactor,
}
