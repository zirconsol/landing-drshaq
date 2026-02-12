"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import WhatsappMark from "@/components/WhatsappMark";
import { formatPrice } from "@/data/drops";
import { trackPublicEvent } from "@/lib/public-analytics";
import { submitPublicRequestFromCart } from "@/lib/public-requests";
import { buildWhatsappLink } from "@/lib/whatsapp";

export default function CatalogCartBar() {
  const { lines, totalItems, subtotal } = useCart();
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  if (totalItems === 0) {
    return null;
  }

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
    <div className="catalog-cart-bar">
      <div className="catalog-cart-bar-summary">
        <strong>{totalItems} productos</strong>
        <span>{formatPrice(subtotal)}</span>
      </div>

      <div className="catalog-cart-bar-actions">
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
  );
}
