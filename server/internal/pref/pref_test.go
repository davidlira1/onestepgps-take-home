package pref

import (
	"errors"
	"reflect"
	"testing"
)

func TestApply(t *testing.T) {
	base := Preferences{
		Version:         7,
		Sort:            SortNameAsc,
		HiddenDeviceIDs: []string{"device-1"},
		MapType:         MapRoadmap,
		Theme:           ThemeLight,
	}

	themeDark := ThemeDark
	hiddenEmpty := []string{}
	hiddenReplaced := []string{"device-2", "device-3"}

	tests := []struct {
		name  string
		patch Patch
		want  Preferences
	}{
		{
			name:  "theme only",
			patch: Patch{Theme: &themeDark},
			want: Preferences{
				Version:         7,
				Sort:            SortNameAsc,
				HiddenDeviceIDs: []string{"device-1"},
				MapType:         MapRoadmap,
				Theme:           ThemeDark,
			},
		},
		{
			name:  "empty patch is no-op",
			patch: Patch{},
			want:  base,
		},
		{
			name:  "replace hidden device ids",
			patch: Patch{HiddenDeviceIDs: &hiddenReplaced},
			want: Preferences{
				Version:         7,
				Sort:            SortNameAsc,
				HiddenDeviceIDs: []string{"device-2", "device-3"},
				MapType:         MapRoadmap,
				Theme:           ThemeLight,
			},
		},
		{
			name:  "clear hidden device ids",
			patch: Patch{HiddenDeviceIDs: &hiddenEmpty},
			want: Preferences{
				Version:         7,
				Sort:            SortNameAsc,
				HiddenDeviceIDs: []string{},
				MapType:         MapRoadmap,
				Theme:           ThemeLight,
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := Apply(base, tt.patch)
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Apply() = %+v, want %+v", got, tt.want)
			}
		})
	}
}

func TestValidate(t *testing.T) {
	valid := Default()

	tests := []struct {
		name    string
		modify  func(p *Preferences)
		wantErr bool
	}{
		{
			name:    "valid default",
			modify:  func(p *Preferences) {},
			wantErr: false,
		},
		{
			name: "valid custom",
			modify: func(p *Preferences) {
				p.Sort = SortLastSeenDesc
				p.MapType = MapSatellite
				p.Theme = ThemeDark
			},
			wantErr: false,
		},
		{
			name: "invalid sort",
			modify: func(p *Preferences) {
				p.Sort = "bad_sort"
			},
			wantErr: true,
		},
		{
			name: "invalid map_type",
			modify: func(p *Preferences) {
				p.MapType = "bad_map"
			},
			wantErr: true,
		},
		{
			name: "invalid theme",
			modify: func(p *Preferences) {
				p.Theme = "bad_theme"
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			p := valid
			tt.modify(&p)
			err := Validate(p)
			if (err != nil) != tt.wantErr {
				t.Fatalf("Validate() err = %v, wantErr = %v", err, tt.wantErr)
			}
			if tt.wantErr && !errors.Is(err, ErrInvalid) {
				t.Errorf("Validate() err = %v, want to wrap ErrInvalid", err)
			}
		})
	}
}
