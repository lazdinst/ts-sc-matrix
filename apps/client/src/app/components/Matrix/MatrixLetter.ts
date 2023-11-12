import { randomFloat, randomInt } from './utils';
import settings from './settings';
import data from './data';

class MatrixLetter {
  private column: number;
  private verticalPostion: number;
  private firstLetter = '';
  private letters: string[] = [];
  private boost = false;
  private speed = 0;
  private letterCanvasContext: CanvasRenderingContext2D | null | undefined;
  private letterTrailCanvasContext: CanvasRenderingContext2D | null | undefined;
  private canvasHeight: number;
  private offset = settings.letterSize;
  private letterTrailLength = 30;
  private drawDelay = 20; // 20 is the best value for the trail
  private currentDrawDelay = 0;
  private delayedStart = false;

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
    this.getRandomLetter();

    this.offset = this.letterTrailLength * settings.letterSize;

    this.resetBoost();
    this.resetDelayedStart();
  }

  private resetDelayedStart() {
    this.delayedStart = randomFloat(0, 1) > 0.9;
  }

  private setCanvasMatrix() {
    console.log('setCanvasMatrix');
  }

  private getRandomLetter() {
    return data[randomInt(0, data.length - 1)].toUpperCase();
  }

  private resetBoost() {
    this.boost = randomFloat(0.1, 10) > 6;
  }

  private resetLetterPosition() {
    this.verticalPostion = randomFloat(
      settings.position.start,
      settings.position.end
    );
    this.speed = randomFloat(settings.speed.min, settings.speed.max);
  }

  private sendLetterToCanvas(
    letter: string,
    context: CanvasRenderingContext2D,
    color?: string
  ) {
    context.fillStyle = color ?? settings.letterColor;
    context.font = `${settings.letterSize}px ${settings.font}`;
    context.fillText(letter, this.column, this.verticalPostion);

    context.shadowColor = settings.letterColor;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 10;
  }

  private sendLetterTrailToCanvas(
    letters: string[],
    canvas: CanvasRenderingContext2D,
    color?: string
  ) {
    canvas.font = `${settings.letterSize}px ${settings.font}`;
    letters.forEach((letter, index) => {
      const isRandomLetterChange = randomFloat(0, 1) > 0.95;
      if (isRandomLetterChange) {
        letters[index] = this.getRandomLetter();
      }
      const letterOpacity = (letters.length - index) / letters.length;
      // hsl(152 100% 50% / 0.5)

      canvas.fillStyle = `rgba(0,255, 136,${letterOpacity})`;
      canvas.fillText(
        letters[index],
        this.column,
        this.verticalPostion - index * settings.letterSize
      );
    });

    // canvas.fillStyle = 'rgba(0,0,0,0.7)';
    // canvas.fillRect(
    //   this.column,
    //   this.verticalPostion,
    //   settings.letterSize,
    //   3 // 3 is the best value for the trail
    // );
  }

  // sendRandomBackgroundLetterToCanvas() {

  private clearLetterCanvas() {
    if (!this.letterTrailCanvasContext || !this.letterCanvasContext) {
      throw new Error('Canvas contexts are not available.');
      return;
    }

    this.letterTrailCanvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.letterTrailCanvasContext.fillRect(
      this.column,
      this.verticalPostion,
      64,
      this.canvasHeight
    );
  }

  public draw(boost?: number) {
    if (!this.delayedStart) {
      if (this.currentDrawDelay > this.drawDelay) {
        this.firstLetter = this.getRandomLetter();
        this.currentDrawDelay = 0;

        // Build the Letter Trail
        this.letters.unshift(this.firstLetter);
        if (this.letters.length > this.letterTrailLength) {
          this.letters.pop();
        }
      }
      this.currentDrawDelay++;

      // this makes a bad blur
      // this.speed = randomFloat(settings.speed.min, settings.speed.max);

      if (this.boost) {
        const boostSpeed = randomInt(1, 2);
        this.speed += boostSpeed;
        console.log(boostSpeed);
      }

      if (this.letterCanvasContext) {
        this.sendLetterToCanvas(this.firstLetter, this.letterCanvasContext);
      }

      if (this.letterTrailCanvasContext) {
        this.sendLetterTrailToCanvas(
          this.letters,
          this.letterTrailCanvasContext
        );
      }
    }

    this.verticalPostion += this.speed;
    this.clearLetterCanvas();
    if (this.verticalPostion - this.offset > this.canvasHeight) {
      this.resetLetterPosition();
      this.resetDelayedStart();
      this.resetBoost();
    }
  }

  public drawBackground(boost?: number) {
    const letter = this.getRandomLetter();
    this.speed = randomFloat(settings.speed.min, settings.speed.max);
    if (boost) {
      this.speed = boost;
    }

    if (this.letterTrailCanvasContext) {
      this.letterTrailCanvasContext.fillStyle =
        settings.maxtrixBackgroundLetters;
      this.letterTrailCanvasContext.font = `${settings.letterSize}px ${settings.font}`;
      this.letterTrailCanvasContext.fillText(
        letter,
        this.column,
        this.verticalPostion - settings.letterSize
      );
    }

    this.verticalPostion += this.speed;

    if (this.verticalPostion - (boost ?? 0) > this.canvasHeight) {
      this.resetLetterPosition();
      this.speed = randomFloat(settings.speed.min, settings.speed.max);
    }
  }
}

export default MatrixLetter;
