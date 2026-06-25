import { Alert, AlertTitle, Stack, Typography } from "@mui/material";
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
    <Alert
      severity={isSuccess ? "success" : "error"}
      sx={{
        borderRadius: 4,
        py: 2,
        backgroundColor: isSuccess ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
        border: `1px solid ${isSuccess ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
      }}
    >
      <AlertTitle sx={{ fontWeight: 900, mb: 1 }}>
        {isSuccess ? "ENTRY ALLOWED" : "ENTRY BLOCKED"}
      </AlertTitle>
      <Stack spacing={0.5}>
        <Typography variant="h6" fontWeight={900}>
          {result.customerName ?? "Unknown attendee"}
        </Typography>
        <Typography variant="body1">Ticket: {result.ticketNumber ?? "N/A"}</Typography>
        <Typography variant="body2">{result.message}</Typography>
      </Stack>
    </Alert>
  );
}
