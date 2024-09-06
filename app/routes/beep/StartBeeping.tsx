import React, { useEffect, useMemo, useState } from "react";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as SplashScreen from "expo-splash-screen";
import { Logger } from "../../utils/logger";
import { useUser } from "../../utils/useUser";
import { isAndroid } from "../../utils/constants";
import { LocationActivityType } from "expo-location";
import { Beep } from "./Beep";
import { useNavigation } from "@react-navigation/native";
import { Alert, AppState, AppStateStatus, View, Switch } from "react-native";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { Queue } from "./Queue";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { basicTrpcClient, trpc } from "@/utils/trpc";
import { TRPCClientError } from "@trpc/client";

export const LOCATION_TRACKING = "location-tracking";

export function StartBeepingScreen() {
  const { user } = useUser();
  const navigation = useNavigation();

  const [isBeeping, setIsBeeping] = useState(user?.isBeeping);
  const [singlesRate, setSinglesRate] = useState<string>(
    String(user?.singlesRate),
  );
  const [groupRate, setGroupRate] = useState<string>(String(user?.groupRate));
  const [capacity, setCapacity] = useState<string>(String(user?.capacity));

  const utils = trpc.useUtils();

  const { data: queue, refetch, isLoading } = trpc.beeper.queue.useQuery(undefined, {
    enabled: user && user.isBeeping
  });

  trpc.beeper.watchQueue.useSubscription(undefined, {
    onData(data) {
      utils.beeper.queue.setData(undefined, data);
    },
    enabled: user && user.isBeeping,
  })

  const [position, setPosition] = useState(0);

  const { mutateAsync: updateBeepSettings } = trpc.user.edit.useMutation({
    onSuccess(data) {
      utils.user.me.setData(undefined, data);
    }
  });

  const snapPoints = useMemo(() => [100, 85, 15], []);

  useEffect(() => {
    const listener = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      listener.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      refetch();
    }
  };

  function toggleSwitchWrapper(): void {
    if (isAndroid && !isBeeping) {
      Alert.alert(
        "Background Location Notice",
        "Ride Beep App collects location data to enable ETAs for riders when your are beeping and the app is closed or not in use",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "OK", onPress: () => toggleSwitch() },
        ],
        { cancelable: true },
      );
    } else {
      toggleSwitch();
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Switch
          value={isBeeping}
          onValueChange={() => toggleSwitchWrapper()}
          className="mr-2"
        />
      ),
    });
  }, [navigation, isBeeping, capacity, singlesRate, groupRate]);

  async function getBeepingLocationPermissions(): Promise<boolean> {
    try {
      //Temporary fix for being able to toggle beeping in dev
      if (__DEV__ || Constants.appOwnership === "expo") return true;

      const { status: fgStatus } =
        await Location.requestForegroundPermissionsAsync();
      const { status: bgStatus } =
        await Location.requestBackgroundPermissionsAsync();

      if (fgStatus !== "granted" || bgStatus !== "granted") {
        return false;
      }

      return true;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }

  async function toggleSwitch(): Promise<void> {
    const willBeBeeping = !isBeeping;

    setIsBeeping((value) => !value);

    const hasLoactionPermission = await getBeepingLocationPermissions();

    if (willBeBeeping && !hasLoactionPermission) {
      setIsBeeping((value) => !value);
      alert("You must allow background location to start beeping!");
      return;
    }

    let location: { latitude: number, longitude: number } | undefined = undefined;

    if (willBeBeeping) {
      let lastKnowLocation = await Location.getLastKnownPositionAsync({
        maxAge: 180000,
        requiredAccuracy: 800,
      });

      if (!lastKnowLocation) {
        lastKnowLocation = await Location.getCurrentPositionAsync();
      }

      location = {
        longitude: lastKnowLocation.coords.longitude,
        latitude: lastKnowLocation.coords.latitude
      };

    }

    updateBeepSettings({
        isBeeping: willBeBeeping,
        singlesRate: Number(singlesRate),
        groupRate: Number(groupRate),
        capacity: Number(capacity),
        location
    })
      .then(() => {
        if (willBeBeeping) {
          startLocationTracking();
        } else {
          stopLocationTracking();
        }
      })
      .catch((error: TRPCClientError<any>) => {
        setIsBeeping((value) => !value);
        alert(error.message);
      });
  }

  async function startLocationTracking(): Promise<void> {
    if (!__DEV__) {
      await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 15 * 1000,
        distanceInterval: 6,
        activityType: LocationActivityType.AutomotiveNavigation,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Ride Beep App",
          notificationBody: "You are currently beeping!",
          notificationColor: "#e8c848",
        },
      });

      const hasStarted =
        await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);

      if (!hasStarted)
        Logger.error("User was unable to start location tracking");
    }
  }

  async function stopLocationTracking(): Promise<void> {
    if (!__DEV__) {
      Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
    }
  }

  useEffect(() => {
    const init = async () => {
      if (user?.isBeeping) {
        if (!(await getBeepingLocationPermissions())) {
          alert("You must allow background location to start beeping!");
          return;
        }
        startLocationTracking();
      }
    };

    init();
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const handleIsBeepingChange = async () => {
      if (user.isBeeping && !isBeeping) {
        if (!(await getBeepingLocationPermissions())) {
          alert("You must allow background location to start beeping!");
          return;
        }
        startLocationTracking();
        setIsBeeping(true);
      }
      if (!user.isBeeping && isBeeping) {
        stopLocationTracking();
        setIsBeeping(false);
      }
    };

    handleIsBeepingChange();
  }, [user]);

  const isRefreshing = Boolean(queue) && isLoading;

  if (isBeeping && queue?.length === 0) {
    return (
      <View className="flex items-center justify-center h-full">
        <Text size="2xl" weight="black">
          Your queue is empty
        </Text>
        <Text className="text-center mb-8">
          If someone wants you to beep them, it will appear here. If your app is
          closed, you will recieve a push notification.
        </Text>
        <Card variant="outlined" className="p-4 items-center">
          <Text weight="black" size="xl">
            Want more riders?
          </Text>
          <Text className="text-center mb-4">
            Jump to the top of the beeper list
          </Text>
          <Button
            className="flex flex-row gap-2 dark:!bg-neutral-700 active:dark:!bg-neutral-800"
            onPress={() => navigation.navigate("Main", { screen: "Premium" })}
          >
            <Text weight="bold">Get Promoted</Text>
            <Text>👑</Text>
          </Button>
        </Card>
      </View>
    );
  }

  if (!isBeeping || !queue) {
    return (
      <KeyboardAwareScrollView
        scrollEnabled={false}
        contentContainerClassName="p-4 h-full"
      >
        <Label htmlFor="capacity">Max Rider Capacity</Label>
        <Input
          id="capacity"
          placeholder="Max Capcity"
          inputMode="numeric"
          value={String(capacity)}
          onChangeText={(value) => setCapacity(value)}
        />
        <Text size="sm">
          Maximum number of riders you can safely fit in your car
        </Text>
        <Label htmlFor="singles">Singles Rate</Label>
        <Input
          id="singles"
          placeholder="Singles Rate"
          keyboardType="numeric"
          value={String(singlesRate)}
          onChangeText={(value) => setSinglesRate(value)}
        />
        <Text size="sm">Price for a single person riding alone</Text>
        <Label htmlFor="groups">Group Rate</Label>
        <Input
          id="groups"
          placeholder="Group Rate"
          keyboardType="numeric"
          value={String(groupRate)}
          onChangeText={(value) => setGroupRate(value)}
        />
        <Text size="sm">Price per person in a group</Text>
        <View className="flex-grow" />
        <Text size="sm" className="mb-10 text-center">
          Use the toggle in the top right to start beeping
        </Text>
      </KeyboardAwareScrollView>
    );
  }

  return (
    <View className="flex h-full p-4 pb-16">
      {queue[0] && <Beep beep={queue[0]} />}
      <Queue
        beeps={queue.filter(beep => beep.id !== queue[0]?.id)}
        onRefresh={refetch}
        refreshing={isRefreshing}
      />
    </View>
  );
}

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    return Logger.error(error);
  }

  if (data) {
    // @ts-expect-error dumb
    const { locations } = data;
    try {
      await basicTrpcClient.user.edit.mutate({
        location: locations[0].coords
      });
    } catch (e) {
      Logger.error(e);
    }
  }
});
