import GorhomBottomSheet, { BottomSheetProps } from "@gorhom/bottom-sheet";
import { useTheme } from "expo-router/react-navigation";
import { Ref } from "react";

interface Props extends BottomSheetProps {
  ref?: Ref<GorhomBottomSheet>;
}

export function BottomSheet(props: Props) {
  const theme = useTheme();

  return (
    <GorhomBottomSheet
      backgroundStyle={{ backgroundColor: theme.colors.card }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.text }}
      enableDynamicSizing={false}
      {...props}
    />
  );
}
