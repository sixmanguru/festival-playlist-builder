import { ListMusic, ExternalLink, Loader2 } from 'lucide-react'

export function PlaylistPanel({
  playlistName,
  onPlaylistNameChange,
  selectedCount,
  buildStatus,
  createdPlaylistId,
  buildError,
  onBuild,
  onReset,
  userId,
}) {
  const isBuilding = buildStatus === 'creating' || buildStatus === 'adding'
  const isDone = buildStatus === 'done'

  return (
    <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4">
      {isDone ? (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 text-green-400 font-medium text-sm">
            Playlist created successfully!
          </div>
          <a
            href={`https://open.spotify.com/playlist/${createdPlaylistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-full transition-colors"
          >
            Open in Spotify <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onReset}
            className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
          >
            Build another
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <ListMusic className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={playlistName}
              onChange={e => onPlaylistNameChange(e.target.value)}
              placeholder="Playlist name"
              className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm whitespace-nowrap">
              {selectedCount > 0
                ? `${selectedCount} track${selectedCount !== 1 ? 's' : ''} selected`
                : 'No tracks selected'}
            </span>

            <button
              onClick={() => onBuild(userId)}
              disabled={selectedCount === 0 || isBuilding || !playlistName.trim()}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-black font-bold px-5 py-2 rounded-full text-sm transition-colors whitespace-nowrap"
            >
              {isBuilding && <Loader2 className="w-4 h-4 animate-spin" />}
              {buildStatus === 'creating' && 'Creating playlist…'}
              {buildStatus === 'adding' && 'Adding tracks…'}
              {!isBuilding && 'Create Playlist'}
            </button>
          </div>
        </div>
      )}

      {buildStatus === 'error' && buildError && (
        <p className="mt-2 text-red-400 text-xs">{buildError}</p>
      )}
    </div>
  )
}
