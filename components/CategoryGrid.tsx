"use client";

import { useEffect, useRef } from "react";
import { trackPublicEvent } from "@/lib/public-analytics";

export type Category = {
  name: string;
  image: string;
  description: string;
  href: string;
};

export default function CategoryGrid({
  categories,
}: {
  categories: Category[];
}) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const clearTimer = useRef<number | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(
      grid.querySelectorAll<HTMLElement>(".category-card")
    );

    const revealObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cards.forEach((card) => card.classList.add("is-visible"));
          revealObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    revealObserver.observe(grid);

    const mobileQuery = window.matchMedia("(max-width: 640px)");
    let activeObserver: IntersectionObserver | null = null;

    if (mobileQuery.matches) {
      activeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const card = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              card.classList.add("is-active");
            } else {
              card.classList.remove("is-active");
            }
          });
        },
        { threshold: 0.6 }
      );

      cards.forEach((card) => activeObserver?.observe(card));
    }

    return () => {
      revealObserver.disconnect();
      activeObserver?.disconnect();
    };
  }, []);

  const handleTouch = (event: React.TouchEvent<HTMLAnchorElement>) => {
    if (clearTimer.current) {
      window.clearTimeout(clearTimer.current);
    }
    const card = event.currentTarget;
    card.classList.add("is-touch");
    clearTimer.current = window.setTimeout(() => {
      card.classList.remove("is-touch");
    }, 1200);
  };

  return (
    <div ref={gridRef} className="container category-grid">
      {categories.map((category, index) => (
        <a
          key={category.name}
          href={category.href}
          className="category-card"
          style={{ ["--delay" as string]: `${index * 90}ms` }}
          onTouchStart={handleTouch}
          onClick={() => {
            void trackPublicEvent("cta_click", "category_grid");
          }}
        >
          <img src={category.image} alt={category.name} />
          <div className="category-content">
            <span className="category-title">{category.name}</span>
            <span className="category-subtitle">{category.description}</span>
          </div>
          <span className="category-hint">
            Explorar
            <span className="category-arrow">→</span>
          </span>
        </a>
      ))}
    </div>
  );
}
