"use client";

import { motion } from "framer-motion";
import { Grid, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-5 font-[system-ui,-apple-system,'Inter',sans-serif]"
    >
      {/* ✨ Futuristic enhancement — Background ambient glow beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-[900px] h-12 bg-gradient-to-r from-transparent via-[#d2ff4d]/10 to-transparent blur-2xl pointer-events-none" />

      {/* ✨ Futuristic enhancement — Floating Capsule Chassis */}
      <div className="max-w-[1440px] mx-auto flex items-center justify-between bg-[#080b06]/85 backdrop-blur-2xl px-5 md:px-7 py-3 rounded-full border border-[#d2ff4d]/25 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(210,255,77,0.08),inset_0_1px_0_rgba(255,255,255,0.08)] relative overflow-hidden group">
        {/* Ambient Top Laser Edge Highlight */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#d2ff4d]/50 to-transparent pointer-events-none" />

        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d2ff4d]/[0.04] via-transparent to-[#d2ff4d]/[0.04] pointer-events-none" />

        {/* ✨ Brand Logo & Interactive Cyber Grid Icon */}
        <div className="flex items-center gap-3.5 z-10 group/brand cursor-pointer">
          {/* Animated Tech Beacon Icon */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#d2ff4d]/10 border border-[#d2ff4d]/30 group-hover/brand:border-[#d2ff4d] group-hover/brand:shadow-[0_0_20px_rgba(210,255,77,0.35)] transition-all duration-300">
            <div className="absolute inset-0 bg-[#d2ff4d]/10 rounded-xl blur-sm opacity-0 group-hover/brand:opacity-100 transition-opacity" />
            <Grid
              size={18}
              className="text-[#d2ff4d] transition-transform duration-500 group-hover/brand:rotate-90 relative z-10"
            />
            {/* Live Status Indicator */}
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d2ff4d] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d2ff4d]" />
            </span>
          </div>

          {/* Logo Typography with Subtitle Metadata */}
          <div className="flex flex-col">
            <span
              className="font-heading text-lg md:text-xl tracking-widest uppercase font-black bg-clip-text bg-gradient-to-r from-white via-[#f2ead8] to-[#d2ff4d] transition-all duration-300 group-hover/brand:tracking-[0.22em]"
              style={{ textShadow: "0 0 20px rgba(210,255,77,0.25)" }}
            >
              Pixel Empire
            </span>
            <span className="hidden sm:block text-[9px] font-mono tracking-[0.3em] uppercase text-[#d2ff4d]/60 -mt-0.5">
              WORLD MATRIX // V2.4
            </span>
          </div>
        </div>

        {/* ✨ Telemetry-Indexed Navigation Links Pill */}
        <div className="hidden md:flex items-center gap-1 z-10 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-inner">
          {["Explore", "Leaderboard", "About"].map((link, idx) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="relative px-4 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-[#f2ead8]/70 hover:text-[#d2ff4d] transition-all duration-300 rounded-full group/link overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="text-[10px] text-[#d2ff4d]/40 group-hover/link:text-[#d2ff4d] transition-colors font-bold">
                  0{idx + 1}.
                </span>
                {link}
              </span>
              {/* Neon pill hover backdrop */}
              <span className="absolute inset-0 bg-[#d2ff4d]/10 rounded-full opacity-0 group-hover/link:opacity-100 scale-90 group-hover/link:scale-100 transition-all duration-300 border border-[#d2ff4d]/25" />
            </a>
          ))}
        </div>

        {/* ✨ High-Performance Kinetic Action Trigger */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="relative z-10 bg-gradient-to-r from-[#d2ff4d] via-[#e5ff85] to-[#b3f000] text-[#0a0c09] px-6 md:px-7 py-2.5 md:py-3 rounded-full font-heading text-xs md:text-sm font-black tracking-widest uppercase hover:shadow-[0_0_35px_rgba(210,255,77,0.55)] transition-all duration-300 flex items-center gap-2 border border-[#e8ff99]/70 cursor-pointer overflow-hidden group/btn shadow-[0_10px_25px_rgba(210,255,77,0.2)]"
        >
          {/* Shimmer laser sweep */}
          <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform ease-in-out pointer-events-none" />

          <span className="relative z-10">Buy Pixels</span>
          <ArrowUpRight
            size={16}
            className="relative z-10 stroke-[2.5] transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          />
        </motion.button>
      </div>
    </motion.nav>
  );
}
