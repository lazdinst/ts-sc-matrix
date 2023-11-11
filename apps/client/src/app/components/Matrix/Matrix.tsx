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

const Matrix: React.FC = () => {
  const canvas1Ref = useRef<HTMLCanvasElement | null>(null);
  const canvas2Ref = useRef<HTMLCanvasElement | null>(null);
  const [pointMatrix, setPointMatrix] = useState<MatrixLetter[]>([]);
  const requestRef = useRef<number | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [maxColumns, setMaxColumns] = useState<number>(0);

  const getCanvasContext = () => {
    const letterTrailCanvas = canvas1Ref.current;
    const letterTrailCanvasContext = letterTrailCanvas?.getContext('2d');
    const letterCanvas = canvas2Ref.current;
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
    const letterTrailCanvas = canvas1Ref.current as HTMLCanvasElement | null;
    const letterCanvas = canvas2Ref.current as HTMLCanvasElement | null;

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

      while (i--) {
        pointMatrix[i].draw(
          letterTrailCanvasContext!,
          letterCanvasContext!,
          canvasHeight
        );
      }
    }

    requestRef.current = requestAnimationFrame(() =>
      updatePointMatrix(letterTrailCanvasContext, letterCanvasContext)
    );
  };

  useEffect(() => {
    const { letterTrailCanvas, letterCanvas } = getCanvas();

    // set canvas width and height
    setCanvasWidth(window.innerWidth);
    setCanvasHeight(window.innerHeight);
    setMaxColumns(window.innerWidth / fontSize);

    const pointMatrix = generatePointMatrix(window.innerWidth);
    setPointMatrix(pointMatrix);

    // if (letterTrailCanvas && letterCanvas) {
    //   console.log('intialize canvas', canvasWidth, canvasHeight);
    //   intializeCanvas(letterTrailCanvas, canvasWidth, canvasHeight);
    //   intializeCanvas(letterCanvas, canvasWidth, canvasHeight);
    // }
  }, [setPointMatrix]);

  useEffect(() => {
    const { letterTrailCanvas, letterCanvas } = getCanvas();

    if (letterTrailCanvas && letterCanvas) {
      console.log('intialize canvas', canvasWidth, canvasHeight);
      intializeCanvas(letterTrailCanvas, window.innerWidth, canvasHeight);
      intializeCanvas(letterCanvas, window.innerWidth, canvasHeight);
    }
  }, [canvasWidth, canvasHeight]);

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
      <MatrixCanvasComponent ref={canvas1Ref}>
        Canvas is not supported in your browser.
      </MatrixCanvasComponent>
      <MatrixCanvasComponent ref={canvas2Ref}>
        Canvas is not supported in your browser.
      </MatrixCanvasComponent>
    </MatrixContainer>
  );
};

export default Matrix;
