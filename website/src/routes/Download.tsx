import React, { useEffect } from 'react';
import { VStack, Spinner, Center, Text } from '@chakra-ui/react';
import { getMobileOperatingSystem } from '../utils/utils';

export function Download() {

  useEffect(() => {
    if (getMobileOperatingSystem() === 'Android') {
      window.location.href = 'https://play.google.com/store/apps/details?id=app.ridebeep.App';
    }
    window.location.href = 'https://apps.apple.com/us/app/ride-beep-app/id1528601773';
  }, []);

  return (
    <Center h="200px">
      <VStack spacing={4}>
        <Text fontSize="4xl">Redirecting you to download</Text>
        <Spinner size="xl" />
      </VStack>
    </Center>
  );
}