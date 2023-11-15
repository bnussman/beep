import { useEffect } from "react";
import { checkForUpdateAsync, fetchUpdateAsync, reloadAsync } from "expo-updates";
import { Logger } from "./Logger";

export function useAutoUpdate() {
  useEffect(() => {
    if (__DEV__) return;

    const check = async () => {
      try {
        const update = await checkForUpdateAsync();

        if (update.isAvailable) {

          await fetchUpdateAsync();
          await reloadAsync();
        }
      } catch (error) {
        Logger.error(error);
      }
    };

    check();
  }, []);

  return null;
}
