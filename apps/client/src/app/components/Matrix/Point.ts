import { randomFloat, randomInt } from './utils';

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
    this.speed = randomFloat(0.5, 2);

    ctx2.fillStyle = 'rgba(255,255,255,0.8)';
    ctx2.font = `${fontSize}px san-serif`;
    ctx2.fillText(this.value, this.x, this.y);

    ctx1.fillStyle = '#0F0';
    ctx1.font = `${fontSize}px san-serif`;
    ctx1.fillText(this.value, this.x, this.y);

    this.y += this.speed;
    if (this.y > ch) {
      this.y = randomFloat(-100, 0);
      this.speed = randomFloat(2, 5);
    }
  }
}

export default Point;
