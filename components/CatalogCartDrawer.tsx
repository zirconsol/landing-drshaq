"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { useCart } from "@/components/CartProvider";
import WhatsappMark from "@/components/WhatsappMark";
import { formatPrice } from "@/data/drops";
import { trackPublicEvent } from "@/lib/public-analytics";
import { submitPublicRequestFromCart } from "@/lib/public-requests";
import { buildWhatsappLink } from "@/lib/whatsapp";

export default function CatalogCartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lines, totalItems, subtotal, updateQuantity, removeLine } = useCart();
  const whatsappHref = buildWhatsappLink(lines, subtotal);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

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
    <>
      <div
        className={`cart-drawer-overlay ${open ? "is-open" : ""}`}
        aria-hidden="true"
        onClick={onClose}
      />

      <aside
        className={`cart-drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        aria-label="Carrito"
      >
        <header className="cart-drawer-head">
          <h2>Mi compra</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar carrito">
            ×
          </button>
        </header>

        <div className="cart-drawer-progress">
          <span />
        </div>

        <div className="cart-drawer-body">
          {lines.length === 0 ? (
            <p className="cart-drawer-empty">
              Tu carrito está vacío. Agregá productos para armar el pedido.
            </p>
          ) : (
            lines.map((line, index) => (
              <article
                key={line.key}
                className="cart-drawer-line"
                style={{ "--stagger": `${index * 70}ms` } as CSSProperties}
              >
                <div className="cart-drawer-image">
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="88px"
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>

                <div className="cart-drawer-line-main">
                  <h3>{line.name}</h3>
                  <p>
                    {line.selectedSize ? `Talle ${line.selectedSize}` : ""}
                    {line.selectedSize && line.selectedColorName ? " · " : ""}
                    {line.selectedColorName ? `Color ${line.selectedColorName}` : ""}
                  </p>
                  <div className="cart-drawer-qty">
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

                <div className="cart-drawer-line-side">
                  <button
                    type="button"
                    onClick={() => removeLine(line.key)}
                    aria-label="Eliminar producto"
                  >
                    ×
                  </button>
                  <strong>{formatPrice(line.price * line.quantity)}</strong>
                </div>
              </article>
            ))
          )}
        </div>

        <footer className="cart-drawer-footer">
          <div className="cart-drawer-total">
            <span>Total</span>
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

          <div className="cart-drawer-links">
            <button type="button" onClick={onClose}>
              Seguir comprando
            </button>
            <Link href="/drops/carrito" onClick={onClose}>
              Ver carrito
            </Link>
          </div>
        </footer>
      </aside>
    </>
  );
}
