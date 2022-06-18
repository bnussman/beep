import React, { Ref, useState } from "react";
import * as Location from "expo-location";
import Constants from "expo-constants";
import { Logger } from "../utils/Logger";
import { TouchableWithoutFeedback } from "react-native";
import { Box, Icon, IInputProps, Input, Spinner } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

function LocationInput(props: IInputProps, ref: Ref<unknown>) {
  const [isLoading, setIsLoading] = useState(false);

  async function useCurrentLocation(): Promise<void> {
    setIsLoading(true);
    props.onChangeText?.("");

    try {
      Location.setGoogleApiKey(
        JSON.parse(Constants.manifest?.extra?.GOOGLE_API_KEYS)[0] || ""
      );
    } catch (error) {
      Logger.error(error);
    }

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      props.onChangeText?.("");
      setIsLoading(false);
      return alert("You must enable location to use this feature.");
    }

    const position = await Location.getCurrentPositionAsync({});
    const location = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });

    let string;

    if (!location[0].name) {
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
      <Icon
        mr={3}
        size="lg"
        name="my-location"
        as={MaterialIcons}
        _dark={{ color: "white" }}
      />
    </TouchableWithoutFeedback>
  );

  const SpinnerIcon = (
    <Box mr={3}>
      <Spinner size="sm" />
    </Box>
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
