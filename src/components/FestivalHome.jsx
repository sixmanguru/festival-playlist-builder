import { useState } from 'react'
import { FESTIVAL_DAYS, FESTIVAL_META } from '../data/artists.js'
import { Masthead } from './Masthead.jsx'
import { RequestFestivalModal } from './RequestFestivalModal.jsx'

const MONTH_MAP = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
}

function parseLastDate(dateStr) {
  if (dateStr.includes(',')) {
    const [, rest] = dateStr.split(', ')
    const [month, day] = rest.split(' ')
    return new Date(2026, MONTH_MAP[month], parseInt(day))
  }
  const [month, range] = dateStr.split(' ')
  const lastDay = parseInt(range.split(/[–-]/).pop())
  return new Date(2026, MONTH_MAP[month], lastDay)
}

function festivalIsPast(days) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const lastDay = days.reduce((max, day) => {
    const d = parseLastDate(day.date)
    return d > max ? d : max
  }, new Date(0))
  return lastDay < today
}

function buildFestivalMeta(days) {
  const first = days[0].date.split(', ')[1]
  if (!first) return days[0].date
  const last = days[days.length - 1].date.split(', ')[1]
  const [month, firstDay] = first.split(' ')
  const lastDay = last ? last.split(' ')[1] : firstDay
  return `${month} ${firstDay}–${lastDay}`
}

function DayCard({ day, onSelectDay, past = false }) {
  const city = FESTIVAL_META[day.festival]?.city
  return (
    <button
      onClick={() => onSelectDay(day)}
      className={`rounded-2xl p-5 text-left transition-all group w-full ${
        past
          ? 'bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/30 hover:border-gray-600/50'
          : 'bg-gradient-to-br from-amber-900/50 to-stone-800/60 hover:from-amber-800/60 hover:to-stone-700/70 border border-amber-700/30 hover:border-amber-600/50'
      }`}
    >
      <div className={`font-bold text-xl transition-colors ${past ? 'text-gray-400 group-hover:text-gray-300' : 'text-amber-400 group-hover:text-amber-300'}`}>
        {day.label}
      </div>
      <div className={`text-xs font-medium ${past ? 'text-gray-500' : 'text-amber-600/70'}`}>
        {day.festival}
      </div>
      <div className="text-gray-500 text-xs mt-0.5">
        {day.date}{city ? ` · ${city}` : ''}
      </div>
      <div className={`font-medium text-sm mt-3 leading-snug ${past ? 'text-gray-400' : 'text-white'}`}>
        {day.headliners}
      </div>
      <div className="text-gray-600 text-xs mt-3">
        {day.artists.length} artists
      </div>
    </button>
  )
}

export function FestivalHome({ onSelectDay }) {
  const [view, setView] = useState('upcoming')
  const [activeFilter, setActiveFilter] = useState('all')
  const [showRequest, setShowRequest] = useState(false)

  const groups = FESTIVAL_DAYS.reduce((acc, day) => {
    const key = `${day.festival} ${day.year}`
    if (!acc[key]) acc[key] = { festival: day.festival, year: day.year, days: [] }
    acc[key].days.push(day)
    return acc
  }, {})

  const upcomingGroups = Object.entries(groups).filter(([, { days }]) => !festivalIsPast(days))
  const pastGroups = Object.entries(groups).filter(([, { days }]) => festivalIsPast(days))

  const activeGroups = view === 'upcoming' ? upcomingGroups : pastGroups

  const filters = [
    { key: 'all', label: 'All' },
    ...activeGroups.map(([key, { festival, year, days }]) => ({
      key,
      label: `${festival}  ·  ${buildFestivalMeta(days)}, ${year}`,
    })),
  ]

  const visibleGroups = activeFilter === 'all'
    ? activeGroups
    : activeGroups.filter(([key]) => key === activeFilter)

  function switchView(v) {
    setView(v)
    setActiveFilter('all')
  }

  const isPast = view === 'archive'

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Masthead />

      {/* View toggle */}
      <div className="flex justify-center gap-1 px-4 pb-6">
        <button
          onClick={() => switchView('upcoming')}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors border ${
            view === 'upcoming'
              ? 'bg-amber-500 border-amber-500 text-gray-900'
              : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => switchView('archive')}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors border ${
            view === 'archive'
              ? 'bg-gray-600 border-gray-600 text-white'
              : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
          }`}
        >
          Archive {pastGroups.length > 0 && `(${pastGroups.length})`}
        </button>
      </div>

      {/* Festival filter pills */}
      <div className="flex flex-wrap gap-2 justify-center px-4 pb-8">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-3 py-0.5 rounded-full text-xs font-medium transition-colors border ${
              activeFilter === key
                ? view === 'upcoming'
                  ? 'bg-amber-500 border-amber-500 text-gray-900'
                  : 'bg-gray-600 border-gray-600 text-white'
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
        {visibleGroups.length === 0 && (
          <p className="text-center text-gray-600 text-sm pt-8">No festivals here yet.</p>
        )}
        {visibleGroups.map(([festivalKey, { festival, year, days }]) => (
          <div key={festivalKey}>
            <h2 className={`font-bold text-xl mb-4 text-center ${isPast ? 'text-gray-500' : 'text-amber-400'}`}>
              {festival} {year}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {days.map(day => (
                <DayCard key={day.id} day={day} onSelectDay={onSelectDay} past={isPast} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
