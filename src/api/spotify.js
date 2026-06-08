import { getValidToken } from '../auth/spotify-auth.js'

const BASE = 'https://api.spotify.com/v1'
const artistCache = new Map()

async function apiFetch(path, options = {}) {
  const token = await getValidToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get('Retry-After') || 1)
    await new Promise(r => setTimeout(r, retryAfter * 1000))
    return apiFetch(path, options)
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err.error?.message || err.error_description || `Spotify API error ${res.status}`
    console.error('Spotify API error', res.status, path, err)
    throw new Error(msg)
  }

  return res.json()
}

export async function searchArtist(name) {
  if (artistCache.has(name)) return artistCache.get(name)

  const params = new URLSearchParams({ q: `"${name}"`, type: 'artist', limit: 1 })
  const data = await apiFetch(`/search?${params}`)
  const artist = data.artists?.items?.[0] || null

  const result = artist ? { id: artist.id, name: artist.name } : null
  artistCache.set(name, result)
  return result
}

function toTrack(t) {
  return {
    uri: t.uri,
    name: t.name,
    duration_ms: t.duration_ms,
    albumName: t.album?.name || '',
    albumImage: t.album?.images?.[2]?.url || t.album?.images?.[0]?.url || null,
  }
}

export async function getArtistTopTracks(artistId, artistName, limit = 10) {
  const params = new URLSearchParams({ q: artistName, type: 'track', limit: 10 })
  const data = await apiFetch(`/search?${params}`)
  const seen = new Set()
  return (data.tracks?.items || [])
    .filter(t => {
      const isFeatTrack = /\bfeat\b|\bft\b|\bwith\b/i.test(t.name)
      if (isFeatTrack) return t.artists[0]?.id === artistId
      return t.artists.some(a => a.id === artistId)
    })
    .filter(t => {
      const key = t.name.toLowerCase().trim()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, limit)
    .map(toTrack)
}

export async function getCurrentUser() {
  const data = await apiFetch('/me')
  return { id: data.id, display_name: data.display_name || data.id }
}

export async function createPlaylist(name, isPublic = false) {
  const data = await apiFetch(`/me/playlists`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      public: isPublic,
      description: 'Created with Festival Playlist Builder',
    }),
  })
  return data.id
}

export async function addTracksToPlaylist(playlistId, uris) {
  const all = [...uris]
  while (all.length > 0) {
    const batch = all.splice(0, 100)
    await apiFetch(`/playlists/${playlistId}/items`, {
      method: 'POST',
      body: JSON.stringify({ uris: batch }),
    })
  }
}
