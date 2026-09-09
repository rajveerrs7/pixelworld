"use client";

import { motion } from "framer-motion";
import { formatUsd, PRICE_PER_PIXEL_CENTS } from "../lib/pricing";

export default function WorldStats({ territories }) {
  /* ✨ Preserved logic intact */
  const totalPixels = 1000000;
  const claimedPixels = territories.reduce(
    (acc, t) => acc + t.width * t.height,
    0,
  );
  const percentClaimed = ((claimedPixels / totalPixels) * 100).toFixed(2);

  const stats = [
    { label: "Total Pixels", value: "1,000,000", code: "SYS_CAP" },
    {
      label: "Potential Value",
      value: formatUsd(totalPixels * PRICE_PER_PIXEL_CENTS),
      code: "VAL_EST",
    },
    {
      label: "Pixels Claimed",
      value: new Intl.NumberFormat().format(claimedPixels),
      code: "SECTOR_ALLOC",
    },
    {
      label: "World Claimed",
      value: `${percentClaimed}%`,
      code: "SYNC_RATIO",
    },
  ];

  /* ✨ Futuristic enhancement — Framer Motion container variants */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="relative max-w-6xl mx-auto my-20 px-4">
      {/* ✨ Futuristic enhancement — Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-[#d2ff4d]/5 blur-[100px] pointer-events-none rounded-full" />

      {/* ✨ Futuristic enhancement — Top HUD Telemetry Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 mb-3 border-b border-[#d2ff4d]/15 text-[10px] font-mono tracking-[0.25em] text-[#d2ff4d]/60 uppercase">
        <div className="flex items-center gap-2">
          {/* Pulsing live radar dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d2ff4d] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d2ff4d]" />
          </span>
          <span>Telemetry // Live World Matrix</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[#f2ead8]/40">
          <span>SEC: 001-ALPHA</span>
          <span>STATUS: NOMINAL</span>
        </div>
      </div>

      {/* ✨ Futuristic enhancement — Outer HUD frame with cyber borders */}
      <div className="relative p-1 rounded-2xl bg-gradient-to-b from-[#d2ff4d]/20 via-[#d2ff4d]/5 to-transparent backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 rounded-xl overflow-hidden bg-[#050705]/80 p-2"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative flex flex-col items-center justify-between p-6 md:p-8 rounded-lg bg-[#151a12]/80 border border-[#d2ff4d]/10 overflow-hidden transition-all duration-300 hover:border-[#d2ff4d]/40 hover:bg-[#182015] hover:shadow-[0_10px_30px_-10px_rgba(210,255,77,0.2)]"
            >
              {/* ✨ Futuristic enhancement — Card internal interactive glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#d2ff4d]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* ✨ Futuristic enhancement — Corner HUD brackets */}
              <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-[#d2ff4d]/30 group-hover:border-[#d2ff4d] transition-colors pointer-events-none" />
              <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-[#d2ff4d]/30 group-hover:border-[#d2ff4d] transition-colors pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-[#d2ff4d]/30 group-hover:border-[#d2ff4d] transition-colors pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-[#d2ff4d]/30 group-hover:border-[#d2ff4d] transition-colors pointer-events-none" />

              {/* ✨ Technical Index Tag */}
              <div className="w-full flex items-center justify-between mb-4 text-[10px] font-mono text-[#f2ead8]/30 group-hover:text-[#d2ff4d]/70 transition-colors">
                <span>[{String(i + 1).padStart(2, "0")}]</span>
                <span className="tracking-widest">{stat.code}</span>
              </div>

              {/* ✨ Value Display with Neon Text Glow */}
              <div className="relative my-2 text-center">
                <span
                  className="font-heading font-bold text-3xl md:text-4xl text-[#d2ff4d] tracking-tight block transition-transform duration-300 group-hover:scale-105"
                  style={{
                    textShadow:
                      "0 0 15px rgba(210,255,77,0.4), 0 0 30px rgba(210,255,77,0.15)",
                  }}
                >
                  {stat.value}
                </span>

                {/* Micro accent bar */}
                <div className="h-[2px] w-8 bg-gradient-to-r from-transparent via-[#d2ff4d]/40 to-transparent mx-auto mt-3 rounded-full group-hover:w-16 group-hover:via-[#d2ff4d] transition-all duration-300" />
              </div>

              {/* ✨ Technical Label */}
              <span className="mt-4 text-[#f2ead8]/60 text-xs font-mono tracking-[0.2em] uppercase text-center group-hover:text-[#f2ead8] transition-colors">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
