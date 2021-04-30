import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Card } from '../../../components/Card';
import { Indicator } from '../../../components/Indicator';
import Pagination from '../../../components/Pagination';
import {gql, useQuery} from '@apollo/client';
import {GetReportsQuery} from '../../../generated/graphql';
import {Heading, Table, Tbody, Td, Th, Thead, Tr} from '@chakra-ui/react';

dayjs.extend(relativeTime);

const ReportsGraphQL = gql`
    query getReports($show: Int, $offset: Int) {
        getReports(show: $show, offset: $offset) {
            items {
                id
                timestamp
                reason
                notes
                handled
                reporter {
                    id
                    name
                    photoUrl
                    username
                }
                reported {
                    id
                    name
                    photoUrl
                    username
                }
            }
            count
        }
    }
`;

function Reports() {

    const { data, refetch } = useQuery<GetReportsQuery>(ReportsGraphQL, { variables: { offset: 0, show: 25 }});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageLimit = 25;

    async function fetchReports(page: number) {
        refetch({ variables: {
            offset: page
        }});
    }

    return <>
        <Heading>Reports</Heading>

        <Pagination
            resultCount={data?.getReports.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchReports}/>

        <Card>
            <Table>
                <Thead>
                    <Th>Reporter</Th>
                    <Th>Reported User</Th>
                    <Th>Reason</Th>
                    <Th>Date</Th>
                    <Th>Handled?</Th>
                </Thead>
                <Tbody>
                    {data?.getReports && (data.getReports.items).map(report => {
                        return (
                            <Tr key={report.id}>
                                <Td>
                                    {report.reporter.name}
                                </Td>
                                <Td>
                                    {report.reported.name}
                                </Td>
                                <Td>{report.reason}</Td>
                                <Td>{dayjs().to(report.timestamp)}</Td>
                                <Td>
                                    {report.handled
                                        ? <Indicator color='green' />
                                        : <Indicator color='red' />
                                    }
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
        </Card>

        <Pagination
            resultCount={data?.getReports.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchReports}/>
    </>;
}

export default Reports;
