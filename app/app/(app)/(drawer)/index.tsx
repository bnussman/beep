import React, { useEffect } from "react";
import { useTRPC } from "@/utils/trpc";
import { skipToken, useMutation, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { RideDetails } from "../../../components/RideDetails";
import { BottomSheet } from "@/components/BottomSheet";
import { Switch, View } from "react-native";
import { RideMap } from "../../../components/RideMap";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { SplashScreen, useLocalSearchParams, useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { LocationInput } from "@/components/LocationInput";
import { Button } from "@/components/Button";
import { BeepersMap } from "@/components/BeepersMap";
import { RateLastBeeper } from "@/components/RateLastBeeper";
import { useLocation } from "@/utils/location";

export default function MainFindBeepScreen() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { getLocation } = useLocation(false);

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
      beep?.beeper ? beep.beeper.id : skipToken,
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

  const {
    control,
    handleSubmit,
    setFocus,
    watch,
    formState: { errors },
  } = useForm({
    values: {
      groupSize: params.groupSize ? String(params.groupSize) : "",
      origin: params.origin ?? "",
      destination: params.destination ?? "",
      chooseBeeper: true,
    },
  });

  const { mutate: startBeep, isPending } = useMutation(
    trpc.rider.startBeep.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(trpc.rider.currentRide.queryKey(), data);
      },
      onError(error) {
        alert(error.message);
      },
    }),
  );

  const chooseBeeper = watch('chooseBeeper');

  const findBeep = handleSubmit(async ({ chooseBeeper, ...values }) => {
    if (chooseBeeper) {
      router.navigate({ pathname: '/ride/pick', params: values });
    } else {
      const location = await getLocation();

      startBeep({
        ...values,
        groupSize: Number(values.groupSize),
        ...location.coords,
      });
    }
  });

  if (!beep) {
    return (
      <KeyboardAwareScrollView
        scrollEnabled={false}
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <View style={{ gap: 4 }}>
          <Label htmlFor="groupSize">Group Size</Label>
          <Controller
            name="groupSize"
            rules={{
              required: "Group size is required",
              min: { value: 1, message: "Too small" },
              max: { value: 100, message: "Too large" },
              pattern: { value: /\d+/, message: "Must be a number" },
            }}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                id="groupSize"
                inputMode="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                ref={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("origin")}
              />
            )}
          />
          <Text color="error">{errors.groupSize?.message}</Text>
          <Text color="error">{errors.groupSize?.root?.message}</Text>
        </View>
        <View style={{ gap: 4 }}>
          <Label htmlFor="origin">Pick Up Location</Label>
          <Controller
            name="origin"
            rules={{ required: "Pick up location is required" }}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <LocationInput
                id="origin"
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
                inputRef={ref}
                returnKeyLabel="next"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("destination")}
              />
            )}
          />
          <Text color="error">{errors.origin?.message}</Text>
        </View>
        <View style={{ gap: 4 }}>
          <Label htmlFor="destination">Destination Location</Label>
          <Controller
            name="destination"
            rules={{ required: "Destination location is required" }}
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                id="destination"
                onBlur={onBlur}
                onChangeText={(val) => onChange(val)}
                value={value}
                ref={ref}
                returnKeyType="go"
                onSubmitEditing={() => findBeep()}
                textContentType="fullStreetAddress"
              />
            )}
          />
          <Text color="error">{errors.destination?.message}</Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
          <Text>Choose a beeper</Text>
          <Controller
            name="chooseBeeper"
            control={control}
            render={({ field }) => (
              <Switch value={chooseBeeper} onValueChange={field.onChange} />
            )}
          />
        </View>
        <Button onPress={() => findBeep()} isLoading={isPending}>Find Beep</Button>
        <BeepersMap />
        <RateLastBeeper />
      </KeyboardAwareScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <RideMap beepersLocation={beepersLocation} />
      <BottomSheet enableDynamicSizing snapPoints={["30%", "50%"]}>
        <BottomSheetView>
          <RideDetails beepersLocation={beepersLocation} />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
