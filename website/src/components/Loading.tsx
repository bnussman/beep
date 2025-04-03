import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export function Loading() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100px">
      <CircularProgress size="xl" />
    </Box>
  );
}
