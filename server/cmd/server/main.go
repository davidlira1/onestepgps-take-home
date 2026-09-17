package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/davidlira1/onestepgps-take-home/server/internal/config"
	"github.com/davidlira1/onestepgps-take-home/server/internal/httpserver"
	"github.com/davidlira1/onestepgps-take-home/server/internal/onestep"
	prefsqlite "github.com/davidlira1/onestepgps-take-home/server/internal/pref/sqlite"
)

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	cfg, err := config.Load()
	if err != nil {
		log.Error("config", "err", err)
		os.Exit(1)
	}

	lister := onestep.NewClient(cfg.APIKey)

	store, err := prefsqlite.Open(cfg.PrefsDBPath)
	if err != nil {
		log.Error("preferences store", "err", err)
		os.Exit(1)
	}
	defer store.Close()

	srv := httpserver.New(cfg.Addr(), lister, store, log)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	if err := srv.Run(ctx); err != nil {
		log.Error("server stopped", "err", err)
		os.Exit(1)
	}
}
