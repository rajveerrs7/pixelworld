"use client";

import { motion } from "framer-motion";
import { Trophy, ExternalLink, ShieldAlert } from "lucide-react";

export default function Leaderboard({
  onSelectTerritory,
  onHoverTerritory,
  territories = [],
}) {
  /* ✨ Preserved logic intact */
  const sortedTerritories = [...territories]
    .sort((a, b) => b.width * b.height - a.width * a.height)
    .slice(0, 10); // Top 10

  // Determine max area to render visual size percentage bars
  const maxArea =
    sortedTerritories.length > 0
      ? sortedTerritories[0].width * sortedTerritories[0].height
      : 1;

  /* ✨ Futuristic enhancement — Framer Motion container variants */
  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -25, y: 10 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div
      id="leaderboard"
      className="max-w-6xl mx-auto my-36 px-6 scroll-mt-28 relative font-[system-ui,-apple-system,'Inter',sans-serif]"
    >
      {/* ✨ Futuristic enhancement — Injected Keyframe Styles */}
      <style jsx global>{`
        @keyframes laser-pulse {
          0%,
          100% {
            opacity: 0.4;
            transform: scaleY(1);
          }
          50% {
            opacity: 1;
            transform: scaleY(1.2);
          }
        }
        @keyframes scan-radar {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        .animate-laser {
          animation: laser-pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* ✨ Futuristic enhancement — Multi-layered ambient lighting */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[#d2ff4d]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#ff7043]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ✨ Header Section with Sci-Fi Telemetry */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 relative z-10">
        <div>
          <h2 className="font-heading text-5xl md:text-7xl text-[#f2ead8] leading-[1.05] uppercase tracking-wide">
            Largest <br />
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#d2ff4d] via-[#e5ff8a] to-[#88e600]"
              style={{
                textShadow: "0 0 35px rgba(210,255,77,0.3)",
              }}
            >
              Territories
            </span>
          </h2>
        </div>

        {/* Right side telemetry terminal label */}
        <div className="flex flex-col md:items-end gap-2">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#d2ff4d]/70 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d2ff4d]" />
            <span>LIVE SECTOR SURVEILLANCE</span>
          </div>
          <p className="text-[#f2ead8]/60 max-w-sm text-xs md:text-sm font-mono md:text-right leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-[#d2ff4d]/30 pl-3 md:pl-0 md:pr-3 py-0.5">
            SYS::RANKINGS — Real-time telemetry of digital coordinates sorted by
            pixel surface area.
          </p>
        </div>
      </div>

      {/* ✨ Leaderboard List with Staggered Framer Motion Entrance */}
      {sortedTerritories.length === 0 ? (
        /* Empty state fallback with futuristic radar styling */
        <div className="relative p-12 rounded-3xl bg-[#10140e]/60 border border-[#d2ff4d]/20 backdrop-blur-xl text-center flex flex-col items-center justify-center gap-4">
          <ShieldAlert size={36} className="text-[#ff7043] animate-pulse" />
          <p className="font-mono text-sm uppercase tracking-widest text-[#f2ead8]/60">
            NO REGISTERED SECTORS DETECTED IN WORLD GRID
          </p>
        </div>
      ) : (
        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-3.5 relative z-10"
        >
          {sortedTerritories.map((t, i) => {
            const area = t.width * t.height;
            const percentage = Math.max((area / maxArea) * 100, 4);
            const isRankOne = i === 0;
            const isRankTwo = i === 1;
            const isRankThree = i === 2;

            return (
              <motion.div
                key={t.id || i}
                variants={rowVariants}
                whileHover={{ scale: 1.012, x: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => onSelectTerritory && onSelectTerritory(t)}
                onMouseEnter={() => onHoverTerritory && onHoverTerritory(t)}
                onMouseLeave={() => onHoverTerritory && onHoverTerritory(null)}
                className={`group relative flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 rounded-2xl cursor-pointer overflow-hidden transition-all duration-300 backdrop-blur-xl border ${
                  isRankOne
                    ? "bg-[#141b11]/90 border-[#d2ff4d]/40 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(210,255,77,0.12)] hover:border-[#d2ff4d] hover:shadow-[0_0_35px_rgba(210,255,77,0.25)]"
                    : isRankTwo
                      ? "bg-[#141611]/90 border-[#ff7043]/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:border-[#ff7043] hover:shadow-[0_0_30px_rgba(255,112,67,0.2)]"
                      : "bg-[#0f140d]/85 border-[#d2ff4d]/15 shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:border-[#d2ff4d]/50 hover:bg-[#141c12] hover:shadow-[0_0_25px_rgba(210,255,77,0.15)]"
                }`}
              >
                {/* ✨ Futuristic enhancement — Surface Area Holographic Fill Graph */}
                <div
                  className="absolute bottom-0 left-0 top-0 bg-gradient-to-r from-[#d2ff4d]/[0.06] via-[#d2ff4d]/[0.08] to-transparent group-hover:from-[#d2ff4d]/[0.12] group-hover:via-[#d2ff4d]/[0.16] transition-all duration-500 pointer-events-none"
                  style={{ width: `${percentage}%` }}
                >
                  {/* Glowing Laser leading edge */}
                  <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#d2ff4d] to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* ✨ Futuristic enhancement — Corner HUD brackets on hover */}
                <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-[#d2ff4d]/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="absolute top-2 right-2 w-2 h-2 border-r border-t border-[#d2ff4d]/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-2 h-2 border-l border-b border-[#d2ff4d]/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-[#d2ff4d]/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* ✨ Holographic edge indicator strip */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                    isRankOne
                      ? "bg-[#d2ff4d] opacity-100 shadow-[0_0_10px_#d2ff4d]"
                      : isRankTwo
                        ? "bg-[#ff7043] opacity-80 group-hover:opacity-100"
                        : "bg-[#d2ff4d] opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* ✨ Left Column: Rank Identifier & Owner Details */}
                <div className="flex items-center gap-5 md:gap-7 z-10 mb-4 md:mb-0">
                  {/* Stylized Cyber Rank Display */}
                  <div className="flex flex-col items-center justify-center min-w-[50px]">
                    <span
                      className={`font-mono font-black text-2xl md:text-3xl tracking-tight transition-all duration-300 ${
                        isRankOne
                          ? "text-[#d2ff4d] drop-shadow-[0_0_10px_rgba(210,255,77,0.6)]"
                          : isRankTwo
                            ? "text-[#ff7043] drop-shadow-[0_0_8px_rgba(255,112,67,0.5)]"
                            : isRankThree
                              ? "text-[#f2ead8] group-hover:text-[#d2ff4d]"
                              : "text-[#f2ead8]/30 group-hover:text-[#d2ff4d]"
                      }`}
                    >
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                    {isRankOne && (
                      <span className="text-[9px] font-mono tracking-widest text-[#d2ff4d] uppercase font-semibold">
                        Apex
                      </span>
                    )}
                  </div>

                  {/* Owner metadata */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-heading text-lg md:text-xl font-bold text-[#f2ead8] group-hover:text-white uppercase tracking-wider transition-colors">
                        {t.owner || "ANONYMOUS"}
                      </h3>
                      {t.website && (
                        <span className="p-1 rounded-md bg-white/[0.04] group-hover:bg-[#d2ff4d]/10 transition-colors">
                          <ExternalLink
                            size={13}
                            className="text-[#f2ead8]/40 group-hover:text-[#d2ff4d] transition-colors"
                          />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d2ff4d]/50 group-hover:bg-[#d2ff4d] transition-colors" />
                      <p className="text-xs md:text-sm font-mono text-[#f2ead8]/50 group-hover:text-[#f2ead8]/80 transition-colors truncate max-w-[220px] sm:max-w-xs">
                        {t.website || "NO_LINK_ATTACHED"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ✨ Right Column: Pixel Telemetry & Metrics */}
                <div className="text-left md:text-right z-10 flex md:flex-col justify-between items-end border-t border-white/[0.06] md:border-t-0 pt-3 md:pt-0 gap-1.5">
                  <div className="flex items-baseline md:justify-end gap-1.5">
                    <span
                      className="font-heading text-2xl md:text-3xl font-black text-[#d2ff4d] tracking-tight transition-all duration-300 group-hover:scale-105 inline-block"
                      style={{
                        textShadow:
                          "0 0 16px rgba(210,255,77,0.35), 0 0 30px rgba(210,255,77,0.15)",
                      }}
                    >
                      {new Intl.NumberFormat().format(area)}
                    </span>
                    <span className="text-[11px] font-mono font-bold tracking-widest text-[#d2ff4d]/80 uppercase">
                      PX
                    </span>
                  </div>

                  {/* Dimension Matrix & Description Tag */}
                  <div className="text-xs font-mono text-[#f2ead8]/50 flex items-center gap-2 group-hover:text-[#f2ead8]/75 transition-colors">
                    <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5 text-[11px]">
                      {t.width} × {t.height}
                    </span>
                    <span className="text-[#ff7043] font-bold">•</span>
                    <span className="truncate max-w-[150px] sm:max-w-[220px]">
                      {t.description || "Sector Territory"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
