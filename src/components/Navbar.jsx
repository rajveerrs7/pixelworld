"use client";

import { motion } from "framer-motion";
import { Grid } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-[#2F0F03]/60 backdrop-blur-xl border border-[#FAAA48]/20 px-6 py-3 rounded-2xl box-shadow-glow">
        <div className="flex items-center gap-3 text-[#FAAA48]">
          <Grid className="w-6 h-6" />
          <span className="font-heading text-xl tracking-wider uppercase">Pixel Empire</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="#explore" className="text-[#FFDDAC] hover:text-[#FAAA48] transition-colors">Explore</a>
          <a href="#leaderboard" className="text-[#FFDDAC] hover:text-[#FAAA48] transition-colors">Leaderboard</a>
          <a href="#about" className="text-[#FFDDAC] hover:text-[#FAAA48] transition-colors">About</a>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#FAAA48] text-[#2F0F03] px-6 py-2 rounded-lg font-bold text-sm tracking-wider hover:bg-[#ffbf70] transition-colors"
        >
          BUY PIXELS
        </motion.button>
      </div>
    </motion.nav>
  );
}