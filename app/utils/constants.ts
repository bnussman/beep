import { LinearGradient } from "expo-linear-gradient";
import { extendTheme } from "native-base";

export const NATIVE_BASE_CONFIG = {
  dependencies: {
    "linear-gradient": LinearGradient,
  },
};

export const NATIVE_BASE_THEME = extendTheme({
  colors: {
    primary: {
      100: "#F1F3F7",
      200: "#E4E8EF",
      300: "#C1C6CF",
      400: "#9397A0",
      500: "#575A62",
      600: "#3F4454",
      700: "#2B3146",
      800: "#1B2138",
      900: "#10152F",
    },
  },
  config: {
    useSystemColorMode: true,
    initialColorMode: "dark",
  },
});