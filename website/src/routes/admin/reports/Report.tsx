import React from 'react'
import { NavLink, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Heading3, Body1, Heading5, Heading1 } from '../../../components/Typography';
import { Indicator } from '../../../components/Indicator';
import { Button } from '../../../components/Input';
import { Formik, Form, Field } from 'formik';
import {Card} from '../../../components/Card';
import {gql, useMutation, useQuery} from '@apollo/client';
import {DeleteReportMutation, GetReportQuery, UpdateReportMutation} from '../../../generated/graphql';

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
            handledBy {
                id
                first
                last
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
        <>
        <Heading3>Report</Heading3>
        {loading && <p>Loading</p>}
        {error && error.message}

        {data?.getReport ?
            <>
                <div className="flex flex-wrap">
                    <Card className="flex-grow mb-4 sm:mr-2">
                        <div className="m-4">
                            <Heading5>Reporter</Heading5>
                            <div className="flex flex-row items-center">
                                {data.getReport.reporter.photoUrl && (
                                    <div className="flex mr-3">
                                        <img className="w-10 h-10 rounded-full shadow-lg" src={data.getReport.reporter.photoUrl} alt={`${data.getReport.reporter.first} ${data.getReport.reporter.last}`}></img>
                                    </div>
                                )}
                                <NavLink to={`/admin/users/${data.getReport.reporter.id}`}>
                                    {data.getReport.reporter.first} {data.getReport.reporter.last}
                                </NavLink>
                            </div>
                        </div>
                    </Card>
                    <Card className="flex-grow mb-4">
                        <div className="m-4">
                            <Heading5>Reported</Heading5>
                            <div className="flex flex-row items-center">
                                {data.getReport.reported.photoUrl && (
                                    <div className="flex mr-3">
                                        <img className="w-10 h-10 rounded-full shadow-lg" src={data.getReport.reported.photoUrl} alt={`${data.getReport.reported.first} ${data.getReport.reported.last}`}></img>
                                    </div>
                                )}
                                <NavLink to={`/admin/users/${data.getReport.reported.id}`}>
                                    {data.getReport.reported.first} {data.getReport.reported.last}
                                </NavLink>
                            </div>
                        </div>
                    </Card>
                </div>
                <Card className="mb-4">
                    <div className="m-4">
                        <Heading5>Reason</Heading5>
                        <Body1>{data.getReport.reason}</Body1>  
                    </div>
                </Card>
            {/*
            <Heading5>Admin's Notes</Heading5>
            <Body2>{report.adminNotes || "N/A"}</Body2>  
              */}
                <Card className="mb-4">
                    <div className="m-4">
                        <Heading5>Created</Heading5>
                        <Body1>{dayjs().to(data.getReport.timestamp)}</Body1>  
                    </div>
                </Card>
                {data.getReport.beep &&
                <Card className="mb-4">
                    <div className="m-4">
                        <Heading5>Associated Beep Event</Heading5>
                        <NavLink to={`/admin/beeps/${data.getReport.beep.id}`}>
                            {data.getReport.beep.id}  
                        </NavLink>
                    </div>
                </Card>
                }
                <Card className="mb-4">
                    <div className="m-4">
                        {data.getReport.handled ?
                            <div>
                                <div>
                                    <Heading5>Status</Heading5>
                                </div>
                                <div className="flex flex-row items-center">
                                    <Indicator color='green' className="mr-2"/>
                                    <span className="mr-2">Handled by</span>
                                    <div className="flex flex-row items-center">
                                        {data.getReport.handledBy.photoUrl && (
                                            <div className="flex mr-3">
                                                <img className="w-10 h-10 rounded-full shadow-lg" src={data.getReport.handledBy.photoUrl} alt={`${data.getReport.handledBy.first} ${data.getReport.handledBy.last}`}></img>
                                            </div>
                                        )}
                                        <NavLink to={`/admin/users/${data.getReport.handledBy.id}`}>
                                            {data.getReport.handledBy.first} {data.getReport.handledBy.last}
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                            :
                            <>
                                <div>
                                    <Heading5>Status</Heading5>
                                </div>
                                <Indicator color='red' className="mr-2"/>
                                <span>Not handled</span>
                            </>
                        }
                    </div>
                </Card>
            <div className="mt-8">
            <Heading3>Update Report Info</Heading3>
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
                            <Heading5>Admin Notes</Heading5>
                            <Field type="text" component="textarea" name="notes" className="w-full h-32 px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-yellow-500"/>
                        </div>
                        <div>
                            <Heading5>Handled</Heading5>
                            <Field type="checkbox" name="handled"/>
                        </div>
                        <button
                            type="submit"
                            className={`mt-3 inline-flex justify-center py-2 px-4 mr-1 border  text-sm font-medium rounded-md text-white shadow-sm bg-yellow-500 hover:bg-yellow-600 focus:outline-white`}
                            disabled={isSubmitting}>
                            {isSubmitting ? "Upading..."  : "Update Report"}
                        </button>
                        <Button onClick={() => doDeleteReport()} className="text-white bg-red-500 hover:bg-red-700">{!deleteLoading ? "Delete Report" : "Deleteing..."}</Button>
                    </Form>
                )}
            </Formik>
            </div>
        </>
        :
        <Heading1>Loading</Heading1>
        }
    </>
)}

export default ReportPage;
