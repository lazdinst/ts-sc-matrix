import { randomFloat, randomInt } from './utils';
import settings from './settings';
import data from './data';
import { off } from 'process';

const letterColors = {};

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
  private letterTrailLength = 10;
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

    this.letterTrailLength = 20;
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
    this.boost = randomFloat(0.1, 10) > 9;
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
    context.fillStyle = color ?? 'rgba(255,255,255,1)';
    context.font = `${settings.letterSize}px ${settings.font}`;
    context.fillText(letter, this.column, this.verticalPostion);

    context.shadowColor = 'white';
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 10;
  }

  private sendLetterTrailToCanvas(
    letters: string[],
    canvas: CanvasRenderingContext2D,
    color?: string
  ) {
    canvas.fillStyle = color ?? '#0F0';
    canvas.font = `${settings.letterSize}px ${settings.font}`;

    letters.forEach((letter, index) => {
      const isRandomLetterChange = randomFloat(0, 1) > 0.99;
      if (isRandomLetterChange) {
        letters[index] = this.getRandomLetter();
      }

      canvas.fillStyle = `rgba(0,255,0,${
        (letters.length - index) / letters.length
      })`;
      canvas.fillText(
        letters[index],
        this.column,
        this.verticalPostion - index * settings.letterSize
      );
    });

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

      this.speed = randomFloat(settings.speed.min, settings.speed.max);

      if (this.boost) {
        const boostSpeed = randomInt(1, 5);
        this.speed += boostSpeed;
        console.log(boostSpeed);
      }

      if (this.letterCanvasContext) {
        this.sendLetterToCanvas(this.firstLetter, this.letterCanvasContext);
      }

      if (this.letterTrailCanvasContext) {
        this.sendLetterTrailToCanvas(
          this.letters,
          this.letterTrailCanvasContext,
          '#0F0'
        );
      }
    }

    this.verticalPostion += this.speed;

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
      this.letterTrailCanvasContext.fillStyle = '#003300'; // #004700
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
