"use client";

import { useState } from "react";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (response.ok) {
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs text-slate-600 dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-300 disabled:opacity-50"
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
