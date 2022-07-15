import { LinearGradient } from "expo-linear-gradient";
import { extendTheme } from "native-base";
import { Platform } from "react-native";

export const isMobile: boolean =
  Platform.OS == "ios" || Platform.OS == "android";

export const isAndroid: boolean = Platform.OS == "android";

export const isIOS: boolean = Platform.OS == "ios";

export type Unpacked<T> = T extends (infer U)[] ? U : T;

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
  components: {
    Input: {
      baseStyle: {
        borderRadius: '10px',
      },
    },
    FormControlLabel: {
      baseStyle: {
        _text: {
          fontWeight: 'extrabold',
        },
      },
      defaultProps: {
        _text: {
          _dark: {
            color: 'white',
          },
          _light: {
            color: 'black',
          },
        },
      },
    },
  },
  config: {
    useSystemColorMode: true,
    initialColorMode: "dark",
  },
});