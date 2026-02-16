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
    <div className="bench-shell min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-6 py-20 md:px-10">
        <div className="bench-card w-full rounded-3xl px-8 py-10">
          <h1 className="text-3xl font-semibold text-slate-50">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-400">
            Secure access for administrators only.
          </p>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-full border border-slate-800/60 bg-[rgba(10,16,28,0.9)] px-4 py-3 text-sm text-slate-200"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
            />
            <input
              className="w-full rounded-full border border-slate-800/60 bg-[rgba(10,16,28,0.9)] px-4 py-3 text-sm text-slate-200"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
            />
            {error ? <div className="text-sm text-red-300">{error}</div> : null}
            <button
              className="bench-button w-full rounded-full px-4 py-3 text-sm font-semibold text-white"
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
