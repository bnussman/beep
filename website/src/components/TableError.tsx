import { Alert, Table, TableCellProps } from '@heroui/react';
import React from 'react';

interface Props extends TableCellProps {
  error: string;
}

export function TableError({ error, ...props }: Props) {
  return (
    <Table.Row id="error">
      <Table.Cell {...props}>
        <Alert status="danger" role="alert">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{error}</Alert.Title>
          </Alert.Content>
        </Alert>
      </Table.Cell>
    </Table.Row>
  );
}
