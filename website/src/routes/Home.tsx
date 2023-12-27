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
        subtitle="A rideshare app for students. Ride or drive at your college or university today."
        image={colorMode === 'dark' ? iPhoneLight : iPhoneDark}
        buttonLink="/download"
        buttonText="Download"
      />
    </Container>
  );
}
