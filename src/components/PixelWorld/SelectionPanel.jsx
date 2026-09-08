"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Crosshair,
  LoaderCircle,
  RotateCcw,
  X,
} from "lucide-react";
import { getSelectionRectangle, isSelectionValid } from "../../lib/geometry";
import { formatUsd, calculatePriceCents } from "../../lib/pricing";
import { WORLD_SIZE } from "./worldConstants";

const numberFormat = new Intl.NumberFormat("en-US");
const PENDING_CHECKOUT_KEY = "pixel_empire_pending_checkout";

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: "The server returned an invalid response" };
  }
}

function getPendingCheckout(selection) {
  if (!selection || typeof window === "undefined") return null;
  try {
    const pending = JSON.parse(
      window.sessionStorage.getItem(PENDING_CHECKOUT_KEY) || "null",
    );
    return pending?.selection?.x === selection.x &&
      pending?.selection?.y === selection.y &&
      pending?.selection?.width === selection.width &&
      pending?.selection?.height === selection.height
      ? pending
      : null;
  } catch {
    window.sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
    return null;
  }
}

function Details({ rectangle }) {
  return (
    <div className="space-y-2 text-sm font-mono text-[#f2ead8]/80">
      <div className="flex justify-between border-b border-[#d2ff4d]/10 pb-1">
        <span>Dimensions:</span>
        <span className="text-white font-bold">
          {rectangle.width} × {rectangle.height}
        </span>
      </div>
      <div className="flex justify-between border-b border-[#d2ff4d]/10 pb-1">
        <span>Pixels:</span>
        <span className="text-white font-bold">
          {numberFormat.format(rectangle.width * rectangle.height)}
        </span>
      </div>
      <div className="flex justify-between text-[#d2ff4d] font-bold text-lg mt-3 pt-2 border-t border-[#d2ff4d]/30">
        <span>Price:</span>
        <span>
          {formatUsd(calculatePriceCents(rectangle.width, rectangle.height))}
        </span>
      </div>
    </div>
  );
}

export default function SelectionPanel({
  firstPoint,
  currentCursorPoint,
  finalSelection,
  territories,
  onCancel,
}) {
  const selection =
    finalSelection ||
    (firstPoint && currentCursorPoint
      ? getSelectionRectangle(firstPoint, currentCursorPoint)
      : null);
  const preview =
    firstPoint && currentCursorPoint && !finalSelection
      ? getSelectionRectangle(firstPoint, currentCursorPoint)
      : null;
  const rectangle = preview || finalSelection;
  const valid = selection
    ? isSelectionValid(selection, territories, WORLD_SIZE, WORLD_SIZE).valid
    : false;

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const pendingCheckout = getPendingCheckout(finalSelection);
  const [details, setDetails] = useState(
    () => pendingCheckout?.details || null,
  );
  const resumeCheckoutRef = useRef(pendingCheckout);
  const resumeStartedRef = useRef(false);
  const handleContinueRef = useRef(null);

  function updateDetails(event) {
    const { name, value } = event.target;
    setDetails((current) => ({
      owner: current?.owner || "",
      website: current?.website || "",
      description: current?.description || "",
      [name]: value,
    }));
  }

  function handleCancel() {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
    }
    setDetails(null);
    setFeedback(null);
    setSubmitting(false);
    onCancel();
  }

  async function handleContinue() {
    if (!selection || !valid || !details?.owner.trim() || submitting) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      let orderId = resumeCheckoutRef.current?.orderId;
      if (!orderId) {
        const response = await fetch("/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            x: selection.x,
            y: selection.y,
            width: selection.width,
            height: selection.height,
            owner: details.owner.trim(),
            website: details.website.trim(),
            description: details.description.trim(),
          }),
        });

        const data = await readResponse(response);
        if (response.status === 401) {
          preserveCheckout({ selection, details });
          return;
        }
        if (!response.ok) {
          setFeedback({
            type: "error",
            message: data.error || "Failed to reserve territory",
          });
          return;
        }
        orderId = data.orderId;
      }

      const checkoutResponse = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const checkoutData = await readResponse(checkoutResponse);
      if (checkoutResponse.status === 401) {
        preserveCheckout({ selection, details, orderId });
        return;
      }
      if (!checkoutResponse.ok || !checkoutData.checkoutUrl) {
        setFeedback({
          type: "error",
          message: checkoutData.error || "Could not start payment checkout.",
        });
        return;
      }

      window.sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
      window.location.assign(checkoutData.checkoutUrl);
      return;
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message: "Could not reach the reservation service. Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function preserveCheckout(pending) {
    window.sessionStorage.setItem(
      PENDING_CHECKOUT_KEY,
      JSON.stringify(pending),
    );
    window.location.assign(`/auth?returnTo=${encodeURIComponent("/")}`);
  }

  useEffect(() => {
    handleContinueRef.current = handleContinue;
  });

  useEffect(() => {
    if (
      resumeStartedRef.current ||
      !resumeCheckoutRef.current ||
      !details?.owner.trim() ||
      !finalSelection
    )
      return;
    resumeStartedRef.current = true;
    handleContinueRef.current?.();
  }, [details, finalSelection]);

  return (
    <AnimatePresence>
      {rectangle && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-6 left-6 z-30 flex max-h-[calc(100%-3rem)] w-80 max-w-[calc(100%-3rem)] flex-col rounded-2xl border border-[#d2ff4d]/40 bg-[#0a0c09]/95 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(210,255,77,0.1)] backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#d2ff4d]/20 pb-3 mb-3">
            <h3 className="font-mono text-base font-bold uppercase tracking-wider text-[#d2ff4d]">
              {preview ? "Selecting..." : "Territory Selected"}
            </h3>
            <button
              aria-label="Cancel selection"
              onClick={handleCancel}
              className="rounded-lg p-1 text-white/60 transition-colors hover:bg-white/5 hover:text-[#d2ff4d]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-left custom-scrollbar">
            {preview && (
              <div className="space-y-4">
                <p className="flex items-center gap-2 font-mono text-xs text-[#f2ead8]/80 animate-pulse">
                  <Crosshair size={14} className="text-[#d2ff4d]" />
                  Select bottom-right corner to lock...
                </p>
                <Details rectangle={preview} />
                {!valid && (
                  <div className="rounded-lg border border-[#FAAA48]/50 bg-[#2F0F03]/80 py-2 text-center font-mono text-xs font-bold tracking-wide text-[#FAAA48] animate-pulse">
                    AREA UNAVAILABLE
                  </div>
                )}
              </div>
            )}

            {finalSelection && (
              <div className="space-y-4">
                <Details rectangle={finalSelection} />

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#f2ead8]/70">
                      Display name <span className="text-[#d2ff4d]">*</span>
                    </label>
                    <input
                      name="owner"
                      value={details?.owner || ""}
                      onChange={updateDetails}
                      maxLength={100}
                      placeholder="Your name or brand"
                      className="box-border w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 font-sans text-sm normal-case tracking-normal text-white outline-none placeholder:text-white/35 focus:border-[#d2ff4d]/70"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#f2ead8]/70">
                      Website
                    </label>
                    <input
                      name="website"
                      value={details?.website || ""}
                      onChange={updateDetails}
                      maxLength={500}
                      placeholder="https://example.com"
                      className="box-border w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 font-sans text-sm normal-case tracking-normal text-white outline-none placeholder:text-white/35 focus:border-[#d2ff4d]/70"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#f2ead8]/70">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={details?.description || ""}
                      onChange={updateDetails}
                      maxLength={500}
                      rows={2}
                      placeholder="What does this territory represent?"
                      className="box-border w-full resize-none rounded-lg border border-white/15 bg-white/5 px-3 py-2 font-sans text-sm normal-case tracking-normal text-white outline-none placeholder:text-white/35 focus:border-[#d2ff4d]/70"
                    />
                  </div>
                </div>

                {/* Feedback Notification */}
                {feedback && (
                  <div
                    role="alert"
                    className={`flex items-start gap-2 rounded-lg border px-3 py-2 font-mono text-xs leading-relaxed ${
                      feedback.type === "success"
                        ? "border-[#d2ff4d]/40 bg-[#d2ff4d]/10 text-[#efffc4]"
                        : "border-[#ff7043]/50 bg-[#ff7043]/10 text-[#ffd0c2]"
                    }`}
                  >
                    {feedback.type === "success" ? (
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#d2ff4d]"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#ff7043]"
                        aria-hidden="true"
                      />
                    )}
                    <span>{feedback.message}</span>
                  </div>
                )}

                {/* Submit / Cancel Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleContinue}
                    disabled={submitting || !valid || !details?.owner.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#d2ff4d] py-3 font-mono text-xs font-bold uppercase tracking-wider text-[#0a0c09] transition-all hover:bg-[#e3ff8a] hover:shadow-[0_0_15px_rgba(210,255,77,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <span>RESERVING...</span>
                      </>
                    ) : (
                      <>
                        <span>CONTINUE TO CHECKOUT</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCancel}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 font-mono text-xs font-bold uppercase text-black/70 transition-colors hover:border-[#d2ff4d]/40 hover:bg-white/10 hover:text-black/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    CANCEL SELECTION
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
