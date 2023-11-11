import { randomFloat, randomInt } from './utils';
import settings from './settings';
import data from './data';
import { set } from 'mongoose';

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
    height: number
  ) {
    this.letter = data[randomInt(0, data.length - 1)].toUpperCase();
    this.speed = randomFloat(settings.speed.min, settings.speed.max);

    // const count = 10;
    // for (let i = 0; i < count; i++) {
    //   const letter = data[randomInt(0, data.length - 1)].toUpperCase();
    //   letterCanvas.fillStyle = `rgba(255,255,255,${i / count})`;
    //   letterCanvas.font = `${settings.letterSize}px san-serif`;
    //   letterCanvas.fillText(
    //     letter,
    //     this.column,
    //     this.verticalPostion - settings.letterSize
    //   );
    // }

    letterCanvas.fillStyle = 'rgba(255,255,255,1)';
    letterCanvas.font = `${settings.letterSize}px san-serif`;
    letterCanvas.fillText(this.letter, this.column, this.verticalPostion);

    letterTrailCanvas.fillStyle = '#0F0';
    letterTrailCanvas.font = `${settings.letterSize}px san-serif`;
    letterTrailCanvas.fillText(this.letter, this.column, this.verticalPostion);

    letterTrailCanvas.fillStyle = 'black';
    letterTrailCanvas.fillRect(
      this.column,
      this.verticalPostion - 175,
      settings.letterSize,
      3 // 3 is the best value for the trail
    );

    this.verticalPostion += this.speed;
    if (this.verticalPostion - 150 > height) {
      this.verticalPostion = randomFloat(
        settings.position.start,
        settings.position.end
      );

      letterTrailCanvas.fillStyle = '#000';
      letterTrailCanvas.fillRect(
        this.column,
        0,
        settings.letterSize,
        window.innerHeight
      );
      this.speed = randomFloat(settings.speed.min, settings.speed.max);
    }
  }
}

export default MatrixLetter;
