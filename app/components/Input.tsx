import React from "react";
import { Theme, useTheme } from "@/utils/theme";
import { TextInput, TextInputProps, StyleSheet, useColorScheme } from "react-native";

export const Input = React.forwardRef<TextInput, TextInputProps>((props, ref) => {
    const colorScheme = useColorScheme();
    const theme = useTheme();
    const style = createStyles(theme);

    return (
      <TextInput
        ref={ref}
        selectionColor={colorScheme === "dark" ? "white" : "black"}
        {...props}
        style={[style.input, props.style]}
      />
    );
  },
);

const createStyles = (theme: Theme) => StyleSheet.create({
  input: {
    padding: 16,
    borderRadius: 12,
    borderColor: theme.components.input.borderColor,
    backgroundColor: theme.components.input.backgroundColor,
    borderWidth: 1.5,
    color: theme.text.primary,
  },
});