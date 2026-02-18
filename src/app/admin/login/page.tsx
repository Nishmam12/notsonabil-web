"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setError("Invalid credentials");
      setLoading(false);
      return;
    }
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-6 py-20 md:px-10">
        <div className="w-full rounded-3xl border border-neutral-200 bg-white px-8 py-10 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-50">Admin Login</h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Secure access for administrators only.
          </p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-700 dark:focus:ring-neutral-800"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
            />
            <input
              className="w-full rounded-full border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-700 dark:focus:ring-neutral-800"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
            />
            {error ? <div className="text-sm text-red-500 dark:text-red-400">{error}</div> : null}
            <button
              className="w-full rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
