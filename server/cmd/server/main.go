package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/davidlira1/onestepgps-take-home/server/internal/config"
	"github.com/davidlira1/onestepgps-take-home/server/internal/device"
	"github.com/davidlira1/onestepgps-take-home/server/internal/httpserver"
)

func main() {
	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	cfg := config.Load()
	lister := device.NewStaticLister(nil)
	srv := httpserver.New(cfg.Addr(), lister, log)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	if err := srv.Run(ctx); err != nil {
		log.Error("server stopped", "err", err)
		os.Exit(1)
	}
}
