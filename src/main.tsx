import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { darkTheme } from "./theme";
import { registerServiceWorker } from "./pwa/registerSW";
import { apolloClient } from "./lib/apolloClient";

registerServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/sunstorm-scanner">
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
