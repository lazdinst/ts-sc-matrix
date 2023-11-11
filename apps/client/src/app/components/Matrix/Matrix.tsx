import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { randomFloat, intializeCanvas, clearPointMatrix } from './utils';
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
  const [pointMatrix, setPointMatrix] = useState<MatrixLetter[]>([]);
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

  const generatePointMatrix = (columnCount: number) => {
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
    if (pointMatrix.length) {
      let i = pointMatrix.length;
      if (letterTrailCanvasContext && letterCanvasContext) {
        while (i--) {
          pointMatrix[i].draw(
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
    setCanvasWidth(window.innerWidth);
    setCanvasHeight(window.innerHeight);
    setMaxColumns(window.innerWidth / fontSize);
  }, []);

  useEffect(() => {
    const { letterTrailCanvas, letterCanvas } = getCanvas();
    const pointMatrix = generatePointMatrix(maxColumns);
    setPointMatrix(pointMatrix);

    if (letterTrailCanvas && letterCanvas) {
      intializeCanvas(letterTrailCanvas, window.innerWidth, canvasHeight);
      intializeCanvas(letterCanvas, window.innerWidth, canvasHeight);
    }
  }, [setPointMatrix, canvasWidth, canvasHeight, maxColumns]);

  useEffect(() => {
    const { letterTrailCanvasContext, letterCanvasContext } =
      getCanvasContext();
    updatePointMatrix(letterTrailCanvasContext, letterCanvasContext);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [pointMatrix]);

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
