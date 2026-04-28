import { notFound } from "next/navigation";
import Link from "next/link";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";

async function getBlog(slug: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("*, author:users!blogs_author_id_fkey(name)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />

      <article className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-16 flex-1">
        {/* Back link */}
        <Link
          href="/blogs"
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)] hover:text-[var(--green-deep)] transition-colors mb-8 inline-block"
        >
          ← All posts
        </Link>

        {/* Meta */}
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)] mb-3 flex flex-wrap items-center gap-3">
          {(blog.author as any)?.name && (
            <span>{(blog.author as any).name}</span>
          )}
          {(blog.author as any)?.name && blog.published_at && (
            <span className="text-[var(--ink-4)]">·</span>
          )}
          {blog.published_at && (
            <span>
              {new Date(blog.published_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {blog.is_featured && (
            <>
              <span className="text-[var(--ink-4)]">·</span>
              <span className="border-2 border-[var(--green-deep)] bg-[var(--green-tint)] px-2 py-0.5 text-[var(--green-deep)]">
                Featured
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-5xl leading-[0.95]">{blog.title}</h1>

        {/* Cover image */}
        {blog.cover_image && (
          <div className="aspect-[16/9] border-2 border-[var(--ink)] bg-[var(--bg-soft)] mt-8 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="border-t-2 border-[var(--ink)] mt-10" />

        {/* Excerpt as pull-quote */}
        {blog.excerpt && (
          <p className="mt-8 text-xl text-[var(--ink-2)] leading-relaxed border-l-4 border-[var(--green)] pl-5">
            {blog.excerpt}
          </p>
        )}

        {/* Content — plain-text rendering preserved from original */}
        <div className="mt-10">
          <div className="whitespace-pre-wrap break-words text-[var(--ink-2)] leading-relaxed text-base font-sans">
            {blog.content}
          </div>
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}
