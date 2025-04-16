
// Utility functions for formatting values

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return dateStr;
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  return timeStr;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
}

export function formatDateTime(timestamp: string): { date: string, time: string } {
  if (!timestamp) return { date: "", time: "" };
  
  // Format: 2024-04-16T10:08:00Z
  try {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
  } catch (e) {
    return { date: "", time: "" };
  }
}
