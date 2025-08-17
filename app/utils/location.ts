import { useEffect, useState } from "react";
import * as Location from "expo-location";
import * as Sentry from "@sentry/react-native";

export function useLocation(enabled = true) {
  const [location, setLocation] = useState<Location.LocationObject>();

  const getHasPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    return status === "granted";
  };

  const updateLocation = async () => {
    const hasPermission = await getHasPermission();

    if (!hasPermission) {
      return;
    }

    let location = await Location.getLastKnownPositionAsync({
      maxAge: 180000,
      requiredAccuracy: 800,
    });

    if (!location) {
      location = await Location.getCurrentPositionAsync();
    }

    setLocation(location);
  };

  const getLocation = async () => {
    const hasPermission = await getHasPermission();

    if (!hasPermission) {
      throw new Error("Permission for location not granted.");
    }

    let location = await Location.getLastKnownPositionAsync({
      maxAge: 180000,
      requiredAccuracy: 800,
    });

    if (!location) {
      location = await Location.getCurrentPositionAsync();
    }

    return location;
  };

  useEffect(() => {
    if (enabled) {
      updateLocation();
    }
  }, [enabled]);

  return { location, updateLocation, getLocation, getHasPermission };
}

export const LOCATION_TRACKING = "location-tracking";

export async function startLocationTracking() {
  try {
    const hasStarted =
      await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);

    if (hasStarted) {
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 15 * 1000,
      distanceInterval: 6,
      activityType: Location.LocationActivityType.AutomotiveNavigation,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Ride Beep App",
        notificationBody: "You are currently beeping!",
        notificationColor: "#e8c848",
      },
    });
  } catch (error) {
    console.error("Unable to start location tracking", error);
    Sentry.captureException(error);
  }
}

export async function stopLocationTracking() {
  try {
    const hasStarted =
      await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);

    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    }
  } catch (error) {
    console.error("Unable to stop location tracking", error);
    Sentry.captureException(error);
  }
}

export function useLocationPermissions() {
  const [foregroundPermission, requestForegroundPermission] =
    Location.useForegroundPermissions();
  const [backgroundPermission, requestBackgroundPermission] =
    Location.useBackgroundPermissions();

  const hasLocationPermission =
    foregroundPermission?.granted && backgroundPermission?.granted;

  const requestLocationPermission = async () => {
    try {
      await requestForegroundPermission();
      await requestBackgroundPermission();

      const { granted: foregroundGranted } =
        await Location.getForegroundPermissionsAsync();
      const { granted: backgroundGranted } =
        await Location.getBackgroundPermissionsAsync();

      return foregroundGranted && backgroundGranted;
    } catch (error) {
      console.error("Unable to get location permission", error);
      Sentry.captureException(error);
      return false;
    }
  };

  return {
    foregroundPermission,
    backgroundPermission,
    hasLocationPermission,
    requestForegroundPermission,
    requestBackgroundPermission,
    requestLocationPermission,
  };
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

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
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
