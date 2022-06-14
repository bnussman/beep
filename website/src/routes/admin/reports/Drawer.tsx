import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Heading, Text, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Spinner, useDisclosure, Flex, Textarea, Box, Checkbox, Stack } from '@chakra-ui/react';
import { DeleteReport, GetReport, UpdateReport } from './Report';
import { useQuery, useMutation } from '@apollo/client';
import { DeleteReportMutation, GetReportQuery, UpdateReportMutation } from '../../../generated/graphql';
import { DeleteIcon, ExternalLinkIcon} from '@chakra-ui/icons';
import { DeleteDialog } from '../../../components/DeleteDialog';
import { Error } from '../../../components/Error';
import { BasicUser } from '../../../components/BasicUser';
import { Indicator } from '../../../components/Indicator';
import { NavLink } from 'react-router-dom';
import { Loading } from '../../../components/Loading';

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  id: string | null;
}

export function ReportDrawer(props: Props) {
  if (!props.id) return null;

  const { isOpen, onClose, id } = props;
  const { data, loading, error, refetch } = useQuery<GetReportQuery>(GetReport, { variables: { id } });
  const [update, { loading: updateLoading, error: updateError }] = useMutation<UpdateReportMutation>(UpdateReport);
  const [deleteReport, { loading: deleteLoading, error: deleteError }] = useMutation<DeleteReportMutation>(DeleteReport);

  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const deleteRef = React.useRef();

  const [notes, setNotes] = useState<string | undefined>();
  const [isHandled, setIsHandled] = useState<boolean | undefined>();

  async function doDelete() {
    await deleteReport({
      variables: { id },
      refetchQueries: () => ['getReports']
    });
    onClose();
  }

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

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Report</DrawerHeader>
        <DrawerBody>
          {error && <Error error={error} />}
          {updateError && <Error error={updateError} />}
          {deleteError && <Error error={deleteError} />}
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
                  <NavLink to={`/admin/beeps/${data.getReport.beep.id}`}>
                    {data.getReport.beep.id}
                  </NavLink>
                </Box>
              }
              <Box>
                <Heading size="md">Status</Heading>
                {data.getReport.handled && data.getReport.handledBy ?
                  <Flex align="center">
                    <Indicator color='green' />
                    <Text noOfLines={1} mr={2}>Handled by</Text>
                    <BasicUser user={data.getReport.handledBy} />
                  </Flex>
                  :
                  <Box>
                    <Indicator color='red' />
                    <span>Not handled</span>
                  </Box>
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
            <NavLink to={`/admin/reports/${data?.getReport.id}`}>
              <ExternalLinkIcon />
            </NavLink>
          </Box>
          <Button
            colorScheme="red"
            leftIcon={<DeleteIcon />}
            onClick={onDeleteOpen}
            mr={2}
            isLoading={deleteLoading}
          >
            Delete
          </Button>
          <Button isLoading={updateLoading} colorScheme="blue" onClick={() => updateReport()}>Update</Button>
        </DrawerFooter>
      </DrawerContent>
      <DeleteDialog
        title="Report"
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        doDelete={doDelete}
        deleteLoading={deleteLoading}
        cancelRef={deleteRef}
      />
    </Drawer>
  )
}