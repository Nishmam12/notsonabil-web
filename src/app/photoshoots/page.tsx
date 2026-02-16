import FilterableIndex from "@/components/FilterableIndex";
import PageShell from "@/components/PageShell";
import { photoshoots } from "@/lib/content";

export default function PhotoshootsPage() {
  return (
    <PageShell
      title="Photoshoots"
      description="Product photography across keyboards, mice, monitors, audio, and beyond."
    >
      <FilterableIndex
        title="Product photoshoots"
        description="Filter by category, subcategory, brand, year, and featured picks."
        items={photoshoots}
        basePath="/photoshoots"
      />
    </PageShell>
  );
}
