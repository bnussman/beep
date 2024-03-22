import React from 'react';
import iPhoneDark from '../assets/dark-square.png';
import iPhoneLight from '../assets/light-square.png';
import { Container, useColorMode } from "@chakra-ui/react";
import { Hero } from "../components/Hero";
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../utils/router';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

export function Home() {
  const { colorMode } = useColorMode();

  return (
    <Container maxW="container.xl">
      <Hero
        title="Ride Beep App"
        subtitle="A rideshare app for students. Ride or drive at your college or university today."
        image={colorMode === 'dark' ? iPhoneLight : iPhoneDark}
        buttonLink="/download"
        buttonText="Download"
      />
    </Container>
  );
}
