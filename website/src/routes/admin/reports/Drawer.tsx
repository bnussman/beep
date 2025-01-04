import React from 'react';
import { Heading, Text, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, useDisclosure, Textarea, Box, Checkbox, Stack, HStack } from '@chakra-ui/react';
import { DeleteIcon, ExternalLinkIcon} from '@chakra-ui/icons';
import { Error } from '../../../components/Error';
import { BasicUser } from '../../../components/BasicUser';
import { Indicator } from '../../../components/Indicator';
import { DeleteReportDialog } from './DeleteReportDialog';
import { Link } from '@tanstack/react-router';
import { RouterOutput, trpc } from '../../../utils/trpc';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  report: RouterOutput['report']['reports']['reports'][number] | undefined;
}

export function ReportDrawer(props: Props) {
  const { isOpen, onClose, report } = props;
  const utils = trpc.useUtils();

  const {
    mutateAsync: updateReport,
    isPending,
    error: updateError
  } = trpc.report.updateReport.useMutation({
    onSuccess() {
      utils.report.invalidate();
    }
  });

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const values = {
    notes: report?.notes,
    handled: report?.handled
  };

  const form = useForm({
    defaultValues: values,
    values,
  });

  const handleClose = () => {
    form.reset();
    onClose();
  }

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
      onClose={handleClose}
      size="md"
    >
      <DrawerOverlay />
      <form onSubmit={onSubmit}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Report</DrawerHeader>
          <DrawerBody>
            {updateError && <Error>{updateError.message}</Error>}
            <Stack spacing={2}>
              <Heading size="md">Reporter</Heading>
              {report && <BasicUser user={report?.reporter} />}
              <Heading size="md">Reported</Heading>
              {report && <BasicUser user={report?.reported} />}
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
            <Button isLoading={isPending} colorScheme="blue" type="submit" isDisabled={!form.formState.isDirty}>
              Update
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
      <DeleteReportDialog
        id={report?.id ?? ''}
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
        onSuccess={handleClose}
      />
    </Drawer>
  )
}
