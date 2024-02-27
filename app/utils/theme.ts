import { StorageManager, ColorMode } from "native-base";
import { Appearance } from "react-native";

export const colorModeManager: StorageManager = {
  get: async () => {
    return Appearance.getColorScheme() ?? "light";
  },
  set: async (value: ColorMode) => {
    // do nothing
  },
};
