export type Drop = {
  slug: string;
  name: string;
  heroImage: string;
  description: string;
  brands?: string[];
  subcategories: string[];
  colors: string[];
};

export type ProductColor = {
  name: string;
  hex: string;
};

export type CatalogItem = {
  id: string;
  slug: string;
  dropSlug: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  tag?: string;
  description: string;
  subcategory: string;
  colors: ProductColor[];
  sizes: string[];
};

export const drops: Drop[] = [
  {
    slug: "montana",
    name: "Montaña",
    heroImage: "/mountain-catalog-banner.jpg",
    description: "Urbano con clima frio.",
    brands: ["Dr. Shaq", "Northside", "Altura"],
    subcategories: ["Remeras", "Pantalones", "Hoodies"],
    colors: ["Negro", "Blanco", "Azul", "Gris"],
  },
  {
    slug: "ye-apparel",
    name: "Ye Apparel",
    heroImage: "/ye-placeholder.jpg",
    description: "Street clean y premium.",
    subcategories: ["Remeras", "Pantalones", "Hoodies"],
    colors: ["Negro", "Blanco", "Azul"],
  },
  {
    slug: "camperas",
    name: "Camperas",
    heroImage: "/jacket-placeholder.jpg",
    description: "Capas para la noche.",
    brands: ["Dr. Shaq", "Coldline", "Metro"],
    subcategories: ["Livianas", "Abrigo"],
    colors: ["Negro", "Azul", "Gris"],
  },
];

const sharedColors: ProductColor[] = [
  { name: "Blanco", hex: "#F4F6F8" },
  { name: "Negro", hex: "#111111" },
  { name: "Gris", hex: "#8B9298" },
];

const sharedSizes = ["S", "M", "L", "XL", "XXL"];

const nikeLightImages = [
  "/images/nike-light/cover.png",
  "/images/nike-light/01.png",
  "/images/nike-light/02.png",
];

export const catalogItems: CatalogItem[] = [
  {
    id: "montana-tee-1",
    slug: "montana-tee-ridge",
    dropSlug: "montana",
    name: "Tee Ridge Line",
    price: 52900,
    image: "/catalog-1.jpg",
    images: ["/catalog-1.jpg"],
    tag: "Nuevo",
    description: "Remera de algodón pesado con estampa frontal resistente.",
    subcategory: "Remeras",
    colors: sharedColors,
    sizes: sharedSizes,
  },
  {
    id: "montana-pants-1",
    slug: "montana-pants-trail",
    dropSlug: "montana",
    name: "Pants Trail Utility",
    price: 78900,
    image: "/catalog-1.jpg",
    images: ["/catalog-1.jpg"],
    description: "Pantalón técnico urbano con bolsillos de carga.",
    subcategory: "Pantalones",
    colors: sharedColors,
    sizes: sharedSizes,
  },
  {
    id: "montana-hoodie-1",
    slug: "montana-hoodie-altitude",
    dropSlug: "montana",
    name: "Hoodie Altitude",
    price: 86900,
    image: "/catalog-1.jpg",
    images: ["/catalog-1.jpg"],
    description: "Hoodie de fleece pesado para clima frío diario.",
    subcategory: "Hoodies",
    colors: sharedColors,
    sizes: sharedSizes,
  },
  {
    id: "ye-tee-1",
    slug: "ye-tee-signal",
    dropSlug: "ye-apparel",
    name: "Ye Tee Signal",
    price: 49900,
    image: "/catalog-1.jpg",
    images: ["/catalog-1.jpg"],
    tag: "Drop",
    description: "Remera clean fit con gráfica tonal y corte boxy.",
    subcategory: "Remeras",
    colors: sharedColors,
    sizes: sharedSizes,
  },
  {
    id: "ye-pants-1",
    slug: "ye-pants-core",
    dropSlug: "ye-apparel",
    name: "Ye Pants Core",
    price: 73900,
    image: "/catalog-1.jpg",
    images: ["/catalog-1.jpg"],
    description: "Pantalón premium de caída recta y acabado matte.",
    subcategory: "Pantalones",
    colors: sharedColors,
    sizes: sharedSizes,
  },
  {
    id: "ye-hoodie-1",
    slug: "ye-hoodie-shift",
    dropSlug: "ye-apparel",
    name: "Ye Hoodie Shift",
    price: 84900,
    image: "/catalog-1.jpg",
    images: ["/catalog-1.jpg"],
    description: "Hoodie premium con bordado frontal minimal.",
    subcategory: "Hoodies",
    colors: sharedColors,
    sizes: sharedSizes,
  },
  {
    id: "camperas-light-1",
    slug: "campera-light-nike-1",
    dropSlug: "camperas",
    name: "Campera Nike Light 01",
    price: 119900,
    image: nikeLightImages[0],
    images: nikeLightImages,
    tag: "Nuevo",
    description: "Campera liviana de transición con bloque de color urbano.",
    subcategory: "Livianas",
    colors: sharedColors,
    sizes: sharedSizes,
  },
  {
    id: "camperas-warm-1",
    slug: "campera-warm-nike-1",
    dropSlug: "camperas",
    name: "Campera Abrigo Nike 02",
    price: 139900,
    image: nikeLightImages[0],
    images: nikeLightImages,
    description: "Campera de abrigo con interior térmico para invierno.",
    subcategory: "Abrigo",
    colors: sharedColors,
    sizes: sharedSizes,
  },
];

export function getDropCatalogItems(dropSlug: string, category?: string) {
  const normalizedCategory = category?.trim().toLowerCase();

  return catalogItems.filter((item) => {
    if (item.dropSlug !== dropSlug) return false;
    if (!normalizedCategory) return true;
    return item.subcategory.toLowerCase() === normalizedCategory;
  });
}

export function getCatalogItem(dropSlug: string, productId: string) {
  return catalogItems.find(
    (item) => item.dropSlug === dropSlug && item.id === productId
  );
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}
