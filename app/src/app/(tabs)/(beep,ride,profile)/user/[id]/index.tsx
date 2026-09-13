import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { Text } from "@/components/Text";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Avatar } from "@/components/Avatar";
import { orpc } from "@/utils/orpc";
import { useState } from "react";
import { UserDetails } from "@/components/user/Details";
import SegmentedControl from '@expo/ui/community/segmented-control';
import UserRatings from "@/components/user/Ratings";

export default function User() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    data: user,
    isPending: userPending,
    error: userError,
  } = useQuery(orpc.user.publicUser.queryOptions({ input: id }));

  if (userPending) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (userError) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Text size="xl" weight="800">
          Error
        </Text>
        <Text>{userError.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={{ paddingHorizontal: 16, gap: 8, display: "flex" }}>
        <View style={{ alignItems: "center", marginBlock: 16 }}>
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
          values={['Details', 'Beeps', 'Ratings']}
          selectedIndex={selectedIndex}
          onChange={event => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
        {selectedIndex === 0 && <UserDetails userId={id} />}  
        {selectedIndex === 2 && <UserRatings userId={id} />}  
      </View>
    </SafeAreaView>
  );
}
