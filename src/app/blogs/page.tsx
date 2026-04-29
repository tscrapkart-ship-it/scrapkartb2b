import Link from "next/link";
import { BookOpen } from "lucide-react";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  is_featured: boolean;
  published_at: string | null;
};

async function getBlogs(): Promise<Blog[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, cover_image, is_featured, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return (data ?? []) as Blog[];
}

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />

      {/* Editorial header */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container-page max-w-4xl">
          <p className="mono-caption">Field notes</p>
          <h1 className="mt-3 text-[clamp(40px,6vw,68px)] font-semibold tracking-[var(--tracking-display)] leading-[0.98]">
            ScrapKart <span className="italic-accent">journal.</span>
          </h1>
          <p className="mt-5 text-[17px] md:text-[18px] text-[var(--ink-2)] max-w-[600px] leading-[1.55]">
            Writing on industrial scrap markets, recycling logistics, and the operating mechanics of the circular economy in India.
          </p>
        </div>
      </section>

      <section className="pb-[var(--section-y)] flex-1">
        <div className="container-page">
          {blogs.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper-2)] py-20 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--paper)] mb-4">
                <BookOpen className="size-5 text-[var(--ink-3)]" />
              </div>
              <p className="text-[16px] font-semibold">No posts yet.</p>
              <p className="text-[14px] text-[var(--ink-3)] mt-1">Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col"
                >
                  {blog.cover_image && (
                    <div className="aspect-[16/10] rounded-[var(--radius-lg)] bg-[var(--paper-2)] overflow-hidden mb-5 border border-[var(--line)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    {blog.is_featured && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--forest)] bg-[var(--forest-tint)] rounded-[var(--radius-xs)] px-2 py-1 font-medium">
                        Featured
                      </span>
                    )}
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                      {fmtDate(blog.published_at)}
                    </span>
                  </div>
                  <h3 className="text-[20px] font-semibold tracking-[-0.015em] leading-tight group-hover:text-[var(--forest)] transition-colors">
                    {blog.title}
                  </h3>
                  {blog.excerpt && (
                    <p className="mt-3 text-[14.5px] text-[var(--ink-2)] leading-[1.55] line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}
                  <span className="mt-4 text-[13px] font-medium text-[var(--ink-3)] group-hover:text-[var(--forest)] transition-colors">
                    Read article →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
