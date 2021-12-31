import React from "react";
import { StatusBar } from "native-base";
import { isIOS } from "./config";

export type barStyles = "light-content" | "dark-content";

interface Props {
  theme: string;
}

export default function ThemedStatusBar(props: Props) {
  const barStyle: barStyles = ((props.theme === "light" ? "dark" : "light") +
    "-content") as barStyles;

  const barColor: string = props.theme === "dark" ? "#000000" : "#ffffff";

  return <StatusBar backgroundColor="#fff" barStyle="dark-content" />;

  if (isIOS) return <StatusBar barStyle={barStyle} />;

  return (
    <StatusBar translucent barStyle={barStyle} backgroundColor={barColor} />
  );
}
