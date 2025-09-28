import { createTheme } from "@mui/material/styles";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#000",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#fff",
        },
      },
    },
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
    MuiPopover: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        paper: ({ theme }) => ({
          border: `1px solid ${theme.palette.Skeleton.bg}`,
        }),
      },
    },
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
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
        expandIcon: <ExpandMoreIcon />,
      },
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        color: "inherit",
        underline: "none",
      },
      styleOverrides: {
        root: {
          color: "inherit",
        },
      },
    },
  },
});
