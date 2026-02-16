import Link from "next/link";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/benchmarks", label: "Benchmarks" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/photoshoots", label: "Photoshoots" },
  { href: "/admin/blog", label: "Blog" },
];

export default function AdminSidebar() {
  return (
    <aside className="bench-card rounded-3xl px-5 py-6">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Admin
      </div>
      <div className="mt-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[rgba(148,163,184,0.12)] hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
