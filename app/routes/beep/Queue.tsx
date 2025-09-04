import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Text } from "@/components/Text";
import { QueueItem } from "./QueueItem";
import { Pressable, useColorScheme } from "react-native";
import { View } from "react-native";
import { useRef } from "react";
import { isWeb } from "@/utils/constants";
import { RouterOutput } from "@/utils/trpc";

interface Props {
  beeps: RouterOutput["beeper"]["queue"];
  onRefresh: () => void;
  refreshing: boolean;
}

export function Queue(props: Props) {
  const { beeps, onRefresh, refreshing } = props;
  const colorScheme = useColorScheme();

  const ref = useRef<BottomSheet>(null);
  const drawerPositionIndex = useRef<number>(0);

  const hasUnacceptedBeep = beeps.some((beep) => beep.status === "waiting");

  return (
    <BottomSheet
      ref={ref}
      onChange={(index) => {
        drawerPositionIndex.current = index;
      }}
      enableDynamicSizing={false}
      snapPoints={["10%", "50%", isWeb ? "90%" : "100%"]}
      backgroundStyle={
        colorScheme === "dark" ? { backgroundColor: "#1c1c1c" } : {}
      }
      handleIndicatorStyle={
        colorScheme === "dark" ? { backgroundColor: "white" } : {}
      }
    >
      <Pressable
        style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onPress={() => {
          if (drawerPositionIndex.current > 0) {
            ref.current?.snapToIndex(0);
            drawerPositionIndex.current = 0;
          } else {
            ref.current?.snapToIndex(2);
            drawerPositionIndex.current = 2;
          }
        }}
      >
        <Text size="3xl" weight="800">
          Queue
        </Text>
        {hasUnacceptedBeep && (
          <View
            style={{
              borderRadius: 16 / 2,
              backgroundColor: "#1f75ed",
              width: 16,
              height: 16,
            }}
          />
        )}
      </Pressable>
      <BottomSheetFlatList
        data={beeps}
        keyExtractor={(beep) => beep.id}
        renderItem={({ item, index }) => (
          <QueueItem item={item} index={index} />
        )}
        onRefresh={onRefresh}
        refreshing={refreshing}
        contentContainerStyle={{ gap: 4, paddingHorizontal: 8 }}
        ListEmptyComponent={
          <Text>If more riders join your queue, they will show here!</Text>
        }
      />
    </BottomSheet>
  );
}
