import React from 'react';
import { Box, Heading, Stack, Text } from '@chakra-ui/react';

function Faq() {
  return (
    <Stack spacing={8}>
      <Box>
        <Heading size='md'>
          What does the app do?
        </Heading>
        <Text>
          The Beep App will easily and instantly connect you (a rider) to a driver known as a “beeper” so you can get a ride.
        </Text>
      </Box>
      <Box>
        <Heading size='md'>
          Who owns the app?
        </Heading>
        <Text>
          It is owned by two App State students Ian Murphy and Banks Nussman.
        </Text>
      </Box>
      <Box>
        <Heading size='md'>
          Is it associated with Appalachian State University?
        </Heading>
        <Text>
          It is not officially associated with App State in any way. The app is run completely independent. It is only being used in Boone, NC and the area around App State and is targeted for App State students.
        </Text>
      </Box>
      <Box>
        <Heading size='md'>
          What is a beep?
        </Heading>
        <Text>
          A beep is our word for the transaction between a rider and driver for the service of transportation.
        </Text>
      </Box>
      <Box>
        <Heading size='md'>
          What is a beeper?
        </Heading>
        <Text>
          A beeper is our word for a driver.
        </Text>
      </Box>
      <Box>
        <Heading size='md'>
          How is this different from the Facebook pages?
        </Heading>
        <Text>
          The Beep App is a stand alone iOS and Android app. Our goal is to not change the basic principles of beeping.
        </Text>
      </Box>
      <Box>
        <Heading size='md'>
          How much does it cost?
        </Heading>
        <Text>
          The iOS and Android apps will be free. When you get a ride, the driver picks their rate and you will know that rate before you have committed to getting a ride. Traditionally beepers charge $2.00 if you ride as a group and $3.00 if you ride alone. The Beep App will not cost any more than the prices seen on the previous Facebook pages.
        </Text>
      </Box>
      <Box>
        <Heading size='md'>
          How are payments made?
        </Heading>
        <Text>
          The Beep App does not process payments and does not take any cut from beepers’s rates. Payments are made by providing riders and beepers with a link to each other's Venmo. If the rider and beeper agree on paying in cash, that is allowed.
        </Text>
      </Box>
      <Box>
        <Heading size='md'>
          How are riders and drivers paired?
        </Heading>
        <Text>
          The rider has the opportunity to let the app pick their beeper, or they can choose from a list of beepers. If they let the app decide for them, it will pick the beeper with the shortest wait time (smallest queue).
        </Text>
      </Box>
      <Box>
        <Heading size='md'>
          Is the Beep App regulated in any way?
        </Heading>
        <Text>
          The beep app is not regulated in any way and nothing has been added to the app that will cost more money to anybody and still uses the fundamental principles that the facebook page was founded on.
        </Text>
      </Box>
    </Stack>
  );
}

export default Faq;
