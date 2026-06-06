# Festival Playlist Builder

A browser-only React + Vite app for **Lovely Petal Festival (Sep 25–26, 2026)**.  
Log in with Spotify, browse artists by day, pick tracks, and create a playlist in one click.

---

## Status: Complete — ready to run

All source files are written. Dependencies are installed (`node_modules/` exists).  
The `.env` file already contains the Spotify Client ID.

---

## To start the dev server

Open a terminal and run:

```bash
cd ~/Documents/2026/FestivalApp
npm run dev
```

Then open **`http://127.0.0.1:5173`** in your browser (not `localhost` — Spotify requires the exact redirect URI).

> **Note:** Must be run from your own terminal app. Claude Code's shell can't execute the dev server from the Documents folder due to macOS privacy restrictions.

---

## Spotify Developer Dashboard

In [developer.spotify.com](https://developer.spotify.com/dashboard), your app must have this exact Redirect URI:

```
http://127.0.0.1:5173/callback
```

Scopes used: `playlist-modify-public`, `playlist-modify-private`, `user-read-private`

---

## Project structure

```
FestivalApp/
├── .env                         ← Spotify Client ID (already set)
├── .gitignore                   ← excludes .env and node_modules
├── index.html
├── package.json
├── vite.config.js               ← host: 127.0.0.1, port: 5173, Tailwind v4
└── src/
    ├── main.jsx
    ├── App.jsx                  ← root component, composes all hooks
    ├── index.css                ← Tailwind v4 import
    ├── data/
    │   └── artists.js           ← 27 Friday + 26 Saturday artists (hardcoded)
    ├── auth/
    │   ├── pkce.js              ← PKCE crypto: verifier, challenge, auth URL
    │   └── spotify-auth.js      ← token exchange, refresh, localStorage storage
    ├── api/
    │   └── spotify.js           ← Spotify Web API: search, top tracks, create/add playlist
    ├── hooks/
    │   ├── useAuth.js           ← handles /callback + session persistence
    │   ├── useArtistTracks.js   ← lazy per-artist track fetching, keyed by day+artist
    │   └── usePlaylistBuilder.js ← selected tracks Set, build flow, status
    └── components/
        ├── LoginScreen.jsx      ← full-page Spotify connect screen
        ├── Header.jsx           ← festival name, user, track count, logout
        ├── DayTabs.jsx          ← Friday / Saturday tab switcher
        ├── ArtistList.jsx       ← renders ArtistRow list, manages expanded state
        ├── ArtistRow.jsx        ← expandable row, Select All, lazy fetch trigger
        ├── TrackList.jsx        ← list of TrackItem
        ├── TrackItem.jsx        ← checkbox + album art + name + duration
        └── PlaylistPanel.jsx    ← sticky bottom bar: name input + Create button
```

---

## How the app works

1. **Login** — Spotify OAuth 2.0 PKCE (no backend, tokens stored in localStorage)
2. **Browse** — Friday/Saturday tabs; click an artist to expand and load their top 10 tracks
3. **Select** — Check individual tracks or use "Select All" per artist
4. **Create** — Enter a playlist name, click "Create Playlist" → opens in Spotify

---

## Key technical notes

- **No React Router** — `/callback` detection is done via `window.location.pathname` in `useAuth`
- **Token refresh** — `getValidToken()` auto-refreshes before expiry; all API calls go through it
- **Artist not found** — gracefully shows "Artist not found on Spotify" without blocking others
- **Yachtley Crew** appears on both days and has independent expand/select state per day
- **Track batching** — playlist adds are chunked to 100 URIs per request (Spotify API limit)
- **Rate limiting** — 429 responses are handled with `Retry-After` delay and retry
