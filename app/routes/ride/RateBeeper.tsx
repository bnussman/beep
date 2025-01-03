import BottomSheet, { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Text } from '@/components/Text';
import { useColorScheme } from "react-native";

export function RateBeeper() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const colorScheme = useColorScheme();

  bottomSheetRef.current?.expand()

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["50%"]}
      detached
      enablePanDownToClose
      bottomInset={42}
      style={{ margin: 8, paddingHorizontal: 12 }}
      keyboardBehavior="fillParent"
      containerStyle={{ padding: 8 }}
      backgroundStyle={colorScheme === "dark" ? { backgroundColor: "#1c1c1c" } : {}}
      handleIndicatorStyle={colorScheme === "dark" ? { backgroundColor: "white" } : {}}
    >
      <BottomSheetView>
        <Text weight="black" onPress={() => bottomSheetRef.current?.expand()}>
          Rate your last beeper
        </Text>
        <BottomSheetTextInput />
      </BottomSheetView>
    </BottomSheet>
  );
}
