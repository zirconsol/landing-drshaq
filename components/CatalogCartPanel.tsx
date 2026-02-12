"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import WhatsappMark from "@/components/WhatsappMark";
import { formatPrice } from "@/data/drops";
import { trackPublicEvent } from "@/lib/public-analytics";
import { submitPublicRequestFromCart } from "@/lib/public-requests";
import { buildWhatsappLink } from "@/lib/whatsapp";

export default function CatalogCartPanel() {
  const { lines, totalItems, subtotal, updateQuantity, removeLine } = useCart();
  const hasItems = totalItems > 0;
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const whatsappHref = buildWhatsappLink(lines, subtotal);

  const handleCheckoutClick = async () => {
    if (isSubmittingOrder || lines.length === 0) return;
    setIsSubmittingOrder(true);
    void trackPublicEvent("cta_click", "floating_whatsapp");
    const result = await submitPublicRequestFromCart(lines, "floating_whatsapp");
    setIsSubmittingOrder(false);
    if (!result.ok) {
      console.error("No se pudo crear el pedido público", result);
      return;
    }
    const popup = window.open(whatsappHref, "_blank", "noopener,noreferrer");
    if (!popup) {
      window.location.assign(whatsappHref);
    }
  };

  return (
    <aside
      className={`catalog-cart-panel ${hasItems ? "has-items" : "is-empty"}`}
      aria-hidden={!hasItems}
    >
      <div className="catalog-cart-panel-head">
        <h2>Carrito</h2>
        <span>{totalItems} items</span>
      </div>

      {!hasItems ? (
        <p className="catalog-cart-panel-empty">
          Tu carrito está vacío. Agregá productos desde el catálogo.
        </p>
      ) : (
        <div className="catalog-cart-panel-lines">
          {lines.map((line) => (
            <article key={line.key} className="catalog-cart-panel-line">
              <div className="catalog-cart-panel-image">
                <Image
                  src={line.image}
                  alt={line.name}
                  fill
                  sizes="64px"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
              <div className="catalog-cart-panel-info">
                <h3>{line.name}</h3>
                <p>{formatPrice(line.price)}</p>
                <div className="catalog-cart-panel-meta">
                  {line.selectedSize ? <span>Talle {line.selectedSize}</span> : null}
                  {line.selectedColorName ? <span>{line.selectedColorName}</span> : null}
                </div>
              </div>
              <div className="catalog-cart-panel-qty">
                <button
                  type="button"
                  onClick={() => updateQuantity(line.key, line.quantity - 1)}
                  aria-label="Quitar unidad"
                >
                  −
                </button>
                <span>{line.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(line.key, line.quantity + 1)}
                  aria-label="Agregar unidad"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="catalog-cart-panel-remove"
                onClick={() => removeLine(line.key)}
              >
                Eliminar
              </button>
            </article>
          ))}
        </div>
      )}

      <div className="catalog-cart-panel-footer">
        <strong>{formatPrice(subtotal)}</strong>
        <div className="catalog-cart-panel-actions">
          <Link href="/drops/carrito" className="catalog-cart-view">
            Ver carrito
          </Link>
          <button
            type="button"
            className="catalog-cart-whatsapp"
            onClick={handleCheckoutClick}
            disabled={isSubmittingOrder}
          >
            <WhatsappMark size={16} />
            {isSubmittingOrder ? "Creando pedido..." : "Solicitar Pedido"}
          </button>
        </div>
      </div>
    </aside>
  );
}
