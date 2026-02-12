"use client";

import type { CartLine } from "@/components/CartProvider";
import { getTrackingContext, type PublicEventSource } from "@/lib/public-analytics";

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
}

function hashText(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function buildRequestIdempotencyKey(
  lines: CartLine[],
  visitorId: string,
  sessionId: string
) {
  const fingerprint = lines
    .map(
      (line) =>
        `${line.productId}:${line.quantity}:${line.selectedSize ?? ""}:${line.selectedColorName ?? ""}`
    )
    .sort()
    .join("|");
  // Window de 15s para dedupe de doble click/reintentos inmediatos.
  const attemptWindow = Math.floor(Date.now() / 15000);
  return `request:${hashText(`${visitorId}:${sessionId}:${attemptWindow}:${fingerprint}`)}`;
}

export async function submitPublicRequestFromCart(
  lines: CartLine[],
  source: PublicEventSource = "floating_whatsapp"
) {
  if (typeof window === "undefined") {
    return { ok: false as const, status: null, error: "not-in-browser" };
  }
  if (lines.length === 0) {
    return { ok: false as const, status: null, error: "empty-cart" };
  }

  const tracking = getTrackingContext();
  const endpoint = `${getApiBaseUrl()}/api/v1/requests/public`;
  const payload = {
    source,
    visitor_id: tracking.visitorId,
    session_id: tracking.sessionId,
    page_path: tracking.pagePath,
    idempotency_key: buildRequestIdempotencyKey(
      lines,
      tracking.visitorId,
      tracking.sessionId
    ),
    referrer: document.referrer || undefined,
    items: lines.map((line) => ({
      product_id: line.productId,
      qty: line.quantity,
      variant_size: line.selectedSize ?? undefined,
      variant_color: line.selectedColorName ?? undefined,
      unit_price_cents: Math.round(line.price * 100),
    })),
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const writeKey = process.env.NEXT_PUBLIC_EVENTS_WRITE_KEY;
  if (writeKey) {
    headers["X-Events-Key"] = writeKey;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      keepalive: true,
    });

    if (response.status === 200 || response.status === 201) {
      return { ok: true as const, status: response.status };
    }
    return {
      ok: false as const,
      status: response.status,
      error: "request-not-created",
    };
  } catch {
    return {
      ok: false as const,
      status: null,
      error: "network-error",
    };
  }
}
