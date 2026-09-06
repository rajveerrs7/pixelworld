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
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' });
    // Reset focus after a short delay so clicking again works
    setTimeout(() => setFocusTerritory(null), 100);
  }, []);

  return (
    <main className="min-h-screen bg-[#2F0F03] selection:bg-[#FAAA48]/30 selection:text-[#FAAA48]">
      <Navbar />
      <Hero />
      
      <div id="explore" className="max-w-[1400px] mx-auto px-4 py-20 relative scroll-mt-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#FAAA48]/5 rounded-[100%] blur-[100px] pointer-events-none" />
        
        <div className="text-center mb-10 z-10 relative">
          <h2 className="font-heading text-4xl text-[#FAAA48] uppercase mb-4">The World</h2>
          <p className="text-[#FFDDAC]/70 max-w-2xl mx-auto">
            Drag to pan. Scroll to zoom. Click empty space to select territory. Hover to inspect.
          </p>
        </div>

        <div className="z-10 relative p-2 rounded-2xl bg-gradient-to-b from-[#FAAA48]/20 to-transparent">
          <PixelWorld focusTerritory={focusTerritory} externalHoverTerritory={hoverTerritory} />
        </div>
      </div>

      <WorldStats />
      
      <Leaderboard onSelectTerritory={handleLeaderboardClick} onHoverTerritory={setHoverTerritory} />

      <footer className="border-t border-[#FAAA48]/20 py-12 text-center mt-32">
        <h3 className="font-heading text-2xl text-[#FAAA48] mb-4 uppercase">Pixel Empire</h3>
        <p className="text-[#FFDDAC]/50 text-sm">Own a piece of the internet. A frontend experiment.</p>
      </footer>
    </main>
  );
}