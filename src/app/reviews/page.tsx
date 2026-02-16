import FilterableIndex from "@/components/FilterableIndex";
import PageShell from "@/components/PageShell";
import { reviews } from "@/lib/content";

export default function ReviewsPage() {
  return (
    <PageShell
      title="Reviews"
      description="Long-form reviews with ratings, pros, cons, and full performance notes."
    >
      <FilterableIndex
        title="Reviews library"
        description="Same category logic as photoshoots, tuned for deep review insights."
        items={reviews}
        basePath="/reviews"
        showRating
      />
    </PageShell>
  );
}
