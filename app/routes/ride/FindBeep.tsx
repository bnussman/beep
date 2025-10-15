import React, { useEffect, useRef } from "react";
import MapView from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import * as SplashScreen from "expo-splash-screen";
import { Map } from "../../components/Map";
import { useColorScheme, View } from "react-native";
import { Avatar } from "@/components/Avatar";
import { Image } from "@/components/Image";
import { Text } from "@/components/Text";
import { AnimatedMarker } from "../../components/AnimatedMarker";
import { StaticScreenProps, useTheme } from "@react-navigation/native";
import { useTRPC } from "@/utils/trpc";
import { RideStatus } from "./RideStatus";
import { ETA } from "./ETA";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { StartBeepForm } from "./StartBeepForm";
import { decodePolyline, useLocation } from "@/utils/location";
import { Marker } from "@/components/Marker";
import { Polyline } from "@/components/Polyline";

type Props = StaticScreenProps<
  { origin?: string; destination?: string; groupSize?: string } | undefined
>;

export function MainFindBeepScreen(props: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme();
  const theme = useTheme();

  const mapRef = useRef<MapView>(null);

  const { data: beep } = useQuery(trpc.rider.currentRide.queryOptions());

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

  const isAcceptedBeep =
    beep?.status === "accepted" ||
    beep?.status === "in_progress" ||
    beep?.status === "here" ||
    beep?.status === "on_the_way";

  const { data: car } = useQuery(
    trpc.user.getUsersDefaultCar.queryOptions(
      beep ? beep.beeper.id : skipToken,
      { enabled: isAcceptedBeep },
    ),
  );

  const { data: beepersLocationRaw } = useSubscription(
    trpc.rider.beeperLocationUpdates.subscriptionOptions(
      beep ? beep.beeper.id : skipToken,
      {
        enabled: isAcceptedBeep,
      },
    ),
  );

  const beepersLocation = isAcceptedBeep ? beepersLocationRaw : null;

  const { data: beepRoute } = useQuery(
    trpc.location.getRoute.queryOptions(
      beep
        ? {
            origin: beep.origin,
            destination: beep.destination,
          }
        : skipToken,
    ),
  );

  const route = beepRoute?.routes[0];

  const polylineCoordinates = route?.legs
    .flatMap((leg) => leg.steps)
    .map((step) => decodePolyline(step.geometry))
    .flat();

  const origin = beepRoute && {
    latitude: beepRoute.waypoints[0].location[1],
    longitude: beepRoute.waypoints[0].location[0],
  };

  const destination = beepRoute && {
    latitude: beepRoute.waypoints[1].location[1],
    longitude: beepRoute.waypoints[1].location[0],
  };

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const { location } = useLocation();

  useEffect(() => {
    if (mapRef.current) {
      if (beepersLocation) {
        mapRef.current.fitToCoordinates(
          location ? [beepersLocation, location.coords] : [beepersLocation],
          {
            edgePadding: { bottom: 200, left: 100, right: 100, top: 20 },
          },
        );
      }

      if (!beepersLocation && origin && destination) {
        mapRef.current.fitToCoordinates(
          location
            ? [origin, destination, location.coords]
            : [origin, destination],
          {
            edgePadding: { bottom: 200, left: 100, right: 100, top: 20 },
          },
        );
      }
    }
  }, [beepersLocation, origin, destination]);

  if (!beep) {
    return <StartBeepForm {...props.route.params} />;
  }

  return (
    <View style={{ height: "100%" }}>
      <Map showsUserLocation style={{ flexGrow: 1 }} ref={mapRef}>
        {beepersLocation && (
          <AnimatedMarker
            latitude={beepersLocation.latitude}
            longitude={beepersLocation.longitude}
          />
        )}
        {origin && (
          <Marker
            coordinate={origin}
            title="Pick Up"
            description={beep.origin}
            identifier="origin"
          />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            title="Drop Off"
            description={beep.destination}
            identifier="destination"
          />
        )}
        {polylineCoordinates && (
          <Polyline
            coordinates={polylineCoordinates ?? []}
            strokeWidth={5}
            strokeColor="#3d8ae3"
            lineCap="round"
          />
        )}
      </Map>
      <BottomSheet
        enableDynamicSizing={false}
        snapPoints={[200, "50%", "100%"]}
        backgroundStyle={
          colorScheme === "dark" ? { backgroundColor: theme.colors.card } : {}
        }
        handleIndicatorStyle={
          colorScheme === "dark" ? { backgroundColor: "white" } : {}
        }
      >
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flexShrink: 1 }}>
              <Text weight="800">Beeper</Text>
              <Text>
                {beep.beeper.first} {beep.beeper.last}
              </Text>
            </View>
            <Avatar size="sm" src={beep.beeper.photo ?? undefined} />
          </View>
          <View>
            <Text weight="800">Current Status</Text>
            <Text>
              <RideStatus beep={beep} car={car} />
            </Text>
          </View>
          {beep.status === "on_the_way" && (
            <ETA beeperLocation={beepersLocation} />
          )}
          <View>
            <Text weight="800">Pick Up</Text>
            <Text selectable>{beep.origin}</Text>
          </View>
          <View>
            <Text weight="800">Destination</Text>
            <Text selectable>{beep.destination}</Text>
          </View>
          <View>
            <Text>
              <Text weight="800">Rates</Text>{" "}
              <Text color="subtle">(per person)</Text>
            </Text>
            <Text>
              <Text>${beep.beeper.singlesRate} for singles</Text> /{" "}
              <Text>${beep.beeper.groupRate} for groups</Text>
            </Text>
          </View>
          {car && (
            <View>
              <Text weight="800">Car</Text>
              <View style={{ gap: 4 }}>
                <Text>
                  {car.make} {car.model} {car.year} ({car.color})
                </Text>
                <Image
                  style={{
                    flexGrow: 1,
                    borderRadius: 12,
                    width: "100%",
                    minHeight: 200,
                  }}
                  resizeMode="cover"
                  src={car.photo}
                  alt={`car-${car.id}`}
                />
              </View>
            </View>
          )}
        </View>
      </BottomSheet>
    </View>
  );
}
