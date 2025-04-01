import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React from 'react';

interface Props extends TableCellProps {
  error: string;
}

export function TableError({ error, ...props }: Props) {
  return (
    <TableRow>
      <TableCell {...props} sx={{ textAlign: 'center', p: 0 }}>
        <Alert severity="error">{error}</Alert>
      </TableCell>
    </TableRow>
  );
}
