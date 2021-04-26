import { NavLink } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { Heading4, Heading5, Subtitle, Body1, Heading6 } from './Typography';
import { Badge, Indicator } from './Indicator';
import { Button } from './Input';
import { formatPhone } from '../utils/formatters';
import RideHistoryTable from './RideHistoryTable';
import BeepHistoryTable from './BeepHistoryTable';
import QueueTable from './QueueTable';
import { UserRole } from '../types/User';
import {gql, useMutation} from '@apollo/client';
import {RemoveUserMutation, User} from '../generated/graphql';
import {printStars} from '../routes/admin/ratings';

const RemoveUser = gql`
    mutation RemoveUser($id: String!) {
        removeUser(id: $id)
    }
`;

interface Props {
    user: Partial<User>;
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

    return <>
        {user && (
            <>
                <div className="flex flex-col items-center mb-8 lg:flex-row">
                    {user.photoUrl && (
                        <div className="flex mr-3">
                            <img className="w-40 h-40 rounded-full shadow-lg" src={user.photoUrl} alt={user.name}></img>
                        </div>
                    )}
                    <div className="flex flex-col items-center mx-3 lg:items-start">
                        <Heading4>
                            <span className="mr-2">{user.first} {user.last}</span>
                        </Heading4>
                        <div>
                            {user.role === UserRole.ADMIN ? <Badge className="transform -translate-y-1">admin</Badge> : <></>}
                            {user.isStudent ? <Badge className="transform -translate-y-1">student</Badge> : <></>}
                        </div>
                        <Subtitle>
                            {user.rating ?
                                <span>{printStars(user.rating)} ({user.rating})</span>
                            :
                                <span>No Rating</span>
                            }
                        </Subtitle>
                        <Subtitle>@{user.username}</Subtitle>
                        <Subtitle><a href={`mailto:${user.email}`}>{user.email}</a></Subtitle>
                        <Subtitle>{formatPhone(user.phone || '')}</Subtitle>
                        <Body1>{user.id}</Body1>
                    </div>
                    <div className="flex flex-col m-6 dark:text-white">
                        <Heading6>
                            {user.isBeeping
                                ? <><Indicator className="mr-2 animate-pulse" />Beeping now</>
                                : <><Indicator className="mr-2" color="red" />Not beeping</>
                            }
                        </Heading6>
                        <p>Queue size: {user.queueSize}</p>
                        <p>Capacity: {user.capacity}</p>
                        <p>Rate: ${user.singlesRate} / ${user.groupRate}</p>
                        <p>Venmo usename: {user.venmo}</p>
                        <p>{user.masksRequired ? 'Masks required' : 'Masks not required'}</p>
                    </div>
                    <div className="flex-grow"></div>
                    <div>
                        <NavLink to={props.admin ? `/admin/users/${user.id}/edit` : `/profile/edit/${user.id}`}>
                            <Button>Edit {props.admin ? 'user' : 'profile'}</Button>
                        </NavLink>

                        {props.admin &&
                            <button
                                onClick={() => deleteUser(user.id)}
                                className={"inline-flex justify-center py-2 px-4 mr-1 text-sm font-medium rounded-md text-white shadow-sm text-white bg-red-500 hover:bg-red-700"}
                            >
                                {!loading ? "Delete User" : "Loading"}
                            </button>
                        }

                        { !props.admin &&
                            <NavLink to={'password/change'}>
                                <Button>Change password</Button>
                            </NavLink>
                        }
                    </div>
                </div>

                <div>
                    <QueueTable userId={user.id}/>
                </div>

                <div>
                    <div>
                        <Heading5>Beep history</Heading5>
                        <BeepHistoryTable userId={user.id} />
                    </div>
                    <div>
                        <Heading5>Ride history</Heading5>
                        <RideHistoryTable userId={user.id} />
                    </div>
                </div>
            </>
        )}
    </>;
}

export default UserProfile;
