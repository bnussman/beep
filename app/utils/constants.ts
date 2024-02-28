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
