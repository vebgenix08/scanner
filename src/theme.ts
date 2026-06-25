import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0b0f14",
      paper: "#111720",
    },
    primary: {
      main: "#7dd3fc",
    },
    success: {
      main: "#22c55e",
    },
    error: {
      main: "#ef4444",
    },
    warning: {
      main: "#f59e0b",
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily:
      '"Segoe UI", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 800,
    },
    h5: {
      fontWeight: 800,
    },
    button: {
      textTransform: "none",
      fontWeight: 800,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
          border: "1px solid rgba(148,163,184,0.12)",
        },
      },
    },
  },
});
