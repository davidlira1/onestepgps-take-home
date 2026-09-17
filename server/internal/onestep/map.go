package onestep

import "github.com/davidlira1/onestepgps-take-home/server/internal/device"

func mapDevice(u upstreamDevice) device.Device {
	d := device.Device{
		ID:          u.DeviceID,
		Name:        u.DisplayName,
		Make:        u.Make,
		Model:       u.Model,
		ActiveState: u.ActiveState,
		Online:      u.Online,
	}

	if u.LatestDevicePoint != nil {
		d.DriveStatus = u.LatestDevicePoint.DeviceState.DriveStatus
		if !u.LatestDevicePoint.DTTracker.IsZero() {
			t := u.LatestDevicePoint.DTTracker
			d.LastSeenAt = &t
		}
	}

	if pos := positionPoint(u.LatestDevicePoint, u.LatestAccurateDevicePoint); pos != nil {
		d.Latitude = pos.Lat
		d.Longitude = pos.Lng
		d.Heading = pos.Angle
		d.SpeedKmh = pos.Speed
	}

	return d
}

func positionPoint(latest, accurate *upstreamPoint) *upstreamPoint {
	if hasValidFix(latest) {
		return latest
	}
	if hasValidFix(accurate) {
		return accurate
	}
	return nil
}

func hasValidFix(p *upstreamPoint) bool {
	return p != nil && p.Lat != nil && p.Lng != nil
}
