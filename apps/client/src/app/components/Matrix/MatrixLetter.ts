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
  private letterTrailLength = 20;
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
    context.shadowColor = settings.letterColor;
    context.shadowBlur = 5;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    context.fillStyle = color ?? settings.letterColor;
    context.font = `${settings.letterSize}px ${settings.font}`;
    context.fillText(letter, this.column, this.verticalPostion);

    // Reset the shadow properties (optional)
    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
  }

  private sendLetterTrailToCanvas(
    letters: string[],
    context: CanvasRenderingContext2D,
    color?: string
  ) {
    context.font = `${settings.letterSize}px ${settings.font}`;

    letters.forEach((letter, index) => {
      if (index > 0) {
        const isRandomLetterChange = randomFloat(0, 1) > 0.99;
        if (isRandomLetterChange) {
          letters[index] = this.getRandomLetter();
        }

        // Calculate the lightness based on the index within the desired range (50% to 100%)
        const minLightness = 50;
        const maxLightness = 100;
        const letterOpacity = (letters.length - index) / letters.length;
        const lightness =
          minLightness + (maxLightness - minLightness) * letterOpacity;

        const fillStyle = `hsl(152, 100%, ${lightness}%)`;

        context.shadowColor = '#0f0';
        context.shadowBlur = 5;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        // Use the calculated lightness in the HSL color
        context.fillStyle = fillStyle;

        context.fillText(
          letters[index],
          this.column,
          this.verticalPostion - index * settings.letterSize
        );

        // Reset the shadow properties (optional)
        context.shadowColor = 'transparent';
        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
      }
    });
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
    // this.clearLetterCanvas();

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
