import { useEffect } from "react";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { RideDetails } from "@/components/RideDetails";
import { BottomSheet } from "@/components/BottomSheet";
import { Pressable, View } from "react-native";
import { RideMap } from "@/components/RideMap";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Controller, useFormContext } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Input, TextField, FieldError } from "heroui-native";
import { LocationInput } from "@/components/LocationInput";
import { Button } from "@/components/Button";
import { BeepersMap } from "@/components/BeepersMap";
import { RideToolbar } from "@/components/RideToolbar";
import { Label } from "@/components/Label";
import { Link, SplashScreen, useRouter } from "expo-router";
import { endRiderLiveActivities } from "@/live-activities/utils";
import { paddedContainerStyle } from "@/utils/styles";
import { isIOS } from "@/utils/constants";
import { orpc } from "@/utils/orpc";
import { useSubscription } from "@/utils/subscriptions";

export default function MainFindBeepScreen() {
  const queryClient = useQueryClient();

  const { data: beep } = useQuery(orpc.rider.currentRide.queryOptions());

  const isAcceptedBeep =
    beep?.status === "accepted" ||
    beep?.status === "in_progress" ||
    beep?.status === "here" ||
    beep?.status === "on_the_way";

  useSubscription({
    ...orpc.rider.currentRideUpdates.liveOptions({
      enabled: Boolean(beep),
      context: { ws: true }
    }),
    onData(data) {
      if (data === null) {
        queryClient.invalidateQueries(
          orpc.rider.getLastBeepToRate.queryOptions(),
        );
      }
      queryClient.setQueryData(orpc.rider.currentRide.queryKey(), (prev) => {
        if (data === null) {
          return null;
        }
        if (!prev) {
          return data as typeof beep;
        }
        return { ...prev, ...data };
      });
    }
  })

  const { data: beepersLocation } = useSubscription(
    orpc.rider.beeperLocationUpdates.liveOptions({
      input: beep ? beep.beeper.id : skipToken,
      enabled: isAcceptedBeep,
      context: { ws: true }
    })
  );

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (beep === null) {
      endRiderLiveActivities();
    }
  }, [beep]);

  const router = useRouter();

  const { control, handleSubmit, setFocus } = useFormContext();

  const findBeep = handleSubmit((values) => {
    router.navigate({ pathname: "/ride/pick", params: values });
  });

  if (!beep) {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12, ...paddedContainerStyle }}
        contentInsetAdjustmentBehavior="automatic"
        scrollEnabled={false}
        mode="layout"
      >
        <Controller
          name="groupSize"
          rules={{
            required: "Group size is required",
            min: { value: 1, message: "Too small" },
            max: { value: 100, message: "Too large" },
            pattern: { value: /\d+/, message: "Must be a number" },
          }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
            <TextField isInvalid={Boolean(fieldState.error)}>
              <Label htmlFor="groupSize">Group Size</Label>
              <Input
                id="groupSize"
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                onSubmitEditing={() =>
                  router.navigate({
                    pathname: "/ride/pick-location",
                    params: { type: "origin" },
                  })
                }
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <Controller
          name="origin"
          rules={{ required: "Pick up location is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
            <Link
              href={{
                pathname: "/ride/pick-location",
                params: { type: "origin" },
              }}
              asChild
            >
              <Pressable>
                <TextField isInvalid={Boolean(fieldState.error)}>
                  <Label pointerEvents="none" htmlFor="origin">
                    Pick Up Location
                  </Label>
                  <LocationInput
                    readOnly
                    pointerEvents="none"
                    id="origin"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    ref={ref}
                    returnKeyLabel="next"
                    returnKeyType="next"
                    onSubmitEditing={() => setFocus("destination")}
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              </Pressable>
            </Link>
          )}
        />
        <Controller
          name="destination"
          rules={{ required: "Destination location is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
            <Link
              href={{
                pathname: "/ride/pick-location",
                params: { type: "destination" },
              }}
              asChild
            >
              <Pressable>
                <TextField
                  pointerEvents="none"
                  isInvalid={Boolean(fieldState.error)}
                >
                  <Label htmlFor="destination">Destination Location</Label>
                  <Input
                    id="destination"
                    onBlur={onBlur}
                    readOnly
                    pointerEvents="none"
                    onChangeText={onChange}
                    value={value}
                    ref={ref}
                    returnKeyType="go"
                    onSubmitEditing={() => findBeep()}
                    textContentType="fullStreetAddress"
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              </Pressable>
            </Link>
          )}
        />
        <Button onPress={() => findBeep()}>Find Beep</Button>
        <Link asChild href="/ride/map">
          <Link.Trigger withAppleZoom>
            <BeepersMap />
          </Link.Trigger>
          <Link.Preview />
        </Link>
        {/*<RateLastBeeper />*/}
      </KeyboardAwareScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isIOS && <RideToolbar />}
      <RideMap beepersLocation={beepersLocation} />
      <BottomSheet enableDynamicSizing snapPoints={["30%", "50%"]}>
        <BottomSheetView>
          <RideDetails beepersLocation={beepersLocation} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
