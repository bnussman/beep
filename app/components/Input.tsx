import React from "react";
import { Theme, useTheme } from "@/utils/theme";
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Input as HeroInput } from "heroui-native";

export const Input = React.forwardRef<TextInput, TextInputProps>(
  (props, ref) => {
    return <HeroInput ref={ref} {...props} />;
  },
);
