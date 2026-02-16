"use client";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <button
      className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-600 dark:border-slate-800/60 dark:bg-[rgba(10,16,28,0.9)] dark:text-slate-300"
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
}
