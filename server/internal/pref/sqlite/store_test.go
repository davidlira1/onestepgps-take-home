package sqlite

import (
	"context"
	"errors"
	"path/filepath"
	"reflect"
	"testing"

	"github.com/davidlira1/onestepgps-take-home/server/internal/pref"
)

func TestPutConflict(t *testing.T) {
	store, err := Open(filepath.Join(t.TempDir(), "prefs.db"))
	if err != nil {
		t.Fatalf("Open: %v", err)
	}
	t.Cleanup(func() { _ = store.Close() })

	ctx := context.Background()
	current, err := store.Get(ctx)
	if err != nil {
		t.Fatalf("Get: %v", err)
	}
	if current.Version != 1 {
		t.Fatalf("Get version = %d, want 1", current.Version)
	}

	updated := current
	updated.Theme = pref.ThemeDark
	saved, err := store.Put(ctx, current.Version, updated)
	if err != nil {
		t.Fatalf("first Put: %v", err)
	}
	if saved.Version != 2 {
		t.Fatalf("first Put version = %d, want 2", saved.Version)
	}

	_, err = store.Put(ctx, current.Version, updated)
	if !errors.Is(err, pref.ErrConflict) {
		t.Fatalf("second Put err = %v, want %v", err, pref.ErrConflict)
	}
}

func TestStore_RoundTrip(t *testing.T) {
	store, err := Open(filepath.Join(t.TempDir(), "prefs.db"))
	if err != nil {
		t.Fatalf("Open: %v", err)
	}
	t.Cleanup(func() { _ = store.Close() })

	ctx := context.Background()
	current, err := store.Get(ctx)
	if err != nil {
		t.Fatalf("Get: %v", err)
	}

	current.Theme = pref.ThemeDark
	current.Sort = pref.SortLastSeenDesc
	current.HiddenDeviceIDs = []string{"dev-1", "dev-2"}

	saved, err := store.Put(ctx, current.Version, current)
	if err != nil {
		t.Fatalf("Put: %v", err)
	}

	got, err := store.Get(ctx)
	if err != nil {
		t.Fatalf("second Get: %v", err)
	}
	if !reflect.DeepEqual(got, saved) {
		t.Errorf("Get after Put = %+v, want %+v", got, saved)
	}
}
