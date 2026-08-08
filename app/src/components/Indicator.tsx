import { colorMap } from "@/utils/cars";
import { View } from "react-native";

export type Color = keyof typeof colorMap;

interface Props {
  /**
   * Color of the indicator
   */
  color: Color;
  /**
   * Size in px
   * @default 16
   */
  size?: number;
}

export function Indicator(props: Props) {
  const { size = 16, color } = props;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colorMap[color]
      }}
    />
  );
}
