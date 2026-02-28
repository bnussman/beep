import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Text } from "@/components/Text";
import { QueueItem } from "./QueueItem";
import { FlatList, Pressable } from "react-native";
import { View } from "react-native";
import { useRef } from "react";
import { isWeb } from "@/utils/constants";
import { RouterOutput } from "@/utils/trpc";
import { BottomSheet } from "@/components/BottomSheet";
import BottomSheetRef from "@gorhom/bottom-sheet";

interface Props {
  beeps: RouterOutput["beeper"]["queue"];
  onRefresh: () => void;
  refreshing: boolean;
}

export function Queue(props: Props) {
  const { beeps, onRefresh, refreshing } = props;

  return (
    <FlatList
      data={beeps}
      keyExtractor={(beep) => beep.id}
      renderItem={({ item, index }) => (
        <QueueItem item={item} index={index} />
      )}
      onRefresh={onRefresh}
      refreshing={refreshing}
      contentContainerStyle={{ gap: 4, paddingHorizontal: 8 }}
      ListEmptyComponent={
        <View
          style={{
            padding: 16,
            gap: 4,
            alignItems: "center",
          }}
        >
          <Text size="5xl">⏳</Text>
          <Text weight="800" size="lg">
            Your queue is empty!
          </Text>
          <Text style={{ textAlign: "center", maxWidth: "80%" }}>
            If additional riders join your queue, they will show up here!
          </Text>
        </View>
      }
    />
  );
}
