import { getSelectionRectangle, isSelectionValid } from "../../lib/geometry";
import { WORLD_SIZE } from "./worldConstants";

export function drawWorld(
  ctx,
  width,
  height,
  viewport,
  territories,
  interaction,
) {
  const { x, y, scale } = viewport;
  const {
    hoveredId,
    externalHoveredId,
    firstPoint,
    currentCursorPoint,
    finalSelection,
  } = interaction;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Dark matrix world background
  ctx.fillStyle = "#0a0c09";
  ctx.fillRect(0, 0, WORLD_SIZE, WORLD_SIZE);

  // Outer Neon Borders
  ctx.strokeStyle = "#10130f";
  ctx.lineWidth = 5 / scale;
  ctx.strokeRect(0, 0, WORLD_SIZE, WORLD_SIZE);

  ctx.strokeStyle = "rgba(210, 255, 77, 0.4)";
  ctx.lineWidth = 2 / scale;
  ctx.strokeRect(
    2 / scale,
    2 / scale,
    WORLD_SIZE - 4 / scale,
    WORLD_SIZE - 4 / scale,
  );

  // Pixel Grid Lines (Visible when zoomed in)
  if (scale > 4) {
    ctx.strokeStyle = "rgba(210, 255, 77, 0.08)";
    ctx.lineWidth = 1 / scale;

    const startX = Math.max(0, Math.floor(-x / scale));
    const endX = Math.min(WORLD_SIZE, Math.ceil((width - x) / scale));
    const startY = Math.max(0, Math.floor(-y / scale));
    const endY = Math.min(WORLD_SIZE, Math.ceil((height - y) / scale));

    ctx.beginPath();
    for (let gridX = startX; gridX <= endX; gridX += 1) {
      ctx.moveTo(gridX, startY);
      ctx.lineTo(gridX, endY);
    }
    for (let gridY = startY; gridY <= endY; gridY += 1) {
      ctx.moveTo(startX, gridY);
      ctx.lineTo(endX, gridY);
    }
    ctx.stroke();
  }

  // Draw Claimed Territories
  const activeHoverId = externalHoveredId ?? hoveredId;
  for (const territory of territories) {
    const isHovered = activeHoverId === territory.id;

    ctx.fillStyle = isHovered ? "#ffffff" : "rgba(210, 255, 77, 0.7)";
    ctx.fillRect(territory.x, territory.y, territory.width, territory.height);

    ctx.strokeStyle = isHovered ? "#d2ff4d" : "rgba(10, 12, 9, 0.8)";
    ctx.lineWidth = 1.5 / scale;
    ctx.strokeRect(territory.x, territory.y, territory.width, territory.height);
  }

  // Active Selection Drag Preview
  // Active Selection Drag Preview
  if (firstPoint && currentCursorPoint && !finalSelection) {
    const rect = getSelectionRectangle(firstPoint, currentCursorPoint);
    const valid = isSelectionValid(
      rect,
      territories,
      WORLD_SIZE,
      WORLD_SIZE,
    ).valid;

    // Safe non-zero width and height
    const rectW = Math.max(1, rect.width);
    const rectH = Math.max(1, rect.height);

    ctx.fillStyle = valid
      ? "rgba(210, 255, 77, 0.25)"
      : "rgba(250, 170, 72, 0.25)";
    ctx.strokeStyle = valid ? "#d2ff4d" : "#FAAA48";

    ctx.lineWidth = 1 / scale;
    ctx.setLineDash(valid ? [4 / scale, 2 / scale] : []);

    ctx.fillRect(rect.x, rect.y, rectW, rectH);
    ctx.strokeRect(rect.x, rect.y, rectW, rectH);
    ctx.setLineDash([]);

    // Anchor Pin Point
    ctx.fillStyle = "#d2ff4d";
    ctx.fillRect(firstPoint.x, firstPoint.y, 1, 1);
  }

  // Locked Final Selection
  if (finalSelection) {
    ctx.fillStyle = "rgba(210, 255, 77, 0.35)";
    ctx.strokeStyle = "#d2ff4d";

    // Reduced stroke width
    ctx.lineWidth = 1.5 / scale;
    ctx.setLineDash([6 / scale, 3 / scale]);

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
    ctx.setLineDash([]);
  }

  ctx.restore();
}
