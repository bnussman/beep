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
