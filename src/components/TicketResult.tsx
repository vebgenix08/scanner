import { Box, Paper, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import type { VerifyTicketResponse } from "../types/graphql";

type TicketResultProps = {
  result: VerifyTicketResponse | null;
};

export default function TicketResult({ result }: TicketResultProps) {
  if (!result) {
    return null;
  }

  const isSuccess = result.success;

  return (
    <Stack spacing={3} alignItems="center" textAlign="center" py={2}>
      {isSuccess ? (
        <CheckCircleIcon sx={{ fontSize: 96, color: "success.main" }} />
      ) : (
        <CancelIcon sx={{ fontSize: 96, color: "error.main" }} />
      )}

      <Stack spacing={1}>
        <Typography
          variant="h4"
          fontWeight={900}
          color={isSuccess ? "success.main" : "error.main"}
          textTransform="uppercase"
        >
          {isSuccess ? "Entry Allowed" : "Entry Blocked"}
        </Typography>

        <Typography variant="h5" fontWeight={700} color="text.primary">
          {result.customerName ?? "Unknown Attendee"}
        </Typography>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          width: "100%",
          backgroundColor: isSuccess ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
          border: `1px dashed ${isSuccess ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
          borderRadius: 3,
        }}
      >
        <Typography variant="overline" color="text.secondary" fontWeight={900}>
          Ticket Information
        </Typography>
        <Typography variant="h6" fontFamily="monospace" fontWeight={800} mt={0.5} color="text.primary">
          {result.ticketNumber ?? "N/A"}
        </Typography>
        <Typography variant="body1" mt={1.5} color={isSuccess ? "success.light" : "error.light"} fontWeight={600}>
          {result.message}
        </Typography>
      </Paper>
    </Stack>
  );
}
