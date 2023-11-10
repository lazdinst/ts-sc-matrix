function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export { randomInt, randomFloat };
