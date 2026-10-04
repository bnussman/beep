import { Spinner, Table, TableCellProps } from '@heroui/react';
import React from 'react';

export function TableLoading(props: TableCellProps) {
  return (
    <Table.Row>
      <Table.Cell className="py-10 text-center" {...props}>
        <Spinner />
      </Table.Cell>
    </Table.Row>
  );
}
