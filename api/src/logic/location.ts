import { Photon } from "../utils/photon";
import { user } from "../../drizzle/schema";

export async function getCoordinatesFromAddress(
  address: string,
  bias: (typeof user.$inferSelect)["location"],
) {
  const queryParams = new URLSearchParams({
    q: address,
    zoom: "10",
  });

  if (bias) {
    queryParams.set("lat", bias.latitude.toString());
    queryParams.set("lon", bias.longitude.toString());
  }

  const result = await fetch(
    `https://photon.nussman.us/api?${queryParams.toString()}`,
  );

  const data: Photon["/api"]["get"]["responses"]["200"]["content"]["application/json"] =
    await result.json();

  if (!data.features[0]) {
    return null;
  }

  const [longitude, latitude] = data.features[0].geometry.coordinates;

  return { latitude, longitude };
}
