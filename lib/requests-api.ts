export type RequestStatusUpdate =
  | "submitted"
  | "in_progress"
  | "fulfilled"
  | "declined_customer"
  | "declined_business";

export type RequestListItem = {
  id: string;
  created_at: string;
  status: string;
  source: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  notes: string | null;
  items: Array<{
    product_name: string | null;
    qty: number;
    variant_size: string | null;
    variant_color: string | null;
    unit_price_cents: number | null;
  }>;
};

type RequestListResponse = {
  items: RequestListItem[];
};

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
}

function buildHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function getRequestTotalCents(request: RequestListItem) {
  return request.items.reduce((sum, item) => {
    if (!item.unit_price_cents) return sum;
    return sum + item.unit_price_cents * item.qty;
  }, 0);
}

export async function listRequests(token: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/requests`, {
    headers: buildHeaders(token),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`GET /requests failed (${response.status})`);
  }
  return (await response.json()) as RequestListResponse;
}

export async function getRequestById(requestId: string, token: string) {
  const response = await fetch(
    `${getApiBaseUrl()}/api/v1/requests/${encodeURIComponent(requestId)}`,
    {
      headers: buildHeaders(token),
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error(`GET /requests/${requestId} failed (${response.status})`);
  }
  return (await response.json()) as RequestListItem;
}

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatusUpdate,
  token: string,
  reason?: string
) {
  const payload = {
    status,
    ...(reason ? { reason } : {}),
  };
  const response = await fetch(
    `${getApiBaseUrl()}/api/v1/requests/${encodeURIComponent(requestId)}/status`,
    {
      method: "PATCH",
      headers: buildHeaders(token),
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    throw new Error(`PATCH /requests/${requestId}/status failed (${response.status})`);
  }
  return (await response.json()) as RequestListItem;
}
