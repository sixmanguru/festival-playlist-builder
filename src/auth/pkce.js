const SCOPES = 'playlist-modify-public playlist-modify-private user-read-private'

function base64urlEncode(buffer) {
  const bytes = new Uint8Array(buffer)
  let str = ''
  for (const byte of bytes) str += String.fromCharCode(byte)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function generateCodeVerifier() {
  const array = new Uint8Array(64)
  crypto.getRandomValues(array)
  const verifier = base64urlEncode(array)
  localStorage.setItem('pkce_verifier', verifier)
  return verifier
}

export async function generateCodeChallenge(verifier) {
  const encoded = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return base64urlEncode(digest)
}

export function buildAuthURL(challenge) {
  const state = base64urlEncode(crypto.getRandomValues(new Uint8Array(16)))
  localStorage.setItem('pkce_state', state)

  const redirectUri = `${window.location.origin}/callback`
  localStorage.setItem('pkce_redirect_uri', redirectUri)

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state,
    show_dialog: 'true',
  })

  return `https://accounts.spotify.com/authorize?${params}`
}
