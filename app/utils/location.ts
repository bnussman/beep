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

    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);

    if (!hasStarted) {
      Sentry.captureMessage("User was unable to start location tracking");
    }
  } catch (error) {
    console.error("Unable to start location tracking", error)
    Sentry.captureException(error);
  }
}

export async function stopLocationTracking() {
  try {
    await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
  } catch (error) {
    console.error("Unable to stop location tracking", error)
    Sentry.captureException(error);
  }
}

export function useLocationPermissions() {
  const [foregroundPermission, requestForegroundPermission] = Location.useForegroundPermissions();
  const [backgroundPermission, requestBackgroundPermission] = Location.useBackgroundPermissions();

  const hasLocationPermission = foregroundPermission?.granted && backgroundPermission?.granted;

  const requestLocationPermission = async () => {
    try {
      const { granted: forgroundGranted } = await requestForegroundPermission();
      const { granted: backgroundGranted } = await requestBackgroundPermission();
      return forgroundGranted && backgroundGranted;
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
