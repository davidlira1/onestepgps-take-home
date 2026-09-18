# UI

Vue 3 + Vite + TypeScript dashboard for the OneStep GPS take-home.

Start the Go server on port 8080 first, then:

```
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:8080`. AppShell loads devices once on mount and passes them into the sidebar and map pane.

### Google Maps

Add a Maps JavaScript API key to `ui/.env.local` (restart Vite after changing it):

```
VITE_GOOGLE_MAPS_API_KEY=your-key
```

The first map slice only loads an empty map centered on Los Angeles. Device markers come later.

### Mock Development Mode

To run frontend development with 5 hardcoded Los Angeles County devices without making backend or third-party GPS API calls, add `VITE_USE_MOCK_DEVICES=true` in `ui/.env.local`:

```
VITE_USE_MOCK_DEVICES=true
```

### Running Tests

```
npm test
```
