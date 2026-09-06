"use client";

import { motion } from "framer-motion";
import { mockTerritories } from "../data/mockTerritories";

export default function WorldStats() {
  const totalPixels = 1000000;
  const claimedPixels = mockTerritories.reduce((acc, t) => acc + (t.width * t.height), 0);
  const percentClaimed = ((claimedPixels / totalPixels) * 100).toFixed(2);

  const stats = [
    { label: "Total Pixels", value: "1,000,000" },
    { label: "Potential Value", value: "$1,000,000" },
    { label: "Pixels Claimed", value: new Intl.NumberFormat().format(claimedPixels) },
    { label: "World Claimed", value: `${percentClaimed}%` }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto my-20 px-4">
      {stats.map((stat, i) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-[#2F0F03]/50 border border-[#FAAA48]/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center box-shadow-glow hover:bg-[#2F0F03] transition-colors"
        >
          <span className="font-heading text-3xl md:text-4xl text-[#FAAA48] mb-2">{stat.value}</span>
          <span className="text-[#FFDDAC]/60 text-sm tracking-widest uppercase">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}