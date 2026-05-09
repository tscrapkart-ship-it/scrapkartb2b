import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteBlogButton } from "./delete-blog-button";

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
};

async function getBlogs(): Promise<BlogRow[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("id, title, slug, is_published, is_featured, published_at, created_at")
    .order("created_at", { ascending: false });
  return (data as BlogRow[] | null) ?? [];
}

export default async function AdminBlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Blog</h1>
          <p className="mt-1 text-base text-[var(--ink-3)]">Create and manage published blog posts</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--line)] py-16 text-center">
          <BookOpen className="h-8 w-8 text-[var(--ink-4)]" />
          <p className="text-base text-[var(--ink-3)]">No blog posts yet</p>
          <Link href="/admin/blog/new">
            <Button>Write First Post</Button>
          </Link>
        </div>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-base">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Title</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Status</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Featured</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Created</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line-2)]">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[var(--paper-2)] transition-colors">
                    <td className="px-4 py-4 sm:px-5">
                      <p className="max-w-[200px] truncate font-medium text-[var(--ink)]">{blog.title}</p>
                      <p className="max-w-[200px] truncate text-sm text-[var(--ink-3)]">/{blog.slug}</p>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-medium ${blog.is_published ? "bg-[var(--forest-tint)] text-[var(--forest)]" : "bg-[var(--paper-2)] text-[var(--ink-3)]"}`}>
                        {blog.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      {blog.is_featured && (
                        <span className="whitespace-nowrap rounded-full bg-[var(--forest-tint)] px-2.5 py-1 text-sm text-[var(--forest)]">Featured</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--ink-3)] tabular-nums sm:px-5">
                      {new Date(blog.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/blog/${blog.id}/edit`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                        <DeleteBlogButton blogId={blog.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
