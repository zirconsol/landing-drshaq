"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import CatalogCartButton from "@/components/CatalogCartButton";
import CatalogCartDrawer from "@/components/CatalogCartDrawer";
import { drops } from "@/data/drops";

export default function CatalogTopbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [activeDropSlug, setActiveDropSlug] = useState<string | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);

  const activeDrop = useMemo(
    () => drops.find((drop) => drop.slug === activeDropSlug) ?? null,
    [activeDropSlug]
  );

  const cancelMegaClose = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleMegaClose = () => {
    cancelMegaClose();
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveDropSlug(null);
      closeTimeoutRef.current = null;
    }, 180);
  };

  useEffect(() => {
    if (cartOpen) {
      if (previousBodyOverflowRef.current === null) {
        previousBodyOverflowRef.current = document.body.style.overflow;
      }
      document.body.style.overflow = "hidden";
      return;
    }

    if (previousBodyOverflowRef.current !== null) {
      document.body.style.overflow = previousBodyOverflowRef.current;
      previousBodyOverflowRef.current = null;
    } else if (document.body.style.overflow === "hidden") {
      document.body.style.overflow = "";
    }
  }, [cartOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
        previousBodyOverflowRef.current = null;
      } else if (document.body.style.overflow === "hidden") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  return (
    <>
      <header className="catalog-header">
        <div className="catalog-topbar">
          <Link href="/" className="catalog-logo">
            <Image
              src="/logo-placeholder.png"
              alt="Dr. Shaq"
              width={180}
              height={60}
              className="catalog-logo-image"
              priority
            />
          </Link>

          <nav
            className="catalog-header-nav"
            aria-label="Navegación de drops"
            onMouseEnter={cancelMegaClose}
            onMouseLeave={scheduleMegaClose}
          >
            {drops.map((drop) => (
              <div
                key={drop.slug}
                className="catalog-nav-item"
                onMouseEnter={() => {
                  cancelMegaClose();
                  setActiveDropSlug(drop.slug);
                }}
                onFocusCapture={() => setActiveDropSlug(drop.slug)}
              >
                <Link
                  href={`/drops/${drop.slug}`}
                  className={`catalog-nav-link ${
                    activeDropSlug === drop.slug ? "is-active" : ""
                  }`}
                >
                  {drop.name}
                </Link>
              </div>
            ))}

            <div
              className={`catalog-nav-mega ${activeDrop ? "is-open" : ""}`}
              onMouseEnter={cancelMegaClose}
              onMouseLeave={scheduleMegaClose}
            >
              {activeDrop ? (
                <>
                  <div className="catalog-nav-col">
                    <h4>Categorías</h4>
                    {activeDrop.subcategories.map((subcategory) => (
                      <Link
                        key={`${activeDrop.slug}-${subcategory}`}
                        href={`/drops/${activeDrop.slug}?cat=${encodeURIComponent(
                          subcategory.toLowerCase()
                        )}`}
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </div>

                  <div className="catalog-nav-col">
                    <h4>Marcas</h4>
                    {activeDrop.brands && activeDrop.brands.length > 0 ? (
                      activeDrop.brands.map((brand) => (
                        <Link
                          key={`${activeDrop.slug}-${brand}`}
                          href={`/drops/${activeDrop.slug}`}
                        >
                          {brand}
                        </Link>
                      ))
                    ) : (
                      <span className="catalog-nav-muted">Sin marcas externas</span>
                    )}
                  </div>

                  <div className="catalog-nav-col">
                    <h4>Colores</h4>
                    {activeDrop.colors.map((color) => (
                      <Link key={`${activeDrop.slug}-${color}`} href={`/drops/${activeDrop.slug}`}>
                        {color}
                      </Link>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </nav>

          <div className="catalog-topbar-tools">
            <div className="catalog-search">
              <span className="catalog-search-icon">⌕</span>
              <input type="text" placeholder="Buscar" aria-label="Buscar en el catalogo" />
            </div>
            <CatalogCartButton onClick={() => setCartOpen(true)} />
          </div>
        </div>

        <nav className="catalog-mobile-nav" aria-label="Navegación móvil">
          {drops.map((drop) => (
            <details key={`m-${drop.slug}`} className="catalog-mobile-drop">
              <summary>{drop.name}</summary>
              <div className="catalog-mobile-subcats">
                {drop.subcategories.map((subcategory) => (
                  <Link
                    key={`m-${drop.slug}-${subcategory}`}
                    href={`/drops/${drop.slug}?cat=${encodeURIComponent(
                      subcategory.toLowerCase()
                    )}`}
                  >
                    {subcategory}
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </nav>
      </header>

      <CatalogCartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
