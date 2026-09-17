package onestep

import (
	"testing"
	"time"
)

func TestMapDevicePosition(t *testing.T) {
	latestLat, latestLng := 37.3767, -121.8256
	accurateLat, accurateLng := 34.4164, -118.5597
	latestSeen := time.Date(2026, 9, 17, 2, 43, 9, 0, time.UTC)

	tests := []struct {
		name        string
		in          upstreamDevice
		wantLat     *float64
		wantLng     *float64
		wantHeading float64
		wantSpeed   float64
		wantDrive   string
		wantSeen    *time.Time
	}{
		{
			name: "latest coords",
			in: upstreamDevice{
				LatestDevicePoint: &upstreamPoint{
					DTTracker:   latestSeen,
					Lat:         &latestLat,
					Lng:         &latestLng,
					Angle:       341,
					Speed:       12,
					DeviceState: upstreamState{DriveStatus: "off"},
				},
				LatestAccurateDevicePoint: &upstreamPoint{
					Lat:   &accurateLat,
					Lng:   &accurateLng,
					Angle: 10,
					Speed: 99,
				},
			},
			wantLat:     &latestLat,
			wantLng:     &latestLng,
			wantHeading: 341,
			wantSpeed:   12,
			wantDrive:   "off",
			wantSeen:    &latestSeen,
		},
		{
			name: "fallback to accurate when latest coords missing",
			in: upstreamDevice{
				LatestDevicePoint: &upstreamPoint{
					DTTracker:   latestSeen,
					Angle:       0,
					Speed:       5,
					DeviceState: upstreamState{DriveStatus: "idle"},
				},
				LatestAccurateDevicePoint: &upstreamPoint{
					Lat:   &accurateLat,
					Lng:   &accurateLng,
					Angle: 283,
					Speed: 0,
				},
			},
			wantLat:     &accurateLat,
			wantLng:     &accurateLng,
			wantHeading: 283,
			wantSpeed:   0,
			wantDrive:   "idle",
			wantSeen:    &latestSeen,
		},
		{
			name: "fallback to accurate when latest has only one coordinate",
			in: upstreamDevice{
				LatestDevicePoint: &upstreamPoint{
					DTTracker:   latestSeen,
					Lat:         &latestLat,
					Angle:       90,
					Speed:       20,
					DeviceState: upstreamState{DriveStatus: "driving"},
				},
				LatestAccurateDevicePoint: &upstreamPoint{
					Lat:   &accurateLat,
					Lng:   &accurateLng,
					Angle: 45,
					Speed: 8,
				},
			},
			wantLat:     &accurateLat,
			wantLng:     &accurateLng,
			wantHeading: 45,
			wantSpeed:   8,
			wantDrive:   "driving",
			wantSeen:    &latestSeen,
		},
		{
			name: "no coordinates when neither has a valid fix",
			in: upstreamDevice{
				LatestDevicePoint: &upstreamPoint{
					DTTracker:   latestSeen,
					Lat:         &latestLat,
					DeviceState: upstreamState{DriveStatus: "off"},
				},
				LatestAccurateDevicePoint: &upstreamPoint{
					Lng: &accurateLng,
				},
			},
			wantLat:     nil,
			wantLng:     nil,
			wantHeading: 0,
			wantSpeed:   0,
			wantDrive:   "off",
			wantSeen:    &latestSeen,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := mapDevice(tt.in)

			assertFloatPtr(t, "latitude", got.Latitude, tt.wantLat)
			assertFloatPtr(t, "longitude", got.Longitude, tt.wantLng)

			if got.Heading != tt.wantHeading {
				t.Errorf("heading = %v, want %v", got.Heading, tt.wantHeading)
			}
			if got.SpeedKmh != tt.wantSpeed {
				t.Errorf("speed_kmh = %v, want %v", got.SpeedKmh, tt.wantSpeed)
			}
			if got.DriveStatus != tt.wantDrive {
				t.Errorf("drive_status = %q, want %q", got.DriveStatus, tt.wantDrive)
			}
			assertTimePtr(t, "last_seen_at", got.LastSeenAt, tt.wantSeen)
		})
	}
}

func assertFloatPtr(t *testing.T, name string, got, want *float64) {
	t.Helper()
	switch {
	case got == nil && want == nil:
		return
	case got == nil || want == nil:
		t.Errorf("%s = %v, want %v", name, got, want)
	case *got != *want:
		t.Errorf("%s = %v, want %v", name, *got, *want)
	}
}

func assertTimePtr(t *testing.T, name string, got, want *time.Time) {
	t.Helper()
	switch {
	case got == nil && want == nil:
		return
	case got == nil || want == nil:
		t.Errorf("%s = %v, want %v", name, got, want)
	case !got.Equal(*want):
		t.Errorf("%s = %v, want %v", name, *got, *want)
	}
}
