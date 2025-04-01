import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React from 'react';

export function TableLoading(props: TableCellProps) {
  return (
    <TableRow>
      <TableCell {...props}>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="500px">
          <CircularProgress />
        </Box>
      </TableCell>
    </TableRow>
  );
}
