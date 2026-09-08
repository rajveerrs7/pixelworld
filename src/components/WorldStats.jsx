"use client";

import { motion } from "framer-motion";
import { formatUsd, PRICE_PER_PIXEL_CENTS } from "../lib/pricing";

export default function WorldStats({ territories }) {
  const totalPixels = 1000000;
  const claimedPixels = territories.reduce(
    (acc, t) => acc + t.width * t.height,
    0,
  );
  const percentClaimed = ((claimedPixels / totalPixels) * 100).toFixed(2);

  const stats = [
    { label: "Total Pixels", value: "1,000,000" },
    {
      label: "Potential Value",
      value: formatUsd(totalPixels * PRICE_PER_PIXEL_CENTS),
    },
    {
      label: "Pixels Claimed",
      value: new Intl.NumberFormat().format(claimedPixels),
    },
    { label: "World Claimed", value: `${percentClaimed}%` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px max-w-6xl mx-auto my-20 px-4 bg-[#d2ff4d]/15 border border-[#d2ff4d]/15">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="bg-[#151a12]/90 p-6 md:p-8 flex flex-col items-center justify-center text-center box-shadow-glow hover:bg-[#1d2418] transition-colors"
        >
          <span className="font-heading text-3xl md:text-4xl text-[#d2ff4d] mb-2">
            {stat.value}
          </span>
          <span className="text-[#f2ead8]/45 text-xs tracking-[0.18em] uppercase">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
