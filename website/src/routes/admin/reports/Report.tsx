import { NavLink, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Indicator } from '../../../components/Indicator';
import { Formik, Form, Field } from 'formik';
import { Card } from '../../../components/Card';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DeleteReportMutation, GetReportQuery, UpdateReportMutation } from '../../../generated/graphql';
import { Avatar, Box, Button, Heading, Text } from '@chakra-ui/react';
import React from "react";

dayjs.extend(relativeTime);

const DeleteReport = gql`
    mutation DeleteReport($id: String!) {
        deleteReport(id: $id)
    }
`;

const UpdateReport = gql`
    mutation UpdateReport($id: String!, $notes: String, $handled: Boolean) {
        updateReport(id: $id, input: {
            notes: $notes,
            handled: $handled
        }) {
            id
        }
    }
`;

const GetReport = gql`
    query GetReport($id: String!) {
        getReport(id: $id) {
            id
            reason
            timestamp
            handled
            notes
            beep {
                id
            }
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
            handledBy {
                id
                name
                photoUrl
                username
            }
        }
    }
`;

function ReportPage() {
    const { reportId } = useParams<{reportId: string}>();
    const { data, loading, error, refetch } = useQuery<GetReportQuery>(GetReport, { variables: { id: reportId }});
    const [update, { error: updateError }] = useMutation<UpdateReportMutation>(UpdateReport);
    const [deleteReport, { loading: deleteLoading }] = useMutation<DeleteReportMutation>(DeleteReport);
    const history = useHistory();

    async function doDeleteReport() {
        await deleteReport({ variables: { id: reportId } });
        history.goBack();
    }

    async function updateReport(values: any) {
        const result = await update({ variables: { id: reportId, ...values }});
        if (result) {
            refetch();
        }
    }

    return (
        <Box>
        <Heading>Report</Heading>
        {loading && <p>Loading</p>}
        {error && error.message}

        {data?.getReport ?
            <>
                <div>
                    <Card>
                        <div>
                            <Heading>Reporter</Heading>
                            <div>
                                <Avatar src={data.getReport.reporter.photoUrl} name={data.getReport.reporter.name}/>
                                <NavLink to={`/admin/users/${data.getReport.reporter.id}`}>
                                    {data.getReport.reporter.name}
                                </NavLink>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div>
                            <Heading>Reported</Heading>
                            <div>
                                <Avatar src={data.getReport.reported.photoUrl} name={data.getReport.reported.name} />
                                <NavLink to={`/admin/users/${data.getReport.reported.id}`}>
                                    {data.getReport.reported.name}
                                </NavLink>
                            </div>
                        </div>
                    </Card>
                </div>
                <Card>
                    <Heading>Reason</Heading>
                    <Text>{data.getReport.reason}</Text>
                </Card>
                <Card>
                    <Heading>Created</Heading>
                    <Text>{dayjs().to(data.getReport.timestamp)}</Text>  
                </Card>
                {data.getReport.beep &&
                    <Card>
                        <Heading>Associated Beep Event</Heading>
                        <NavLink to={`/admin/beeps/${data.getReport.beep.id}`}>
                            {data.getReport.beep.id}  
                        </NavLink>
                    </Card>
                }
                <Card>
                    <div>
                        {data.getReport.handled ?
                            <div>
                                <div>
                                    <Heading>Status</Heading>
                                </div>
                                <div>
                                    <Indicator color='green'/>
                                    <span>Handled by</span>
                                    <div>
                                        <Avatar src={data.getReport.handledBy.photoUrl} name={data.getReport.handledBy.name}/>
                                        <NavLink to={`/admin/users/${data.getReport.handledBy.id}`}>
                                            {data.getReport.handledBy.name}
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                            :
                            <>
                                <div>
                                    <Heading>Status</Heading>
                                </div>
                                <Indicator color='red'/>
                                <span>Not handled</span>
                            </>
                        }
                    </div>
                </Card>
            <div>
            <Heading>Update Report Info</Heading>
                {updateError && <p>updateError.message</p>}
            <Formik
                initialValues={{
                    notes: data.getReport.notes,
                    handled: data.getReport.handled
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    await updateReport(values);
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <Heading>Admin Notes</Heading>
                            <Field type="text" component="textarea" name="notes" />
                        </div>
                        <div>
                            <Heading>Handled</Heading>
                            <Field type="checkbox" name="handled"/>
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Upading..."  : "Update Report"}
                        </Button>
                        <Button
                            onClick={() => doDeleteReport()}
                        >
                            {!deleteLoading ? "Delete Report" : "Deleteing..."}
                        </Button>
                    </Form>
                )}
            </Formik>
            </div>
        </>
        :
        <Heading>Loading</Heading>
        }
    </Box>
)}

export default ReportPage;
