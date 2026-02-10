"use client";

import { useCart } from "@/components/CartProvider";

export default function CatalogCartButton({
  onClick,
}: {
  onClick: () => void;
}) {
  const { totalItems } = useCart();

  return (
    <button
      type="button"
      className="catalog-cart-link"
      aria-label="Carrito"
      onClick={onClick}
    >
      <svg
        className="catalog-cart-icon-svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M7.5 8V6.5a4.5 4.5 0 0 1 9 0V8M5 8.5h14v8.2a3.3 3.3 0 0 1-3.3 3.3H8.3A3.3 3.3 0 0 1 5 16.7V8.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {totalItems > 0 ? <span className="catalog-cart-badge">{totalItems}</span> : null}
    </button>
  );
}
