import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { randomFloat, setCanvasDimensions, clearPointMatrix } from './utils';
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
  const requestRef = useRef<number | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [maxColumns, setMaxColumns] = useState<number>(0);

  const getCanvasContext = () => {
    const letterTrailCanvas = letterTrailCanvasRef.current;
    const letterTrailCanvasContext = letterTrailCanvas?.getContext('2d');
    const letterCanvas = letterCanvasRef.current;
    const letterCanvasContext = letterCanvas?.getContext('2d');
    return {
      letterTrailCanvasContext,
      letterCanvasContext,
    };
  };

  const getCanvas = (): {
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
    const matrix: MatrixLetter[] = [];
    const {
      position: { start, end },
    } = settings;
    for (let i = 0; i < columnCount; i++) {
      const column = i * fontSize;
      const randomStartPostion = randomFloat(start, end);
      matrix.push(new MatrixLetter(column, randomStartPostion));
    }

    return matrix;
  };

  const updatePointMatrix = (
    letterTrailCanvasContext: CanvasRenderingContext2D | null | undefined,
    letterCanvasContext: CanvasRenderingContext2D | null | undefined
  ) => {
    clearPointMatrix(
      letterTrailCanvasContext,
      letterCanvasContext,
      canvasWidth,
      canvasHeight
    );
    if (matrixLetters.length) {
      let i = matrixLetters.length;
      if (letterTrailCanvasContext && letterCanvasContext) {
        while (i--) {
          matrixLetters[i].draw(
            letterTrailCanvasContext,
            letterCanvasContext,
            canvasHeight
          );
        }
      }
    }

    requestRef.current = requestAnimationFrame(() =>
      updatePointMatrix(letterTrailCanvasContext, letterCanvasContext)
    );
  };

  useEffect(() => {
    const { letterTrailCanvas, letterCanvas } = getCanvas();
    setCanvasHeight(window.innerHeight);
    setCanvasWidth(window.innerWidth);
    setMaxColumns(window.innerWidth / fontSize);

    if (letterTrailCanvas && letterCanvas) {
      setCanvasDimensions(letterTrailCanvas, window.innerWidth, canvasHeight);
      setCanvasDimensions(letterCanvas, window.innerWidth, canvasHeight);
    }
  }, []);

  useEffect(() => {
    const matrix = generateMatrixLetters(maxColumns);
    setMatrixLetters(matrix);
  }, [setMatrixLetters, maxColumns]);

  useEffect(() => {
    const { letterTrailCanvasContext, letterCanvasContext } =
      getCanvasContext();
    updatePointMatrix(letterTrailCanvasContext, letterCanvasContext);

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
