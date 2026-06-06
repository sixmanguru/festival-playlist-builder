export function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-3xl mx-auto">
        <div
          className="absolute inset-0 rounded-xl blur-2xl scale-95"
          style={{ background: 'radial-gradient(ellipse at center, rgba(160,80,10,0.5) 0%, rgba(100,30,5,0.3) 50%, transparent 75%)' }}
        />
        <img
          src="/strangetrip.png"
          alt="Strange Trip — Festival Playlist Builder"
          className="relative w-full h-auto block"
        />
      </div>

      <button
        onClick={onEnter}
        className="mt-10 px-10 py-3 rounded-full text-sm font-bold tracking-[0.2em] uppercase transition-all border-2 border-amber-500/60 text-amber-300 hover:border-amber-400 hover:text-amber-200 hover:shadow-[0_0_24px_rgba(245,158,11,0.25)]"
        style={{ letterSpacing: '0.25em' }}
      >
        Enter
      </button>

      <p className="mt-4 text-amber-400/75 text-xs tracking-widest uppercase">
        making your long, strange trip better
      </p>
    </div>
  )
}
