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

  ctx.fillStyle = "#e9e4d6";
  ctx.fillRect(0, 0, WORLD_SIZE, WORLD_SIZE);

  ctx.strokeStyle = "rgba(16, 19, 15, 0.9)";
  ctx.lineWidth = 5 / scale;
  ctx.strokeRect(0, 0, WORLD_SIZE, WORLD_SIZE);
  ctx.strokeStyle = "rgba(210, 255, 77, 0.95)";
  ctx.lineWidth = 2 / scale;
  ctx.strokeRect(
    3 / scale,
    3 / scale,
    WORLD_SIZE - 6 / scale,
    WORLD_SIZE - 6 / scale,
  );

  if (scale > 5) {
    ctx.strokeStyle = "rgba(16, 19, 15, 0.18)";
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

  const activeHoverId = externalHoveredId ?? hoveredId;
  for (const territory of territories) {
    const isHovered = activeHoverId === territory.id;
    ctx.fillStyle = isHovered ? "#d2ff4d" : "rgba(255, 112, 67, 0.82)";
    ctx.fillRect(territory.x, territory.y, territory.width, territory.height);
    if (isHovered) {
      ctx.strokeStyle = "#10130f";
      ctx.lineWidth = 2 / scale;
      ctx.strokeRect(
        territory.x,
        territory.y,
        territory.width,
        territory.height,
      );
    }
  }

  if (firstPoint && currentCursorPoint && !finalSelection) {
    const rect = getSelectionRectangle(firstPoint, currentCursorPoint);
    const valid = isSelectionValid(
      rect,
      territories,
      WORLD_SIZE,
      WORLD_SIZE,
    ).valid;
    ctx.fillStyle = valid
      ? "rgba(210, 255, 77, 0.75)"
      : "rgba(16, 19, 15, 0.7)";
    ctx.strokeStyle = valid ? "#ff7043" : "#10130f";
    ctx.lineWidth = Math.max(3 / scale, 2);
    ctx.setLineDash(valid ? [8 / scale, 4 / scale] : []);
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    ctx.setLineDash([]);
    ctx.fillStyle = "#10130f";
    ctx.fillRect(firstPoint.x, firstPoint.y, 1, 1);
  }

  if (finalSelection) {
    ctx.fillStyle = "rgba(210, 255, 77, 0.8)";
    ctx.strokeStyle = "#ff7043";
    ctx.lineWidth = Math.max(4 / scale, 2);
    ctx.setLineDash([10 / scale, 5 / scale]);
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
