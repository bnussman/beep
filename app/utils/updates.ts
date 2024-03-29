import { useEffect } from "react";
import { checkForUpdateAsync, fetchUpdateAsync, reloadAsync } from "expo-updates";
import { Logger } from "./logger";

async function checkForUpdates() {
  if (__DEV__) return;

  try {
    const update = await checkForUpdateAsync();

    if (update.isAvailable) {
      await fetchUpdateAsync();
      await reloadAsync();
    }
  } catch (error) {
    Logger.error(error);
  }
}

export function useAutoUpdate() {
  useEffect(() => {
    checkForUpdates();
  }, []);

  return null;
}
