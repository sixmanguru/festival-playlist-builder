import { ChevronDown, ChevronRight, Loader2, AlertCircle, UserX } from 'lucide-react'
import { TrackList } from './TrackList.jsx'

export function ArtistRow({
  day,
  artistName,
  artistData,
  isExpanded,
  onToggleExpand,
  onFetchTracks,
  isSelected,
  onToggleTrack,
  onSelectAll,
  onDeselectAll,
  allSelected,
}) {
  const { status, tracks } = artistData

  function handleToggle() {
    onToggleExpand(artistName)
    if (status === 'idle') {
      onFetchTracks()
    }
  }

  const loadedCount = status === 'loaded' ? tracks.length : null

  return (
    <div className="border-b border-gray-800 last:border-0">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-800 transition-colors select-none"
        onClick={handleToggle}
      >
        <span className="text-gray-400 flex-shrink-0">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>

        <span className="flex-1 text-white font-medium">{artistName}</span>

        <div className="flex items-center gap-2">
          {status === 'loading' && (
            <Loader2 className="w-4 h-4 text-green-400 animate-spin" />
          )}
          {status === 'error' && (
            <AlertCircle className="w-4 h-4 text-red-400" title={artistData.error} />
          )}
          {status === 'not_found' && (
            <UserX className="w-4 h-4 text-gray-500" title="Artist not found on Spotify" />
          )}
          {loadedCount !== null && (
            <span className="text-xs text-gray-500">{loadedCount} tracks</span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div>
          {status === 'loaded' && tracks.length > 0 && (
            <>
              <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-800/30 border-t border-gray-700">
                <button
                  onClick={e => { e.stopPropagation(); allSelected ? onDeselectAll(tracks) : onSelectAll(tracks) }}
                  className="text-xs text-green-400 hover:text-green-300 transition-colors font-medium"
                >
                  {allSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <TrackList tracks={tracks} isSelected={isSelected} onToggle={onToggleTrack} />
            </>
          )}
          {status === 'loading' && (
            <div className="px-4 py-4 text-sm text-gray-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading tracks…
            </div>
          )}
          {status === 'not_found' && (
            <div className="px-4 py-3 text-sm text-gray-500 italic">
              Artist not found on Spotify
            </div>
          )}
          {status === 'error' && (
            <div className="px-4 py-3 text-sm text-red-400">
              Failed to load tracks: {artistData.error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
