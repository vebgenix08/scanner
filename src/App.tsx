import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./layout/AppShell";
import LoginPage from "./pages/login";
import ScannerPage from "./pages/scanner";
import DashboardPage from "./pages/dashboard";
import ScansPage from "./pages/scans";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/scanner" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/scanner" element={<ScannerPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/scans" element={<ScansPage />} />
      </Route>
    </Routes>
  );
}
