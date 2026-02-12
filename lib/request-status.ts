export type RequestStatusApi =
  | "submitted"
  | "in_progress"
  | "contacted"
  | "fulfilled"
  | "declined_customer"
  | "declined_business";

export type RequestStatusUi =
  | "consulta_whatsapp"
  | "pagado_temporal"
  | "entregado"
  | "cancelado";

export function normalizeRequestStatus(status: string): RequestStatusApi {
  const value = status.trim().toLowerCase();
  if (value === "contacted") return "in_progress";
  if (value === "submitted") return "submitted";
  if (value === "in_progress") return "in_progress";
  if (value === "fulfilled") return "fulfilled";
  if (value === "declined_customer") return "declined_customer";
  if (value === "declined_business") return "declined_business";
  return "submitted";
}

export function toDashboardStatusLabel(status: string): string {
  const normalized = normalizeRequestStatus(status);
  if (normalized === "submitted") return "Consulta via Whatsapp";
  if (normalized === "in_progress") return "Pagado (temporal)";
  if (normalized === "fulfilled") return "Entregado";
  return "Cancelado";
}

export function toDashboardStatusValue(status: string): RequestStatusUi {
  const normalized = normalizeRequestStatus(status);
  if (normalized === "submitted") return "consulta_whatsapp";
  if (normalized === "in_progress") return "pagado_temporal";
  if (normalized === "fulfilled") return "entregado";
  return "cancelado";
}
