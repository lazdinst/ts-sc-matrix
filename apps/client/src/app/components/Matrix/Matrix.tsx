import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { randomFloat } from './utils';
import MatrixLetter from './MatrixLetter';
import settings from './settings';

const fontSize = 10;

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
// background-color: black;

const Matrix: React.FC = () => {
  const letterTrailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const letterCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [matrixLetters, setMatrixLetters] = useState<MatrixLetter[]>([]);
  const [matrixLettersBackground, setMatrixLettersBackground] = useState<
    MatrixLetter[]
  >([]);
  const requestRef = useRef<number | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight);
  const [maxColumns, setMaxColumns] = useState<number>(
    window.innerWidth / fontSize
  );

  const getCanvasContext = () => {
    const letterTrailCanvas = letterTrailCanvasRef.current;
    const letterTrailCanvasContext = letterTrailCanvas?.getContext('2d');
    const letterCanvas = letterCanvasRef.current;
    const letterCanvasContext = letterCanvas?.getContext('2d');
    return {
      letterCanvasContext,
      letterTrailCanvasContext,
    };
  };

  const setCanvasDimensions = () => {
    const { letterTrailCanvas, letterCanvas } = getCanvasElements();

    if (letterTrailCanvas && letterCanvas) {
      setCanvasWidth(window.innerWidth);
      setCanvasHeight(window.innerHeight);
      setMaxColumns(window.innerWidth / fontSize);

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
  } => {
    const letterTrailCanvas =
      letterTrailCanvasRef.current as HTMLCanvasElement | null;
    const letterCanvas = letterCanvasRef.current as HTMLCanvasElement | null;

    return {
      letterTrailCanvas,
      letterCanvas,
    };
  };

  const generateMatrixLetters = (columnCount: number) => {
    try {
      const matrix: MatrixLetter[] = [];
      const { letterCanvasContext, letterTrailCanvasContext } =
        getCanvasContext();

      if (!letterCanvasContext || !letterTrailCanvasContext) {
        throw new Error('Canvas contexts are not available.');
      }

      const {
        position: { start, end },
      } = settings;

      for (let i = 0; i < columnCount; i++) {
        const column = i * fontSize;
        const randomStartPostion = randomFloat(start, end);

        matrix.push(
          new MatrixLetter(
            column,
            canvasHeight,
            randomStartPostion,
            letterCanvasContext,
            letterTrailCanvasContext
          )
        );
      }

      return matrix;
    } catch (error) {
      console.error('Error in generateMatrixLetters:', error);
      return [];
    }
  };

  const executeLoop = () => {
    clearCanvas();
    if (matrixLetters.length) {
      let i = matrixLetters.length;
      while (i--) {
        matrixLetters[i].draw();
        matrixLettersBackground[i].drawBackground(1000);
      }
    }
    requestRef.current = requestAnimationFrame(() => executeLoop());
  };

  const clearCanvas = () => {
    const { letterCanvasContext, letterTrailCanvasContext } =
      getCanvasContext();

    if (!letterTrailCanvasContext || !letterCanvasContext) {
      throw new Error('Canvas contexts are not available.');
      return;
    }

    letterTrailCanvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
    letterTrailCanvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

    if (letterCanvasContext) {
      letterCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    }
  };

  useEffect(() => {
    const matrix = generateMatrixLetters(maxColumns);
    setMatrixLetters(matrix);
    const matrixBackground = generateMatrixLetters(maxColumns);
    setMatrixLettersBackground(matrixBackground);

    setCanvasDimensions();
  }, [setMatrixLetters, setMatrixLettersBackground, maxColumns]);

  useEffect(() => {
    executeLoop();
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [matrixLetters]);

  return (
    <MatrixContainer>
      <MatrixCanvasComponent ref={letterTrailCanvasRef}>
        Canvas is not supported in your browser.
      </MatrixCanvasComponent>
      <MatrixCanvasComponent ref={letterCanvasRef}>
        Canvas is not supported in your browser.
      </MatrixCanvasComponent>
    </MatrixContainer>
  );
};

export default Matrix;
