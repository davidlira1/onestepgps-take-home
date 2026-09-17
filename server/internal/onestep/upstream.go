package onestep

import "time"

type listResponse struct {
	ResultList []upstreamDevice `json:"result_list"`
}

type upstreamDevice struct {
	DeviceID                  string         `json:"device_id"`
	DisplayName               string         `json:"display_name"`
	ActiveState               string         `json:"active_state"`
	Online                    bool           `json:"online"`
	Make                      string         `json:"make"`
	Model                     string         `json:"model"`
	LatestDevicePoint         *upstreamPoint `json:"latest_device_point"`
	LatestAccurateDevicePoint *upstreamPoint `json:"latest_accurate_device_point"`
}

type upstreamPoint struct {
	DTTracker   time.Time     `json:"dt_tracker"`
	Lat         *float64      `json:"lat"`
	Lng         *float64      `json:"lng"`
	Angle       float64       `json:"angle"`
	Speed       float64       `json:"speed"`
	DeviceState upstreamState `json:"device_state"`
}

type upstreamState struct {
	DriveStatus string `json:"drive_status"`
}
