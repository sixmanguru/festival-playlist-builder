import { useState } from 'react'
import { FESTIVAL_DAYS, FESTIVAL_META } from '../data/artists.js'
import { Masthead } from './Masthead.jsx'
import { RequestFestivalModal } from './RequestFestivalModal.jsx'

function buildFestivalMeta(days) {
  const first = days[0].date.split(', ')[1]
  if (!first) return days[0].date
  const last = days[days.length - 1].date.split(', ')[1]
  const [month, firstDay] = first.split(' ')
  const lastDay = last ? last.split(' ')[1] : firstDay
  return `${month} ${firstDay}–${lastDay}`
}

export function FestivalHome({ onSelectDay }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [showRequest, setShowRequest] = useState(false)

  const groups = FESTIVAL_DAYS.reduce((acc, day) => {
    const key = `${day.festival} ${day.year}`
    if (!acc[key]) {
      acc[key] = { festival: day.festival, year: day.year, days: [] }
    }
    acc[key].days.push(day)
    return acc
  }, {})

  const filters = [
    { key: 'all', label: 'All' },
    ...Object.entries(groups).map(([key, { festival, year, days }]) => ({
      key,
      label: `${festival}  ·  ${buildFestivalMeta(days)}, ${year}`,
    })),
  ]

  const visibleGroups = Object.entries(groups).filter(
    ([key]) => activeFilter === 'all' || key === activeFilter
  )

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Masthead />

      <div className="flex flex-wrap gap-2 justify-center px-4 pb-8">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-3 py-0.5 rounded-full text-xs font-medium transition-colors border ${
              activeFilter === key
                ? 'bg-amber-500 border-amber-500 text-gray-900'
                : 'bg-transparent border-amber-700/50 text-amber-400 hover:border-amber-500 hover:text-amber-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex justify-center px-4 pb-6">
        <button
          onClick={() => setShowRequest(true)}
          className="text-xs text-amber-600/70 hover:text-amber-400 transition-colors underline underline-offset-2"
        >
          Don't see your festival? Request one to be added →
        </button>
      </div>

      {showRequest && <RequestFestivalModal onClose={() => setShowRequest(false)} />}

      <div className="flex-1 px-4 pb-12 space-y-10 max-w-2xl mx-auto w-full">
        {visibleGroups.map(([festivalKey, { festival, year, days }]) => (
          <div key={festivalKey}>
            <h2 className="text-amber-400 font-bold text-xl mb-4 text-center">
              {festival} {year}
            </h2>
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
                  <div className="text-amber-600/70 text-xs font-medium">{day.festival}</div>
                  <div className="text-gray-400 text-xs mt-0.5">
                    {day.date}{FESTIVAL_META[day.festival]?.city ? ` · ${FESTIVAL_META[day.festival].city}` : ''}
                  </div>
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
