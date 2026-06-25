import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 128px)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 520 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="overline" color="primary.main" fontWeight={900}>
                Security Access
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                Admin Login
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Fast sign-in for event security staff.
              </Typography>
            </Box>

            <TextField
              label="Staff name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
              size="medium"
            />
            <TextField
              label="PIN"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              fullWidth
              type="password"
            />
            <Button
              size="large"
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={() => navigate("/scanner")}
              disabled={!name.trim() || !pin.trim()}
              sx={{ minHeight: 56, fontWeight: 900 }}
            >
              Enter Scanner
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
