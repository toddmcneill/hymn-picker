import api from '../api'
import { purposeDisplayOrder } from '../const'

function History({ id }) {

  const { isPending, error, data: hymnHistory } = api.loadHymnHistoryById(id)
  if (isPending) {
    return 'Loading...'
  }
  if (error) {
    return 'error!'
  }

  const hymns = []
  purposeDisplayOrder.forEach(hymnPurpose => {
    const foundHymn = hymnHistory.find(x => x.purpose === hymnPurpose)
    if (foundHymn) {
      hymns.push(
        <div key={foundHymn.id}>
          <div>
            <b>{hymnPurpose}</b>
          </div>
          {foundHymn.number} - {foundHymn.title}
        </div>
      )
    }
  })

  return (
    <div>
      <h2>History for {id}</h2>
      <hr />
      {hymns}
    </div>
  )
}

export default History
