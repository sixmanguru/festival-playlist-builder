import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { ArtistRow } from './ArtistRow.jsx'

export function ArtistList({
  day,
  artists,
  fetchTracks,
  getArtistData,
  isSelected,
  onToggleTrack,
  onSelectAll,
  onDeselectAll,
  allSelectedForArtist,
}) {
  const [expanded, setExpanded] = useState(new Set())
  const [limit, setLimit] = useState(5)

  const fetch = (name) => fetchTracks(day, name, limit)
  const getData = (name) => getArtistData(day, name, limit)

  const loadingCount = artists.filter(n => getData(n).status === 'loading').length
  const isLoading = loadingCount > 0
  const allLoaded =
    !isLoading &&
    artists.length > 0 &&
    artists.every(n => {
      const s = getData(n).status
      return s === 'loaded' || s === 'not_found' || s === 'error'
    })
  const anyDone = artists.some(n => getData(n).status === 'loaded')

  function toggleExpand(artistName) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(artistName)) next.delete(artistName)
      else next.add(artistName)
      return next
    })
  }

  function selectAllTracks() {
    artists.forEach(name => {
      const { tracks } = getData(name)
      if (tracks?.length) onSelectAll(tracks)
    })
  }

  async function loadAll() {
    const toFetch = artists.filter(n => {
      const { status } = getData(n)
      return status === 'idle' || status === 'error'
    })
    const BATCH = 4
    for (let i = 0; i < toFetch.length; i += BATCH) {
      await Promise.all(toFetch.slice(i, i + BATCH).map(name => fetch(name)))
      if (i + BATCH < toFetch.length) {
        await new Promise(r => setTimeout(r, 250))
      }
    }
  }

  return (
    <div>
      {/* Instructions */}
      <div className="px-4 py-3 bg-gray-800/40 border-b border-gray-700/50">
        <p className="text-gray-400 text-sm leading-relaxed">
          Tap an artist to load their top tracks, or use <span className="text-amber-400">Load All</span> to pre-load everyone at once. Check the songs you want, then create your playlist below.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800/20 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Max tracks per artist</label>
          <select
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-amber-600"
          >
            {[3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <button
          onClick={loadAll}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-600/20 border border-amber-600/40 text-amber-400 hover:bg-amber-600/30 disabled:opacity-60 transition-colors"
        >
          {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
          {isLoading ? `Loading (${loadingCount})` : 'Load All Artists'}
        </button>
      </div>

      {/* Select-all prompt */}
      {allLoaded && anyDone && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-900/20 border-b border-amber-700/20">
          <p className="text-amber-300/80 text-sm">
            All artists loaded — select all tracks to start, then refine your picks.
          </p>
          <button
            onClick={selectAllTracks}
            className="flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-600/20 border border-amber-600/40 text-amber-400 hover:bg-amber-600/30 transition-colors"
          >
            Select All Tracks
          </button>
        </div>
      )}

      {/* Artist rows */}
      {artists.map(artistName => {
        const artistData = getData(artistName)
        return (
          <ArtistRow
            key={`${day}:${artistName}:${limit}`}
            day={day}
            artistName={artistName}
            artistData={artistData}
            isExpanded={expanded.has(artistName)}
            onToggleExpand={toggleExpand}
            onFetchTracks={() => fetch(artistName)}
            isSelected={isSelected}
            onToggleTrack={onToggleTrack}
            onSelectAll={onSelectAll}
            onDeselectAll={onDeselectAll}
            allSelected={allSelectedForArtist(artistData.tracks)}
          />
        )
      })}
    </div>
  )
}
