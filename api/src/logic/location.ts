import type { OSRM } from "../utils/osrm";
import { Photon } from "../utils/photon";
import { user } from "../../drizzle/schema";

export async function getRoute(start: string, end: string) {
  const result = await fetch(
    `https://osrm.ridebeep.app/route/v1/driving/${start};${end}`,
  );

  const data: OSRM["/route/{version}/{profile}/{coordinates}"]["get"]["responses"]["200"]["content"]["application/json"] =
    await result.json();

  return data;
}

export async function getCoordinatesFromAddress(
  address: string,
  bias: (typeof user.$inferSelect)["location"],
) {
  const queryParams = new URLSearchParams({
    q: address,
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
