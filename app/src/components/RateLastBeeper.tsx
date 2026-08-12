import { orpc } from "@/utils/orpc";
import { useUser } from "@/utils/useUser";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert, PressableFeedback } from "heroui-native";

export function RateLastBeeper() {
  const router = useRouter();

  const { user } = useUser();
  const { data: beep } = useQuery(orpc.rider.getLastBeepToRate.queryOptions());

  if (!beep) {
    return null;
  }

  const otherUser = user?.id === beep?.rider_id ? beep.beeper : beep.rider;

  return (
    <PressableFeedback
      className="w-full overflow-auto"
      onPress={() =>
        router.navigate({
          pathname: "/user/[id]/rate",
          params: { id: otherUser.id, beepId: beep.id },
        })
      }
    >
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
  );
}
