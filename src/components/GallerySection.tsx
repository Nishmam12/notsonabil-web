import Image from "next/image";

const gallery = [
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=80",
];

export default function GallerySection() {
  return (
    <section id="gallery" className="container mx-auto w-full px-6 pb-16 sm:px-8 sm:pb-20 lg:px-10">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-slate-100">
          tech through my lens
        </h2>
      </div>
      <div className="relative mt-8">
        <div className="flex gap-6 overflow-x-auto pb-4">
          {gallery.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="min-w-[70%] flex-1 rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.06)] dark:border-slate-800/70 dark:bg-[#0f172a] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] sm:min-w-[45%] lg:min-w-[30%]"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  className="h-full w-full object-cover"
                  src={src}
                  alt="Gallery item"
                  width={900}
                  height={700}
                  unoptimized
                />
              </div>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 items-center justify-center md:flex">
          <div className="flex size-8 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg sm:size-9">
            ‹
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 items-center justify-center md:flex">
          <div className="flex size-8 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg sm:size-9">
            ›
          </div>
        </div>
      </div>
    </section>
  );
}
