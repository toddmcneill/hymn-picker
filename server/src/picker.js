const { getRankedHymnsByType, getFamiliarityFactor } = require('./rankHymns')
const { HymnTypes } = require('./enums')
const { createHash } = require('./util')

const MAX_CONSIDERATION_DEPTH = 20 // The time complexity is O(n^5), so don't set this much higher than 25
const FAMILIARITY_TARGET = 0.75
const LENGTH_TARGET = 14

function pickHymnsForWeek(hymnData, history, weeksOut = 1) {
  // Rank hymns individually for each type
    // Recency - haven't been sung as often are ranked higher
    // Opening hymns should be a moderate to high energy
    // Sacrament hymns should only pull from sacrament
    // Intermediate hymns should be higher energy
    // Closing hymns should be a shorter length and lower energy, can pull from closing
    // Dismiss hymns can pull from dismiss and closing, should be more familiar

    // TODO: later, add in date awareness and account for fasting and seasonal hymns

  const rankedOpeningHymns = getRankedHymnsByType(HymnTypes.Opening, hymnData, history, weeksOut)
  const rankedSacramentHymns = getRankedHymnsByType(HymnTypes.Sacrament, hymnData, history, weeksOut)
  const rankedIntermediateHymns = getRankedHymnsByType(HymnTypes.Intermediate, hymnData, history, weeksOut)
  const rankedClosingHymns = getRankedHymnsByType(HymnTypes.Closing, hymnData, history, weeksOut)
  const rankedDismissHymns = getRankedHymnsByType(HymnTypes.Dismiss, hymnData, history, weeksOut)

  // Rank combinations of hymns, starting with high individually ranked ones first
    // Familiarity target: A mix of familiar and unfamiliar
    // Length target: Not too long and not too short overall
    // Can't include the same hymn multiple times

  const combinations = []
  for (let openingHymn of rankedOpeningHymns.slice(0, MAX_CONSIDERATION_DEPTH)) {
    for (let sacramentHymn of rankedSacramentHymns.slice(0, MAX_CONSIDERATION_DEPTH)) {
      for (let intermediateHymn of rankedIntermediateHymns.slice(0, MAX_CONSIDERATION_DEPTH)) {
        for (let closingHymn of rankedClosingHymns.slice(0, MAX_CONSIDERATION_DEPTH)) {
          for (let dismissHymn of rankedDismissHymns.slice(0, MAX_CONSIDERATION_DEPTH)) {
            const hymnList = [openingHymn, sacramentHymn, intermediateHymn, closingHymn, dismissHymn]

            if ((new Set(hymnList.map(hymn => hymn.hymnNumber))).size < hymnList.length) {
              continue
            }

            const combinedIndividualRankFactor = getCombinedIndividualRankFactor(hymnList)
            const combinedFamiliarityFactor = getCombinedFamiliarityFactor(hymnList)
            const combinedLengthFactor = getCombinedLengthFactor(hymnList)
            // const combinedHash = hymnList.map(hymn => hymn.hash).join('')

            combinations.push({
              opening: openingHymn,
              sacrament: sacramentHymn,
              intermediate: intermediateHymn,
              closing: closingHymn,
              dismiss: dismissHymn,
              rank: {
                combinedIndividualRankFactor,
                combinedFamiliarityFactor,
                combinedLengthFactor,
                overall: (
                  (combinedIndividualRankFactor * 1) +
                  (combinedFamiliarityFactor * 1.5) +
                  (combinedLengthFactor * 0.5)
                )
              }
            })
          }
        }
      }
    }
  }

  return combinations.sort((a, b) => a.rank.overall < b.rank.overall ? 1 : -1)[0]
}

function getCombinedFamiliarityFactor(hymns) {
  const averageFamiliarity = hymns.reduce((acc, cur) => acc + getFamiliarityFactor(cur.familiarity), 0) / hymns.length
  return (FAMILIARITY_TARGET - Math.abs(FAMILIARITY_TARGET - averageFamiliarity)) / FAMILIARITY_TARGET
}

function getCombinedLengthFactor(hymns) {
  const combinedLength = hymns.reduce((acc, cur) => acc + cur.hymnLength, 0)
  return (LENGTH_TARGET - Math.abs(LENGTH_TARGET - combinedLength)) / LENGTH_TARGET
}

function getCombinedIndividualRankFactor(hymns) {
  return hymns.reduce((acc, cur) => acc + cur.rank.overall, 0) / hymns.length
}

module.exports = {
  pickHymnsForWeek
}
