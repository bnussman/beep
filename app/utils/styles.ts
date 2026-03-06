import { StyleProp, ViewStyle } from "react-native";
import { isIOS } from "./constants";

export function getContentContainerStyle(shouldCenter: boolean): StyleProp<ViewStyle> {
  if (shouldCenter) {
    return {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...(isIOS && ({
        flex: undefined,
        height: '75%'
      }))
    };
  }

  return {
    paddingHorizontal: 16,
    gap: 8
  };
}