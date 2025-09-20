import React, { useState } from "react";
import * as Location from "expo-location";
import { Input } from "@/components/Input";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { TextInputProps, View } from "react-native";

interface Props extends TextInputProps {
  inputRef: any;
}

export function LocationInput({ inputRef, ...props }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    try {
      // Get the current permissions status so we can skip requesting permission if we already have it.
      // On Andriod, if we request permission when we already have it, `requestForegroundPermissionsAsync` will hang,
      // so that's why we check this first.
      const permission = await Location.getForegroundPermissionsAsync();
      let hasLocationPermission = permission.granted;

      if (!hasLocationPermission) {
        // If we don't have location permission, request it...
        const permission = await Location.requestForegroundPermissionsAsync();
        hasLocationPermission = permission.granted;
      }

      if (!hasLocationPermission) {
        setIsLoading(false);
        return alert("You must allow beep to access your location.");
      }

      const position = await Location.getCurrentPositionAsync();
      const locations = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (locations.length === 0) {
        props.onChangeText?.(
          `${position.coords.latitude}, ${position.coords.longitude}`,
        );
      } else {
        const location = locations[0];
        const parts = Array.from(
          new Set(
            [
              location.name,
              `${location.streetNumber} ${location.street}`,
              `${location.city}, ${location.region}`,
              location.postalCode,
            ].filter(Boolean),
          ),
        );

        props.onChangeText?.(parts.join(" "));
      }
    } catch (error) {
      alert("Unable to get your location");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <Input
        placeholder={isLoading ? "Loading" : undefined}
        ref={inputRef}
        style={{ flex: 1, flexGrow: 1 }}
        textContentType="fullStreetAddress"
        {...props}
      />
      <Button isLoading={isLoading} onPress={handleGetCurrentLocation}>
        📍
      </Button>
    </View>
  );
}
