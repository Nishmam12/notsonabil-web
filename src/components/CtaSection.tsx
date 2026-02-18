import SectionHeader from "@/components/SectionHeader";

export default function CtaSection() {
  return (
    <section className="container mx-auto w-full px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
      <SectionHeader
        variant="section"
        title="get started"
        description="Whether you're a brand looking to collaborate or a viewer ready to dive into honest reviews—this is where it starts."
        className="!text-center"
      >
        <button className="mx-auto mt-4 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
          Collab with me
        </button>
      </SectionHeader>
    </section>
  );
}
