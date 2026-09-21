import { LOCATION_ARROW_PATH } from '@/components/icons/locationArrowPath'

const ONLINE_FILL = '#2563eb'
const OFFLINE_FILL = '#9ca3af'
const HEADING_OFFSET_DEG = 45

export function deviceMarkerSymbol(
  mapsApi: typeof google,
  heading: number,
  online: boolean,
): google.maps.Symbol {
  return {
    path: LOCATION_ARROW_PATH,
    fillColor: online ? ONLINE_FILL : OFFLINE_FILL,
    fillOpacity: 1,
    strokeColor: '#fff',
    strokeWeight: 1,
    scale: 0.05,
    rotation: heading - HEADING_OFFSET_DEG,
    anchor: new mapsApi.maps.Point(256, 256),
  }
}
