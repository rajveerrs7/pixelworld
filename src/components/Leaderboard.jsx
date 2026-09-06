"use client";

import { motion } from "framer-motion";
import { mockTerritories } from "../data/mockTerritories";

export default function Leaderboard({ onSelectTerritory, onHoverTerritory }) {
  const sortedTerritories = [...mockTerritories].sort((a, b) => 
    (b.width * b.height) - (a.width * a.height)
  ).slice(0, 10); // Top 10

  return (
    <div id="leaderboard" className="max-w-4xl mx-auto my-32 px-4 scroll-mt-24">
      <div className="text-center mb-12">
        <h2 className="font-heading text-4xl md:text-5xl text-[#FAAA48] mb-4 uppercase">Largest Territories</h2>
        <p className="text-[#FFDDAC]/70">The biggest landowners in the Pixel Empire.</p>
      </div>

      <div className="flex flex-col gap-3">
        {sortedTerritories.map((t, i) => {
          const area = t.width * t.height;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, x: 10 }}
              onClick={() => onSelectTerritory && onSelectTerritory(t)}
              onMouseEnter={() => onHoverTerritory && onHoverTerritory(t)}
              onMouseLeave={() => onHoverTerritory && onHoverTerritory(null)}
              className="group flex items-center justify-between bg-[#2F0F03]/80 border border-[#FAAA48]/20 p-4 md:p-6 rounded-xl hover:border-[#FAAA48]/60 hover:bg-[#FAAA48]/5 transition-all cursor-pointer box-shadow-glow"
            >
              <div className="flex items-center gap-6">
                <span className="font-heading text-3xl text-[#FAAA48]/50 group-hover:text-[#FAAA48] transition-colors w-12">
                  #{i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-lg text-[#FFDDAC] group-hover:text-[#FAAA48] transition-colors uppercase tracking-wide">
                    {t.owner}
                  </h3>
                  <p className="text-sm text-[#FFDDAC]/50">{t.website}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-heading text-xl text-[#FAAA48]">
                  {new Intl.NumberFormat().format(area)} px
                </div>
                <div className="text-xs text-[#FFDDAC]/50">
                  {t.width} × {t.height}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}