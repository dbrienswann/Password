/*
 * Shared prototype password gate — framework-agnostic drop-in.
 * One matching lock screen across every prototype; each proto only changes
 * the `title` it passes to mount().
 *
 * NOT real security: the password lives in the client bundle. It keeps casual
 * viewers out. For true protection, also use your host's deployment password
 * (e.g. Vercel Password Protection).
 *
 * ⚠️ The shared password is provided separately by your team lead — do NOT
 *    commit it here. Set it via CONFIG.password in your own (private) prototype,
 *    or pass it to mount({ password: '…' }).
 *
 * ── Usage (plain HTML) ─────────────────────────────────────────────────────
 *   <script src="password-gate.js"></script>
 *   <script>
 *     PasswordGate.mount({ title: 'Storylines', password: 'THE_SHARED_PW', onUnlock: startApp });
 *   </script>
 */
(function (global) {
  // ── Shared brand look — keep IDENTICAL across every prototype so the gates
  //    match. Only `title` (and your private `password`) change per proto. ──
  var CONFIG = {
    title: 'Prototype',
    password: 'REPLACE_WITH_SHARED_PASSWORD', // set in your private repo, or pass to mount()
    accent: '#E45039', // vermilion
    inkDark: '#2e150f',
    inkDarkest: '#190b06',
    storageKey: 'proto_preview_unlocked', // shared → unlock once per origin
    subtitle: 'This preview is private. Enter the password to continue.',
  };

  function isUnlocked(key) {
    try { return localStorage.getItem(key) === '1'; } catch (e) { return false; }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function template(cfg) {
    return '' +
      '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 34px;text-align:center;font-family:system-ui,-apple-system,\'Segoe UI\',Roboto,sans-serif;background:linear-gradient(180deg,' + cfg.inkDark + ' 0%,' + cfg.inkDarkest + ' 100%);color:#fff;">' +
        '<div style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;">' +
          '<svg width="26" height="30" viewBox="0 0 26 30" fill="none">' +
            '<rect x="3" y="13" width="20" height="15" rx="4" fill="' + cfg.accent + '"/>' +
            '<path d="M7 13v-3a6 6 0 0 1 12 0v3" stroke="#fff" stroke-opacity=".85" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
            '<circle cx="13" cy="20" r="2.2" fill="#fff"/>' +
          '</svg>' +
        '</div>' +
        '<div style="margin-top:18px;font-size:24px;font-weight:700;letter-spacing:-.5px;">' + escapeHtml(cfg.title) + '</div>' +
        '<div style="margin-top:10px;font-size:16px;line-height:1.5;opacity:.66;max-width:290px;">' + escapeHtml(cfg.subtitle) + '</div>' +
        '<form style="margin-top:26px;width:100%;max-width:300px;display:flex;flex-direction:column;gap:12px;">' +
          '<input type="password" placeholder="Password" aria-label="Preview password" autocomplete="off" ' +
            'style="font-size:16px;font-family:inherit;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:#fff;outline:none;text-align:center;letter-spacing:1px;"/>' +
          '<button type="submit" style="padding:13px;border-radius:12px;background:' + cfg.accent + ';color:#fff;font-weight:700;font-size:16px;font-family:inherit;border:none;cursor:pointer;">Unlock</button>' +
        '</form>' +
        '<div data-err style="margin-top:14px;font-size:13px;color:#ff9e8e;opacity:0;transition:opacity .18s ease;min-height:16px;">Incorrect password — try again.</div>' +
      '</div>';
  }

  function mount(opts) {
    var cfg = Object.assign({}, CONFIG, opts || {});
    if (isUnlocked(cfg.storageKey)) { cfg.onUnlock && cfg.onUnlock(); return; }

    var host = document.createElement('div');
    host.setAttribute('data-password-gate', '');
    host.style.cssText = 'position:fixed;inset:0;z-index:99999;';
    host.innerHTML = template(cfg);
    document.body.appendChild(host);

    var form = host.querySelector('form');
    var input = host.querySelector('input');
    var err = host.querySelector('[data-err]');
    input.focus();
    input.addEventListener('focus', function () {
      err.style.opacity = '0';
      input.style.borderColor = 'rgba(255,255,255,.18)';
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (input.value.trim().toLowerCase() === cfg.password.toLowerCase()) {
        try { localStorage.setItem(cfg.storageKey, '1'); } catch (e2) { /* private mode */ }
        host.remove();
        cfg.onUnlock && cfg.onUnlock();
      } else {
        err.style.opacity = '1';
        input.style.borderColor = 'rgba(255,120,100,.7)';
        input.value = '';
      }
    });
  }

  global.PasswordGate = {
    mount: mount,
    isUnlocked: function () { return isUnlocked(CONFIG.storageKey); },
  };
})(typeof window !== 'undefined' ? window : this);
