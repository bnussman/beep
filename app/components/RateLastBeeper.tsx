import { useTRPC } from "@/utils/trpc";
import { useUser } from "@/utils/useUser";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Alert, PressableFeedback } from "heroui-native";

export function RateLastBeeper() {
  const trpc = useTRPC();

  const { user } = useUser();
  const { data: beep } = useQuery(trpc.rider.getLastBeepToRate.queryOptions());

  if (!beep) {
    return null;
  }

  const otherUser = user?.id === beep?.rider_id ? beep.beeper : beep.rider;

  return (
    <Link
      href={{
        pathname: "/user/[id]/rate",
        params: { id: otherUser.id, beepId: beep.id },
      }}
      asChild
    >
      <PressableFeedback>
        <Alert status="default">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              Rate {otherUser.first} {otherUser.last}
            </Alert.Title>
            <Alert.Description>
              You recently had a beep with {otherUser.first}. Tap here to rate
              them!
            </Alert.Description>
          </Alert.Content>
        </Alert>
      </PressableFeedback>
    </Link>
  );
}
