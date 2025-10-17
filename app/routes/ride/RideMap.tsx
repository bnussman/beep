import { AnimatedMarker } from "@/components/AnimatedMarker";
import { Map } from "@/components/Map";
import { Marker } from "@/components/Marker";
import { Polyline } from "@/components/Polyline";
import { decodePolyline, useLocation } from "@/utils/location";
import { useTRPC } from "@/utils/trpc";
import { skipToken, useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";
import { useEffect, useRef } from "react";
import MapView from "react-native-maps";

export function RideMap() {
  const trpc = useTRPC();

  const mapRef = useRef<MapView>(null);

  const { location } = useLocation();

  const { data: beep } = useQuery(trpc.rider.currentRide.queryOptions());

  const isAcceptedBeep =
    beep?.status === "accepted" ||
    beep?.status === "in_progress" ||
    beep?.status === "here" ||
    beep?.status === "on_the_way";

  const { data: beepersLocation } = useSubscription(
    trpc.rider.beeperLocationUpdates.subscriptionOptions(
      beep ? beep.beeper.id : skipToken,
      {
        enabled: isAcceptedBeep,
      },
    ),
  );

  const { data: route } = useQuery(
    trpc.location.getRoute.queryOptions(
      beep
        ? {
            origin: beep.origin,
            destination: beep.destination,
          }
        : skipToken,
    ),
  );

  const polylineCoordinates = route?.routes[0].legs
    .flatMap((leg) => leg.steps)
    .map((step) => decodePolyline(step.geometry))
    .flat();

  const origin = route && {
    latitude: route.waypoints[0].location[1],
    longitude: route.waypoints[0].location[0],
  };

  const destination = route && {
    latitude: route.waypoints[1].location[1],
    longitude: route.waypoints[1].location[0],
  };

  useEffect(() => {
    if (
      beep?.status === "accepted" ||
      beep?.status === "on_the_way" ||
      beep?.status === "here"
    ) {
      const locations = [beepersLocation, location?.coords].filter(
        (i) => i !== undefined,
      );

      mapRef.current?.fitToCoordinates(locations, {
        animated: true,
        edgePadding: { bottom: 200, left: 100, right: 100, top: 100 },
      });
    } else {
      const locations = [
        beepersLocation,
        location?.coords,
        origin,
        destination,
      ].filter((i) => i !== undefined);

      mapRef.current?.fitToCoordinates(locations, {
        animated: true,
        edgePadding: { bottom: 200, left: 100, right: 100, top: 100 },
      });
    }
  }, [beepersLocation, location, origin, destination, beep]);

  return (
    <Map style={{ flex: 1 }} ref={mapRef} showsMyLocationButton>
      {beepersLocation && <AnimatedMarker {...beepersLocation} />}
      {origin && (
        <Marker
          coordinate={origin}
          title="Pick Up"
          description={beep?.origin}
        />
      )}
      {destination && (
        <Marker
          coordinate={destination}
          title="Drop off"
          description={beep?.destination}
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
  );
}
