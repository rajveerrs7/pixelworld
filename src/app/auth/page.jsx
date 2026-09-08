"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: "Authentication service returned an invalid response" };
  }
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/" + mode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.error || "Authentication failed");
      const returnTo = new URLSearchParams(window.location.search).get(
        "returnTo",
      );
      const destination = returnTo && returnTo.startsWith("/") ? returnTo : "/";
      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#050705] px-6 overflow-hidden">
      {/* Dynamic Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#d2ff4d] opacity-[0.03] blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#d2ff4d] opacity-[0.03] blur-[120px]"></div>

      {/* Lifted Square/Card */}
      <div className="relative z-10 w-full max-w-[500px] aspect-[1/1] sm:aspect-square flex flex-col items-center justify-center rounded-[40px] bg-[#121610] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9),0_0_20px_rgba(210,255,77,0.05)] backdrop-blur-sm p-8">
        {/* Centered Heading positioned high */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#d2ff4d] drop-shadow-[0_0_10px_rgba(210,255,77,0.3)]">
            {mode === "login" ? "Sign in" : "Sign up"}
          </h1>
          <div className="h-1 w-10 bg-[#d2ff4d] mx-auto mt-3 rounded-full opacity-50"></div>
        </div>

        <form
          onSubmit={submit}
          className="w-full flex flex-col items-center gap-6"
        >
          {mode === "signup" && (
            <input
              required
              placeholder="Display name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-1/2 h-16 rounded-5px bg-black/50 border border-white/10 px-6 py-4 text-white text-lg placeholder-white/30 outline-none transition-all focus:border-[#d2ff4d]/50 focus:ring-1 focus:ring-[#d2ff4d]/20"
            />
          )}

          <input
            required
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-1/2 h-16 rounded-5px bg-black/50 border border-white/10 px-6 py-4 text-white text-lg placeholder-white/30 outline-none transition-all focus:border-[#d2ff4d]/50 focus:ring-1 focus:ring-[#d2ff4d]/20"
          />

          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-1/2 h-16 rounded-5px bg-black/50 border border-white/10 px-6 py-4 text-white text-lg placeholder-white/30 outline-none transition-all focus:border-[#d2ff4d]/50 focus:ring-1 focus:ring-[#d2ff4d]/20"
          />

          {error && (
            <p
              role="alert"
              className="w-full text-center text-sm text-[#ff9d80] animate-pulse"
            >
              {error}
            </p>
          )}

          <button
            disabled={pending}
            className="mt-4 w-1/2 h-16 rounded-5px bg-[#d2ff4d] px-8 py-4 text-lg font-bold text-[#050705] shadow-[0_10px_20px_rgba(210,255,77,0.2)] transition-all hover:scale-[1.02] hover:shadow-[0_15px_25px_rgba(210,255,77,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending
              ? "Authenticating..."
              : mode === "login"
                ? "Sign in"
                : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError("");
          }}
          className="mt-8 text-sm font-medium text-gray-600 hover:text-black transition-colors"
        >
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </button>

        {/* Futuristic "Inner Glow" for the box */}
        <div className="absolute inset-0 rounded-[40px] pointer-events-none border border-white/5 mix-blend-overlay"></div>
      </div>
    </main>
  );
}
