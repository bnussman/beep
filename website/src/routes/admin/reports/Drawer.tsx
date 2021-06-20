import React, { useState, useEffect } from 'react';
import { Heading, Text, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Spinner, useDisclosure, Flex, Textarea, Box, Checkbox } from '@chakra-ui/react';
import {DeleteReport, GetReport, UpdateReport} from './Report';
import {useQuery, useMutation} from '@apollo/client';
import {DeleteReportMutation, GetReportQuery, UpdateReportMutation} from '../../../generated/graphql';
import {DeleteIcon} from '@chakra-ui/icons';
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
    btnRef: any;
    id: string | null;
}

function ReportDrawer(props: Props) {

    if (!props.id) return null;
    const { isOpen, onOpen, onClose, btnRef, id } = props;
    const { data, loading, error, refetch } = useQuery<GetReportQuery>(GetReport, { variables: { id } });
    const [update, { loading: updateLoading, error: updateError }] = useMutation<UpdateReportMutation>(UpdateReport);
    const [deleteReport, { loading: deleteLoading }] = useMutation<DeleteReportMutation>(DeleteReport);

    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const deleteRef = React.useRef();

    const [notes, setNotes] = useState();
    const [isHandled, setIsHandled] = useState();

    console.log(isHandled);

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
            refetchQueries: () => ['getReports', 'getReport']
        });
        if (result) {
            refetch();
        }
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
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Report</DrawerHeader>

          <DrawerBody>
            {error && <Error error={error.message} />}
            {loading &&
                <Center h="100px">
                    <Spinner size="xl" />
                </Center>
            }

            {data?.getReport &&
                <Box>
                    <Heading>Reporter</Heading>
                    <BasicUser user={data.getReport.reporter} />
                    <Heading>Reported</Heading>
                    <BasicUser user={data.getReport.reported} />
                    <Heading>Reason</Heading>
                    <Text>{data.getReport.reason}</Text>
                    <Heading>Created</Heading>
                    <Text>{dayjs().to(data.getReport.timestamp)}</Text>
                    {data.getReport.beep &&
                        <Box>
                            <Heading>Associated Beep Event</Heading>
                            <NavLink to={`/admin/beeps/${data.getReport.beep.id}`}>
                                {data.getReport.beep.id}
                            </NavLink>
                        </Box>
                    }
                    {data.getReport.handled && data.getReport.handledBy ?
                        <Box>
                            <Heading>Status</Heading>
                            <Flex align="center">
                                <Indicator color='green' />
                                <Text mr={2}>Handled by</Text>
                                <BasicUser user={data.getReport.handledBy}/>
                            </Flex>
                        </Box>
                        :
                        <Box>
                            <Heading>Status</Heading>
                            <Indicator color='red' />
                            <span>Not handled</span>
                        </Box>
                    }
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
