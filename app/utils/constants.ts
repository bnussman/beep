import { extendTheme } from "native-base";
import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from 'expo-constants'

export const isRunningInExpoGo = Constants.appOwnership === 'expo'

export const isMobile: boolean =
  Platform.OS == "ios" || Platform.OS == "android";

export const isSimulator = Device.isDevice === false;

export const isAndroid: boolean = Platform.OS === "android";

export const isIOS: boolean = Platform.OS === "ios";

export const isWeb: boolean = Platform.OS === "web";

export type Unpacked<T> = T extends (infer U)[] ? U : T;

export const PAGE_SIZE = 10;

export const BEEPER_ICON = "🚕";

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
      baseStyle: ({ colorMode }: { colorMode: "dark" | "light" }) => ({
        borderRadius: 8,
        backgroundColor: colorMode === "dark" ? "gray.800" : "coolGray.100",
        placeholderTextColor: "primary.200",
        fontWeight: "bold",
      }),
      defaultProps: {
        borderWidth: 0,
        p: 3,
        fontSize: "sm",
      },
    },
    InputLeftAddon: {
      baseStyle: ({ colorMode }: { colorMode: "dark" | "light" }) => ({
        backgroundColor: colorMode === "dark" ? "gray.800" : "coolGray.100",
        placeholderTextColor: "primary.200",
        fontWeight: "bold",
      }),
      defaultProps: {
        borderWidth: 0,
        pl: 4,
        fontSize: "sm",
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 10,
      },
    },
    IconButton: {
      baseStyle: {
        borderRadius: 10,
      },
    },
    FormControlLabel: {
      baseStyle: {
        _text: {
          fontWeight: "extrabold",
          letterSpacing: "sm",
        },
      },
      defaultProps: {
        _text: {
          _dark: {
            color: "white",
          },
          _light: {
            color: "black",
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
