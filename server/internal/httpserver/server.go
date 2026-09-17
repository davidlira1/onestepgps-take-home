package httpserver

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"time"

	"github.com/davidlira1/onestepgps-take-home/server/internal/device"
	"github.com/davidlira1/onestepgps-take-home/server/internal/pref"
)

type Server struct {
	httpServer *http.Server
	log        *slog.Logger
}

func New(addr string, lister device.Lister, store pref.Store, log *slog.Logger) *Server {
	mux := http.NewServeMux()
	
	devices := DeviceHandler{lister: lister, log: log}
	mux.HandleFunc("GET /api/devices", devices.list)

	preferences := PreferencesHandler{store: store, log: log}
	mux.HandleFunc("GET /api/preferences", preferences.get)
	mux.HandleFunc("PATCH /api/preferences", preferences.patch)

	return &Server{
		httpServer: &http.Server{
			Addr:              addr,
			Handler:           mux,
			ReadHeaderTimeout: 5 * time.Second,
			IdleTimeout:       60 * time.Second,
		},
		log: log,
	}
}

func (s *Server) Handler() http.Handler {
	return s.httpServer.Handler
}

func (s *Server) Run(ctx context.Context) error {
	errCh := make(chan error, 1)
	go func() {
		s.log.Info("listening", "addr", s.httpServer.Addr)
		err := s.httpServer.ListenAndServe()
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
			return
		}
		errCh <- nil
	}()

	select {
	case err := <-errCh:
		return err
	case <-ctx.Done():
		s.log.Info("shutting down")
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := s.httpServer.Shutdown(shutdownCtx); err != nil {
			return err
		}
		return <-errCh
	}
}
