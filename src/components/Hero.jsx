"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowDown, Activity, Sparkles, Terminal, Shield } from "lucide-react";
import React, { MouseEvent } from "react";

export default function Hero() {
  // Motion values for dynamic 3D cursor tracking on the primary button
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid tilt physics
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 150,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 150,
    damping: 15,
  });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } },
  };

  return (
    <div className="relative min-h-[800px] md:min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 overflow-hidden bg-[#0a0c09] text-[#f2ead8] selection:bg-[#d2ff4d] selection:text-black">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 scanlines pointer-events-none z-10 opacity-60" />

      {/* Futuristic Glowing Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[750px] h-[500px] md:h-[750px] bg-[#d2ff4d]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#ff7043]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="z-20 max-w-6xl mx-auto flex flex-col items-center relative"
      >
        {/* HUD Tech Status Badge */}
        <motion.div
          variants={item}
          className="mb-8 inline-flex items-center gap-3 border border-[#d2ff4d]/30 px-5 py-2 rounded-full bg-[#d2ff4d]/5 backdrop-blur-md text-[#d2ff4d] text-xs tracking-[0.25em] uppercase font-mono shadow-[0_0_15px_rgba(210,255,77,0.15)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d2ff4d] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d2ff4d]"></span>
          </span>
          <Activity size={14} className="animate-pulse" /> Atlas online{" "}
          <span className="text-[#f2ead8]/30">|</span> 1,000,000 pixels
        </motion.div>

        {/* Dynamic Title */}
        <motion.h1
          variants={item}
          className="font-heading text-6xl md:text-8xl lg:text-[9.5rem] text-[#f2ead8] mb-6 leading-[0.85] uppercase tracking-tight relative select-none"
        >
          Own a piece <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d2ff4d] via-[#f3ff9e] to-[#88e600] drop-shadow-[0_0_35px_rgba(210,255,77,0.4)]">
            of the internet.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="text-lg md:text-2xl text-[#f2ead8]/70 mb-12 max-w-2xl font-light tracking-wide leading-relaxed"
        >
          1,000,000 pixels. One digital world. Your permanent territory.
        </motion.p>

        {/* Interactive 3D CTA Button */}
        <motion.div
          variants={item}
          style={{ perspective: 1000 }} // Enables 3D space context
          className="relative group"
        >
          <motion.button
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document
                .getElementById("explore")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#d2ff4d] to-[#b3f000] text-[#0a0c09] font-heading text-xl font-black uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(210,255,77,0.3)] hover:shadow-[0_0_50px_rgba(210,255,77,0.6)] transition-shadow duration-300 cursor-pointer overflow-hidden border border-[#e8ff99]/50"
          >
            {/* Holographic Inner Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Corner Tech Accents */}
            <span className="absolute top-1 left-2 text-[9px] font-mono opacity-40 text-black">
              +
            </span>
            <span className="absolute bottom-1 right-2 text-[9px] font-mono opacity-40 text-black">
              +
            </span>

            <span className="relative z-10 translate-z-10">
              Enter the atlas
            </span>
            <ArrowDown
              size={22}
              className="relative z-10 transition-transform group-hover:translate-y-1 duration-200 stroke-[3]"
            />
          </motion.button>
        </motion.div>

        {/* Footer Badge */}
        <motion.div
          variants={item}
          className="mt-16 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#f2ead8]/40 font-mono bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm"
        >
          <Sparkles
            size={14}
            className="text-[#ff7043] animate-spin"
            style={{ animationDuration: "8s" }}
          />
          <span>The internet is finite. Claim your coordinates.</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
