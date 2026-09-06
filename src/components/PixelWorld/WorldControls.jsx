import { Maximize, ZoomIn, ZoomOut } from "lucide-react";

export default function WorldControls({ onZoomIn, onZoomOut, onReset }) {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
      <button
        aria-label="Zoom in"
        onClick={onZoomIn}
        className="p-3 bg-[#10130f]/85 backdrop-blur-md text-[#d2ff4d] border border-[#d2ff4d]/30 rounded-lg hover:bg-[#d2ff4d]/20 transition-colors"
      >
        <ZoomIn size={20} />
      </button>
      <button
        aria-label="Zoom out"
        onClick={onZoomOut}
        className="p-3 bg-[#10130f]/85 backdrop-blur-md text-[#d2ff4d] border border-[#d2ff4d]/30 rounded-lg hover:bg-[#d2ff4d]/20 transition-colors"
      >
        <ZoomOut size={20} />
      </button>
      <button
        aria-label="Reset map view"
        onClick={onReset}
        className="p-3 bg-[#10130f]/85 backdrop-blur-md text-[#d2ff4d] border border-[#d2ff4d]/30 rounded-lg hover:bg-[#d2ff4d]/20 transition-colors"
      >
        <Maximize size={20} />
      </button>
    </div>
  );
}
