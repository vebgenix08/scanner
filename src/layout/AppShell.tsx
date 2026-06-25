import {
  AppBar,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import HistoryIcon from "@mui/icons-material/History";
import LoginIcon from "@mui/icons-material/Login";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const navigation = [
  { label: "Scanner", path: "/scanner", icon: <QrCodeScannerIcon /> },
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Scans", path: "/scans", icon: <HistoryIcon /> },
  { label: "Login", path: "/login", icon: <LoginIcon /> },
];

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = Math.max(
    0,
    navigation.findIndex((item) => location.pathname.startsWith(item.path)),
  );

  return (
    <Box sx={{ minHeight: "100vh", pb: 9 }}>
      <AppBar position="sticky" elevation={0} sx={{ backdropFilter: "blur(18px)" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <Typography variant="subtitle2" color="rgba(255,255,255,0.7)">
              Event Security
            </Typography>
            <Typography variant="h6" fontWeight={900}>
              Scanner Admin
            </Typography>
          </Box>
          <Typography variant="caption" color="rgba(255,255,255,0.6)">
            Mobile first
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Outlet />
      </Container>

      <Paper
        elevation={10}
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "24px 24px 0 0",
          overflow: "hidden",
        }}
      >
        <BottomNavigation
          value={currentIndex}
          onChange={(_, newValue) => navigate(navigation[newValue].path)}
          showLabels
        >
          {navigation.map((item) => (
            <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
