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
      letterTrailCanvasContext,
      letterCanvasContext,
    };
  };

  // const setCanvasDimensions = () => {
  //   const { letterTrailCanvas, letterCanvas } = getCanvasElements();
  //   if (letterTrailCanvas && letterCanvas) {
  //     setCanvasWidth(window.innerWidth);
  //     setCanvasHeight(window.innerHeight);
  //     setMaxColumns(window.innerWidth / fontSize);
  //   }
  // };

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

  const clearPointMatrix = (
    letterTrailCanvasContext: CanvasRenderingContext2D | null | undefined,
    letterCanvasContext: CanvasRenderingContext2D | null | undefined,
    width: number,
    height: number
  ) => {
    console.log('clearPointMatrix');
    if (!letterTrailCanvasContext || !letterCanvasContext) {
      return;
    }

    letterTrailCanvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
    letterTrailCanvasContext.fillRect(0, 0, width, height);

    if (letterCanvasContext) {
      letterCanvasContext.clearRect(0, 0, width, height);
    }
  };

  useEffect(() => {
    const { letterTrailCanvas, letterCanvas } = getCanvasElements();

    const matrix = generateMatrixLetters(maxColumns);
    setMatrixLetters(matrix);

    if (letterTrailCanvas && letterCanvas) {
      setCanvasDimensionAttributes(
        letterTrailCanvas,
        window.innerWidth,
        canvasHeight
      );
      setCanvasDimensionAttributes(
        letterCanvas,
        window.innerWidth,
        canvasHeight
      );
    }
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
