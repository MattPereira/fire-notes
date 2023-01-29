import { Roboto } from "@next/font/google";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(250,17,79)",
    },
    secondary: {
      main: "rgb(3, 13, 45)",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontFamily: "Cubano",
      marginBottom: "2rem",
      fontSize: "4rem",
      textAlign: "center",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "cubano",
          fontSize: "1.15rem",
          borderRadius: "7px",
        },
      },
    },
  },
});

export default theme;
