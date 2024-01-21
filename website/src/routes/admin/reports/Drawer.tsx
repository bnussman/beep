import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Heading, Text, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, useDisclosure, Textarea, Box, Checkbox, Stack, HStack } from '@chakra-ui/react';
import { GetReport, UpdateReport } from './Report';
import { useQuery, useMutation } from '@apollo/client';
import { DeleteIcon, ExternalLinkIcon} from '@chakra-ui/icons';
import { Error } from '../../../components/Error';
import { BasicUser } from '../../../components/BasicUser';
import { Indicator } from '../../../components/Indicator';
import { Loading } from '../../../components/Loading';
import { DeleteReportDialog } from './DeleteReportDialog';
import { Link } from '@tanstack/react-router';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  id: string | null;
}

export function ReportDrawer(props: Props) {
  const { isOpen, onClose, id } = props;
  const { data, loading, error } = useQuery(GetReport, { variables: { id }, skip: !id });
  const [update, { loading: updateLoading, error: updateError }] = useMutation(UpdateReport);

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [notes, setNotes] = useState<string | undefined>();
  const [isHandled, setIsHandled] = useState<boolean | undefined>();

  function updateReport() {
    update({
      variables: {
        id: id ?? "",
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
          {error && <Error error={error} />}
          {updateError && <Error error={updateError} />}
          {loading && <Loading />}
          {data?.getReport &&
            <Stack spacing={2}>
              <Heading size="md">Reporter</Heading>
              <BasicUser user={data.getReport.reporter} />
              <Heading size="md">Reported</Heading>
              <BasicUser user={data.getReport.reported} />
              <Heading size="md">Reason</Heading>
              <Text>{data.getReport.reason}</Text>
              <Heading size="md">Created</Heading>
              <Text>{dayjs().to(data.getReport.timestamp)}</Text>
              {data.getReport.beep &&
                <Box>
                  <Heading size="md">Associated Beep</Heading>
                  <Link to="/admin/beeps/$beepId" params={{ beepId: data.getReport.beep.id }}>
                    {data.getReport.beep.id}
                  </Link>
                </Box>
              }
              <Box>
                <Heading size="md">Status</Heading>
                {data.getReport.handled && data.getReport.handledBy ?
                  <HStack alignItems="center">
                    <Indicator color='green' />
                    <Text noOfLines={1} mr={2}>Handled by</Text>
                    <BasicUser user={data.getReport.handledBy} />
                  </HStack>
                  :
                  <HStack>
                    <Indicator color='red' />
                    <span>Not handled</span>
                  </HStack>
                }
              </Box>
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
          }
        </DrawerBody>
        <DrawerFooter>
          <Box mr={4}>
            {data && (
              <Link to="/admin/reports/$reportId" params={{ reportId: data.getReport.id }}>
                <ExternalLinkIcon />
              </Link>
            )}
          </Box>
          <Button
            colorScheme="red"
            leftIcon={<DeleteIcon />}
            onClick={onDeleteOpen}
            mr={2}
          >
            Delete
          </Button>
          <Button isLoading={updateLoading} colorScheme="blue" onClick={() => updateReport()}>Update</Button>
        </DrawerFooter>
      </DrawerContent>
      <DeleteReportDialog
        id={data?.getReport.id ?? ""}
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
      />
    </Drawer>
  )
}
