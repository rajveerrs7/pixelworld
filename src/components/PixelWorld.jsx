"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getTerritoryAtPoint,
  getSelectionRectangle,
  isSelectionValid,
  calculatePrice,
} from "../lib/geometry";
import { mockTerritories } from "../data/mockTerritories";
import { X, ZoomIn, ZoomOut, Maximize, Crosshair } from "lucide-react";

const WORLD_SIZE = 1000;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 50;

function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num);
}

export default function PixelWorld({ focusTerritory, externalHoverTerritory }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Transform state
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  // Interaction state
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState(null);
  const [mouseMoved, setMouseMoved] = useState(false);

  // Selection state
  const [firstPoint, setFirstPoint] = useState(null);
  const [currentCursorPoint, setCurrentCursorPoint] = useState(null);
  const [finalSelection, setFinalSelection] = useState(null);

  // Hover state
  const [hoveredTerritory, setHoveredTerritory] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    containerWidth: 0,
    containerHeight: 0,
  });

  // Center the world on initial load
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      const initialScale = Math.max(
        MIN_ZOOM,
        Math.min(width / WORLD_SIZE, height / WORLD_SIZE) * 0.9,
      );
      setTransform({
        x: (width - WORLD_SIZE * initialScale) / 2,
        y: (height - WORLD_SIZE * initialScale) / 2,
        scale: initialScale,
      });
    }
  }, []);

  // Handle focus from leaderboard
  useEffect(() => {
    if (focusTerritory && containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      // Calculate center of the territory
      const targetX = focusTerritory.x + focusTerritory.width / 2;
      const targetY = focusTerritory.y + focusTerritory.height / 2;

      const newScale = Math.min(
        MAX_ZOOM,
        Math.max(
          2,
          Math.min(
            width / focusTerritory.width,
            height / focusTerritory.height,
          ) * 0.5,
        ),
      );

      setTransform({
        x: width / 2 - targetX * newScale,
        y: height / 2 - targetY * newScale,
        scale: newScale,
      });
    }
  }, [focusTerritory]);

  const screenToWorld = useCallback(
    (screenX, screenY, currentTransform = transform) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.floor(
        (screenX - rect.left - currentTransform.x) / currentTransform.scale,
      );
      const y = Math.floor(
        (screenY - rect.top - currentTransform.y) / currentTransform.scale,
      );
      return { x, y };
    },
    [transform],
  );

  const worldToScreen = useCallback(
    (worldX, worldY) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: worldX * transform.scale + transform.x + rect.left,
        y: worldY * transform.scale + transform.y + rect.top,
      };
    },
    [transform],
  );

  // Main Draw Loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    // Draw base world (unoccupied)
    ctx.fillStyle = "#e9e4d6";
    ctx.fillRect(0, 0, WORLD_SIZE, WORLD_SIZE);

    // Keep the atlas edge visible at every zoom level.
    ctx.strokeStyle = "rgba(16, 19, 15, 0.9)";
    ctx.lineWidth = 5 / transform.scale;
    ctx.strokeRect(0, 0, WORLD_SIZE, WORLD_SIZE);
    ctx.strokeStyle = "rgba(210, 255, 77, 0.95)";
    ctx.lineWidth = 2 / transform.scale;
    ctx.strokeRect(
      3 / transform.scale,
      3 / transform.scale,
      WORLD_SIZE - 6 / transform.scale,
      WORLD_SIZE - 6 / transform.scale,
    );

    // Draw grid if zoomed in enough
    if (transform.scale > 5) {
      ctx.strokeStyle = "rgba(16, 19, 15, 0.18)";
      ctx.lineWidth = 1 / transform.scale;

      const startX = Math.max(0, Math.floor(-transform.x / transform.scale));
      const endX = Math.min(
        WORLD_SIZE,
        Math.ceil((width - transform.x) / transform.scale),
      );
      const startY = Math.max(0, Math.floor(-transform.y / transform.scale));
      const endY = Math.min(
        WORLD_SIZE,
        Math.ceil((height - transform.y) / transform.scale),
      );

      ctx.beginPath();
      for (let x = startX; x <= endX; x++) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
      }
      for (let y = startY; y <= endY; y++) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
      }
      ctx.stroke();
    }

    // Draw territories
    const activeHoverId = externalHoverTerritory?.id || hoveredTerritory?.id;
    mockTerritories.forEach((t) => {
      const isHovered = activeHoverId === t.id;
      ctx.fillStyle = isHovered ? "#d2ff4d" : "rgba(255, 112, 67, 0.82)";
      ctx.fillRect(t.x, t.y, t.width, t.height);

      if (isHovered) {
        ctx.strokeStyle = "#10130f";
        ctx.lineWidth = 2 / transform.scale;
        ctx.strokeRect(t.x, t.y, t.width, t.height);
      }
    });

    // Draw Selection Preview
    if (firstPoint && currentCursorPoint && !finalSelection) {
      const rect = getSelectionRectangle(firstPoint, currentCursorPoint);
      const isValid = isSelectionValid(
        rect,
        mockTerritories,
        WORLD_SIZE,
        WORLD_SIZE,
      );

      ctx.fillStyle = isValid
        ? "rgba(210, 255, 77, 0.4)"
        : "rgba(16, 19, 15, 0.7)";
      ctx.strokeStyle = isValid ? "#d2ff4d" : "#10130f";
      ctx.lineWidth = 2 / transform.scale;

      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

      // Draw first point marker
      ctx.fillStyle = "#10130f";
      ctx.fillRect(firstPoint.x, firstPoint.y, 1, 1);
    }

    // Draw Final Selection
    if (finalSelection) {
      ctx.fillStyle = "rgba(210, 255, 77, 0.6)";
      ctx.strokeStyle = "#d2ff4d";
      ctx.lineWidth = 3 / transform.scale;
      ctx.fillRect(
        finalSelection.x,
        finalSelection.y,
        finalSelection.width,
        finalSelection.height,
      );
      ctx.strokeRect(
        finalSelection.x,
        finalSelection.y,
        finalSelection.width,
        finalSelection.height,
      );
    }

    ctx.restore();
  }, [
    transform,
    hoveredTerritory,
    externalHoverTerritory,
    firstPoint,
    currentCursorPoint,
    finalSelection,
  ]);

  useEffect(() => {
    let animationFrameId;
    const render = () => {
      draw();
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [draw]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width * window.devicePixelRatio;
        canvasRef.current.height = height * window.devicePixelRatio;
        const ctx = canvasRef.current.getContext("2d");
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Events
  const handlePointerDown = (e) => {
    setLastPanPoint({ x: e.clientX, y: e.clientY });
    setIsPanning(true);
    setMouseMoved(false);
  };

  const handlePointerMove = (e) => {
    const { clientX, clientY } = e;

    if (isPanning && lastPanPoint) {
      const dx = clientX - lastPanPoint.x;
      const dy = clientY - lastPanPoint.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        setMouseMoved(true);
      }
      setTransform((prev) => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      setLastPanPoint({ x: clientX, y: clientY });
    }

    const worldPoint = screenToWorld(clientX, clientY);

    // Clamp cursor point to world bounds for selection
    const clampedPoint = {
      x: Math.max(0, Math.min(WORLD_SIZE - 1, worldPoint.x)),
      y: Math.max(0, Math.min(WORLD_SIZE - 1, worldPoint.y)),
    };
    setCurrentCursorPoint(clampedPoint);

    // Hover logic
    if (!isPanning && !firstPoint && !finalSelection) {
      if (
        worldPoint.x >= 0 &&
        worldPoint.x < WORLD_SIZE &&
        worldPoint.y >= 0 &&
        worldPoint.y < WORLD_SIZE
      ) {
        const territory = getTerritoryAtPoint(worldPoint, mockTerritories);
        setHoveredTerritory(territory || null);
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
          setTooltipPos({
            x: clientX - containerRect.left,
            y: clientY - containerRect.top,
            containerWidth: containerRect.width,
            containerHeight: containerRect.height,
          });
        }
      } else {
        setHoveredTerritory(null);
      }
    } else {
      setHoveredTerritory(null);
    }
  };

  const handlePointerUp = (e) => {
    setIsPanning(false);
    setLastPanPoint(null);

    if (!mouseMoved) {
      // It was a click
      const worldPoint = screenToWorld(e.clientX, e.clientY);

      // Ignore clicks outside world
      if (
        worldPoint.x < 0 ||
        worldPoint.x >= WORLD_SIZE ||
        worldPoint.y < 0 ||
        worldPoint.y >= WORLD_SIZE
      )
        return;

      // Ignore clicks if final selection exists
      if (finalSelection) return;

      const territory = getTerritoryAtPoint(worldPoint, mockTerritories);
      if (territory) return; // Can't select occupied

      if (!firstPoint) {
        setFirstPoint(worldPoint);
      } else {
        const rect = getSelectionRectangle(firstPoint, worldPoint);
        if (isSelectionValid(rect, mockTerritories, WORLD_SIZE, WORLD_SIZE)) {
          setFinalSelection(rect);
        }
        setFirstPoint(null);
      }
    }
  };

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const zoomSensitivity = 0.002;
    const delta = -e.deltaY * zoomSensitivity;

    setTransform((prev) => {
      const newScale = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, prev.scale * Math.exp(delta)),
      );

      // Zoom around cursor
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const worldX = (mouseX - prev.x) / prev.scale;
      const worldY = (mouseY - prev.y) / prev.scale;

      return {
        scale: newScale,
        x: mouseX - worldX * newScale,
        y: mouseY - worldY * newScale,
      };
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  const cancelSelection = () => {
    setFirstPoint(null);
    setFinalSelection(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") cancelSelection();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const zoomIn = () =>
    setTransform((p) => ({ ...p, scale: Math.min(MAX_ZOOM, p.scale * 1.5) }));
  const zoomOut = () =>
    setTransform((p) => ({ ...p, scale: Math.max(MIN_ZOOM, p.scale / 1.5) }));
  const resetZoom = () => {
    const { width, height } = containerRef.current.getBoundingClientRect();
    const initialScale = Math.max(
      MIN_ZOOM,
      Math.min(width / WORLD_SIZE, height / WORLD_SIZE) * 0.9,
    );
    setTransform({
      x: (width - WORLD_SIZE * initialScale) / 2,
      y: (height - WORLD_SIZE * initialScale) / 2,
      scale: initialScale,
    });
  };

  return (
    <div
      className="relative w-full h-[72vh] min-h-[540px] bg-[#e9e4d6] rounded-[1.25rem] overflow-hidden shadow-2xl border border-[#d2ff4d]/30 box-shadow-glow"
      ref={containerRef}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />

      {/* Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
        <button
          aria-label="Zoom in"
          onClick={zoomIn}
          className="p-3 bg-[#10130f]/85 backdrop-blur-md text-[#d2ff4d] border border-[#d2ff4d]/30 rounded-lg hover:bg-[#d2ff4d]/20 transition-colors"
        >
          <ZoomIn size={20} />
        </button>
        <button
          aria-label="Zoom out"
          onClick={zoomOut}
          className="p-3 bg-[#10130f]/85 backdrop-blur-md text-[#d2ff4d] border border-[#d2ff4d]/30 rounded-lg hover:bg-[#d2ff4d]/20 transition-colors"
        >
          <ZoomOut size={20} />
        </button>
        <button
          aria-label="Reset map view"
          onClick={resetZoom}
          className="p-3 bg-[#10130f]/85 backdrop-blur-md text-[#d2ff4d] border border-[#d2ff4d]/30 rounded-lg hover:bg-[#d2ff4d]/20 transition-colors"
        >
          <Maximize size={20} />
        </button>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredTerritory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute pointer-events-none z-20 bg-[#10130f]/95 backdrop-blur-md border border-[#d2ff4d]/50 p-4 rounded-xl box-shadow-glow min-w-[200px]"
            style={{
              left:
                tooltipPos.x > tooltipPos.containerWidth - 250
                  ? tooltipPos.x - 220
                  : tooltipPos.x + 20,
              top:
                tooltipPos.y > tooltipPos.containerHeight - 200
                  ? tooltipPos.y - 180
                  : tooltipPos.y + 20,
            }}
          >
            <h3 className="font-heading text-xl text-[#d2ff4d] mb-1 uppercase tracking-wider">
              {hoveredTerritory.owner}
            </h3>
            <p className="text-sm text-[#f2ead8]/80 mb-3">
              {hoveredTerritory.website}
            </p>
            <div className="flex justify-between text-xs border-t border-[#d2ff4d]/20 pt-2">
              <span>
                {formatNumber(hoveredTerritory.width * hoveredTerritory.height)}{" "}
                pixels
              </span>
              <span>
                {hoveredTerritory.width} × {hoveredTerritory.height}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Info / Floating Panel */}
      <AnimatePresence>
        {(firstPoint || finalSelection) && (
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
                onClick={cancelSelection}
                className="text-[#FAAA48]/50 hover:text-[#d2ff4d] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {!finalSelection && firstPoint && currentCursorPoint && (
              <div className="space-y-4">
                <p className="text-sm text-[#f2ead8]/80 animate-pulse flex items-center gap-2">
                  <Crosshair size={16} /> Select bottom-right corner
                </p>
                {(() => {
                  const rect = getSelectionRectangle(
                    firstPoint,
                    currentCursorPoint,
                  );
                  const valid = isSelectionValid(
                    rect,
                    mockTerritories,
                    WORLD_SIZE,
                    WORLD_SIZE,
                  );
                  return (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Dimensions</span>
                        <span>
                          {rect.width} × {rect.height}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pixels</span>
                        <span>{formatNumber(rect.width * rect.height)}</span>
                      </div>
                      <div className="flex justify-between text-[#d2ff4d] font-bold text-lg mt-2 pt-2 border-t border-[#d2ff4d]/20">
                        <span>Price</span>
                        <span>
                          $
                          {formatNumber(
                            calculatePrice(rect.width, rect.height),
                          )}
                        </span>
                      </div>
                      {!valid && (
                        <div className="text-[#FAAA48] mt-2 font-bold text-center bg-[#2F0F03] border border-[#FAAA48]/50 py-2 rounded animate-pulse">
                          AREA UNAVAILABLE
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {finalSelection && (
              <div className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Dimensions</span>
                    <span>
                      {finalSelection.width} × {finalSelection.height}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pixels</span>
                    <span>
                      {formatNumber(
                        finalSelection.width * finalSelection.height,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#d2ff4d] font-bold text-lg mt-2 pt-2 border-t border-[#d2ff4d]/20">
                    <span>Price</span>
                    <span>
                      $
                      {formatNumber(
                        calculatePrice(
                          finalSelection.width,
                          finalSelection.height,
                        ),
                      )}
                    </span>
                  </div>
                </div>

                <button className="w-full py-3 bg-[#d2ff4d] text-[#10130f] font-bold rounded hover:bg-[#e3ff8a] transition-colors font-heading text-lg">
                  CONTINUE
                </button>
                <button
                  onClick={cancelSelection}
                  className="w-full py-3 bg-[#d2ff4d] text-[#10130f] font-bold rounded hover:bg-[#e3ff8a] transition-colors font-heading text-lg"
                >
                  Cancel Selection
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
