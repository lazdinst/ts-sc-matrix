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
  private letterCanvas: CanvasRenderingContext2D | null | undefined;
  private letterTrailCanvas: CanvasRenderingContext2D | null | undefined;

  constructor(
    column: number,
    verticalPostion: number
    // letterCanvas: CanvasRenderingContext2D,
    // letterTrailCanvas: CanvasRenderingContext2D
  ) {
    this.column = column;
    this.verticalPostion = verticalPostion;

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

  // private sendLetterToCanvas() {
  //   letterCanvas.fillStyle = 'rgba(255,255,255,1)';
  //   letterCanvas.font = `${settings.letterSize}px san-serif`;
  //   letterCanvas.fillText(this.letter, this.column, this.verticalPostion);
  // }

  // sendLetterTrailToCanvas() {

  // sendRandomBackgroundLetterToCanvas() {

  public draw(
    letterTrailCanvas: CanvasRenderingContext2D,
    letterCanvas: CanvasRenderingContext2D,
    height: number
  ) {
    this.getRandomLetter();
    this.speed = randomFloat(settings.speed.min, settings.speed.max);

    letterCanvas.fillStyle = 'rgba(255,255,255,1)';
    letterCanvas.font = `${settings.letterSize}px san-serif`;
    letterCanvas.fillText(this.letter, this.column, this.verticalPostion);

    letterTrailCanvas.fillStyle = '#0F0';
    letterTrailCanvas.font = `${settings.letterSize}px san-serif`;
    letterTrailCanvas.fillText(this.letter, this.column, this.verticalPostion);

    letterTrailCanvas.fillStyle = 'rgba(0,0,0,0.7)';
    letterTrailCanvas.fillRect(
      this.column,
      this.verticalPostion - 100,
      settings.letterSize,
      3 // 3 is the best value for the trail
    );

    this.verticalPostion += this.speed;

    if (this.verticalPostion - 100 > height) {
      this.resetLetterPosition();
      this.speed = randomFloat(settings.speed.min, settings.speed.max);
    }
  }
}

export default MatrixLetter;
