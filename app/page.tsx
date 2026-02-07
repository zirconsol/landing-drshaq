import Link from "next/link";
import type { CSSProperties } from "react";
import CategoryGrid from "@/components/CategoryGrid";

const categories = [
  {
    name: "Montaña",
    image: "/mountain-placeholder.jpg",
    description: "Urbano con clima frío.",
    href: "/drops/montana",
  },
  {
    name: "Ye Apparel",
    image: "/ye-placeholder.jpg",
    description: "Street clean y premium.",
    href: "/drops/ye-apparel",
  },
  {
    name: "Camperas",
    image: "/jacket-placeholder.jpg",
    description: "Capas para la noche.",
    href: "/drops/camperas",
  },
];

export default function HomePage() {
  const heroStyle = {
    "--hero-image": "url('/hero-placeholder.png')",
  } as CSSProperties;

  return (
    <>
      <section className="hero" style={heroStyle}>
        <div className="container hero-content">
          <h1 className="hero-title fade-up delay-1">Streetwear sin reglas.</h1>
          <p className="hero-copy fade-up delay-2">
            Actitud urbana. Todos los días.
          </p>
          <div className="hero-actions fade-up delay-2">
            <Link className="button-primary" href="#catalogo">
              Ver Drops
            </Link>
            <Link className="button-secondary" href="/blog">
              Ir al blog
            </Link>
          </div>
        </div>
      </section>
      <section id="catalogo" className="section">
        <div className="container section-header">
          <div>
            <h2 className="section-title">Drops disponibles</h2>
          </div>
        </div>
        <CategoryGrid categories={categories} />
      </section>

      <section
        id="noticias"
        className="news-band"
        style={{ "--news-image": "url('/news-placeholder.jpg')" } as CSSProperties}
      >
        <div className="container news-content">
          <span className="news-pill">Noticias</span>
          <h2 className="section-title">BADBO 1.0 · Brown</h2>
          <p className="section-copy">
            Adidas y Bad Bunny lanzaron por sorpresa las BadBo 1.0 “Brown”,
            una edición ultra limitada de solo 1.994 pares numerados. El
            modelo se agotó en cerca de una hora, confirmando el impacto del
            primer diseño propio del artista. Para quienes quedaron afuera, ya
            se anticipó el próximo colorway: “Resiliencia White”.
          </p>
          <div className="hero-actions">
            <Link className="button-secondary" href="/blog">
              Leer más
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
