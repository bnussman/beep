import React from 'react';
import Alert from '@mui/material/Alert';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

interface Props extends TableCellProps {
  /**
   * The message to show for this empty state
   * @default "No results"
   */
  message?: string;
}

export function TableEmpty({ message, ...props }: Props) {
  return (
    <TableRow>
      <TableCell {...props} sx={{ p: 0 }}>
        <Alert severity="info" sx={{ py: 10, justifyContent: "center"}}>
          {message ?? "No results"}
        </Alert>
      </TableCell>
    </TableRow>
  );
}
