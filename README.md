# Strange Trip — Festival Playlist Builder

A browser-only React + Vite app for building Spotify playlists around music festival lineups.  
Live at **[strangetrip.app](https://strangetrip.app)**

---

## What it does

1. **Login** — Spotify OAuth 2.0 PKCE (no backend, tokens stored in localStorage)
2. **Browse** — Home page shows festival day cards; click a day to see its lineup
3. **Select** — Expand an artist to load their top 10 tracks, check what you want
4. **Create** — Name the playlist and click "Create Playlist" → appears in Spotify instantly

---

## Current festivals

- **Bourbon & Beyond 2026** — 4 days (Sep 24–27), Louisville KY
  - Day 1: Foo Fighters & Queens of the Stone Age
  - Day 2: Mumford & Sons & Kacey Musgraves
  - Day 3: Chris Stapleton & The Red Clay Strays
  - Day 4: Dave Matthews Band & Hootie & The Blowfish

---

## Local development

```bash
cd ~/Documents/2026/FestivalApp
npm run dev
```

Open **`http://127.0.0.1:5173`** (not `localhost` — Spotify requires the exact redirect URI).

Create a `.env` file with:
```
VITE_SPOTIFY_CLIENT_ID=your_client_id_here
```

---

## Deployment

Hosted on **Cloudflare Pages**, auto-deploys from `main` branch on GitHub.

Build settings:
- Framework: React (Vite)
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_SPOTIFY_CLIENT_ID`

SPA routing handled by `public/_redirects` (`/* /index.html 200`).

---

## Spotify Developer Dashboard

Redirect URIs configured:
```
http://127.0.0.1:5173/callback        ← local dev
https://strangetrip.app/callback      ← production
https://festival-playlist-builder.pages.dev/callback  ← backup
```

Scopes: `playlist-modify-public`, `playlist-modify-private`, `user-read-private`

---

## Project structure

```
FestivalApp/
├── .env                         ← Spotify Client ID (not committed)
├── .gitignore
├── public/
│   └── _redirects               ← SPA catch-all for Cloudflare Pages
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx                  ← root component, home vs day view navigation
    ├── data/
    │   └── artists.js           ← festival lineup data (add new festivals here)
    ├── auth/
    │   ├── pkce.js              ← PKCE crypto, dynamic redirect URI
    │   └── spotify-auth.js      ← token exchange, refresh, localStorage
    ├── api/
    │   └── spotify.js           ← Spotify API: top tracks, search fallback, create/add playlist
    ├── hooks/
    │   ├── useAuth.js           ← /callback handling + session persistence
    │   ├── useArtistTracks.js   ← lazy per-artist track fetching
    │   └── usePlaylistBuilder.js ← track selection, playlist build flow
    └── components/
        ├── LoginScreen.jsx
        ├── FestivalHome.jsx     ← home page with festival day cards
        ├── Header.jsx           ← back button, festival name, logout
        ├── ArtistList.jsx
        ├── ArtistRow.jsx
        ├── TrackList.jsx
        ├── TrackItem.jsx
        └── PlaylistPanel.jsx    ← sticky bottom bar: name + create button
```

---

## Adding a new festival

Edit `src/data/artists.js` and add a new entry to the `FESTIVAL_DAYS` array:

```js
{
  id: 'festival-name-year-day1',
  festival: 'Festival Name',
  year: 2026,
  label: 'Day 1',
  date: 'Friday, October 1',
  headliners: 'Headliner One & Headliner Two',
  artists: ['Artist Name', ...],
}
```

Push to GitHub — Cloudflare auto-deploys.

---

## Key technical notes

- **No React Router** — `/callback` detected via `window.location.pathname` in `useAuth`
- **Dynamic redirect URI** — uses `window.location.origin` so it works on any domain
- **Top-tracks fallback** — Spotify dev mode blocks `/top-tracks`; app falls back to search API
- **Track batching** — playlist adds chunked to 100 URIs per request (Spotify limit)
- **Token refresh** — `getValidToken()` auto-refreshes before expiry
