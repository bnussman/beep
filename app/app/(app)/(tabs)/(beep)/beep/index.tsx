import React, { useEffect } from "react";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { Alert, View, Switch, ActivityIndicator} from "react-native";
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
import { isAndroid, isWeb } from "@/utils/constants";
import { useActivePayments } from "@/app/(app)/(tabs)/(profile)/profile/premium";
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
            <Link href="/(app)/(tabs)/beep/queue" asChild>
              <Link.Trigger>
                <Button>
                  <Text>
                    Queue {queue && queue.length > 1 ? `(${String(queue.length - 1)})` : ''}
                  </Text>
                </Button>
              </Link.Trigger>
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
            />
          </View>
        ),
      });
    }
  }, [navigation, user?.isBeeping, form.formState.isSubmitting, payments]);

  const toolbar = (
    <Stack.Toolbar placement="right">
      {user?.isBeeping && (
        <Stack.Toolbar.Button onPress={() => router.push('/(app)/(tabs)/beep/queue')}>
          <Stack.Toolbar.Label>Queue</Stack.Toolbar.Label>
          {queue && queue.length > 1 && <Stack.Toolbar.Badge>{String(queue.length - 1)}</Stack.Toolbar.Badge>}
        </Stack.Toolbar.Button>
      )}
      <Stack.Toolbar.View>
        <View
          style={{
            paddingHorizontal: 6,
            display: "flex",
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
          }}
        >
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
          />
        </View>
      </Stack.Toolbar.View>

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

  return (
    <KeyboardAwareScrollView
      scrollEnabled={false}
      contentContainerStyle={{ paddingHorizontal: 16, height: "100%", gap: 8 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      {toolbar}
      <Text size="sm" style={{ marginBottom: 24 }}>
        Use the toggle in the top right to start beeping
      </Text>
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
    </KeyboardAwareScrollView>
  );
}

