import { useState } from 'react'
import { Lock, Unlock, LogOut } from 'lucide-react'

const TOKEN_KEY = 'habit-tracker-gh-token'
const GIST_ID_KEY = 'habit-tracker-gist-id'

export function getStoredAuth() {
  return {
    token: localStorage.getItem(TOKEN_KEY),
    gistId: localStorage.getItem(GIST_ID_KEY),
  }
}

export default function AuthGate({ isAuthed, setIsAuthed, onAuth }) {
  const [gistId, setGistId] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [showInput, setShowInput] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!gistId.trim() || !token.trim()) {
      setError('Both fields required')
      return
    }

    try {
      const res = await fetch(`https://api.github.com/gists/${gistId.trim()}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${token.trim()}`,
        },
      })
      if (!res.ok) throw new Error('Invalid gist ID or token')

      localStorage.setItem(GIST_ID_KEY, gistId.trim())
      localStorage.setItem(TOKEN_KEY, token.trim())
      setIsAuthed(true)
      onAuth(gistId.trim(), token.trim())
      setShowInput(false)
      setGistId('')
      setToken('')
      setError('')
    } catch {
      setError('Invalid gist ID or token')
    }
  }

  if (isAuthed) {
    return (
      <button
        onClick={() => setIsAuthed(false)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card/50 text-gray-400 hover:text-gray-200 hover:bg-surface-hover transition-colors text-sm"
      >
        <LogOut size={14} />
        Lock
      </button>
    )
  }

  if (!showInput) {
    const hasStored = !!localStorage.getItem(TOKEN_KEY)
    return (
      <div className="flex items-center gap-2">
        {hasStored ? (
          <button
            onClick={() => {
              const { token, gistId } = getStoredAuth()
              setIsAuthed(true)
              onAuth(gistId, token)
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card/50 text-gray-400 hover:text-gray-200 hover:bg-surface-hover transition-colors text-sm"
          >
            <Unlock size={14} />
            Unlock
          </button>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card/50 text-gray-400 hover:text-gray-200 hover:bg-surface-hover transition-colors text-sm"
          >
            <Lock size={14} />
            Connect GitHub
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
      <input
        type="text"
        value={gistId}
        onChange={e => setGistId(e.target.value)}
        placeholder="Gist ID"
        autoFocus
        className="bg-surface-card border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-accent-blue w-40"
      />
      <input
        type="password"
        value={token}
        onChange={e => setToken(e.target.value)}
        placeholder="GitHub PAT"
        className="bg-surface-card border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-accent-blue w-40"
      />
      <button
        type="submit"
        className="px-3 py-1.5 rounded-lg bg-accent-blue/20 text-accent-blue hover:bg-accent-blue/30 transition-colors text-sm"
      >
        Connect
      </button>
      <button
        type="button"
        onClick={() => { setShowInput(false); setError(''); setGistId(''); setToken('') }}
        className="text-gray-500 hover:text-gray-300 text-sm"
      >
        Cancel
      </button>
      {error && <span className="text-red-400 text-sm">{error}</span>}
    </form>
  )
}
