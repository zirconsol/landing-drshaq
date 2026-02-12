"use client";

const VISITOR_ID_KEY = "drshaq-visitor-id-v1";
const SESSION_ID_KEY = "drshaq-session-id-v1";

export type PublicEventName =
  | "impression"
  | "click"
  | "cta_click"
  | "add_to_request"
  | "request_submitted";
export type PublicEventSource =
  | "hero_cta"
  | "product_card"
  | "product_detail"
  | "category_grid"
  | "catalog_grid"
  | "floating_whatsapp"
  | "nav_cta"
  | "dashboard"
  | "unknown";
export type TrackingContext = {
  visitorId: string;
  sessionId: string;
  pagePath: string;
};
export type PublicEventMeta = {
  productId?: string;
  catalogId?: string;
  requestId?: string;
};

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
}

function readCookie(name: string) {
  const prefix = `${name}=`;
  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateVisitorId() {
  const fromLocal = window.localStorage.getItem(VISITOR_ID_KEY);
  if (fromLocal) return fromLocal;

  const fromCookie = readCookie(VISITOR_ID_KEY);
  if (fromCookie) {
    window.localStorage.setItem(VISITOR_ID_KEY, fromCookie);
    return fromCookie;
  }

  const visitorId = createId();
  window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
  writeCookie(VISITOR_ID_KEY, visitorId, 60 * 60 * 24 * 365 * 2);
  return visitorId;
}

function getOrCreateSessionId() {
  const fromSession = window.sessionStorage.getItem(SESSION_ID_KEY);
  if (fromSession) return fromSession;
  const sessionId = createId();
  window.sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  return sessionId;
}

function getCurrentPath() {
  const { pathname, search } = window.location;
  return `${pathname}${search}`;
}

export function getTrackingContext(): TrackingContext {
  return {
    visitorId: getOrCreateVisitorId(),
    sessionId: getOrCreateSessionId(),
    pagePath: getCurrentPath(),
  };
}

function buildEventIdempotencyKey(eventName: PublicEventName, source: PublicEventSource) {
  return `${eventName}:${source}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
}

export async function trackPublicEvent(
  eventName: PublicEventName,
  source: PublicEventSource,
  meta: PublicEventMeta = {}
) {
  if (typeof window === "undefined") return;

  const tracking = getTrackingContext();
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/v1/analytics/public/events`;
  const payload = {
    event_name: eventName,
    source,
    visitor_id: tracking.visitorId,
    session_id: tracking.sessionId,
    page_path: tracking.pagePath,
    idempotency_key: buildEventIdempotencyKey(eventName, source),
    ...(meta.productId ? { product_id: meta.productId } : {}),
    ...(meta.catalogId ? { catalog_id: meta.catalogId } : {}),
    ...(meta.requestId ? { request_id: meta.requestId } : {}),
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const writeKey = process.env.NEXT_PUBLIC_EVENTS_WRITE_KEY;
  if (writeKey) {
    headers["X-Events-Key"] = writeKey;
  }

  try {
    await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // No interrumpir UX por fallas de tracking.
  }
}
