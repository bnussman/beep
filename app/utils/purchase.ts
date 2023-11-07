import { Logger } from './Logger';
import { Platform } from "react-native";
import { isRunningInExpoGo, isWeb } from './constants';

export async function setPurchaseUser(id: string) {
  if (isRunningInExpoGo || isWeb) {
    return;
  }

  try {
    const Purchases: typeof import('react-native-purchases').default = require("react-native-purchases").default;
    await Purchases.logIn(id);
  } catch (error) {
    Logger.error(error);
  }
}

export async function setupPurchase() {
  if (isRunningInExpoGo || isWeb) {
    return;
  }

  try {
    const Purchases: typeof import('react-native-purchases').default = require("react-native-purchases").default;
    alert(Purchases.configure)
    const { LOG_LEVEL } = await import("react-native-purchases");

    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: "appl_dqtIBTnfwElgSEMkBpwmpjMrgNj" });
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: "goog_LdhRLvXtGjDlpznOgEIWWUdsokX" });
    }
  } catch (error) {
    Logger.error(error);
  }
}
