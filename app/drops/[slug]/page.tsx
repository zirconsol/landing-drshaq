import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CatalogMenu from "@/components/CatalogMenu";
import CatalogProducts from "@/components/CatalogProducts";
import { catalogItems, drops } from "@/data/drops";

export function generateStaticParams() {
  return drops.map((drop) => ({ slug: drop.slug }));
}

type DropParams = { slug: string };
type DropSearch = { cat?: string };

export default async function DropPage({
  params,
  searchParams,
}: {
  params: Promise<DropParams>;
  searchParams?: Promise<DropSearch>;
}) {
  const resolvedParams = await params;
  const resolvedSearch: DropSearch = (await searchParams) ?? {};
  const drop = drops.find((item) => item.slug === resolvedParams.slug);
  const selectedCategory = resolvedSearch.cat?.toLowerCase();

  if (!drop) {
    notFound();
  }

  const itemsForDrop = catalogItems.map((item) => ({
    ...item,
    images:
      drop.slug === "camperas"
        ? [
            "/images/nike-light/cover.png",
            "/images/nike-light/01.png",
            "/images/nike-light/02.png",
          ]
        : [item.image],
  }));

  return (
    <div className="catalog-page">
      <header className="catalog-topbar">
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
        <div className="catalog-search">
          <span className="catalog-search-icon">⌕</span>
          <input
            type="text"
            placeholder="Buscar"
            aria-label="Buscar en el catalogo"
          />
        </div>
        <button className="catalog-cart" type="button" aria-label="Carrito">
          <span>🛒</span>
        </button>
        <CatalogMenu />
      </header>

      <section className="catalog-hero">
        <div className="catalog-hero-media">
          <Image
            src={drop.heroImage}
            alt={drop.name}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className="catalog-hero-content">
          <h1>{drop.name}</h1>
          <p>{drop.description}</p>
        </div>
      </section>

      <div className="catalog-layout">
        <aside className="catalog-filters">
          <h2>Filtros</h2>

          <div className="filter-columns">
            {drop.brands ? (
              <div className="filter-block">
                <h3>Marcas</h3>
                <div className="filter-list">
                  {drop.brands.map((brand) => (
                    <label key={brand}>
                      <input type="checkbox" />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="filter-block">
              <h3>Categoria</h3>
              <div className="filter-list">
                {drop.subcategories.map((subcategory) => (
                  <label key={subcategory}>
                    <input
                      type="checkbox"
                      defaultChecked={
                        selectedCategory === subcategory.toLowerCase()
                      }
                    />
                    <span>{subcategory}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-block">
            <h3>Colores</h3>
            <div className="filter-swatches">
              {drop.colors.map((color) => (
                <button key={color} type="button" aria-label={color}>
                  {color}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <CatalogProducts items={itemsForDrop} />
      </div>
    </div>
  );
}
