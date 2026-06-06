import { generateCodeVerifier, generateCodeChallenge, buildAuthURL } from './pkce.js'

const TOKEN_URL = 'https://accounts.spotify.com/api/token'

const LS = {
  ACCESS_TOKEN: 'sp_access_token',
  REFRESH_TOKEN: 'sp_refresh_token',
  EXPIRES_AT: 'sp_expires_at',
}

export async function initiateLogin() {
  const verifier = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)
  window.location.href = buildAuthURL(challenge)
}

export async function handleCallback() {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const state = params.get('state')
  const error = params.get('error')

  if (error) throw new Error(`Spotify auth error: ${error}`)
  if (!code) throw new Error('No authorization code in callback URL')

  const storedState = localStorage.getItem('pkce_state')
  if (state !== storedState) throw new Error('State mismatch — possible CSRF attack')

  const verifier = localStorage.getItem('pkce_verifier')
  if (!verifier) throw new Error('No PKCE verifier found')

  const redirectUri = localStorage.getItem('pkce_redirect_uri') || `${window.location.origin}/callback`

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    code_verifier: verifier,
  })

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error_description || 'Token exchange failed')
  }

  const data = await res.json()
  console.log('Granted scopes:', data.scope)
  storeTokens(data)

  localStorage.removeItem('pkce_verifier')
  localStorage.removeItem('pkce_state')
  localStorage.removeItem('pkce_redirect_uri')

  window.history.replaceState({}, '', '/')
}

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(LS.REFRESH_TOKEN)
  if (!refreshToken) throw new Error('No refresh token')

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  })

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) throw new Error('Token refresh failed')

  const data = await res.json()
  storeTokens(data, refreshToken)
  return localStorage.getItem(LS.ACCESS_TOKEN)
}

export async function getValidToken() {
  const expiresAt = Number(localStorage.getItem(LS.EXPIRES_AT) || 0)
  if (Date.now() < expiresAt - 60_000) {
    return localStorage.getItem(LS.ACCESS_TOKEN)
  }
  return refreshAccessToken()
}

export function isAuthenticated() {
  return !!localStorage.getItem(LS.REFRESH_TOKEN)
}

export function logout() {
  Object.values(LS).forEach(key => localStorage.removeItem(key))
}

function storeTokens(data, fallbackRefreshToken = null) {
  localStorage.setItem(LS.ACCESS_TOKEN, data.access_token)
  localStorage.setItem(
    LS.REFRESH_TOKEN,
    data.refresh_token || fallbackRefreshToken || '',
  )
  localStorage.setItem(LS.EXPIRES_AT, String(Date.now() + data.expires_in * 1000))
}
