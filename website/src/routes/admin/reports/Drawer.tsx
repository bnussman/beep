import React, { useState, useEffect } from 'react';
import { Heading, Text, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Spinner, useDisclosure, Flex, Textarea, Box, Checkbox } from '@chakra-ui/react';
import {DeleteReport, GetReport, UpdateReport} from './Report';
import {useQuery, useMutation} from '@apollo/client';
import {DeleteReportMutation, GetReportQuery, UpdateReportMutation} from '../../../generated/graphql';
import {DeleteIcon, ExternalLinkIcon} from '@chakra-ui/icons';
import DeleteDialog from '../../../components/DeleteDialog';
import { Error } from '../../../components/Error';
import dayjs from 'dayjs';
import BasicUser from '../../../components/BasicUser';
import {Indicator} from '../../../components/Indicator';
import {NavLink} from 'react-router-dom';

interface Props {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    id: string | null;
}

function ReportDrawer(props: Props) {
    if (!props.id) return null;

    const { isOpen, onClose, id } = props;
    const { data, loading, error, refetch } = useQuery<GetReportQuery>(GetReport, { variables: { id } });
    const [update, { loading: updateLoading, error: updateError }] = useMutation<UpdateReportMutation>(UpdateReport);
    const [deleteReport, { loading: deleteLoading, error: deleteError }] = useMutation<DeleteReportMutation>(DeleteReport);

    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const deleteRef = React.useRef();

    const [notes, setNotes] = useState();
    const [isHandled, setIsHandled] = useState();

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
        setNotes(data?.getReport.notes)
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
            {error && <Error error={error.message} />}
            {updateError && <Error error={updateError.message} />}
            {deleteError && <Error error={deleteError.message} />}
            {loading &&
                <Center h="100px">
                    <Spinner size="xl" />
                </Center>
            }

            {data?.getReport &&
                <Box>
                    <Heading size="md" mb={2}>Reporter</Heading>
                    <BasicUser user={data.getReport.reporter} />
                    <Heading size="md" mt={2} mb={2}>Reported</Heading>
                    <BasicUser user={data.getReport.reported} />
                    <Heading size="md" mt={2} mb={2}>Reason</Heading>
                    <Text>{data.getReport.reason}</Text>
                    <Heading size="md" mt={2} mb={2}>Created</Heading>
                    <Text>{dayjs().to(data.getReport.timestamp)}</Text>
                    {data.getReport.beep &&
                        <Box>
                            <Heading size="md"  mt={2} mb={2}>Associated Beep</Heading>
                            <NavLink to={`/admin/beeps/${data.getReport.beep.id}`}>
                                {data.getReport.beep.id}
                            </NavLink>
                        </Box>
                    }
                    <Box mt={2} mb={2}>
                        <Heading size="md" mt={2} mb={2}>Status</Heading>
                        {data.getReport.handled && data.getReport.handledBy ?
                            <Flex align="center">
                                <Indicator color='green' />
                                <Text isTruncated mr={2}>Handled by</Text>
                                <BasicUser user={data.getReport.handledBy}/>
                            </Flex>
                            :
                            <>
                                <Indicator color='red' />
                                <span>Not handled</span>
                            </>
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
              </Box>
              }
          </DrawerBody>

          <DrawerFooter>
              <Box mr={2}>
                  <NavLink to={`/admin/reports/${data?.getReport.id}`}>
                      <ExternalLinkIcon />
                  </NavLink>
              </Box>
              <Button
                  colorScheme="red"
                  leftIcon={<DeleteIcon />}
                  onClick={onDeleteOpen}
                  mr={3}
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

export default ReportDrawer;
