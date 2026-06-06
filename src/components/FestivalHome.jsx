import { FESTIVAL_DAYS } from '../data/artists.js'

export function FestivalHome({ onSelectDay }) {
  const groups = FESTIVAL_DAYS.reduce((acc, day) => {
    const key = `${day.festival} ${day.year}`
    if (!acc[key]) acc[key] = []
    acc[key].push(day)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="text-center pt-12 pb-8 px-4">
        <h1 className="text-4xl font-bold text-white">Festival Playlist Builder</h1>
        <p className="text-gray-400 mt-3 text-lg">Pick a day. Build your playlist.</p>
      </div>

      <div className="flex-1 px-4 pb-12 space-y-10 max-w-2xl mx-auto w-full">
        {Object.entries(groups).map(([festivalName, days]) => (
          <div key={festivalName}>
            <h2 className="text-amber-400 font-bold text-xl mb-4 text-center">{festivalName}</h2>
            <div className="grid grid-cols-2 gap-4">
              {days.map(day => (
                <button
                  key={day.id}
                  onClick={() => onSelectDay(day)}
                  className="bg-gradient-to-br from-amber-900/50 to-stone-800/60 hover:from-amber-800/60 hover:to-stone-700/70 border border-amber-700/30 hover:border-amber-600/50 rounded-2xl p-5 text-left transition-all group"
                >
                  <div className="text-amber-400 font-bold text-xl group-hover:text-amber-300 transition-colors">
                    {day.label}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">{day.date}</div>
                  <div className="text-white font-medium text-sm mt-3 leading-snug">
                    {day.headliners}
                  </div>
                  <div className="text-gray-500 text-xs mt-3">
                    {day.artists.length} artists
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
