export function extractTicketNumber(payload: string) {
  const trimmed = payload.trim();

  if (!trimmed) {
    return "";
  }

  try {
    const parsed = JSON.parse(trimmed) as
      | string
      | { ticketNumber?: string; ticket?: string; id?: string };

    if (typeof parsed === "string") {
      return parsed.trim();
    }

    return (
      parsed.ticketNumber?.trim() ??
      parsed.ticket?.trim() ??
      parsed.id?.trim() ??
      trimmed
    );
  } catch {
    return trimmed;
  }
}
