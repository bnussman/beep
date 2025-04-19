import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
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
  },
});
