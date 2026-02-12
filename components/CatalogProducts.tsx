"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatPrice, type CatalogItem } from "@/data/drops";
import { trackPublicEvent } from "@/lib/public-analytics";

type Props = {
  items: CatalogItem[];
  dropSlug: string;
};

export default function CatalogProducts({ items, dropSlug }: Props) {
  const [activeIndexes, setActiveIndexes] = useState<Record<string, number>>({});
  const [addedFeedback, setAddedFeedback] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<Record<string, number>>({});
  const { addToCart } = useCart();
  const router = useRouter();

  const supportsHover = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const setIndex = (id: string, index: number) => {
    setActiveIndexes((current) => ({ ...current, [id]: index }));
  };

  const handleAddToCart = (item: CatalogItem) => {
    const selectedSize = selectedSizeMap[item.id] ?? item.sizes[0];
    const selectedColorIndex = selectedColorMap[item.id] ?? 0;
    const selectedColor = item.colors[selectedColorIndex] ?? item.colors[0];

    addToCart({
      product: item,
      selectedSize,
      selectedColor,
      source: "product_card",
    });
    setAddedFeedback((current) => ({ ...current, [item.id]: true }));
    window.setTimeout(
      () => setAddedFeedback((current) => ({ ...current, [item.id]: false })),
      1000
    );
  };

  const onTouchStart = (id: string, clientX: number) => {
    touchStartX.current[id] = clientX;
  };

  const [selectedSizeMap, setSelectedSizeMap] = useState<Record<string, string>>(
    {}
  );
  const [selectedColorMap, setSelectedColorMap] = useState<Record<string, number>>(
    {}
  );

  const setSelectedSize = (itemId: string, size: string) => {
    setSelectedSizeMap((current) => ({ ...current, [itemId]: size }));
  };

  const setSelectedColor = (itemId: string, colorIndex: number) => {
    setSelectedColorMap((current) => ({ ...current, [itemId]: colorIndex }));
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

  const goToProduct = (productId: string) => {
    void trackPublicEvent("cta_click", "catalog_grid", { productId });
    router.push(`/drops/${dropSlug}/producto/${productId}`);
  };

  return (
    <section className="catalog-grid">
      {items.map((item) => {
        const images = item.images.length ? item.images : [item.image];
        const maxIndex = images.length - 1;
        const activeIndex = Math.min(activeIndexes[item.id] ?? 0, maxIndex);
        const selectedSize = selectedSizeMap[item.id] ?? item.sizes[0];
        const selectedColorIndex = selectedColorMap[item.id] ?? 0;

        return (
          <article
            key={item.id}
            className="catalog-card"
            role="link"
            tabIndex={0}
            aria-label={`Ver detalle de ${item.name}`}
            onClick={() => goToProduct(item.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                goToProduct(item.id);
              }
            }}
          >
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
                      unoptimized
                    />
                  </div>
                  <div className="catalog-media-fade-layer catalog-media-fade-hover">
                    <Image
                      src={images[Math.min(1, maxIndex)]}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                      unoptimized
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
                      unoptimized
                    />
                  </div>
                ))}
              </div>
              {item.tag ? <span className="catalog-tag">{item.tag}</span> : null}
            </div>
            <div className="catalog-card-body">
              <h4>{item.name}</h4>
              <span>{formatPrice(item.price)}</span>

              <div
                className="catalog-card-options"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="catalog-size-picks">
                  {item.sizes.map((size) => (
                    <button
                      key={`${item.id}-size-${size}`}
                      type="button"
                      className={`catalog-size-chip ${
                        selectedSize === size ? "is-active" : ""
                      }`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedSize(item.id, size);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="catalog-color-picks">
                  {item.colors.map((color, index) => (
                    <button
                      key={`${item.id}-color-${color.name}`}
                      type="button"
                      aria-label={color.name}
                      className={`catalog-color-chip ${
                        selectedColorIndex === index ? "is-active" : ""
                      }`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedColor(item.id, index);
                      }}
                    >
                      <span style={{ backgroundColor: color.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="catalog-card-actions"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className={`catalog-add-button ${
                    addedFeedback[item.id] ? "is-added" : ""
                  }`}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAddToCart(item);
                  }}
                >
                  <span className="catalog-add-icon" aria-hidden="true">
                    +
                  </span>
                  <span>Agregar al carrito</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
