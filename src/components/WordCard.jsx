import { useState } from 'react'

function WordCard({ word, onSave, isSaved }) {
  const [expanded, setExpanded] = useState(false)
  const [saving, setSaving] = useState(false)

  // Color themes for each card (cycles through 5 colors)
  const themes = [
    { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', accent: 'text-purple-600' },
    { bg: 'bg-teal-50',   border: 'border-teal-200',   badge: 'bg-teal-100 text-teal-700',   accent: 'text-teal-600' },
    { bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700',  accent: 'text-amber-600' },
    { bg: 'bg-rose-50',   border: 'border-rose-200',   badge: 'bg-rose-100 text-rose-700',   accent: 'text-rose-600' },
    { bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',   accent: 'text-blue-600' },
  ]
  const theme = themes[word.id % 5] || themes[0]

  const handleSave = async () => {
    setSaving(true)
    await onSave(word.id)
    setSaving(false)
  }

  return (
    <div className={`rounded-2xl border-2 ${theme.bg} ${theme.border} overflow-hidden transition-all duration-200`}>

      {/* Card header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {/* Word + pronunciation */}
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {word.word}
            </h2>
            {word.pronunciation && (
              <p className="text-sm text-gray-500 mt-0.5 font-mono">
                {word.pronunciation}
              </p>
            )}
          </div>

          {/* Word type badge + save button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {word.word_type && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${theme.badge}`}>
                {word.word_type}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors"
              title={isSaved ? "Remove from saved" : "Save this word"}
            >
              <span className="text-lg">{isSaved ? '❤️' : '🤍'}</span>
            </button>
          </div>
        </div>

        {/* Definition */}
        <p className="text-gray-700 mt-3 leading-relaxed">
          {word.definition}
        </p>
      </div>

      {/* Examples section */}
      <div className="px-5 pb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`text-sm font-semibold ${theme.accent} flex items-center gap-1.5`}
        >
          {expanded ? '▲' : '▼'} Examples ({3})
        </button>

        {expanded && (
          <ol className="mt-3 space-y-2 list-decimal list-inside">
            {[word.example_1, word.example_2, word.example_3]
              .filter(Boolean)
              .map((ex, i) => (
                <li key={i} className="text-sm text-gray-600 leading-relaxed">
                  {ex}
                </li>
              ))
            }
          </ol>
        )}
      </div>

      {/* Etymology footer */}
      {word.etymology && (
        <div className="px-5 py-3 bg-white/40 border-t border-white/60">
          <p className="text-xs text-gray-500">
            🌱 <span className="font-medium">Origin:</span> {word.etymology}
          </p>
        </div>
      )}

    </div>
  )
}

export default WordCard