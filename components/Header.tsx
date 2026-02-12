"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackPublicEvent } from "@/lib/public-analytics";

export default function Header() {
  const [isSolid, setIsSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [drawerDropsOpen, setDrawerDropsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const hideHeader = pathname?.startsWith("/drops");

  const navItems = [{ label: "Noticias", sectionId: "noticias" }];

  const goToSection = (sectionId: string) => {
    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
      return;
    }
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const dropSections = useMemo(
    () => [
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
    ],
    []
  );

  const toggleSection = (label: string) => {
    setOpenSections((current) => ({
      ...current,
      [label]: !current[label],
    }));
  };

  useEffect(() => {
    if (hideHeader) {
      return;
    }

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
  }, [hideHeader]);

  useEffect(() => {
    if (hideHeader) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [hideHeader]);

  if (hideHeader) {
    return null;
  }

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
          {navItems.map((item) => (
            <button
              key={item.label}
              className="nav-link-btn"
              type="button"
              onClick={() => {
                void trackPublicEvent("cta_click", "nav_cta");
                goToSection(item.sectionId);
              }}
            >
              {item.label}
            </button>
          ))}
          <div
            ref={dropdownRef}
            className={`nav-item nav-item-dropdown ${
              dropdownOpen ? "is-open" : ""
            }`}
          >
            <button
              className="nav-trigger"
              type="button"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              Drops
              <span className="nav-caret" aria-hidden="true">
                ↓
              </span>
            </button>
            <div className="nav-dropdown">
              {dropSections.map((section) => (
                <div key={section.label} className="nav-dropdown-group">
                  <Link
                    href={`/drops/${section.slug}`}
                    className="nav-dropdown-title"
                    onClick={() => {
                      void trackPublicEvent("cta_click", "nav_cta");
                      setDropdownOpen(false);
                    }}
                  >
                    {section.label}
                  </Link>
                  <div className="nav-dropdown-links">
                    {section.items.map((item) => (
                      <Link
                        key={item}
                        href={`/drops/${section.slug}?cat=${encodeURIComponent(
                          item.toLowerCase()
                        )}`}
                        className="nav-dropdown-link"
                        onClick={() => {
                          void trackPublicEvent("cta_click", "nav_cta");
                          setDropdownOpen(false);
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          <button
            className={`nav-drawer-root ${
              drawerDropsOpen ? "is-open" : ""
            }`}
            type="button"
            aria-expanded={drawerDropsOpen}
            onClick={() => setDrawerDropsOpen((open) => !open)}
          >
            Drops
            <span className="nav-drawer-caret" aria-hidden="true">
              ↓
            </span>
          </button>

          <div
            className={`nav-drawer-group ${
              drawerDropsOpen ? "is-open" : ""
            }`}
          >
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
                      onClick={() => {
                        void trackPublicEvent("cta_click", "nav_cta");
                        setMenuOpen(false);
                      }}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {navItems.map((item) => (
            <button
              key={item.label}
              className="nav-link-btn"
              type="button"
              onClick={() => {
                setMenuOpen(false);
                void trackPublicEvent("cta_click", "nav_cta");
                goToSection(item.sectionId);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </header>
  );
}
