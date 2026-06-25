import { Alert, Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useCallback, useRef, useState } from "react";
import QRScanner from "../../components/QRScanner";
import TicketResult from "../../components/TicketResult";
import { verifyTicket as verifyTicketApi } from "../../services/appsync";
import type { VerifyTicketResponse } from "../../types/graphql";
import { extractTicketNumber } from "../../utils/tickets";

export default function ScannerPage() {
  const [result, setResult] = useState<VerifyTicketResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const lastTicketRef = useRef("");
  const loadingRef = useRef(false);

  const handleScan = useCallback(async (decodedText: string) => {
    if (loadingRef.current) {
      return;
    }

    const ticketNumber = extractTicketNumber(decodedText);
    if (!ticketNumber || ticketNumber === lastTicketRef.current) {
      return;
    }

    lastTicketRef.current = ticketNumber;
    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await verifyTicketApi(ticketNumber);
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unable to verify ticket.",
        ticketNumber,
      });
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="overline" color="primary.main" fontWeight={900}>
              Live Camera
            </Typography>
            <Typography variant="h4">Scan QR tickets</Typography>
            <Typography color="text.secondary">
              Open the rear camera, scan the QR, and verify access in one second.
            </Typography>
            <Alert severity="info" sx={{ mt: 1 }}>
              Recommended QR payload: <strong>TKT000006</strong>
            </Alert>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box
              sx={{
                overflow: "hidden",
                borderRadius: 3,
                "& #reader": {
                  width: "100%",
                },
                "& video": {
                  borderRadius: 3,
                },
              }}
            >
              <QRScanner onScan={handleScan} />
            </Box>
            <Button
              variant="outlined"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setResult(null);
                lastTicketRef.current = "";
              }}
              sx={{ minHeight: 52 }}
            >
              Reset Result
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Card sx={{ borderColor: "primary.main" }}>
          <CardContent>
            <Typography fontWeight={900}>Verifying ticket...</Typography>
          </CardContent>
        </Card>
      ) : null}

      <TicketResult result={result} />
    </Stack>
  );
}
