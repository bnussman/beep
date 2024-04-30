import { Logger } from "./logger";
import { Platform } from "react-native";
import { isRunningInExpoGo, isWeb } from "./constants";
import type { User } from "./useUser";

export async function setPurchaseUser(user: User) {
  if (isRunningInExpoGo || isWeb) {
    return;
  }

  try {
    const Purchases: typeof import("react-native-purchases").default =
      require("react-native-purchases").default;
    await Purchases.logIn(user.id);
    await Purchases.setAttributes({
      $displayName: `${user.first} ${user.last}`,
      $email: user.email ?? "unknown",
      $phoneNumber: user.phone ?? "unknown",
      username: user.username,
    });
  } catch (error) {
    Logger.error(error);
  }
}

export async function setupPurchase() {
  if (isRunningInExpoGo || isWeb || __DEV__) {
    return;
  }

  try {
    const Purchases: typeof import("react-native-purchases").default =
      require("react-native-purchases").default;
    const { LOG_LEVEL } = await import("react-native-purchases");

    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    if (Platform.OS === "ios") {
      Purchases.configure({ apiKey: "appl_dqtIBTnfwElgSEMkBpwmpjMrgNj" });
    } else if (Platform.OS === "android") {
      Purchases.configure({ apiKey: "goog_LdhRLvXtGjDlpznOgEIWWUdsokX" });
    }
  } catch (error) {
    Logger.error(error);
  }
}
