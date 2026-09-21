# Server

Go API for the OneStep GPS dashboard. Clone-and-run for the full app is in the [root README](../README.md).

```bash
export ONESTEP_API_KEY=your-key
go run ./cmd/server
```

Listens on port 8080 by default (`PORT` to change it). Preferences are stored in SQLite (`PREFS_DB_PATH`, default `data/preferences.db`).

```bash
go test ./...
```

## API

Base URL: `http://localhost:8080`

### `GET /api/devices`

Latest devices from OneStep GPS. Returns a JSON array.

```bash
curl localhost:8080/api/devices
```

```json
[
  {
    "id": "abc123",
    "name": "Ford Lightning",
    "make": "Ford",
    "model": "F-150 Lightning",
    "active_state": "active",
    "online": true,
    "drive_status": "driving",
    "latitude": 34.0522,
    "longitude": -118.2437,
    "heading": 90,
    "speed_kmh": 45,
    "last_seen_at": "2026-09-21T16:00:00Z"
  }
]
```

`latitude` and `longitude` are `null` when there is no valid fix. `500` if the upstream request fails.

### `GET /api/preferences`

Current saved view preferences.

```bash
curl localhost:8080/api/preferences
```

```json
{
  "version": 1,
  "sort": "name_asc",
  "hidden_device_ids": [],
  "map_type": "roadmap",
  "theme": "light"
}
```

| Field | Values |
| --- | --- |
| `sort` | `name_asc`, `name_desc`, `last_seen_desc` |
| `map_type` | `roadmap`, `satellite` |
| `theme` | `light`, `dark` |

### `PATCH /api/preferences`

Send `version` (required) plus only the fields to change. Omitted fields stay as they are.

```bash
curl -X PATCH localhost:8080/api/preferences \
  -H "Content-Type: application/json" \
  -d '{"version":1,"theme":"dark"}'
```

| Status | When |
| --- | --- |
| `200` | Saved. Body is the updated preferences, including the new `version`. |
| `400` | Invalid JSON, missing `version`, or invalid `sort` / `map_type` / `theme`. |
| `409` | Stale `version`. GET again and retry with the current version. |
