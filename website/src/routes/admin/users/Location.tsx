import {gql} from '@apollo/client';
import { Box, Center, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import { User } from '../../../generated/graphql';
import {client} from '../../../utils/Apollo';
import {GetUser} from './User';

interface Props {
    user: Partial<User>;
}

const BeepersLocation = gql`
    subscription BeepersLocation($topic: String!) {
        getLocationUpdates(topic: $topic) {
            latitude
            longitude
        }
    }
`;

let sub: any;

function LocationView(props: Props) {

    const { user } = props;

    async function subscribe() {
        const a = client.subscribe({ query: BeepersLocation, variables: { topic: user.id }});

        sub = a.subscribe(({ data }) => {
            console.log("Location Update", data.getLocationUpdates);

            client.writeQuery({
                query: GetUser,
                data: {
                    getUser: {
                        ...user,
                        location: {
                            latitude: data.getLocationUpdates.latitude,
                            longitude: data.getLocationUpdates.longitude,
                            timestamp: new Date()
                        }
                    }
                },
                variables: {
                    id: user.id
                }
            });
        });
    }

    useEffect(() => {
        subscribe();

        return () => {
            sub?.unsubscribe();
        };
    }, []);

    if (!user.location) {
        return (
            <Center h="100px">
                This user has no Location data.
            </Center>
        );
    }
    return (
        <Box>
            <Text>{user.location?.latitude}, {user.location?.longitude}</Text>
            <Text>{dayjs().to(user.location?.timestamp)}</Text>
            <iframe
                title="Map"
                width="100%"
                height="350"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI&q=${user.location?.latitude},${user.location?.longitude}`}>
            </iframe>
        </Box>

    );
}

export default LocationView;
