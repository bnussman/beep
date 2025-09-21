import { useEffect } from "react";
import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from "expo-updates";
import { captureException } from "@sentry/react-native";

async function checkForUpdates() {
  if (__DEV__) return;

  try {
    const update = await checkForUpdateAsync();

    if (update.isAvailable) {
      await fetchUpdateAsync();
      await reloadAsync();
    }
  } catch (error) {
    console.log(error);
    captureException(error);
  }
}

export function useAutoUpdate() {
  useEffect(() => {
    checkForUpdates();
  }, []);

  return null;
}
