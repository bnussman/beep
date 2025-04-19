import { createTheme } from "@mui/material/styles";
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: true,
    dark: true,
  },
  typography: {
    fontFamily: "Poppins",
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { border: 0 },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: "bold",
        },
      },
    },
    MuiAccordionSummary: {
      defaultProps: {
        expandIcon: <ExpandMoreIcon />
      },
      styleOverrides: {
        root: {
          fontWeight: 'bold',
        },
      },
    },
    MuiLink: {
      defaultProps: {
        color: "inherit",
        underline: 'none',
      },
      styleOverrides: {
        root: {
          color: 'inherit'
        },
      },
    },
  },
});
