import React from 'react';
import Canvas from './Canvas'; // Import the Canvas component (placeholder)
import charArr from './charArr';

const MatrixEffect: React.FC = () => {
  return (
    <>
      <Canvas charArr={charArr} fontSize={8} />;
    </>
  );
};

export default MatrixEffect;
