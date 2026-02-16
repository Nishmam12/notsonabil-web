import Image from "next/image";

const cards = [
  {
    title: "early access to global tech",
    description:
      "I get my hands on exclusive international review units before most so you see what’s coming, not just what’s already here.",
    cta: "Sponsor me",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "reach across multi platforms",
    description:
      "With a strong presence on YouTube, Instagram, and more, my content connects with thousands of real tech fans—every single week.",
    cta: "Give your product eyeballs",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "an active community",
    description:
      "Join a buzzing Discord server full of people asking questions, sharing insights, and geeking out about tech—just like you.",
    cta: "Join my server",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
  },
];

export default function TrustSection() {
  return (
    <section id="why-me" className="container mx-auto w-full px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-slate-100">
          why people trust my tech takes
        </h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-slate-300">
          From early access to international units to a thriving community —
          here&apos;s what makes my reviews stand out.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:border-slate-800/70 dark:bg-[#0f172a] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                className="h-full w-full object-cover"
                src={card.image}
                alt={card.title}
                width={900}
                height={600}
                unoptimized
              />
            </div>
            <h3 className="mt-4 text-base font-semibold text-neutral-800 dark:text-slate-100">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-slate-300">
              {card.description}
            </p>
            <button className="mt-4 text-xs font-semibold text-orange-500">
              {card.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
