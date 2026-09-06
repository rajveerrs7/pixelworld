"use client";

import { motion } from "framer-motion";
import { mockTerritories } from "../data/mockTerritories";

export default function Leaderboard({ onSelectTerritory, onHoverTerritory }) {
  const sortedTerritories = [...mockTerritories]
    .sort((a, b) => b.width * b.height - a.width * a.height)
    .slice(0, 10); // Top 10

  return (
    <div id="leaderboard" className="max-w-6xl mx-auto my-32 px-4 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
        <div>
          <p className="text-[#ff7043] text-xs tracking-[0.3em] uppercase mb-3">
            02 / Power index
          </p>
          <h2 className="font-heading text-5xl md:text-7xl text-[#f2ead8] leading-[0.9] uppercase">
            Largest
            <br />
            Territories
          </h2>
        </div>
        <p className="text-[#f2ead8]/50 max-w-xs text-sm md:text-right">
          A live ranking of the coordinates with the most surface area.
        </p>
      </div>

      <div className="flex flex-col gap-2">
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
              className="group flex items-center justify-between bg-[#151a12]/75 border border-[#d2ff4d]/12 p-4 md:p-5 rounded-lg hover:border-[#d2ff4d]/55 hover:bg-[#d2ff4d]/5 transition-all cursor-pointer box-shadow-glow"
            >
              <div className="flex items-center gap-6">
                <span className="font-heading text-3xl text-[#d2ff4d]/40 group-hover:text-[#d2ff4d] transition-colors w-12">
                  #{i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-lg text-[#f2ead8] group-hover:text-[#d2ff4d] transition-colors uppercase tracking-wide">
                    {t.owner}
                  </h3>
                  <p className="text-sm text-[#f2ead8]/40">{t.website}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="font-heading text-xl text-[#FAAA48]">
                  {new Intl.NumberFormat().format(area)}{" "}
                  <span className="text-xs">px</span>
                </div>
                <div className="text-xs text-[#FFDDAC]/50">
                  {t.width} × {t.height}{" "}
                  <span className="text-[#ff7043]">/</span> {t.description}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
