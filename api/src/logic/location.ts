import { geocoding } from "@banksnussman/photon";
import { user } from "../../drizzle/schema";
import { PHOTON_BASE_URL } from "../utils/constants";
import type { Location } from "../schemas/user";

export async function getCoordinatesFromAddress(
  address: string,
  bias: (typeof user.$inferSelect)["location"],
) {
  const { data, error } = await geocoding({
    baseUrl: PHOTON_BASE_URL,
    query: {
      q: address,
      ...(bias && {
        // zoom: 10,
        // location_bias_scale: 0.5,
        lat: bias.latitude,
        lon: bias.longitude,
      }),
    },
  });

  if (error || !data?.features[0]) {
    return null;
  }

  const [longitude, latitude] = data.features[0].geometry.coordinates;

  return { latitude, longitude };
}


function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getDistance(
  origin: Location,
  destination: Location,
): number {
  const R = 6371;
  const dLat = deg2rad(destination.latitude - origin.latitude);
  const dLon = deg2rad(destination.longitude - origin.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(origin.latitude)) *
      Math.cos(deg2rad(destination.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d * 0.621371;
}
