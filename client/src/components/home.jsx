import { useState } from 'react'
import Suggestion from './suggestion'

function Home() {
  const [familiarity, setFamiliarity] = useState(75)
  const [suggestionId, setSuggestionId] = useState(0)

  return (
    <div>
      <h1>Pick some hymns!</h1>
      <div>
        <label>Familiarity <input type="range" min="0" max="100" step="1" value={familiarity} onChange={(e) => setFamiliarity(e.target.value)} /></label> ({familiarity}%)
      </div>
      <div>
        <button onMouseDown={() => setSuggestionId(suggestionId + 1)}>Load Suggestion</button>      
      </div>
      <div>
        {suggestionId !== 0 && <Suggestion key={suggestionId} suggestionId={suggestionId} familiarity={familiarity} />}
      </div>
    </div>
  )
}

export default Home
