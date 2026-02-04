import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-media">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="product-body">
        <h3 className="product-title">{product.name}</h3>
        {product.price ? (
          <p className="product-price">{product.price}</p>
        ) : null}
        <div className="product-swatches" aria-hidden="true">
          <span className="swatch swatch-dark" />
          <span className="swatch swatch-light" />
          <span className="swatch swatch-accent" />
        </div>
        <Link className="product-link" href={`/product/${product.slug}`}>
          Ver más
        </Link>
      </div>
    </article>
  );
}
