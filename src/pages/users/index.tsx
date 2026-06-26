import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import PeopleIcon from "@mui/icons-material/People";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useEffect, useMemo, useState } from "react";
import { getBookings } from "../../services/appsync";
import type { Booking } from "../../types/graphql";

function formatMoney(value?: number | null) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function formatPhone(phone?: string | null) {
  if (!phone) return "N/A";
  // Strip any existing + prefix
  const cleaned = phone.replace(/^\+/, "");
  // If already has country code 91 and is 12 digits, just prefix +
  if (cleaned.startsWith("91") && cleaned.length === 12) return `+${cleaned}`;
  // Otherwise add +91 prefix
  return `+91${cleaned}`;
}

export default function UsersPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const confirmedBookings = useMemo(
    () => bookings.filter((b) => b.status === "CONFIRMED"),
    [bookings],
  );

  const filteredBookings = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return confirmedBookings;
    return confirmedBookings.filter(
      (b) =>
        (b.customerName || "").toLowerCase().includes(q) ||
        (b.phone || "").toLowerCase().includes(q) ||
        (b.email || "").toLowerCase().includes(q) ||
        (b.bookingNumber || "").toLowerCase().includes(q),
    );
  }, [confirmedBookings, search]);

  const stats = useMemo(() => {
    const totalUsers = confirmedBookings.length;
    const totalTickets = confirmedBookings.reduce(
      (sum, b) => sum + (b.ticketCount ?? b.quantity ?? 0),
      0,
    );
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.amount ?? 0), 0);
    return { totalUsers, totalTickets, totalRevenue };
  }, [confirmedBookings]);

  return (
    <Stack spacing={2.5}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="overline" color="primary.main" fontWeight={900}>
            Audience
          </Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>
            User Bookings
          </Typography>
        </Box>
        <IconButton
          onClick={() => void loadData()}
          disabled={loading}
          sx={{ bgcolor: "background.paper", boxShadow: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
        }}
      >
        <Card>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(37,99,235,0.1)", color: "#2563eb" }}>
              <PeopleIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Total Buyers</Typography>
              <Typography variant="h5" fontWeight={900}>{stats.totalUsers}</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(22,163,74,0.1)", color: "#16a34a" }}>
              <ConfirmationNumberIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Tickets Issued</Typography>
              <Typography variant="h5" fontWeight={900}>{stats.totalTickets}</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(15,118,110,0.1)", color: "#0f766e" }}>
              <AttachMoneyIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Total Revenue</Typography>
              <Typography variant="h5" fontWeight={900}>{formatMoney(stats.totalRevenue)}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Search */}
      <TextField
        placeholder="Search by name, phone, email or booking number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ bgcolor: "background.paper", borderRadius: 1 }}
      />

      {/* Table */}
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2, overflowX: "auto" }}>
        <Table sx={{ minWidth: 1050 }}>
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 900 }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 900 }}>Phone Number</TableCell>
              <TableCell sx={{ fontWeight: 900 }}>Email ID</TableCell>
              <TableCell sx={{ fontWeight: 900 }}>Ticket ID(s)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 900 }}>Qty</TableCell>
              <TableCell align="right" sx={{ fontWeight: 900 }}>Amount Paid</TableCell>
              <TableCell align="center" sx={{ fontWeight: 900 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No bookings found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{b.customerName || "N/A"}</TableCell>
                  <TableCell>
                    {b.phone ? (
                      <a href={`tel:${b.phone}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {formatPhone(b.phone)}
                      </a>
                    ) : (
                      <Typography color="text.disabled" fontSize="0.85rem">N/A</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {b.email ? (
                      <a href={`mailto:${b.email}`} style={{ color: "inherit", textDecoration: "none", fontSize: "0.85rem" }}>
                        {b.email}
                      </a>
                    ) : (
                      <Typography color="text.disabled" fontSize="0.85rem">N/A</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {(b.ticketNumbers && b.ticketNumbers.length > 0) ? (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        {b.ticketNumbers.map((tn) => (
                          <Box
                            key={tn}
                            sx={{
                              fontFamily: "monospace",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              color: "primary.main",
                              bgcolor: "action.hover",
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              letterSpacing: "0.03em",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {tn}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography color="text.disabled" fontSize="0.82rem">—</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">{b.quantity ?? "—"}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: "warning.main" }}>
                    {formatMoney(b.amount)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={b.status}
                      size="small"
                      color={
                        b.status === "CONFIRMED"
                          ? "success"
                          : b.status === "PENDING"
                          ? "warning"
                          : "error"
                      }
                      sx={{ fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase" }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="caption" color="text.secondary" sx={{ textAlign: "right" }}>
        Showing {filteredBookings.length} of {confirmedBookings.length} confirmed bookings
      </Typography>
    </Stack>
  );
}
