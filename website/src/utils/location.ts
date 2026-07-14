import maplibregl from "maplibre-gl";

export interface Location {
  latitude: number;
  longitude: number;
}

export function getBoundsFromLocations(locations: (Location | null | undefined)[]) {
  const bounds = new maplibregl.LngLatBounds();

  for (const location of locations) {
    if (location) {
      bounds.extend({ lng: location.longitude, lat: location.latitude });
    }
  }

  return bounds;
}
