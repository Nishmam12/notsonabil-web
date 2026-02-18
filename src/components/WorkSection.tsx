import SectionHeader from "@/components/SectionHeader";
import Image from "next/image";

const tabs = ["IEM", "Controller", "Sound test", "Keyboard", "Monitor", "Headset"];

const workImage =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80";

export default function WorkSection() {
  return (
    <section id="works" className="container mx-auto w-full px-6 sm:px-8 lg:px-10">
      <SectionHeader
        variant="section"
        title="the tech ive tested. the stories ive told."
        description="From hands-on reviews of unreleased devices to deep dives on everyday gadgets—here's a look at the work that's built my name and community."
      >
        <div className="hidden flex-wrap items-center gap-4 text-xs font-semibold text-neutral-400 dark:text-neutral-500 md:flex">
          {tabs.map((tab, index) => (
            <span
              key={tab}
              className={
                index === 0
                  ? "border-b-2 border-orange-400 pb-1 text-orange-500"
                  : "pb-1"
              }
            >
              {tab}
            </span>
          ))}
        </div>
      </SectionHeader>

      <div className="mt-8 rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] sm:p-8">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-neutral-400 dark:text-neutral-500 md:hidden">
          {tabs.map((tab, index) => (
            <span
              key={tab}
              className={
                index === 0
                  ? "border-b-2 border-orange-400 pb-1 text-orange-500"
                  : "pb-1"
              }
            >
              {tab}
            </span>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
            <Image
              className="h-full w-full object-cover"
              src={workImage}
              alt="IEM review"
              width={1400}
              height={800}
              unoptimized
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">iem reviews</h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Crisp sound. Clean reviews. I break down budget to premium IEMs so
              you know exactly what fits your ears—and your wallet.
            </p>
            <button className="mt-6 w-fit rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
              See the playlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
