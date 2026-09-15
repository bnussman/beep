import { Pressable, View } from "react-native";
import { Text } from "@/components/Text";
import { Card } from "../Card";
import { Avatar } from "../Avatar";
import { printStars } from "../Stars";
import { RouterOutputs } from "../../../../api/src";
import { Link } from "expo-router";

interface Props {
  rating: RouterOutputs['rating']['rating'];
}

export function UserRating({ rating }: Props) {
  return (
    <Link href={{ pathname: "/user/[id]", params: { id: rating.rater.id } }} asChild>
      <Card style={{ padding: 16, gap: 16, display: "flex" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              flex: 1,
            }}
          >
            <Avatar size="xs" src={rating.rater.photo ?? undefined} />
            <View style={{ flexShrink: 1 }}>
              <Text weight="bold">
                {rating.rater.first} {rating.rater.last}
              </Text>
              <Text color="subtle" size="xs">
                {rating.timestamp.toLocaleString(undefined, {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </Text>
            </View>
          </View>
          <Text>{printStars(rating.stars)}</Text>
        </View>
        {rating.message && <Text>{rating.message}</Text>}
      </Card>
    </Link>
  );
}
