import Link from "next/link";
import PostCard from "@/components/PostCard";
import { posts } from "@/data/posts";

const POSTS_PER_PAGE = 4;

export default function BlogPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const currentPage = Math.max(
    1,
    Number.parseInt(searchParams?.page ?? "1", 10) || 1
  );
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <section className="section" style={{ paddingTop: "88px" }}>
      <div className="container section-header">
        <div>
          <p className="hero-eyebrow">Blog</p>
          <h1 className="section-title">Noticias y cultura</h1>
        </div>
        <p className="section-copy">Historias de calle. Nuevos drops.</p>
      </div>

      <div className="container blog-grid">
        {visiblePosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="container">
        <div className="pagination" aria-label="Paginado">
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <Link
                key={pageNumber}
                href={`/blog?page=${pageNumber}`}
                aria-current={pageNumber === page ? "page" : undefined}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
