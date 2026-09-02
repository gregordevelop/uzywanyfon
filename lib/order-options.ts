export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Oczekuje",
  PAID: "Opłacone",
  SHIPPED: "Wysłane",
  DELIVERED: "Dostarczone",
  CANCELLED: "Anulowane",
};

export const ORDER_STATUS_OPTIONS = Object.keys(ORDER_STATUS_LABELS);
