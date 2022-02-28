import { Platform } from "react-native";

export const isMobile: boolean =
  Platform.OS == "ios" || Platform.OS == "android";

export const isAndroid: boolean = Platform.OS == "android";

export const isIOS: boolean = Platform.OS == "ios";

export type Unpacked<T> = T extends (infer U)[] ? U : T;
