# Strange Trip — Festival Playlist Builder

A browser-only React + Vite app for building Spotify playlists around music festival lineups.  
Live at **[strangetrip.app](https://strangetrip.app)**

---

## What it does

1. **Land** — Psychedelic splash screen with Enter button
2. **Login** — Spotify OAuth 2.0 PKCE (no backend, tokens stored in localStorage)
3. **Filter** — Festival filter pills let you narrow to a single festival
4. **Browse** — Home page shows festival day cards; click a day to see its lineup
5. **Select** — Expand an artist to load tracks (3–10 per artist), or use Load All to pre-fetch everyone at once
6. **Create** — Name the playlist and click "Create Playlist" → appears in Spotify instantly

---

## Current festivals

- **Bonnaroo 2026** — 4 days (Jun 11–14), Manchester TN
  - Day 1: Skrillex & Four Tet
  - Day 2: The Strokes & Major Lazer
  - Day 3: RÜFÜS DU SOL & Alabama Shakes
  - Day 4: Noah Kahan & Kesha

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
│   ├── _redirects               ← SPA catch-all for Cloudflare Pages
│   └── strangetrip.png          ← masthead / landing page image
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx                  ← root component, landing → login → home → day view
    ├── data/
    │   └── artists.js           ← festival lineup data (add new festivals here)
    ├── auth/
    │   ├── pkce.js              ← PKCE crypto, dynamic redirect URI
    │   └── spotify-auth.js      ← token exchange, refresh, localStorage
    ├── api/
    │   └── spotify.js           ← Spotify API: artist search, track search, create/add playlist
    ├── hooks/
    │   ├── useAuth.js           ← /callback handling + session persistence
    │   ├── useArtistTracks.js   ← lazy per-artist track fetching
    │   └── usePlaylistBuilder.js ← track selection, playlist build flow
    └── components/
        ├── LandingPage.jsx      ← splash screen with Enter button
        ├── Masthead.jsx         ← strangetrip.png header used on home page
        ├── LoginScreen.jsx
        ├── FestivalHome.jsx     ← festival filter pills + day cards
        ├── Header.jsx           ← back button, festival name, logout
        ├── ArtistList.jsx       ← instructions, track limit dropdown, Load All button
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
- **Track fetching** — uses `GET /search?q={artist}&type=track&limit={n}` (max 10); `/top-tracks` endpoint is deprecated for this app tier
- **Load All** — pre-fetches all artists in batches of 4 with 250ms delay to avoid rate limiting
- **Track batching** — playlist adds chunked to 100 URIs per request (Spotify limit)
- **Token refresh** — `getValidToken()` auto-refreshes before expiry
