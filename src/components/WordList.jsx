import WordCard from './WordCard'

function WordList({ words, savedWordIds, onSave }) {
  if (!words || words.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-gray-500 font-medium">No words for today yet.</p>
        <p className="text-gray-400 text-sm mt-1">Check back soon — new words arrive at 8 AM!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {words.map(word => (
        <WordCard
          key={word.id}
          word={word}
          isSaved={savedWordIds.includes(word.id)}
          onSave={onSave}
        />
      ))}
    </div>
  )
}

export default WordList