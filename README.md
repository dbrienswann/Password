# Shared prototype password gate

One matching lock screen for a set of prototypes shown together (e.g. an exec
review). Every prototype gets the **same** screen — gradient, padlock, accent
button — and changes **only its title**.

> ⚠️ **Not real security.** The password ends up in the client bundle; it just
> keeps casual viewers out. For true protection, also enable your host's
> deployment password (e.g. Vercel → Project → Settings → Deployment Protection).
>
> 🔑 **The shared password is provided separately** by the team lead (not stored
> in this public repo). Set it in your own prototype; keep it out of public code.

## What each teammate changes
- **`title`** — your prototype's name (the only per-proto difference).
- **the password** — set the shared value the team lead sent you.

Keep everything else identical (accent `#E45039`, ink gradient `#2e150f → #190b06`,
storage key `proto_preview_unlocked`) so the gates match.

## Pick the file for your stack

### Plain HTML / static / Framer / Webflow embed / Vue / anything
Use **`password-gate.js`** — no dependencies; injects a full-screen overlay.

```html
<script src="password-gate.js"></script>
<script>
  PasswordGate.mount({
    title: 'Medal Tracker',        // ← your proto's title
    password: 'THE_SHARED_PW',     // ← the shared password (kept private)
    onUnlock: () => startApp(),    // ← run your app after unlock
  });
</script>
```

`PasswordGate.mount()` returns immediately for already-unlocked devices (calls
`onUnlock` right away). `PasswordGate.isUnlocked()` is also exposed.

### React / Vite
Use **`PasswordGate.tsx`** — copy it into `src/`, set `TITLE` and
`PREVIEW_PASSWORD` at the top (or pass a `title` prop), and gate your app:

```tsx
import { useState } from 'react'
import { PasswordGate, getUnlocked } from './PasswordGate'

export default function Root() {
  const [locked, setLocked] = useState(!getUnlocked())
  return locked
    ? <PasswordGate title="Storylines" onUnlock={() => setLocked(false)} />
    : <App />
}
```

## Preview
Open **`demo.html`** in a browser (or serve this folder) to see the exact gate.
The demo uses the password `demo` so it works standalone.

## Note on "one unlock"
`localStorage` is per-domain, so each prototype on its own URL prompts once the
first time it's opened. One shared password covers them all — viewers just enter
it once per site.

## Files
- `password-gate.js` — framework-agnostic drop-in (vanilla, zero deps)
- `PasswordGate.tsx` — React drop-in (self-contained)
- `demo.html` — live preview / reference
