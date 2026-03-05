import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useUser } from '@/utils/useUser';
import { useQuery } from '@tanstack/react-query';
import { queryClient, useTRPC } from '@/utils/trpc';
import { useSubscription } from '@trpc/tanstack-react-query';

export default function Layout() {
  const trpc = useTRPC();
  const { user } = useUser();

  const { data: queue } = useQuery(
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

  return (
   <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="ride">
        <NativeTabs.Trigger.Label>Ride</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="car.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="beep">
        <NativeTabs.Trigger.Label>Beep</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="steeringwheel" />
        {user?.isBeeping && <NativeTabs.Trigger.Badge>{queue?.length ? String(queue.length) : ''}</NativeTabs.Trigger.Badge>}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.fill" />
        {/* <NativeTabs.Trigger.Icon src={{ uri: user?.photo ?? undefined, width: 24, height: 24,  }} /> */}
      </NativeTabs.Trigger>
      {/* <NativeTabs.Trigger name="queue" unstable_nativeProps={{}} role="search" hidden={!user?.isBeeping}>
        <NativeTabs.Trigger.Label>Queue</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: "list.bullet", selected: 'list.bullet' }} />
      </NativeTabs.Trigger> */}
    </NativeTabs>
  );
}