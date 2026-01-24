import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import { Text } from "@/components/Text";
import { orpc, useUser } from "@/utils/orpc";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

export function RateLastBeeper() {
  const { data: user } = useUser();
  const navigation = useNavigation();
  const { data: beep } = useQuery(orpc.rider.getLastBeepToRate.queryOptions());

  if (!beep) {
    return null;
  }

  const otherUser = user?.id === beep?.rider_id ? beep.beeper : beep.rider;

  return (
    <Card
      pressable
      onPress={() =>
        navigation.navigate("Rate", {
          userId: otherUser.id,
          beepId: beep.id,
        })
      }
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <Text style={{ flexShrink: 1 }}>
        Rate Your Last Beep with <Text weight="800">{otherUser.first}</Text>
      </Text>
      <Avatar src={otherUser.photo ?? undefined} size="sm" />
    </Card>
  );
}
