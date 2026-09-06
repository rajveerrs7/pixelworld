"use client";

import { motion } from "framer-motion";
import { Grid, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 py-4"
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between bg-[#10130f]/75 backdrop-blur-xl border border-[#d2ff4d]/20 px-4 md:px-6 py-3 rounded-xl box-shadow-glow">
        <div className="flex items-center gap-3 text-[#d2ff4d]">
          {/* <Grid className="w-6 h-6" /> */}
          <span className="font-heading text-xl tracking-wider uppercase">
            Pixel Empire
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a
            href="#explore"
            className="text-[#f2ead8]/70 hover:text-[#d2ff4d] transition-colors"
          >
            Explore
          </a>
          <a
            href="#leaderboard"
            className="text-[#f2ead8]/70 hover:text-[#d2ff4d] transition-colors"
          >
            Leaderboard
          </a>
          <a
            href="#about"
            className="text-[#f2ead8]/70 hover:text-[#d2ff4d] transition-colors"
          >
            About
          </a>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#d2ff4d] text-[#10130f] px-4 py-2 rounded-lg font-bold text-sm tracking-wider hover:bg-[#e3ff8a] transition-colors flex items-center gap-2"
        >
          BUY PIXELS <ArrowUpRight size={16} />
        </motion.button>
      </div>
    </motion.nav>
  );
}
