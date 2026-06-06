import { useState, useCallback } from 'react'
import { createPlaylist, addTracksToPlaylist } from '../api/spotify.js'

export function usePlaylistBuilder() {
  const [selectedTracks, setSelectedTracks] = useState(new Set())
  const [playlistName, setPlaylistName] = useState('Festival Playlist – Sep 2026')
  const [buildStatus, setBuildStatus] = useState('idle')
  const [createdPlaylistId, setCreatedPlaylistId] = useState(null)
  const [buildError, setBuildError] = useState(null)

  const toggleTrack = useCallback((uri) => {
    setSelectedTracks(prev => {
      const next = new Set(prev)
      if (next.has(uri)) next.delete(uri)
      else next.add(uri)
      return next
    })
  }, [])

  const selectAllForArtist = useCallback((tracks) => {
    setSelectedTracks(prev => {
      const next = new Set(prev)
      tracks.forEach(t => next.add(t.uri))
      return next
    })
  }, [])

  const deselectAllForArtist = useCallback((tracks) => {
    setSelectedTracks(prev => {
      const next = new Set(prev)
      tracks.forEach(t => next.delete(t.uri))
      return next
    })
  }, [])

  const isSelected = useCallback((uri) => selectedTracks.has(uri), [selectedTracks])

  const allSelectedForArtist = useCallback((tracks) =>
    tracks.length > 0 && tracks.every(t => selectedTracks.has(t.uri)),
    [selectedTracks]
  )

  async function buildPlaylist() {
    if (selectedTracks.size === 0) return
    setBuildStatus('creating')
    setBuildError(null)
    setCreatedPlaylistId(null)

    try {
      const playlistId = await createPlaylist(playlistName)
      setBuildStatus('adding')
      await addTracksToPlaylist(playlistId, [...selectedTracks])
      setCreatedPlaylistId(playlistId)
      setBuildStatus('done')
    } catch (err) {
      setBuildError(err.message)
      setBuildStatus('error')
    }
  }

  function resetBuild() {
    setBuildStatus('idle')
    setBuildError(null)
    setCreatedPlaylistId(null)
  }

  return {
    selectedTracks,
    playlistName,
    setPlaylistName,
    buildStatus,
    createdPlaylistId,
    buildError,
    toggleTrack,
    selectAllForArtist,
    deselectAllForArtist,
    isSelected,
    allSelectedForArtist,
    selectedCount: selectedTracks.size,
    buildPlaylist,
    resetBuild,
  }
}
