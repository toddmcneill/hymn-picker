function SuggestedHymn({ purpose, hymn }) {
  return (
    <div>
      <div><b>{purpose}</b></div>
      {hymn.number} - {hymn.title} 
    </div>
  )
}

export default SuggestedHymn
