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

export type Booking = {
  id: string;
  bookingNumber: string;
  customerName: string;
  email: string;
  phone: string;
  quantity: number;
  status: string;
  amount: number;
  ticketCount?: number | null;
  ticketNumbers?: string[] | null;
};
