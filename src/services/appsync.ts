import { apolloClient } from "../lib/apolloClient";
import type { DashboardStats, Scan, VerifyTicketResponse } from "../types/graphql";
import { DASHBOARD_STATS, RECENT_SCANS, VERIFY_TICKET } from "../graphql/queries";

type VerifyTicketQueryResult = {
  verifyTicket: VerifyTicketResponse;
};

type DashboardStatsQueryResult = {
  dashboardStats: DashboardStats;
};

type RecentScansQueryResult = {
  recentScans: Scan[];
};

export async function verifyTicket(ticketNumber: string) {
  const { data } = await apolloClient.query<VerifyTicketQueryResult>({
    query: VERIFY_TICKET,
    variables: { ticketNumber },
    fetchPolicy: "no-cache",
  });

  return data.verifyTicket;
}

export async function getDashboardStats() {
  const { data } = await apolloClient.query<DashboardStatsQueryResult>({
    query: DASHBOARD_STATS,
    fetchPolicy: "no-cache",
  });
  return data.dashboardStats;
}

export async function getRecentScans(limit = 10) {
  const { data } = await apolloClient.query<RecentScansQueryResult>({
    query: RECENT_SCANS,
    variables: { limit },
    fetchPolicy: "no-cache",
  });
  return data.recentScans;
}
