import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Scan } from "../types/graphql";

type ScanTableProps = {
  scans: Scan[];
};

function formatTime(value?: string | null) {
  if (!value) {
    return "Now";
  }

  const date = new Date(value);
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function ScanTable({ scans }: ScanTableProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
          Recent Scans
        </Typography>
        <Table size="small" sx={{ minWidth: 320 }}>
          <TableHead>
            <TableRow>
              <TableCell>Ticket</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scans.map((scan, index) => (
              <TableRow key={`${scan.ticketNumber ?? "scan"}-${index}`}>
                <TableCell>{scan.ticketNumber ?? "-"}</TableCell>
                <TableCell>{scan.customerName ?? "-"}</TableCell>
                <TableCell align="right">{formatTime(scan.scannedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
