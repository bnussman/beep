import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Indicator } from '../../../components/Indicator';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Button, Checkbox, Flex, Heading, Spacer, Stack, Text, Textarea } from '@chakra-ui/react';
import { DeleteIcon } from "@chakra-ui/icons";
import { Error } from '../../../components/Error';
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";
import { DeleteReportDialog } from "./DeleteReportDialog";
import { Link, createRoute } from "@tanstack/react-router";
import { reportsRoute } from ".";
import { graphql } from 'gql.tada';
import { User } from "../../../App";

dayjs.extend(relativeTime);


export const UpdateReport = graphql(`
  mutation UpdateReport($id: String!, $notes: String, $handled: Boolean) {
    updateReport(id: $id, input: { notes: $notes, handled: $handled }) {
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
`);

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

export const reportRoute = createRoute({
  component: Report,
  path: "$reportId",
  getParentRoute: () => reportsRoute,
});

export function Report() {
  const { reportId: id } = reportRoute.useParams();

  const { data, loading, error } = useQuery(GetReport, { variables: { id } });
  const [update, { loading: updateLoading, error: updateError }] = useMutation(UpdateReport);

  const [notes, setNotes] = useState<string>();
  const [isHandled, setIsHandled] = useState<boolean>();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  function updateReport() {
    update({
      variables: {
        id,
        handled: isHandled,
        notes
      },
    });
  }

  useEffect(() => {
    setIsHandled(data?.getReport.handled);
    if (data?.getReport.notes) {
      setNotes(data?.getReport.notes)
    }
  }, [data?.getReport]);

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
                <Link to="/admin/beeps/$beepId" params={{ beepId: data.getReport.beep.id }}>
                  {data?.getReport.beep.id}
                </Link>
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
          <DeleteReportDialog
            id={data.getReport.id}
            onClose={onClose}
            isOpen={isOpen}
          />
        </React.Fragment>
      : null}
    </Box>
  )
}
