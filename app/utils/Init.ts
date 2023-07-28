import * as SplashScreen from "expo-splash-screen";
import { handleUpdateCheck } from "./Updates";

export function init(): void {
  // handleUpdateCheck();
  SplashScreen.preventAutoHideAsync();
}
