export type VerifyTicketResponse = {
  success: boolean;
  message: string;
  ticketNumber?: string | null;
  customerName?: string | null;
};

export type DashboardStats = {
  totalTicketsSold?: number | null;
  totalRevenue?: number | null;
  totalCheckedIn?: number | null;
  remainingEntries?: number | null;
  vipSold?: number | null;
  regularSold?: number | null;
};

export type Scan = {
  ticketNumber?: string | null;
  customerName?: string | null;
  scannedAt?: string | null;
};
