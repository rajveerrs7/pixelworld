import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, X } from "lucide-react";
import {
  calculatePrice,
  getSelectionRectangle,
  isSelectionValid,
} from "../../lib/geometry";
import { WORLD_SIZE } from "./worldConstants";

const numberFormat = new Intl.NumberFormat("en-US");

function Details({ rectangle }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Dimensions</span>
        <span>
          {rectangle.width} × {rectangle.height}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Pixels</span>
        <span>{numberFormat.format(rectangle.width * rectangle.height)}</span>
      </div>
      <div className="flex justify-between text-[#d2ff4d] font-bold text-lg mt-2 pt-2 border-t border-[#d2ff4d]/20">
        <span>Price</span>
        <span>
          $
          {numberFormat.format(
            calculatePrice(rectangle.width, rectangle.height),
          )}
        </span>
      </div>
    </div>
  );
}

export default function SelectionPanel({
  firstPoint,
  currentCursorPoint,
  finalSelection,
  territories,
  onCancel,
}) {
  const preview =
    firstPoint && currentCursorPoint && !finalSelection
      ? getSelectionRectangle(firstPoint, currentCursorPoint)
      : null;
  const rectangle = preview || finalSelection;
  const valid = preview
    ? isSelectionValid(preview, territories, WORLD_SIZE, WORLD_SIZE).valid
    : true;

  return (
    <AnimatePresence>
      {rectangle && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute bottom-6 left-6 z-20 bg-[#10130f]/95 backdrop-blur-md border border-[#d2ff4d]/50 p-6 rounded-xl box-shadow-glow w-80 max-w-[calc(100%-7rem)]"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-heading text-2xl text-[#d2ff4d] uppercase">
              Your Territory
            </h3>
            <button
              aria-label="Cancel selection"
              onClick={onCancel}
              className="text-[#FAAA48]/50 hover:text-[#d2ff4d] transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          {preview && (
            <div className="space-y-4">
              <p className="text-sm text-[#f2ead8]/80 animate-pulse flex items-center gap-2">
                <Crosshair size={16} /> Select bottom-right corner
              </p>
              <Details rectangle={preview} />
              {!valid && (
                <div className="text-[#FAAA48] mt-2 font-bold text-center bg-[#2F0F03] border border-[#FAAA48]/50 py-2 rounded animate-pulse">
                  AREA UNAVAILABLE
                </div>
              )}
            </div>
          )}
          {finalSelection && (
            <div className="space-y-4">
              <Details rectangle={finalSelection} />
              <button className="w-full py-3 bg-[#d2ff4d] text-[#10130f] font-bold rounded hover:bg-[#e3ff8a] transition-colors font-heading text-lg">
                CONTINUE
              </button>
              <button
                onClick={onCancel}
                className="w-full py-3 bg-[#d2ff4d] text-[#10130f] font-bold rounded hover:bg-[#e3ff8a] transition-colors font-heading text-lg"
              >
                Cancel Selection
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
