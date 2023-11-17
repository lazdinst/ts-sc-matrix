import React, { ReactNode } from 'react';
import styled from 'styled-components';
import MatrixLetter from './MatrixLetter';
import { fps, letterSize } from './settings';

const nextFrame = 1000 / fps;
let lastTime = 0;
let timer = 0;

const MainContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
`;
const MatrixContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
`;

const MatrixCanvasComponent = styled.canvas`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
`;
const ChildredContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 2;
`;

type MatrixProps = {
  children?: ReactNode;
};

type FrameRateCallback = () => void;

class MatrixRain extends React.Component<MatrixProps> {
  private letterRef: React.RefObject<HTMLCanvasElement> | null;
  private letterCanvas: HTMLCanvasElement | null;
  private letterContext: CanvasRenderingContext2D | null;
  private letterTrailRef: React.RefObject<HTMLCanvasElement> | null;
  private letterTrailCanvas: HTMLCanvasElement | null;
  private letterTrailContext: CanvasRenderingContext2D | null;
  private backgroundRef: React.RefObject<HTMLCanvasElement> | null;
  private backgroundCanvas: HTMLCanvasElement | null;
  private backgroundContext: CanvasRenderingContext2D | null;

  private requestAnmationRefId: number | null;

  private columnCount: number;
  private matrixLetters: MatrixLetter[];
  private matrixLettersLayer2: MatrixLetter[];
  private matrixBackgroundLetters: MatrixLetter[];
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(props: object) {
    super(props);
    this.state = {};
    this.columnCount = 0;
    this.requestAnmationRefId = 0;
    this.matrixLetters = [];
    this.matrixLettersLayer2 = [];
    this.matrixBackgroundLetters = [];
    this.letterRef = React.createRef();
    this.letterCanvas = null;
    this.letterContext = null;

    this.letterTrailRef = React.createRef();
    this.letterTrailCanvas = null;
    this.letterTrailContext = null;

    this.backgroundRef = React.createRef();
    this.backgroundCanvas = null;
    this.backgroundContext = null;

    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
  }

  initializeMatrix = () => {
    if (!this.letterRef || !this.letterTrailRef || !this.backgroundRef) {
      throw new Error('Canvas refs are not available to initialize matrix.');
    }

    this.letterCanvas = this.getCanvasFromRef(this.letterRef);
    this.letterContext = this.getCanvasContextFromRef(this.letterRef);

    this.letterTrailCanvas = this.getCanvasFromRef(this.letterTrailRef);
    this.letterTrailContext = this.getCanvasContextFromRef(this.letterTrailRef);

    this.backgroundCanvas = this.getCanvasFromRef(this.backgroundRef);
    this.backgroundContext = this.getCanvasContextFromRef(this.backgroundRef);

    if (this.letterCanvas && this.letterTrailCanvas && this.backgroundCanvas) {
      [
        this.letterCanvas,
        this.letterTrailCanvas,
        this.backgroundCanvas,
      ].forEach((canvas) => {
        this.setCanvasDimensions(canvas, this.canvasWidth, this.canvasHeight);
      });
    }

    this.columnCount = this.getColumnCount(this.letterRef);
  };

  getCanvasFromRef = (ref: React.RefObject<HTMLCanvasElement>) => {
    if (!ref.current) {
      throw new Error(`Canvas is not available. ref: ${ref}`);
    }
    const canvas = ref.current as HTMLCanvasElement | null;
    return canvas;
  };

  getCanvasContextFromRef = (ref: React.RefObject<HTMLCanvasElement>) => {
    const canvas = this.getCanvasFromRef(ref) as HTMLCanvasElement | null;
    if (!canvas) {
      throw new Error(`Canvas is not available for context. ref: ${ref}`);
    }
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    return ctx;
  };

  setCanvasDimensions = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ) => {
    if (!canvas || !width || !height) {
      throw new Error('Canvas is not available to set dimensions.');
    }
    canvas.setAttribute('width', width.toString());
    canvas.setAttribute('height', height.toString());
  };

  getColumnCount = (ref: React.RefObject<HTMLCanvasElement>) => {
    const canvas = this.getCanvasFromRef(ref);
    if (!canvas) {
      throw new Error('Canvas is not available to set drop columns.');
    }
    return canvas.width / letterSize;
  };

  clearCanvasByRef = (ref: React.RefObject<HTMLCanvasElement>) => {
    const canvas = this.getCanvasFromRef(ref);
    if (!canvas) {
      throw new Error('Canvas is not available to clear.');
    }
    const ctx = this.getCanvasContextFromRef(ref);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  };

  generateMatrixLetters = (matrix: MatrixLetter[], size?: number) => {
    try {
      if (
        !this.letterContext ||
        !this.letterTrailContext ||
        !this.backgroundContext
      ) {
        throw new Error('Canvas contexts are not available.');
      }

      for (let i = 0; i < this.columnCount; i++) {
        const column = i * letterSize;
        matrix.push(
          new MatrixLetter(
            column,
            this.canvasHeight,
            this.letterContext,
            this.letterTrailContext,
            this.backgroundContext,
            size ? size : letterSize
          )
        );
      }
    } catch (error) {
      console.error('Error in generateMatrixLetters:', error);
      return [];
    }
  };

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

  animate = (timeStamp: DOMHighResTimeStamp) => {
    this.frameRate(timeStamp, () => {
      if (!this.letterRef || !this.letterTrailRef) {
        throw new Error('Canvas ref is not available to clear.');
      }
      this.clearCanvasByRef(this.letterRef);
      // this.clearCanvasByRef(this.letterTrailRef);
      if (this.matrixLetters.length) {
        let i = this.matrixLetters.length;
        while (i--) {
          this.matrixLetters[i].draw();
          // this.matrixLettersLayer2[i].draw();
          this.matrixBackgroundLetters[i].drawBackground();
        }
      }
    });
    requestAnimationFrame(this.animate);
  };

  componentDidMount(): void {
    this.initializeMatrix();
    this.generateMatrixLetters(this.matrixLetters);
    // this.generateMatrixLetters(this.matrixLettersLayer2, 18);
    this.generateMatrixLetters(this.matrixBackgroundLetters);
    this.animate(0);
  }

  componentWillUnmount(): void {
    if (this.requestAnmationRefId !== null) {
      cancelAnimationFrame(this.requestAnmationRefId);
    }
  }

  render() {
    const { children } = this.props;
    return (
      // Strict order of Canvas components is important for z-index
      <MainContainer>
        <ChildredContainer>{children}</ChildredContainer>
        <MatrixContainer>
          <MatrixCanvasComponent ref={this.backgroundRef}>
            Canvas is not supported in your browser.
          </MatrixCanvasComponent>
          <MatrixCanvasComponent ref={this.letterTrailRef}>
            Canvas is not supported in your browser.
          </MatrixCanvasComponent>
          <MatrixCanvasComponent ref={this.letterRef}>
            Canvas is not supported in your browser.
          </MatrixCanvasComponent>
        </MatrixContainer>
      </MainContainer>
    );
  }
}

export default MatrixRain;
