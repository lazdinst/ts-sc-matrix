import { randomFloat, randomInt } from './utils';
import settings from './settings';
import data from './data';

class MatrixLetter {
  private column: number;
  private verticalPostion: number;
  private letter = '';
  private speed = 0;

  constructor(column: number, verticalPostion: number) {
    this.column = column;
    this.verticalPostion = verticalPostion;
  }

  public draw(
    letterTrailCanvas: CanvasRenderingContext2D,
    letterCanvas: CanvasRenderingContext2D,
    canvasHeight: number
  ) {
    this.letter = data[randomInt(0, data.length - 1)].toUpperCase();
    this.speed = randomFloat(settings.speed.min, settings.speed.max);

    letterCanvas.fillStyle = 'rgba(255,255,255,0.8)';
    letterCanvas.font = `${settings.letterSize}px san-serif`;
    letterCanvas.fillText(this.letter, this.column, this.verticalPostion);

    letterTrailCanvas.fillStyle = '#0F0';
    letterTrailCanvas.font = `${settings.letterSize}px san-serif`;
    letterTrailCanvas.fillText(this.letter, this.column, this.verticalPostion);

    this.verticalPostion += this.speed;
    if (this.verticalPostion > canvasHeight) {
      this.verticalPostion = randomFloat(
        settings.position.start,
        settings.position.end
      );
      this.speed = randomFloat(settings.speed.min, settings.speed.max);
    }
  }
}

export default MatrixLetter;
