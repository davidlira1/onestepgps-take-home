package sqlite

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/davidlira1/onestepgps-take-home/server/internal/pref"
	_ "modernc.org/sqlite"
)

const schema = `
CREATE TABLE IF NOT EXISTS preferences (
	id INTEGER PRIMARY KEY CHECK (id = 1),
	payload TEXT NOT NULL,
	version INTEGER NOT NULL DEFAULT 1
);
`

type Store struct {
	db *sql.DB
}

func Open(path string) (*Store, error) {
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return nil, fmt.Errorf("pref sqlite: mkdir: %w", err)
	}

	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, fmt.Errorf("pref sqlite: open: %w", err)
	}

	if _, err := db.Exec(schema); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("pref sqlite: schema: %w", err)
	}
	if err := seed(db); err != nil {
		_ = db.Close()
		return nil, err
	}

	return &Store{db: db}, nil
}

func seed(db *sql.DB) error {
	raw, err := marshalPayload(pref.Default())
	if err != nil {
		return fmt.Errorf("pref sqlite: seed: %w", err)
	}
	_, err = db.Exec(`INSERT OR IGNORE INTO preferences (id, payload, version) VALUES (1, ?, 1)`, raw)
	if err != nil {
		return fmt.Errorf("pref sqlite: seed: %w", err)
	}
	return nil
}

func (s *Store) Close() error {
	return s.db.Close()
}

func (s *Store) Get(ctx context.Context) (pref.Preferences, error) {
	var raw string
	var version int
	err := s.db.QueryRowContext(ctx, `SELECT payload, version FROM preferences WHERE id = 1`).Scan(&raw, &version)
	if err != nil {
		return pref.Preferences{}, fmt.Errorf("pref sqlite: get: %w", err)
	}

	p := pref.Default()
	if err := json.Unmarshal([]byte(raw), &p); err != nil {
		return pref.Preferences{}, fmt.Errorf("pref sqlite: decode: %w", err)
	}
	p.Normalize()
	p.Version = version
	return p, nil
}

func (s *Store) Put(ctx context.Context, expectedVersion int, p pref.Preferences) (pref.Preferences, error) {
	p.Normalize()
	raw, err := marshalPayload(p)
	if err != nil {
		return pref.Preferences{}, fmt.Errorf("pref sqlite: encode: %w", err)
	}

	res, err := s.db.ExecContext(ctx, `
		UPDATE preferences
		SET payload = ?, version = version + 1
		WHERE id = 1 AND version = ?
	`, raw, expectedVersion)
	if err != nil {
		return pref.Preferences{}, fmt.Errorf("pref sqlite: put: %w", err)
	}
	n, err := res.RowsAffected()
	if err != nil {
		return pref.Preferences{}, fmt.Errorf("pref sqlite: put: %w", err)
	}
	if n == 0 {
		return pref.Preferences{}, pref.ErrConflict
	}

	p.Version = expectedVersion + 1
	return p, nil
}

func marshalPayload(p pref.Preferences) (string, error) {
	p.Version = 0
	raw, err := json.Marshal(p)
	if err != nil {
		return "", err
	}
	return string(raw), nil
}
