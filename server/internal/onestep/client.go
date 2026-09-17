package onestep

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/davidlira1/onestepgps-take-home/server/internal/device"
)

const defaultBaseURL = "https://track.onestepgps.com/v3/api/public/device"

type Client struct {
	apiKey     string
	baseURL    string
	httpClient *http.Client
}

func NewClient(apiKey string) *Client {
	return &Client{
		apiKey:  apiKey,
		baseURL: defaultBaseURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *Client) List(ctx context.Context) ([]device.Device, error) {
	endpoint, err := url.Parse(c.baseURL)
	if err != nil {
		return nil, fmt.Errorf("onestep: parse url: %w", err)
	}

	query := endpoint.Query()
	query.Set("latest_point", "true")
	query.Set("api-key", c.apiKey)
	endpoint.RawQuery = query.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("onestep: new request: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("onestep: request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("onestep: unexpected status %d", resp.StatusCode)
	}

	var body listResponse
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return nil, fmt.Errorf("onestep: decode: %w", err)
	}

	devices := make([]device.Device, 0, len(body.ResultList))
	for _, u := range body.ResultList {
		devices = append(devices, mapDevice(u))
	}
	return devices, nil
}
