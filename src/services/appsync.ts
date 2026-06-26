import { apolloClient } from "../lib/apolloClient";
import type { Booking, DashboardStats, Scan, VerifyTicketResponse } from "../types/graphql";
import { DASHBOARD_STATS, LIST_BOOKINGS, RECENT_SCANS, VERIFY_TICKET } from "../graphql/queries";

type VerifyTicketQueryResult = {
  verifyTicket: VerifyTicketResponse;
};

type DashboardStatsQueryResult = {
  dashboardStats: DashboardStats;
};

type RecentScansQueryResult = {
  recentScans: Scan[];
};

// Check if we should fall back to mock data
const isMock = !import.meta.env.VITE_APPSYNC_GRAPHQL_ENDPOINT ||
  import.meta.env.VITE_APPSYNC_GRAPHQL_ENDPOINT.includes("your-api-id") ||
  import.meta.env.VITE_APPSYNC_GRAPHQL_ENDPOINT === "";

// Local state for mock data so it reactively updates when you test-scan tickets
let mockStats: DashboardStats = {
  totalTicketsSold: 1250,
  totalRevenue: 625000,
  totalCheckedIn: 842,
  remainingEntries: 408,
  vipSold: 250,
  regularSold: 1000,
};

let mockScans: Scan[] = [
  { ticketNumber: "VIP-849204", customerName: "Aarav Sharma", scannedAt: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  { ticketNumber: "REG-294019", customerName: "Ishaan Patel", scannedAt: new Date(Date.now() - 1000 * 60 * 7).toISOString() },
  { ticketNumber: "REG-103948", customerName: "Ananya Iyer", scannedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { ticketNumber: "VIP-994032", customerName: "Kabir Mehta", scannedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { ticketNumber: "REG-582019", customerName: "Riya Sen", scannedAt: new Date(Date.now() - 1000 * 60 * 19).toISOString() },
  { ticketNumber: "REG-472019", customerName: "Aditya Rao", scannedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
];

export async function verifyTicket(ticketNumber: string) {
  if (isMock) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency

    // Check if already scanned
    if (mockScans.some((s) => s.ticketNumber === ticketNumber)) {
      return {
        success: false,
        message: "Ticket has already been scanned/checked in.",
        ticketNumber,
        customerName: "Duplicate Scan",
      };
    }

    const isVip = ticketNumber.toUpperCase().startsWith("VIP-");
    const isReg = ticketNumber.toUpperCase().startsWith("REG-") || ticketNumber.toUpperCase().startsWith("TK-");

    if (isVip || isReg) {
      const name = isVip ? "John Doe (VIP)" : "Jane Smith";
      const newScan: Scan = {
        ticketNumber,
        customerName: name,
        scannedAt: new Date().toISOString(),
      };

      // Update in-memory mock states
      mockScans = [newScan, ...mockScans];
      mockStats = {
        ...mockStats,
        totalCheckedIn: mockStats.totalCheckedIn + 1,
        remainingEntries: Math.max(0, mockStats.remainingEntries - 1),
      };

      return {
        success: true,
        message: `Checked in successfully! Welcome, ${name}.`,
        ticketNumber,
        customerName: name,
      };
    }

    return {
      success: false,
      message: "Invalid ticket number or code format.",
      ticketNumber,
      customerName: "Unknown Customer",
    };
  }

  const { data } = await apolloClient.query<VerifyTicketQueryResult>({
    query: VERIFY_TICKET,
    variables: { ticketNumber },
    fetchPolicy: "no-cache",
  });

  return data.verifyTicket;
}

export async function getDashboardStats() {
  if (isMock) {
    return mockStats;
  }

  const { data } = await apolloClient.query<DashboardStatsQueryResult>({
    query: DASHBOARD_STATS,
    fetchPolicy: "no-cache",
  });
  return data.dashboardStats;
}

export async function getRecentScans(limit = 10) {
  if (isMock) {
    return mockScans.slice(0, limit);
  }

  const { data } = await apolloClient.query<RecentScansQueryResult>({
    query: RECENT_SCANS,
    variables: { limit },
    fetchPolicy: "no-cache",
  });
  return data.recentScans;
}

type ListBookingsQueryResult = {
  listBookings: Booking[];
};

export async function getBookings() {
  if (isMock) {
    return [];
  }
  const { data } = await apolloClient.query<ListBookingsQueryResult>({
    query: LIST_BOOKINGS,
    fetchPolicy: "no-cache",
  });
  return data.listBookings;
}

