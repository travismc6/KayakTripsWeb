# KayakTrips Web

Next.js dashboard for the KayakTrips API.

Requires Node.js 20 or newer.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

The app defaults to the deployed API. Set `KAYAKTRIPS_API_URL` to use another backend.

To enable the interactive location and trip maps, enable the Google Maps JavaScript API
in Google Cloud and set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`. Restrict the
browser key to the app's local and deployed domains. Without a key, map views provide
direct Google Maps links for every recorded coordinate.
