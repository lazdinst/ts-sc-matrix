import { randomFloat, randomInt } from './utils';
import settings from './settings';
import data from './data';

const letterColors = {};

class MatrixLetter {
  private column: number;
  private verticalPostion: number;
  private letter = '';
  private boost = false;
  private speed = 0;
  private letterCanvasContext: CanvasRenderingContext2D | null | undefined;
  private letterTrailCanvasContext: CanvasRenderingContext2D | null | undefined;
  private canvasHeight: number;

  constructor(
    column: number,
    canvasHeight: number,
    verticalPostion: number,
    letterCanvasContext: CanvasRenderingContext2D,
    letterTrailCanvasContext: CanvasRenderingContext2D
  ) {
    this.column = column;
    this.canvasHeight = canvasHeight;
    this.verticalPostion = verticalPostion;
    this.letterCanvasContext = letterCanvasContext;
    this.letterTrailCanvasContext = letterTrailCanvasContext;

    // TODO working on this boosting feature
    this.boost = randomFloat(0.1, 10) > 9.9;
    console.log(this.boost);
  }

  private setCanvasMatrix() {
    console.log('setCanvasMatrix');
  }

  private getRandomLetter() {
    this.letter = data[randomInt(0, data.length - 1)].toUpperCase();
  }

  private resetLetterPosition() {
    this.verticalPostion = randomFloat(
      settings.position.start,
      settings.position.end
    );
    this.speed = randomFloat(settings.speed.min, settings.speed.max);
  }

  private sendLetterToCanvas(canvas: CanvasRenderingContext2D, color?: string) {
    canvas.fillStyle = color ?? 'rgba(255,255,255,1)';
    canvas.font = `${settings.letterSize}px san-serif`;
    canvas.fillText(this.letter, this.column, this.verticalPostion);
  }

  sendLetterTrailToCanvas(canvas: CanvasRenderingContext2D, color?: string) {
    canvas.fillStyle = color ?? '#0F0';
    canvas.font = `${settings.letterSize}px san-serif`;
    canvas.fillText(this.letter, this.column, this.verticalPostion);

    canvas.fillStyle = 'rgba(0,0,0,0.7)';
    canvas.fillRect(
      this.column,
      this.verticalPostion,
      settings.letterSize,
      3 // 3 is the best value for the trail
    );
  }

  // sendRandomBackgroundLetterToCanvas() {

  public draw(boost?: number) {
    this.getRandomLetter();
    this.speed = randomFloat(settings.speed.min, settings.speed.max);
    if (boost) {
      this.speed = boost;
    }

    if (this.letterCanvasContext) {
      this.sendLetterToCanvas(this.letterCanvasContext);
    }

    if (this.letterTrailCanvasContext) {
      this.sendLetterTrailToCanvas(this.letterTrailCanvasContext);
    }

    this.verticalPostion += this.speed;

    if (this.verticalPostion > this.canvasHeight) {
      this.resetLetterPosition();
      this.speed = randomFloat(settings.speed.min, settings.speed.max);
    }
  }

  public drawBackground(boost?: number) {
    this.getRandomLetter();
    this.speed = randomFloat(settings.speed.min, settings.speed.max);
    if (boost) {
      this.speed = boost;
    }

    // if (this.letterCanvasContext) {
    //   this.sendLetterToCanvas(this.letterCanvasContext, 'rgb(0,0,0, 1)');
    // }

    if (this.letterTrailCanvasContext) {
      this.sendLetterTrailToCanvas(this.letterTrailCanvasContext, '#004700');
    }

    this.verticalPostion += this.speed;

    if (this.verticalPostion - (boost ?? 0) > this.canvasHeight) {
      this.resetLetterPosition();
      this.speed = randomFloat(settings.speed.min, settings.speed.max);
    }
  }
}

export default MatrixLetter;
