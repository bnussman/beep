import React from "react";
import {
  BottomSheetProps,
  default as _BottomSheet,
} from "@gorhom/bottom-sheet";
import { BottomSheetModalRef } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types";
import { useColorMode } from "native-base";

export const BottomSheet = React.forwardRef<
  BottomSheetModalRef,
  BottomSheetProps
>((props, ref) => {
  const { colorMode } = useColorMode();

  return (
    <_BottomSheet
      ref={ref}
      {...props}
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.89,
        shadowRadius: 8.3,
        elevation: 13,
      }}
      backgroundStyle={{
        backgroundColor: colorMode === "light" ? "white" : "#121212",
      }}
      handleIndicatorStyle={{
        backgroundColor: colorMode === "light" ? "#454545" : "#c9c9c9",
      }}
    >
      {props.children}
    </_BottomSheet>
  );
});
