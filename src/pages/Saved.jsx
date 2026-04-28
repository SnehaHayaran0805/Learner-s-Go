import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import WordList from '../components/WordList'

function Saved() {
  const [words, setWords] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkUserAndFetch()
  }, [])

  const checkUserAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) await fetchSavedWords(user.id)
    setLoading(false)
  }

  const fetchSavedWords = async (userId) => {
    const { data } = await supabase
      .from('saved_words')
      .select('word_id, daily_words(*)')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })

    const fetchedWords = data?.map(row => row.daily_words) || []
    setWords(fetchedWords)
    setSavedIds(fetchedWords.map(w => w.id))
  }

  const handleUnsave = async (wordId) => {
    await supabase.from('saved_words').delete()
      .match({ user_id: user.id, word_id: wordId })
    setWords(prev => prev.filter(w => w.id !== wordId))
    setSavedIds(prev => prev.filter(id => id !== wordId))
  }

  if (loading) return <div className="pt-10 text-center text-gray-400">Loading...</div>

  if (!user) return (
    <div className="pt-16 text-center">
      <p className="text-5xl mb-4">🔒</p>
      <p className="text-gray-500 font-medium mb-4">Sign in to see your saved words</p>
    </div>
  )

  return (
    <div className="pt-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🔖 Saved Words</h2>
        <p className="text-gray-400 text-sm mt-1">{words.length} word{words.length !== 1 && 's'} saved</p>
      </div>
      <WordList words={words} savedWordIds={savedIds} onSave={handleUnsave} />
    </div>
  )
}
export default Saved