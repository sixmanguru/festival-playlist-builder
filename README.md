# Strange Trip — Festival Playlist Builder

A browser-based React + Vite app for building Spotify playlists around music festival lineups.  
Live at **[strangetrip.app](https://strangetrip.app)**

---

## What it does

1. **Land** — Psychedelic splash screen with Enter button
2. **Login** — Spotify OAuth 2.0 PKCE (no backend, tokens stored in localStorage)
3. **Browse** — Home page shows festival day cards with date and city; **Upcoming / Archive** tabs separate future from past festivals; filter pills narrow to a single festival
4. **Select a day** — Click a day card to see its full lineup
5. **Select** — Expand an artist to load tracks, or use **Load All Artists** to pre-fetch everyone at once; once loaded a banner appears to **Select All Tracks** in one click
6. **Create** — Name the playlist and click "Create Playlist" → appears in Spotify instantly
7. **Request** — "Don't see your festival?" link opens a form to request a festival be added; requests are emailed via Cloudflare Pages Function + Resend

---

## Current festivals

- **Governors Ball 2026** — 3 days (Jun 5–7), Queens NY
- **Bonnaroo 2026** — 4 days (Jun 11–14), Manchester TN
- **Vans Warped Tour DC 2026** — Jun 13–14, Washington DC
- **Telluride Bluegrass Festival 2026** — 4 days (Jun 18–21), Telluride CO
- **Green River Festival 2026** — 3 days (Jun 19–21), Greenfield MA
- **Red Wing Roots Music Festival 2026** — 3 days (Jun 19–21), Mount Solon VA
- **Summer Jam 2026** — 2 days (Jun 19–20), Eau Claire WI
- **We Belong Here Brooklyn 2026** — 3 days (Jun 19–21), Brooklyn NY
- **Zootown Music Festival 2026** — 2 days (Jun 19–20), Missoula MT
- **Cotton Fest 2026** — Jun 25–27, Lubbock TX
- **Blues From the Top 2026** — 3 days (Jun 26–28), Winter Park CO
- **Fitzgerald's American Music Festival 2026** — 4 days (Jul 2–5), Berwyn IL
- **Willie Nelson's 4th of July Picnic 2026** — Jul 4, Austin TX
- **Mosswood Meltdown 2026** — 3 days (Jul 17–19), Oakland CA
- **Newport Folk Festival 2026** — 3 days (Jul 24–26), Newport RI
- **Underground Music Showcase 2026** — Jul 24–26, Denver CO
- **Levitation 2026** — 4 days (Sep 10–13), Austin TX
- **Bourbon & Beyond 2026** — 4 days (Sep 24–27), Louisville KY

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

Environment variables (set in Cloudflare Pages → Settings → Environment Variables):

| Variable | Notes |
|---|---|
| `VITE_SPOTIFY_CLIENT_ID` | Spotify app client ID |
| `RESEND_API_KEY` | Resend API key — set as **Secret** |
| `NOTIFY_EMAIL` | Email address to receive festival requests |

SPA routing handled by `public/_redirects` (`/* /index.html 200`).

Pages Functions in `functions/` deploy automatically alongside the site.

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
├── files/                       ← source-of-truth JSON files, one per festival
├── functions/
│   └── api/
│       └── request-festival.js  ← Pages Function: receives festival requests, emails via Resend
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx                  ← root component, landing → login → home → day view
    ├── data/
    │   └── artists.js           ← FESTIVAL_DAYS array + FESTIVAL_META city lookup
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
        ├── FestivalHome.jsx     ← Upcoming/Archive tabs, filter pills, day cards, request link
        ├── RequestFestivalModal.jsx ← festival request form (festival, location, notify email)
        ├── Header.jsx           ← back button, festival name, logout
        ├── ArtistList.jsx       ← track limit, Load All, Select All Tracks banner
        ├── ArtistRow.jsx
        ├── TrackList.jsx
        ├── TrackItem.jsx
        └── PlaylistPanel.jsx    ← sticky bottom bar: name + create button
```

---

## Adding a new festival

1. **Add a JSON file** to `files/` (use an existing one as a template). This is the source of truth.

2. **Add entries to `FESTIVAL_DAYS`** in `src/data/artists.js`. Keep the array in chronological order. Use `"Weekday, Month Day"` for day dates; `"Month N–M"` for unscheduled all-days entries.

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

3. **Add the city to `FESTIVAL_META`** in the same file:

```js
'Festival Name': { city: 'City, ST' },
```

Push to GitHub — Cloudflare auto-deploys.

---

## Key technical notes

- **No React Router** — `/callback` detected via `window.location.pathname` in `useAuth`
- **Dynamic redirect URI** — uses `window.location.origin` so it works on any domain
- **Track fetching** — uses `GET /search?q={artist}&type=track` with a configurable max (default 5, up to 10); `/top-tracks` endpoint is deprecated for this app tier
- **Track deduplication** — results are deduped by normalized track name so the same song doesn't appear twice across album editions
- **Featured artist filtering** — tracks containing "feat", "ft", or "with" in the title are excluded unless the searched artist is the primary artist (`artists[0]`); true collaborations with no such keyword are kept
- **Load All** — pre-fetches all artists in batches of 4 with 250ms delay to avoid rate limiting; shows a "Select All Tracks" banner when complete
- **Track batching** — playlist adds chunked to 100 URIs per request (Spotify limit)
- **Token refresh** — `getValidToken()` auto-refreshes before expiry
- **Festival requests** — `functions/api/request-festival.js` is a Cloudflare Pages Function; `RESEND_API_KEY` and `NOTIFY_EMAIL` are Pages secrets, never in client code
