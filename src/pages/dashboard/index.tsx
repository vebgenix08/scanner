import { Box, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DoorBackIcon from "@mui/icons-material/DoorBack";
import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import StatsCard from "../../components/StatsCard";
import ScanTable from "../../components/ScanTable";
import { getDashboardStats, getRecentScans } from "../../services/appsync";
import type { DashboardStats, Scan } from "../../types/graphql";

function formatMoney(value?: number | null) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [dashboardStats, recentScans] = await Promise.all([
          getDashboardStats(),
          getRecentScans(8),
        ]);

        if (!mounted) {
          return;
        }

        setStats(dashboardStats);
        setScans(recentScans);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();
    const interval = window.setInterval(() => void load(), 15000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const totalTicketsSold = stats?.totalTicketsSold ?? 0;
  const totalCheckedIn = stats?.totalCheckedIn ?? 0;
  const remainingEntries = stats?.remainingEntries ?? 0;
  const vipSold = stats?.vipSold ?? 0;
  const regularSold = stats?.regularSold ?? 0;
  const totalRevenue = stats?.totalRevenue ?? 0;

  const checkInRate = totalTicketsSold > 0 ? Math.round((totalCheckedIn / totalTicketsSold) * 100) : 0;

  const chartSeries = useMemo(() => {
    const pointsByHour = new Map<string, number>();

    scans.forEach((scan) => {
      const label = scan.scannedAt
        ? new Intl.DateTimeFormat("en-IN", { hour: "2-digit" }).format(new Date(scan.scannedAt))
        : "Now";
      pointsByHour.set(label, (pointsByHour.get(label) ?? 0) + 1);
    });

    const data = Array.from(pointsByHour.entries()).map(([label, count], index) => ({
      x: label || `${index + 1}`,
      y: count,
    }));

    return [
      {
        name: "Recent scans",
        data: data.length > 0 ? data : [{ x: "Now", y: 1 }],
      },
    ];
  }, [scans]);

  const areaOptions: ApexOptions = {
    chart: { type: "area", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 3 },
    xaxis: { type: "category", title: { text: "Recent windows" } },
    yaxis: { title: { text: "Scans" } },
    theme: { mode: "dark" },
  };

  const donutOptions: ApexOptions = {
    labels: ["VIP", "Regular"],
    theme: { mode: "dark" },
    legend: { position: "bottom" },
  };

  const progressOptions: ApexOptions = {
    chart: { type: "radialBar" },
    plotOptions: {
      radialBar: {
        hollow: { size: "65%" },
        dataLabels: {
          name: { show: true },
          value: { show: true, fontSize: "28px" },
        },
      },
    },
    labels: ["Check-in"],
    theme: { mode: "dark" },
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="overline" color="primary.main" fontWeight={900}>
          Dashboard
        </Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>
          Event overview
        </Typography>
      </Box>

      {loading ? (
        <Card>
          <CardContent sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </CardContent>
        </Card>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
        }}
      >
        <StatsCard title="Total tickets sold" value={totalTicketsSold} icon={<ConfirmationNumberIcon />} accent="#2563eb" />
        <StatsCard title="Total revenue" value={formatMoney(totalRevenue)} icon={<AttachMoneyIcon />} accent="#0f766e" />
        <StatsCard title="Total checked-in" value={totalCheckedIn} icon={<HowToRegIcon />} accent="#16a34a" />
        <StatsCard title="Remaining entries" value={remainingEntries} icon={<DoorBackIcon />} accent="#b45309" />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 2fr) minmax(0, 1fr)",
          },
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
              Recent scan activity
            </Typography>
            <ReactApexChart
              type="area"
              height={280}
              series={chartSeries}
              options={areaOptions}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
              Category split
            </Typography>
            <ReactApexChart
              type="donut"
              height={280}
              series={[vipSold, regularSold]}
              options={donutOptions}
            />
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 1fr) minmax(0, 2fr)",
          },
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
              Check-in progress
            </Typography>
            <ReactApexChart
              type="radialBar"
              height={280}
              series={[checkInRate]}
              options={progressOptions}
            />
          </CardContent>
        </Card>
        <ScanTable scans={scans} />
      </Box>
    </Stack>
  );
}
