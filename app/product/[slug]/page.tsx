import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = products.find((item) => item.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="section" style={{ paddingTop: "88px" }}>
      <div className="container hero-grid">
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="card-image">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <div>
          <p className="hero-eyebrow">Detalle</p>
          <h1 className="section-title">{product.name}</h1>
          {product.price ? (
            <p className="card-meta" style={{ fontSize: "18px" }}>
              {product.price}
            </p>
          ) : null}
          <p className="hero-copy" style={{ marginTop: "18px" }}>
            {product.description ??
              "Materiales, fit y detalles clave."}
          </p>
          <div className="hero-actions">
            <Link className="button-primary" href="#">
              Comprar
            </Link>
            <Link className="button-secondary" href="/">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
