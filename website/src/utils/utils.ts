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
