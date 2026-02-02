import { photon } from "@banksnussman/photon";
import { user } from "../../drizzle/schema";

export async function getCoordinatesFromAddress(
  address: string,
  bias: (typeof user.$inferSelect)["location"],
) {
  const { data, error } = await photon.GET("/api", {
    params: {
      query: {
        q: address,
        ...(bias && {
          // zoom: 10,
          // location_bias_scale: 0.5,
          lat: bias.latitude,
          lon: bias.longitude,
        }),
      },
    },
  });

  if (error || !data.features[0]) {
    return null;
  }

  const [longitude, latitude] = data.features[0].geometry.coordinates;

  return { latitude, longitude };
}

export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d * 0.621371;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
