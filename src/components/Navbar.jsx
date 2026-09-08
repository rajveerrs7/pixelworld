"use client";

import { motion } from "framer-motion";
import { Grid, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 px-4 md:px-10 py-6"
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between bg-[#0e110c]/85 backdrop-blur-2xl px-6 md:px-8 py-4 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(210,255,77,0.15)] relative">
        {/* Subtle Ambient Edge Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d2ff4d]/10 via-transparent to-[#d2ff4d]/10 opacity-60 pointer-events-none" />

        {/* Brand Logo & Icon */}
        <div className="flex items-center gap-3.5 text-[#d2ff4d] z-10">
          <span className="font-heading text-xl md:text-2xl tracking-widest uppercase font-extrabold bg-clip-text bg-gradient-to-r from-white via-[#f2ead8] to-[#d2ff4d]">
            Pixel Empire
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-2 z-10 bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          {["Explore", "Leaderboard", "About"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="relative px-5 py-2 text-sm md:text-base font-mono uppercase tracking-widest text-[#f2ead8]/70 hover:text-[#d2ff4d] transition-all duration-200 group"
            >
              <span className="relative z-10">{link}</span>
              <span className="absolute inset-0 bg-[#d2ff4d]/10 rounded-full scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200" />
            </a>
          ))}
        </div>

        {/* Futuristic CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 bg-gradient-to-r from-[#d2ff4d] to-[#b3f000] text-[#0a0c09] px-7 py-3 rounded-full font-heading text-base md:text-lg font-black tracking-wider uppercase hover:shadow-[0_0_30px_rgba(210,255,77,0.6)] transition-all duration-300 flex items-center gap-2.5 border border-[#e8ff99]/60 cursor-pointer overflow-hidden group"
        >
          <span className="relative z-10">Buy Pixels</span>
          <ArrowUpRight
            size={20}
            className="relative z-10 stroke-[2.5] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-200"
          />
          <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
        </motion.button>
      </div>
    </motion.nav>
  );
}
