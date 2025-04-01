import React from 'react';
import iPhoneDark from '../assets/dark.png';
import iPhoneLight from '../assets/light.png';
import { Container, useColorMode } from "@chakra-ui/react";
import { createRoute } from '@tanstack/react-router';
import { DownloadIcon } from '@chakra-ui/icons';
import { Link } from '@tanstack/react-router';
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Stack,
} from "@chakra-ui/react"
import { Stats } from '../components/Stats';
import { rootRoute } from '../utils/root';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

export function Home() {
  const { colorMode } = useColorMode();

  return (
    <Container maxW="container.xl">
      <Flex
        align="center"
        justify={{ base: "center", md: "space-around", xl: "space-between" }}
        direction={{ base: "column-reverse", md: "row" }}
        minH="70vh"
        px={8}
        mb={16}
      >
        <Stack
          spacing={4}
          w={{ base: "80%", md: "40%" }}
          align={["center", "center", "flex-start", "flex-start"]}
        >
          <Heading
            as="h1"
            size="xl"
            fontWeight="bold"
            color="primary.800"
            textAlign={["center", "center", "left", "left"]}
          >
            Ride Beep App
          </Heading>
          <Heading
            as="h2"
            size="md"
            color="primary.800"
            opacity="0.8"
            fontWeight="normal"
            lineHeight={1.5}
            textAlign={["center", "center", "left", "left"]}
          >
            A rideshare app for students. Ride or drive at your university today.
          </Heading>
          <Button
            as={Link}
            to="/download"
            target="_blank"
            size="lg"
            rightIcon={<DownloadIcon />}
            colorScheme="yellow"
          >
            Download
          </Button>
          <Stats />
        </Stack>
        <Box w={{ base: "80%", sm: "60%", md: "50%" }} mb={{ base: 12, md: 0 }}>
          <Image maxH="800px" src={colorMode === 'light' ? iPhoneLight : iPhoneDark} />
        </Box>
      </Flex>
    </Container>
  );
}
