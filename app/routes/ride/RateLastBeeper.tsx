import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { trpc } from "@/utils/trpc";
import { useUser } from "@/utils/useUser";
import { useNavigation } from "@react-navigation/native";

export function RateLastBeeper() {
  const { user } = useUser();
  const navigation = useNavigation();
  const { data: beep } = trpc.rider.getLastBeepToRate.useQuery();

  if (!beep) {
    return null;
  }

  const otherUser = user?.id === beep?.rider_id ? beep.beeper : beep.rider;

  return (
    <Card
      pressable
      onPress={() => navigation.navigate("Rate", {
        userId: otherUser.id,
        beepId: beep.id,
      })}
      variant="outlined"
      className="flex flex-row items-center justify-between px-4 py-2 mt-4 gap-4 ease-in ease-out duration-300"
    >
      <Text className="flex-shrink">
        Rate Your Last Beep with <Text weight="800">{otherUser.first}</Text>
      </Text>
      <Avatar src={otherUser.photo ?? undefined} size="sm" />
    </Card>
  )
}
