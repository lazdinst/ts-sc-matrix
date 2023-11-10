import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { randomFloat } from './utils';
import MatrixLetter from './MatrixLetter';
import settings from './settings';
import charArr from './charArr';

const fontSize = 8;

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

  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const maxColums = cw / fontSize;

  const getCanvasContext = () => {
    const canvas1 = canvas1Ref.current;
    const ctx1 = canvas1?.getContext('2d');
    const canvas2 = canvas2Ref.current;
    const ctx2 = canvas2?.getContext('2d');
    return {
      ctx1,
      ctx2,
    };
  };

  const getCanvas = (): {
    canvas1: HTMLCanvasElement | null;
    canvas2: HTMLCanvasElement | null;
  } => {
    const canvas1 = canvas1Ref.current as HTMLCanvasElement | null;
    const canvas2 = canvas2Ref.current as HTMLCanvasElement | null;

    return {
      canvas1,
      canvas2,
    };
  };

  const intializeCanvas = (
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement
  ) => {
    if (canvas1) {
      canvas1.setAttribute('width', cw.toString());
      canvas1.setAttribute('height', ch.toString());
    }
    if (canvas2) {
      canvas2.setAttribute('width', cw.toString());
      canvas2.setAttribute('height', ch.toString());
    }
  };

  const generatePointMatrix = () => {
    const matrix: MatrixLetter[] = [];
    const {
      initial: { start, end },
    } = settings;
    for (let i = 0; i < maxColums; i++) {
      matrix.push(new MatrixLetter(i * fontSize, randomFloat(start, end)));
    }

    return matrix;
  };

  const clearPointMatrix = (
    ctx1: CanvasRenderingContext2D | null | undefined,
    ctx2: CanvasRenderingContext2D | null | undefined
  ) => {
    if (!ctx1 || !ctx2) {
      return;
    }

    ctx1.fillStyle = 'rgba(0,0,0,0.05)';
    ctx1.fillRect(0, 0, cw, ch);

    if (ctx2) {
      ctx2.clearRect(0, 0, cw, ch);
    }
  };

  const updatePointMatrix = (
    ctx1: CanvasRenderingContext2D | null | undefined,
    ctx2: CanvasRenderingContext2D | null | undefined
  ) => {
    clearPointMatrix(ctx1, ctx2);
    if (pointMatrix.length) {
      let i = pointMatrix.length;

      while (i--) {
        pointMatrix[i].draw(ctx1!, ctx2!, charArr, fontSize, ch);
      }
    }

    requestRef.current = requestAnimationFrame(() =>
      updatePointMatrix(ctx1, ctx2)
    );
  };

  useEffect(() => {
    const { canvas1, canvas2 } = getCanvas();
    const pointMatrix = generatePointMatrix();
    setPointMatrix(pointMatrix);

    if (canvas1 && canvas2) {
      intializeCanvas(canvas1, canvas2);
    }
  }, []);

  useEffect(() => {
    const { ctx1, ctx2 } = getCanvasContext();
    updatePointMatrix(ctx1, ctx2);

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
