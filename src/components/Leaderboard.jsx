"use client";

import { motion } from "framer-motion";
import { Trophy, ExternalLink, ShieldAlert } from "lucide-react";

export default function Leaderboard({
  onSelectTerritory,
  onHoverTerritory,
  territories = [],
}) {
  const sortedTerritories = [...territories]
    .sort((a, b) => b.width * b.height - a.width * a.height)
    .slice(0, 10); // Top 10

  // Determine max area to render visual size percentage bars
  const maxArea =
    sortedTerritories.length > 0
      ? sortedTerritories[0].width * sortedTerritories[0].height
      : 1;

  return (
    <div
      id="leaderboard"
      className="max-w-6xl mx-auto my-36 px-6 scroll-mt-28 relative"
    >
      {/* Background Accent Ambient Glow */}
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#d2ff4d]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <div className="inline-flex items-center gap-2 text-[#ff7043] text-xs font-mono tracking-[0.3em] uppercase mb-4 bg-[#ff7043]/10 px-3 py-1 rounded-md border border-[#ff7043]/20">
            <Trophy size={14} /> 02 / Power Index
          </div>
          <h2 className="font-heading text-5xl md:text-7xl text-[#f2ead8] leading-[1.05] uppercase tracking-wide">
            Largest <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d2ff4d] to-[#88e600]">
              Territories
            </span>
          </h2>
        </div>
        <p className="text-[#f2ead8]/60 max-w-sm text-sm md:text-base font-mono md:text-right leading-relaxed">
          SYS::RANKINGS — Real-time telemetry of digital coordinates sorted by
          pixel surface area.
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="flex flex-col gap-4">
        {sortedTerritories.map((t, i) => {
          const area = t.width * t.height;
          const percentage = Math.max((area / maxArea) * 100, 4);

          return (
            <motion.div
              key={t.id || i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.015, x: 6 }}
              onClick={() => onSelectTerritory && onSelectTerritory(t)}
              onMouseEnter={() => onHoverTerritory && onHoverTerritory(t)}
              onMouseLeave={() => onHoverTerritory && onHoverTerritory(null)}
              className="group relative flex flex-col md:flex-row md:items-center justify-between bg-[#10140e]/90 border border-[#d2ff4d]/20 p-5 md:p-6 rounded-2xl hover:border-[#d2ff4d] hover:bg-[#151c12] transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(210,255,77,0.25)] overflow-hidden"
            >
              {/* Surface Area Fill Graph Background */}
              <div
                className="absolute bottom-0 left-0 top-0 bg-[#d2ff4d]/5 group-hover:bg-[#d2ff4d]/10 transition-all duration-500 pointer-events-none"
                style={{ width: `${percentage}%` }}
              />

              {/* Holographic Edge Highlight */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d2ff4d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Left Column: Rank & Owner */}
              <div className="flex items-center gap-6 z-10 mb-3 md:mb-0">
                <span className="font-heading text-2xl md:text-3xl font-black text-[#d2ff4d]/40 group-hover:text-[#d2ff4d] transition-colors w-12 tracking-wider">
                  #{String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg md:text-xl font-bold text-[#f2ead8] group-hover:text-white uppercase tracking-wider transition-colors">
                      {t.owner || "ANONYMOUS"}
                    </h3>
                    {t.website && (
                      <ExternalLink
                        size={14}
                        className="text-[#f2ead8]/30 group-hover:text-[#d2ff4d] transition-colors"
                      />
                    )}
                  </div>
                  <p className="text-xs md:text-sm font-mono text-[#f2ead8]/50 truncate max-w-xs">
                    {t.website || "NO_LINK_ATTACHED"}
                  </p>
                </div>
              </div>

              {/* Right Column: Pixel Stats */}
              <div className="text-left md:text-right z-10 flex md:flex-col justify-between items-end border-t border-white/5 md:border-t-0 pt-3 md:pt-0">
                <div className="font-heading text-xl md:text-2xl font-bold text-[#d2ff4d] group-hover:drop-shadow-[0_0_8px_rgba(210,255,77,0.6)] transition-all">
                  {new Intl.NumberFormat().format(area)}{" "}
                  <span className="text-xs font-mono font-normal text-[#d2ff4d]/70">
                    PX
                  </span>
                </div>

                <div className="text-xs font-mono text-[#f2ead8]/50 flex items-center gap-2">
                  <span>
                    {t.width} × {t.height}
                  </span>
                  <span className="text-[#ff7043]">•</span>
                  <span className="truncate max-w-[200px]">
                    {t.description || "Sector Territory"}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
