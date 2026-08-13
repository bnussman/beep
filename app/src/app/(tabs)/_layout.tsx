import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useUser } from "@/utils/useUser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { useSubscription } from "@/utils/subscriptions";

export default function Layout() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const enabled = user && user.isBeeping;

  const { data: queue } = useQuery(
    orpc.beeper.queue.queryOptions({ enabled })
  );

  useSubscription({
    ...orpc.beeper.watchQueue.liveOptions({
      enabled,
      context: { ws: true },
    }),
    onData(data) {
      queryClient.setQueryData(orpc.beeper.queue.queryKey(), data);
    }
  });

  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(ride)">
        <NativeTabs.Trigger.Label>Ride</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="car.fill" md="directions_car" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(beep)">
        <NativeTabs.Trigger.Label>Beep</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="steeringwheel" md="local_taxi" />
        <NativeTabs.Trigger.Badge hidden={!user?.isBeeping}>
          {queue?.length ? String(queue.length) : ""}
        </NativeTabs.Trigger.Badge>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
        {!user?.isEmailVerified && <NativeTabs.Trigger.Badge />}
        {/* <NativeTabs.Trigger.Icon src={{ uri: user?.photo ?? undefined, width: 24, height: 24,  }} /> */}
      </NativeTabs.Trigger>
      {/* <NativeTabs.Trigger name="queue" unstable_nativeProps={{}} role="search" hidden={!user?.isBeeping}>
        <NativeTabs.Trigger.Label>Queue</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "list.bullet", selected: 'list.bullet' }} />
      </NativeTabs.Trigger> */}
    </NativeTabs>
  );
}
