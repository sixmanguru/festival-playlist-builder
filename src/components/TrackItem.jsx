function formatDuration(ms) {
  const total = Math.round(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function TrackItem({ track, selected, onToggle }) {
  return (
    <label className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700/50 cursor-pointer group">
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(track.uri)}
        className="w-4 h-4 rounded accent-green-500 cursor-pointer"
      />
      {track.albumImage && (
        <img src={track.albumImage} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
      )}
      <span className="flex-1 text-sm text-gray-200 truncate group-hover:text-white transition-colors">
        {track.name}
      </span>
      <span className="text-xs text-gray-500 flex-shrink-0">{formatDuration(track.duration_ms)}</span>
    </label>
  )
}
