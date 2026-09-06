"use client";

import { motion } from "framer-motion";
import { ArrowDown, Activity, Sparkles } from "lucide-react";

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
  };

  return (
    <div className="relative min-h-[760px] md:min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 overflow-hidden bg-grid">
      <div className="absolute inset-0 scanlines pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-[#d2ff4d]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="noise absolute inset-0" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="z-10 max-w-6xl mx-auto flex flex-col items-center"
      >
        <motion.div
          variants={item}
          className="mb-7 inline-flex items-center gap-3 border border-[#d2ff4d]/30 px-4 py-2 rounded-full bg-[#d2ff4d]/8 text-[#d2ff4d] text-xs tracking-[0.2em] uppercase font-semibold"
        >
          <Activity size={14} className="animate-pulse" /> Atlas online{" "}
          <span className="text-[#f2ead8]/40">/</span> 1,000,000 pixels
        </motion.div>

        <motion.h1
          variants={item}
          className="font-heading text-6xl md:text-8xl lg:text-[9.5rem] text-[#f2ead8] mb-6 leading-[0.82] text-shadow-glow uppercase"
        >
          Own a piece <br />
          <span className="text-[#d2ff4d]">of the internet.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg md:text-xl text-[#f2ead8]/60 mb-10 max-w-2xl font-light"
        >
          1,000,000 pixels. One digital world. Your permanent territory.
        </motion.p>

        <motion.button
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            document
              .getElementById("explore")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-[#d2ff4d] text-[#10130f] px-7 py-4 rounded-xl font-heading text-lg uppercase tracking-widest hover:bg-[#e3ff8a] transition-colors flex items-center gap-3 box-shadow-glow"
        >
          Enter the atlas <ArrowDown size={22} />
        </motion.button>
        <motion.div
          variants={item}
          className="mt-14 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#f2ead8]/35"
        >
          <Sparkles size={14} className="text-[#ff7043]" /> The internet is
          finite. Claim your coordinates.
        </motion.div>
      </motion.div>

      {/* Subtle animated particles/grid hint can go here */}
    </div>
  );
}
