"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const dropSections = [
  {
    label: "Montaña",
    slug: "montana",
    items: ["Remeras", "Pantalones", "Hoodies"],
  },
  {
    label: "Ye Apparel",
    slug: "ye-apparel",
    items: ["Remeras", "Pantalones", "Hoodies"],
  },
  {
    label: "Camperas",
    slug: "camperas",
    items: ["Livianas", "Abrigo"],
  },
];

export default function CatalogMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropsOpen, setDropsOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setOpenSections((current) => ({
      ...current,
      [label]: !current[label],
    }));
  };

  return (
    <>
      <button
        className="menu-button catalog-menu-button"
        type="button"
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
        aria-controls="catalog-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={`nav-overlay ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="catalog-nav"
        className={`nav-drawer ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="nav-drawer-header catalog-drawer-header">
          <Image
            src="/logo-placeholder.png"
            alt="Dr. Shaq"
            width={220}
            height={80}
            className="drawer-logo"
            priority
          />
          <button
            className="menu-close catalog-menu-close"
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          >
            X
          </button>
        </div>

        <nav className="nav-drawer-links">
          <button
            className={`nav-drawer-root ${dropsOpen ? "is-open" : ""}`}
            type="button"
            aria-expanded={dropsOpen}
            onClick={() => setDropsOpen((open) => !open)}
          >
            Drops
            <span className="nav-drawer-caret" aria-hidden="true">
              ↓
            </span>
          </button>

          <div className={`nav-drawer-group ${dropsOpen ? "is-open" : ""}`}>
            {dropSections.map((section) => (
              <div
                key={section.label}
                className={`nav-drawer-subgroup ${
                  openSections[section.label] ? "is-open" : ""
                }`}
              >
                <button
                  className="nav-drawer-label"
                  type="button"
                  aria-expanded={!!openSections[section.label]}
                  onClick={() => toggleSection(section.label)}
                >
                  {section.label}
                  <span className="nav-drawer-caret" aria-hidden="true">
                    ↓
                  </span>
                </button>
                <div className="nav-drawer-items">
                  {section.items.map((item) => (
                    <Link
                      key={item}
                      href={`/drops/${section.slug}?cat=${encodeURIComponent(
                        item.toLowerCase()
                      )}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Carrito removido del menu desplegable */}
        </nav>
      </aside>
    </>
  );
}
