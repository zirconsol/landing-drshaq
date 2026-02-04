"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isSolid, setIsSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Noticias", href: "#noticias" },
    { label: "Catálogo", href: "#catalogo" },
  ];

  useEffect(() => {
    const hero = document.querySelector(".hero");

    if (!hero) {
      setIsSolid(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSolid(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "-80px 0px 0px 0px",
      }
    );

    observer.observe(hero);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <header className={`header ${isSolid ? "header-solid" : ""}`}>
      <div className="container header-inner">
        <Link href="/" className="logo">
          <Image
            src="/logo-placeholder.png"
            alt="Dr. Shaq"
            width={597}
            height={418}
            priority
            className="logo-image"
          />
        </Link>
        <nav className="nav">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            )
          )}
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div
        className={`nav-overlay ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="mobile-nav"
        className={`nav-drawer ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="nav-drawer-header">
          <Image
            src="/logo-placeholder.png"
            alt="Dr. Shaq"
            width={597}
            height={418}
            className="drawer-logo"
            priority
          />
          <button
            className="menu-close"
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          >
            X
          </button>
        </div>
        <nav className="nav-drawer-links">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            )
          )}
        </nav>
      </aside>
    </header>
  );
}
