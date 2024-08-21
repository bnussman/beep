import React, { useState, useEffect } from 'react';
import { Heading, Text, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, useDisclosure, Textarea, Box, Checkbox, Stack, HStack } from '@chakra-ui/react';
import { DeleteIcon, ExternalLinkIcon} from '@chakra-ui/icons';
import { Error } from '../../../components/Error';
import { BasicUser } from '../../../components/BasicUser';
import { Indicator } from '../../../components/Indicator';
import { Loading } from '../../../components/Loading';
import { DeleteReportDialog } from './DeleteReportDialog';
import { Link } from '@tanstack/react-router';
import dayjs from 'dayjs';
import { RouterOutput, trpc } from '../../../utils/trpc';
import { useForm } from 'react-hook-form';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  report: RouterOutput['report']['reports']['reports'][number] | undefined;
}

export function ReportDrawer(props: Props) {
  const { isOpen, onClose, report } = props;

  const {
    mutateAsync: updateReport,
    isPending,
    error: updateError
  } = trpc.report.updateReport.useMutation();

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

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
      reportId: report?.id ?? '',
      data: values,
    });
  });

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="md"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Report</DrawerHeader>
        <DrawerBody>
          {updateError && <Error>{updateError.message}</Error>}
          <Stack spacing={2}>
            <Heading size="md">Reporter</Heading>
            <BasicUser user={report?.reporter} />
            <Heading size="md">Reported</Heading>
            <BasicUser user={report?.reported} />
            <Heading size="md">Reason</Heading>
            <Text>{report?.reason}</Text>
            <Heading size="md">Created</Heading>
            <Text>{dayjs().to(report?.timestamp)}</Text>
            {report?.beep_id && (
              <Box>
                <Heading size="md">Associated Beep</Heading>
                <Link to="/admin/beeps/$beepId" params={{ beepId: report?.beep_id }}>
                  {report?.beep_id}
                </Link>
              </Box>
            )}
            <Box>
              <Heading size="md">Status</Heading>
              {report?.handled && report?.handledBy ? (
                <HStack alignItems="center">
                  <Indicator color='green' />
                  <Text noOfLines={1} mr={2}>Handled by</Text>
                  <BasicUser user={report.handledBy} />
                </HStack>
                ) : (
                <HStack>
                  <Indicator color='red' />
                  <span>Not handled</span>
                </HStack>
              )}
            </Box>
            <Textarea
              {...form.register('notes')}
            />
            <Checkbox
              {...form.register('handled')}
            >
              Handled
            </Checkbox>
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <Box mr={4}>
            <Link to="/admin/reports/$reportId" params={{ reportId: report?.id ?? '' }}>
              <ExternalLinkIcon />
            </Link>
          </Box>
          <Button
            colorScheme="red"
            leftIcon={<DeleteIcon />}
            onClick={onDeleteOpen}
            mr={2}
          >
            Delete
          </Button>
          <Button isLoading={isPending} colorScheme="blue" type="submit">
            Update
          </Button>
        </DrawerFooter>
      </DrawerContent>
      <DeleteReportDialog
        id={report?.id ?? ''}
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
      />
    </Drawer>
  )
}
