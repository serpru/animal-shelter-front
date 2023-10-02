import { colors, createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FF9F1C",
    },
    secondary: {
      main: "#1B2845",
    },
    background: {
      paper: "#e3f6ff",
      default: "#274060",
    },
    divider: "#1B2845",
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});
