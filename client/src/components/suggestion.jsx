import api from '../api'
import { purposeDisplayOrder } from '../const'
import SuggestedHymn from './suggestedHymn'

function Suggestion({ suggestionId, familiarity }) {
  const { isPending, error, data } = api.loadSuggestion(suggestionId, familiarity)
  if (isPending) {
    return 'Loading...'
  }
  if (error) {
    return 'error!'
  }

  const suggestedHymns = []
  purposeDisplayOrder.forEach(hymnPurpose => {
    if (hymnPurpose in data) {
      const hymn = data[hymnPurpose]
      suggestedHymns.push(<SuggestedHymn purpose={hymnPurpose} hymn={hymn} key={hymn.id} />)
    }
  })

  return (
    <div>
      {suggestedHymns}
    </div>
  )
}

export default Suggestion
