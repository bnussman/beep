import { NavLink, useHistory, useParams } from "react-router-dom";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {Card} from '../../../components/Card';
import {gql, useMutation, useQuery} from '@apollo/client';
import {DeleteBeepMutation, GetBeepQuery} from '../../../generated/graphql';
import { Avatar } from "@chakra-ui/avatar";
import { Heading, Text, Box, Button } from "@chakra-ui/react";
import React from "react";

dayjs.extend(duration);

const DeleteBeep = gql`
    mutation DeleteBeep($id: String!) {
        deleteBeep(id: $id)
    }
`;

const GetBeep = gql`
    query GetBeep($id: String!) {
        getBeep(id: $id) {
            id
            origin
            destination
            start
            end
            groupSize
            beeper {
                id
                name
                photoUrl
                username
            }
            rider {
                id
                name
                photoUrl
                username
            }
        }
    }
`;

function BeepPage() {
    const { beepId } = useParams<{ beepId: string }>();
    const { data } = useQuery<GetBeepQuery>(GetBeep, { variables: { id: beepId}});
    const [deleteBeep, { loading: deleteLoading }] = useMutation<DeleteBeepMutation>(DeleteBeep);
    const history = useHistory();

    async function doDeleteBeep() {
        await deleteBeep({ variables: { id: beepId }});
        history.goBack();
    }

    return (
        <Box>
            <div>
                <Heading>Beep</Heading>
                <Button
                    onClick={() => doDeleteBeep()}
                >
                    {!deleteLoading ? "Delete Beep" : "Loading"}
                </Button>
            </div>
            {data?.getBeep ?
                <Box>
                <div>
                    <iframe
                        title="Map"
                        width="100%"
                        height="300"
                        src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI&origin=${data.getBeep.origin}&destination=${data.getBeep.destination}`}>
                    </iframe>

                    <div>
                        <Card>
                            <div>
                                <Heading>Beeper</Heading>
                                <div>
                                    <Avatar src={data.getBeep.beeper.photoUrl} />
                                    <NavLink to={`/admin/users/${data.getBeep.beeper.id}`}>
                                        {data.getBeep.beeper.name}
                                    </NavLink>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div>
                                <Heading>Rider</Heading>
                                <div>
                                    <Avatar src={data.getBeep.rider.photoUrl} name={data.getBeep.rider.name}/>
                                    <NavLink to={`/admin/users/${data.getBeep.rider.id}`}>
                                        {data.getBeep.rider.name}
                                    </NavLink>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <Heading>Origin</Heading>
                            <Text>{data.getBeep.origin}</Text>
                        </Card>
                        <Card>
                            <Heading>Destination</Heading>
                            <Text>{data.getBeep.destination}</Text>
                        </Card>
                    </div>
                    <Card>
                            <Heading>Group Size</Heading>
                            <Text>{data.getBeep.groupSize}</Text>
                    </Card>
                    <div>
                        <Card>
                            <Heading>Beep Started</Heading>
                            <Text>{new Date(data.getBeep.start).toLocaleString()} - {dayjs().to(data.getBeep.start)}</Text>
                        </Card>
                        <Card>
                            <Heading>Beep Ended</Heading>
                            <Text>{new Date(data.getBeep.end).toLocaleString()} - {dayjs().to(data.getBeep.end)}</Text>
                        </Card>
                    </div>
                </div>
                </Box>
            :
            <Heading>Loading</Heading>
            }
        </Box>
    );
}

export default BeepPage;
