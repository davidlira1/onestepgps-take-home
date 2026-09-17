package device

import "time"

// Device is the JSON shape we expose to the UI. It is not the OneStep GPS payload.
type Device struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Make        string     `json:"make"`
	Model       string     `json:"model"`
	ActiveState string     `json:"active_state"`
	Online      bool       `json:"online"`
	DriveStatus string     `json:"drive_status"`
	Latitude    *float64   `json:"latitude"`
	Longitude   *float64   `json:"longitude"`
	Heading     float64    `json:"heading"`
	SpeedKmh    float64    `json:"speed_kmh"`
	LastSeenAt  *time.Time `json:"last_seen_at"`
}
