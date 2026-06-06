import { useState } from 'react'
import { useAuth } from './hooks/useAuth.js'
import { useArtistTracks } from './hooks/useArtistTracks.js'
import { usePlaylistBuilder } from './hooks/usePlaylistBuilder.js'
import { LoginScreen } from './components/LoginScreen.jsx'
import { LandingPage } from './components/LandingPage.jsx'
import { FestivalHome } from './components/FestivalHome.jsx'
import { Header } from './components/Header.jsx'
import { ArtistList } from './components/ArtistList.jsx'
import { PlaylistPanel } from './components/PlaylistPanel.jsx'

export default function App() {
  const { status, user, error: authError, login, logout } = useAuth()
  const { fetchTracks, getArtistData } = useArtistTracks()
  const {
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
    selectedCount,
    buildPlaylist,
    resetBuild,
  } = usePlaylistBuilder()

  const [showLanding, setShowLanding] = useState(true)
  const [selectedDay, setSelectedDay] = useState(null)

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <LoginScreen onLogin={login} error={authError} />
  }

  if (!selectedDay) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <header className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-end gap-3">
          <span className="text-gray-400 text-sm hidden sm:block">{user?.display_name}</span>
          <button
            onClick={logout}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            Log out
          </button>
        </header>
        <FestivalHome onSelectDay={day => {
          setSelectedDay(day)
          setPlaylistName(`${day.festival} ${day.label} Playlist`)
          resetBuild()
        }} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header
        user={user}
        selectedCount={selectedCount}
        onLogout={logout}
        onBack={() => { setSelectedDay(null); resetBuild() }}
        festivalName={selectedDay.festival}
        dayLabel={`${selectedDay.label} · ${selectedDay.date}`}
      />

      <div className="flex-1 overflow-y-auto pb-28">
        <ArtistList
          day={selectedDay.id}
          artists={selectedDay.artists}
          fetchTracks={fetchTracks}
          getArtistData={getArtistData}
          isSelected={isSelected}
          onToggleTrack={toggleTrack}
          onSelectAll={selectAllForArtist}
          onDeselectAll={deselectAllForArtist}
          allSelectedForArtist={allSelectedForArtist}
        />
      </div>

      <PlaylistPanel
        playlistName={playlistName}
        onPlaylistNameChange={setPlaylistName}
        selectedCount={selectedCount}
        buildStatus={buildStatus}
        createdPlaylistId={createdPlaylistId}
        buildError={buildError}
        onBuild={buildPlaylist}
        onReset={resetBuild}
      />
    </div>
  )
}
