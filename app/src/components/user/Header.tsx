import { View } from "react-native";
import { Avatar } from "../Avatar";
import { Text } from "@/components/Text";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import SegmentedControl from "@expo/ui/community/segmented-control";

interface Props {
  userId: string;
  onTabChange: (index: number)  => void;
  index: number;
}

export function UserHeader(props: Props) {
  const { data: user } = useQuery(
    orpc.user.publicUser.queryOptions({ input: props.userId })
  );

  if (!user) {
    return null;
  }

  return (
    <>
      <View style={{ alignItems: "center", marginBottom: 12, gap: 8 }}>
        <Avatar
          src={user.photo ?? undefined}
          size="lg"
        />
        <Text
          size="2xl"
          weight="800"
          style={{ letterSpacing: 0.2, flexShrink: 1 }}
        >
          {user.first} {user.last}
        </Text>
      </View>
      <SegmentedControl
        values={['Details', 'Ratings']}
        selectedIndex={props.index}
        onChange={event => props.onTabChange(event.nativeEvent.selectedSegmentIndex)}
      />
    </>
  );
}