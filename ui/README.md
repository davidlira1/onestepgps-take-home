# UI

Vue 3 + Vite + TypeScript dashboard. Clone-and-run steps live in the [root README](../README.md).

```bash
export VITE_GOOGLE_MAPS_API_KEY=your-maps-key
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:8080`. Restart `npm run dev` after changing exported Vite variables.

`VITE_USE_MOCK_DEVICES=true` serves the device list from a local mock fleet instead of `GET /api/devices`.

### Tests

```
npm test
```
