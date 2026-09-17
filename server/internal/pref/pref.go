package pref

import (
	"context"
	"errors"
	"fmt"
)

const (
	SortNameAsc      = "name_asc"
	SortNameDesc     = "name_desc"
	SortLastSeenDesc = "last_seen_desc"

	MapRoadmap   = "roadmap"
	MapSatellite = "satellite"

	ThemeLight = "light"
	ThemeDark  = "dark"
)

var (
	ErrInvalid  = errors.New("invalid preferences")
	ErrConflict = errors.New("preferences version conflict")
)

type Preferences struct {
	Version         int      `json:"version,omitempty"`
	Sort            string   `json:"sort"`
	HiddenDeviceIDs []string `json:"hidden_device_ids"`
	MapType         string   `json:"map_type"`
	Theme           string   `json:"theme"`
}

func Default() Preferences {
	return Preferences{
		Version:         1,
		Sort:            SortNameAsc,
		HiddenDeviceIDs: []string{},
		MapType:         MapRoadmap,
		Theme:           ThemeLight,
	}
}

func (p *Preferences) Normalize() {
	if p.HiddenDeviceIDs == nil {
		p.HiddenDeviceIDs = []string{}
	}
}

func Validate(p Preferences) error {
	switch p.Sort {
	case SortNameAsc, SortNameDesc, SortLastSeenDesc:
	default:
		return fmt.Errorf("%w: sort", ErrInvalid)
	}
	switch p.MapType {
	case MapRoadmap, MapSatellite:
	default:
		return fmt.Errorf("%w: map_type", ErrInvalid)
	}
	switch p.Theme {
	case ThemeLight, ThemeDark:
	default:
		return fmt.Errorf("%w: theme", ErrInvalid)
	}
	return nil
}

type Patch struct {
	Version         *int      `json:"version"`
	Sort            *string   `json:"sort"`
	HiddenDeviceIDs *[]string `json:"hidden_device_ids"`
	MapType         *string   `json:"map_type"`
	Theme           *string   `json:"theme"`
}

func Apply(current Preferences, patch Patch) Preferences {
	if patch.Sort != nil {
		current.Sort = *patch.Sort
	}
	if patch.HiddenDeviceIDs != nil {
		current.HiddenDeviceIDs = *patch.HiddenDeviceIDs
	}
	if patch.MapType != nil {
		current.MapType = *patch.MapType
	}
	if patch.Theme != nil {
		current.Theme = *patch.Theme
	}
	current.Normalize()
	return current
}

type Store interface {
	Get(ctx context.Context) (Preferences, error)
	Put(ctx context.Context, expectedVersion int, p Preferences) (Preferences, error)
}
