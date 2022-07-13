import React from "react";
import {
  BottomSheetProps,
  default as _BottomSheet,
} from "@gorhom/bottom-sheet";
import { useColorMode } from "native-base";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

export const BottomSheet = React.forwardRef<
  BottomSheetMethods,
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
