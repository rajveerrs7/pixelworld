"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { mockTerritories } from "../data/mockTerritories";
import {
  clampViewport,
  getTerritoryAtPoint,
  getSelectionRectangle,
  isSelectionValid,
} from "../lib/geometry";
import { drawWorld } from "./PixelWorld/CanvasRenderer";
import WorldCanvas from "./PixelWorld/WorldCanvas";
import WorldControls from "./PixelWorld/WorldControls";
import TerritoryTooltip from "./PixelWorld/TerritoryTooltip";
import SelectionPanel from "./PixelWorld/SelectionPanel";
import {
  DRAG_THRESHOLD,
  MAX_ZOOM,
  MIN_ZOOM,
  WORLD_SIZE,
} from "./PixelWorld/worldConstants";

const initialTooltip = { x: 0, y: 0, containerWidth: 0, containerHeight: 0 };

function getInitialViewport(width, height) {
  const scale = Math.max(
    MIN_ZOOM,
    Math.min(width / WORLD_SIZE, height / WORLD_SIZE) * 0.9,
  );
  return {
    x: (width - WORLD_SIZE * scale) / 2,
    y: (height - WORLD_SIZE * scale) / 2,
    scale,
  };
}

export default function PixelWorld({ focusTerritory, externalHoverTerritory }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const viewportRef = useRef({ x: 0, y: 0, scale: 1 });
  const sizeRef = useRef({ width: 0, height: 0 });
  const frameRef = useRef(null);
  const dragRef = useRef(null);
  const externalHoverIdRef = useRef(null);
  const interactionRef = useRef({
    firstPoint: null,
    currentCursorPoint: null,
    finalSelection: null,
    hoveredId: null,
  });
  const [hoveredTerritory, setHoveredTerritory] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(initialTooltip);
  const [selection, setSelection] = useState({
    firstPoint: null,
    currentCursorPoint: null,
    finalSelection: null,
  });

  const requestRender = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const canvas = canvasRef.current;
      const { width, height } = sizeRef.current;
      if (!canvas || !width || !height) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      drawWorld(ctx, width, height, viewportRef.current, mockTerritories, {
        ...interactionRef.current,
        externalHoveredId: externalHoverIdRef.current,
      });
    });
  }, []);

  const setInteraction = useCallback(
    (next) => {
      interactionRef.current = { ...interactionRef.current, ...next };
      requestRender();
    },
    [requestRender],
  );

  useEffect(() => {
    externalHoverIdRef.current = externalHoverTerritory?.id ?? null;
    if (sizeRef.current.width && sizeRef.current.height) requestRender();
  }, [externalHoverTerritory, requestRender]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      sizeRef.current = { width, height };
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (viewportRef.current.x === 0 && viewportRef.current.y === 0)
        viewportRef.current = getInitialViewport(width, height);
      drawWorld(ctx, width, height, viewportRef.current, mockTerritories, {
        ...interactionRef.current,
        externalHoveredId: externalHoverIdRef.current,
      });
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    return () => observer.disconnect();
  }, [requestRender]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!focusTerritory) return;
    const { width, height } = sizeRef.current;
    if (!width || !height) return;
    const targetX = focusTerritory.x + focusTerritory.width / 2;
    const targetY = focusTerritory.y + focusTerritory.height / 2;
    const scale = Math.min(
      MAX_ZOOM,
      Math.max(
        2,
        Math.min(width / focusTerritory.width, height / focusTerritory.height) *
          0.5,
      ),
    );
    viewportRef.current = {
      scale,
      x: width / 2 - targetX * scale,
      y: height / 2 - targetY * scale,
    };
    requestRender();
  }, [focusTerritory, requestRender]);

  const screenToWorld = useCallback((clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const viewport = viewportRef.current;
    return {
      x: Math.floor((clientX - rect.left - viewport.x) / viewport.scale),
      y: Math.floor((clientY - rect.top - viewport.y) / viewport.scale),
    };
  }, []);

  const cancelSelection = useCallback(() => {
    const next = {
      firstPoint: null,
      currentCursorPoint: null,
      finalSelection: null,
    };
    interactionRef.current = { ...interactionRef.current, ...next };
    setSelection(next);
    requestRender();
  }, [requestRender]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") cancelSelection();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cancelSelection]);

  const handlePointerDown = useCallback((event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      moved: false,
    };
  }, []);

  const handlePointerMove = useCallback(
    (event) => {
      const drag = dragRef.current;
      const point = screenToWorld(event.clientX, event.clientY);
      const clamped = {
        x: Math.max(0, Math.min(WORLD_SIZE - 1, point.x)),
        y: Math.max(0, Math.min(WORLD_SIZE - 1, point.y)),
      };
      if (drag) {
        const totalDistance = Math.hypot(
          event.clientX - drag.startX,
          event.clientY - drag.startY,
        );
        if (totalDistance >= DRAG_THRESHOLD) drag.moved = true;
        if (drag.moved) {
          viewportRef.current = clampViewport(
            {
              ...viewportRef.current,
              x: viewportRef.current.x + event.clientX - drag.lastX,
              y: viewportRef.current.y + event.clientY - drag.lastY,
            },
            sizeRef.current.width,
            sizeRef.current.height,
            WORLD_SIZE,
            WORLD_SIZE,
          );
          drag.lastX = event.clientX;
          drag.lastY = event.clientY;
          requestRender();
        }
      }

      const current = interactionRef.current;
      if (current.firstPoint && !current.finalSelection) {
        interactionRef.current = { ...current, currentCursorPoint: clamped };
        setSelection((previous) => ({
          ...previous,
          currentCursorPoint: clamped,
        }));
        requestRender();
        return;
      }
      if (drag?.moved) return;
      const nextTerritory =
        point.x >= 0 &&
        point.x < WORLD_SIZE &&
        point.y >= 0 &&
        point.y < WORLD_SIZE
          ? getTerritoryAtPoint(point, mockTerritories)
          : null;
      if ((nextTerritory?.id ?? null) !== current.hoveredId) {
        setInteraction({ hoveredId: nextTerritory?.id ?? null });
        setHoveredTerritory(nextTerritory);
      }
      if (nextTerritory) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect)
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            containerWidth: rect.width,
            containerHeight: rect.height,
          });
      }
    },
    [requestRender, screenToWorld, setInteraction],
  );

  const handlePointerUp = useCallback(
    (event) => {
      const drag = dragRef.current;
      dragRef.current = null;
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      if (!drag || drag.moved) return;
      const point = screenToWorld(event.clientX, event.clientY);
      if (
        point.x < 0 ||
        point.x >= WORLD_SIZE ||
        point.y < 0 ||
        point.y >= WORLD_SIZE
      )
        return;
      const current = interactionRef.current;
      if (current.finalSelection || getTerritoryAtPoint(point, mockTerritories))
        return;
      if (!current.firstPoint) {
        const next = {
          ...current,
          firstPoint: point,
          currentCursorPoint: point,
        };
        interactionRef.current = next;
        setSelection({
          firstPoint: point,
          currentCursorPoint: point,
          finalSelection: null,
        });
      } else {
        const rectangle = getSelectionRectangle(current.firstPoint, point);
        if (
          isSelectionValid(rectangle, mockTerritories, WORLD_SIZE, WORLD_SIZE)
            .valid
        ) {
          interactionRef.current = {
            ...current,
            firstPoint: null,
            currentCursorPoint: null,
            finalSelection: rectangle,
          };
          setSelection({
            firstPoint: null,
            currentCursorPoint: null,
            finalSelection: rectangle,
          });
        } else {
          interactionRef.current = {
            ...current,
            firstPoint: null,
            currentCursorPoint: null,
          };
          setSelection({
            firstPoint: null,
            currentCursorPoint: null,
            finalSelection: null,
          });
        }
      }
      setInteraction({ hoveredId: null });
      setHoveredTerritory(null);
      requestRender();
    },
    [requestRender, screenToWorld, setInteraction],
  );

  const zoomAt = useCallback(
    (nextScale, focalX, focalY) => {
      const viewport = viewportRef.current;
      const scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextScale));
      const worldX = (focalX - viewport.x) / viewport.scale;
      const worldY = (focalY - viewport.y) / viewport.scale;
      viewportRef.current = clampViewport(
        { scale, x: focalX - worldX * scale, y: focalY - worldY * scale },
        sizeRef.current.width,
        sizeRef.current.height,
        WORLD_SIZE,
        WORLD_SIZE,
        false,
      );
      requestRender();
    },
    [requestRender],
  );

  const handleWheel = useCallback(
    (event) => {
      event.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      zoomAt(
        viewportRef.current.scale * Math.exp(-event.deltaY * 0.002),
        event.clientX - rect.left,
        event.clientY - rect.top,
      );
    },
    [zoomAt],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const resetZoom = useCallback(() => {
    const { width, height } = sizeRef.current;
    if (!width || !height) return;
    viewportRef.current = getInitialViewport(width, height);
    requestRender();
  }, [requestRender]);
  const zoomIn = useCallback(() => {
    const { width, height } = sizeRef.current;
    zoomAt(viewportRef.current.scale * 1.5, width / 2, height / 2);
  }, [zoomAt]);
  const zoomOut = useCallback(() => {
    const { width, height } = sizeRef.current;
    zoomAt(viewportRef.current.scale / 1.5, width / 2, height / 2);
  }, [zoomAt]);

  return (
    <div
      className="relative w-full h-[72vh] min-h-[540px] bg-[#e9e4d6] rounded-[1.25rem] overflow-hidden shadow-2xl border border-[#d2ff4d]/30 box-shadow-glow"
      ref={containerRef}
    >
      <WorldCanvas
        canvasRef={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
      <WorldControls
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetZoom}
      />
      <TerritoryTooltip
        territory={
          hoveredTerritory && !selection.firstPoint ? hoveredTerritory : null
        }
        position={tooltipPos}
      />
      <SelectionPanel
        firstPoint={selection.firstPoint}
        currentCursorPoint={selection.currentCursorPoint}
        finalSelection={selection.finalSelection}
        territories={mockTerritories}
        onCancel={cancelSelection}
      />
    </div>
  );
}
