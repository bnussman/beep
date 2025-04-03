import React from "react";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Indicator } from '../../../components/Indicator';
import { Box, Button, Checkbox, Flex, Heading, Spacer, Stack, Text, Textarea } from '@chakra-ui/react';
import { DeleteIcon } from "@chakra-ui/icons";
import { Error } from '../../../components/Error';
import { BasicUser } from "../../../components/BasicUser";
import { Loading } from "../../../components/Loading";
import { DeleteReportDialog } from "./DeleteReportDialog";
import { Link, createRoute } from "@tanstack/react-router";
import { reportsRoute } from ".";
import { trpc } from "../../../utils/trpc";
import { useForm } from "react-hook-form";

dayjs.extend(relativeTime);

export const reportRoute = createRoute({
  component: Report,
  path: "$reportId",
  getParentRoute: () => reportsRoute,
});

export function Report() {
  const { reportId } = reportRoute.useParams();

  const {
    data: report,
    isLoading,
    error
  } = trpc.report.report.useQuery(reportId);

  const {
    mutateAsync: updateReport,
    isPending,
    error: updateError
  } = trpc.report.updateReport.useMutation();

  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  const values = {
    notes: report?.notes,
    handled: report?.handled
  };

  const form = useForm({
    defaultValues: values,
    values,
  });

  const onSubmit = form.handleSubmit((values) => {
    updateReport({
      reportId,
      data: values,
    });
  });

  if (isLoading || !report) {
    return <Loading />;
  }

  if (error) {
    return <Error>{error.message}</Error>;
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
      <Stack spacing={6}>
        <Box>
          <Heading size="lg">Reporter</Heading>
          <BasicUser user={report.reporter} />
        </Box>
        <Box>
          <Heading size="lg">Reported</Heading>
          <BasicUser user={report.reported} />
        </Box>
        <Box>
          <Heading size="lg">Reason</Heading>
          <Text>{report.reason}</Text>
        </Box>
        <Box>
          <Heading size="lg">Created</Heading>
          <Text>{dayjs().to(report.timestamp)}</Text>
        </Box>
        {report.beep_id && (
          <Box>
            <Heading size="lg">Beep</Heading>
            <Link to="/admin/beeps/$beepId" params={{ beepId: report.beep_id }}>
              {report.beep_id}
            </Link>
          </Box>
        )}
        <Box>
          <Heading size="lg">Status</Heading>
          {report.handled && report.handledBy ? (
            <Box>
              <Flex align="center">
                <Indicator color='green' />
                <Text mr={2}>Handled by</Text>
                <BasicUser user={report.handledBy} />
              </Flex>
            </Box>
          ) : (
            <Box>
              <Indicator color='red' />
              <span>Not handled</span>
            </Box>
          )}
        </Box>
      </Stack>
        <Stack spacing={2} mt={8}>
            <Heading size="lg">Admin Notes</Heading>
            {updateError && <Error>{updateError.message}</Error>}
            <Textarea
                {...form.register('notes')}
            />
            <Checkbox
                {...form.register('handled')}
            >
                Handled
            </Checkbox>
        </Stack>
        <Button
            type="submit"
            isLoading={isPending}
            mt={2}
        >
            Update Report
        </Button>
      <DeleteReportDialog
        id={reportId}
        onClose={onClose}
        isOpen={isOpen}
      />
    </Box>
  )
}
