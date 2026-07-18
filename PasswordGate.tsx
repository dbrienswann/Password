import { useState, type FormEvent } from 'react'

/*
 * Shared prototype password gate — React drop-in.
 * Self-contained (no external theme import). Copy into any React/Vite proto,
 * set TITLE (or pass a `title` prop), and set the shared PREVIEW_PASSWORD.
 *
 * NOT real security: the password ships in the client bundle. Pair with your
 * host's deployment password (e.g. Vercel) for true protection.
 *
 * ⚠️ The shared password is provided separately by your team lead — set it in
 *    your own (private) repo. Do NOT commit the real password to a public repo.
 *
 *   import { PasswordGate, getUnlocked } from './PasswordGate'
 *   {locked ? <PasswordGate title="Storylines" onUnlock={() => setLocked(false)} /> : <App />}
 */

// ── Per-prototype config ────────────────────────────────────────────────────
const TITLE = 'Prototype' //                          ← each proto sets its title
const PREVIEW_PASSWORD = 'REPLACE_WITH_SHARED_PASSWORD' // ← set the shared password (kept private)
// Shared brand look — keep identical across protos so every gate matches.
const ACCENT = '#E45039'
const BACKGROUND = 'radial-gradient(120% 120% at 50% 0%, #232735 0%, #15171F 55%, #0D0E13 100%)'
const STORAGE_KEY = 'proto_preview_unlocked'

export function getUnlocked(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function PasswordGate({ onUnlock, title = TITLE }: { onUnlock: () => void; title?: string }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim().toLowerCase() === PREVIEW_PASSWORD.toLowerCase()) {
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* private mode — proceed for this session anyway */
      }
      onUnlock()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        padding: '0 34px',
        textAlign: 'center',
        background: BACKGROUND,
        color: '#fff',
      }}
    >
      {/* Padlock */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.14)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
          <rect x="3" y="13" width="20" height="15" rx="4" fill={ACCENT} />
          <path
            d="M7 13v-3a6 6 0 0 1 12 0v3"
            stroke="#fff"
            strokeOpacity="0.85"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="13" cy="20" r="2.2" fill="#fff" />
        </svg>
      </div>

      <div style={{ marginTop: 18, fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 16, lineHeight: 1.5, opacity: 0.66, maxWidth: 290 }}>
        This preview is private. Enter the password to continue.
      </div>

      <form
        onSubmit={submit}
        style={{ marginTop: 26, width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setError(false)}
          placeholder="Password"
          aria-label="Preview password"
          style={{
            fontSize: 16, // 16px so mobile Safari doesn't zoom on focus
            fontFamily: 'inherit',
            padding: '14px 16px',
            borderRadius: 12,
            border: `1px solid ${error ? 'rgba(255,120,100,0.7)' : 'rgba(255,255,255,0.18)'}`,
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            outline: 'none',
            textAlign: 'center',
            letterSpacing: 1,
          }}
        />
        <button
          type="submit"
          style={{
            padding: '13px',
            borderRadius: 12,
            background: ACCENT,
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            fontFamily: 'inherit',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Unlock
        </button>
      </form>

      <div
        style={{
          marginTop: 14,
          fontSize: 13,
          color: '#ff9e8e',
          opacity: error ? 1 : 0,
          transition: 'opacity 0.18s ease',
          minHeight: 16,
        }}
      >
        Incorrect password — try again.
      </div>
    </div>
  )
}
