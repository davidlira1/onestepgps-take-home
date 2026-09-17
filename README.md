# OneStep GPS Dashboard

Take-home project for OneStep GPS.

A small dashboard for OneStep GPS devices: list them, plot their current positions on a map, and save view preferences on the server.

## Layout

- `server/` — Go API. Talks to the OneStep GPS public device endpoint, stores user preferences, and exposes the JSON the UI needs.
- `ui/` — Vue frontend. Device list, preference editing, and a live map.

Preferences are stored behind a storage interface in the server so the rest of the app does not depend on a specific database.

## Setup

Set `ONESTEP_API_KEY` to your public API key. The server will not start without it.

```
cd server
export ONESTEP_API_KEY=your-key
go run ./cmd/server
```

In another terminal:

```
curl localhost:8080/api/devices
```

The server listens on port 8080 by default. Set `PORT` to change it.
