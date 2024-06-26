import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#202020",
    },
    secondary: {
      main: "#fff",
    },

    typography: {
      fontWeightLight: 400,
      fontWeightRegular: 500,
      fontWeightMedium: 600,
    },
  },
  breakpoints: {
    values: {
      xs: 300,
    },
  },
});

export default theme;
