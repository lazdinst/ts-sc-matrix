import React, { useEffect, useRef, useState, ReactNode } from 'react';
import styled from 'styled-components';
import { randomFloat } from './utils';
import MatrixLetter from './MatrixLetter';
import settings from './settings';
import { Timestamp } from 'mongodb';

const fps = settings.fps;
const nextFrame = 1000 / fps;
let lastTime = 0;
let timer = 0;

// const settings.letterSize = 10;
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
// background-color: black;

type MatrixProps = {
  children?: ReactNode;
};

const Matrix: React.FC<MatrixProps> = ({ children }) => {
  const letterTrailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const letterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [matrixLetters, setMatrixLetters] = useState<MatrixLetter[]>([]);
  const [matrixLettersLayer2, setMatrixLettersLayer2] = useState<
    MatrixLetter[]
  >([]);
  const [matrixLettersBackground, setMatrixLettersBackground] = useState<
    MatrixLetter[]
  >([]);
  const requestRef = useRef<number | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);
  const [maxColumns, setMaxColumns] = useState<number>(
    window.innerWidth / settings.letterSize
  );

  const getCanvasContext = () => {
    const letterTrailCanvas = letterTrailCanvasRef.current;
    const letterTrailCanvasContext = letterTrailCanvas?.getContext('2d');
    const letterCanvas = letterCanvasRef.current;
    const letterCanvasContext = letterCanvas?.getContext('2d');

    const backgroundCanvas = backgroundCanvasRef.current;
    const backgroundCanvasContext = backgroundCanvas?.getContext('2d');
    return {
      letterCanvasContext,
      letterTrailCanvasContext,
      backgroundCanvasContext,
    };
  };

  const setCanvasDimensions = () => {
    const { letterTrailCanvas, letterCanvas, backgroundCanvas } =
      getCanvasElements();

    if (letterTrailCanvas && letterCanvas && backgroundCanvas) {
      setCanvasWidth(window.innerWidth);
      setCanvasHeight(window.innerHeight);
      setMaxColumns(window.innerWidth / settings.letterSize);

      setCanvasDimensionAttributes(
        letterTrailCanvas,
        window.innerWidth,
        window.innerHeight
      );
      setCanvasDimensionAttributes(
        letterCanvas,
        window.innerWidth,
        window.innerHeight
      );
      setCanvasDimensionAttributes(
        backgroundCanvas,
        window.innerWidth,
        window.innerHeight
      );
    }
  };

  const setCanvasDimensionAttributes = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ) => {
    if (canvas) {
      canvas.setAttribute('width', width.toString());
      canvas.setAttribute('height', height.toString());
    }
    return;
  };

  const getCanvasElements = (): {
    letterTrailCanvas: HTMLCanvasElement | null;
    letterCanvas: HTMLCanvasElement | null;
    backgroundCanvas: HTMLCanvasElement | null;
  } => {
    const letterTrailCanvas =
      letterTrailCanvasRef.current as HTMLCanvasElement | null;
    const letterCanvas = letterCanvasRef.current as HTMLCanvasElement | null;
    const backgroundCanvas =
      backgroundCanvasRef.current as HTMLCanvasElement | null;

    return {
      letterTrailCanvas,
      letterCanvas,
      backgroundCanvas,
    };
  };

  const generateMatrixLetters = (columnCount: number) => {
    console.log('Genearting Matrix');
    try {
      const matrix: MatrixLetter[] = [];
      const {
        letterCanvasContext,
        letterTrailCanvasContext,
        backgroundCanvasContext,
      } = getCanvasContext();

      if (
        !letterCanvasContext ||
        !letterTrailCanvasContext ||
        !backgroundCanvasContext
      ) {
        throw new Error('Canvas contexts are not available.');
      }

      const {
        position: { start, end },
      } = settings;

      for (let i = 0; i < columnCount; i++) {
        const column = i * settings.letterSize;
        const randomStartPostion = randomFloat(start, end);

        matrix.push(
          new MatrixLetter(
            column,
            canvasHeight,
            randomStartPostion,
            letterCanvasContext,
            letterTrailCanvasContext,
            backgroundCanvasContext
          )
        );
      }

      return matrix;
    } catch (error) {
      console.error('Error in generateMatrixLetters:', error);
      return [];
    }
  };

  type FrameRateCallback = () => void;

  const frameRate = (
    timeStamp: DOMHighResTimeStamp,
    callBack: FrameRateCallback
  ) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    if (timer > nextFrame) {
      callBack();
      timer = 0;
    } else {
      timer += deltaTime;
    }
  };

  const animate = (timeStamp: DOMHighResTimeStamp) => {
    frameRate(timeStamp, () => {
      if (!matrixLetters.length) {
        throw new Error('Matrix letters are not available.');
      }

      clearCanvas();

      let i = matrixLetters.length;
      while (i--) {
        console.log('Drawing');
        matrixLetters[i].draw();
      }
    });
    requestAnimationFrame(animate);
    // if (matrixLetters.length) {
    //   let i = matrixLetters.length;
    //   while (i--) {
    //     matrixLetters[i].draw();
    //     // matrixLettersLayer2[i].draw();
    //     // matrixLettersBackground[i].drawBackground(1000);
    //   }
    // }
    // requestRef.current = requestAnimationFrame((timestamp) => executeLoop());
  };

  const clearCanvas = () => {
    const { letterCanvasContext, letterTrailCanvasContext } =
      getCanvasContext();
    if (!letterTrailCanvasContext || !letterCanvasContext) {
      throw new Error('Canvas contexts are not available.');
      return;
    }
    letterTrailCanvasContext.fillStyle = 'rgba(0, 0, 0, 0.2)';
    letterTrailCanvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
    // if (letterCanvasContext) {
    //   // letterCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    //   letterCanvasContext.fillStyle = 'rgba(0, 0, 0, 0.05)';
    //   letterCanvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
    // }
  };

  useEffect(() => {
    const matrix = generateMatrixLetters(
      window.innerWidth / settings.letterSize
    );
    setMatrixLetters(matrix);

    const matrixLayer2 = generateMatrixLetters(
      window.innerWidth / settings.letterSize
    );
    setMatrixLettersLayer2(matrixLayer2);

    const matrixBackground = generateMatrixLetters(
      window.innerWidth / settings.letterSize
    );
    setMatrixLettersBackground(matrixBackground);

    setCanvasDimensions();
    animate(0);
  }, [
    setMatrixLetters,
    setMatrixLettersLayer2,
    setMatrixLettersBackground,
    maxColumns,
  ]);

  // useEffect(() => {
  //   console.log('Starting animation');
  //   animate(0);
  //   return () => {
  //     if (requestRef.current !== null) {
  //       cancelAnimationFrame(requestRef.current);
  //     }
  //   };
  // }, [matrixLetters, matrixLettersBackground]);

  return (
    <MainContainer>
      <ChildredContainer>{children}</ChildredContainer>
      <MatrixContainer>
        <MatrixCanvasComponent ref={letterTrailCanvasRef}>
          Canvas is not supported in your browser.
        </MatrixCanvasComponent>
        <MatrixCanvasComponent ref={letterCanvasRef}>
          Canvas is not supported in your browser.
        </MatrixCanvasComponent>
        <MatrixCanvasComponent ref={backgroundCanvasRef}>
          Canvas is not supported in your browser.
        </MatrixCanvasComponent>
      </MatrixContainer>
    </MainContainer>
  );
};

export default Matrix;
