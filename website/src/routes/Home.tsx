import { Container } from "@chakra-ui/react";
import Hero from "../components/Hero";
import React from 'react';
import iPhoneImage from '../assets/white.png';

function Home() {
    return (
        <Container maxW={'container.xl'}>
            <Hero
                title="Ride Beep App"
                subtitle="Your ultimate travel companion. A simple way to get a ride at Appalachian State University. A product by students for students."
                image={iPhoneImage}
                ctaLink=""
                ctaText=""
            />
        </Container>
    );

}


export default Home;
