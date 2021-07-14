import { NavLink, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Indicator } from '../../../components/Indicator';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DeleteReportMutation, GetReportQuery, UpdateReportMutation, User } from '../../../generated/graphql';
import { Box, Button, Center, Checkbox, Flex, Heading, Spacer, Spinner, Stack, Text, Textarea } from '@chakra-ui/react';
import React, { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import DeleteDialog from "../../../components/DeleteDialog";
import { Error } from '../../../components/Error';
import BasicUser from "../../../components/BasicUser";
import Loading from "../../../components/Loading";

dayjs.extend(relativeTime);

export const DeleteReport = gql`
    mutation DeleteReport($id: String!) {
        deleteReport(id: $id)
    }
`;

export const UpdateReport = gql`
    mutation UpdateReport($id: String!, $notes: String, $handled: Boolean) {
        updateReport(id: $id, input: {
            notes: $notes,
            handled: $handled
        }) {
            id
        }
    }
`;

export const GetReport = gql`
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
  const [update, { loading: updateLoading, error: updateError }] = useMutation<UpdateReportMutation>(UpdateReport);
  const [deleteReport, { loading: deleteLoading }] = useMutation<DeleteReportMutation>(DeleteReport);
  const history = useHistory();

  const [notes, setNotes] = useState<string>();
  const [isHandled, setIsHandled] = useState<boolean>();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  async function updateReport() {
    const result = await update({
      variables: {
        id: reportId,
        handled: isHandled,
        notes
      },
      refetchQueries: () => ['getReports'],
      awaitRefetchQueries: true
    });
    if (result) {
      await refetch();
    }
    onClose();
  }

  useEffect(() => {
    setIsHandled(data?.getReport.handled);
    setNotes(data?.getReport.notes)
  }, [data?.getReport]);

  async function doDelete() {
    await deleteReport({
      variables: { id: reportId },
      refetchQueries: () => ['getReports']
    });
    history.goBack();
  }

  return (
    <Box>
      <Flex align='center' mb={2}>
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

      {error && <Error error={error} />}
      {loading && <Loading />}

      {data?.getReport ?
        <React.Fragment>
          <Stack spacing={4}>
            <Box>
              <Heading size="md">Reporter</Heading>
              <BasicUser user={data?.getReport.reporter} />
            </Box>
            <Box>
              <Heading size="md">Reported</Heading>
              <BasicUser user={data?.getReport.reported} />
            </Box>
            <Box>
              <Heading size="md">Reason</Heading>
              <Text>{data?.getReport.reason}</Text>
            </Box>
            <Box>
              <Heading size="md">Created</Heading>
              <Text>{dayjs().to(data?.getReport.timestamp)}</Text>
            </Box>
            {data?.getReport.beep &&
              <Box>
                <Heading size="md">Associated Beep Event</Heading>
                <NavLink to={`/admin/beeps/${data?.getReport.beep.id}`}>
                  {data?.getReport.beep.id}
                </NavLink>
              </Box>
            }
            <Box>
              <Heading size="md">Status</Heading>
              {data?.getReport.handled ?
                <Box>
                  <Flex align="center">
                    <Indicator color='green' />
                    <Text mr={2}>Handled by</Text>
                    <BasicUser user={data?.getReport.handledBy as User} />
                  </Flex>
                </Box>
                :
                <Box>
                  <Indicator color='red' />
                  <span>Not handled</span>
                </Box>
              }
            </Box>
          </Stack>
          <Heading size="lg">Update Report Info</Heading>
          {updateError && <Error error={updateError} />}
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Checkbox
            isChecked={isHandled}
            onChange={(e) => setIsHandled(e.target.checked)}
          >
            Handled
          </Checkbox>
          <br />
          <Button
            type="submit"
            isLoading={updateLoading}
            onClick={() => updateReport()}
          >
            Update Report
          </Button>
          <DeleteDialog
            title="Report"
            isOpen={isOpen}
            onClose={onClose}
            doDelete={doDelete}
            deleteLoading={deleteLoading}
            cancelRef={cancelRef}
          />
        </React.Fragment>
      : null}
    </Box>
  )
}

export default ReportPage;
