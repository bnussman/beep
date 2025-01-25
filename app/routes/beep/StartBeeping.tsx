import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import * as SplashScreen from "expo-splash-screen";
import { Logger } from "../../utils/logger";
import { useUser } from "../../utils/useUser";
import { isAndroid } from "../../utils/constants";
import { Beep } from "./Beep";
import { useNavigation } from "@react-navigation/native";
import { Alert, View, Switch } from "react-native";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { Queue } from "./Queue";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { basicTrpcClient, trpc } from "@/utils/trpc";
import { PremiumBanner } from "./PremiumBanner";
import { getBeepingLocationPermissions, LOCATION_TRACKING, startLocationTracking, stopLocationTracking } from "@/utils/location";

export function StartBeepingScreen() {
  const { user } = useUser();

  const navigation = useNavigation();
  const utils = trpc.useUtils();

  const [isBeeping, setIsBeeping] = useState(user?.isBeeping);
  const [singlesRate, setSinglesRate] = useState<string>(String(user?.singlesRate));
  const [groupRate, setGroupRate] = useState<string>(String(user?.groupRate));
  const [capacity, setCapacity] = useState<string>(String(user?.capacity));

  const [foregroundPermission, requestForegroundPermission] = Location.useForegroundPermissions();
  const [backgroundPermission, requestBackgroundPermission] = Location.useBackgroundPermissions();

  const hasLocationPermission = foregroundPermission?.granted && backgroundPermission?.granted;

  const {
    data: queue,
    refetch,
    isRefetching,
  } = trpc.beeper.queue.useQuery(undefined, {
    enabled: user && user.isBeeping
  });

  trpc.beeper.watchQueue.useSubscription(undefined, {
    onData(data) {
      utils.beeper.queue.setData(undefined, data);
    },
    enabled: user && user.isBeeping,
  })

  const { mutate: updateBeepSettings } = trpc.user.edit.useMutation({
    onSuccess(data) {
      utils.user.me.setData(undefined, data);
    },
    onError(error, variables) {
      alert(error.message)
      setIsBeeping(!variables.isBeeping);
    }
  });

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
            onPress: () => handleIsBeepingChange(value)
          },
        ],
        { cancelable: true },
      );
    } else {
      handleIsBeepingChange(value);
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Switch
          value={isBeeping}
          onValueChange={onToggleIsBeeping}
          className="mr-2"
        />
      ),
    });
  }, [navigation, isBeeping, capacity, singlesRate, groupRate]);

  const handleIsBeepingChange = async (value: boolean) => {
    setIsBeeping(value);

    let location: { latitude: number, longitude: number } | undefined = undefined;

    if (value) {
      const hasLoactionPermission = await getBeepingLocationPermissions();

      if (!hasLoactionPermission) {
        setIsBeeping(!value);
        alert("You must allow background location to start beeping!");
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
        latitude: lastKnowLocation.coords.latitude
      };
    }

    updateBeepSettings({
      isBeeping: value,
      singlesRate: Number(singlesRate),
      groupRate: Number(groupRate),
      capacity: Number(capacity),
      location
    });
  }

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (isBeeping && hasLocationPermission) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
  }, [user?.isBeeping, hasLocationPermission]);

  if (isBeeping && !hasLocationPermission) {
    return (
      <View className="flex items-center justify-center h-full">
        <Text size="2xl" weight="black">
          No Location Permission
        </Text>
        <Text className="text-center mb-8">
          You are beeping, but you have not granted this app permission to use your location in the background.
          Please enable full time background location for the app in your settings.
        </Text>
      </View>
    );
  }

  if (isBeeping && queue?.length === 0) {
    return (
      <View className="flex items-center justify-center h-full">
        <Text size="2xl" weight="black">
          Your queue is empty
        </Text>
        <Text className="text-center mb-8">
          If someone wants you to beep them, it will appear here. If your app is
          closed, you will receive a push notification.
        </Text>
        <PremiumBanner />
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
          placeholder="Max Capacity"
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
        refreshing={isRefetching}
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
