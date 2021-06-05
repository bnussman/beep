import { NavLink, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Indicator } from '../../../components/Indicator';
import { Formik, Form, Field } from 'formik';
import { Card } from '../../../components/Card';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DeleteReportMutation, GetReportQuery, UpdateReportMutation } from '../../../generated/graphql';
import { Avatar, Box, Button, Center, Flex, Heading, Spacer, Spinner, Text, Textarea } from '@chakra-ui/react';
import React from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import DeleteDialog from "../../../components/DeleteDialog";
import { Error } from '../../../components/Error';
import BasicUser from "../../../components/BasicUser";

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
  const { reportId } = useParams<{ reportId: string }>();
  const { data, loading, error, refetch } = useQuery<GetReportQuery>(GetReport, { variables: { id: reportId } });
  const [update, { error: updateError }] = useMutation<UpdateReportMutation>(UpdateReport);
  const [deleteReport, { loading: deleteLoading }] = useMutation<DeleteReportMutation>(DeleteReport);
  const history = useHistory();

  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  async function doDelete() {
    await deleteReport({ variables: { id: reportId } });
    history.goBack();
  }

  async function updateReport(values: any) {
    const result = await update({ variables: { id: reportId, ...values } });
    if (result) {
      refetch();
    }
  }

  return (
    <Box>
      <Flex align='center'>
        <Heading>Report</Heading>
        <Spacer />
        <Button
            colorScheme="red"
            leftIcon={<DeleteIcon />}
            onClick={() => setIsOpen(true)}
        >
            Delete
        </Button>
      </Flex>

      {error && <Error error={error.message} />}

      {loading &&
        <Center h="100px">
          <Spinner size="xl" />
        </Center>
      }

      {data?.getReport &&
        <>
          <Card>
            <Heading>Reporter</Heading>
            <BasicUser user={data.getReport.reporter} />
          </Card>
          <Card>
            <Heading>Reported</Heading>
            <BasicUser user={data.getReport.reported} />
          </Card>
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
            {data.getReport.handled ?
              <>
                <Heading>Status</Heading>
                <Flex align="center">
                <Indicator color='green' />
                <Text mr={2}>Handled by</Text>
                <BasicUser user={data.getReport.handledBy}/>
                </Flex>
              </>
              :
              <>
                <Heading>Status</Heading>
                <Indicator color='red' />
                <span>Not handled</span>
              </>
            }
          </Card>
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
                <Heading>Admin Notes</Heading>
                <Textarea name="notes" as={Field} placeholder="Type any important notes here related to this report" />
                <Heading>Handled</Heading>
                <Field type="checkbox" name="handled" />
                <br />
                <br />
                <Button
                  type="submit"
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Upading..." : "Update Report"}
                </Button>
              </Form>
            )}
          </Formik>
        </>
      }

      <DeleteDialog
        title="Report"
        isOpen={isOpen}
        onClose={onClose}
        doDelete={doDelete}
        deleteLoading={deleteLoading}
        cancelRef={cancelRef}
      />
    </Box>
  )
}

export default ReportPage;
