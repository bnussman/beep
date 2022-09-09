import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NavLink, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Indicator } from '../../../components/Indicator';
import { gql, useMutation, useQuery } from '@apollo/client';
import { DeleteReportMutation, GetReportQuery, UpdateReportMutation, User } from '../../../generated/graphql';
import { Box, Button, Checkbox, Flex, Heading, Spacer, Stack, Text, Textarea } from '@chakra-ui/react';
import { DeleteIcon } from "@chakra-ui/icons";
import { DeleteDialog } from "../../../components/DeleteDialog";
import { Error } from '../../../components/Error';
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";

dayjs.extend(relativeTime);

export const DeleteReport = gql`
  mutation DeleteReport($id: String!) {
    deleteReport(id: $id)
  }
`;

export const UpdateReport = gql`
  mutation UpdateReport($id: String!, $notes: String, $handled: Boolean) {
    updateReport(id: $id,
      input: {
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
        photo
        username
      }
      reported {
        id
        name
        photo
        username
      }
      handledBy {
        id
        name
        photo
        username
      }
    }
  }
`;

export function Report() {
  const { id } = useParams();
  const { data, loading, error, refetch } = useQuery<GetReportQuery>(GetReport, { variables: { id } });
  const [update, { loading: updateLoading, error: updateError }] = useMutation<UpdateReportMutation>(UpdateReport);
  const [deleteReport, { loading: deleteLoading }] = useMutation<DeleteReportMutation>(DeleteReport);
  const navigate = useNavigate();

  const [notes, setNotes] = useState<string>();
  const [isHandled, setIsHandled] = useState<boolean>();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  async function updateReport() {
    const result = await update({
      variables: {
        id,
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
    if (data?.getReport.notes) {
      setNotes(data?.getReport.notes)
    }
  }, [data?.getReport]);

  async function doDelete() {
    await deleteReport({
      variables: { id },
      refetchQueries: () => ['getReports']
    });

    navigate(-1);
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
          <Stack spacing={6}>
            <Box>
              <Heading size="lg">Reporter</Heading>
              <BasicUser user={data?.getReport.reporter} />
            </Box>
            <Box>
              <Heading size="lg">Reported</Heading>
              <BasicUser user={data?.getReport.reported} />
            </Box>
            <Box>
              <Heading size="lg">Reason</Heading>
              <Text>{data?.getReport.reason}</Text>
            </Box>
            <Box>
              <Heading size="lg">Created</Heading>
              <Text>{dayjs().to(data?.getReport.timestamp)}</Text>
            </Box>
            {data?.getReport.beep &&
              <Box>
                <Heading size="lg">Beep</Heading>
                <NavLink to={`/admin/beeps/${data?.getReport.beep.id}`}>
                  {data?.getReport.beep.id}
                </NavLink>
              </Box>
            }
            <Box>
              <Heading size="lg">Status</Heading>
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
            <Stack spacing={2} mt={8}>
                <Heading size="lg">Admin Notes</Heading>
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
            </Stack>
            <Button
                type="submit"
                isLoading={updateLoading}
                onClick={() => updateReport()}
                mt={2}
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