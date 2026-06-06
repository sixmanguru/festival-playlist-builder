import { Music2, LogOut, ChevronLeft } from 'lucide-react'

export function Header({ user, selectedCount, onLogout, onBack, festivalName, dayLabel }) {
  return (
    <header className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
        ) : (
          <div className="bg-green-500 rounded-full p-1.5">
            <Music2 className="w-4 h-4 text-white" />
          </div>
        )}
        <div>
          <h1 className="text-white font-bold text-sm leading-tight">{festivalName}</h1>
          <p className="text-amber-400 text-xs">{dayLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {selectedCount > 0 && (
          <span className="bg-green-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">
            {selectedCount} track{selectedCount !== 1 ? 's' : ''}
          </span>
        )}
        <span className="text-gray-400 text-sm hidden sm:block">{user?.display_name}</span>
        <button
          onClick={onLogout}
          title="Logout"
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
