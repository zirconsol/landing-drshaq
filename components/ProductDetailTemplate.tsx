"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { CatalogItem } from "@/data/drops";
import { formatPrice } from "@/data/drops";

export default function ProductDetailTemplate({
  product,
}: {
  product: CatalogItem;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const { addToCart } = useCart();

  const activeColor = useMemo(
    () => product.colors[selectedColorIndex],
    [product.colors, selectedColorIndex]
  );

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity: 1,
      selectedSize,
      selectedColor: activeColor,
      source: "product_detail",
    });
    setFeedback("Agregado al carrito");
    window.setTimeout(() => setFeedback(""), 1200);
  };

  return (
    <section className="product-detail">
      <div className="product-detail-media">
        <div className="product-detail-thumbs">
          {product.images.map((src, index) => (
            <button
              key={`${product.id}-thumb-${index}`}
              type="button"
              className={`product-thumb ${activeImage === index ? "is-active" : ""}`}
              onClick={() => setActiveImage(index)}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image src={src} alt="" fill sizes="80px" style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
        <div className="product-detail-main">
          <Image
            src={product.images[activeImage] ?? product.image}
            alt={product.name}
            fill
            sizes="(max-width: 900px) 100vw, 55vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>

      <article className="product-detail-info">
        {product.tag ? <p className="product-detail-tag">{product.tag}</p> : null}
        <h1>{product.name}</h1>
        <p className="product-detail-price">{formatPrice(product.price)}</p>
        <p className="product-detail-copy">{product.description}</p>

        <div className="product-detail-selectors">
          <div className="product-selector-block">
            <div className="product-selector-head">
              <h2>Talles</h2>
            </div>
            <div className="product-size-grid">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`product-size ${selectedSize === size ? "is-active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-selector-block">
            <h2>Colores</h2>
            <div className="product-color-grid">
              {product.colors.map((color, index) => (
                <button
                  key={color.name}
                  type="button"
                  className={`product-color ${selectedColorIndex === index ? "is-active" : ""}`}
                  onClick={() => setSelectedColorIndex(index)}
                  aria-label={color.name}
                  title={color.name}
                >
                  <span style={{ backgroundColor: color.hex }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="product-detail-actions">
          <button type="button" className="button-primary" onClick={handleAddToCart}>
            Agregar al carrito
          </button>
          <Link href="/drops/carrito" className="button-secondary">
            Ver carrito
          </Link>
        </div>

        {feedback ? <p className="product-feedback">{feedback}</p> : null}
      </article>
    </section>
  );
}
