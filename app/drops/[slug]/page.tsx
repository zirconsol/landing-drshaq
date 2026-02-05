import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CatalogMenu from "@/components/CatalogMenu";
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
  params: DropParams | Promise<DropParams>;
  searchParams?: DropSearch | Promise<DropSearch>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearch = await Promise.resolve(searchParams ?? {});
  const drop = drops.find((item) => item.slug === resolvedParams.slug);
  const selectedCategory = resolvedSearch.cat?.toLowerCase();

  if (!drop) {
    notFound();
  }

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

        <section className="catalog-grid">
          {catalogItems.map((item) => (
            <article key={item.id} className="catalog-card">
              <div className="catalog-card-media">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 900px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
                {item.tag ? (
                  <span className="catalog-tag">{item.tag}</span>
                ) : null}
              </div>
              <div className="catalog-card-body">
                <h4>{item.name}</h4>
                <span>{item.price}</span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
