import { notFound } from "next/navigation";
import CatalogTopbar from "@/components/CatalogTopbar";
import ProductDetailTemplate from "@/components/ProductDetailTemplate";
import { drops } from "@/data/drops";
import { getCatalogProductById } from "@/lib/catalog-api";

type Params = { slug: string; productId: string };

export const dynamic = "force-dynamic";

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

  const product = await getCatalogProductById(slug, productId);
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
