import {Container} from "@chakra-ui/react";
import Hero from "../components/Hero";

function Home() {
    return (
        <Container maxW={'container.xl'}>
            <Hero
                title="Ride Beep App"
                subtitle="Your ultimate travel companion. A simple way to get a ride at Appalachian State University. A product by students for students."
                image="/white.png"
                ctaLink=""
                ctaText=""
            />
        </Container>
    );

}


export default Home;
