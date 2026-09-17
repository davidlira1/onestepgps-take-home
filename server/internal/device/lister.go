package device

import "context"

// Lister is the port HTTP handlers use to load devices.
type Lister interface {
	List(ctx context.Context) ([]Device, error)
}

// StaticLister returns a fixed snapshot. It is useful for tests and as a stub
// until a OneStep GPS client is wired in.
type StaticLister struct {
	devices []Device
}

func NewStaticLister(devices []Device) StaticLister {
	out := make([]Device, len(devices))
	copy(out, devices)
	return StaticLister{devices: out}
}

func (l StaticLister) List(context.Context) ([]Device, error) {
	out := make([]Device, len(l.devices))
	copy(out, l.devices)
	return out, nil
}
