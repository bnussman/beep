import { Heading, Container } from '@chakra-ui/react';
import { Card } from '../components/Card';

function About() {
    return (
        <Container maxW="container.lg">
            <Card>
                <Heading>
                    About Us
                </Heading>
                Ride beep app is currently a substitute for the facebook page that people use to get around Boone, NC and Appalachian State University. This app allows college students to make money by beeping and allows for an easy and cheap way to get where they want around campus and Boone. The owners are students at App State, Ian Murphy and Banks Nussman, who saw the flaws of the facebook page and wanted to improve the experience with leaving everything that was great about the original idea.
            </Card>
        </Container>
    );
}

export default About;
