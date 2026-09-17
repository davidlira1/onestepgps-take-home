package httpserver

import (
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"

	"github.com/davidlira1/onestepgps-take-home/server/internal/pref"
)

type PreferencesHandler struct {
	store pref.Store
	log   *slog.Logger
}

func (h PreferencesHandler) get(w http.ResponseWriter, r *http.Request) {
	p, err := h.store.Get(r.Context())
	if err != nil {
		h.log.Error("get preferences", "err", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return
	}
	p.Normalize()
	writeJSON(w, http.StatusOK, p)
}

func (h PreferencesHandler) patch(w http.ResponseWriter, r *http.Request) {
	var patch pref.Patch
	if err := json.NewDecoder(r.Body).Decode(&patch); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}
	if patch.Version == nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "version is required"})
		return
	}

	current, err := h.store.Get(r.Context())
	if err != nil {
		h.log.Error("get preferences", "err", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return
	}

	p := pref.Apply(current, patch)
	if err := pref.Validate(p); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	saved, err := h.store.Put(r.Context(), *patch.Version, p)
	if errors.Is(err, pref.ErrConflict) {
		writeJSON(w, http.StatusConflict, map[string]string{"error": "version conflict"})
		return
	}
	if err != nil {
		h.log.Error("put preferences", "err", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal server error"})
		return
	}
	writeJSON(w, http.StatusOK, saved)
}
