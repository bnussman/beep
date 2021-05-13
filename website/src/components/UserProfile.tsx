import { NavLink } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { formatPhone } from '../utils/formatters';
import RideHistoryTable from './RideHistoryTable';
import BeepHistoryTable from './BeepHistoryTable';
import QueueTable from './QueueTable';
import { UserRole } from '../types/User';
import {gql, useMutation} from '@apollo/client';
import {RemoveUserMutation} from '../generated/graphql';
import {printStars} from '../routes/admin/ratings';
import { Heading, Badge, Box, Text, Avatar, Button } from '@chakra-ui/react';

const RemoveUser = gql`
    mutation RemoveUser($id: String!) {
        removeUser(id: $id)
    }
`;

interface Props {
    user: any;
    admin?: boolean;
}

function UserProfile(props: Props) {
    const history = useHistory();
    const [remove, { loading }] = useMutation<RemoveUserMutation>(RemoveUser);

    async function deleteUser(id: string) {
        await remove({ variables: {id: id}, refetchQueries: () => ["getUsers"], awaitRefetchQueries: true });
        history.goBack();
    }

    const { user } = props;

    return (
        <Box>
            <div>
                <Avatar name={user.name} src={user.photoUrl} />
                <div>
                    <Heading>
                        <span>{user.name}</span>
                    </Heading>
                    <div>
                        {user.role === UserRole.ADMIN && <Badge>admin</Badge>}
                        {user.isStudent && <Badge>student</Badge>}
                    </div>
                    <Text>
                        {user.rating ?
                            <span>{printStars(user.rating)} ({user.rating})</span>
                            :
                            <span>No Rating</span>
                        }
                    </Text>
                    <Text>@{user.username}</Text>
                    <Text><a href={`mailto:${user.email}`}>{user.email}</a></Text>
                    <Text>{formatPhone(user.phone || '')}</Text>
                    <Text>{user.id}</Text>
                </div>
                <div>
                    <Heading>
                        {user.isBeeping
                            ? <Text>Beeping now</Text>
                            : <Text>Not beeping</Text>
                        }
                    </Heading>
                    <p>Queue size: {user.queueSize}</p>
                    <p>Capacity: {user.capacity}</p>
                    <p>Rate: ${user.singlesRate} / ${user.groupRate}</p>
                    <p>Venmo usename: {user.venmo || "N/A"}</p>
                    <p>CashApp usename: {user.cashapp || "N/A"}</p>
                    <p>{user.masksRequired ? 'Masks required' : 'Masks not required'}</p>
                </div>
                <div>
                    <NavLink to={props.admin ? `/admin/users/${user.id}/edit` : `/profile/edit/${user.id}`}>
                        <Button>Edit {props.admin ? 'user' : 'profile'}</Button>
                    </NavLink>

                    {props.admin &&
                        <Button onClick={() => deleteUser(user.id)}>
                            {!loading ? "Delete User" : "Loading"}
                        </Button>
                    }
                    {!props.admin &&
                        <NavLink to={'password/change'}>
                            <Button>Change password</Button>
                        </NavLink>
                    }
                </div>
            </div>
            <div>
                <Heading>Location</Heading>
                {user.location ?
                    <>
                        <div>{user.location.latitude}, {user.location.longitude}</div>
                        <iframe
                            title="Map"
                            width="100%"
                            height="250"
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBgabJrpu7-ELWiUIKJlpBz2mL6GYjwCVI&q=${user.location.latitude},${user.location.longitude}`}>
                        </iframe>
                    </>
                    :
                    <div>User has no location</div>
                }
            </div>

            <div>
                <QueueTable userId={user.id} />
            </div>

            <div>
                <div>
                    <Heading>Beep history</Heading>
                    <BeepHistoryTable userId={user.id} />
                </div>
                <div>
                    <Heading>Ride history</Heading>
                    <RideHistoryTable userId={user.id} />
                </div>
            </div>
        </Box>
    );
}

export default UserProfile;
