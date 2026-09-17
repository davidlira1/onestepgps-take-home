# OneStep GPS Dashboard

A small dashboard for OneStep GPS devices: list them, plot their current positions on a map, and save view preferences on the server.

## Layout

The app will live in two directories once they exist:

- `server/` — Go API. Talks to the OneStep GPS public device endpoint, stores user preferences, and exposes the JSON the UI needs.
- `ui/` — Vue frontend. Device list, preference editing, and a live map.

Preferences are stored behind a storage interface in the server so the rest of the app does not depend on a specific database.

## Setup

Not ready to run yet. This repo is just getting started.
