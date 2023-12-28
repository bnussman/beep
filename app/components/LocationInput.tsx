import React, { useState } from "react";
import * as Location from "expo-location";
import { TouchableWithoutFeedback } from "react-native";
import { Input, InputProps, Spinner, Stack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";

function LocationInput(props: InputProps, ref: any) {
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

  const CurrentLocationIcon = (
    <TouchableWithoutFeedback onPress={() => useCurrentLocation()}>
      <Ionicons
        mr={3}
        size={24}
        name="ios-location-sharp"
      />
    </TouchableWithoutFeedback>
  );

  const SpinnerIcon = (
    <Stack mr={3}>
      <Spinner size="small" />
    </Stack>
  );

  return (
    <Input
      {...props}
      placeholder={isLoading ? "Loading" : undefined}
      InputRightElement={isLoading ? SpinnerIcon : CurrentLocationIcon}
      ref={ref}
    />
  );
}

export default React.forwardRef(LocationInput);
