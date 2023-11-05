import React from 'react';
import styled, { keyframes } from 'styled-components';

const fireColor = 'rgb(255, 80, 0)';
const fireColorT = 'rgba(255, 80, 0, 0)';
const dur = '1s';
const blur = '0.03em';
const fireRad = '3em';
const parts = 50;
const partSize = '5em';

const glowing = keyframes`
  from {
    opacity: 0.5;
  }
  50% {
    opacity: 0.9;
  }
  to {
    opacity: 0.5;
  }
`;

const TorchContainer = styled.div`
  position: absolute;
  max-width: 300px;
  margin: 0 0 0 -150px;
  bottom: -200px;
  left: 50%;
`;

const Torch = styled.div`
  background: url(http://acitjazz.com/images/torch.png) no-repeat;
  width: 144px;
  height: 250px;
  position: absolute;
  left: 50%;
  margin: 0 0 0 -72px;
  top: 0;
`;

const Fire = styled.div`
  bottom: 330px;
  left: 0;
  position: absolute;
  font-size: 24px;
  filter: blur(${blur});
  -webkit-filter: blur(${blur});
  margin: 3em auto 0 auto;
  position: relative;
  width: 200px;
  height: 12em;
  &:before {
    animation: ${glowing} 2s linear infinite;
    opacity: 0.5;
    border-radius: 100%;
    box-shadow: 0 0 200px #0a51a0 inset;
    position: absolute;
    left: 50%;
    top: -450px;
    margin: 0 0 0 -350px;
    width: 700px;
    height: 700px;
    content: "";
    background: -webkit-radial-gradient(
      center,
      ellipse cover,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 66%
    );
    background: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 66%
    );
    filter: progid:DXImageTransform.Microsoft.gradient(
        startColorstr="#ffffff",
        endColorstr="#00ffffff",
        GradientType=1
      );
  }
`;

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(0) scale(1);
  }
  25% {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateY(-10em) scale(0);
  }
`;

const Particle = styled.div`
  animation: ${rise} ${dur} ease-in infinite;
  background-image: radial-gradient(${fireColor} 20%, ${fireColorT} 70%);
  border-radius: 50%;
  mix-blend-mode: screen;
  opacity: 0;
  position: absolute;
  bottom: 0;
  width: ${partSize};

  @for $p from 1 through ${parts} {
    &:nth-of-type(#{$p}) {
      animation-delay: ${dur} * random();
      left: calc((100% - ${partSize}) * #{($p - 1)/${parts}});
    }
  }
`;

const TorchAnimation = () => {
  return (
    <TorchContainer>
      <Torch />
      <Fire>
        {Array.from({ length: parts }, (_, index) => (
          <Particle key={index} />
        ))}
      </Fire>
    </TorchContainer>
  );
};

export default TorchAnimation;
