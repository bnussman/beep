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
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 8,
      }}
    >
      <Text style={{ flexShrink: 1 }}>
        Rate Your Last Beep with <Text weight="800">{otherUser.first}</Text>
      </Text>
      <Avatar src={otherUser.photo ?? undefined} size="sm" />
    </Card>
  )
}
