'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  palette: {
    mode: 'dark',
    primary: {
        main: '#ffcc4d'
    },
  },
  unstable_strictMode: true,
});
