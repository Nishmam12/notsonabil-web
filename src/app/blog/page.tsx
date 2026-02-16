import BlogIndex from "@/components/BlogIndex";
import PageShell from "@/components/PageShell";
import { blogPosts } from "@/lib/content";

export default function BlogPage() {
  return (
    <PageShell
      title="Blog"
      description="Stories, guides, and tech notes from the review desk."
    >
      <BlogIndex posts={blogPosts} />
    </PageShell>
  );
}
