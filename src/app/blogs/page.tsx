import Link from "next/link";
import { BookOpen } from "lucide-react";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";

async function getBlogs() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, cover_image, is_featured, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />

      {/* Hero block */}
      <section className="border-b-2 border-[var(--ink)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-6xl uppercase">
            ScrapKart{" "}
            <em
              className="font-serif-italic text-[var(--green-deep)]"
              style={{ fontStyle: "italic" }}
            >
              blog.
            </em>
          </h1>
          <p className="text-base md:text-lg mt-5 max-w-xl text-[var(--ink-2)]">
            Insights on industrial scrap, recycling, and the circular economy.
          </p>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-16 flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--ink)] bg-[var(--bg-soft)] py-24 text-center">
              <div className="flex h-14 w-14 items-center justify-center border-2 border-[var(--ink)] bg-[var(--paper)] mb-4">
                <BookOpen className="h-7 w-7 text-[var(--ink-3)]" />
              </div>
              <p className="font-display text-lg uppercase">No posts yet</p>
              <p className="text-sm text-[var(--ink-3)] mt-1">Check back soon for new articles.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog: any) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard press-in flex flex-col group"
                >
                  {blog.cover_image && (
                    <div className="aspect-[16/9] border-b-2 border-[var(--ink)] bg-[var(--bg-soft)] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      {blog.is_featured && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] border-2 border-[var(--green-deep)] bg-[var(--green-tint)] px-2 py-0.5 text-[var(--green-deep)]">
                          Featured
                        </span>
                      )}
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
                        {blog.published_at
                          ? new Date(blog.published_at).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </span>
                    </div>
                    <h3 className="font-display text-xl leading-tight">{blog.title}</h3>
                    {blog.excerpt && (
                      <p className="text-sm text-[var(--ink-2)] flex-1 line-clamp-2">{blog.excerpt}</p>
                    )}
                    <span className="font-display text-xs uppercase tracking-[0.1em] mt-2 text-[var(--ink-3)] group-hover:text-[var(--green-deep)] transition-colors">
                      Read article →
                    </span>
                  </div>
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
