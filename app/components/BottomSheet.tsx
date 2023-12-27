import React from "react";
import {
  BottomSheetProps,
  default as _BottomSheet,
} from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useColorMode } from 'native-base'

export const BottomSheet = React.forwardRef<
  BottomSheetMethods,
  BottomSheetProps & { shadow?: 'normal' | 'light' }
>((props, ref) => {
  const { colorMode } = useColorMode();

  const { shadow = 'normal', ...rest } = props;

  const style = {
    normal: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.89,
      shadowRadius: 8.3,
      elevation: 13,
    },
    light: {
      shadowColor: colorMode === 'light' ? "#d6d6d6" : '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.89,
      shadowRadius: 6.3,
    },
  };

  return (
    <_BottomSheet
      ref={ref}
      {...rest}
      style={style[shadow]}
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
