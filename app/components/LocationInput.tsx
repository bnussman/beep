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
  };

  return (
    <View className="flex flex-row gap-2">
      <Input
        placeholder={isLoading ? "Loading" : undefined}
        ref={inputRef}
        className="flex-1 flex-grow"
        {...props}
      />
      <Button isLoading={isLoading} onPress={handleGetCurrentLocation}>
        <Text>📍</Text>
      </Button>
    </View>
  );
}
