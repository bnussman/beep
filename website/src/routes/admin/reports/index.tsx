import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Indicator } from '../../../components/Indicator';
import Pagination from '../../../components/Pagination';
import { gql, useQuery } from '@apollo/client';
import { GetReportsQuery } from '../../../generated/graphql';
import { Box, Button, Center, Heading, Spinner, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import TdUser from '../../../components/TdUser';
import ReportDrawer from './Drawer';

dayjs.extend(relativeTime);

export const ReportsGraphQL = gql`
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
    const { data, loading, refetch } = useQuery<GetReportsQuery>(ReportsGraphQL, { variables: { offset: 0, show: 25 } });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [id, setId] = useState<string | null>(null);
    const pageLimit = 25;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();

    async function fetchReports(page: number) {
        refetch({
            variables: {
                offset: page
            }
        });
    }

    function openReport(id: string) {
        setId(id);
        onOpen();
    }

    return (
        <Box>
            <Heading>Reports</Heading>
            <Pagination
                resultCount={data?.getReports.count}
                limit={pageLimit}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onPageChange={fetchReports}
            />
            <Table>
                <Thead>
                    <Tr>
                        <Th>Reporter</Th>
                        <Th>Reported User</Th>
                        <Th>Reason</Th>
                        <Th>Date</Th>
                        <Th>Done</Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.getReports && (data.getReports.items).map(report => {
                        return (
                            <Tr key={report.id} onClick={() => openReport(report.id)}>
                                <TdUser user={report.reporter} />
                                <TdUser user={report.reported} />
                                <Td>{report.reason}</Td>
                                <Td>{dayjs().to(report.timestamp)}</Td>
                                <Td>
                                    {report.handled
                                        ? <Indicator color='green' />
                                        : <Indicator color='red' />
                                    }
                                </Td>
                                <Td>
                                    <Button colorScheme="brand" onClick={() => openReport(report.id)}>
                                        Open
                                    </Button>
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
            {loading &&
            <Center h="100px">
                <Spinner size="xl" />
            </Center>
            }
            <Pagination
                resultCount={data?.getReports.count}
                limit={pageLimit}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onPageChange={fetchReports}
            />
            <ReportDrawer
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                id={id}
            />
        </Box>
    );
}

export default Reports;
