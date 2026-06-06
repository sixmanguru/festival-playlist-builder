import { Music2 } from 'lucide-react'

export function LoginScreen({ onLogin, error }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-500 rounded-full p-4">
            <Music2 className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Festival Playlist Builder</h1>
        <p className="text-green-400 text-lg font-medium mb-2">Multi-festival playlist creator</p>
        <p className="text-gray-400 mb-8">
          Connect your Spotify account to browse artists across upcoming festivals,
          pick your favorite tracks, and build custom playlists in seconds.
        </p>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={onLogin}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 px-8 rounded-full text-lg transition-colors"
        >
          Connect with Spotify
        </button>

        <p className="mt-4 text-gray-500 text-xs">
          Requires playlist-modify permissions. No data is stored on any server.
        </p>
      </div>
    </div>
  )
}
