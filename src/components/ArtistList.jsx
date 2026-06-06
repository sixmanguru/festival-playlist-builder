import { useState } from 'react'
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

  function toggleExpand(artistName) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(artistName)) next.delete(artistName)
      else next.add(artistName)
      return next
    })
  }

  return (
    <div>
      {artists.map(artistName => {
        const artistData = getArtistData(day, artistName)
        return (
          <ArtistRow
            key={`${day}:${artistName}`}
            day={day}
            artistName={artistName}
            artistData={artistData}
            isExpanded={expanded.has(artistName)}
            onToggleExpand={toggleExpand}
            onFetchTracks={fetchTracks}
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
