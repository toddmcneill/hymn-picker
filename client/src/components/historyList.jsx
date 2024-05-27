import { useState, useEffect } from 'react'
import config from '../config'
import { Link } from 'raviger'

function HistoryList() {
  const [history, setHistory] = useState(null)

  useEffect(() => {
    fetch(`${config.apiHost}/history`)
      .then(res => res.json())
      .then(json => setHistory(json))
      .catch(err => console.log(err))
  }, [])

  return (
    <div>
      <h1>History</h1>
      {!history && 'Loading...'}
      {history && history.map(({ id, year, week }) => (
        <div key={id}>
          <Link href={`/history/${id}`}>Year: {year} - Week: {week}</Link>
        </div>
      ))}
    </div>
  )
}

export default HistoryList
