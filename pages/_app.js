import "../styles/fonts.css";
import "../styles/globals.css";

import { Toaster } from "react-hot-toast";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { Container } from "@mui/material";
import theme from "../src/theme";
import { ThemeProvider } from "@mui/material/styles";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";

/** Wierd stuff to make MUI play nice with nextJS*/
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../src/createEmotionCache";
import PropTypes from "prop-types";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const userData = useUserData();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <UserContext.Provider value={userData}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Navbar />
          <Toaster />
          <Container sx={{ py: 5 }}>
            <Component {...pageProps} />
          </Container>
        </ThemeProvider>
      </UserContext.Provider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
