# Energy Monitor — Web Dashboard

A plain HTML/CSS/JS site (no build step) with a login page and a 4-page
dashboard: **Dashboard**, **Raw Log**, **Daily Summary**, **Monthly Report** —
matching your Android app's screens and hitting the *same backend endpoints*
your `ApiService.java` already uses.

## Files
```
index.html      → login page (email/password + Google Sign-In)
dashboard.html   → live meters, relay switches, trend charts
rawlog.html      → full history table
daily.html       → daily summary table
monthly.html     → monthly report table
config.js        → the only file you MUST edit
api.js           → fetch calls, one per ApiService.java method
style.css        → design system
tilt.js          → the 3D hover-tilt effect on the meter cards
```

## Step 1 — Point it at your backend
Open `config.js` and set:
```js
API_BASE_URL: "https://your-backend-domain.com/"
```
This must be the same base URL your `RetrofitClient.java` uses — just reachable
from a browser, so it needs to be a public domain/IP (or `http://localhost:PORT/`
if you're testing the site and the backend on the same machine).

**CORS:** browsers block cross-origin requests by default. Your backend needs
to allow requests from wherever this site is hosted (e.g. add a CORS filter
that allows your site's origin, or `*` while testing).

## Step 2 — Set your device ID
```js
DEVICE_ID: "device1"
```
Use the same `deviceId` string your ESP32/meter and Android app already send.

## Step 3 — Google Sign-In (web)
Your Android app's Google client ID **will not work here** — web sign-in needs
its own OAuth client:
1. Go to Google Cloud Console → the same project your Android app uses.
2. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
3. Application type: **Web application**.
4. Add your site's URL (e.g. `https://yourdomain.com`) under *Authorized JavaScript origins*.
5. Copy the generated client ID into `config.js` → `GOOGLE_CLIENT_ID`.

On sign-in, the page sends Google's ID token to `POST api/auth/google` as
`{ "idToken": "..." }` — open `GoogleLoginRequest.java` and confirm the field
name matches. If your backend expects a different key, change it in `api.js`
inside `Api.googleLogin`.

## Step 4 — Check field names match your real responses
I don't have your backend's actual JSON shapes, so a few things in the code
are best guesses based on your Android model classes. Search for the `NOTE:`
comments in `api.js`, `index.html`, `dashboard.html`, `daily.html`, and
`monthly.html` — each one flags a field name to double-check against your
real `LoginResponse`, `RelayResponse`, `DailySummary`, and `MonthlySummary`
classes, and adjust if your backend calls them something else.

## Step 5 — Host it
Since it's plain static files, you can serve it from anywhere: your backend's
own static folder, GitHub Pages, Netlify, Vercel, or a simple `nginx` config —
whatever your backend is already deployed alongside works fine, just make sure
the site's origin is allowed by your backend's CORS settings and listed in
Google Cloud's authorized origins.

## What's already wired up
- Login/register/Google sign-in → stores the returned token in `localStorage`
  and attaches it as `Authorization: Bearer <token>` on every later request.
- Dashboard auto-refreshes live readings and relay status every 15 seconds.
- Relay switches call `setRelay` immediately on click and revert if the
  request fails.
- Charts (voltage/power/energy) pull from the history endpoint, same data
  your app's line charts use.
