import { notFound } from "next/navigation";
import CatalogTopbar from "@/components/CatalogTopbar";
import ProductDetailTemplate from "@/components/ProductDetailTemplate";
import { catalogItems, drops, getCatalogItem } from "@/data/drops";

type Params = { slug: string; productId: string };

export function generateStaticParams() {
  return catalogItems.map((item) => ({
    slug: item.dropSlug,
    productId: item.id,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, productId } = await params;

  const drop = drops.find((item) => item.slug === slug);
  if (!drop) {
    notFound();
  }

  const product = getCatalogItem(slug, productId);
  if (!product) {
    notFound();
  }

  return (
    <div className="catalog-page">
      <CatalogTopbar />
      <ProductDetailTemplate product={product} />
    </div>
  );
}
