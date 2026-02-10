"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import WhatsappMark from "@/components/WhatsappMark";
import { formatPrice } from "@/data/drops";
import { buildWhatsappLink } from "@/lib/whatsapp";

export default function CatalogCartBar() {
  const { lines, totalItems, subtotal } = useCart();

  if (totalItems === 0) {
    return null;
  }

  const whatsappHref = buildWhatsappLink(lines, subtotal);

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
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="catalog-cart-whatsapp"
        >
          <WhatsappMark size={16} />
          Solicitar Pedido
        </a>
      </div>
    </div>
  );
}

