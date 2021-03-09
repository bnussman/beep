import React, { useState } from 'react'
import { formatPhone } from '../../../utils/formatters';
import { Heading3 } from '../../../components/Typography';
import { Card } from '../../../components/Card';
import { Table, THead, TH, TBody, TR, TDProfile, TDText } from '../../../components/Table';
import { Indicator } from '../../../components/Indicator';
import Pagination from '../../../components/Pagination';
import {gql, useQuery} from '@apollo/client';
import { GetUsersQuery } from '../../../generated/graphql';

const UsersGraphQL = gql`
    query getUsers($show: Int, $offset: Int) {
        getUsers(show: $show, offset: $offset) {
            items {
                id
                photoUrl
                first
                last
                email
                isStudent
                isEmailVerified
                username
                phone
                isBeeping
            }
            count
        }
    }
`;
function Users() {
    const { loading, error, data, refetch } = useQuery<GetUsersQuery>(UsersGraphQL, { variables: { offset: 0, show: 25 }});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageLimit = 25;

    async function fetchUsers(page: number) {
        refetch({
            offset: page 
        })
    }

    if (loading) return <p>Loading</p>;
    if (error) console.log(error);

    return <>
        <Heading3>Users</Heading3>

        <Pagination
            resultCount={data?.getUsers?.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchUsers}
        />
        <Card>
            <Table>
                <THead>
                    <TH>User</TH>
                    <TH>Email</TH>
                    <TH>Phone</TH>
                    <TH>Is Student?</TH>
                    <TH>Is Email Verified?</TH>
                    <TH>Is beeping?</TH>
                </THead>
                <TBody>
                    {data?.getUsers && (data?.getUsers.items).map(user => {
                        return (
                            <TR key={user.id}>
                                <TDProfile
                                    to={`users/${user.id}`}
                                    photoUrl={user.photoUrl}
                                    title={`${user.first} ${user.last}`}
                                    subtitle={`@${user.username}`}>
                                </TDProfile>
                                <TDText><a href={`mailto:${user.email}`} rel="noreferrer" target="_blank">{user.email}</a></TDText>
                                <TDText>{formatPhone(user.phone)}</TDText>
                                <TDText>
                                    {user.isStudent
                                        ? <Indicator color="green" />
                                        : <Indicator color="red" />
                                    }
                                </TDText>
                                <TDText>
                                    {user.isEmailVerified
                                        ? <Indicator color="green" />
                                        : <Indicator color="red" />
                                    }
                                </TDText>
                                <TDText>
                                    {user.isBeeping
                                        ? <Indicator color="green" className="animate-pulse" />
                                        : <Indicator color="red" />
                                    }
                                </TDText>
                            </TR>
                        )
                    })}
                </TBody>
            </Table>
        </Card>

        <Pagination
            resultCount={data?.getUsers.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchUsers}
        />
    </>;
}

export default Users;
