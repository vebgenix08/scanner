import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useEffect, useState } from "react";
import ScanTable from "../../components/ScanTable";
import { getRecentScans } from "../../services/appsync";
import type { Scan } from "../../types/graphql";

export default function ScansPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      setScans(await getRecentScans(25));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <Stack spacing={2.5}>
      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="overline" color="primary.main" fontWeight={900}>
              Recent Scans
            </Typography>
            <Typography variant="h4">Live scan feed</Typography>
            <Typography color="text.secondary">
              Security staff can quickly review the latest checked-in tickets.
            </Typography>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => void refresh()}
              sx={{ alignSelf: "flex-start", minHeight: 52 }}
            >
              Refresh feed
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent sx={{ opacity: loading ? 0.6 : 1 }}>
          <ScanTable scans={scans} />
        </CardContent>
      </Card>
    </Stack>
  );
}
