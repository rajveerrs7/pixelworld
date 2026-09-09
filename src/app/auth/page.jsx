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
    <main className="relative flex min-h-screen items-center justify-center bg-[#050705] px-6 py-12 overflow-hidden font-[system-ui,-apple-system,'Inter',sans-serif]">
      {/* ✨ Futuristic enhancement — Injected keyframes + utility styles */}
      <style jsx global>{`
        @keyframes float-orb {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 40px) scale(0.95);
          }
        }
        @keyframes float-orb-reverse {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-40px, 30px) scale(1.05);
          }
          66% {
            transform: translate(30px, -40px) scale(0.9);
          }
        }
        @keyframes grid-pan {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 60px 60px;
          }
        }
        @keyframes border-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes fade-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow:
              0 0 20px rgba(210, 255, 77, 0.3),
              0 0 40px rgba(210, 255, 77, 0.1);
          }
          50% {
            box-shadow:
              0 0 30px rgba(210, 255, 77, 0.5),
              0 0 60px rgba(210, 255, 77, 0.2);
          }
        }
        @keyframes scan-line {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        .animate-fade-up {
          animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out both;
        }
        .animate-border-spin {
          animation: border-spin 8s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* ✨ Futuristic enhancement — Animated cyber grid background */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(210,255,77,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(210,255,77,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "grid-pan 20s linear infinite",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* ✨ Futuristic enhancement — Floating gradient orbs */}
      <div
        className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#d2ff4d] opacity-[0.06] blur-[130px] pointer-events-none"
        style={{ animation: "float-orb 18s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#d2ff4d] opacity-[0.05] blur-[130px] pointer-events-none"
        style={{ animation: "float-orb-reverse 22s ease-in-out infinite" }}
      />

      {/* ✨ Futuristic enhancement — Card wrapper with rotating gradient border */}
      <div className="relative z-10 w-full max-w-[500px] animate-fade-up">
        {/* Rotating conic gradient border ring */}
        <div className="absolute -inset-[1px] rounded-[40px] overflow-hidden pointer-events-none">
          <div
            className="absolute inset-[-100%] animate-border-spin"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, rgba(210,255,77,0.6) 20%, transparent 40%, transparent 60%, rgba(210,255,77,0.3) 80%, transparent 100%)",
            }}
          />
        </div>

        {/* ✨ Glassmorphic card body */}
        <div className="relative aspect-square flex flex-col items-center justify-center rounded-[40px] bg-[#0a0d08]/85 backdrop-blur-xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] p-8 overflow-hidden">
          {/* Inner ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#d2ff4d]/[0.03] via-transparent to-[#d2ff4d]/[0.02] pointer-events-none" />

          {/* ✨ Scan line effect */}
          <div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d2ff4d]/40 to-transparent pointer-events-none"
            style={{ animation: "scan-line 6s ease-in-out infinite" }}
          />

          {/* ✨ Centered Heading with neon glow */}
          <div
            className="mb-8 text-center relative z-10 animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="inline-block mb-3 px-3 py-1 rounded-full border border-[#d2ff4d]/20 bg-[#d2ff4d]/5 backdrop-blur-sm">
              <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-[#d2ff4d]/70">
                {mode === "login" ? " Login" : " Register"}
              </span>
            </div>
            <h1
              className="text-4xl font-bold tracking-tight text-[#d2ff4d]"
              style={{
                textShadow:
                  "0 0 20px rgba(210,255,77,0.5), 0 0 40px rgba(210,255,77,0.2)",
              }}
            >
              {mode === "login" ? "Sign in" : "Sign up"}
            </h1>
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#d2ff4d] to-transparent mx-auto mt-4 rounded-full" />
          </div>

          <form
            onSubmit={submit}
            className="w-full flex flex-col items-center gap-5 relative z-10"
          >
            {mode === "signup" && (
              /* ✨ Bigger input with fully rounded-full capsule borders */
              <div
                className="w-full max-w-[340px] animate-fade-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="relative group">
                  <div className="absolute inset-0 rounded-full bg-[#d2ff4d]/0 group-focus-within:bg-[#d2ff4d]/10 blur-xl transition-all duration-500" />
                  <input
                    required
                    placeholder="Display name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="relative w-full h-16 rounded-full bg-black/60 border border-white/10 px-8 text-white text-lg placeholder-white/30 outline-none transition-all duration-300 focus:border-[#d2ff4d]/60 focus:bg-black/80 focus:shadow-[0_0_20px_rgba(210,255,77,0.15)]"
                  />
                </div>
              </div>
            )}

            {/* ✨ Bigger input with fully rounded-full capsule borders */}
            <div
              className="w-full max-w-[340px] animate-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-[#d2ff4d]/0 group-focus-within:bg-[#d2ff4d]/10 blur-xl transition-all duration-500" />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="relative w-full h-16 rounded-full bg-black/60 border border-white/10 px-8 text-white text-lg placeholder-white/30 outline-none transition-all duration-300 focus:border-[#d2ff4d]/60 focus:bg-black/80 focus:shadow-[0_0_20px_rgba(210,255,77,0.15)]"
                />
              </div>
            </div>

            {/* ✨ Bigger input with fully rounded-full capsule borders */}
            <div
              className="w-full max-w-[340px] animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-[#d2ff4d]/0 group-focus-within:bg-[#d2ff4d]/10 blur-xl transition-all duration-500" />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="relative w-full h-16 rounded-full bg-black/60 border border-white/10 px-8 text-white text-lg placeholder-white/30 outline-none transition-all duration-300 focus:border-[#d2ff4d]/60 focus:bg-black/80 focus:shadow-[0_0_20px_rgba(210,255,77,0.15)]"
                />
              </div>
            </div>

            {error && (
              <div className="w-full max-w-[340px] animate-fade-in">
                <p
                  role="alert"
                  className="w-full text-center text-sm text-[#ff9d80] py-2.5 px-4 rounded-full bg-[#ff9d80]/5 border border-[#ff9d80]/20 backdrop-blur-sm"
                  style={{ textShadow: "0 0 10px rgba(255,157,128,0.3)" }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* ✨ Bigger, bolder button matching the capsule design */}
            <div
              className="w-full max-w-[340px] mt-1 animate-fade-up"
              style={{ animationDelay: "0.35s" }}
            >
              <button
                disabled={pending}
                className="relative w-full h-16 rounded-full bg-gradient-to-r from-[#d2ff4d] via-[#e0ff70] to-[#d2ff4d] bg-[length:200%_100%] px-8 text-lg font-extrabold text-[#050705] shadow-[0_12px_30px_rgba(210,255,77,0.25)] transition-all duration-300 hover:bg-[position:100%_0] hover:scale-[1.02] hover:shadow-[0_15px_40px_rgba(210,255,77,0.45)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
              >
                {/* Shimmer sweep */}
                <span
                  className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.2s_ease-in-out] bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  style={{ animation: pending ? "none" : undefined }}
                />
                <span className="relative flex items-center justify-center gap-2 tracking-wide">
                  {pending ? (
                    <>
                      <span className="w-5 h-5 border-2 border-[#050705] border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : mode === "login" ? (
                    "Sign in →"
                  ) : (
                    "Create Account →"
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* ✨ Mode toggle with dynamic neon hover underline */}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
            className="relative z-10 mt-8 text-sm font-semibold text-white/50 transition-all duration-300 animate-fade-up group"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="relative">
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#d2ff4d] transition-all duration-300 rounded-full" />
            </span>
          </button>

          {/* ✨ Corner accents for HUD feel */}
          <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-[#d2ff4d]/30 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-[#d2ff4d]/30 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-[#d2ff4d]/30 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-[#d2ff4d]/30 rounded-br-lg pointer-events-none" />

          {/* Outer inner-glow ring */}
          <div className="absolute inset-0 rounded-[40px] pointer-events-none border border-white/5 mix-blend-overlay" />
        </div>
      </div>
    </main>
  );
}
