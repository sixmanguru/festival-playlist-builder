import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'

export function RequestFestivalModal({ onClose }) {
  const [festival, setFestival] = useState('')
  const [location, setLocation] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | done | error
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/request-festival', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ festival, location, email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setStatus('done')
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'done' ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">🎪</div>
            <h2 className="text-white font-bold text-xl mb-2">Request received!</h2>
            <p className="text-gray-400 text-sm">
              We'll get it added — usually within a day. We'll email you when it's live.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 rounded-full text-sm font-medium bg-amber-600/20 border border-amber-600/40 text-amber-400 hover:bg-amber-600/30 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-white font-bold text-lg mb-1">Request a Festival</h2>
            <p className="text-gray-400 text-sm mb-5">
              Don't see your festival? Let us know — we usually get it added within a day.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Festival name</label>
                <input
                  type="text"
                  value={festival}
                  onChange={e => setFestival(e.target.value)}
                  placeholder="e.g. Lollapalooza"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 rounded-lg focus:border-amber-500 focus:outline-none placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Chicago, IL"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 rounded-lg focus:border-amber-500 focus:outline-none placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Email to notify when added</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 rounded-lg focus:border-amber-500 focus:outline-none placeholder-gray-600"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-xs">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-gray-900 transition-colors"
              >
                {status === 'submitting' && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === 'submitting' ? 'Sending…' : 'Submit Request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
