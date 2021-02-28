import React, { useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Card } from '../../../components/Card';
import { Table, THead, TH, TBody, TR, TDText, TDButton, TDProfile } from '../../../components/Table';
import { Heading3 } from '../../../components/Typography';
import { Indicator } from '../../../components/Indicator';
import Pagination from '../../../components/Pagination';
import {gql, useQuery} from '@apollo/client';
import {GetReportsQuery} from '../../../generated/graphql';

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
                    first
                    last
                    photoUrl
                    username
                }
                reported {
                    id
                    first
                    last
                    photoUrl
                    username
                }
            }
            count
        }
    }
`;

function Reports() {

    const { loading, error, data, refetch } = useQuery<GetReportsQuery>(ReportsGraphQL, { variables: { offset: 0, show: 25 }});
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageLimit = 25;

    async function fetchReports(page) {
        refetch({ variables: {
            offset: page
        }});
    }

    return <>
        <Heading3>Reports</Heading3>

        <Pagination
            resultCount={data?.getReports.count}
            limit={pageLimit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onPageChange={fetchReports}/>

        <Card>
            <Table>
                <THead>
                    <TH>Reporter</TH>
                    <TH>Reported User</TH>
                    <TH>Reason</TH>
                    <TH>Date</TH>
                    <TH>Handled?</TH>
                    <TH></TH>
                </THead>
                <TBody>
                    {data?.getReports && (data.getReports.items).map(report => {
                        return (
                            <TR key={report.id}>
                                <TDProfile
                                    to={`users/${report.reporter.id}`}
                                    photoUrl={report.reporter.photoUrl}
                                    title={`${report.reporter.first} ${report.reporter.last}`}
                                    subtitle={`@${report.reporter.username}`}>
                                </TDProfile>
                                <TDProfile
                                    to={`users/${report.reported.id}`}
                                    photoUrl={report.reported.photoUrl}
                                    title={`${report.reported.first} ${report.reported.last}`}
                                    subtitle={`@${report.reported.username}`}>
                                </TDProfile>
                                <TDText>{report.reason}</TDText>
                                <TDText>{dayjs().to(report.timestamp)}</TDText>
                                <TDText>
                                    {report.handled
                                        ? <Indicator color='green' />
                                        : <Indicator color='red' />
                                    }
                                </TDText>
                                <TDButton to={`reports/${report.id}`}>View</TDButton>
                            </TR>
                        )
                    })}
                </TBody>
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
