import React, { useEffect, useRef, useState } from 'react';
import Point from './Point'; // Import the Point component you created
import { randomFloat } from './utils';
import styled from 'styled-components';
import { get } from 'http';

const CanvasContainer = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
`;

const CanvasComponent = styled.canvas`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
`;

interface CanvasProps {
  ctx1: CanvasRenderingContext2D | null;
  cxtx2: CanvasRenderingContext2D | null;
  charArr: string[];
  fontSize: number;
}

const Canvas: React.FC<CanvasProps> = ({ charArr, fontSize }) => {
  const canvas1Ref = useRef<HTMLCanvasElement | null>(null);
  const canvas2Ref = useRef<HTMLCanvasElement | null>(null);
  const [pointMatrix, setPointMatrix] = useState<Point[]>([]);

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
    const matrix: Point[] = [];

    for (let i = 0; i < maxColums; i++) {
      matrix.push(new Point(i * fontSize, randomFloat(-500, 0)));
    }

    return matrix;
  };

  const clearPointMatrix = (
    ctx1: CanvasRenderingContext2D | null | undefined,
    ctx2: CanvasRenderingContext2D | null | undefined
  ) => {
    if (!ctx1 || !ctx2) {
      console.log("Can't clear. No context");
      return;
    }

    ctx1.fillStyle = 'rgba(0,0,0,0.05)';
    ctx1.fillRect(0, 0, cw, ch);

    if (ctx2) {
      ctx2.clearRect(0, 0, cw, ch);
    }
    console.log('Cleared');
  };

  const updatePointMatrix = (
    ctx1: CanvasRenderingContext2D | null | undefined,
    ctx2: CanvasRenderingContext2D | null | undefined
  ) => {
    clearPointMatrix(ctx1, ctx2);

    let i = pointMatrix.length;

    while (i--) {
      pointMatrix[i].draw(ctx1!, ctx2!, charArr, fontSize, ch);
    }

    requestAnimationFrame(() => updatePointMatrix(ctx1, ctx2));
  };

  useEffect(() => {
    const { ctx1, ctx2 } = getCanvasContext();
    const { canvas1, canvas2 } = getCanvas();

    const pointMatrix = generatePointMatrix();
    setPointMatrix(pointMatrix);

    if (canvas1 && canvas2) {
      intializeCanvas(canvas1, canvas2);
    }

    clearPointMatrix(ctx1, ctx2);
    updatePointMatrix(ctx1, ctx2);
    console.log(ctx1, ctx2);
  }, [setPointMatrix]);

  return (
    <CanvasContainer>
      <CanvasComponent ref={canvas1Ref}>
        Canvas is not supported in your browser.
      </CanvasComponent>
      <CanvasComponent ref={canvas2Ref}>
        Canvas is not supported in your browser.
      </CanvasComponent>
    </CanvasContainer>
  );
};

export default Canvas;
