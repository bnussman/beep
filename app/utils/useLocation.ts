import { useEffect, useState } from "react";
import * as Location from "expo-location";

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
