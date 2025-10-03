import React, { useEffect } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as SplashScreen from "expo-splash-screen";
import { useUser } from "../../utils/useUser";
import { isAndroid, isWeb } from "../../utils/constants";
import { Beep } from "./Beep";
import { useNavigation } from "@react-navigation/native";
import { Alert, View, Switch, ActivityIndicator } from "react-native";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { Queue } from "./Queue";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { basicTrpcClient, useTRPC } from "@/utils/trpc";
import { PremiumBanner } from "./PremiumBanner";
import {
  LOCATION_TRACKING,
  startLocationTracking,
  stopLocationTracking,
  useLocationPermissions,
} from "@/utils/location";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { captureException } from "@sentry/react-native";

export function StartBeepingScreen() {
  const trpc = useTRPC();
  const { user } = useUser();

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const form = useForm({
    values: {
      capacity: user?.capacity,
      singlesRate: user?.singlesRate,
      groupRate: user?.groupRate,
    },
  });

  const { requestLocationPermission } = useLocationPermissions();

  const {
    data: queue,
    refetch,
    isRefetching,
  } = useQuery(
    trpc.beeper.queue.queryOptions(undefined, {
      enabled: user && user.isBeeping,
    }),
  );

  useSubscription(
    trpc.beeper.watchQueue.subscriptionOptions(undefined, {
      onData(data) {
        queryClient.setQueryData(trpc.beeper.queue.queryKey(), data);
      },
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            marginRight: 8,
            display: "flex",
            flexDirection: "row",
            gap: 8,
          }}
        >
          {form.formState.isSubmitting && <ActivityIndicator size="small" />}
          <Switch
            disabled={form.formState.isSubmitting}
            value={user?.isBeeping ?? false}
            onValueChange={onToggleIsBeeping}
          />
        </View>
      ),
    });
  }, [navigation, user?.isBeeping, form.formState.isSubmitting]);

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
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (user?.isBeeping) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
  }, [user?.isBeeping]);

  // if (user?.isBeeping && !hasLocationPermission && !isWeb) {
  //   return (
  //     <View
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100%",
  //       }}
  //     >
  //       <Text size="2xl" weight="800">
  //         No Location Permission
  //       </Text>
  //       <Text style={{ textAlign: "center" }}>
  //         You are beeping, but you have not granted this app permission to use
  //         your location in the background. Please enable full time background
  //         location for the app in your settings.
  //       </Text>
  //     </View>
  //   );
  // }

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
        <Text size="2xl" weight="800">
          Your queue is empty
        </Text>
        <Text
          style={{
            textAlign: "center",
            paddingLeft: 8,
            paddingRight: 8,
            marginBottom: 16,
          }}
        >
          If a rider wants a ride, it will appear here. If your app is closed,
          you will receive a push notification.
        </Text>
        <PremiumBanner />
      </View>
    );
  }

  if (!user?.isBeeping || !queue) {
    return (
      <KeyboardAwareScrollView
        scrollEnabled={false}
        contentContainerStyle={{ padding: 16, height: "100%", gap: 8 }}
      >
        <View style={{ gap: 4 }}>
          <Label htmlFor="capacity">Max Rider Capacity</Label>
          <Controller
            control={form.control}
            name="capacity"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="capacity"
                  placeholder="Max Capacity"
                  inputMode="numeric"
                  value={String(field.value)}
                  onChangeText={(value) => field.onChange(Number(value))}
                />
                <Text color="subtle" size="sm">
                  Maximum number of riders you can safely fit in your car
                </Text>
                <Text size="sm" color="error">
                  {fieldState.error?.message}
                </Text>
              </>
            )}
          />
        </View>

        <View style={{ gap: 4 }}>
          <Label htmlFor="singles">Singles Rate</Label>
          <Controller
            control={form.control}
            name="singlesRate"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="singles"
                  placeholder="Singles Rate"
                  keyboardType="numeric"
                  value={String(field.value)}
                  onChangeText={(value) => field.onChange(Number(value))}
                />
                <Text color="subtle" size="sm">
                  Price for a single person riding alone
                </Text>
                <Text size="sm" color="error">
                  {fieldState.error?.message}
                </Text>
              </>
            )}
          />
        </View>

        <View style={{ gap: 4 }}>
          <Label htmlFor="groups">Group Rate</Label>
          <Controller
            control={form.control}
            name="groupRate"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="groups"
                  placeholder="Group Rate"
                  keyboardType="numeric"
                  value={String(field.value)}
                  onChangeText={(value) => field.onChange(Number(value))}
                />
                <Text color="subtle" size="sm">
                  Price per person in a group
                </Text>
                <Text size="sm" color="error">
                  {fieldState.error?.message}
                </Text>
              </>
            )}
          />
        </View>
        <View style={{ flexGrow: 1 }} />
        <Text size="sm" style={{ textAlign: "center", marginBottom: 18 }}>
          Use the toggle in the top right to start beeping
        </Text>
      </KeyboardAwareScrollView>
    );
  }

  return (
    <View
      style={{
        display: "flex",
        height: "100%",
        padding: 12,
      }}
    >
      {queue[0] && <Beep beep={queue[0]} />}
      <Queue
        beeps={queue.filter((beep) => beep.id !== queue[0]?.id)}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </View>
  );
}

TaskManager.defineTask<{ locations: Location.LocationObject[] }>(
  LOCATION_TRACKING,
  async ({ data, error }) => {
    if (error) {
      console.error(error);
      captureException(error);
      return;
    }

    if (data) {
      try {
        await basicTrpcClient.user.edit.mutate({
          location: data.locations[0].coords,
        });
      } catch (e) {
        captureException(e);
        console.error(
          "Background task errored when sending location to the API",
          e,
        );
      }
    }
  },
);
