import { RouterOutput } from "./trpc";

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 */
export function getMobileOperatingSystem() {
  const userAgent = navigator?.userAgent || navigator?.vendor;

  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return "iOS";
  }

  return "unknown";
}

export function getDownloadLink() {
  if (getMobileOperatingSystem() === "Android") {
    return "https://play.google.com/store/apps/details?id=app.ridebeep.App";
  }
  return "https://apps.apple.com/us/app/ride-beep-app/id1528601773";
}

export function getFormattedRating(rating: string | number) {
  return Number(rating).toLocaleString("en-US", {
    maximumFractionDigits: 3,
  });
}

/**
 * Full credit to https://github.com/huextrat/react-native-maps-routes/blob/main/src/utils/decoder.ts
 */
export const decodePolyline = (polyline: string) => {
  const points = [];
  const encoded = polyline;
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;
  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dLat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dLng;

    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
};

export function getMiles(meters: number, round = false) {
  const miles = meters * 0.000621;

  if (round) {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(miles);
  }

  return miles;
}

export const beepStatusMap: Record<
  RouterOutput["beep"]["beep"]["status"],
  string
> = {
  waiting: "orange",
  on_the_way: "orange",
  accepted: "green",
  in_progress: "green",
  here: "green",
  denied: "red",
  canceled: "red",
  complete: "green",
};
