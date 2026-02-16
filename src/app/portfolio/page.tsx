import Image from "next/image";
import PageShell from "@/components/PageShell";

const brands = ["Mechlands", "Royal Kludge", "AJAZZ", "ASUS", "BLUSSYTLE", "ALICE"];

const caseStudies = [
  {
    title: "Mechlands Nova KB 60",
    description: "Full review campaign with hero photography and launch timing.",
  },
  {
    title: "AJAZZ Arc Mouse Pro",
    description: "Benchmark pack with creator highlights and affiliate push.",
  },
  {
    title: "Royal Kludge Zen Controller",
    description: "Lifestyle shoot + short-form social assets.",
  },
];

const process = [
  "Product arrival",
  "Testing & benchmarking",
  "Photography",
  "Script writing",
  "Publishing",
];

export default function PortfolioPage() {
  return (
    <PageShell
      title="Portfolio"
      description="Tech peripheral storytelling with precision photography and honest reviews."
    >
      <section className="container mx-auto w-full max-w-5xl px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:border-slate-800/70 dark:bg-[#0f172a] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(8rem,12rem)_1fr]">
            <Image
              className="aspect-square w-28 rounded-2xl object-cover sm:w-32 md:w-36 lg:w-40"
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
              alt="Profile"
              width={600}
              height={600}
              unoptimized
            />
            <div>
              <h2 className="text-2xl font-semibold text-neutral-800 dark:text-slate-100">About</h2>
              <p className="mt-2 text-sm text-neutral-500 dark:text-slate-300">
                I&apos;m a tech reviewer and photographer focused on peripherals —
                keyboards, mice, monitors, and audio. I craft cinematic visuals,
                precision benchmarks, and honest reviews that help people buy
                smarter.
              </p>
              <p className="mt-3 text-sm text-neutral-500 dark:text-slate-300">
                Each full review project takes approximately 2–3 weeks from
                product arrival to publishing.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:border-slate-800/70 dark:bg-[#0f172a] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] sm:p-8">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-slate-100">Brands I worked with</h3>
          <div className="mt-4 grid gap-4 text-sm font-semibold text-neutral-500 dark:text-slate-300 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <div
                key={brand}
                className="flex min-h-[3.5rem] items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 dark:border-slate-700 dark:bg-[#0b1220]"
              >
                {brand}
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study) => (
              <div
                key={study.title}
                className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:border-slate-800/70 dark:bg-[#111827] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
              >
                <div className="text-sm font-semibold text-neutral-800 dark:text-slate-100">
                  {study.title}
                </div>
                <p className="mt-2 text-sm text-neutral-500 dark:text-slate-300">
                  {study.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:border-slate-800/70 dark:bg-[#0f172a] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] sm:p-8">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-slate-100">Project process</h3>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-neutral-500 dark:text-slate-300">
            {process.map((step) => (
              <div
                key={step}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 dark:border-slate-700 dark:bg-[#0b1220]"
              >
                {step}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 rounded-[28px] border border-neutral-200 bg-white p-8 shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:border-slate-800/70 dark:bg-[#0f172a] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-slate-100">Social links</h3>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-neutral-600 dark:text-slate-300">
            <a className="rounded-full border border-neutral-200 px-4 py-2 dark:border-slate-700" href="#">
              YouTube
            </a>
            <a className="rounded-full border border-neutral-200 px-4 py-2 dark:border-slate-700" href="#">
              Facebook
            </a>
            <a className="rounded-full border border-neutral-200 px-4 py-2 dark:border-slate-700" href="#">
              Instagram
            </a>
            <a className="rounded-full border border-neutral-200 px-4 py-2 dark:border-slate-700" href="#">
              TikTok
            </a>
            <a className="rounded-full border border-neutral-200 px-4 py-2 dark:border-slate-700" href="#">
              X
            </a>
          </div>
        </div>
        <div className="mt-8 rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.08)] dark:border-slate-800/70 dark:bg-[#0f172a] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] sm:p-8">
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-slate-100">Work With Me</h3>
          <p className="mt-2 text-sm text-neutral-500 dark:text-slate-300">
            Tell me about the product, timeline, and campaign goals.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-[#0b1220] dark:text-slate-200"
              placeholder="Name"
            />
            <input
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-[#0b1220] dark:text-slate-200"
              placeholder="Email"
            />
          </div>
          <input
            className="mt-4 w-full rounded-full border border-neutral-200 px-4 py-2 text-sm dark:border-slate-700 dark:bg-[#0b1220] dark:text-slate-200"
            placeholder="Brand or company"
          />
          <textarea
            className="mt-4 min-h-[8rem] w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-[#0b1220] dark:text-slate-200 sm:min-h-[10rem]"
            placeholder="Project details"
          />
          <button className="mt-4 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
            Submit inquiry
          </button>
        </div>
      </section>
    </PageShell>
  );
}
