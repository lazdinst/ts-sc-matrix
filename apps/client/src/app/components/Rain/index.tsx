import React from 'react';

import { Effect } from './Rain';

const fps = 30;
const nextFrame = 1000 / fps;
let lastTime = 0;
let timer = 0;

type FrameRateCallback = () => void;

class MatrixRain extends React.Component {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private effect!: Effect;

  constructor(props: object) {
    super(props);
    this.state = {};
    this.canvasRef = React.createRef();
    this.ctx = this.canvasRef?.current?.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
  }

  componentDidMount(): void {
    const canvas = this.canvasRef.current as HTMLCanvasElement | null;
    this.ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
    if (canvas?.width && canvas?.height && this.ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.effect = new Effect(canvas.width, canvas.height);

      this.animate(0);
    }
  }

  frameRate = (timeStamp: DOMHighResTimeStamp, callBack: FrameRateCallback) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    if (timer > nextFrame) {
      callBack();
      timer = 0;
    } else {
      timer += deltaTime;
    }
  };

  animationEffect = () => {
    const canvas = this.canvasRef.current as HTMLCanvasElement | null;
    if (this.ctx && canvas && this.effect) {
      this.ctx.font = `${this.effect.fontSize}px monospace`;
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);
      this.ctx.fillStyle = `hsl(152, 100%, 50%)`;
      this.effect.symbols.forEach((symbol) => symbol.draw(this.ctx));
    } else {
      throw new Error('Canvas, Context, Effect not found');
    }
  };

  animate = (timeStamp: DOMHighResTimeStamp) => {
    this.frameRate(timeStamp, this.animationEffect);
    requestAnimationFrame(this.animate);
  };

  render() {
    return <canvas id="matrixRain" ref={this.canvasRef}></canvas>;
  }
}

export default MatrixRain;
