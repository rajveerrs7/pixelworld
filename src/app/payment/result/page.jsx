"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2, Clock3, LoaderCircle, XCircle } from "lucide-react";

function redirectToAuth() {
  window.location.assign(
    `/auth?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`,
  );
}

const statusCopy = {
  paid: {
    title: "Territory secured",
    body: "Payment verified. Your territory is now part of the world.",
    Icon: CheckCircle2,
  },
  payment_pending: {
    title: "Payment processing",
    body: "We are waiting for payment confirmation from Xflow.",
    Icon: Clock3,
  },
  expired: {
    title: "Reservation expired",
    body: "This reservation is no longer available. Please select a new area.",
    Icon: XCircle,
  },
  cancelled: {
    title: "Order cancelled",
    body: "No territory was claimed by this order.",
    Icon: XCircle,
  },
};

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [status, setStatus] = useState(orderId ? "loading" : "cancelled");

  useEffect(() => {
    if (!orderId) {
      return undefined;
    }

    let active = true;
    let timer;
    const load = async () => {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(orderId)}`,
      );
      if (response.status === 401) {
        redirectToAuth();
        return;
      }
      const data = await response.json();
      if (!active) return;
      setStatus(data.status || "cancelled");
      if (data.status === "payment_pending") {
        timer = window.setTimeout(load, 3000);
      }
    };
    load().catch(() => active && setStatus("cancelled"));
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [orderId]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#10130f] text-[#f2ead8]">
        <LoaderCircle
          className="h-8 w-8 animate-spin text-[#d2ff4d]"
          aria-label="Loading order"
        />
      </main>
    );
  }

  const copy = statusCopy[status] || statusCopy.payment_pending;
  const Icon = copy.Icon;
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#10130f] px-6 text-[#f2ead8]">
      <section className="w-full max-w-lg rounded-2xl border border-[#d2ff4d]/30 bg-[#151a12]/90 p-8 text-center box-shadow-glow">
        <Icon
          className="mx-auto mb-5 h-12 w-12 text-[#d2ff4d]"
          aria-hidden="true"
        />
        <h1 className="font-heading text-4xl uppercase text-[#d2ff4d]">
          {copy.title}
        </h1>
        <p className="mt-4 text-[#f2ead8]/70">{copy.body}</p>
        <Link
          className="mt-8 inline-flex rounded-lg bg-[#d2ff4d] px-5 py-3 font-bold text-[#10130f]"
          href="/"
        >
          Return to world
        </Link>
      </section>
    </main>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#10130f] text-[#f2ead8]">
          <LoaderCircle
            className="h-8 w-8 animate-spin text-[#d2ff4d]"
            aria-label="Loading order"
          />
        </main>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
