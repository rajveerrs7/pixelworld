"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FAAA48]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="z-10 max-w-4xl mx-auto flex flex-col items-center"
      >
        <motion.div variants={item} className="mb-6 inline-block border border-[#FAAA48]/30 px-4 py-1.5 rounded-full bg-[#FAAA48]/10 text-[#FAAA48] text-sm tracking-widest uppercase font-semibold">
          $1 / Pixel • 1,000,000 Total Pixels
        </motion.div>
        
        <motion.h1 
          variants={item}
          className="font-heading text-6xl md:text-8xl lg:text-9xl text-[#FAAA48] mb-6 leading-none text-shadow-glow uppercase"
        >
          Own a piece <br/> of the internet.
        </motion.h1>
        
        <motion.p 
          variants={item}
          className="text-xl md:text-2xl text-[#FFDDAC]/80 mb-12 max-w-2xl font-light"
        >
          1,000,000 pixels. One digital world. Your permanent territory.
        </motion.p>
        
        <motion.button 
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-[#FAAA48] text-[#2F0F03] px-8 py-4 rounded-xl font-heading text-xl uppercase tracking-widest hover:bg-[#ffbf70] transition-colors flex items-center gap-3 box-shadow-glow"
        >
          Explore the Empire <ArrowDown size={24} />
        </motion.button>
      </motion.div>
      
      {/* Subtle animated particles/grid hint can go here */}
    </div>
  );
}