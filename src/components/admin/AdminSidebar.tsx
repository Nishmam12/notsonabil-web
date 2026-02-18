import Link from "next/link";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/benchmarks", label: "Benchmarks" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/photoshoots", label: "Photoshoots" },
  { href: "/admin/blog", label: "Blog" },
];

export default function AdminSidebar() {
  return (
    <aside className="rounded-3xl border border-neutral-200 bg-white px-5 py-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
        Admin
      </div>
      <div className="mt-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
