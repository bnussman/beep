import React from 'react';
import Alert from '@mui/material/Alert';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

interface Props extends TableCellProps {
  error: string;
}

export function TableError({ error, ...props }: Props) {
  return (
    <TableRow>
      <TableCell {...props} sx={{ p: 0 }}>
        <Alert severity="error" sx={{ py: 10, justifyContent: "center"}}>
          {error}
        </Alert>
      </TableCell>
    </TableRow>
  );
}
