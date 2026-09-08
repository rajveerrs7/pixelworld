import { calculatePriceCents } from "./pricing";

export function normalizeRectangle(p1, p2) {
  const left = Math.min(p1.x, p2.x);
  const top = Math.min(p1.y, p2.y);
  const right = Math.max(p1.x, p2.x);
  const bottom = Math.max(p1.y, p2.y);
  return { x: left, y: top, width: right - left + 1, height: bottom - top + 1 };
}

export function getRectangleDimensions(rectangle) {
  return {
    width: rectangle.width,
    height: rectangle.height,
    area: rectangle.width * rectangle.height,
  };
}

export function isPointInsideRectangle(point, rectangle) {
  return (
    point.x >= rectangle.x &&
    point.x < rectangle.x + rectangle.width &&
    point.y >= rectangle.y &&
    point.y < rectangle.y + rectangle.height
  );
}

export const isPointInsideTerritory = isPointInsideRectangle;

export function doesRectangleOverlap(rect, territory) {
  return !(
    rect.x + rect.width <= territory.x ||
    rect.x >= territory.x + territory.width ||
    rect.y + rect.height <= territory.y ||
    rect.y >= territory.y + territory.height
  );
}

export const doesRectangleOverlapTerritory = doesRectangleOverlap;

export function getTerritoryAtPoint(point, territories) {
  return territories.find((t) => isPointInsideTerritory(point, t));
}

export function getSelectionRectangle(p1, p2) {
  return normalizeRectangle(p1, p2);
}

export function isSelectionValid(rect, territories, worldWidth, worldHeight) {
  if (!rect || rect.width <= 0 || rect.height <= 0)
    return { valid: false, reason: "ZERO_AREA" };
  if (
    rect.x < 0 ||
    rect.y < 0 ||
    rect.x + rect.width > worldWidth ||
    rect.y + rect.height > worldHeight
  ) {
    return { valid: false, reason: "OUTSIDE_WORLD" };
  }

  for (const territory of territories) {
    if (doesRectangleOverlap(rect, territory)) {
      return { valid: false, reason: "OVERLAPS_OCCUPIED" };
    }
  }

  return { valid: true, reason: null };
}

export function calculatePixelCount(width, height) {
  return width * height;
}

export function calculatePrice(width, height) {
  return calculatePriceCents(width, height);
}

export function clampViewport(
  viewport,
  width,
  height,
  worldWidth,
  worldHeight,
  centerSmall = true,
) {
  const scaledWidth = worldWidth * viewport.scale;
  const scaledHeight = worldHeight * viewport.scale;
  const x =
    scaledWidth <= width && centerSmall
      ? (width - scaledWidth) / 2
      : scaledWidth <= width
        ? viewport.x
        : Math.min(0, Math.max(width - scaledWidth, viewport.x));
  const y =
    scaledHeight <= height && centerSmall
      ? (height - scaledHeight) / 2
      : scaledHeight <= height
        ? viewport.y
        : Math.min(0, Math.max(height - scaledHeight, viewport.y));
  return { ...viewport, x, y };
}
