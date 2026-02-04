export type Product = {
  slug: string;
  name: string;
  image: string;
  price?: string;
  description?: string;
};

export const products: Product[] = [
  {
    slug: "hoodie-nightshift",
    name: "Hoodie Nightshift",
    image: "/catalog-1.jpg",
    price: "$85",
    description:
      "Algodón pesado con calce amplio y bordado tonal. Drop limitado.",
  },
  {
    slug: "tee-gutterline",
    name: "Tee Gutterline",
    image: "/catalog-1.jpg",
    price: "$38",
    description:
      "Remera oversized con print frontal y tinta soft-touch.",
  },
  {
    slug: "pants-raw-zone",
    name: "Pants Raw Zone",
    image: "/catalog-1.jpg",
    price: "$72",
    description: "Cargo con costuras visibles y bolsillos utilitarios.",
  },
  {
    slug: "cap-underground",
    name: "Cap Underground",
    image: "/catalog-1.jpg",
    price: "$28",
    description: "Gorra con visera curva y logo bordado.",
  },
  {
    slug: "jacket-iron-dust",
    name: "Jacket Iron Dust",
    image: "/catalog-1.jpg",
    price: "$120",
    description: "Chaqueta técnica con cierres metálicos y forro matte.",
  },
  {
    slug: "bag-concrete",
    name: "Bag Concrete",
    image: "/catalog-1.jpg",
    price: "$46",
    description: "Crossbody compacta con ajuste rápido y hebilla negra.",
  },
];
