import Link from "next/link";

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";

export default function LegalPage({ eyebrow, title, intro, children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#10130f] px-4 py-6 text-[#f2ead8] selection:bg-[#d2ff4d]/30 selection:text-[#d2ff4d] sm:px-6 md:px-10 md:py-10">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-[100%] bg-[#d2ff4d]/5 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="relative z-10 mx-auto max-w-[1440px]">
        <header className="relative flex items-center justify-between rounded-full border border-white/10 bg-[#0e110c]/85 px-6 py-4 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(210,255,77,0.15)] backdrop-blur-2xl md:px-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d2ff4d]/10 via-transparent to-[#d2ff4d]/10 opacity-60" />
          <Link
            href="/"
            className="relative z-10 font-heading text-xl uppercase tracking-widest text-[#d2ff4d] md:text-2xl"
          >
            Pixel Empire
          </Link>
          <Link
            href="/"
            className="relative z-10 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#f2ead8]/70 transition-colors hover:text-[#d2ff4d]"
          >
            Back to atlas
          </Link>
        </header>

        <div className="relative mt-10 overflow-hidden rounded-[1.35rem] border border-[#d2ff4d]/20 bg-[#0e110c]/65 shadow-[0_0_24px_rgba(210,255,77,0.08)] backdrop-blur-sm md:mt-16">
          <div className="absolute inset-0 bg-gradient-to-br from-[#d2ff4d]/10 via-transparent to-[#ff7043]/10" />
          <div className="relative border-b border-[#d2ff4d]/15 px-6 py-14 md:px-16 md:py-20">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#d2ff4d]">
              {eyebrow}
            </p>
            <h1 className="max-w-4xl font-heading text-5xl uppercase leading-[0.92] text-[#f2ead8] md:text-8xl">
              {title}
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-[#f2ead8]/65 md:text-lg">
              {intro}
            </p>
          </div>

          <article className="legal-content relative px-6 py-12 md:px-16 md:py-16">
            {children}
          </article>
        </div>

        <footer className="mt-20 border-t border-[#d2ff4d]/15 px-2 py-12 text-sm text-[#f2ead8]/50 md:mt-32 md:px-6 md:py-16">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2 className="font-heading text-3xl uppercase text-[#d2ff4d]">
                Pixel Empire
              </h2>
              <p className="mt-2 text-[#f2ead8]/45">
                A public canvas for permanent digital territory.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 uppercase tracking-[0.12em] md:justify-end">
              <Link className="hover:text-[#d2ff4d]" href="/terms">
                Terms
              </Link>
              <Link className="hover:text-[#d2ff4d]" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:text-[#d2ff4d]" href="/refund-policy">
                Refunds
              </Link>
              <Link className="hover:text-[#d2ff4d]" href="/contact">
                Contact
              </Link>
            </nav>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#f2ead8]/40">
            Atlas online / 2026
          </p>
          {supportEmail ? (
            <p className="mt-4">
              Support:{" "}
              <a
                className="text-[#d2ff4d] hover:underline"
                href={`mailto:${supportEmail}`}
              >
                {supportEmail}
              </a>
            </p>
          ) : null}
        </footer>
      </div>
    </main>
  );
}

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
