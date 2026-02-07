"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import type { CatalogItem } from "@/data/drops";

type Props = {
  items: Array<CatalogItem & { images?: string[] }>;
};

export default function CatalogProducts({ items }: Props) {
  const [activeIndexes, setActiveIndexes] = useState<Record<string, number>>({});
  const touchStartX = useRef<Record<string, number>>({});

  const supportsHover = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const setIndex = (id: string, index: number) => {
    setActiveIndexes((current) => ({ ...current, [id]: index }));
  };

  const onTouchStart = (id: string, clientX: number) => {
    touchStartX.current[id] = clientX;
  };

  const onTouchEnd = (id: string, clientX: number, maxIndex: number) => {
    const start = touchStartX.current[id];
    if (typeof start !== "number") return;
    const delta = start - clientX;
    const threshold = 30;
    const current = activeIndexes[id] ?? 0;
    if (delta > threshold) setIndex(id, Math.min(current + 1, maxIndex));
    if (delta < -threshold) setIndex(id, Math.max(current - 1, 0));
  };

  return (
    <section className="catalog-grid">
      {items.map((item) => {
        const images = item.images?.length ? item.images : [item.image];
        const maxIndex = images.length - 1;
        const activeIndex = Math.min(activeIndexes[item.id] ?? 0, maxIndex);

        return (
          <article key={item.id} className="catalog-card">
            <div
              className={`catalog-card-media ${images.length > 1 ? "is-swipe" : ""}`}
              onMouseEnter={() => {
                if (supportsHover && images.length > 1) setIndex(item.id, 1);
              }}
              onMouseLeave={() => {
                if (supportsHover && images.length > 1) setIndex(item.id, 0);
              }}
              onTouchStart={(event) =>
                onTouchStart(item.id, event.changedTouches[0].clientX)
              }
              onTouchEnd={(event) =>
                onTouchEnd(item.id, event.changedTouches[0].clientX, maxIndex)
              }
              onTouchCancel={() => {
                touchStartX.current[item.id] = 0;
              }}
            >
              {images.length > 1 ? (
                <div className="catalog-media-fade" aria-hidden="true">
                  <div className="catalog-media-fade-layer">
                    <Image
                      src={images[0]}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="catalog-media-fade-layer catalog-media-fade-hover">
                    <Image
                      src={images[Math.min(1, maxIndex)]}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              ) : null}
              <div
                className="catalog-media-track"
                style={{
                  transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
                }}
              >
                {images.map((src, index) => (
                  <div key={`${item.id}-${index}`} className="catalog-media-slide">
                    <Image
                      src={src}
                      alt={item.name}
                      fill
                      sizes="(max-width: 900px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
              {item.tag ? <span className="catalog-tag">{item.tag}</span> : null}
            </div>
            <div className="catalog-card-body">
              <h4>{item.name}</h4>
              <span>{item.price}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
