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

export default function CartDetail() {
  const { lines, totalItems, subtotal, updateQuantity, removeLine, clearCart } =
    useCart();
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

  if (lines.length === 0) {
    return (
      <section className="cart-page">
        <div className="cart-empty">
          <h1>Carrito vacío</h1>
          <p>Agregá productos desde los drops para armar tu pedido.</p>
          <Link className="button-primary" href="/drops/montana">
            Ir a Drops
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page cart-page-minimal">
      <div className="cart-layout">
        <div className="cart-lines">
          <header className="cart-list-header">
            <h1>Carrito</h1>
            <span>{totalItems} productos</span>
          </header>

          {lines.map((line) => (
            <article key={line.key} className="cart-line">
              <div className="cart-line-image">
                <Image
                  src={line.image}
                  alt={line.name}
                  fill
                  sizes="112px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="cart-line-main">
                <div className="cart-line-info">
                  <h3>{line.name}</h3>
                  <p>{formatPrice(line.price)}</p>
                </div>

                <div className="cart-line-options">
                  <div className="cart-line-meta">
                    {line.selectedSize ? <span>Talle {line.selectedSize}</span> : null}
                    {line.selectedColorName ? (
                      <span>
                        {line.selectedColorHex ? (
                          <i
                            className="cart-color-dot"
                            style={{ backgroundColor: line.selectedColorHex }}
                          />
                        ) : null}
                        {line.selectedColorName}
                      </span>
                    ) : null}
                  </div>

                  <div className="cart-line-qty">
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
                </div>
              </div>

              <button
                type="button"
                className="cart-line-remove"
                onClick={() => removeLine(line.key)}
              >
                ×
              </button>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Resumen</h2>
          <div className="cart-summary-line">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <button
            type="button"
            className="whatsapp-checkout"
            onClick={handleCheckoutClick}
            disabled={isSubmittingOrder}
          >
            <WhatsappMark size={18} />
            {isSubmittingOrder ? "Creando pedido..." : "Solicitar Pedido"}
          </button>

          <button type="button" className="cart-clear" onClick={clearCart}>
            Vaciar carrito
          </button>

          <p className="cart-backend-note">
            {/* TODO: integrar checkout con backend cuando exista inventario real */}
            Checkout en modo mockup. Confirmación final por WhatsApp.
          </p>
        </aside>
      </div>
    </section>
  );
}
