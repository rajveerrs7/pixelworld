export function isPointInsideTerritory(point, territory) {
  return (
    point.x >= territory.x &&
    point.x < territory.x + territory.width &&
    point.y >= territory.y &&
    point.y < territory.y + territory.height
  );
}

export function doesRectangleOverlapTerritory(rect, territory) {
  return !(
    rect.x + rect.width <= territory.x ||
    rect.x >= territory.x + territory.width ||
    rect.y + rect.height <= territory.y ||
    rect.y >= territory.y + territory.height
  );
}

export function getTerritoryAtPoint(point, territories) {
  return territories.find((t) => isPointInsideTerritory(point, t));
}

export function getSelectionRectangle(p1, p2) {
  const left = Math.min(p1.x, p2.x);
  const top = Math.min(p1.y, p2.y);
  const right = Math.max(p1.x, p2.x);
  const bottom = Math.max(p1.y, p2.y);

  return {
    x: left,
    y: top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
}

export function isSelectionValid(rect, territories, worldWidth, worldHeight) {
  if (rect.width === 0 || rect.height === 0) return false;
  if (rect.x < 0 || rect.y < 0) return false;
  if (rect.x + rect.width > worldWidth || rect.y + rect.height > worldHeight) return false;

  for (const territory of territories) {
    if (doesRectangleOverlapTerritory(rect, territory)) {
      return false;
    }
  }

  return true;
}

export function calculatePixelCount(width, height) {
  return width * height;
}

export function calculatePrice(width, height) {
  return calculatePixelCount(width, height);
}
