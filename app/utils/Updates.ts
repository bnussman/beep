import * as Updates from "expo-updates";
import { Logger } from "./Logger";

export async function handleUpdateCheck(): Promise<void> {
  if (!__DEV__) {
    const result = await Updates.checkForUpdateAsync();
    if (result.isAvailable) {
      try {
        await Updates.reloadAsync();
      } catch (error) {
        Logger.error(error);
      }
    }
  }
}
