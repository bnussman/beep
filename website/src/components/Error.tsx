import Alert from '@mui/material/Alert';
import React from 'react';

interface Props {
  children?: JSX.Element | string;
}

export function Error({ children }: Props) {
  return (
    <Alert severity="error">{children}</Alert>
  );
}
