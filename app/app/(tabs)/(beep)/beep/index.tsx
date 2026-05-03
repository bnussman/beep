import React, { useEffect } from "react";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { Alert, View, Switch, ActivityIndicator } from "react-native";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTRPC } from "@/utils/trpc";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getTimeRemainingString } from "@/components/CountDown";
import { isAndroid, isIOS, isWeb } from "@/utils/constants";
import { useUser } from "@/utils/useUser";
import { PremiumBanner } from "@/components/PremiumBanner";
import { Beep } from "@/components/beeper/Beep";
import { Link, SplashScreen, Stack, useRouter } from "expo-router";
import {
  startLocationTracking,
  stopLocationTracking,
  useLocationPermissions,
} from "@/utils/location";
import { Button } from "@/components/Button";
import { MoneyInput } from "@/components/MoneyInput";
import { CarSelect } from "@/components/CarSelect";
import { useActivePayments } from "../../(profile)/profile/premium";
import { Description, FieldError, TextField } from "heroui-native";

export default function StartBeepingScreen() {
  const trpc = useTRPC();
  const router = useRouter();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { user } = useUser();

  const form = useForm({
    values: {
      capacity: user?.capacity,
      singlesRate: user?.singlesRate,
      groupRate: user?.groupRate,
    },
  });

  const { requestLocationPermission } = useLocationPermissions();

  const { data: queue } = useQuery(
    trpc.beeper.queue.queryOptions(undefined, {
      enabled: user && user.isBeeping,
    }),
  );

  const { mutate: updateBeepSettings } = useMutation(
    trpc.user.edit.mutationOptions({
      onSuccess(data) {
        queryClient.setQueryData(trpc.user.me.queryKey(), data);
      },
      onError(error) {
        const fieldErrors = error.data?.fieldErrors;
        if (!fieldErrors) {
          alert(error.message);
        } else {
          for (const key in fieldErrors) {
            form.setError(key as any, { message: fieldErrors[key]?.[0] });
          }
        }
      },
    }),
  );

  const onToggleIsBeeping = (value: boolean) => {
    if (isAndroid && value) {
      Alert.alert(
        "Background Location Notice",
        "Ride Beep App collects location data to enable ETAs for riders when your are beeping and the app is closed or not in use",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => handleIsBeepingChange(),
          },
        ],
        { cancelable: true },
      );
    } else {
      handleIsBeepingChange();
    }
  };

  const { data: payments } = useActivePayments();

  const handleIsBeepingChange = form.handleSubmit(async (values) => {
    const willBeBeeping = !user?.isBeeping;

    let location: { latitude: number; longitude: number } | undefined =
      undefined;

    if (willBeBeeping) {
      const hasLoactionPermission = await requestLocationPermission();

      if (!hasLoactionPermission && !isWeb) {
        return;
      }

      let lastKnowLocation = await Location.getLastKnownPositionAsync({
        maxAge: 180000,
        requiredAccuracy: 800,
      });

      if (!lastKnowLocation) {
        lastKnowLocation = await Location.getCurrentPositionAsync();
      }

      location = {
        longitude: lastKnowLocation.coords.longitude,
        latitude: lastKnowLocation.coords.latitude,
      };
    }

    updateBeepSettings({
      isBeeping: willBeBeeping,
      ...values,
      location,
    });
  });

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (user?.isBeeping) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
  }, [user?.isBeeping]);

  React.useLayoutEffect(() => {
    if (isAndroid || isWeb) {
      navigation.setOptions({
        headerRight: () => (
          <View
            style={{
              marginRight: 8,
              display: "flex",
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Link href="/beep/queue" asChild>
              <Button>
                Queue{" "}
                {queue && queue.length > 1
                  ? `(${String(queue.length - 1)})`
                  : ""}
              </Button>
            </Link>
            {payments?.[0] && (
              <Text
                size="xl"
                onPress={() =>
                  Alert.alert(
                    "You are premium!",
                    `Your premium status will expire in ${getTimeRemainingString(new Date(payments[0].expires))}`,
                  )
                }
              >
                👑
              </Text>
            )}
            {form.formState.isSubmitting && <ActivityIndicator size="small" />}
            <Switch
              disabled={form.formState.isSubmitting}
              value={user?.isBeeping ?? false}
              onValueChange={onToggleIsBeeping}
              trackColor={{ true: "#3a82ef", false: "gray" }}
              thumbColor="white"
              // @ts-expect-error
              activeThumbColor="white"
            />
          </View>
        ),
      });
    }
  }, [navigation, user?.isBeeping, form.formState.isSubmitting, payments]);

  const toolbar = (
    <Stack.Toolbar placement="right">
      {payments?.[0] && (
        <Stack.Toolbar.Button
          onPress={() =>
            Alert.alert(
              "You are premium!",
              `Your premium status will expire in ${getTimeRemainingString(new Date(payments[0].expires))}`,
            )
          }
        >
          👑
        </Stack.Toolbar.Button>
      )}
      {user?.isBeeping && (
        <Stack.Toolbar.Button onPress={() => router.push("/beep/queue")}>
          <Stack.Toolbar.Label>Queue</Stack.Toolbar.Label>
          {queue && queue.length > 1 && (
            <Stack.Toolbar.Badge>
              {String(queue.length - 1)}
            </Stack.Toolbar.Badge>
          )}
        </Stack.Toolbar.Button>
      )}
      <Stack.Toolbar.Button
        onPress={handleIsBeepingChange}
        variant="prominent"
        disabled={form.formState.isSubmitting}
        tintColor={user?.isBeeping ? "red" : undefined}
        // icon={user?.isBeeping ? "stop.fill" : "play.fill"}
      >
        {user?.isBeeping ? "Stop" : "Start"} Beeping
      </Stack.Toolbar.Button>
    </Stack.Toolbar>
  );

  if (user?.isBeeping && queue?.[0]) {
    return (
      <>
        {toolbar}
        <Beep beep={queue[0]} />
      </>
    );
  }

  if (user?.isBeeping && queue?.length === 0) {
    return (
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 8,
        }}
      >
        {toolbar}
        <Text size="2xl" weight="800">
          Waiting for riders
        </Text>
        <Text
          style={{
            textAlign: "center",
            paddingLeft: 8,
            paddingRight: 8,
            marginBottom: 16,
            maxWidth: "90%",
          }}
        >
          If a rider wants a ride, it will appear here. If your app is closed,
          you will receive a push notification.
        </Text>
        {!payments || (payments?.length === 0 && <PremiumBanner />)}
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      scrollEnabled={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      {toolbar}
      <CarSelect />
      <Controller
        control={form.control}
        name="capacity"
        render={({ field, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="capacity">Max Rider Capacity</Label>
            <Input
              id="capacity"
              placeholder="Max Capacity"
              inputMode="numeric"
              ref={field.ref}
              value={String(field.value)}
              onChangeText={(value) => field.onChange(Number(value))}
              returnKeyLabel="next"
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus("singlesRate")}
            />
            <Description>
              Maximum number of riders you can safely fit in your car
            </Description>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        control={form.control}
        name="singlesRate"
        render={({ field, fieldState }) => (
          <TextField>
            <Label htmlFor="singles">Singles Rate</Label>
            <MoneyInput
              id="singles"
              placeholder="Singles Rate"
              keyboardType="numeric"
              ref={field.ref}
              value={String(field.value)}
              onChangeText={(value) => field.onChange(Number(value))}
              returnKeyLabel="next"
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus("groupRate")}
            />
            <Description>Price for a single person riding alone</Description>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      <Controller
        control={form.control}
        name="groupRate"
        render={({ field, fieldState }) => (
          <TextField isInvalid={!!fieldState.error}>
            <Label htmlFor="groups">Group Rate</Label>
            <MoneyInput
              id="groups"
              placeholder="Group Rate"
              keyboardType="numeric"
              ref={field.ref}
              value={String(field.value)}
              onChangeText={(value) => field.onChange(Number(value))}
              returnKeyLabel="Start Beeping"
              returnKeyType="go"
              onSubmitEditing={() => handleIsBeepingChange()}
            />
            <Description>Price per person in a group</Description>
            <FieldError>{fieldState.error?.message}</FieldError>
          </TextField>
        )}
      />
      {/* <Text size="sm" style={{ marginTop: 24, textAlign: 'center' }}>
        Use the toggle in the top right to start beeping
      </Text> */}
    </KeyboardAwareScrollView>
  );
}
