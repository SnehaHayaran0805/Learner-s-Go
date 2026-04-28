import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Header() {
  const [user, setUser] = useState(null)
  const [streak, setStreak] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) fetchStreak(session.user.id)
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchStreak = async (userId) => {
    const { data } = await supabase
      .from('profiles').select('streak_count')
      .eq('id', userId).single()
    if (data) setStreak(data.streak_count)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/home')
  }

  const navClass = (path) => `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
    ${location.pathname === path ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            📖 LEARNER'S PRO
            {user && streak > 0 && (
              <span className="text-sm font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                🔥 {streak}
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">{today}</p>
        </div>
        <nav className="flex items-center gap-1">
          <Link to="/home" className={navClass('/home')}>Today</Link>
          <Link to="/saved" className={navClass('/saved')}>Saved</Link>
          {user ? (
            <button onClick={handleLogout}
              className="ml-2 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">
              Log out
            </button>
          ) : (
            <Link to="/login"
              className="ml-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
export default Header