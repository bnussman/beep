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

    const { granted } = await Location.getForegroundPermissionsAsync();

    if (!granted) {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setIsLoading(false);
        return alert("You must enable location to use this feature.");
      }
    }

    try {
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
