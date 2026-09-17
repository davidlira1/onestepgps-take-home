package config

import (
	"fmt"
	"os"
)

type Config struct {
	Port        string
	APIKey      string
	PrefsDBPath string
}

func Load() (Config, error) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	apiKey := os.Getenv("ONESTEP_API_KEY")
	if apiKey == "" {
		return Config{}, fmt.Errorf("ONESTEP_API_KEY is required")
	}

	prefsDBPath := os.Getenv("PREFS_DB_PATH")
	if prefsDBPath == "" {
		prefsDBPath = "data/preferences.db"
	}

	return Config{Port: port, APIKey: apiKey, PrefsDBPath: prefsDBPath}, nil
}

func (c Config) Addr() string {
	return ":" + c.Port
}
