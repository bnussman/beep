import { BottomSheet as ExpoBottomSheet } from "@expo/ui";
import type { BottomSheetProps as ExpoBottomSheetProps } from "@expo/ui";
import { useIsFocused } from "expo-router";
import { useTheme } from "expo-router/react-navigation";
import { ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { sheetModifiers } from "./BottomSheet.modifiers";

interface Props {
  children: ReactNode;
  snapPoints?: ExpoBottomSheetProps["snapPoints"];
  /** Label of the button shown to re-open the sheet after it was dismissed */
  label?: string;
}

/**
 * A persistent-style bottom sheet over a screen (typically a map).
 *
 * It is only presented while its screen is focused so a native sheet never
 * sits on top of other tabs, and it can be re-opened after being dismissed.
 */
export function BottomSheet({ children, snapPoints, label = "Details" }: Props) {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <ExpoBottomSheet
        isPresented={isOpen && isFocused}
        onDismiss={() => {
          if (isFocused) setIsOpen(false);
        }}
        snapPoints={snapPoints}
        containerColor={theme.colors.card}
        modifiers={sheetModifiers}
      >
        {children}
      </ExpoBottomSheet>
      {!isOpen && (
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            bottom: 24,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => setIsOpen(true)}
            style={{
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              borderWidth: 1,
              borderRadius: 999,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text style={{ color: theme.colors.text, fontWeight: "600" }}>
              {label}
            </Text>
          </Pressable>
        </View>
      )}
    </>
  );
}
