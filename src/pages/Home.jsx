import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import WordList from '../components/WordList'

function Home() {
  const [words, setWords] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  // Fetch today's words from Supabase when page loads
  useEffect(() => {
    fetchTodaysWords()
  }, [])

  const fetchTodaysWords = async () => {
    try {
      setLoading(true)

      // Query daily_words table for today's date
      const { data, error } = await supabase
        .from('daily_words')
        .select('*')
        .eq('date', today)
        .order('id', { ascending: true })

      if (error) throw error
      setWords(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateLastVisited = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return   // not logged in — skip

  const today = new Date().toISOString().split('T')[0]

  await supabase
    .from('profiles')
    .update({ last_visited: today })
    .eq('id', user.id)
}

// Update your existing useEffect to call BOTH functions:
useEffect(() => {
  fetchTodaysWords()
  updateLastVisited()  // ← ADD this line
}, [])

  // Handle saving/unsaving a word
  const handleSave = async (wordId) => {
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please sign in to save words!')
      return
    }

    if (savedIds.includes(wordId)) {
      // Already saved → remove it
      await supabase
        .from('saved_words')
        .delete()
        .match({ user_id: user.id, word_id: wordId })
      setSavedIds(prev => prev.filter(id => id !== wordId))
    } else {
      // Not saved → save it
      await supabase
        .from('saved_words')
        .insert({ user_id: user.id, word_id: wordId })
      setSavedIds(prev => [...prev, wordId])
    }
  }

  // Loading state
  if (loading) return (
    <div className="pt-10 space-y-4">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  )

  // Error state
  if (error) return (
    <div className="pt-10 text-center">
      <p className="text-red-500">Error: {error}</p>
      <button onClick={fetchTodaysWords} className="mt-3 text-purple-600 underline text-sm">
        Try again
      </button>
    </div>
  )

  return (
    <div className="pt-6">
      {/* Page title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Today's Words</h2>
        <p className="text-gray-400 text-sm mt-1">
          {words.length} word{words.length !== 1 && 's'} · tap examples to expand
        </p>
      </div>

      {/* Word cards */}
      <WordList
        words={words}
        savedWordIds={savedIds}
        onSave={handleSave}
      />
    </div>
  )
}

export default Home
