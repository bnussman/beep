import React, { useState } from "react";
import * as Location from "expo-location";
import { TouchableWithoutFeedback } from "react-native";
import { Input, InputProps, Spinner, Stack, XStack, Button } from "tamagui";
import { MapPin } from "@tamagui/lucide-icons";

interface Props extends InputProps {
  inputRef: any;
}

export function LocationInput({ inputRef, ...props }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  async function useCurrentLocation(): Promise<void> {
    setIsLoading(true);
    props.onChangeText?.("");

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      props.onChangeText?.("");
      setIsLoading(false);
      return alert("You must enable location to use this feature.");
    }

    const position = await Location.getCurrentPositionAsync();
    const location = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    let string;

    if (!location?.[0]?.name) {
      string = position.coords.latitude + ", " + position.coords.longitude;
    } else {
      string =
        location[0].name +
        " " +
        location[0].street +
        " " +
        location[0].city +
        ", " +
        location[0].region +
        " " +
        location[0].postalCode;
    }

    props.onChangeText?.(string);
    setIsLoading(false);
  }

  return (
    <XStack space="$2">
      <Input
        {...props}
        placeholder={isLoading ? "Loading" : undefined}
        ref={inputRef}
        flexGrow={1}
      />
      <Button
        onPress={() => useCurrentLocation()}
        icon={isLoading ? <Spinner size="small" /> : <MapPin />}
      />
    </XStack>
  );
}
