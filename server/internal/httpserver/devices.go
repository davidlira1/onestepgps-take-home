package httpserver

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/davidlira1/onestepgps-take-home/server/internal/device"
)

type DeviceHandler struct {
	lister device.Lister
	log    *slog.Logger
}

func (h DeviceHandler) list(w http.ResponseWriter, r *http.Request) {
	devices, err := h.lister.List(r.Context())
	if err != nil {
		h.log.Error("list devices", "err", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return
	}
	if devices == nil {
		devices = []device.Device{}
	}
	writeJSON(w, http.StatusOK, devices)
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
