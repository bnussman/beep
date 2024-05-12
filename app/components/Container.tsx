import React from "react";
import { ScrollViewProps, ViewProps, View } from "react-native";

interface Props extends ViewProps {
  keyboard?: boolean;
  center?: boolean;
  scrollViewProps?: ScrollViewProps;
}

export const Container = (props: Props) => {
  return <View {...props} />;
};
