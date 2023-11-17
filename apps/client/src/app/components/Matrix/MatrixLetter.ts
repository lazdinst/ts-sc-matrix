import { randomFloat, randomInt } from './utils';
import { letterSize, position, letterColor, font, lightness } from './settings';
import data from './data';

class MatrixLetter {
  private column: number;
  private verticalPostion: number;
  private firstLetter = '';
  private letters: string[] = [];
  private fontSize: number;
  private boost = false;
  private boostSpeed = 0;
  private speed = 0;
  private letterContext: CanvasRenderingContext2D | null | undefined;
  private letterTrailContext: CanvasRenderingContext2D | null | undefined;
  private backgroundContext: CanvasRenderingContext2D | null | undefined;
  private canvasHeight: number;
  private offset = letterSize;
  private letterTrailLength = 20;
  private drawDelay = 0; // 20 is the best value for the trail
  private currentDrawDelay = 0;
  private delayedStart = false;

  constructor(
    column: number,
    canvasHeight: number,
    letterContext: CanvasRenderingContext2D,
    letterTrailContext: CanvasRenderingContext2D,
    backgroundContext: CanvasRenderingContext2D,
    fontSize?: number
  ) {
    this.column = column;
    this.canvasHeight = canvasHeight;
    this.verticalPostion = randomFloat(position.start, position.end);
    this.letterContext = letterContext;
    this.letterTrailContext = letterTrailContext;
    this.backgroundContext = backgroundContext;
    this.getRandomLetter();
    this.fontSize = fontSize || letterSize;
    this.offset = this.letterTrailLength * letterSize;

    this.resetBoost();
    this.resetDelayedStart();

    // this.letterContext.textAlign = 'center';
    // this.letterTrailContext.fillStyle = maxtrixBackgroundLetters;
    // this.letterTrailContext.font = `${letterSize}px ${font}`;
    this.letterTrailLength = randomInt(6, 30);
  }

  private resetDelayedStart() {
    this.delayedStart = randomFloat(0, 1) > 0.9;
  }

  private setRandomTrailLength() {
    this.letterTrailLength = randomInt(5, 20);
  }

  private setCanvasMatrix() {
    console.log('setCanvasMatrix');
  }

  private getRandomLetter() {
    return data[randomInt(0, data.length - 1)].toUpperCase();
  }

  private resetBoost() {
    this.boost = false;
    this.boostSpeed = 1;

    if (randomFloat(0.1, 10) > 9) {
      this.boost = true;
      this.boostSpeed = randomInt(2, 4);
    }
  }

  private resetLetterPosition() {
    this.verticalPostion = randomFloat(position.start, position.end);
    // this.speed = letterSize; //randomFloat(speed.min, speed.max);
  }

  private sendLetterToCanvas(
    letter: string,
    context: CanvasRenderingContext2D,
    color?: string
  ) {
    context.shadowColor = letterColor;
    context.shadowBlur = 5;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 5;

    context.textAlign = 'center';
    context.fillStyle = color ?? letterColor;
    context.font = `${this.fontSize}px ${font}`;

    const verticalPostion = this.verticalPostion - this.fontSize;
    context.fillText(letter, this.column, verticalPostion);

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
    context.font = `${this.fontSize}px ${font}`;

    letters.forEach((letter, index) => {
      if (index > 0) {
        const isRandomLetterChange = randomFloat(0, 1) > 0.8;
        if (isRandomLetterChange) {
          letters[index] = this.getRandomLetter();
        }

        // Calculate the lightness
        const minLightness = lightness.low;
        const maxLightness = lightness.high;
        const letterOpacity = (letters.length - index) / letters.length;
        const l = minLightness + (maxLightness - minLightness) * letterOpacity;

        const fillStyle = `hsl(152, 100%, ${l}%)`;
        context.shadowColor = `hsl(152, 100%, ${l}%)`;
        context.shadowBlur = 5;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.fillStyle = fillStyle;
        context.textAlign = 'center';
        const verticalPostion =
          this.verticalPostion - (index + 1) * this.fontSize;
        context.fillText(letters[index], this.column, verticalPostion);

        context.shadowColor = 'transparent';
        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
      }
    });
  }

  // sendRandomBackgroundLetterToCanvas() {

  private clearLetterCanvas() {
    if (!this.letterTrailContext || !this.letterContext) {
      throw new Error('Canvas contexts are not available.');
    }
    this.letterTrailContext.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.letterTrailContext.fillRect(
      this.column,
      this.verticalPostion,
      this.fontSize,
      this.canvasHeight
    );
  }

  public draw(color?: string) {
    // this.clearLetterCanvas();

    // this.ctx.textAlign = 'center';
    // this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    // this.ctx.fillRect(0, 0, canvas.width, canvas.height);

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

      if (this.letterContext) {
        this.sendLetterToCanvas(this.firstLetter, this.letterContext);
      }

      if (this.letterContext) {
        this.sendLetterTrailToCanvas(this.letters, this.letterContext);
      }
    }

    this.verticalPostion =
      this.verticalPostion + this.fontSize * this.boostSpeed;
    this.clearLetterCanvas();

    if (
      this.verticalPostion - this.offset > this.canvasHeight &&
      Math.random() > 0.5
    ) {
      this.resetLetterPosition();
      this.resetDelayedStart();
      this.resetBoost();
      this.setRandomTrailLength();
    }
  }

  public drawBackground(boost?: number) {
    const letter = this.getRandomLetter();

    if (this.letterContext) {
      this.letterContext.fillStyle = 'rgba(0, 255, 0, 0.1)';
      this.letterContext.font = `${this.fontSize}px ${font}`;
      this.letterContext.fillText(
        letter,
        this.column,
        this.verticalPostion - this.fontSize
      );
    }

    this.verticalPostion = randomInt(0, this.canvasHeight);
  }
}

export default MatrixLetter;
