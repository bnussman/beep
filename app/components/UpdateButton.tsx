import * as Updates from 'expo-updates';
import React, { useEffect, useState } from 'react';
import { Button } from 'native-base';
import { Logger } from '../utils/Logger';

export function UpdateButton() {
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          setHasUpdate(true);
        }
      } catch (error) {
        Logger.error(error);
      }
    };

    check();
  }, []);

  const handleUpdate = async () => {
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  };

  if (!hasUpdate) {
    return null;
  }

  return (
    <Button onPress={handleUpdate}>
      Update Available!
    </Button>
  );
}
