export default function CtaSection() {
  return (
    <section className="container mx-auto w-full px-6 pb-16 text-center sm:px-8 sm:pb-20 lg:px-10">
      <h2 className="text-2xl font-semibold text-neutral-800 dark:text-slate-100">get started</h2>
      <p className="mt-2 text-sm text-neutral-500 dark:text-slate-300">
        Whether you&apos;re a brand looking to collaborate or a viewer ready to
        dive into honest reviews—this is where it starts.
      </p>
      <button className="mt-6 rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800">
        Collab with me
      </button>
    </section>
  );
}
