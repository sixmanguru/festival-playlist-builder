import { useState, useCallback } from 'react'
import { searchArtist, getArtistTopTracks } from '../api/spotify.js'

export function useArtistTracks() {
  const [trackMap, setTrackMap] = useState(new Map())

  const fetchTracks = useCallback(async (day, artistName, limit = 10) => {
    const key = `${day}:${artistName}:${limit}`

    setTrackMap(prev => {
      if (prev.has(key) && prev.get(key).status !== 'idle') return prev
      const next = new Map(prev)
      next.set(key, { status: 'loading', tracks: [] })
      return next
    })

    try {
      const artist = await searchArtist(artistName)
      if (!artist) {
        setTrackMap(prev => {
          const next = new Map(prev)
          next.set(key, { status: 'not_found', tracks: [] })
          return next
        })
        return
      }

      const tracks = await getArtistTopTracks(artist.id, artist.name, limit)
      setTrackMap(prev => {
        const next = new Map(prev)
        next.set(key, { status: 'loaded', tracks })
        return next
      })
    } catch (err) {
      setTrackMap(prev => {
        const next = new Map(prev)
        next.set(key, { status: 'error', tracks: [], error: err.message })
        return next
      })
    }
  }, [])

  function getArtistData(day, artistName, limit = 10) {
    return trackMap.get(`${day}:${artistName}:${limit}`) || { status: 'idle', tracks: [] }
  }

  return { fetchTracks, getArtistData }
}
