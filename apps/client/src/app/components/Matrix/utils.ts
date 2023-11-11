export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
export function intializeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  if (canvas) {
    canvas.setAttribute('width', width.toString());
    canvas.setAttribute('height', height.toString());
  }
  return;
}

export function clearPointMatrix(
  letterTrailCanvasContext: CanvasRenderingContext2D | null | undefined,
  letterCanvasContext: CanvasRenderingContext2D | null | undefined,
  width: number,
  height: number
) {
  if (!letterTrailCanvasContext || !letterCanvasContext) {
    return;
  }

  letterTrailCanvasContext.fillStyle = 'rgba(0, 0, 0, 0.05)';
  letterTrailCanvasContext.fillRect(0, 0, width, height);

  if (letterCanvasContext) {
    letterCanvasContext.clearRect(0, 0, width, height);
  }
}
