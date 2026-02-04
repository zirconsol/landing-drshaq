export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
};

export const posts: Post[] = [
  {
    slug: "drop-01",
    title: "Drop 01: Asfalto y humo",
    excerpt: "Lanzamiento con piezas oversized y texturas crudas.",
    date: "20 Ene 2026",
    image: "/blog-placeholder.svg",
  },
  {
    slug: "behind-the-logo",
    title: "Detrás del logo",
    excerpt: "El símbolo que nació en la vereda y quedó en la piel.",
    date: "27 Ene 2026",
    image: "/blog-placeholder.svg",
  },
  {
    slug: "fit-diaries",
    title: "Fit Diaries: capas y siluetas",
    excerpt: "Cómo combinar volúmenes sin perder actitud.",
    date: "30 Ene 2026",
    image: "/blog-placeholder.svg",
  },
  {
    slug: "studio-sessions",
    title: "Studio Sessions",
    excerpt: "La noche en la que cerramos las piezas del nuevo drop.",
    date: "2 Feb 2026",
    image: "/blog-placeholder.svg",
  },
  {
    slug: "material-review",
    title: "Material Review",
    excerpt: "Algodón pesado, rib y acabados mate. Probamos todo.",
    date: "5 Feb 2026",
    image: "/blog-placeholder.svg",
  },
  {
    slug: "collab-sneak",
    title: "Collab en camino",
    excerpt: "Un adelanto de la colaboración que llega este trimestre.",
    date: "8 Feb 2026",
    image: "/blog-placeholder.svg",
  },
  {
    slug: "street-cast",
    title: "Street Cast",
    excerpt: "Personajes reales que inspiran la próxima campaña.",
    date: "11 Feb 2026",
    image: "/blog-placeholder.svg",
  },
  {
    slug: "drop-02",
    title: "Drop 02: Neon District",
    excerpt: "Luces frías, tipografías crudas y nuevas capas.",
    date: "14 Feb 2026",
    image: "/blog-placeholder.svg",
  },
  {
    slug: "lookbook-preview",
    title: "Preview Lookbook",
    excerpt: "Una mirada al lookbook completo antes del release.",
    date: "18 Feb 2026",
    image: "/blog-placeholder.svg",
  }
];
