import { Logger } from './Logger';
import { Platform } from "react-native";
import { isRunningInExpoGo, isWeb } from './constants';
import { UserDataQuery } from '../generated/graphql';

export async function setPurchaseUser(user: UserDataQuery['getUser']) {
  if (isRunningInExpoGo || isWeb) {
    return;
  }

  try {
    const Purchases: typeof import('react-native-purchases').default = require("react-native-purchases").default;
    await Purchases.logIn(user.id);
    await Purchases.setAttributes({
      full_name: `${user.first} ${user.last}`,
      email: user.email ?? "unknown",
      username: user.username,
    });
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
