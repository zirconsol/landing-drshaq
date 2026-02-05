export type Drop = {
  slug: string;
  name: string;
  heroImage: string;
  description: string;
  brands?: string[];
  subcategories: string[];
  colors: string[];
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

export type CatalogItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  tag?: string;
};

export const catalogItems: CatalogItem[] = Array.from({ length: 8 }).map(
  (_, index) => ({
    id: `item-${index + 1}`,
    name: `Drop Essential ${index + 1}`,
    price: "$59",
    image: "/catalog-1.jpg",
    tag: index < 3 ? "Nuevo" : undefined,
  })
);
