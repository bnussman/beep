import { Box, Heading, Container } from '@chakra-ui/react';
import { Card } from '../components/Card';

function Faq() {
    return (
        <Container maxW="container.lg">
        <Box>
            <Card>
                <Heading>
                    What does the app do?
                </Heading>
                The Beep App will easily and instantly connect you (a rider) to a driver known as a “beeper” so you can get a ride.
            </Card>

            <Card>
                <Heading>
                Who owns the app?
                </Heading>
                It is owned by two App State students Ian Murphy and Banks Nussman.
            </Card>

            <Card>
                <Heading>
                Is it associated with Appalachian State University?
                </Heading>
                It is not officially associated with App State in any way. The app is run completely independent. It is only being used in Boone, NC and the area around App State and is targeted for App State students.
            </Card>

            <Card>
                <Heading>
                What is a beep?
                </Heading>
                A beep is our word for the transaction between a rider and driver for the service of transportation.
            </Card>

            <Card>
                <Heading>
                What is a beeper?
                </Heading>
                A beeper is our word for a driver.
            </Card>

            <Card>
                <Heading>
                How is this different from the Facebook pages?
                </Heading>
                The Beep App is a stand alone iOS and Android app. Our goal is to not change the basic principles of beeping.
            </Card>

            <Card>
                <Heading>
                How much does it cost?
                </Heading>
                The iOS and Android apps will be free. When you get a ride, the driver picks their rate and you will know that rate before you have committed to getting a ride. Traditionally beepers charge $2.00 if you ride as a group and $3.00 if you ride alone. The Beep App will not cost any more than the prices seen on the previous Facebook pages. 
            </Card>

            <Card>
                <Heading>
                How are payments made?
                </Heading>
                The Beep App does not process payments and does not take any cut from beepers’s rates. Payments are made by providing riders and beepers with a link to each other's Venmo. If the rider and beeper agree on paying in cash, that is allowed.
            </Card>

            <Card>
                <Heading>
                How are riders and drivers paired?
                </Heading>
                The rider has the opportunity to let the app pick their beeper, or they can choose from a list of beepers. If they let the app decide for them, it will pick the beeper with the shortest wait time (smallest queue).
            </Card>

            <Card>
                <Heading>
                    Is the Beep App regulated in any way?
                </Heading>
                The beep app is not regulated in any way and nothing has been added to the app that will cost more money to anybody and still uses the fundamental principles that the facebook page was founded on.
            </Card>
        </Box>
        </Container>
    );
}

export default Faq;
