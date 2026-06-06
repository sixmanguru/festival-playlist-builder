import { TrackItem } from './TrackItem.jsx'

export function TrackList({ tracks, isSelected, onToggle }) {
  return (
    <div className="bg-gray-800/50 border-t border-gray-700">
      {tracks.map(track => (
        <TrackItem
          key={track.uri}
          track={track}
          selected={isSelected(track.uri)}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
