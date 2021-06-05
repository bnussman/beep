import React from 'react'
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Card } from './Card';
import { Indicator } from './Indicator';
import { QueueEntry } from '../generated/graphql';
import TdUser from './TdUser';
import { Center, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

dayjs.extend(duration);

interface Props {
  queue: QueueEntry[];
}

function QueueTable(props: Props) {
  const { queue } = props;

  function getStatus(value: number): string {
    switch (value) {
      case 0:
        return "Waiting...";
      case 1:
        return "Beeper is on the way";
      case 2:
        return "Beeper is here";
      case 3:
        return "Getting Beeped";
      default:
        return "yikes";
    }
  }

  if (!queue || queue.length === 0) {
    return (
      <Center h="100px">
        This user's queue is empty.
      </Center>
    );
  }

  return (
    <Card>
      <Table>
        <Thead>
          <Tr>
            <Th>Rider</Th>
            <Th>Origin</Th>
            <Th>Destination</Th>
            <Th>Group Size</Th>
            <Th>Start Time</Th>
            <Th>Is Accepted?</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {queue && queue.map(entry => {
            return (
              <Tr key={entry.id}>
                <TdUser user={entry.rider} />
                <Td>{entry.origin}</Td>
                <Td>{entry.destination}</Td>
                <Td>{entry.groupSize}</Td>
                <Td>{dayjs().to(entry.start)}</Td>
                <Td>{entry.isAccepted ? <Indicator color='green' /> : <Indicator color='red' />}</Td>
                <Td>{getStatus(entry.state)}</Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Card>
  );
}

export default QueueTable;
