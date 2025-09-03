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
