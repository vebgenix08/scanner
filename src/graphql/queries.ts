import { gql } from "@apollo/client";

export const VERIFY_TICKET = gql`
  query VerifyTicket($ticketNumber: String!) {
    verifyTicket(ticketNumber: $ticketNumber) {
      success
      message
      ticketNumber
      customerName
    }
  }
`;

export const DASHBOARD_STATS = gql`
  query DashboardStats {
    dashboardStats {
      totalTicketsSold
      totalRevenue
      totalCheckedIn
      remainingEntries
      vipSold
      regularSold
    }
  }
`;

export const RECENT_SCANS = gql`
  query RecentScans($limit: Int) {
    recentScans(limit: $limit) {
      ticketNumber
      customerName
      scannedAt
    }
  }
`;

export const TICKET_DETAILS = gql`
  query TicketDetails($ticketNumber: String!) {
    ticketDetails(ticketNumber: $ticketNumber) {
      ticketNumber
      customerName
    }
  }
`;

export const LIST_BOOKINGS = gql`
  query ListBookings {
    listBookings {
      id
      bookingNumber
      customerName
      email
      phone
      quantity
      status
      amount
      ticketCount
      ticketNumbers
    }
  }
`;

