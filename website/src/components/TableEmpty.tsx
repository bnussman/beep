import { Table, TableCellProps } from '@heroui/react';
import React from 'react';

interface Props extends TableCellProps {
  /**
   * The message to show for this empty state
   * @default "No results"
   */
  message?: string;
}

export function TableEmpty({ message, ...props }: Props) {
  return (
    <Table.Row>
      <Table.Cell className="py-10 text-center" {...props}>
        {message ?? "No results"}
      </Table.Cell>
    </Table.Row>
  )
}
