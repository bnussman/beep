import React from 'react';
import iPhoneDark from '../assets/dark-square.png';
import iPhoneLight from '../assets/light-square.png';
import { Container, useColorMode } from "@chakra-ui/react";
import { Hero } from "../components/Hero";

export function Home() {
  const { colorMode } = useColorMode();

  return (
    <Container maxW="container.xl">
      <Hero
        title="Ride Beep App"
        subtitle="Your ultimate ride-share app. A simple way to get a ride around college campuses. A product by students for students."
        image={colorMode === 'dark' ? iPhoneLight : iPhoneDark}
        buttonLink="/download"
        buttonText="Download"
      />
    </Container>
  );
}