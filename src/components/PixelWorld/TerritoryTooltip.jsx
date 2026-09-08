import { motion, AnimatePresence } from "framer-motion";

const numberFormat = new Intl.NumberFormat("en-US");

export default function TerritoryTooltip({ territory, position }) {
  return (
    <AnimatePresence>
      {territory && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute pointer-events-none z-20 bg-[#10130f]/95 backdrop-blur-md border border-[#d2ff4d]/50 p-4 rounded-xl box-shadow-glow min-w-[200px]"
          style={{
            left:
              position.x > position.containerWidth - 250
                ? position.x - 220
                : position.x + 20,
            top:
              position.y > position.containerHeight - 200
                ? position.y - 180
                : position.y + 20,
          }}
        >
          <h3 className="font-heading text-xl text-[#d2ff4d] mb-1 uppercase tracking-wider">
            {territory.owner}
          </h3>
          {territory.website && (
            <p className="text-sm text-[#f2ead8]/80 mb-2">
              {territory.website}
            </p>
          )}
          {territory.description && (
            <p className="text-xs leading-relaxed text-[#f2ead8]/65 mb-3">
              {territory.description}
            </p>
          )}
          <div className="flex justify-between text-xs border-t border-[#d2ff4d]/20 pt-2">
            <span>
              {numberFormat.format(territory.width * territory.height)} pixels
            </span>
            <span>
              {territory.width} × {territory.height}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
