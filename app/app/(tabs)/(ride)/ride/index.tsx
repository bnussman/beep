import React, { useEffect } from "react";
import { useTRPC } from "@/utils/trpc";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { RideDetails } from "@/components/RideDetails";
import { BottomSheet } from "@/components/BottomSheet";
import { View } from "react-native";
import { RideMap } from "@/components/RideMap";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Input, TextField, FieldError } from "heroui-native";
import { LocationInput } from "@/components/LocationInput";
import { Button } from "@/components/Button";
import { BeepersMap } from "@/components/BeepersMap";
import { RideMenu } from "@/components/RideToolbar";
import { Label } from "@/components/Label";
import {
  Link,
  SplashScreen,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { RateLastBeeper } from "@/components/RateLastBeeper";

export default function MainFindBeepScreen() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: beep } = useQuery(trpc.rider.currentRide.queryOptions());

  const isAcceptedBeep =
    beep?.status === "accepted" ||
    beep?.status === "in_progress" ||
    beep?.status === "here" ||
    beep?.status === "on_the_way";

  useSubscription(
    trpc.rider.currentRideUpdates.subscriptionOptions(undefined, {
      onData(data) {
        if (data === null) {
          queryClient.invalidateQueries(
            trpc.rider.getLastBeepToRate.pathFilter(),
          );
        }
        queryClient.setQueryData(trpc.rider.currentRide.queryKey(), data);
      },
      enabled: Boolean(beep),
    }),
  );

  const { data: beepersLocation } = useSubscription(
    trpc.rider.beeperLocationUpdates.subscriptionOptions(
      beep ? beep.beeper.id : skipToken,
      {
        enabled: isAcceptedBeep,
      },
    ),
  );

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const router = useRouter();
  const params = useLocalSearchParams<{
    groupSize?: string;
    origin?: string;
    destination?: string;
  }>();

  const { control, handleSubmit, setFocus, formState } = useForm({
    values: {
      groupSize: params.groupSize ? String(params.groupSize) : "",
      origin: params.origin ?? "",
      destination: params.destination ?? "",
    },
  });

  const findBeep = handleSubmit((values) => {
    router.navigate({ pathname: "/ride/pick", params: values });
  });

  if (!beep) {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        contentInsetAdjustmentBehavior="automatic"
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
                onSubmitEditing={() => setFocus("origin")}
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
            <TextField isInvalid={Boolean(fieldState.error)}>
              <Label htmlFor="origin">Pick Up Location</Label>
              <LocationInput
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
          )}
        />
        <Controller
          name="destination"
          rules={{ required: "Destination location is required" }}
          control={control}
          render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
            <TextField isInvalid={Boolean(fieldState.error)}>
              <Label htmlFor="destination">Destination Location</Label>
              <Input
                id="destination"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                ref={ref}
                returnKeyType="go"
                onSubmitEditing={() => findBeep()}
                textContentType="fullStreetAddress"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </TextField>
          )}
        />
        <Button onPress={() => findBeep()}>Find Beep</Button>
        <Link asChild href="/ride/map">
          <Link.Trigger withAppleZoom>
            <BeepersMap />
          </Link.Trigger>
          <Link.Preview />
        </Link>
        <RateLastBeeper />
      </KeyboardAwareScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <RideMenu />
      <RideMap beepersLocation={beepersLocation} />
      <BottomSheet enableDynamicSizing snapPoints={["30%", "50%"]}>
        <BottomSheetView>
          <RideDetails beepersLocation={beepersLocation} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
