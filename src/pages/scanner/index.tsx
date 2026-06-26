import { Alert, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, Stack, Typography } from "@mui/material";
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
  const loadingRef = useRef(false);

  const handleScan = useCallback(
    async (decodedText: string) => {
      // If we are already loading or already have a result displayed, do not process new scans
      if (loadingRef.current || result !== null) {
        return;
      }

      const ticketNumber = extractTicketNumber(decodedText);
      if (!ticketNumber) {
        return;
      }

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
    },
    [result]
  );

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
              <QRScanner onScan={handleScan} paused={result !== null || loading} />
            </Box>
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

      <Dialog open={result !== null} onClose={() => setResult(null)} fullWidth maxWidth="xs">
        <DialogContent sx={{ p: 2 }}>
          <TicketResult result={result} />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => setResult(null)}
            sx={{ py: 1.5 }}
          >
            Scan Next Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
