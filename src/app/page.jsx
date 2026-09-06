"use client";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WorldStats from "../components/WorldStats";
import PixelWorld from "../components/PixelWorld";
import Leaderboard from "../components/Leaderboard";

import { useState, useCallback } from "react";

export default function Page() {
  const [focusTerritory, setFocusTerritory] = useState(null);
  const [hoverTerritory, setHoverTerritory] = useState(null);

  const handleLeaderboardClick = useCallback((territory) => {
    setFocusTerritory(territory);
    // Scroll to canvas
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
    // Reset focus after a short delay so clicking again works
    setTimeout(() => setFocusTerritory(null), 100);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#10130f] selection:bg-[#d2ff4d]/30 selection:text-[#d2ff4d]">
      <Navbar />
      <Hero />

      <div
        id="explore"
        className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 relative scroll-mt-24"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#d2ff4d]/5 rounded-[100%] blur-[120px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 z-10 relative">
          <div>
            <p className="text-[#d2ff4d] text-xs tracking-[0.3em] uppercase mb-3">
              01 / Live atlas
            </p>
            <h2 className="font-heading text-5xl md:text-7xl text-[#f2ead8] uppercase leading-[0.9]">
              The World
            </h2>
          </div>
          <p className="text-[#f2ead8]/55 max-w-sm text-sm leading-relaxed md:text-right">
            Navigate the live grid. Every bright block is a permanent claim in
            the public pixel record.
          </p>
        </div>

        <div className="z-10 relative p-px bg-gradient-to-br from-[#d2ff4d]/50 via-[#d2ff4d]/10 to-[#ff7043]/50 rounded-[1.35rem]">
          <PixelWorld
            focusTerritory={focusTerritory}
            externalHoverTerritory={hoverTerritory}
          />
        </div>
      </div>

      <WorldStats />

      <Leaderboard
        onSelectTerritory={handleLeaderboardClick}
        onHoverTerritory={setHoverTerritory}
      />

      <footer
        id="about"
        className="border-t border-[#d2ff4d]/15 py-16 px-6 mt-32"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="font-heading text-3xl text-[#d2ff4d] mb-2 uppercase">
              Pixel Empire
            </h3>
            <p className="text-[#f2ead8]/45 text-sm">
              A public canvas for permanent digital territory.
            </p>
          </div>
          <div className="text-xs text-[#f2ead8]/40 uppercase tracking-[0.2em] md:text-right">
            Atlas online / 2026
          </div>
        </div>
      </footer>
    </main>
  );
}
