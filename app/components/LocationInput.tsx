import React, { useState } from "react";
import * as Location from "expo-location";
import { XStack, Text, InputProps, Input, Spinner, Button } from "@beep/ui";

interface Props extends InputProps {
  inputRef: any;
}

export function LocationInput({ inputRef, ...props }: Props) {
  const [isLoading, setIsLoading] = useState(false);

   const handleGetCurrentLocation = async () => {
    setIsLoading(true);
    // props.onChangeText?.("");

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
    <XStack gap="$2">
      <Input
        placeholder={isLoading ? "Loading" : undefined}
        ref={inputRef}
        flexGrow={1}
        flex={1}
        {...props}
      />
      <Button
        icon={isLoading ? <Spinner /> : <Text>📍</Text>}
        onPress={handleGetCurrentLocation}
      />
    </XStack>
  );
}
