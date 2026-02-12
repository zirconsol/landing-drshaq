import "server-only";

import { cache } from "react";
import {
  catalogItems,
  type CatalogItem,
  type ProductColor,
} from "@/data/drops";

type ProductApiNode = Record<string, unknown>;

const DEFAULT_COLORS: ProductColor[] = [
  { name: "Blanco", hex: "#F4F6F8" },
  { name: "Negro", hex: "#111111" },
  { name: "Gris", hex: "#8B9298" },
];

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"];

function getApiBaseUrl() {
  const url =
    process.env.CATALOG_API_BASE_URL ??
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "";
  return url.replace(/\/+$/, "");
}

function getPublicReadKey() {
  return (
    process.env.CATALOG_PUBLIC_READ_KEY ??
    process.env.PUBLIC_READ_KEY ??
    process.env.NEXT_PUBLIC_PUBLIC_READ_KEY ??
    ""
  ).trim();
}

function getCatalogPageSize() {
  const raw =
    process.env.CATALOG_PUBLIC_PAGE_SIZE ??
    process.env.NEXT_PUBLIC_CATALOG_PAGE_SIZE ??
    "48";
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return 48;
  return Math.max(1, Math.min(100, Math.floor(parsed)));
}

function valueAsString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function valueAsNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function normalizeText(input: string) {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function slugify(input: string) {
  return normalizeText(input).replace(/\s+/g, "-");
}

function parseProductsPayload(payload: unknown): ProductApiNode[] {
  if (Array.isArray(payload)) return payload as ProductApiNode[];

  if (payload && typeof payload === "object") {
    const items = (payload as { items?: unknown }).items;
    if (Array.isArray(items)) return items as ProductApiNode[];
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) return data as ProductApiNode[];
    const products = (payload as { products?: unknown }).products;
    if (Array.isArray(products)) return products as ProductApiNode[];
  }

  return [];
}

function parseImageUrls(product: ProductApiNode): string[] {
  const urls: string[] = [];
  const candidates: unknown[] = [];

  const pushCandidates = (value: unknown) => {
    if (Array.isArray(value)) {
      candidates.push(...value);
      return;
    }
    if (value) {
      candidates.push(value);
    }
  };

  pushCandidates(product.images);
  pushCandidates(product.image_urls);
  pushCandidates(product.media);
  pushCandidates(product.assets);
  pushCandidates(product.gallery);
  pushCandidates(product.photos);
  pushCandidates(product.cover);
  pushCandidates(product.primary_image);
  pushCandidates(product.thumbnail);

  for (const image of candidates) {
    if (typeof image === "string") {
      urls.push(resolveImageUrl(image));
      continue;
    }
    if (!image || typeof image !== "object") continue;
    const source =
      valueAsString((image as { public_url?: unknown }).public_url) ||
      valueAsString((image as { url?: unknown }).url) ||
      valueAsString((image as { src?: unknown }).src) ||
      valueAsString((image as { secure_url?: unknown }).secure_url) ||
      valueAsString((image as { image_url?: unknown }).image_url) ||
      valueAsString((image as { file_url?: unknown }).file_url) ||
      valueAsString((image as { original_url?: unknown }).original_url) ||
      valueAsString((image as { path?: unknown }).path);
    if (source) urls.push(resolveImageUrl(source));
  }

  const single =
    valueAsString(product.primary_image_url) ||
    valueAsString(product.image_url) ||
    valueAsString(product.image) ||
    valueAsString(product.cover_image) ||
    valueAsString(product.thumbnail_url) ||
    valueAsString(product.featured_image);

  if (single) urls.unshift(resolveImageUrl(single));
  return [...new Set(urls.filter(Boolean))];
}

function resolveImageUrl(source: string) {
  const input = source.trim();
  if (!input) return "";
  if (/^https?:\/\//i.test(input)) return input;
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return input;
  if (input.startsWith("/")) return `${baseUrl}${input}`;
  return `${baseUrl}/${input}`;
}

function parseColors(product: ProductApiNode): ProductColor[] {
  const raw =
    (Array.isArray(product.colors) ? product.colors : [])
      .concat(Array.isArray(product.available_colors) ? product.available_colors : [])
      .filter(Boolean);

  const names = raw
    .map((entry) => {
      if (typeof entry === "string") return entry;
      if (entry && typeof entry === "object") {
        return valueAsString((entry as { name?: unknown }).name);
      }
      return "";
    })
    .filter(Boolean);

  if (names.length === 0) return DEFAULT_COLORS;

  return names.map((name) => {
    const normalized = normalizeText(name);
    if (normalized.includes("blanc")) return { name: "Blanco", hex: "#F4F6F8" };
    if (normalized.includes("gris")) return { name: "Gris", hex: "#8B9298" };
    if (normalized.includes("azul")) return { name: "Azul", hex: "#1F509D" };
    return { name: "Negro", hex: "#111111" };
  });
}

function parseSizes(product: ProductApiNode): string[] {
  const raw =
    (Array.isArray(product.sizes) ? product.sizes : [])
      .concat(Array.isArray(product.available_sizes) ? product.available_sizes : [])
      .filter(Boolean);

  const sizes = raw
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter(Boolean);

  return sizes.length > 0 ? [...new Set(sizes)] : DEFAULT_SIZES;
}

function resolveDropSlug(product: ProductApiNode, fallbackDropSlug: string) {
  const explicit = valueAsString(product.drop_slug);
  if (explicit) return explicit;

  const collectionSlug = valueAsString(product.collection_slug);
  if (collectionSlug) return collectionSlug;

  const collectionName = valueAsString(product.collection_name);
  const normalized = normalizeText(collectionName);
  if (!normalized) return fallbackDropSlug;
  if (normalized.includes("ye")) return "ye-apparel";
  if (normalized.includes("campera") || normalized.includes("jacket")) return "camperas";
  if (normalized.includes("montana") || normalized.includes("mountain")) return "montana";
  return fallbackDropSlug;
}

function mapProductToCatalogItem(
  product: ProductApiNode,
  fallbackDropSlug: string
): CatalogItem | null {
  const id =
    valueAsString(product.id) ||
    valueAsString(product.product_id) ||
    valueAsString(product.uuid);
  const name = valueAsString(product.name) || valueAsString(product.title);
  if (!id || !name) return null;

  const images = parseImageUrls(product);
  const rawPrice =
    valueAsNumber(product.price_cents) > 0
      ? valueAsNumber(product.price_cents) / 100
      : valueAsNumber(product.price);

  const subcategory =
    valueAsString(product.subcategory) ||
    valueAsString(product.category_name) ||
    valueAsString(product.category_slug) ||
    "General";

  const status =
    valueAsString(product.status) || valueAsString(product.publish_status);

  return {
    id,
    slug: valueAsString(product.slug) || slugify(name),
    dropSlug: resolveDropSlug(product, fallbackDropSlug),
    name,
    price: rawPrice > 0 ? Math.round(rawPrice) : 0,
    image: images[0] ?? "/catalog-1.jpg",
    images: images.length > 0 ? images : ["/catalog-1.jpg"],
    tag: status.toLowerCase() === "new" ? "Nuevo" : undefined,
    description:
      valueAsString(product.short_description) ||
      valueAsString(product.description) ||
      "Sin descripción disponible.",
    subcategory,
    colors: parseColors(product),
    sizes: parseSizes(product),
  };
}

async function fetchPublicJson(path: string) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new Error("Missing API base url");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const readKey = getPublicReadKey();
  if (readKey) headers["X-Public-Read-Key"] = readKey;

  const response = await fetch(`${baseUrl}${path}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Public API ${path} failed with ${response.status}`);
  }
  return (await response.json()) as unknown;
}

async function fetchPublicCatalog(
  dropSlug: string,
  category?: string,
  compact = false
) {
  const query = new URLSearchParams({
    drop_slug: dropSlug,
    page: "1",
  });

  if (!compact) {
    query.set("page_size", String(getCatalogPageSize()));
  }
  if (category) {
    query.set("cat", category);
  }

  return fetchPublicJson(`/api/v1/public/catalog?${query.toString()}`);
}

const getCachedCatalogForDrop = cache(async (dropSlug: string, category?: string) => {
  let payload: unknown;
  try {
    payload = await fetchPublicCatalog(dropSlug, category, false);
  } catch {
    // Algunos backends aplican validaciones estrictas a page_size.
    payload = await fetchPublicCatalog(dropSlug, category, true);
  }

  const products = parseProductsPayload(payload);
  const mapped = products
    .map((product) => mapProductToCatalogItem(product, dropSlug))
    .filter((item): item is CatalogItem => Boolean(item));

  // Si el listado público no trae media completa, enriquecemos desde detalle.
  const enriched = await Promise.all(
    mapped.map(async (item) => {
      if (item.image !== "/catalog-1.jpg") return item;
      const detail = await getCachedProductById(item.id, dropSlug);
      if (!detail) return item;
      return {
        ...item,
        image: detail.image,
        images: detail.images,
      };
    })
  );

  return enriched;
});

const getCachedProductById = cache(async (productId: string, fallbackDropSlug: string) => {
  const payload = await fetchPublicJson(`/api/v1/public/products/${encodeURIComponent(productId)}`);
  if (!payload || typeof payload !== "object") return null;
  return mapProductToCatalogItem(payload as ProductApiNode, fallbackDropSlug);
});

export async function getCatalogItemsForDrop(dropSlug: string, category?: string) {
  try {
    const items = await getCachedCatalogForDrop(dropSlug, category);
    if (items.length > 0) return items;
  } catch {
    // fallback mock
  }

  const normalizedCategory = category?.trim().toLowerCase();
  return catalogItems.filter((item) => {
    if (item.dropSlug !== dropSlug) return false;
    if (!normalizedCategory) return true;
    return normalizeText(item.subcategory) === normalizeText(normalizedCategory);
  });
}

export async function getCatalogProductById(dropSlug: string, productId: string) {
  try {
    const item = await getCachedProductById(productId, dropSlug);
    if (item) return item;
  } catch {
    // fallback mock
  }

  return (
    catalogItems.find((item) => item.dropSlug === dropSlug && item.id === productId) ??
    null
  );
}
