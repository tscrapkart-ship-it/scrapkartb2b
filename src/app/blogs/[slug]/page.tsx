import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  content: string | null;
  author_name: string | null;
  is_featured: boolean;
  published_at: string | null;
};

async function getBlog(slug: string): Promise<Blog | null> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, cover_image, content, author_name, is_featured, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return (data as Blog | null) ?? null;
}

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />

      <article className="pt-12 md:pt-16 pb-[var(--section-y)] flex-1">
        <div className="container-narrow">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-3)] hover:text-[var(--forest)] transition-colors mb-8"
          >
            <ArrowLeft className="size-3.5" /> All articles
          </Link>

          <div className="flex items-center gap-3 mb-5">
            {blog.is_featured && (
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--forest)] bg-[var(--forest-tint)] rounded-[var(--radius-xs)] px-2 py-1 font-medium">
                Featured
              </span>
            )}
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
              {fmtDate(blog.published_at)}
            </span>
            {blog.author_name && (
              <>
                <span className="font-mono text-[11px] text-[var(--ink-4)]">·</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                  {blog.author_name}
                </span>
              </>
            )}
          </div>

          <h1 className="text-[clamp(36px,5vw,52px)] font-semibold tracking-[var(--tracking-display)] leading-[1.02]">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-6 text-[18px] md:text-[19px] text-[var(--ink-2)] leading-[1.55] max-w-[640px]">
              {blog.excerpt}
            </p>
          )}

          {blog.cover_image && (
            <div className="mt-10 rounded-[var(--radius-lg)] overflow-hidden border border-[var(--line)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={blog.cover_image} alt={blog.title} className="w-full" />
            </div>
          )}

          {blog.content && (
            <div
              className="prose-blog mt-12 text-[16.5px] text-[var(--ink-2)] leading-[1.7]"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          )}
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}
