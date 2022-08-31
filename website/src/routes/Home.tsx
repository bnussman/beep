import React from 'react';
import iPhoneImage from '../assets/white.png';
import { Container } from "@chakra-ui/react";
import { Hero } from "../components/Hero";

export function Home() {
  return (
    <Container maxW="container.xl">
      <Hero
        title="Ride Beep App"
        subtitle="Your ultimate ride-share app. A simple way to get a ride around college campuses. A product by students for students."
        image={iPhoneImage}
        buttonLink="/download"
        buttonText="Download"
      />
    </Container>
  );
}