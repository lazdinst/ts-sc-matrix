import { randomFloat, randomInt } from './utils';
import settings from './settings';

class Point {
  private x: number;
  private y: number;
  private value = '';
  private speed = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public draw(
    ctx1: CanvasRenderingContext2D,
    ctx2: CanvasRenderingContext2D,
    charArr: string[],
    fontSize: number,
    ch: number
  ) {
    this.value = charArr[randomInt(0, charArr.length - 1)].toUpperCase();
    this.speed = randomFloat(settings.speed.min, settings.speed.max);

    ctx2.fillStyle = 'rgba(255,255,255,0.8)';
    ctx2.font = `${fontSize}px san-serif`;
    ctx2.fillText(this.value, this.x, this.y);

    ctx1.fillStyle = '#0F0';
    ctx1.font = `${fontSize}px san-serif`;
    ctx1.fillText(this.value, this.x, this.y);

    this.y += this.speed;
    console.log(this.y, ch);

    if (this.y > ch) {
      this.y = randomFloat(settings.initial.start, settings.initial.end);
      this.speed = randomFloat(settings.speed.min, settings.speed.max);
    }
  }
}

export default Point;
