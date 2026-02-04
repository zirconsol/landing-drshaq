import Image from "next/image";
import type { Post } from "@/data/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="card">
      <div className="card-image">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="card-content">
        <div>
          <p className="card-meta">{post.date}</p>
          <h3 className="card-title">{post.title}</h3>
          <p className="card-meta">{post.excerpt}</p>
        </div>
      </div>
    </article>
  );
}
