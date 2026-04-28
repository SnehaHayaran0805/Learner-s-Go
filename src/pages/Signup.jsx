import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 1. Create auth user
    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }

    // 2. Create profile row
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email,
        display_name: name,
        streak_count: 0,
        last_visited: new Date().toISOString().split('T')[0]
      })

    if (profileError) { setError(profileError.message); setLoading(false); return }
    navigate('/home')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Join Wordly</h1>
          <p className="text-gray-400 mt-1">5 new words. Every day. For free.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

          {[
            { label: 'Your name', value: name, set: setName, type: 'text', ph: 'e.g. Arjun' },
            { label: 'Email', value: email, set: setEmail, type: 'email', ph: 'you@email.com' },
            { label: 'Password', value: password, set: setPassword, type: 'password', ph: 'min 6 characters' }
          ].map(({ label, value, set, type, ph }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <input type={type} required value={value}
                onChange={e => set(e.target.value)} placeholder={ph}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-900"
              />
            </div>
          ))}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="text-purple-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
export default Signup
