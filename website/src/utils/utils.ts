/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
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

export function getInitialTheme(): string {
  const storedPrefs = window.localStorage.getItem("theme");

  if (storedPrefs) {
    const root = window.document.documentElement;

    root.classList.remove(storedPrefs === "dark" ? "light" : "dark")
    root.classList.add(storedPrefs)

    return storedPrefs;
  }

  return "light";
}